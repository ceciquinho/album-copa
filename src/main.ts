import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

import App from './App.vue';
import router from './router';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import './theme/variables.css';

const app = createApp(App);

app.use(IonicVue);
app.use(router);

app.config.compilerOptions.isCustomElement = (tag) => tag === 'jeep-sqlite';

jeepSqlite(window);

router.isReady().then(() => {
  app.mount('#app');
});