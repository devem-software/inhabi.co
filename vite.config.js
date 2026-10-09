import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig(({ command, mode }) => {
  const isGithub = mode === "github";

  // ✅ Cargar SOLO es.json para generar las rutas (idioma prioritario)
  const proyectosPath = path.resolve(import.meta.dirname, './src/data/proyectos');
  const ARCHIVO_PRIORITARIO = 'es.json';
  let rutasProyectos = [];

  try {
    const rutaArchivo = path.join(proyectosPath, ARCHIVO_PRIORITARIO);

    if (fs.existsSync(rutaArchivo)) {
      const contenido = JSON.parse(fs.readFileSync(rutaArchivo, 'utf-8'));
      const proyectos = contenido.proyectos || [];

      proyectos.forEach((p) => {
        const categoria = p.tipo.toLowerCase();
        rutasProyectos.push(`/proyectos/${categoria}/${p.titulo}`);
      });

      console.log(`[SSG] ${rutasProyectos.length} rutas de proyectos generadas desde ${ARCHIVO_PRIORITARIO}`);
    } else {
      console.warn(`[SSG] No se encontró ${ARCHIVO_PRIORITARIO} en ${proyectosPath}`);
    }
  } catch (error) {
    console.warn('[SSG] Error al cargar proyectos:', error.message);
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        webp: { quality: 80 },
        avif: { quality: 70 },
        svg: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: { cleanupIds: false },
              },
            },
          ],
        },
        includePublic: true,
        logStats: true,
      }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "inhabi-social.jpg"],
        manifest: {
          name: "Inhabi — Arquitectura e interiorismo",
          short_name: "Inhabi",
          description:
            "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá.",
          theme_color: "#12110e",
          background_color: "#12110e",
          display: "standalone",
          icons: [
            { src: "android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: isGithub ? "/inhabi.co/" : "/",
    build: {
      emptyOutDir: true,
    },
    ssgOptions: {
      script: "async",
      formatting: "minify",
      includedRoutes() {
        const rutasEstaticas = [
          "/",
          "/system-design",
          "/cotiza",
          "/proyectos",
          "/proyectos/vivienda",
          "/proyectos/comercial",
          "/proyectos/institucional",
          "/servicios",
          "/servicios/diseño",
          "/servicios/remodelacion",
          "/servicios/contruccion",
          "/servicios/integral",
        ];

        return [...rutasEstaticas, ...rutasProyectos];
      },
    },
  };
});