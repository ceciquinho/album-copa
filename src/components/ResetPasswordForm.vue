<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Recuperar Senha</ion-card-title>
      <ion-card-subtitle>Enviaremos um link para redefinir sua senha</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <form @submit.prevent="handleSubmit">
        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input v-model="email" type="email" placeholder="seu@email.com" required />
        </ion-item>

        <ion-text color="danger" v-if="errorMessage">
          <p class="error-text">{{ errorMessage }}</p>
        </ion-text>

        <div class="button-group">
          <ion-button type="submit" expand="block" color="primary" :disabled="!email">
            Enviar e-mail
          </ion-button>
          <ion-button fill="clear" expand="block" @click="$emit('goToLogin')">
            Voltar para o login
          </ion-button>
        </div>
      </form>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/vue';
import { useAuth } from '@/composables/useAuth';

const emit = defineEmits(['resetSent', 'goToLogin']);
const email = ref('');
const { resetPassword, errorMessage } = useAuth();

const handleSubmit = () => {
  if (resetPassword(email.value)) {
    emit('resetSent');
  }
};
</script>

<style scoped>
.error-text { margin: 8px 16px; font-size: 14px; }
.button-group { margin-top: 24px; display: flex; flex-direction: column; gap: 8px; }
</style>