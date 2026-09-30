<script setup>
import { computed } from 'vue'
import { t, IMG, HERO_B } from '@/composables/useInhabiStore'

const props = defineProps({
  delay: String,
  introOn: Boolean,
})

const steps = computed(() => t.value.steps.map((x, i) => ({ n: '0' + (i + 1), k: x[0], v: x[1] })))

const kbDelay = computed(() => (props.introOn ? '2.4s' : '0s'))
</script>

<template>
  <header id="top" data-screen-label="Hero A" class="hero-a">
    <div v-parallax="0.25" class="hero-a-bg">
      <img :src="IMG('r44-157')" alt="" class="hero-a-img" :style="{ animationDelay: kbDelay }" />
    </div>
    <div class="hero-a-overlay"></div>

    <div class="hero-a-content" :style="{ animationDelay: delay }">
      <div class="eyebrow">{{ t.hero.eyebrow }}</div>

      <h1 class="hero-a-title">
        {{ t.hero.h1a }} <em style="color: #cdd2c0">{{ t.hero.h1b }}</em>
      </h1>

      <div class="hero-a-row">
        <p class="hero-a-sub">{{ t.hero.sub }}</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <a href="#configurador" class="btn-light">{{ t.hero.cta1 }}</a>
          <a href="#cotizar" class="btn-outline">{{ t.hero.cta2 }}</a>
        </div>
      </div>

      <div class="hero-a-steps">
        <div v-for="s in steps" :key="s.n" class="hero-a-step">
          <span class="hero-a-num">{{ s.n }}</span>
          <div style="display: grid; gap: 6px">
            <span class="hero-a-k">{{ s.k }}</span>
            <span class="hero-a-v">{{ s.v }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-a {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  padding-top: 120px;
}
.hero-a-bg {
  position: absolute;
  inset: -8% 0 -8% 0;
}
.hero-a-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: kb 3s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.hero-a-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(18, 17, 14, 0.55) 0%,
    rgba(18, 17, 14, 0.1) 35%,
    rgba(18, 17, 14, 0.85) 100%
  );
}
.hero-a-content {
  position: relative;
  padding: 0 clamp(20px, 4vw, 56px) 40px;
  display: grid;
  gap: 40px;
  animation: heroUp 1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.eyebrow {
  font:
    500 11px/1.4 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.hero-a-title {
  margin: 0;
  font:
    400 clamp(48px, min(8.4vw, 13vh), 148px)/0.92 'Instrument Serif',
    serif;
  letter-spacing: -0.02em;
  max-width: 14ch;
  text-wrap: balance;
}
.hero-a-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-end;
  justify-content: space-between;
}
.hero-a-sub {
  margin: 0;
  max-width: 46ch;
  font-size: 17px;
  line-height: 1.6;
  color: #d8d4c8;
  text-wrap: pretty;
}
.hero-a-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  border-top: 1px solid rgba(243, 240, 233, 0.22);
}
.hero-a-step {
  padding: 20px 20px 0 0;
  display: flex;
  gap: 16px;
  align-items: baseline;
}
.hero-a-num {
  font:
    400 13px/1 'IBM Plex Mono',
    monospace;
  color: #cdd2c0;
}
.hero-a-k {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.hero-a-v {
  font-size: 14px;
  color: #b9b5a8;
}
</style>
