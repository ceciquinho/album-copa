<template>
  <ion-page>
    <AppHeader show-logout />
    <ion-content class="ion-padding">
      <div class="profile-container">
        <div class="avatar-section">
          <ion-avatar>
            <img src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </ion-avatar>
          <h2>{{ user?.name || 'Usuário' }}</h2>
          <p>{{ user?.email }}</p>
        </div>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Estatísticas</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-number">{{ stats.collected }}</div>
                <div class="stat-label">Figurinhas Coletadas</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ stats.total }}</div>
                <div class="stat-label">Total de Figurinhas</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">{{ stats.percentage }}%</div>
                <div class="stat-label">Completo</div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" color="medium" router-link="/tabs/tab4">
          <ion-icon :icon="informationCircleOutline" slot="start" />
          Sobre o App
        </ion-button>

        <ion-button expand="block" color="danger" @click="handleLogout">
          <ion-icon :icon="logOutOutline" slot="start" />
          Sair da Conta
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonAvatar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from '@ionic/vue';
import { logOutOutline, informationCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import { useAuth } from '@/composables/useAuth';
import { useAlbum } from '@/composables/useAlbum';

const router = useRouter();
const { user, logout } = useAuth();
const { stats } = useAlbum();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}
.avatar-section {
  text-align: center;
  margin-bottom: 24px;
}
.avatar-section ion-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
}
.stat-box {
  padding: 12px;
  background: var(--ion-color-light);
  border-radius: 8px;
}
.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-primary);
}
.stat-label {
  font-size: 12px;
  color: var(--ion-color-medium);
  margin-top: 4px;
}
</style>