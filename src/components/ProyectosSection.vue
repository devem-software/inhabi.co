<script setup>
import { computed } from 'vue'
import { t, store, currentTipo } from '@/composables/useInhabiStore.js'
import HeroCard from '@/components/HeroCard.vue'
</script>

<template>
  <section id="proyectos" class="sec">
    <div class="container">
      <div class="head">
        <p class="eyebrow">{{ t.nav.proyectos }}</p>
        <h2 class="title">{{ t.proy.eyebrow }}</h2>
      </div>

      <!-- GRID DE TARJETAS USANDO HeroCard -->
      <div class="grid-cuadrado mt-48">
        <router-link
          v-for="(p, index) in currentTipo"
          :key="index"
          :to="`/proyectos/${index}`"
          class="project-link-wrapper"
        >
          <HeroCard :image="'/' + p.id" :title="p.label" :description="p.description" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ================= ESTRUCTURA BASE ================= */
.sec {
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
  background: #f3f0e9;
  color: #1b1a16;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8f8c80;
  margin-bottom: 16px;
}
.title {
  font:
    400 clamp(2.5rem, 5vw, 5rem)/0.95 'Instrument Serif',
    serif;
  margin: 0;
  color: #12110e;
}
.mt-48 {
  margin-top: 48px;
}

/* ================= GRID CUADRADO ================= */
.grid-cuadrado {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: 2rem;
}

.project-link-wrapper {
  text-decoration: none;
  display: block;
}
</style>
