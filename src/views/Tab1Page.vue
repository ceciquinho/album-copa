<template>
  <ion-page>
    <AppHeader show-logout />
    <ion-content>
      <StickerList />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import AppHeader from '@/components/AppHeader.vue';
import StickerList from '@/components/StickerList.vue';
</script>
