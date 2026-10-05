<!-- src/components/system-design/CompareSlider.vue -->
<template>
  <div
    ref="root"
    class="compare"
    style="aspect-ratio: 1318/942; max-height: 420px"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
  >
    <img :src="imgB" alt="" />
    <img :src="imgA" alt="" :style="{ clipPath: `inset(0 ${100 - pos}% 0 0)` }" />
    <div class="compare__handle" :style="{ left: pos + '%' }">
      <div class="compare__knob">‹ ›</div>
    </div>
    <span class="badge" style="position: absolute; left: 16px; bottom: 16px">Industrial</span>
    <span class="badge badge--cream" style="position: absolute; right: 16px; bottom: 16px"
      >Natural</span
    >
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imgA = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80'
const imgB = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80'

const root = ref(null)
const pos = ref(50)
const dragging = ref(false)

const set = (e) => {
  const r = root.value?.getBoundingClientRect()
  if (!r) return
  pos.value = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100))
}
const onDown = (e) => {
  dragging.value = true
  e.currentTarget.setPointerCapture?.(e.pointerId)
  set(e)
}
const onMove = (e) => {
  if (dragging.value) set(e)
}
const onUp = () => {
  dragging.value = false
}
</script>
