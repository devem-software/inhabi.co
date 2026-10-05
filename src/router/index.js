import HomeView from '@/views/HomeView.vue'
import CotizadorView from '@/views/CotizadorView.vue'

import SystemDesignView from '@/views/SystemDesignView.vue'
import ProyectosView from '@/views/ProyectosView.vue'
import ProyectosDetailView from '@/views/ProyectosDetailView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/cotiza',
    name: 'cotiza',
    component: CotizadorView,
  },
  {
    path: '/system-design',
    name: 'system-design',
    component: SystemDesignView,
  },
  // Listado por categoría (ej: /proyectos/institucional)
  { path: '/proyectos/:categoria?', component: ProyectosView },

  // Detalle del proyecto específico (ej: /proyectos/institucional/platzi)
  { path: '/proyectos/:categoria/:proyecto', component: ProyectosDetailView },
  // ✅ Añade esta ruta comodín para redirigir cualquier fallo de la URL base
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
