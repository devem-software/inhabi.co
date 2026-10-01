<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { t, IMG, HERO_B, store } from "@/composables/useInhabiStore";

const props = defineProps({ delay: String });

const steps = computed(() => t.value.steps.map((x, i) => ({ n: "0" + (i + 1), k: x[0], v: x[1] })));

let timer;
onMounted(() => {
  timer = setInterval(() => {
    store.heroI = (store.heroI + 1) % HERO_B.length;
  }, 5200);
});
onUnmounted(() => clearInterval(timer));

const slides = computed(() =>
  HERO_B.map((x, i) => ({
    src: IMG(x[0]),
    op: i === store.heroI ? 1 : 0,
    sc: i === store.heroI ? 1 : 1.08,
    bar: i === store.heroI ? "#f3f0e9" : "rgba(243,240,233,.35)",
    go: () => (store.heroI = i),
  })),
);

const caption = computed(() => HERO_B[store.heroI][1]);
</script>

<template>
  <header id="top" data-screen-label="Hero B" class="hero-b">
    <div class="hero-b-left">
      <div class="hero-b-top" :style="{ animationDelay: delay }">
        <div class="eyebrow">{{ t.hero.eyebrow }}</div>
        <h1 class="hero-b-title">
          {{ t.hero.h1a }} <em style="color: #cdd2c0">{{ t.hero.h1b }}</em>
        </h1>
        <p class="hero-b-sub">{{ t.hero.sub }}</p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap">
          <a href="#configurador" class="btn-light">{{ t.hero.cta1 }}</a>
          <a href="#cotizar" class="btn-outline">{{ t.hero.cta2 }}</a>
        </div>
      </div>

      <div class="hero-b-steps">
        <div v-for="s in steps" :key="s.n" class="hero-b-step">
          <span class="hero-b-num">{{ s.n }}</span>
           <span class="hero-b-k">{{ s.k }}</span> 
          <span class="hero-b-v">{{ s.v }}</span>
        </div>
      </div>
    </div>

    <div class="hero-b-right">
      <img
        v-for="(s, i) in slides"
        :key="i"
        :src="s.src"
        alt=""
        class="hero-b-img"
        :style="{ opacity: s.op, transform: `scale(${s.sc})` }"
      />

      <div class="hero-b-cap-row">
        <span class="hero-b-cap">{{ caption }}</span>
        <div style="display: flex; gap: 6px">
          <button
            v-for="(s, i) in slides"
            :key="i"
            @click="s.go"
            aria-label="slide"
            class="hero-b-bar"
            :style="{ background: s.bar }"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hero-b {
  min-height: 100vh;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 460px), 1fr));
}
.hero-b-left {
  padding: 130px clamp(20px, 4vw, 56px) 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  background: #12110e;
}
.hero-b-top {
  display: grid;
  gap: 28px;
  animation: heroUp 1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
.eyebrow {
  font:
    500 11px/1.4 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.hero-b-title {
  margin: 0;
  font:
    400 clamp(52px, 6.6vw, 120px)/0.94 "Instrument Serif",
    serif;
  letter-spacing: -0.02em;
  text-wrap: balance;
}
.hero-b-sub {
  margin: 0;
  max-width: 44ch;
  font-size: 17px;
  line-height: 1.6;
  color: #d8d4c8;
  text-wrap: pretty;
}
.hero-b-steps {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(243, 240, 233, 0.22);
}
.hero-b-step {
  padding: 16px 0;
  border-bottom: 1px solid rgba(243, 240, 233, 0.12);
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  align-items: baseline;
}
.hero-b-num {
  font:
    400 13px/1 "IBM Plex Mono",
    monospace;
  color: #cdd2c0;
}
.hero-b-k {
  font:
    500 11px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.hero-b-v {
  font-size: 14px;
  color: #b9b5a8;
  text-align: right;
}

.hero-b-right {
  position: relative;
  min-height: 70vh;
  overflow: hidden;
  background: #1b1a16;
}
.hero-b-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    opacity 1.4s ease,
    transform 6s ease-out;
}
.hero-b-cap-row {
  position: absolute;
  left: 24px;
  bottom: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}
.hero-b-cap {
  font:
    500 11px/1.4 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: rgba(18, 17, 14, 0.7);
  padding: 8px 12px;
  border-radius: 4px;
}
.hero-b-bar {
  width: 28px;
  height: 3px;
  border: 0;
  padding: 0;
  cursor: pointer;
}
</style>
