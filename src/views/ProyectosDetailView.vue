<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { store, t, IMG } from "@/composables/useInhabiStore.js";
import AppNavClean from "@/components/AppNavClean.vue";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import ContactButton from "@/components/atoms/ContactButton.vue";
import { usePageSeo } from "@/composables/usePageSeo.js";

const route = useRoute();
const categoria = computed(() => route.params.categoria);
const proyectoSlug = computed(() => route.params.proyecto);

const showBreadcrumbs = computed(() => route.name !== "home");

// 1. Carga de archivos JSON
const archivosProyectos = import.meta.glob("@/data/proyectos/*.json", {
  eager: true,
  import: "default",
});

// 2. Computed robusto para encontrar el proyecto
const proyecto = computed(() => {
  const idioma = store.lang || "es";
  // Nota: Verifique en consola si la clave es "/src/..." o "@/..."
  const archivo =
    archivosProyectos[`/src/data/proyectos/${idioma}.json`] ||
    archivosProyectos[`@/data/proyectos/${idioma}.json`];

  if (!archivo?.proyectos) return null;

  // Búsqueda insensible a mayúsculas/minúsculas y espacios
  return (
    archivo.proyectos.find(
      (p) =>
        p.titulo?.toLowerCase() === proyectoSlug.value?.toLowerCase() &&
        p.tipo?.toLowerCase() === categoria.value?.toLowerCase(),
    ) || null
  );
});

// 3. SEO Reactivo y Seguro (Sin acceder a .value prematuramente)
usePageSeo({
  title: computed(() =>
    proyecto.value
      ? `${proyecto.value.titulo} | Proyectos Inhabi`
      : "Proyecto no encontrado | Inhabi",
  ),
  description: computed(() =>
    proyecto.value
      ? `Conoce ${proyecto.value.titulo}, un proyecto de ${proyecto.value.intervencion || "diseño"} de Inhabi.`
      : "Detalle del proyecto de remodelación e interiorismo.",
  ),
  // 🔑 Clave: Optional chaining (?.) para evitar el error si proyecto es null
  image: computed(() =>
    proyecto.value?.imagenes?.[0] ? `${proyecto.value.imagenes[0]}.jpg` : "inhabi-proyectos.jpg",
  ),
  url: computed(() =>
    `/proyectos/${categoria.value || ""}/${proyectoSlug.value}`.replace(/\/+/g, "/"),
  ),
});

// --- LÓGICA DEL CARRUSEL ---
const currentImgIndex = ref(0);

// Reiniciar el índice si cambia el proyecto (al navegar entre proyectos)
watch(proyecto, () => {
  currentImgIndex.value = 0;
});

const prevImage = () => {
  if (!proyecto.value?.imagenes) return;
  const total = proyecto.value.imagenes.length;
  currentImgIndex.value = (currentImgIndex.value - 1 + total) % total;
};

const nextImage = () => {
  if (!proyecto.value?.imagenes) return;
  const total = proyecto.value.imagenes.length;
  currentImgIndex.value = (currentImgIndex.value + 1) % total;
};
</script>

<template>
  <div class="detail-page" v-if="proyecto">
    <!-- Header temático fijo -->
    <AppNavClean cotizar />

    <main class="container detail-content">
      <AppBreadcrumbs v-if="showBreadcrumbs" class="breads" />
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
              <span class="carousel-ctrls__ctrl" @click="prevImage" aria-label="Anterior"></span>
              <span class="counter"
                >{{ currentImgIndex + 1 }} / {{ proyecto.imagenes.length }}</span
              >
              <span class="carousel-ctrls__ctrl" @click="nextImage" aria-label="Siguiente"></span>
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
            <blockquote class="review-box">{{ proyecto.resena }}</blockquote>
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
  <ContactButton :message="encodeURIComponent(t.hola)" />
</template>

<style scoped lang="scss">
/* ============================================================
   MIXINS TIPOGRÁFICOS
   ============================================================ */
@mixin mono-label($size: 11px, $weight: 500, $tracking: 0.16em) {
  font-family: var(--font-mono);
  font-size: $size;
  font-weight: $weight;
  line-height: 1;
  letter-spacing: $tracking;
  text-transform: uppercase;
}

/* ============================================================
   DETAIL PAGE
   ============================================================ */
.detail-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--ink, #12110e);
  color: var(--cream, #f3f0e9);
}

/* ============================================================
   PAGE NAV
   ============================================================ */
.page-nav {
  position: relative;
  z-index: 60;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem clamp(20px, 4vw, 56px);
  background: rgba(18, 17, 14, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(243, 240, 233, 0.1);
}

/* ============================================================
   CONTAINER
   ============================================================ */
.container {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem clamp(20px, 4vw, 56px);
  box-sizing: border-box;
}

.project-title {
  width: 100%;
  margin: 0 0 20px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(243, 240, 233, 0.15);
  font-family: "Instrument Serif", serif;
  font-weight: 400;
  font-size: clamp(28px, 4vw, 56px);
  line-height: 1;
}

/* ============================================================
   DETAIL GRID
   ============================================================ */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  margin-bottom: auto;
}

/* ---------- Carrusel ---------- */
.gallery-col {
  width: 100%;
}

.carousel-track {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 45vh;
  overflow: hidden;
  background: #1b1a16;
  border-radius: 4px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.carousel-ctrls {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 7rem;
  height: 2rem;
  padding: 0 0.25rem;
  background: color-mix(in srgb, var(--dark-soft), transparent);
  backdrop-filter: blur(0.5rem);
  border-radius: 2rem;

  &__ctrl {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 2rem;
    color: var(--light-accent);
    background: var(--ink-soft-accent);
    border-radius: 2rem;
    cursor: pointer;
    &::before {
      content: "";
      display: block;
      width: 0;
      height: 0;

      /* triángulo apuntando hacia abajo ▼ */
      border-left: 0.4rem solid transparent;
      border-right: 0.4rem solid transparent;
      border-top: 0.5rem solid var(--light);
    }
    &:nth-child(1) {
      &::before {
        margin-right: 2px;
        transform: rotate(90deg);
      }
    }
    &:nth-child(3) {
      &::before {
        margin-left: 2px;
        transform: rotate(-90deg);
      }
    }
  }

  .counter {
    @include mono-label($weight: 500);
    color: var(--light-accent);
  }
}

/* ---------- Info ---------- */
.info-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.eyebrow {
  @include mono-label($size: 10px, $tracking: 0.2em);
  display: block;
  margin-bottom: 6px;
  color: var(--light);
}

.body-text {
  margin: 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--ink-soft-accent);
}

.review-box {
  margin: 0;
  padding-left: 1rem;
  border-left: 4px solid var(--light);
  font-family: var(--font-cursive);
  font-size: 1.25rem;
  line-height: 1.3;
  color: var(--ink-soft-accent);
}

/* ============================================================
   BREADCRUMBS
   ============================================================ */
.breads {
  margin: 0 0 1rem 0;
}

/* ============================================================
   RESPONSIVE — Laptop (2 columnas)
   ============================================================ */
@media (min-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1.2fr 1fr;
    gap: 48px;
    align-items: flex-start;
  }

  .carousel-track {
    max-height: 55vh;
  }
}
</style>
