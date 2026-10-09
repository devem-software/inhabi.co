import HomeView from '@/views/HomeView.vue';
import CotizadorView from '@/views/CotizadorView.vue';
import SystemDesignView from '@/views/SystemDesignView.vue';
import ProyectosView from '@/views/ProyectosView.vue';
import ProyectosDetailView from '@/views/ProyectosDetailView.vue';
import ServiciosView from '@/views/ServiciosView.vue';
import ServiciosDisenoView from '@/views/servicios/DisenoView.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Inhabi | Arquitectura, interiorismo y remodelación en Bogotá',
      description: 'Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá. Espacios que se habitan con emoción, en menos de 60 días.',
      image: 'inhabi-home.jpg',
    },
  },
  {
    path: '/cotiza',
    name: 'cotiza',
    component: CotizadorView,
    meta: {
      title: 'Cotiza tu remodelación | Inhabi',
      description: 'Solicita una cotización personalizada para tu proyecto de remodelación en Bogotá. Respuesta en menos de 24 horas hábiles.',
      image: 'inhabi-cotiza.jpg',
    },
  },
  {
    path: '/system-design',
    name: 'system-design',
    component: SystemDesignView,
    meta: {
      title: 'System Design | Inhabi',
      description: 'Diseño de sistemas arquitectónicos y de interiorismo a medida con altos estándares de calidad.',
      image: 'inhabi-system-design.jpg',
    },
  },
  {
    path: '/servicios',
    name: 'servicios',
    component: ServiciosView,
    meta: {
      title: 'Servicios de arquitectura y remodelación | Inhabi',
      description: 'Consulta nuestros servicios de arquitectura, interiorismo y remodelación en Bogotá. Un equipo de profesionales te atenderá.',
      image: 'inhabi-servicios.jpg',
    },
  },
  {
    path: '/servicios/diseno',
    name: 'diseño',
    component: ServiciosDisenoView,
    meta: {
      title: 'Servicios de arquitectura y remodelación | Inhabi',
      description: 'Consulta nuestros servicios de arquitectura, interiorismo y remodelación en Bogotá. Un equipo de profesionales te atenderá.',
      image: 'inhabi-servicios.jpg',
    },
  },
  {
    path: '/proyectos/:categoria?',
    name: 'proyectos',
    component: ProyectosView,
    meta: {
      title: 'Proyectos | Inhabi',
      description: 'Explora nuestro portafolio de proyectos de arquitectura, diseño de interiores y remodelación en Bogotá.',
      image: 'inhabi-proyectos.jpg',
    },
  },
  {
    path: '/proyectos/:categoria/:proyecto',
    name: 'proyecto-detalle',
    component: ProyectosDetailView,
    meta: {
      title: 'Detalle del proyecto | Inhabi',
      description: 'Conoce los detalles, materiales y acabados de este proyecto de remodelación y diseño.',
      image: 'inhabi-proyecto-detalle.jpg', // se sobrescribe en la vista
    },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];