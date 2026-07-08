<template>
  <ion-page>
    <AppHeader show-logout />
    <ion-content class="ion-padding">
      <div class="achievements-container">
        <ion-card class="summary-card">
          <ion-card-header>
            <ion-card-title>Conquistas</ion-card-title>
            <ion-card-subtitle>{{ stats.unlocked }} de {{ stats.total }} desbloqueadas</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-progress-bar :value="stats.percentage / 100" />
            <div class="summary-row">
              <ion-badge color="success">{{ stats.unlocked }} desbloqueadas</ion-badge>
              <ion-badge color="medium">{{ stats.locked }} bloqueadas</ion-badge>
              <span>{{ stats.percentage }}%</span>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="isLoading" class="empty-state">
          <ion-spinner />
        </div>

        <div v-else-if="achievements.length === 0" class="empty-state">
          <ion-icon :icon="trophyOutline" size="large" />
          <p>Nenhuma conquista encontrada</p>
        </div>

        <div v-else class="achievements-grid">
          <ion-card
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ locked: !achievement.desbloqueada }"
          >
            <ion-card-content>
              <div class="badge-icon">
                <ion-icon :icon="getAchievementIcon(achievement.icone)" />
              </div>

              <div class="achievement-info">
                <div class="achievement-title-row">
                  <h2>{{ achievement.nome }}</h2>
                  <ion-badge :color="achievement.desbloqueada ? 'success' : 'medium'">
                    {{ achievement.desbloqueada ? 'Desbloqueada' : 'Bloqueada' }}
                  </ion-badge>
                </div>
                <p>{{ achievement.descricao }}</p>
                <div class="unlock-date">
                  {{ achievement.desbloqueada ? formatDate(achievement.data_desbloqueio) : 'Ainda não desbloqueada' }}
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonSpinner,
  onIonViewWillEnter,
} from '@ionic/vue';
import {
  constructOutline,
  diamondOutline,
  flashOutline,
  flagOutline,
  footballOutline,
  medalOutline,
  podiumOutline,
  ribbonOutline,
  sparklesOutline,
  starOutline,
  trophyOutline,
} from 'ionicons/icons';
import AppHeader from '@/components/AppHeader.vue';
import { useAchievements } from '@/composables/useAchievements';

const { achievements, isLoading, stats, refresh } = useAchievements();

const iconMap: Record<string, string> = {
  construct: constructOutline,
  diamond: diamondOutline,
  flash: flashOutline,
  flag: flagOutline,
  football: footballOutline,
  medal: medalOutline,
  podium: podiumOutline,
  ribbon: ribbonOutline,
  sparkles: sparklesOutline,
  star: starOutline,
  trophy: trophyOutline,
};

const getAchievementIcon = (icon: string) => iconMap[icon] ?? trophyOutline;

const formatDate = (date?: string) => {
  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

onIonViewWillEnter(() => {
  refresh();
});
</script>

<style scoped>
.achievements-container {
  max-width: 980px;
  margin: 0 auto;
}

.summary-card {
  margin: 0 0 16px;
}

.summary-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
  color: var(--ion-color-medium);
  font-size: 13px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.achievement-card {
  margin: 0;
  border-left: 4px solid var(--ion-color-success);
}

.achievement-card.locked {
  border-left-color: var(--ion-color-medium);
  opacity: 0.72;
}

.achievement-card ion-card-content {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.badge-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 8px;
  background: var(--ion-color-light);
  color: var(--ion-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.locked .badge-icon {
  color: var(--ion-color-medium);
}

.badge-icon ion-icon {
  font-size: 28px;
}

.achievement-info {
  min-width: 0;
  flex: 1;
}

.achievement-title-row {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  align-items: flex-start;
}

.achievement-title-row h2 {
  margin: 0;
  font-size: 16px;
  line-height: 1.25;
  color: var(--ion-color-dark);
}

.achievement-info p {
  margin: 8px 0;
  color: var(--ion-color-medium);
  font-size: 13px;
  line-height: 1.35;
}

.unlock-date {
  font-size: 12px;
  color: var(--ion-color-medium);
}

.empty-state {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--ion-color-medium);
  text-align: center;
}
</style>
