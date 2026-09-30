import { ViteSSG } from 'vite-ssg'
import { createHead } from '@vueuse/head'

import App from './App.vue'
import { routes } from './router'

import '@/styles/global.css'
import '@/styles/system-design.css'

import { reveal } from './directives/reveal'
import { parallax } from './directives/parallax'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, head }) => {
    app.use(createHead())

    app.directive('reveal', reveal)
    app.directive('parallax', parallax)
  },
)