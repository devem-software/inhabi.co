<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { t, currentProyectos } from "@/composables/useInhabiStore.js";
import { useInhabiMetrics } from "@/composables/useInhabiMetrics";

import AppNavClean from "@/components/AppNavClean.vue";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import HeroCard from "@/components/HeroCard.vue";
import ContactButton from "@/components/atoms/ContactButton.vue";
import AppMetrics from "@/components/AppMetrics.vue";

const route = useRoute();
// Si la ruta es solo /proyectos, categoriaActual será una cadena vacía ""
const categoriaActual = computed(() => route.params.categoria || "");

const showBreadcrumbs = computed(() => route.name !== "home");


const data = currentProyectos();


// Extraer categorías únicas de forma dinámica desde los datos
const categoriasDisponibles = computed(() => [...new Set(data.value.proyectos.map(p => p.tipo))]);

// Filtrar proyectos según si hay una categoría seleccionada en la URL o no
const proyectosFiltrados = computed(() => {
  if (!categoriaActual.value) {
    return data.value.proyectos; // Si estamos en /proyectos, muestra todos
  }
  return data.value.proyectos.filter(
    (p) => p.tipo.toLowerCase() === categoriaActual.value.toLowerCase(),
  );
});

const {
  experiencia,
  cantidadProyectos,
  metrosPorCategoria,
  metrosTotales,
  ciudades,
  cantidadCiudades,
  stats,
} = useInhabiMetrics(data);


const values = computed(() => [
  `+${experiencia.value} años`,
  `${metrosTotales.value.toLocaleString()} <span style="color:var(--ink-soft-accent); font-size:.75em">m<sup>2</sup></span>`,
  cantidadProyectos.value,
  cantidadCiudades.value,
]);

const labels = ["Cumpliendo", "Intervenidos", "Proyectos", "Ciudades"];


// SEO para HOME
import { usePageSeo } from "@/composables/usePageSeo.js";

usePageSeo({
  title: "Inhabi - Proyectos",
  description:
    "Nuestros clientes confirman nuestra calidad, revisa cada uno de nuestrso trabajos para que veas con tus ojos los sueños cumplidos de los que confiaron en nosotros",
  image: "inhabi-proyectos.jpg",
}); // ← toma title/description/image de route.meta
</script>

<template>
  <div class="projects-page">
    <!-- Header temático -->
    <AppNavClean cotizar />

    <!-- Contenido principal -->
    <main class="section">
      <AppBreadcrumbs v-if="showBreadcrumbs" class="breads" />
      <div class="head">
        <span class="eyebrow">
          {{ t.nav.proyectos }}
        </span>
        <h1 class="title">Arquitectura que genera valor.</h1>
      </div>

      <AppMetrics class="section__metrics" :values="values" :labels="labels"/>
      <!-- Barra de botones de filtro dinámicos -->
      <div class="filter-bar">
        <router-link to="/proyectos" class="btn btn__small" :class="{ active: !categoriaActual }">
          Todos
        </router-link>
        <router-link
          v-for="cat in categoriasDisponibles"
          :key="cat"
          :to="`/proyectos/${cat.toLowerCase()}`"
          class="btn btn__small btn__outline"
          :class="{ btn__outline_light: categoriaActual.toLowerCase() === cat.toLowerCase() }"
        >
          {{ cat }}
        </router-link>
      </div>

      <div class="grid-proyectos">
        <HeroCard
          class="card-project"
          v-for="(p, index) in proyectosFiltrados"
          :key="index"
          :image="p.imagenes[0]"
          :title="p.titulo"
          :link="`/proyectos/${p.tipo.toLowerCase()}/${p.titulo}`"
          labelLink="VER PROYECTO"
          :tag="p.tipo"
        />
      </div>

      <!-- Estado vacío -->
      <div v-if="proyectosFiltrados.length === 0" class="empty-state">
        <p>No hay proyectos disponibles en esta categoría actualmente.</p>
      </div>
    </main>
    <ContactButton :message="encodeURIComponent(t.hola)" />
  </div>
</template>

<style scoped>
.projects-page {
  background: var(--ink, #12110e);
  color: var(--cream, #f3f0e9);
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.section {
  padding: 1rem clamp(20px, 4vw, 56px) 80px;
  margin: 0 auto;
  flex: 1;
  width: 100%;
}

.section__metrics{
  margin: 2rem 0 0 0;
}

.eyebrow {
  font:
    500 11px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage, #cdd2c0);
  display: block;
  margin-bottom: 16px;
}

.title {
  font-size: clamp(40px, 5.4vw, 88px);
  line-height: 1;
  font-family: var(--font-cursive);
  font-weight: 400;
  margin: 0;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 2rem 0;
}

.grid-proyectos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-evenly;
}

.card-project {
  transition: all 0.3s ease;
  max-width: 30rem;
  min-width: 20rem;
  flex: 0 1 30rem;
}
.card-project:hover {
  border-color: var(--sage, #cdd2c0);
  transform: translateY(-4px);
}
.card__media {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #1b1a16;
}
.card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}
.card-project:hover .card__media img {
  transform: scale(1.04);
}
.card__num {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 6px 10px;
  background: rgba(18, 17, 14, 0.72);
  color: var(--cream);
  font: 500 11px/1 var(--font-mono);
  border-radius: 4px;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 8px;
}
.card-title {
  font:
    400 32px/1 "Instrument Serif",
    serif;
  margin: 0;
}
.card-arrow {
  font:
    500 10px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.16em;
  color: var(--sage);
}
.empty-state {
  padding: 60px 0;
  text-align: center;
  color: var(--fg-soft);
}
</style>
