<template>
  <div class="register-container">
    <div class="form-card">
      <div class="logo-section">
        <h1>Álbum da Copa</h1>
        <p>Crie sua conta</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="input-field">
          <label>Nome completo</label>
          <input v-model="name" type="text" placeholder="Seu nome" />
        </div>

        <div class="input-field">
          <label>E-mail</label>
          <input v-model="email" type="email" placeholder="seu@email.com" />
        </div>

        <div class="input-field">
          <label>Senha</label>
          <input v-model="password" type="password" placeholder="Digite sua senha" />
        </div>

        <div class="input-field">
          <label>Confirmar senha</label>
          <input v-model="confirmPassword" type="password" placeholder="Confirme sua senha" />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="password && password.length >= 6 && /^(?=.*[A-Za-z])(?=.*\d)/.test(password)" class="success-message">
          Senha forte (letras e números)
        </div>
        <div v-else-if="password && password.length >= 6" class="warning-message">
          Adicione números para uma senha mais forte
        </div>

        <button type="submit" class="btn-primary" :disabled="isSubmitting || !name || !email || !password || password !== confirmPassword">
          {{ isSubmitting ? 'Cadastrando...' : 'Cadastrar' }}
        </button>

        <button type="button" class="btn-link" @click="$emit('goToLogin')">
          Já tenho conta
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

const emit = defineEmits(['registerSuccess', 'goToLogin']);
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);
const { register, errorMessage } = useAuth();

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem';
    return;
  }

  isSubmitting.value = true;
  const success = await register(name.value, email.value, password.value);
  isSubmitting.value = false;

  if (success) {
    emit('registerSuccess');
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.register-container {
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
  padding: 28px 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 24px;
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
  margin-bottom: 14px;
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
  padding: 10px 14px;
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
  padding: 10px;
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
  opacity: 0.6;
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
  margin-top: 4px;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 12px;
  text-align: center;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 12px;
  text-align: center;
}

.warning-message {
  background: #fff3e0;
  color: #ed6c02;
  padding: 8px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 12px;
  text-align: center;
}
</style>
