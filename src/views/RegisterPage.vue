<template>
  <ion-page>
    <ion-content class="ion-padding">
      <RegisterForm 
        @register-success="handleRegisterSuccess"
        @go-to-login="goToLogin"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import RegisterForm from '@/components/RegisterForm.vue';

const router = useRouter();

const handleRegisterSuccess = () => {
  router.push('/tabs/tab1');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
ion-content {
  --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>