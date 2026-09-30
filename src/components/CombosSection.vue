<script setup>
import { computed } from 'vue'
import { COMBOS, IMG, store, t, scrollToId } from '@/composables/useInhabiStore'

const items = computed(() =>
  COMBOS.map((c) => ({
    id: c.id,
    n: c.n,
    img: IMG(c.img),
    name: c[store.lang].name,
    kw: c[store.lang].kw,
    d: c[store.lang].d,
    active: c.id === store.combo,
    pick: () => {
      store.combo = c.id
      scrollToId('configurador')
    },
  })),
)
</script>

<template>
  <section id="combos" data-screen-label="01 Combos" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div class="head-left">
          <div class="eyebrow">01 — {{ t.combos.eyebrow }}</div>
          <h2 class="title">{{ t.combos.title }}</h2>
        </div>
        <p class="sub">{{ t.combos.sub }}</p>
      </div>

      <div class="grid">
        <button
          v-for="c in items"
          :key="c.id"
          class="card"
          :class="{ active: c.active }"
          @click="c.pick"
        >
          <div class="card-media">
            <img :src="c.img" alt="" />
          </div>
          <div class="card-body">
            <div class="card-head">
              <span class="card-name">{{ c.name }}</span>
              <span class="card-num">{{ c.n }}</span>
            </div>
            <span class="card-kw">{{ c.kw }}</span>
            <p class="card-d">{{ c.d }}</p>
            <span class="card-cta">{{ t.combos.cta }} →</span>
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  scroll-margin-top: 60px;
  background: #12110e;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}
.wrap {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 56px;
}
.head {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-end;
}
.head-left {
  display: grid;
  gap: 20px;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.title {
  margin: 0;
  font:
    400 clamp(40px, 5.4vw, 88px)/0.95 'Instrument Serif',
    serif;
  letter-spacing: -0.01em;
  max-width: 16ch;
  text-wrap: balance;
}
.sub {
  margin: 0;
  max-width: 40ch;
  color: #b9b5a8;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 20px;
}
.card {
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: #000;
  border: 1px solid rgba(243, 240, 233, 0.12);
  transition:
    border-color 0.3s,
    transform 0.4s;
}
.card.active {
  border-color: #cdd2c0;
}
.card:hover {
  transform: translateY(-4px);
}

.card-media {
  aspect-ratio: 1536/1024;
  overflow: hidden;
  position: relative;
}
.card-media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.card-body {
  padding: 24px;
  display: grid;
  gap: 14px;
  border-top: 1px solid rgba(243, 240, 233, 0.12);
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.card-name {
  font:
    400 40px/1 'Instrument Serif',
    serif;
}
.card-num {
  font:
    400 12px/1 'IBM Plex Mono',
    monospace;
  color: #cdd2c0;
}
.card-kw {
  font:
    500 10px/1.4 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.card-d {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #b9b5a8;
  text-wrap: pretty;
}
.card-cta {
  font: 600 13px/1 Manrope;
  color: #f3f0e9;
  margin-top: 6px;
}
</style>
