// src/composables/usePageSeo.js
import { unref } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { siteUrl, IMG, ASSET } from '@/composables/useInhabiStore.js'

export function usePageSeo({
  title,
  description,
  image,
  url,
  type = 'CreativeWork', // ✅ Por defecto usará CreativeWork en lugar de Product
  locale = 'es_CO',
  review = null,
  creator = { name: 'Inhabi', url: 'https://inhabi.co' }, // ✅ Entidad creadora
  about = null, // ✅ Permite vincular el cliente/entidad receptora (ej. Universidad Libre)
} = {}) {
  const route = useRoute()

  // Función auxiliar para extraer el valor de un computed, una función o un valor plano
  const getValue = (val, fallback = '') => {
    if (typeof val === 'function') return val()
    return unref(val) ?? fallback
  }

  // Resolver URLs absolutas de imágenes
  const resolveImageUrl = () => {
    const rawImage = getValue(image, route.meta.image)
    if (!rawImage) return ''

    const resolved = IMG(rawImage) || ASSET(rawImage)
    const cleanBase = (siteUrl() || '').replace(/\/$/, '')

    if (resolved) {
      return /^https?:\/\//.test(resolved)
        ? resolved
        : `${cleanBase}${resolved.startsWith('/') ? '' : '/'}${resolved}`
    }
    return `${cleanBase}/${String(rawImage).replace(/^\//, '')}`
  }

  const resolvedUrl = () => {
    const finalPath = getValue(url, route.fullPath) || '/'
    const cleanBase = (siteUrl() || '').replace(/\/$/, '')
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`
    return `${cleanBase}${cleanPath}`
  }

  const resolvedTitle = () =>
    getValue(title, route.meta.title) || 'Inhabi | Arquitectura, interiorismo y remodelación'

  const resolvedDescription = () =>
    getValue(description, route.meta.description) ||
    'Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá.'

  useHead({
    // ✅ Título reactivo
    title: resolvedTitle,

    link: [
      {
        rel: 'canonical',
        href: resolvedUrl,
      },
    ],

    meta: [
      { name: 'description', content: resolvedDescription },

      // Open Graph Estáticos
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Inhabi' },
      { property: 'og:locale', content: locale },

      // Open Graph Reactivos
      { property: 'og:title', content: resolvedTitle },
      { property: 'og:description', content: resolvedDescription },
      { property: 'og:url', content: resolvedUrl },
      { property: 'og:image', content: resolveImageUrl },
      { property: 'og:image:secure_url', content: resolveImageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: resolvedTitle },
      { name: 'twitter:description', content: resolvedDescription },
      { name: 'twitter:image', content: resolveImageUrl },
    ],

    script: () => {
      const pageTitle = resolvedTitle()
      const pageDescription = resolvedDescription()
      const activeReview = getValue(review, null)
      const activeCreator = getValue(creator, null)
      const activeAbout = getValue(about, null)

      // Construcción dinámica del objeto JSON-LD
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': getValue(type, 'CreativeWork'), // ✅ Permite 'CreativeWork', 'RealEstateListing', etc.
        name: pageTitle,
        description: pageDescription,
        url: resolvedUrl(),
      }

      const imgUrl = resolveImageUrl()
      if (imgUrl) {
        schemaData.image = imgUrl
      }

      // ✅ Agregar creador (Inhabi)
      if (activeCreator) {
        schemaData.creator = {
          '@type': 'Organization',
          name: activeCreator.name || 'Inhabi',
          url: activeCreator.url || 'https://inhabi.co',
        }
      }

      // ✅ Agregar entidad/cliente evaluado si se especifica
      if (activeAbout) {
        schemaData.about = typeof activeAbout === 'string'
          ? { '@type': 'Thing', name: activeAbout }
          : activeAbout
      }

      // ✅ Agregar Review corrigiendo el tipo y autor
      if (activeReview) {
        schemaData.review = {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(activeReview.rating || '5'),
            bestRating: '5',
          },
          author: {
            '@type': activeReview.authorType || 'Person',
            name: activeReview.author || 'Cliente Inhabi', // ✅ Nunca usará el título del proyecto
          },
          reviewBody: activeReview.body || '',
        }
      }

      return [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schemaData),
        },
      ]
    },
  })
}