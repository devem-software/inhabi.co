<script setup>
import { ref, computed } from 'vue'
import {
  COMBOS,
  STYLES,
  WA,
  IMG,
  store,
  t,
  currentCombo,
  currentStyle,
  currentImgs,
} from '@/composables/useInhabiStore'

// Control de pasos
const step = ref(1)
const nextStep = () => { if (step.value < 3) step.value++ }
const prevStep = () => { if (step.value > 1) step.value-- }

// --- PASO 1: ÁREA Y ESPACIOS ---
const q = computed(() => store.q)

// Espacios con contadores
var as  = []
const spaceLabels = ['Cocina', 'Habitaciones', 'Baños', 'Lavandería', 'Sala', 'Comedor']
const spaceCounts = ref([1, 2, 1, 1, 1, 0])

const increment = (i) => spaceCounts.value[i]++
const decrement = (i) => {
  if (spaceCounts.value[i] > 0) spaceCounts.value[i]--
}

const espLabelsSelected = computed(() => {
  const selected = []
  spaceCounts.value.forEach((count, i) => {
    if (count > 0) selected.push(`${count} ${spaceLabels[i]}`)
  })
  return selected.join(', ') || 'Ninguno'
})

const onM2 = (e) => (store.q.m2 = +e.target.value)

// --- PASO 2: COMBO Y ESTILO ---
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

// --- PASO 3: INFORMACIÓN DEL CLIENTE ---
const onNombre = (e) => (store.q.nombre = e.target.value)
const onApellido = (e) => (store.q.apellido = e.target.value)
const onTel = (e) => (store.q.tel = e.target.value)
const onEmail = (e) => (store.q.email = e.target.value)
const onCiudad = (e) => (store.q.ciudad = e.target.value)
const onDireccion = (e) => (store.q.direccion = e.target.value)

// --- RESUMEN, VISOR DE ESPACIOS Y WHATSAPP ---

// Opciones del visor de imágenes basadas en ConfiguradorSection.vue
const roomOpts = computed(() =>
  currentImgs.value.map((r, i) => ({
    label: t.value.config.rooms[i],
    active: i === store.room,
    pick: () => (store.room = i),
  })),
)
console.log(roomOpts.value)
// Imagen actual según la habitación seleccionada
const currentRoomImg = computed(() => IMG(currentImgs.value[store.room]))

const summary = computed(() => [
  { k: 'Área', v: q.value.m2 + ' m²' },
  { k: 'Espacios', v: espLabelsSelected.value },
  { k: 'Combo', v: currentCombo.value[store.lang].name },
  { k: 'Estilo', v: currentStyle.value[store.lang].name },
])

const quoteMsg = computed(() => {

  return `Hola Inhabi, estoy interesad@ en remodelar mi apartamento:

*INFORMACIÓN DEL APARTAMENTO*
_Área:_ *${q.value.m2}*m²

_Espacios:_
${espLabelsSelected.value.split(", ").map(s => {as = s.split(" "); return `- *${as[0]}* ${as[1]}`}).join("\n")}

*PAQUETE*
_Combo:_ *${currentCombo.value[store.lang].name}*
_Estilo:_ *${currentStyle.value[store.lang].name}*

*INFORMACIÓN DEL CLIENTE*
_Nombre:_ ${q.value.nombre || '-'}
_Apellido:_ ${q.value.apellido || '-'}
_Teléfono:_ ${q.value.tel || '-'}
_Email:_ ${q.value.email || '-'}
_Ciudad:_ ${q.value.ciudad || '-'}
_Dirección:_ ${q.value.direccion || '-'}`
})
const waQuote = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(quoteMsg.value)}`)
</script>

<template>
  <section id="cotizador-pasos" class="sec">
    <div class="wrap">

      <!-- Título de la sección -->

      <div class="layout">

        <!-- ==============================================
             COLUMNA IZQUIERDA: CONTENIDO DEL PASO ACTUAL
             ============================================== -->
        <div class="form-col">
          <div v-reveal class="head">
            <div class="head-left">
              <h2 class="title">
                <span v-if="step === 1">Configura tus espacios</span>
                <span v-if="step === 2">Selecciona tu diseño</span>
                <span v-if="step === 3">Tus datos de contacto</span>
              </h2>
            </div>
          </div>

          <!-- PASO 1 -->
          <div v-if="step === 1" class="step-content anim-fade">
            <div class="group">
              <div class="slider-head">
                <span class="label">Área aproximada</span>
                <span class="slider-value">{{ q.m2 }} m²</span>
              </div>
              <input type="range" min="10" max="70" step="1" :value="q.m2" @input="onM2" class="range" />
            </div>

            <div class="group mt-32">
              <span class="label">Espacios a intervenir</span>
              <div class="counter-grid">
                <div
                  v-for="(label, i) in spaceLabels"
                  :key="i"
                  class="counter-chip"
                  :class="{ 'is-active': spaceCounts[i] > 0 }"
                >
                  <span class="counter-name">{{ label }}</span>
                  <div class="counter-ctrls">
                    <button @click="decrement(i)">-</button>
                    <span>{{ spaceCounts[i] }}</span>
                    <button @click="increment(i)">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PASO 2 -->
          <div v-if="step === 2" class="step-content anim-fade">
            <div class="group">
              <span class="label">01 · Selección de Combo</span>
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

            <div class="group mt-32">
              <span class="label">02 · Estilo de diseño</span>
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
          </div>

          <!-- PASO 3 -->
          <div v-if="step === 3" class="step-content anim-fade">
            <div class="inputs-grid">
              <label class="field">
                <span class="label">Nombres</span>
                <input :value="q.nombre" @input="onNombre" class="input" placeholder="Tu nombre" />
              </label>
              <label class="field">
                <span class="label">Apellidos</span>
                <input :value="q.apellido" @input="onApellido" class="input" placeholder="Tu apellido" />
              </label>
              <label class="field">
                <span class="label">Teléfono</span>
                <input :value="q.tel" @input="onTel" class="input" placeholder="Tu teléfono" />
              </label>
              <label class="field">
                <span class="label">Correo electrónico</span>
                <input :value="q.email" @input="onEmail" type="email" class="input" placeholder="Tu correo" />
              </label>
              <label class="field">
                <span class="label">Ciudad</span>
                <input :value="q.ciudad" @input="onCiudad" class="input" placeholder="Ej. Bogotá" />
              </label>
              <label class="field" style="grid-column: 1 / -1;">
                <span class="label">Dirección del proyecto</span>
                <input :value="q.direccion" @input="onDireccion" class="input" placeholder="Dirección del inmueble" />
              </label>
            </div>
          </div>
        </div>

        <!-- ==============================================
             COLUMNA DERECHA: STEPPER Y RESUMEN
             ============================================== -->
        <aside class="side">

          <!-- Stepper Visual -->
          <div class="stepper-wrap">
            <div class="step-circle" :class="{ 'is-active': step >= 1 }">1</div>
            <div class="step-line" :class="{ 'is-active': step >= 2 }"></div>
            <div class="step-circle" :class="{ 'is-active': step >= 2 }">2</div>
            <div class="step-line" :class="{ 'is-active': step >= 3 }"></div>
            <div class="step-circle" :class="{ 'is-active': step >= 3 }">3</div>
          </div>

          <span class="label mt-8">Resumen de tu cotización</span>

          <!-- Visor de Espacios -->
          <div class="room-viewer">
            <div class="room-selector">
              <button
                v-for="(r, i) in roomOpts"
                :key="i"
                class="room-tab"
                :class="{ 'is-active': r.active }"
                @click="r.pick"
              >
                {{ r.label }}
              </button>
            </div>

            <div class="room-img" :key="store.room">
              <img :src="currentRoomImg" :alt="roomOpts[store.room].label" class="anim-fade" />
            </div>
          </div>

          <div class="summary">
            <div v-for="(s, i) in summary" :key="i" class="sum-row">
              <span class="sum-k">{{ s.k }}</span>
              <span class="sum-v">{{ s.v }}</span>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="actions">
            <div v-if="step < 3" class="step-nav">
              <button class="btn-outline" :disabled="step === 1" @click="prevStep">
                Atrás
              </button>
              <button class="btn-send" @click="nextStep">
                Siguiente
              </button>
            </div>

            <div v-else class="step-nav-final">
               <button class="btn-outline" @click="prevStep">
                Atrás
              </button>
              <a :href="waQuote" target="_blank" rel="noopener" class="btn-wa">
                Enviar a WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  background: #f3f0e9;
  color: #12110e;
  padding: clamp(5rem, 10vw, 7rem) clamp(1rem, 4vw, 3rem);
  padding-bottom:1rem;
  min-height: 100dvh;
}
.wrap {
  max-width: 1400px;
  margin: 0 auto;
  /*display: grid;*/
}
.head-left {
  display: grid;
  gap: 12px;
}
.title {
  margin: 0;
  font: 400 clamp(40px, 5.4vw, 88px)/0.95 'Instrument Serif', serif;
  max-width: 18ch;
}
.mt-8 { margin-top: 8px; }

/* LAYOUT PRINCIPAL */
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Animaciones */
.anim-fade {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.mt-32 { margin-top: 32px; }

.group {
  display: grid;
  gap: 1rem;
}

.label {
  font: 500 .75rem/1 'IBM Plex Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6f7a5f;
}

/* SLIDER */
.slider-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.slider-value {
  font: 400 3rem/1 'Instrument Serif', serif;
  white-space: nowrap;
}
.range {
  width: 100%;
}

/* CONTADORES (Paso 1) */
.counter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}
.counter-chip {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgba(18,17,14,0.25);
  padding: .5rem;
  border-radius: 1rem;
  transition: all 0.25s;
}
.counter-chip.is-active {
  border-color: #12110e;
  background: #1B1A16;
  color: #f3f0e9;
}
.counter-name {
  font: 600 13px/1.2 Manrope;
  text-align: center;
}
.counter-ctrls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 999px;
  padding: 4px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
}
.counter-chip:not(.is-active) .counter-ctrls {
  background: rgba(18,17,14,0.06);
}
.counter-chip.is-active .counter-ctrls {
  background: rgba(243,240,233,0.15);
}
.counter-ctrls button {
  border: none;
  background: transparent;
  color: inherit;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
  transition: background 0.2s;
}
.counter-chip:not(.is-active) .counter-ctrls button:hover {
  background: rgba(18,17,14,0.1);
}
.counter-chip.is-active .counter-ctrls button:hover {
  background: rgba(243,240,233,0.2);
}

/* BOTONES COMBO & ESTILO (Paso 2) */
.stack {
  display: grid;
  gap: .5rem;
}
.combo-btn {
  cursor: pointer;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid;
  padding: 14px 16px;
  font: 400 24px/1 'Instrument Serif', serif;
  transition: all 0.2s;
  border-radius:10rem;
}
.combo-num {
  font: 400 1rem/1 'IBM Plex Mono', monospace;
}
.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(6px, 2vw, 1.5rem);
}
.style-btn {
  cursor: pointer;
  display: grid;
  gap: 0;
  border: 1px solid;
  padding: 0;
  overflow: hidden;
  transition: all 0.2s;
  border-radius:.25rem;
}
.style-img {
  aspect-ratio: 1/1;
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
  font: 500 10px/1 'IBM Plex Mono', monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
}

/* FORMULARIOS (Paso 3) */
.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 24px 16px;
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
  font-size: 1rem;
  outline: none;
  transition: border-color 0.25s;
}
.input:focus {
  border-color: #6f7a5f;
}

/* ASIDE - STEPPER, VISOR Y RESUMEN */
.side {
  position: sticky;
  display: grid;
  gap: 1rem;
  background: #12110e;
  color: #f3f0e9;
  padding: 1.5rem;
  border-radius: 1rem;
}

/* Stepper */
.stepper-wrap {
  display: flex;
  align-items: center;
  gap: .5rem;
}
.step-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid #6f7a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 500 .75rem/1 'IBM Plex Mono', monospace;
  color: #6f7a5f;
  transition: all 0.3s ease;
}
.step-circle.is-active {
  background: #6f7a5f;
  color: #12110e;
}
.step-line {
  flex: 1;
  height: 2px;
  background: rgba(243, 240, 233, 0.12);
  transition: all 0.3s ease;
}
.step-line.is-active {
  background: #6f7a5f;
}

/* Visor de espacios dinámico */
.room-viewer {
  display: grid;
  gap: 1rem;
}
.room-selector {
  display: flex;
  gap: 1rem;
  background: rgba(243, 240, 233, 0.05);
  padding: .5rem;
  border-radius: 2rem;
  width:100%;
}
.room-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: #a8a597;
  font: 500 10px/1 'IBM Plex Mono', monospace;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 4px;
  border-radius: .75rem;
  cursor: pointer;
  transition: all 0.2s;
  border:1px solid rgba(243, 240, 233, 0.12);
  flex:1;
}
.room-tab.is-active {
  background: #f3f0e9;
  color: #12110e;
}
.room-tab:hover:not(.is-active) {
  color: #f3f0e9;
}
.room-img {
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #1b1a16;
  margin:0 auto;
}
.room-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Resumen final */
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

/* Botones Acción */
.actions {
  margin-top: 10px;
}
.step-nav, .step-nav-final {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
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
.btn-outline {
  cursor: pointer;
  border: 1px solid rgba(243, 240, 233, 0.4);
  background: transparent;
  color: #f3f0e9;
  padding: 16px 12px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.25s;
}
.btn-outline:hover:not(:disabled) {
  background: rgba(243, 240, 233, 0.08);
}
.btn-outline:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.btn-wa {
  text-align: center;
  background: #6f7a5f;
  color: #f3f0e9;
  padding: 17px 20px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.25s;
  text-decoration: none;
}
.btn-wa:hover {
  background: #5a634d;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
