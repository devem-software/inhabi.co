<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store, t, IMG } from '@/composables/useInhabiStore.js'
import LogoComponent from '@/components/LogoComponent.vue'

const route = useRoute()
const categoria = route.params.categoria
const proyectoSlug = route.params.proyecto

const archivosProyectos = import.meta.glob('@/data/proyectos/*.json', {
  eager: true,
  import: 'default',
})

const proyecto = computed(() => {
  const idioma = store.lang || 'es'
  const archivo = archivosProyectos[`/src/data/proyectos/${idioma}.json`]
  const lista = archivo?.proyectos ?? []
  return lista.find(
    (p) => p.titulo === proyectoSlug && p.tipo.toLowerCase() === categoria.toLowerCase(),
  )
})

// --- LÓGICA DEL CARRUSEL ---
const currentImgIndex = ref(0)

const prevImage = () => {
  if (!proyecto.value) return
  const total = proyecto.value.imagenes.length
  currentImgIndex.value = (currentImgIndex.value - 1 + total) % total
}

const nextImage = () => {
  if (!proyecto.value) return
  const total = proyecto.value.imagenes.length
  currentImgIndex.value = (currentImgIndex.value + 1) % total
}
</script>

<template>
  <div class="detail-page" v-if="proyecto">
    <!-- Header temático fijo -->
    <header class="page-nav">
      <router-link to="/" class="brand">
        <LogoComponent class="brand-logo" icon text />
      </router-link>
      <div class="nav-actions">
        <router-link :to="`/proyectos/${categoria}`" class="nav-btn-back">← Volver</router-link>
        <router-link to="/cotiza" class="nav-cta">{{ t.nav.cotizar }}</router-link>
      </div>
    </header>

    <main class="container detail-content">
      <!-- Título principal compacto -->
      <h1 class="project-title">{{ proyecto.titulo }}</h1>

      <!-- Layout en dos columnas adaptado a 100vh -->
      <div class="detail-grid">
        <!-- Izquierda: Carrusel interactivo -->
        <div class="gallery-col">
          <div class="carousel-track">
            <img
              :src="IMG(proyecto.imagenes[currentImgIndex])"
              :alt="`${proyecto.titulo} - ${currentImgIndex + 1}`"
            />

            <!-- Controles superpuestos en el carrusel -->
            <div class="carousel-ctrls" v-if="proyecto.imagenes.length > 1">
              <button @click="prevImage" aria-label="Anterior">‹</button>
              <span class="counter"
                >{{ currentImgIndex + 1 }} / {{ proyecto.imagenes.length }}</span
              >
              <button @click="nextImage" aria-label="Siguiente">›</button>
            </div>
          </div>
        </div>

        <!-- Derecha: Información y Reseña -->
        <div class="info-col">
          <div class="info-box">
            <span class="eyebrow">{{ t.proy.inter }}</span>
            <p class="body-text">{{ proyecto.intervencion }}</p>
          </div>

          <div class="info-box" v-if="proyecto.resena">
            <span class="eyebrow">{{ t.proy.resena }}</span>
            <blockquote class="review-box">"{{ proyecto.resena }}"</blockquote>
          </div>
        </div>
      </div>
    </main>
  </div>

  <div class="detail-page not-found" v-else>
    <div class="container" style="text-align: center; padding-top: 150px">
      <h2>Proyecto no encontrado</h2>
      <router-link
        to="/proyectos/vivienda"
        class="nav-cta"
        style="display: inline-block; margin-top: 20px"
        >Ver proyectos</router-link
      >
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal limitado estrictamente a 100vh sin scroll */
.detail-page {
  background: var(--ink, #12110e);
  color: var(--cream, #f3f0e9);
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.page-nav {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem clamp(20px, 4vw, 56px);
  background: rgba(18, 17, 14, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(243, 240, 233, 0.1);
  z-index: 60;
}
.brand-logo {
  height: 1.5rem;
  width: auto;
  display: block;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.nav-btn-back {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #f3f0e9;
  text-decoration: none;
  opacity: 0.8;
}
.nav-btn-back:hover {
  opacity: 1;
}
.nav-cta {
  background: #f3f0e9;
  color: #12110e;
  padding: 8px 16px;
  border-radius: 999px;
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.14em;
  text-decoration: none;
}
.nav-cta:hover {
  background: var(--sage, #cdd2c0);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px clamp(20px, 4vw, 56px);
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.project-title {
  font:
    400 clamp(28px, 4vw, 56px)/1 'Instrument Serif',
    serif;
  margin: 0 0 20px 0;
  border-bottom: 1px solid rgba(243, 240, 233, 0.15);
  padding-bottom: 16px;
  width: 100%;
}

/* Grid adaptado para ocupar el espacio restante sin rebasar la pantalla */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  max-width: 100%;
}

/* Carrusel optimizado */
.gallery-col {
  width: 100%;
}
.carousel-track {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-height: 45vh;
  background: #1b1a16;
  overflow: hidden;
  border-radius: 4px;
}
.carousel-track img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.carousel-ctrls {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(18, 17, 14, 0.75);
  backdrop-filter: blur(4px);
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid rgba(243, 240, 233, 0.2);
}
.carousel-ctrls button {
  background: transparent;
  border: none;
  color: var(--cream);
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}
.carousel-ctrls .counter {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  color: var(--cream);
}

.info-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.eyebrow {
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage, #cdd2c0);
  display: block;
  margin-bottom: 6px;
}
.body-text {
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  color: rgba(243, 240, 233, 0.8);
}
.review-box {
  margin: 0;
  font:
    400 18px/1.3 'Instrument Serif',
    serif;
  color: var(--cream);
  padding-left: 12px;
  border-left: 2px solid var(--sage, #cdd2c0);
}

/* Disposición Laptop (2 columnas estrictas sin scroll) */
@media (min-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1.2fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .carousel-track {
    max-height: 55vh;
  }
}
</style>
