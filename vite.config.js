import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig(({ command, mode }) => {
  // Verifica si la variable de entorno para GitHub Pages está activa
  const isGitHubPages = process.env.VITE_DEPLOY_TARGET === "gh-pages";

  return {
    plugins: [
      vue(),
      vueDevTools(),
      ViteImageOptimizer({
        /* Opciones por defecto (puedes ajustarlas según tus necesidades) */
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        webp: {
          quality: 80,
        },
        avif: {
          quality: 70,
        },
        svg: {
          multipass: true,
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  cleanupIds: false, // Evita romper IDs de SVGs si usas animaciones/gradientes
                },
              },
            },
          ],
        },
        // Procesa tanto los archivos de la carpeta /src/assets como de la carpeta /public
        includePublic: true,
        logStats: true, // Muestra en consola cuánto peso se redujo por imagen
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
            {
              src: "android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // <--- Dinámico: Si es para GitHub Pages usa '/inhabi.co/', de lo contrario '/' para Cloudflare
    base: isGitHubPages ? "/inhabi.co/" : "/",
    build: {
      emptyOutDir: true,
    },
    ssgOptions: {
      script: "async",
      formatting: "minify",
      includedRoutes(paths) {
        return [
          "/",
          "/cotiza",
          "/proyectos",
          "/proyectos/vivienda",
          "/proyectos/comercial",
          "/proyectos/institucional",
        ];
      },
    },
  };
});
