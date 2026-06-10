<template>
  <ion-page>
    <AppHeader show-logout />
    <ion-content class="ion-padding">
      <div class="collected-header">
        <h2>Minhas Figurinhas Coletadas</h2>
        <p>Total: {{ collectedStickers.length }} figurinhas</p>
      </div>
      
      <div v-if="collectedStickers.length === 0" class="empty-state">
        <ion-icon :icon="albumsOutline" size="large" />
        <p>Você ainda não tem figurinhas coletadas</p>
        <ion-button router-link="/tabs/tab1">Começar a coletar</ion-button>
      </div>
      
      <div v-else class="stickers-grid">
        <StickerCard 
          v-for="sticker in collectedStickers" 
          :key="sticker.id" 
          :sticker="sticker"
          @toggle="handleToggle"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/vue';
import { albumsOutline } from 'ionicons/icons';
import AppHeader from '@/components/AppHeader.vue';
import StickerCard from '@/components/StickerCard.vue';
import { useAlbum } from '@/composables/useAlbum';

const { stickers, toggleCollected } = useAlbum();

const collectedStickers = computed(() => 
  stickers.value.filter(s => s.coletada === true)
);

const handleToggle = (id: number) => {
  toggleCollected(id);
};
</script>

<style scoped>
.collected-header {
  margin-bottom: 20px;
}
.collected-header h2 {
  margin: 0 0 8px 0;
}
.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--ion-color-medium);
}
.stickers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
</style>