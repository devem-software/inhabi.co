import { siteUrl } from "@/composables/useInhabiStore.js";

const site = siteUrl();

const description =
  "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá. Soluciones integrales, diseño personalizado y ejecución técnica.";

export const seo = {
  title: "Inhabi | Arquitectura, interiorismo y remodelaciónes",
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "theme-color",
      content: "#1b1a16",
    },
    {
      name: "description",
      content: description,
    },
    { name: "author", content: "Inhabi" },
    { name: "robots", content: "index, follow" },

    // --- Open Graph (Facebook, WhatsApp, LinkedIn) ---
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Inhabi | Arquitectura e interiorismo" },
    {
      property: "og:description",
      content: description,
    },
    { property: "og:url", content: site },
    { property: "og:image", content: `${site}inhabi-social.jpg` }, // Asegúrate de que site termine en "/"
    { property: "og:image:secure_url", content: `${site}inhabi-social.jpg` },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },

    // --- Twitter Card (Twitter, Slack, Discord, Google Chat) ---
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Inhabi | Arquitectura e interiorismo" },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:image", content: `${site}inhabi-social.jpg` },
  ],
  link: [],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "GeneralContractor",
        name: "Inhabi",
        url: site,
        image: `${site}inhabi-social.jpg`,
        description: description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogotá",
          addressRegion: "Bogotá D.C.",
          addressCountry: "CO",
        },
        areaServed: {
          "@type": "City",
          name: "Bogotá",
        },
      }),
    },
  ],
};
