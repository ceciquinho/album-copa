<template>
  <IonApp>
    <IonRouterOutlet />
  </IonApp>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { initDatabase } from '@/services/database';

onMounted(async () => {
  await initDatabase();
});
</script>