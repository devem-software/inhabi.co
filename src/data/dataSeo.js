import { siteUrl } from '@/composables/useInhabiStore.js'

export const seo = {
  title: 'Inhabi | Arquitectura, interiorismo y remodelación en Bogotá',
  meta: [
    {
      name: 'description',
      content:
        'Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá. Soluciones integrales, diseño personalizado y ejecución técnica.',
    },
    { name: 'robots', content: 'index, follow' },

    // --- Open Graph (Facebook, WhatsApp, LinkedIn) ---
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Inhabi | Arquitectura e interiorismo' },
    {
      property: 'og:description',
      content: 'Transformamos espacios con arquitectura, diseño interior y remodelación integral.',
    },
    { property: 'og:url', content: siteUrl },
    { property: 'og:image', content: `${siteUrl}inhabi-social.jpg` }, // Asegúrate de que siteUrl termine en "/"
    { property: 'og:image:secure_url', content: `${siteUrl}inhabi-social.jpg` },
    { property: 'og:image:type', content: 'image/jpeg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },

    // --- Twitter Card (Twitter, Slack, Discord, Google Chat) ---
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Inhabi | Arquitectura e interiorismo' },
    {
      name: 'twitter:description',
      content: 'Transformamos espacios con arquitectura, diseño interior y remodelación integral.',
    },
    { name: 'twitter:image', content: `${siteUrl}inhabi-social.jpg` },
  ],
  link: [
    {
      rel: 'canonical',
      href: siteUrl,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'GeneralContractor',
        name: 'Inhabi',
        url: siteUrl,
        image: `${siteUrl}inhabi-social.jpg`,
        description: 'Arquitectura, interiorismo y remodelación integral en Bogotá, Colombia.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bogotá',
          addressRegion: 'Bogotá D.C.',
          addressCountry: 'CO',
        },
        areaServed: {
          '@type': 'City',
          name: 'Bogotá',
        },
      }),
    },
  ],
}
