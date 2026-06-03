<template>
  <div class="sticker-list-container">
    <ion-card class="filters-card">
      <ion-card-content>
        <ion-searchbar v-model="searchTerm" placeholder="Pesquisar por jogador ou seleção" :debounce="300" show-clear-button="focus" />
        <div class="filter-buttons">
          <ion-button :color="filter === 'all' ? 'primary' : 'medium'" fill="outline" size="small" @click="filter = 'all'">Todas ({{ stats.total }})</ion-button>
          <ion-button :color="filter === 'collected' ? 'success' : 'medium'" fill="outline" size="small" @click="filter = 'collected'">Coletadas ({{ stats.collected }})</ion-button>
          <ion-button :color="filter === 'pending' ? 'warning' : 'medium'" fill="outline" size="small" @click="filter = 'pending'">Pendentes ({{ stats.pending }})</ion-button>
        </div>
      </ion-card-content>
    </ion-card>

    <ion-card class="stats-card">
      <ion-card-content>
        <div class="stats">
          <div class="stat-item"><div class="stat-value">{{ stats.collected }}</div><div class="stat-label">Coletadas</div></div>
          <div class="stat-divider">/</div>
          <div class="stat-item"><div class="stat-value">{{ stats.total }}</div><div class="stat-label">Total</div></div>
          <div class="stat-progress"><ion-progress-bar :value="stats.percentage / 100" /><div class="stat-percentage">{{ stats.percentage }}%</div></div>
        </div>
      </ion-card-content>
    </ion-card>

    <div v-if="filteredStickers.length === 0" class="empty-state">
      <ion-icon :icon="albumsOutline" size="large" />
      <p>Nenhuma figurinha encontrada</p>
    </div>

    <div v-else v-for="(group, country) in stickersByCountry" :key="country" class="country-group">
      <div class="country-header"><ion-icon :icon="flagOutline" /><h3>{{ country }}</h3><ion-badge>{{ group.filter(s => s.collected).length }}/{{ group.length }}</ion-badge></div>
      <div class="stickers-grid"><StickerCard v-for="sticker in group" :key="sticker.id" :sticker="sticker" @toggle="toggleCollected" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonSearchbar, IonButton, IonProgressBar, IonIcon, IonBadge } from '@ionic/vue';
import { albumsOutline, flagOutline } from 'ionicons/icons';
import StickerCard from './StickerCard.vue';
import { useAlbum } from '@/composables/useAlbum';

const { stats, filter, searchTerm, filteredStickers, stickersByCountry, toggleCollected } = useAlbum();
</script>

<style scoped>
.sticker-list-container { padding: 16px; }
.filters-card, .stats-card { margin-bottom: 16px; }
.filter-buttons { display: flex; gap: 8px; justify-content: center; margin-top: 12px; }
.stats { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.stat-item { text-align: center; }
.stat-value { font-size: 28px; font-weight: bold; color: var(--ion-color-primary); }
.stat-label { font-size: 12px; color: var(--ion-color-medium); }
.stat-divider { font-size: 24px; font-weight: bold; color: var(--ion-color-medium); }
.stat-progress { flex: 1; min-width: 150px; }
.stat-percentage { text-align: center; font-size: 12px; margin-top: 4px; }
.empty-state { text-align: center; padding: 48px; color: var(--ion-color-medium); }
.country-group { margin-bottom: 24px; }
.country-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--ion-color-primary); }
.country-header h3 { margin: 0; flex: 1; }
.stickers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
</style>