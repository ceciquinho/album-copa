<template>
  <ion-card class="sticker-card" :class="{ collected: sticker.collected }">
    <div class="sticker-image">
      <ion-img :src="sticker.photo" />
      <div class="sticker-number">#{{ sticker.number }}</div>
    </div>
    
    <ion-card-header>
      <ion-card-title>{{ sticker.name }}</ion-card-title>
      <ion-card-subtitle>
        <div class="country-badge">
          <ion-icon :icon="flagOutline" />
          {{ sticker.country }}
        </div>
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <ion-button :color="sticker.collected ? 'success' : 'medium'" fill="solid" size="small" @click="$emit('toggle', sticker.id)">
        <ion-icon :icon="sticker.collected ? checkmarkCircle : addCircleOutline" slot="start" />
        {{ sticker.collected ? 'Coletada' : 'Pendente' }}
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, IonButton, IonIcon } from '@ionic/vue';
import { flagOutline, checkmarkCircle, addCircleOutline } from 'ionicons/icons';

defineProps<{ sticker: any }>();
defineEmits<{ (e: 'toggle', id: string): void }>();
</script>

<style scoped>
.sticker-card { height: 100%; display: flex; flex-direction: column; transition: transform 0.2s; }
.sticker-card:hover { transform: translateY(-2px); }
.sticker-card.collected { border-left: 4px solid var(--ion-color-success); }
.sticker-image { position: relative; padding: 16px; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%); border-radius: 8px 8px 0 0; }
.sticker-image ion-img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; }
.sticker-number { position: absolute; top: 8px; right: 8px; background: var(--ion-color-primary); color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
.country-badge { display: flex; align-items: center; gap: 4px; }
</style>