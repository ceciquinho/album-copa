import { computed, ref } from 'vue';
import { createUserStickerRows, getDb, recalculateAchievements, saveDb } from '@/services/database';

const user = ref<any>(null);
const errorMessage = ref('');
let loadPromise: Promise<void> | null = null;

const loadUser = async () => {
  const sessionUserId = localStorage.getItem('auth_user_id');
  if (!sessionUserId) {
    user.value = null;
    return;
  }

  const db = await getDb();
  const result = await db.query('SELECT id, name, email FROM users WHERE id = ?', [sessionUserId]);

  if (result.values?.[0]) {
    user.value = result.values[0];
  } else {
    user.value = null;
    localStorage.removeItem('auth_user_id');
  }
};

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  const ensureLoaded = async () => {
    if (!loadPromise) {
      loadPromise = loadUser();
    }
    await loadPromise;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!name || !email || !password) {
      errorMessage.value = 'Todos os campos são obrigatórios';
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMessage.value = 'E-mail inválido';
      return false;
    }

    if (password.length < 6) {
      errorMessage.value = 'A senha deve ter pelo menos 6 caracteres';
      return false;
    }

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      errorMessage.value = 'A senha deve conter letras e números';
      return false;
    }

    const db = await getDb();
    const existingUser = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.values?.length) {
      errorMessage.value = 'E-mail já cadastrado';
      return false;
    }

    const newUser = {
      id: `${Date.now()}`,
      name,
      email,
      password,
    };

    await db.run(
      'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)',
      [newUser.id, newUser.name, newUser.email, newUser.password, new Date().toISOString()],
    );
    await createUserStickerRows(newUser.id);
    await recalculateAchievements(newUser.id);
    await saveDb();

    user.value = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('auth_user_id', newUser.id);
    errorMessage.value = '';
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      errorMessage.value = 'Preencha todos os campos';
      return false;
    }

    const db = await getDb();
    const result = await db.query(
      'SELECT id, name, email FROM users WHERE email = ? AND password = ?',
      [email, password],
    );
    const foundUser = result.values?.[0];

    if (foundUser) {
      user.value = foundUser;
      localStorage.setItem('auth_user_id', foundUser.id);
      await createUserStickerRows(foundUser.id);
      await recalculateAchievements(foundUser.id);
      errorMessage.value = '';
      return true;
    }

    errorMessage.value = 'E-mail ou senha incorretos';
    return false;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('auth_user_id');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    if (!email) {
      errorMessage.value = 'Digite seu e-mail';
      return false;
    }

    const db = await getDb();
    const result = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (result.values?.length) {
      alert(`E-mail de recuperação enviado para: ${email}`);
      errorMessage.value = '';
      return true;
    }

    errorMessage.value = 'E-mail não encontrado';
    return false;
  };

  ensureLoaded();

  return {
    user,
    isAuthenticated,
    errorMessage,
    ensureLoaded,
    register,
    login,
    logout,
    resetPassword,
  };
}
