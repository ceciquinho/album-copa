<template>
  <ion-page>
    <ion-content class="ion-padding">
      <LoginForm 
        @login-success="handleLoginSuccess"
        @go-to-register="goToRegister"
        @go-to-reset-password="goToResetPassword"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/LoginForm.vue';

const router = useRouter();

const handleLoginSuccess = () => {
  router.push('/tabs/tab1');
};

const goToRegister = () => {
  router.push('/register');
};

const goToResetPassword = () => {
  router.push('/reset-password');
};
</script>

<style scoped>
ion-content {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>