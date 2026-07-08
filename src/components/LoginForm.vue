<template>
  <div class="login-container">
    <div class="form-card">
      <div class="logo-section">
        <h1>🏆 Álbum da Copa</h1>
        <p>Colecione todas as figurinhas!</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-field">
          <label>E-mail</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="seu@email.com"
          />
        </div>

        <div class="input-field">
          <label>Senha</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Digite sua senha"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn-primary" :disabled="isSubmitting">
          {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
        </button>

        <button type="button" class="btn-link" @click="$emit('goToRegister')">
          Criar conta
        </button>

        <button type="button" class="btn-link-small" @click="$emit('goToResetPassword')">
          Esqueceu a senha?
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const emit = defineEmits(['loginSuccess', 'goToRegister', 'goToResetPassword']);
const email = ref('');
const password = ref('');
const isSubmitting = ref(false);
const { login, errorMessage } = useAuth();

const handleSubmit = async () => {
  isSubmitting.value = true;
  const success = await login(email.value, password.value);
  isSubmitting.value = false;
  if (success) {
    emit('loginSuccess');
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.form-card {
  width: 100%;
  max-width: 380px;
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 28px;
}

.logo-section h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 6px;
}

.logo-section p {
  font-size: 13px;
  color: #666;
}

.input-field {
  margin-bottom: 16px;
}

.input-field label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 13px;
}

.input-field input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-field input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-link {
  width: 100%;
  padding: 10px;
  background: none;
  border: none;
  color: #667eea;
  font-size: 13px;
  cursor: pointer;
  margin-top: 8px;
}

.btn-link-small {
  width: 100%;
  padding: 8px;
  background: none;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 12px;
  text-align: center;
}
</style>
