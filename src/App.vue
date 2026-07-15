<template>
  <ion-app>

    <ion-router-outlet />

    <jeep-sqlite 
      autoSave="true">
    </jeep-sqlite>

  </ion-app>
</template>


<script setup lang="ts">

import {
  IonApp,
  IonRouterOutlet
} from '@ionic/vue';

import { onMounted } from 'vue';

import { initDatabase } from '@/services/database';


onMounted(async()=>{

  await initDatabase();

});

</script>