<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {store, t} from '@/composables/useInhabiStore.js'

const archivosProyectos = import.meta.glob(
  '@/data/proyectos/*.json',
  {
    eager: true,
    import: 'default'
  }
)

const proyectos = computed(() => {
  const idioma = store.lang || 'es'
  const archivo = archivosProyectos[`/src/data/proyectos/${idioma}.json`]
  return archivo?.proyectos ?? []
})

// --- LÓGICA DEL MODAL ---
const isOpen = ref(false)
const activeProject = ref(null)

const openModal = (proyecto) => {
  activeProject.value = proyecto
  currentImgIndex.value = 0
  isOpen.value = true
  document.body.style.overflow = 'hidden' // Bloquea el scroll del fondo
}

const closeModal = () => {
  isOpen.value = false
  setTimeout(() => { activeProject.value = null }, 300)
  document.body.style.overflow = ''
}

// Cierra modal con la tecla ESC
const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) closeModal()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))

// --- LÓGICA DEL CARRUSEL ---
const currentImgIndex = ref(0)

const prevImage = () => {
  if (!activeProject.value) return
  const total = activeProject.value.imagenes.length
  currentImgIndex.value = (currentImgIndex.value - 1 + total) % total
}

const nextImage = () => {
  if (!activeProject.value) return
  const total = activeProject.value.imagenes.length
  currentImgIndex.value = (currentImgIndex.value + 1) % total
}
</script>

<template>
  <section id="proyectos" class="sec">
    <div class="container">
      <div v-reveal class="head">
        <p class="eyebrow">{{ t.nav.proyectos }}</p>
        <h2 class="title">{{t.proy.eyebrow}}</h2>
      </div>

      <!-- GRID DE TARJETAS DE PROYECTO -->
      <div class="grid-auto mt-48">
        <button
          v-for="(p, index) in proyectos"
          :key="p.id"
          class="card-project"
          @click="openModal(p)"
        >
          <div class="card__media">
            <img :src="p.imagenes[0]" :alt="p.titulo">
          </div>
          <div class="card-project__meta">
            <span class="card-project__name">{{ p.titulo }}</span>
            <span class="card-project__tag">0{{ index + 1 }} · Ver →</span>
          </div>
        </button>
      </div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="isOpen" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>

            <!-- Botón cerrar -->
            <button class="modal-close" @click="closeModal">✕</button>

            <div v-if="activeProject" class="modal-layout">

              <!-- 1. Título -->
              <h3 class="modal-title">{{ activeProject.titulo }}</h3>

              <!-- 2. Carrusel de imágenes -->
              <div class="modal-carousel">
                <div class="carousel-track">
                  <img :src="activeProject.imagenes[currentImgIndex]" :alt="activeProject.titulo">
                </div>

                <!-- Controles del carrusel -->
                <div class="carousel-ctrls" v-if="activeProject.imagenes.length > 1">
                  <button @click="prevImage">‹</button>
                  <span class="counter">
                    {{ currentImgIndex + 1 }} / {{ activeProject.imagenes.length }}
                  </span>
                  <button @click="nextImage">›</button>
                </div>
              </div>

              <!-- 3. Intervención -->
              <div class="modal-intervention">
                <span class="eyebrow">Intervención</span>
                <p class="t-body-sm">{{ activeProject.intervencion }}</p>
              </div>

              <!-- 4. Reseña -->
              <div class="modal-review">
                <span class="eyebrow">Reseña del cliente</span>
                <blockquote class="review-quote">
                  {{ activeProject.resena }}
                </blockquote>
              </div>

            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>

<style scoped>
/* ================= ESTRUCTURA BASE ================= */
.sec {
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
  background: #f3f0e9;
  color:   #12110e;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
}
.eyebrow {
  font: 500 11px/1 'IBM Plex Mono', monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage, #cdd2c0);
  margin-bottom: 16px;
}
.title {
  font: 400 clamp(2.5rem, 5vw, 5rem)/0.95 'Instrument Serif', serif;
  margin: 0;
}
.mt-48 { margin-top: 48px; }

/* ================= GRID DE PROYECTOS ================= */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 32px;
}
.card-project {
  all: unset;
  cursor: pointer;
  display: grid;
  gap: 18px;
  color: inherit;
  transition: transform 0.3s ease;
}
.card-project:hover {
  transform: translateY(-4px);
}
.card__media {
  aspect-ratio: 1/1;
  overflow: hidden;
  background: #1b1a16;
}
.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}
.card-project:hover .card__media img {
  transform: scale(1.05);
}
.card-project__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  border-top: 1px solid rgba(243,240,233,.20);
  padding-top: 14px;
}
.card-project__name {
  font: 400 30px/1 'Instrument Serif', serif;
}
.card-project__tag {
  font: 500 10px/1 'IBM Plex Mono', monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage, #cdd2c0);
}

/* ================= MODAL ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(18, 17, 14, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  position: relative;
  background: var(--cream, #f3f0e9);
  color: var(--ink, #12110e);
  width: 100%;
  max-height: calc(100% - 1rem);
  overflow-y: auto;
  border-radius: 8px;
  padding: 40px 32px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--ink, #12110e);
  opacity: 0.5;
  transition: opacity 0.2s;
}
.modal-close:hover {
  opacity: 1;
}

/* ================= LAYOUT MODAL (MOVIL Y LAPTOP) ================= */

/* Movil y Tablet (Apilado normal) */
.modal-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.modal-title {
  font: 400 48px/1 'Instrument Serif', serif;
  margin: 0;
  border-bottom: 1px solid rgba(18,17,14,0.15);
  padding-bottom: 16px;
}

/* Componentes internos */
.modal-carousel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.carousel-track {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #e6e1d6;
  border-radius: 4px;
}
.carousel-track img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fadeIn 0.4s ease;
}
.carousel-ctrls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid rgba(18,17,14,0.15);
  border-radius: 999px;
}
.carousel-ctrls button {
  background: transparent;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: var(--ink);
}
.carousel-ctrls .counter {
  font: 500 12px/1 'IBM Plex Mono', monospace;
}

.t-body-sm {
  font-size: 15px;
  line-height: 1.6;
  margin: 8px 0 0;
  color: #4d493f;
}

.review-quote {
  margin: 8px 0 0;
  font: 400 20px/1.4 'Instrument Serif', serif;
  color: var(--ink);
  padding-left: 16px;
  border-left: 2px solid var(--sage, #cdd2c0);
}

/* Laptop (Grid específico de 50% y 2 columnas) */
@media (min-width: 1024px) {
  .modal-content {
    /* 50% de la pantalla */
    width: 75vw;
    max-width: 1024px;
    padding: 48px;
  }

  .modal-layout {
    display: grid;
    /* Divide la carta en dos columnas iguales */
    grid-template-columns: 1fr 1fr;
    gap: 32px;

    /* Plantilla que ordena los elementos según tu solicitud */
    grid-template-areas:
      "titulo titulo"
      "carrusel intervencion"
      "resena resena";
  }

  .modal-title {
    grid-area: titulo;
  }
  .modal-carousel {
    grid-area: carrusel;
  }
  .modal-intervention {
    grid-area: intervencion;
    /* Centra el texto verticalmente junto a la imagen */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .modal-review {
    grid-area: resena;
    border-top: 1px solid rgba(18,17,14,0.15);
    padding-top: 24px;
  }
}

/* Transición del Modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active .modal-content, .fade-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from .modal-content, .fade-leave-to .modal-content {
  transform: translateY(20px) scale(0.98);
}
</style>
