// src/composables/usePageSeo.js
import { unref } from "vue";
import { useHead } from "@unhead/vue";
import { useRoute } from "vue-router";
import { siteUrl, IMG, ASSET } from "@/composables/useInhabiStore.js";

export function usePageSeo({
  title,
  description,
  image,
  url,
  type = "website",
  locale = "es_CO",
} = {}) {
  const route = useRoute();

  // Función auxiliar para extraer el valor de un computed, una función o un valor plano
  const getValue = (val, fallback = "") => {
    if (typeof val === "function") return val();
    return unref(val) ?? fallback;
  };

  useHead({
    // ✅ Título reactivo
    title: () => getValue(title, route.meta.title) || "Inhabi | Arquitectura, interiorismo y remodelación",

    link: [
      {
        rel: "canonical",
        href: () => {
          const finalPath = getValue(url, route.fullPath) || "/";
          const cleanBase = (siteUrl() || "").replace(/\/$/, "");
          const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
          return `${cleanBase}${cleanPath}`;
        },
      },
    ],

    meta: [
      { 
        name: "description", 
        content: () => getValue(description, route.meta.description) || "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá." 
      },

      // Open Graph Estáticos
      { property: "og:type", content: type },
      { property: "og:site_name", content: "Inhabi" },
      { property: "og:locale", content: locale },

      // Open Graph Reactivos
      { 
        property: "og:title", 
        content: () => getValue(title, route.meta.title) || "Inhabi | Arquitectura, interiorismo y remodelación" 
      },
      { 
        property: "og:description", 
        content: () => getValue(description, route.meta.description) || "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá." 
      },
      { 
        property: "og:url", 
        content: () => {
          const finalPath = getValue(url, route.fullPath) || "/";
          const cleanBase = (siteUrl() || "").replace(/\/$/, "");
          const cleanPath = finalPath.startsWith("/") ? finalPath : `/${finalPath}`;
          return `${cleanBase}${cleanPath}`;
        }
      },
      { 
        property: "og:image", 
        content: () => {
          const rawImage = getValue(image, route.meta.image);
          if (!rawImage) return "";
          
          const resolved = IMG(rawImage) || ASSET(rawImage);
          if (resolved) {
            const cleanBase = (siteUrl() || "").replace(/\/$/, "");
            return /^https?:\/\//.test(resolved)
              ? resolved
              : `${cleanBase}${resolved.startsWith("/") ? "" : "/"}${resolved}`;
          }
          // Fallback
          const cleanBase = (siteUrl() || "").replace(/\/$/, "");
          return `${cleanBase}/${String(rawImage).replace(/^\//, "")}`;
        }
      },
      { property: "og:image:secure_url", content: () => {
          // Reutilizamos la misma lógica de og:image para mantener consistencia
          const rawImage = getValue(image, route.meta.image);
          if (!rawImage) return "";
          const resolved = IMG(rawImage) || ASSET(rawImage);
          if (resolved) {
            const cleanBase = (siteUrl() || "").replace(/\/$/, "");
            return /^https?:\/\//.test(resolved) ? resolved : `${cleanBase}${resolved.startsWith("/") ? "" : "/"}${resolved}`;
          }
          const cleanBase = (siteUrl() || "").replace(/\/$/, "");
          return `${cleanBase}/${String(rawImage).replace(/^\//, "")}`;
        }
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },

      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { 
        name: "twitter:title", 
        content: () => getValue(title, route.meta.title) || "Inhabi | Arquitectura, interiorismo y remodelación" 
      },
      { 
        name: "twitter:description", 
        content: () => getValue(description, route.meta.description) || "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá." 
      },
      { 
        name: "twitter:image", 
        content: () => {
          const rawImage = getValue(image, route.meta.image);
          if (!rawImage) return "";
          const resolved = IMG(rawImage) || ASSET(rawImage);
          if (resolved) {
            const cleanBase = (siteUrl() || "").replace(/\/$/, "");
            return /^https?:\/\//.test(resolved) ? resolved : `${cleanBase}${resolved.startsWith("/") ? "" : "/"}${resolved}`;
          }
          const cleanBase = (siteUrl() || "").replace(/\/$/, "");
          return `${cleanBase}/${String(rawImage).replace(/^\//, "")}`;
        }
      },
    ],
  });
}