import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import SystemDesignView from '@/views/SystemDesignView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/system-design',
    name: 'system-design',
    component: SystemDesignView,
  },
]

export function createAppRouter() {
  return createRouter({
    // Condicionamos el historial: Memoria para el servidor (SSG) y Web para el cliente
    history: import.meta.env.SSR 
      ? createMemoryHistory(import.meta.env.BASE_URL) 
      : createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  })
}

export default createAppRouter()