<script setup>
import { t } from '@/composables/useInhabiStore'
</script>

<template>
  <section id="estudio" data-screen-label="Estudio" class="sec">
    <div v-reveal class="wrap">
      <div class="col-text">
        <div class="eyebrow">{{ t.estudio.eyebrow }}</div>
        <h2 class="title">{{ t.estudio.title }}</h2>
        <p class="p">{{ t.estudio.p1 }}</p>
        <p class="p">{{ t.estudio.p2 }}</p>
      </div>

      <div class="photo">
        <img v-parallax="-0.1" src="@/img/r02-equipo.png" alt="Equipo Inhabi en obra" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  background: #f3f0e9;
  color: #12110e;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}
.wrap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}
.col-text {
  display: grid;
  gap: 28px;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6f7a5f;
}
.title {
  margin: 0;
  font:
    400 clamp(38px, 4.6vw, 72px)/1 'Instrument Serif',
    serif;
  letter-spacing: -0.01em;
  text-wrap: balance;
}
.p {
  margin: 0;
  font-size: 17px;
  line-height: 1.7;
  color: #4d493f;
  max-width: 52ch;
  text-wrap: pretty;
}
.photo {
  position: relative;
  aspect-ratio: 4/4;
  max-height: 80vh;
  overflow: hidden;
  border-radius: 1rem;
}
.photo img {
  position: absolute;
  inset: -6% 0;
  width: 100%;
  height: 125%;
  object-fit: cover;
}
</style>
