import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue')
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/ResetPasswordPage.vue')
  },
  {
    path: '/tabs/',
    component: () => import('@/views/TabsPage.vue'),
    children: [
      {
        path: 'tab1',
        name: 'Tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        name: 'Tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        name: 'Tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: 'tab4',
        name: 'Tab4',
        component: () => import('@/views/AchievementsPage.vue')
      },
      {
        path: 'tab5',
        name: 'Tab5',
        component: () => import('@/views/AboutPage.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Guard para rotas protegidas
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_user_id');
  
  if (to.path !== '/login' && to.path !== '/register' && to.path !== '/reset-password') {
    if (!isAuthenticated) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
