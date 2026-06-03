<template>
  <ion-page>
    <AppHeader />
    <ion-content class="ion-padding">
      <div class="reset-container"><ResetPasswordForm @reset-sent="handleResetSent" @go-to-login="goToLogin" /></div>
    </ion-content>
    <ion-toast :is-open="showToast" message="E-mail de recuperação enviado!" :duration="3000" @did-dismiss="showToast = false" color="success" />
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonToast } from '@ionic/vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import ResetPasswordForm from '@/components/ResetPasswordForm.vue';

const router = useRouter();
const showToast = ref(false);

const handleResetSent = () => {
  showToast.value = true;
  setTimeout(() => router.push('/login'), 3000);
};
const goToLogin = () => router.push('/login');
</script>

<style scoped>
.reset-container { max-width: 500px; margin: 0 auto; padding-top: 32px; }
</style>