<template>
  <ion-page>
    <AppHeader show-logout />
    <ion-content class="ion-padding">
      <div class="about-container">
        <div class="logo-section">
          <ion-icon :icon="trophyOutline" size="large" />
          <h1>Álbum da Copa</h1>
          <p class="version">Versão 1.0.0</p>
        </div>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Sobre o Aplicativo</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>Aplicativo de álbum de figurinhas da Copa do Mundo desenvolvido com Vue.js e Ionic Framework.</p>
            <p class="copyright"> 2026 - Todos os direitos reservados</p>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Links</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-button expand="block" fill="outline" @click="openTermsModal = true">
              <ion-icon :icon="documentTextOutline" slot="start" />
              Termos de Uso
            </ion-button>
            <ion-button expand="block" fill="outline" @click="openPrivacyModal = true">
              <ion-icon :icon="lockClosedOutline" slot="start" />
              Política de Privacidade
            </ion-button>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Desenvolvimento</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Tecnologias:</strong> Vue 3, Ionic Framework, TypeScript, Vue Router</p>
            <p><strong>Aluno:</strong> Lucas Cunha</p>
            <p><strong>Curso:</strong> Codificar aplicações para dispositivos móveis</p>
          </ion-card-content>
        </ion-card>

        <div class="footer">
          <p> 2026 - copia mas nao faz igual</p>
        </div>
      </div>
    </ion-content>

    <!-- Modal Termos de Uso -->
    <ion-modal :is-open="openTermsModal" @did-dismiss="openTermsModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Termos de Uso</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="openTermsModal = false">Fechar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h2>Termos de Uso do Álbum da Copa</h2>
        <p><strong>Última atualização:</strong> 10/06/2024</p>

        <h3>1. Aceitação dos Termos</h3>
        <p>Ao usar este aplicativo, você concorda com estes termos de uso. Se não concordar, não utilize o aplicativo.</p>

        <h3>2. Uso do Aplicativo</h3>
        <p>Este aplicativo é para uso pessoal e não comercial. Você não pode copiar, modificar ou distribuir o conteúdo sem autorização.</p>

        <h3>3. Conta de Usuário</h3>
        <p>Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.</p>

        <h3>4. Figurinhas e Conteúdo</h3>
        <p>As figurinhas são propriedade intelectual da FIFA e dos respectivos jogadores. Este aplicativo é apenas para fins educacionais.</p>

        <h3>5. Limitação de Responsabilidade</h3>
        <p>Não nos responsabilizamos por quaisquer danos decorrentes do uso deste aplicativo.</p>

        <h3>6. Alterações nos Termos</h3>
        <p>Podemos modificar estes termos a qualquer momento. O uso continuado do aplicativo constitui aceitação das alterações.</p>

        <h3>7. Contato</h3>
        <p>Para dúvidas, entre em contato: <strong>suporte@albumcopa.com</strong></p>
      </ion-content>
    </ion-modal>

    <!-- Modal Política de Privacidade -->
    <ion-modal :is-open="openPrivacyModal" @did-dismiss="openPrivacyModal = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Política de Privacidade</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="openPrivacyModal = false">Fechar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h2>Política de Privacidade</h2>
        <p><strong>Última atualização:</strong> 10/06/2024</p>

        <h3>1. Informações Coletadas</h3>
        <p>Coletamos seu nome, e-mail e senha (criptografada) para criar sua conta e autenticar seu acesso.</p>

        <h3>2. Uso das Informações</h3>
        <p>Suas informações são usadas apenas para:</p>
        <ul>
          <li>Criar e gerenciar sua conta</li>
          <li>Salvar seu progresso no álbum</li>
          <li>Melhorar a experiência do usuário</li>
        </ul>

        <h3>3. Armazenamento de Dados</h3>
        <p>Seus dados são armazenados localmente no seu dispositivo (localStorage). Não enviamos seus dados para servidores externos.</p>

        <h3>4. Compartilhamento de Dados</h3>
        <p>Não compartilhamos suas informações com terceiros.</p>

        <h3>5. Segurança</h3>
        <p>Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado.</p>

        <h3>6. Seus Direitos</h3>
        <p>Você pode solicitar exclusão de seus dados a qualquer momento entrando em contato conosco.</p>

        <h3>7. Contato</h3>
        <p>Para questões sobre privacidade: <strong>privacidade@albumcopa.com</strong></p>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/vue';
import { trophyOutline, documentTextOutline, lockClosedOutline } from 'ionicons/icons';
import AppHeader from '@/components/AppHeader.vue';

const openTermsModal = ref(false);
const openPrivacyModal = ref(false);
</script>

<style scoped>
.about-container {
  max-width: 600px;
  margin: 0 auto;
}

.logo-section {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px;
}

.logo-section ion-icon {
  font-size: 64px;
  color: var(--ion-color-primary);
}

.logo-section h1 {
  font-size: 28px;
  margin: 12px 0 8px;
}

.version {
  color: var(--ion-color-medium);
  font-size: 14px;
}

.copyright {
  margin-top: 16px;
  color: var(--ion-color-medium);
  font-size: 12px;
  text-align: center;
}

.footer {
  text-align: center;
  margin-top: 24px;
  color: var(--ion-color-medium);
  font-size: 12px;
}

/* Estilo dos modais */
ion-modal h2 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: var(--ion-color-primary);
}

ion-modal h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

ion-modal p, ion-modal ul {
  margin-bottom: 12px;
  line-height: 1.5;
}

ion-modal ul {
  padding-left: 20px;
}
</style>