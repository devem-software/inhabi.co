<script setup>
import { computed } from 'vue'
import {
  WA,
  IMG,
  store,
  t,
  currentCombo,
  currentStyle,
  currentImgs,
} from '@/composables/useInhabiStore'

const q = computed(() => store.q)

const tipos = computed(() =>
  t.value.cot.tipos.map((l, i) => {
    const active = i === q.value.tipo
    return {
      label: l,
      style: {
        background: active ? '#12110e' : 'transparent',
        color: active ? '#f3f0e9' : '#12110e',
      },
      pick: () => (store.q.tipo = i),
    }
  }),
)

const espacios = computed(() =>
  t.value.cot.esp.map((l, i) => {
    const active = q.value.esp.includes(i)
    return {
      label: l,
      mark: active ? '✓' : '+',
      style: active
        ? { background: '#12110e', color: '#f3f0e9', borderColor: '#12110e' }
        : { background: 'transparent', color: '#12110e', borderColor: 'rgba(18,17,14,.25)' },
      pick: () => {
        const arr = active ? q.value.esp.filter((x) => x !== i) : [...q.value.esp, i]
        store.q.esp = arr
      },
    }
  }),
)

const espLabels = computed(
  () => q.value.esp.map((i) => t.value.cot.esp[i]).join(', ') || t.value.cot.none,
)

const plazo = computed(() => (q.value.m2 <= 150 ? t.value.cot.plazoA : t.value.cot.plazoB))

const summary = computed(() =>
  [
    [t.value.cot.kTipo, t.value.cot.tipos[q.value.tipo]],
    [t.value.cot.kArea, q.value.m2 + ' m²'],
    [t.value.cot.kCombo, currentCombo.value[store.lang].name],
    [t.value.cot.kEstilo, currentStyle.value[store.lang].name],
    [t.value.cot.kEsp, espLabels.value],
    [t.value.cot.kPlazo, plazo.value],
  ].map((x) => ({ k: x[0], v: x[1] })),
)

const quoteMsg = computed(() => {
  const L = store.lang
  return [
    L === 'en' ? 'Hi Inhabi, I’d like a quote:' : 'Hola Inhabi, quiero una cotización:',
    `${t.value.cot.kTipo}: ${t.value.cot.tipos[q.value.tipo]}`,
    `${t.value.cot.kArea}: ${q.value.m2} m²`,
    `${t.value.cot.kCombo}: ${currentCombo.value[L].name}`,
    `${t.value.cot.kEstilo}: ${currentStyle.value[L].name}`,
    `${t.value.cot.kEsp}: ${espLabels.value}`,
    q.value.nombre && `${t.value.cot.nameL}: ${q.value.nombre}`,
    q.value.ciudad && `${t.value.cot.cityL}: ${q.value.ciudad}`,
    q.value.msg,
  ]
    .filter(Boolean)
    .join('\n')
})

const waQuote = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(quoteMsg.value)}`)

const kitchenImg = computed(() => IMG(currentImgs.value[0]))

const onM2 = (e) => (store.q.m2 = +e.target.value)
const onNombre = (e) => (store.q.nombre = e.target.value)
const onTel = (e) => (store.q.tel = e.target.value)
const onEmail = (e) => (store.q.email = e.target.value)
const onCiudad = (e) => (store.q.ciudad = e.target.value)
const onMsg = (e) => (store.q.msg = e.target.value)
</script>

<template>
  <section id="cotizar" data-screen-label="Cotizar" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div class="eyebrow">{{ t.cot.eyebrow }}</div>
        <h2 class="title">{{ t.cot.title }}</h2>
        <p class="sub">{{ t.cot.sub }}</p>
      </div>

      <div class="layout">
        <!-- Columna izquierda: formulario -->
        <div class="form-col">
          <!-- Tipo de inmueble -->
          <div class="group">
            <span class="label">{{ t.cot.tipoL }}</span>
            <div class="row">
              <button
                v-for="(o, i) in tipos"
                :key="i"
                class="chip"
                :style="o.style"
                @click="o.pick"
              >
                {{ o.label }}
              </button>
            </div>
          </div>

          <!-- Área (slider) -->
          <div class="group">
            <div class="slider-head">
              <span class="label">{{ t.cot.m2L }}</span>
              <span class="slider-value">{{ q.m2 }} m²</span>
            </div>
            <input
              type="range"
              min="20"
              max="400"
              step="5"
              :value="q.m2"
              @input="onM2"
              class="range"
            />
          </div>

          <!-- Espacios -->
          <div class="group">
            <span class="label">{{ t.cot.espL }}</span>
            <div class="row">
              <button
                v-for="(o, i) in espacios"
                :key="i"
                class="chip chip-square"
                :style="o.style"
                @click="o.pick"
              >
                {{ o.mark }} {{ o.label }}
              </button>
            </div>
          </div>

          <!-- Datos de contacto -->
          <div class="inputs-grid">
            <label class="field">
              <span class="label">{{ t.cot.nameL }}</span>
              <input :value="q.nombre" @input="onNombre" class="input" />
            </label>
            <label class="field">
              <span class="label">{{ t.cot.telL }}</span>
              <input :value="q.tel" @input="onTel" class="input" />
            </label>
            <label class="field">
              <span class="label">Email</span>
              <input :value="q.email" @input="onEmail" class="input" />
            </label>
            <label class="field">
              <span class="label">{{ t.cot.cityL }}</span>
              <input :value="q.ciudad" @input="onCiudad" class="input" />
            </label>
          </div>

          <label class="field">
            <span class="label">{{ t.cot.msgL }}</span>
            <textarea rows="3" :value="q.msg" @input="onMsg" class="input textarea"></textarea>
          </label>
        </div>

        <!-- Columna derecha: resumen sticky -->
        <aside class="side">
          <span class="label">{{ t.cot.sumT }}</span>
          <div class="kitchen">
            <img :src="kitchenImg" alt="" />
          </div>
          <div class="summary">
            <div v-for="(s, i) in summary" :key="i" class="sum-row">
              <span class="sum-k">{{ s.k }}</span>
              <span class="sum-v">{{ s.v }}</span>
            </div>
          </div>

          <template v-if="!store.sent">
            <div class="actions">
              <button class="btn-send" @click="store.sent = true">
                {{ t.cot.send }}
              </button>
              <a :href="waQuote" target="_blank" rel="noopener" class="btn-wa">
                {{ t.cot.wa }}
              </a>
            </div>
          </template>

          <template v-else>
            <div class="thanks">
              <span class="thanks-t">{{ t.cot.thanksT }}</span>
              <span class="thanks-p">{{ t.cot.thanks }}</span>
            </div>
          </template>
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
  max-width: 56ch;
  color: #4d493f;
  line-height: 1.6;
  text-wrap: pretty;
}

.layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 32px;
  align-items: start;
}
.form-col {
  grid-column: span 2;
  min-width: 0;
  display: grid;
  gap: 32px;
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
.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  cursor: pointer;
  border: 1px solid #12110e;
  padding: 12px 18px;
  border-radius: 999px;
  font: 500 14px/1 Manrope;
  transition:
    background 0.25s,
    color 0.25s;
}
.chip-square {
  border-radius: 4px;
}
.chip:hover {
  background: rgba(18, 17, 14, 0.06);
}

.slider-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.slider-value {
  font:
    400 44px/1 'Instrument Serif',
    serif;
  white-space: nowrap;
}
.range {
  width: 100%;
}

.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 16px;
}
.field {
  display: grid;
  gap: 8px;
}
.input {
  border: 0;
  border-bottom: 1px solid #12110e;
  background: transparent;
  padding: 10px 0;
  font-size: 17px;
  outline: none;
  transition: border-color 0.25s;
}
.input:focus {
  border-color: #6f7a5f;
}
.textarea {
  resize: vertical;
}

.side {
  position: sticky;
  top: 90px;
  display: grid;
  gap: 22px;
  background: #12110e;
  color: #f3f0e9;
  padding: 28px;
}
.kitchen {
  aspect-ratio: 16/10;
  overflow: hidden;
}
.kitchen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.summary {
  display: grid;
  gap: 0;
}
.sum-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(243, 240, 233, 0.12);
  font-size: 14px;
}
.sum-k {
  color: #a8a597;
}
.sum-v {
  text-align: right;
}

.actions {
  display: grid;
  gap: 10px;
}
.btn-send {
  cursor: pointer;
  border: 0;
  background: #f3f0e9;
  color: #12110e;
  padding: 17px 20px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.25s;
}
.btn-send:hover {
  background: #cdd2c0;
}
.btn-wa {
  text-align: center;
  border: 1px solid rgba(243, 240, 233, 0.4);
  padding: 16px 20px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.25s;
}
.btn-wa:hover {
  background: rgba(243, 240, 233, 0.08);
}

.thanks {
  display: grid;
  gap: 8px;
  padding: 18px;
  background: #cdd2c0;
  color: #12110e;
}
.thanks-t {
  font:
    400 26px/1.1 'Instrument Serif',
    serif;
}
.thanks-p {
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 720px) {
  .form-col {
    grid-column: span 1;
  }
}
</style>
