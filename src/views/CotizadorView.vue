<script setup>
import { store, t, siteUrl } from "@/composables/useInhabiStore";
import LogoComponent from "@/components/LogoComponent.vue";

import CotizadorSection from "@/components/CotizadorSection.vue";


// SEO para HOME
import { useHead } from "@vueuse/head";

useHead({
  title: "Inhabi | Arquitectura, interiorismo y remodelación en Bogotá",

  meta: [
    {
      name: "description",
      content:
        "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá. Soluciones integrales, diseño personalizado y ejecución técnica.",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "Inhabi | Arquitectura e interiorismo",
    },
    {
      property: "og:description",
      content: "Transformamos espacios con arquitectura, diseño interior y remodelación integral.",
    },
    {
      property: "og:url",
      content: siteUrl,
    },
    {
      property: "og:image",
      content: `${siteUrl}assets/inhabi-social.jpg`,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],

  link: [
    {
      rel: "canonical",
      href: siteUrl,
    },
  ],

  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "GeneralContractor",
        name: "Inhabi",
        url: siteUrl,
        image: `${siteUrl}assets/inhabi-social.jpg`,
        description: "Arquitectura, interiorismo y remodelación integral en Bogotá, Colombia.",
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
});




</script>

<template>
  <!-- <nav class="nav" :style="navStyle"> -->
  <nav class="nav" style="background: rgba(18,17,14,.88);backdrop-filter: blur(12px);">
    <!-- Marca -->
    <a href="#top" class="brand" @click="closeMenu">
      <LogoComponent class="brand-logo" icon text />
    </a>
    <!-- Botón hamburguesa (solo móvil) -->
    <div class="nav-links">
      <router-link to="/" class="nav-cta" @click="closeMenu">
        {{ t.nav.inicio }}
      </router-link>
    </div>
  </nav>
  <CotizadorSection />

</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0.75rem clamp(20px, 4vw, 56px);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.2vw, 32px);
  font:
    500 11px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-logo {
  height: 1.5rem;
  width: auto;
  display: block;
}
.nav-cta {
  background: #f3f0e9;
  color: #12110e;
  padding: 11px 16px;
  border-radius: 999px;
  transition:
    background 0.25s,
    color 0.25s;
}
.nav-cta:hover {
  background: #cdd2c0;
  color: #12110e;
}
</style>
