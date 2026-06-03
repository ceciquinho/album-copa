<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>
        <div class="header-title">
          <ion-icon :icon="trophyOutline" />
          <span>Álbum Copa</span>
        </div>
      </ion-title>
      <ion-buttons slot="end" v-if="showLogout">
        <ion-button @click="handleLogout">
          <ion-icon :icon="logOutOutline" slot="icon-only" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/vue';
import { trophyOutline, logOutOutline } from 'ionicons/icons';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const props = defineProps<{
  showLogout?: boolean;
}>();

const router = useRouter();
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>