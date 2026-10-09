<script setup>
import { computed } from 'vue'
import { t,IMG } from '@/composables/useInhabiStore'


const props = defineProps({
  images: { type: Array, default: () => [] },
  duration: { type: Number, default: 35 },
  gap: { type: Number, default: 64 },
  itemWidth: { type: Number, default: 120 },
  itemHeight: { type: Number, default: 50 },
  altPrefix: { type: String, default: 'Cliente' },
  repeat: { type: Number, default: 2 },
  pauseOnHover: { type: Boolean, default: true },
  /** Si es false, la marquesina se anima incluso con prefers-reduced-motion */
  respectReducedMotion: { type: Boolean, default: true },
})

/* ── Normalización + resolución única de IMG() ───────────── */
const items = computed(() =>
  props.images.map((item, i) => {
    const isObj = item && typeof item === 'object'
    const raw = isObj ? item.src : item
    const alt = (isObj && item.alt) || `${props.altPrefix} ${i + 1}`
    return { src: raw ? IMG(`/logos/${raw}`) : '', alt }
  }),
)

/* ── Repetimos el set N veces para cubrir el viewport ────── */
const loop = computed(() => {
  const out = []
  for (let r = 0; r < props.repeat; r++) {
    for (let i = 0; i < items.value.length; i++) {
      out.push({
        ...items.value[i],
        _copy: r > 0,
        _key: `${r}-${i}`,
      })
    }
  }
  return out
})

const rootStyle = computed(() => ({
  '--marquee-gap': `${props.gap}px`,
  '--marquee-item-w': `${props.itemWidth}px`,
  '--marquee-item-h': `${props.itemHeight}px`,
  '--marquee-duration': `${props.duration}s`,
}))

/* ── Animación con Web Animations API ────────────────────── */
</script>

<template>
  <div v-if="items.length" class="marquee-section" :style="rootStyle">
    <div class="marquee-title">{{t.ag.trustLine}}</div>
    <div
      class="marquee"
      :class="{ 'is-accessible': '' }"
      role="region"
      aria-label="Logos de clientes"
    >
      <div ref="trackRef" class="marquee-track">
        <div
          v-for="item in loop"
          :key="item._key"
          class="marquee-item"
          :aria-hidden="item._copy ? 'true' : undefined"
        >
          <img :src="item.src" :alt="item.alt" loading="lazy" draggable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   MARQUEE — sin @keyframes, la animación la maneja WAAPI
   ============================================================ */

.marquee-section {
  width: 100%;
  padding-bottom: 2rem;
  font-family: 'Instrument Serif', serif;
  font-size: clamp(1rem, 5.4vw, 3rem);
  font-weight: 500;
  font-style: italic;
  text-align: left;
  line-height: 1;
  color: color-mix(in srgb, transparent, white);
  padding: 3rem clamp(20px, 4vw, 56px) 1rem clamp(20px, 4vw, 56px);
}

.marquee-title {
  margin-bottom: 1rem;
  text-align: center;
}

.marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--white, rgba(243, 240, 233, 0.5));
  border-bottom: 1px solid var(--white, rgba(243, 240, 233, 0.5));
  mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.2);
}

.marquee-track {
  display: flex;
  flex-wrap: nowrap;
  width: max-content;
  will-change: transform;
  animation: looping var(--marquee-duration) linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes looping {
  to {
    transform: translateX(-50%);
  }
}

.marquee-item {
  flex: 0 0 auto;
  width: var(--marquee-item-w, 120px);
  height: var(--marquee-item-h, 50px);
  margin-right: var(--marquee-gap, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.marquee-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(100%) brightness(1.5);
  opacity: 0.75;
  transition:
    opacity 0.3s ease,
    filter 0.3s ease;
}

.marquee-item img:hover {
  filter: grayscale(0%) brightness(1);
  opacity: 1;
}
</style>
