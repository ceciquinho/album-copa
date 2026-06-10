<template>
  <div class="sticker-list-container">
    <ion-toolbar>
      <ion-searchbar 
        v-model="searchTerm"
        placeholder="Pesquisar jogador ou seleção"
        :debounce="300"
        show-clear-button="focus"
      />
    </ion-toolbar>

    <ion-segment v-model="filter" mode="md">
      <ion-segment-button value="all">
        <ion-label>Todas ({{ stats.total }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="collected">
        <ion-label>Coletadas ({{ stats.collected }})</ion-label>
      </ion-segment-button>
      <ion-segment-button value="pending">
        <ion-label>Pendentes ({{ stats.pending }})</ion-label>
      </ion-segment-button>
    </ion-segment>

    <ion-card class="stats-card">
      <ion-card-content>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.collected }}</div>
            <div class="stat-label">Coletadas</div>
          </div>
          <div class="stat-divider">/</div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-progress">
            <ion-progress-bar :value="stats.percentage / 100" />
            <div class="stat-percentage">{{ stats.percentage }}% completo</div>
          </div>
        </div>
      </ion-card-content>
    </ion-card>

    <div v-if="filteredStickers.length === 0" class="empty-state">
      <ion-icon :icon="albumsOutline" size="large" />
      <p>Nenhuma figurinha encontrada</p>
    </div>

    <div v-else>
      <div v-for="(group, selecao) in stickersByCountry" :key="selecao" class="country-group">
        <div class="country-header">
          <ion-icon :icon="flagOutline" />
          <h3>{{ selecao }}</h3>
          <ion-badge color="primary">{{ group.filter(s => s.coletada).length }}/{{ group.length }}</ion-badge>
        </div>
        
        <div class="stickers-grid">
          <StickerCard 
            v-for="sticker in group" 
            :key="sticker.id" 
            :sticker="sticker"
            @toggle="toggleCollected"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonSearchbar, IonSegment, IonSegmentButton, IonLabel, IonProgressBar, IonIcon, IonBadge, IonToolbar } from '@ionic/vue';
import { albumsOutline, flagOutline } from 'ionicons/icons';
import StickerCard from './StickerCard.vue';
import { useAlbum } from '@/composables/useAlbum';

const { stats, filter, searchTerm, filteredStickers, stickersByCountry, toggleCollected } = useAlbum();
</script>

<style scoped>
.sticker-list-container {
  padding: 12px;
}

.stats-card {
  margin: 12px 0;
}

.stats {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--ion-color-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--ion-color-medium);
}

.stat-divider {
  font-size: 20px;
  font-weight: bold;
  color: var(--ion-color-medium);
}

.stat-progress {
  flex: 1;
  min-width: 150px;
}

.stat-percentage {
  text-align: center;
  font-size: 12px;
  margin-top: 4px;
  color: var(--ion-color-medium);
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--ion-color-medium);
}

.country-group {
  margin-bottom: 24px;
}

.country-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--ion-color-primary);
}

.country-header h3 {
  margin: 0;
  flex: 1;
  font-size: 18px;
  font-weight: bold;
}

.stickers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

ion-segment {
  margin: 12px 0;
}

ion-card-title {
  font-size: 14px;
}
</style>