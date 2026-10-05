import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode }) => {
  // Verificamos si estamos en producción (ya sea build normal o ssg)
  const isProduction = command === 'build' || mode === 'production';

  return {
    plugins: [
      vue(),
      vueDevTools(),
      VitePWA({
        registerType: 'autoUpdate',
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
              src: 'android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'android-chrome-512x512.png',
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
    // Ajuste seguro del base para producción (GitHub Pages o dominio raíz)
    base: isProduction ? '/inhabi.co/' : '/',
    build: {
      emptyOutDir: true, // Limpia dist de forma segura antes de compilar y evita bloqueos de archivos
    },
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      // Evita que falle al renderizar rutas dinámicas vacías en SSR
      includedRoutes(paths) {
        return ['/', '/cotiza', '/proyectos', '/proyectos/vivienda', '/proyectos/comercial', '/proyectos/institucional'];
      },
    },
  }
})