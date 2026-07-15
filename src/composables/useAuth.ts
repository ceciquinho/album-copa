import { computed, ref } from 'vue';
import { 
  createUserStickerRows, 
  getDb, 
  recalculateAchievements, 
  saveDb 
} from '@/services/database';

const user = ref<any>(null);
const errorMessage = ref('');

let loadPromise: Promise<void> | null = null;

const getCurrentUserId = () => localStorage.getItem('auth_user_id');

const loadUser = async () => {
  try {
    const sessionUserId = getCurrentUserId();

    if (!sessionUserId) {
      user.value = null;
      return;
    }

    const db = await getDb();

    const result = await db.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [sessionUserId]
    );

    if (result.values?.length) {
      user.value = result.values[0];
    } else {
      user.value = null;
      localStorage.removeItem('auth_user_id');
    }

  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
    user.value = null;
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


  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {

    try {

      errorMessage.value = '';

      if (!name || !email || !password) {
        errorMessage.value = 'Preencha todos os campos';
        return false;
      }


      if (password.length < 6) {
        errorMessage.value = 'Senha precisa ter 6 caracteres';
        return false;
      }


      const db = await getDb();


      const exists = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );


      if (exists.values && exists.values.length > 0) {
        errorMessage.value = 'E-mail já cadastrado';
        return false;
      }



      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
      };



      await db.run(
        `
        INSERT INTO users
        (id,name,email,password,created_at)
        VALUES (?,?,?,?,?)
        `,
        [
          newUser.id,
          newUser.name,
          newUser.email,
          newUser.password,
          new Date().toISOString()
        ]
      );



      await createUserStickerRows(newUser.id);


      await recalculateAchievements(newUser.id);


      await saveDb();



      user.value = {
        id:newUser.id,
        name:newUser.name,
        email:newUser.email
      };


      localStorage.setItem(
        'auth_user_id',
        newUser.id
      );


      return true;



    } catch(error:any){

      console.error(
        "ERRO CADASTRO:",
        error
      );

      errorMessage.value =
        error.message || 
        'Erro ao criar conta';

      return false;
    }

  };





  const login = async (
    email:string,
    password:string
  ):Promise<boolean>=>{

    try{

      const db = await getDb();


      const result = await db.query(
        `
        SELECT id,name,email 
        FROM users 
        WHERE email=? AND password=?
        `,
        [
          email,
          password
        ]
      );


      const found = result.values?.[0];


      if(!found){

        errorMessage.value =
          'Usuário ou senha incorretos';

        return false;

      }


      user.value = found;


      localStorage.setItem(
        'auth_user_id',
        found.id
      );


      await createUserStickerRows(found.id);


      await recalculateAchievements(found.id);


      return true;


    }catch(error:any){

      console.error(error);

      errorMessage.value =
        error.message ||
        'Erro no login';

      return false;

    }

  };




  const logout = ()=>{

    user.value=null;

    localStorage.removeItem(
      'auth_user_id'
    );

  };




  const resetPassword = async(email:string)=>{

    if(!email){

      errorMessage.value=
        'Digite seu email';

      return false;

    }


    return true;

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
    resetPassword
  };

}