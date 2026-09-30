<script setup>
import { computed } from 'vue'
import { STYLES, IMG, store, t, currentStyle, scrollToId } from '@/composables/useInhabiStore'

const tabs = computed(() =>
  STYLES.map((x) => {
    const active = x.id === store.style
    return {
      id: x.id,
      n: x.n,
      name: x[store.lang].name,
      pick: () => {
        store.style = x.id
        store.hot = -1
      },
      style: {
        background: active ? '#f3f0e9' : 'transparent',
        color: active ? '#12110e' : '#f3f0e9',
        borderColor: active ? '#f3f0e9' : 'rgba(243,240,233,.3)',
      },
    }
  }),
)

const hotspots = computed(() =>
  currentStyle.value.hs.map((p, i) => {
    const active = i === store.hot
    return {
      i: String(i + 1).padStart(2, '0'),
      left: p[0] + '%',
      top: p[1] + '%',
      label: store.lang === 'en' ? p[3] : p[2],
      active,
    }
  }),
)

const moodImg = computed(() => IMG(currentStyle.value.mb))
</script>

<template>
  <section id="estilos" data-screen-label="02 Estilos" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div class="head-left">
          <div class="eyebrow">02 — {{ t.estilos.eyebrow }}</div>
          <h2 class="title">{{ t.estilos.title }}</h2>
        </div>
        <div class="tabs">
          <button v-for="s in tabs" :key="s.id" class="tab" :style="s.style" @click="s.pick">
            {{ s.n }} {{ s.name }}
          </button>
        </div>
      </div>

      <div class="grid">
        <div class="mood">
          <img
            :key="moodImg"
            :src="moodImg"
            :alt="`Moodboard ${currentStyle[store.lang].name}`"
            class="mood-img"
            :style="{ filter: store.hot >= 0 ? 'brightness(.62)' : 'none' }"
          />

          <div
            v-for="(h, i) in hotspots"
            :key="i"
            class="hotspot"
            :style="{ left: h.left, top: h.top, zIndex: h.active ? 5 : 1 }"
            @mouseenter="store.hot = i"
            @mouseleave="store.hot = -1"
          >
            <span
              class="hs-dot"
              :style="{
                width: h.active ? '18px' : '12px',
                height: h.active ? '18px' : '12px',
                background: h.active ? '#cdd2c0' : 'rgba(18,17,14,.5)',
              }"
            ></span>
            <span class="hs-label" :style="{ opacity: h.active ? 1 : 0 }">{{ h.label }}</span>
          </div>
        </div>

        <div class="details">
          <div class="details-head">
            <span class="details-name">{{ currentStyle[store.lang].name }}</span>
            <span class="details-num">{{ currentStyle.n }}</span>
          </div>
          <span class="details-kw">{{ currentStyle[store.lang].kw }}</span>
          <p class="details-d">{{ currentStyle[store.lang].d }}</p>
          <p class="details-fit">{{ currentStyle[store.lang].fit }}</p>

          <div class="mats">
            <div class="mats-title">{{ t.estilos.mat }}</div>
            <div
              v-for="(h, i) in hotspots"
              :key="i"
              class="mat-row"
              :style="{
                color: h.active ? '#cdd2c0' : '#f3f0e9',
                paddingLeft: h.active ? '12px' : '0px',
              }"
              @mouseenter="store.hot = i"
              @mouseleave="store.hot = -1"
            >
              <span style="font-size: 15px">{{ h.label }}</span>
              <span class="mat-num">{{ h.i }}</span>
            </div>
          </div>

          <button class="apply" @click="scrollToId('configurador')">{{ t.estilos.cta }} →</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  scroll-margin-top: 60px;
  background: #1b1a16;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}
.wrap {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 48px;
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
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tab {
  cursor: pointer;
  border: 1px solid transparent;
  padding: 12px 20px;
  border-radius: 999px;
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: all 0.25s;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
}
.mood {
  position: relative;
  background: #000;
  aspect-ratio: 1.1/1;
  overflow: hidden;
}
.mood-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: fadeIn 0.6s ease both;
  transition: filter 0.3s;
}
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
}
.hs-dot {
  border-radius: 50%;
  border: 1.5px solid #f3f0e9;
  box-shadow: 0 0 0 6px rgba(243, 240, 233, 0.14);
  transition: all 0.25s;
}
.hs-label {
  position: absolute;
  left: 34px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  background: #f3f0e9;
  color: #12110e;
  padding: 8px 12px;
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.08em;
  pointer-events: none;
  transition: opacity 0.2s;
}

.details {
  display: grid;
  gap: 28px;
}
.details-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.details-name {
  font:
    400 clamp(64px, 7vw, 112px)/0.9 'Instrument Serif',
    serif;
}
.details-num {
  font:
    400 13px/1 'IBM Plex Mono',
    monospace;
  color: #cdd2c0;
}
.details-kw {
  font:
    500 11px/1.4 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.details-d {
  margin: 0;
  font-size: 17px;
  line-height: 1.7;
  color: #d8d4c8;
  text-wrap: pretty;
}
.details-fit {
  margin: 0;
  font:
    italic 400 22px/1.4 'Instrument Serif',
    serif;
  color: #cdd2c0;
  text-wrap: pretty;
}

.mats {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(243, 240, 233, 0.15);
}
.mats-title {
  padding: 14px 0;
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8f8c80;
}
.mat-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(243, 240, 233, 0.1);
  cursor: default;
  transition:
    color 0.2s,
    padding 0.25s;
}
.mat-num {
  font:
    400 11px/1 'IBM Plex Mono',
    monospace;
  color: #8f8c80;
}

.apply {
  justify-self: start;
  cursor: pointer;
  border: 0;
  background: #f3f0e9;
  color: #12110e;
  padding: 16px 26px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.25s;
}
.apply:hover {
  background: #cdd2c0;
}
</style>
