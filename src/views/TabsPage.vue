<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon :icon="albumsOutline" />
          <ion-label>Álbum</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon :icon="checkmarkCircleOutline" />
          <ion-label>Minhas</ion-label>
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="personOutline" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
import { albumsOutline, checkmarkCircleOutline, personOutline } from 'ionicons/icons';
</script>