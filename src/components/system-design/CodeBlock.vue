<!-- src/components/system-design/CodeBlock.vue -->
<template>
  <pre class="code"><button
      class="copy-btn"
      :class="{ 'is-copied': copied }"
      @click="copy"
    >{{ copied ? 'Copiado' : 'Copiar' }}</button><code v-html="highlighted"></code></pre>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ code: { type: String, required: true } })
const copied = ref(false)

const escapeHtml = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const highlighted = computed(() => escapeHtml(props.code))

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1400)
  } catch (e) {
    console.error('Copy failed:', e)
  }
}
</script>

<style scoped>
.code {
  position: relative;
  margin: 0 0 32px;
  padding: 18px 20px;
  background: #0a0a08;
  border: 1px solid var(--border-dark-1);
  border-radius: var(--r-md);
  overflow-x: auto;
  font: 400 12px/1.7 var(--font-mono);
  color: #d8d4c8;
}
.code code {
  white-space: pre;
  font: inherit;
}
.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 10px;
  background: rgba(243, 240, 233, 0.06);
  color: var(--fg-soft);
  border: 1px solid var(--border-dark-2);
  border-radius: var(--r-sm);
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all var(--t-fast) var(--ease);
}
.copy-btn:hover,
.copy-btn.is-copied {
  background: var(--sage);
  color: var(--ink);
  border-color: var(--sage);
}
</style>
