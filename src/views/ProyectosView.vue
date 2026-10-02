<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store, t, IMG } from '@/composables/useInhabiStore.js'
import LogoComponent from "@/components/LogoComponent.vue";

const route = useRoute()
const categoriaActual = computed(() => route.params.categoria || 'vivienda')

// Carga dinámica de proyectos según el idioma actual
const archivosProyectos = import.meta.glob('@/data/proyectos/*.json', { eager: true, import: 'default' })

const proyectosFiltrados = computed(() => {
  const idioma = store.lang || 'es'
  const archivo = archivosProyectos[`/src/data/proyectos/${idioma}.json`]
  const lista = archivo?.proyectos ?? []
  
  // Filtra por la categoría presente en la URL
  return lista.filter(p => p.tipo.toLowerCase() === categoriaActual.value.toLowerCase())
})
</script>

<template>
  <div class="projects-page">
    <!-- Header temático (estilo AppNav) -->
    <header class="page-nav">
      <router-link to="/" class="brand">
        <LogoComponent class="brand-logo" icon text/>
      </router-link>
      
      <div class="nav-actions">
        <router-link to="/#proyectos" class="nav-btn-back">← Volver</router-link>
        <router-link to="/cotiza" class="nav-cta">{{ t.nav.cotizar }}</router-link>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="container sec">
      <div class="head">
        <span class="eyebrow">{{ t.nav.proyectos }} / {{ categoriaActual.toUpperCase() }}</span>
        <h1 class="title">Arquitectura que genera valor.</h1>
      </div>

      <!-- Grid de proyectos filtrados por categoría -->
      <div class="grid-proyectos mt-48">
        <router-link
          v-for="(p, index) in proyectosFiltrados"
          :key="p.slug"
          :to="`/proyectos/${categoriaActual}/${p.titulo}`"
          class="card-project"
        >
          <div class="card__media">
            <img :src="IMG(p.imagenes[0])" :alt="p.titulo" loading="lazy">
            <span class="card__num">0{{ index + 1 }}</span>
          </div>
          <div class="card-meta">
            <h3 class="card-title">{{ p.titulo }}</h3>
            <span class="card-arrow">Ver proyecto →</span>
          </div>
        </router-link>
      </div>

      <!-- Estado vacío si no hay proyectos en la categoría -->
      <div v-if="proyectosFiltrados.length === 0" class="empty-state">
        <p>No hay proyectos disponibles en esta categoría actualmente.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.projects-page {
  background: var(--ink, #12110e);
  color: var(--cream, #f3f0e9);
  min-height: 100vh;
}
.page-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem clamp(20px, 4vw, 56px);
  background: rgba(18,17,14,.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(243,240,233,0.1);
}
.brand-logo { height: 1.5rem; width: auto; display: block; }
.nav-actions { display: flex; align-items: center; gap: 16px; }
.nav-btn-back {
  font: 500 11px/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f3f0e9;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.nav-btn-back:hover { opacity: 1; }
.nav-cta {
  background: #f3f0e9;
  color: #12110e;
  padding: 10px 18px;
  border-radius: 999px;
  font: 500 11px/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.14em;
  text-decoration: none;
  transition: background 0.25s;
}
.nav-cta:hover { background: var(--sage, #cdd2c0); }

.sec {
  padding: clamp(120px, 14vw, 160px) clamp(20px, 4vw, 56px) 80px;
  max-width: 1400px;
  margin: 0 auto;
}
.eyebrow {
  font: 500 11px/1 'IBM Plex Mono', monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage, #cdd2c0);
  display: block;
  margin-bottom: 16px;
}
.title {
  font: 400 clamp(40px, 5.4vw, 88px)/0.95 'Instrument Serif', serif;
  margin: 0;
}
.mt-48 { margin-top: 48px; }

.grid-proyectos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: 32px;
}
.card-project {
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: 16px;
  background: #000;
  border: 1px solid rgba(243,240,233,0.12);
  padding: 16px;
  transition: border-color 0.3s, transform 0.3s;
}
.card-project:hover {
  border-color: var(--sage, #cdd2c0);
  transform: translateY(-4px);
}
.card__media {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #1b1a16;
}
.card__media img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s;
}
.card-project:hover .card__media img { transform: scale(1.04); }
.card__num {
  position: absolute; top: 12px; left: 12px;
  padding: 6px 10px; background: rgba(18,17,14,0.72);
  color: var(--cream); font: 500 11px/1 var(--font-mono);
  border-radius: 4px;
}
.card-meta {
  display: flex; justify-content: space-between; align-items: baseline;
  padding-top: 8px;
}
.card-title { font: 400 32px/1 'Instrument Serif', serif; margin: 0; }
.card-arrow { font: 500 10px/1 'IBM Plex Mono', monospace; letter-spacing: 0.16em; color: var(--sage); }
.empty-state { padding: 60px 0; text-align: center; color: var(--fg-soft); }
</style>