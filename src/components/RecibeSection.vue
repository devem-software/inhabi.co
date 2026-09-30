<script setup>
import { t } from '@/composables/useInhabiStore'
</script>

<template>
  <section data-screen-label="03 Recibe" class="sec">
    <img v-parallax="0.18" src="@/img/r29-113.jpg" alt="" class="bg" />
    <div class="overlay"></div>

    <div v-reveal class="content">
      <div class="eyebrow">03 — {{ t.recibe.eyebrow }}</div>
      <div class="number-row">
        <span class="number">60</span>
        <span class="days">{{ t.recibe.days }}</span>
      </div>
      <p class="p">{{ t.recibe.p }}</p>
    </div>
  </section>
</template>

<style scoped>
.sec {
  position: relative;
  overflow: hidden;
  min-height: 90vh;
  display: flex;
  align-items: center;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}
.bg {
  position: absolute;
  left: 0;
  top: -12%;
  width: 100%;
  height: 124%;
  object-fit: cover;
}
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(18, 17, 14, 0.9) 0%,
    rgba(18, 17, 14, 0.6) 50%,
    rgba(18, 17, 14, 0.2) 100%
  );
}
.content {
  position: relative;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 28px;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.number-row {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.number {
  font:
    400 clamp(140px, 22vw, 340px)/0.78 'Instrument Serif',
    serif;
  letter-spacing: -0.04em;
}
.days {
  font:
    400 clamp(32px, 4vw, 64px)/1 'Instrument Serif',
    serif;
  font-style: italic;
  color: #cdd2c0;
  padding-bottom: 0.3em;
}
.p {
  margin: 0;
  max-width: 44ch;
  font-size: 18px;
  line-height: 1.6;
  color: #e2ded2;
  text-wrap: pretty;
}
</style>
