import { createApp } from 'vue'
import router  from './router'
import App from './App.vue'
import { reveal } from './directives/reveal'
import { parallax } from './directives/parallax'
import './styles/global.css'
import '@/styles/system-design.css'

const app = createApp(App)
app.use(router)
app.directive('reveal', reveal)
app.directive('parallax', parallax)
app.mount('#app')
