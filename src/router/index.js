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
  // ✅ Añade esta ruta comodín para redirigir cualquier fallo de la URL base
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]