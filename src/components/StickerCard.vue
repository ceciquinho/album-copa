<template>
  <ion-card class="sticker-card" :class="{ coletada: sticker.coletada }">
    <div class="sticker-image">
      <img v-if="sticker.foto" :src="sticker.foto" :alt="sticker.nome" class="sticker-img" />
      <div v-else class="sticker-placeholder">
        <ion-icon :icon="personCircleOutline" size="large" />
      </div>
      <div class="sticker-number">#{{ sticker.id }}</div>
      <div class="rarity-badge" :class="sticker.raridade?.toLowerCase()">
        {{ sticker.raridade }}
      </div>
    </div>
    
    <ion-card-header>
      <ion-card-title>{{ sticker.nome }}</ion-card-title>
      <ion-card-subtitle>
        <div class="country-badge">
          <ion-icon :icon="flagOutline" />
          {{ sticker.selecao }}
        </div>
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <ion-button 
        :color="sticker.coletada ? 'success' : 'medium'"
        expand="block"
        size="small"
        @click="$emit('toggle', sticker.id)"
      >
        <ion-icon :icon="sticker.coletada ? checkmarkCircle : addCircleOutline" slot="start" />
        {{ sticker.coletada ? 'Coletada' : 'Pendente' }}
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/vue';
import { flagOutline, checkmarkCircle, addCircleOutline, personCircleOutline } from 'ionicons/icons';

defineProps<{ sticker: any }>();
defineEmits<{ (e: 'toggle', id: number): void }>();
</script>

<style scoped>
.sticker-card {
  margin: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.sticker-card:hover {
  transform: translateY(-3px);
}

.sticker-card.coletada {
  border-left: 4px solid var(--ion-color-success);
}

.sticker-image {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 160px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.sticker-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sticker-placeholder {
  width: 60px;
  height: 60px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticker-placeholder ion-icon {
  font-size: 40px;
  color: white;
}

.sticker-number {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.rarity-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.rarity-badge.comum {
  background: #9e9e9e;
}

.rarity-badge.rara {
  background: #2196f3;
}

.rarity-badge.brilhante {
  background: #ff9800;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.country-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

ion-card-title {
  font-size: 16px;
  font-weight: bold;
}

ion-card-subtitle {
  font-size: 12px;
}

ion-card-content {
  padding-top: 0;
}
</style>