<template>
  <div
    class="swatch swatch--clickable"
    :class="{ 'is-copied': isCopied }"
    role="button"
    tabindex="0"
    :aria-label="`Copiar ${hex} al portapapeles`"
    @click="copy"
    @keydown.enter.prevent="copy"
    @keydown.space.prevent="copy"
  >
    <div class="swatch__color" :style="{ background: hex, borderBottom }">
      <transition name="fade">
        <span v-if="isCopied" class="swatch__feedback">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copiado
        </span>
      </transition>
    </div>
    <div class="swatch__meta">
      <p class="swatch__name">{{ name }}</p>
      <p class="swatch__hex">{{ normalizeHex(hex) }}</p>
      <p class="swatch__token">{{ token }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  token: { type: String, default: '' },
  /** Ej: '1px solid rgba(243,240,233,.1)' */
  borderBottom: { type: String, default: 'none' },
})

const isCopied = ref(false)
let timer = null

/** Normaliza a #RRGGBB en mayúsculas (con # inicial) */
const normalizeHex = (input) => {
  let h = String(input).trim()
  if (!h.startsWith('#')) h = '#' + h
  // Expandir #RGB → #RRGGBB
  if (/^#[0-9a-f]{3}$/i.test(h)) {
    h =
      '#' +
      h
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
  }
  return h.toUpperCase()
}

const copy = async () => {
  const value = normalizeHex(props.hex)
  let ok = false

  // API moderna
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      ok = true
    } catch {
      ok = false
    }
  }

  // Fallback para navegadores sin permisos / http
  if (!ok) {
    try {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      ok = true
    } catch {
      ok = false
    }
  }

  if (!ok) return

  isCopied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (isCopied.value = false), 1300)
}
</script>

<style scoped>
.swatch--clickable {
  cursor: pointer;
  transition:
    transform var(--t-fast) var(--ease),
    border-color var(--t-fast) var(--ease);
}
.swatch--clickable:hover {
  transform: translateY(-2px);
  border-color: var(--sage);
}
.swatch--clickable:focus-visible {
  outline: 2px solid var(--sage);
  outline-offset: 3px;
}
.swatch--clickable.is-copied {
  border-color: var(--sage);
}

.swatch__color {
  position: relative;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swatch__feedback {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--sage);
  color: var(--ink);
  border-radius: 999px;
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s var(--ease),
    transform 0.2s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
</style>
