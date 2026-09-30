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