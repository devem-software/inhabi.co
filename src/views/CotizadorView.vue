<script setup>
import { store, t, siteUrl } from '@/composables/useInhabiStore'
import LogoComponent from '@/components/LogoComponent.vue'

import CotizadorSection from '@/components/CotizadorSection.vue'

// SEO para HOME
// SEO para HOME
import { useHead } from '@vueuse/head'
import { seo } from '@/data/dataSeo.js'

useHead(seo)
</script>

<template>
  <!-- <nav class="nav" :style="navStyle"> -->
  <nav class="nav" style="background: rgba(18, 17, 14, 0.88); backdrop-filter: blur(12px)">
    <!-- Marca -->
    <router-link to="/" class="brand" @click="closeMenu">
      <LogoComponent class="brand-logo" icon text />
    </router-link>
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
    500 11px/1 'IBM Plex Mono',
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
