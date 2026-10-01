import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      VitePWA({
        // registerType: 'autoUpdate' descarga la nueva caché silenciosamente en segundo plano
        registerType: 'autoUpdate',
        // Archivos en public/ que deben cachearse explícitamente
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'inhabi-social.jpg'],
        manifest: {
          name: 'Inhabi — Arquitectura e interiorismo',
          short_name: 'Inhabi',
          description: 'Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá.',
          theme_color: '#12110e',
          background_color: '#12110e',
          display: 'standalone',
          icons: [
            {
              src: 'icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: command === 'build' ? '/inhabi.co/' : '/',
  }
})