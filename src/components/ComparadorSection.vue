<script setup>
import { ref, computed } from 'vue'
import { IMG, store, t } from '@/composables/useInhabiStore'

const cmpRef = ref(null)
const pairs = [
  ['r20-88', 'r38-136', '1318/942'],
  ['r22-92', 'r40-140', '1323/1189'],
]
const current = computed(() => pairs[store.cmpRoom])

const tabs = computed(() =>
  t.value.cmp.tabs.map((l, i) => ({
    label: l,
    pick: () => (store.cmpRoom = i),
    style: {
      background: i === store.cmpRoom ? '#12110e' : 'transparent',
      color: i === store.cmpRoom ? '#f3f0e9' : '#12110e',
    },
  })),
)

function setFrom(e) {
  const r = cmpRef.value?.getBoundingClientRect()
  if (!r) return
  store.cmp = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
}
function onDown(e) {
  e.currentTarget.setPointerCapture?.(e.pointerId)
  store.dragging = true
  setFrom(e)
}
function onMove(e) {
  if (store.dragging) setFrom(e)
}
function onUp() {
  store.dragging = false
}
</script>

<template>
  <section data-screen-label="Comparador" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div>
          <div class="eyebrow">{{ t.cmp.eyebrow }}</div>
          <h3 class="title">{{ t.cmp.title }}</h3>
        </div>
        <div class="tabs">
          <button v-for="(c, i) in tabs" :key="i" class="tab" :style="c.style" @click="c.pick">
            {{ c.label }}
          </button>
        </div>
      </div>

      <div
        ref="cmpRef"
        class="cmp"
        :style="{ aspectRatio: current[2] }"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      >
        <img :src="IMG(current[1])" alt="" class="cmp-img" />
        <img
          :src="IMG(current[0])"
          alt=""
          class="cmp-img"
          :style="{ clipPath: `inset(0 ${100 - store.cmp}% 0 0)` }"
        />

        <div class="cmp-line" :style="{ left: store.cmp + '%' }">
          <div class="cmp-handle">‹ ›</div>
        </div>

        <span class="cmp-tag cmp-tag-l">Industrial</span>
        <span class="cmp-tag cmp-tag-r">Natural</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  background: #f3f0e9;
  color: #12110e;
  padding: 0 clamp(20px, 4vw, 56px) clamp(72px, 10vw, 140px);
}
.wrap {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 32px;
}

.head {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(18, 17, 14, 0.15);
  padding-top: 48px;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6f7a5f;
  margin-bottom: 16px;
}
.title {
  margin: 0;
  font:
    400 clamp(32px, 3.6vw, 56px)/1 'Instrument Serif',
    serif;
  max-width: 20ch;
  text-wrap: balance;
}
.tabs {
  display: flex;
  gap: 6px;
}
.tab {
  cursor: pointer;
  border: 1px solid #12110e;
  padding: 11px 18px;
  border-radius: 999px;
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    background 0.25s,
    color 0.25s;
}

.cmp {
  position: relative;
  max-height: 80vh;
  overflow: hidden;
  cursor: ew-resize;
  touch-action: none;
  user-select: none;
  background: #1b1a16;
}
.cmp-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.cmp-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: #f3f0e9;
  pointer-events: none;
}
.cmp-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f3f0e9;
  color: #12110e;
  display: flex;
  align-items: center;
  justify-content: center;
  font:
    500 14px/1 'IBM Plex Mono',
    monospace;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}
.cmp-tag {
  position: absolute;
  bottom: 16px;
  padding: 8px 12px;
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  pointer-events: none;
}
.cmp-tag-l {
  left: 16px;
  background: #12110e;
  color: #f3f0e9;
}
.cmp-tag-r {
  right: 16px;
  background: #f3f0e9;
  color: #12110e;
}
</style>
