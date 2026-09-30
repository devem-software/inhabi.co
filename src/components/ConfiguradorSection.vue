<script setup>
import { computed } from 'vue'
import {
  COMBOS,
  STYLES,
  IMG,
  store,
  t,
  currentImgs,
  currentLabel,
  scrollToId,
} from '@/composables/useInhabiStore'

const current = computed(() => currentImgs.value[store.room])

const rooms = computed(() =>
  currentImgs.value.map((r, i) => ({
    src: IMG(r),
    label: t.value.config.rooms[i],
    active: i === store.room,
    pick: () => (store.room = i),
  })),
)

const comboOpts = computed(() =>
  COMBOS.map((c) => {
    const active = c.id === store.combo
    return {
      n: c.n,
      name: c[store.lang].name,
      style: active
        ? { background: '#12110e', color: '#f3f0e9', borderColor: '#12110e' }
        : { background: 'transparent', color: '#12110e', borderColor: 'rgba(18,17,14,.25)' },
      pick: () => (store.combo = c.id),
    }
  }),
)

const styleOpts = computed(() =>
  STYLES.map((x) => {
    const active = x.id === store.style
    return {
      name: x[store.lang].name,
      img: IMG(x.mb),
      style: active
        ? { background: '#12110e', color: '#f3f0e9', borderColor: '#12110e' }
        : { background: 'transparent', color: '#12110e', borderColor: 'rgba(18,17,14,.25)' },
      pick: () => (store.style = x.id),
    }
  }),
)
</script>

<template>
  <section id="configurador" data-screen-label="Configurador" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div class="head-left">
          <div class="eyebrow">{{ t.config.eyebrow }}</div>
          <h2 class="title">{{ t.config.title }}</h2>
        </div>
        <p class="sub">{{ t.config.sub }}</p>
      </div>

      <div class="layout">
        <div class="viewer-col">
          <div class="viewer">
            <div :key="current" class="viewer-anim">
              <img :src="IMG(current)" alt="" class="viewer-bg" />
              <img :src="IMG(current)" :alt="currentLabel" class="viewer-fg" />
            </div>
            <div class="badges">
              <span class="badge">{{ currentLabel }}</span>
            </div>
          </div>

          <div class="thumbs">
            <button v-for="(r, i) in rooms" :key="i" class="thumb" @click="r.pick">
              <div
                class="thumb-media"
                :style="{ outlineColor: r.active ? '#12110e' : 'transparent' }"
              >
                <img :src="r.src" :alt="r.src" />
              </div>
              <span class="thumb-label" :style="{ color: r.active ? '#12110e' : '#6b675c' }">{{
                r.label
              }}</span>
            </button>
          </div>
        </div>

        <aside class="panel">
          <div class="group">
            <span class="label">01 · {{ t.config.comboL }}</span>
            <div class="stack">
              <button
                v-for="o in comboOpts"
                :key="o.n"
                class="combo-btn"
                :style="o.style"
                @click="o.pick"
              >
                <span>{{ o.name }}</span>
                <span class="combo-num">{{ o.n }}</span>
              </button>
            </div>
          </div>

          <div class="group">
            <span class="label">02 · {{ t.config.styleL }}</span>
            <div class="style-grid">
              <button
                v-for="o in styleOpts"
                :key="o.name"
                class="style-btn"
                :style="o.style"
                @click="o.pick"
              >
                <div class="style-img"><img :src="o.img" alt="" /></div>
                <span class="style-name">{{ o.name }}</span>
              </button>
            </div>
          </div>

          <div class="sel">
            <span class="label">{{ t.config.yourSel }}</span>
            <span class="sel-name">{{ currentLabel }}</span>
            <span class="sel-note">{{ t.config.note }}</span>
          </div>

          <a href="#cotizar" class="cta">{{ t.config.cta }} →</a>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  scroll-margin-top: 60px;
  background: #f3f0e9;
  color: #12110e;
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
  color: #6f7a5f;
}
.title {
  margin: 0;
  font:
    400 clamp(40px, 5.4vw, 88px)/0.95 'Instrument Serif',
    serif;
  letter-spacing: -0.01em;
  max-width: 18ch;
  text-wrap: balance;
}
.sub {
  margin: 0;
  max-width: 40ch;
  color: #4d493f;
  line-height: 1.6;
}

.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 32px;
  align-items: start;
}
.viewer-col {
  grid-column: span 2;
  min-width: 0;
  display: grid;
  gap: 14px;
}

.viewer {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #1b1a16;
}
.viewer-anim {
  position: absolute;
  inset: 0;
  animation: fadeIn 0.7s ease both;
}
.viewer-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(28px) brightness(0.55);
  transform: scale(1.2);
}
.viewer-fg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.badges {
  position: absolute;
  left: 16px;
  top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.badge {
  background: #12110e;
  color: #f3f0e9;
  padding: 8px 12px;
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.thumbs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.thumb {
  all: unset;
  cursor: pointer;
  display: grid;
  gap: 8px;
}
.thumb-media {
  aspect-ratio: 16/9;
  overflow: hidden;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color 0.25s;
}
.thumb-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumb-label {
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: color 0.25s;
}

.panel {
  display: grid;
  gap: 28px;
  background: #e6e1d6;
  padding: 28px;
}
.group {
  display: grid;
  gap: 12px;
}
.label {
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6f7a5f;
}
.stack {
  display: grid;
  gap: 6px;
}
.combo-btn {
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid;
  padding: 14px 16px;
  font:
    400 24px/1 'Instrument Serif',
    serif;
  transition: all 0.2s;
}
.combo-num {
  font:
    400 11px/1 'IBM Plex Mono',
    monospace;
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.style-btn {
  cursor: pointer;
  display: grid;
  gap: 0;
  border: 1px solid;
  padding: 0;
  overflow: hidden;
  transition: all 0.2s;
}
.style-img {
  aspect-ratio: 1;
  overflow: hidden;
}
.style-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.style-name {
  padding: 10px 4px;
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sel {
  display: grid;
  gap: 10px;
  border-top: 1px solid rgba(18, 17, 14, 0.15);
  padding-top: 20px;
}
.sel-name {
  font:
    400 32px/1.05 'Instrument Serif',
    serif;
}
.sel-note {
  font-size: 14px;
  line-height: 1.5;
  color: #4d493f;
}

.cta {
  text-align: center;
  background: #12110e;
  color: #f3f0e9;
  padding: 17px 20px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.25s;
}
.cta:hover {
  background: #2b2a24;
  color: #f3f0e9;
}

@media (max-width: 720px) {
  .viewer-col {
    grid-column: span 1;
  }
}
</style>
