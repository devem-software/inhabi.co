import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
// import { createHead } from "@unhead/vue/client";
import { routes } from './router'
import { reveal } from './directives/reveal'
import { parallax } from './directives/parallax'
import { seo } from '@/data/dataSeo.js'

import '@/styles/app.scss'
import '@/styles/global.css'
import '@/styles/system-design.css'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    concurrency: 2,
    formatting: 'html',
    dir: 'dist',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  },
  ({ app, router, routes, isClient, initialState, head }) => {
    app.directive('reveal', reveal)
    app.directive('parallax', parallax)

    if (isClient) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({ immediate: true })
      })
      router.beforeEach((to, from, next) => {
        // Si la URL que intenta cargar termina en .html
        if (to.path.endsWith('.html')) {
          const cleanPath = to.path.replace(/\.html$/, '')
          next({ path: cleanPath, query: to.query, hash: to.hash, replace: true })
        } else {
          next()
        }
      })
    }
  },
)
