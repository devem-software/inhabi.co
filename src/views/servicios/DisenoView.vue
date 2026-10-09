<template>
  <AppNavClean></AppNavClean>
  <div class="section">
    <div class="section__title">Diseño</div>
    <AppMetrics :values="values" :labels="labels" class="section__metrics" />
    <div class="section__subtitle">{{ t.proy.eyebrow }}</div>
    <ClientOnly>
      <div class="section__proyectos">
        <HeroCard
          class="section__proyectos_proyecto"
          v-for="p in data.proyectos"
          :key="p.id"
          :image="`/${p.imagenes[0]}`"
          :title="p.titulo"
          :link="`/proyectos/${p.tipo}/${p.titulo}`"
          labelLink="VER"
          :tag="p.tipo"
        />
      </div>
      <template #fallback>
        <div class="section__proyectos section__proyectos--loading">
          <div v-for="n in 6" :key="n" class="skeleton-card"></div>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
import { computed, onServerPrefetch, defineAsyncComponent } from "vue";
import AppNavClean from "@/components/AppNavClean.vue";

const HeroCard = defineAsyncComponent({
  loader: () => import("@/components/HeroCard.vue"),
  loadingComponent: () => import("@/components/SkeletonCard.vue"),
  delay: 0,
});

import { t, currentProyectos } from "@/composables/useInhabiStore";
import { useInhabiMetrics } from "@/composables/useInhabiMetrics";

const data = currentProyectos();

onServerPrefetch(async () => {
  await data.value?.load?.(); // o la función que cargue el portafolio
});


import AppMetrics from "@/components/AppMetrics.vue";
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
  `${metrosTotales.value.toLocaleString()} <span style="color:var(--ink-soft-accent)">m<sup>2</sup></span>`,
  cantidadProyectos.value,
  cantidadCiudades.value,
]);

const labels = ["Cumpliendo", "Intervenidos", "Proyectos", "Ciudades"];
</script>

<style scoped lang="scss">
.section {
  padding: 0 clamp(20px, 4vw, 56px) 80px;
  margin: 0 auto;
  flex: 1;
  width: 100%;
  max-width: 1440px;
  &__title {
    font-family: var(--font-cursive);
    font-size: clamp(40px, 5.4vw, 88px);
    letter-spacing: -0.01em;
    color: var(--light);
    margin-top: 2rem;
  }
  &__metrics {
    margin: 1rem 0;
  }
  &__subtitle {
    font-size: 1rem;
    font-family: var(--font-mono);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--light);
    margin: 2rem 0 1rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--dark-hover);
  }
  &__proyectos {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    gap: 1rem;
    justify-content: space-around;
    &_proyecto {
      transition: all 0.3s ease;
      max-width: 25rem;
      min-width: 20rem;
      flex: 0 1 25rem;
    }
  }
}
</style>
