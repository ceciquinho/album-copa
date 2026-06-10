import { ref, computed } from 'vue';

export function useAuth() {
  const user = ref<any>(null);
  const isAuthenticated = computed(() => !!user.value);
  const errorMessage = ref('');

  const loadUser = () => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      user.value = JSON.parse(savedUser);
    }
  };

  const register = (name: string, email: string, password: string): boolean => {
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

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.some((u: any) => u.email === email)) {
      errorMessage.value = 'E-mail já cadastrado';
      return false;
    }

    const newUser = { id: Date.now().toString(), name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    user.value = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('auth_user', JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
    
    errorMessage.value = '';
    return true;
  };

  const login = (email: string, password: string): boolean => {
    if (!email || !password) {
      errorMessage.value = 'Preencha todos os campos';
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      user.value = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      localStorage.setItem('auth_user', JSON.stringify({ id: foundUser.id, name: foundUser.name, email: foundUser.email }));
      errorMessage.value = '';
      return true;
    }

    errorMessage.value = 'E-mail ou senha incorretos';
    return false;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('auth_user');
  };

  const resetPassword = (email: string): boolean => {
    if (!email) {
      errorMessage.value = 'Digite seu e-mail';
      return false;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: any) => u.email === email);

    if (userExists) {
      alert(`E-mail de recuperação enviado para: ${email}`);
      errorMessage.value = '';
      return true;
    }

    errorMessage.value = 'E-mail não encontrado';
    return false;
  };

  loadUser();

  return { user, isAuthenticated, errorMessage, register, login, logout, resetPassword };
}