import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import Sitemap from "vite-plugin-sitemap";
import fs from "node:fs";
import path from "node:path";
import { useUtilSlug } from "./src/composables/useInhabiUtils.js";

const SITE_URL = "https://inhabi.co";

const rutasEstaticas = [
  "/",
  "/system-design",
  "/cotiza",
  "/proyectos",
  "/proyectos/vivienda",
  "/proyectos/comercial",
  "/proyectos/institucional",
  "/servicios",
  "/servicios/diseno",
  "/servicios/remodelacion",
  "/servicios/contruccion",
  "/servicios/integral",
];

export default defineConfig(({ command, mode }) => {
  const isGithub = mode === "github";

  // ✅ Cargar SOLO es.json para generar las rutas (idioma prioritario)
  const proyectosPath = path.resolve(import.meta.dirname, "./src/data/proyectos");
  const ARCHIVO_PRIORITARIO = "es.json";
  let rutasProyectos = [];
  let rutas = [];

  try {
    const rutaArchivo = path.join(proyectosPath, ARCHIVO_PRIORITARIO);

    if (fs.existsSync(rutaArchivo)) {
      const contenido = JSON.parse(fs.readFileSync(rutaArchivo, "utf-8"));
      const proyectos = contenido.proyectos || [];

      proyectos.forEach((p) => {
        const categoria = p.tipo.toLowerCase();
        const titulo = useUtilSlug(p.titulo);
        rutasProyectos.push(`/proyectos/${categoria}/${titulo}`);
      });

      console.log(
        `[SSG] ${rutasProyectos.length} rutas de proyectos generadas desde ${ARCHIVO_PRIORITARIO}`,
      );
    } else {
      console.warn(`[SSG] No se encontró ${ARCHIVO_PRIORITARIO} en ${proyectosPath}`);
    }
    rutas = [...rutasEstaticas, ...rutasProyectos];
    console.log("ESTAS SON LAS RUTAS",  rutas)
  } catch (error) {
    console.warn("[SSG] Error al cargar proyectos:", error.message);
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
      ViteImageOptimizer({
        // Configuración de compresión por formato
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
        test: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
        exclude: undefined,
        include: undefined,
        includePublic: true, // Optimiza también las imágenes guardadas en la carpeta /public
        logStats: true, // Muestra en la consola cuánto espacio ahorraste por imagen
      }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png", "inhabi-social.jpg"],
        manifest: {
          name: "Inhabi — Arquitectura e interiorismo",
          short_name: "Inhabi.co",
          start_url: '/',
          display:'standalone',
          description:
            "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá.",
          theme_color: "#12110e",
          background_color: "#f3f0e9",
          display: "standalone",
          icons: [
            { src: "icon-16x16.png", sizes: "16x16", type: "image/png" },
            { src: "icon-32x32.png", sizes: "32x32", type: "image/png" },
            { src: "icon-48x48.png", sizes: "48x48", type: "image/png" },
            { src: "icon-64x64.png", sizes: "64x64", type: "image/png" },
            { src: "icon-96x96.png", sizes: "96x96", type: "image/png" },
            { src: "icon-128x128.png", sizes: "128x128", type: "image/png" },
            { src: "icon-144x144.png", sizes: "144x144", type: "image/png" },
            { src: "icon-152x152.png", sizes: "152x152", type: "image/png" },
            { src: "icon-180x180.png", sizes: "180x180", type: "image/png" },
            { src: "icon-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "icon-384x384.png", sizes: "384x384", type: "image/png" },
            { src: "icon-512x512.png", sizes: "512x512", type: "image/png" },
            {
              src: "icon-192x192-maskable.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "icon-512x512-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
      Sitemap({
        hostname: SITE_URL,
        readable: true, // Deja el archivo XML ordenado y fácil de leer
        changefreq: "weekly", // Le dice a Google que tu web cambia semanalmente
        priority: 0.8, // Prioridad estándar de indexación
        dynamicRoutes: rutas, // Añade rutas dinámicas si usas un CMS
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
      includedRoutes:(path, routes) => rutas,
    },
  };
});
