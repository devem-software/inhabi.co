<script setup>
import { computed } from 'vue'
import { WA, store, t } from '@/composables/useInhabiStore'

const SLOTS = ['9:00', '10:30', '12:00', '14:30', '16:00', '17:30']

/* Genera los próximos 12 días hábiles a partir del 28 de septiembre de 2026 */
const days = (() => {
  const out = []
  const d0 = new Date(2026, 8, 28)
  for (let i = 0; out.length < 12; i++) {
    const d = new Date(d0)
    d.setDate(d0.getDate() + i)
    if (d.getDay() !== 0) out.push(d)
  }
  return out
})()

const loc = computed(() => (store.lang === 'en' ? 'en-US' : 'es-CO'))

const modes = computed(() =>
  t.value.ag.modes.map((l, i) => {
    const active = i === store.mode
    return {
      label: l,
      pick: () => (store.mode = i),
      style: {
        background: active ? '#12110e' : 'transparent',
        color: active ? '#f3f0e9' : '#12110e',
      },
    }
  }),
)

const dayItems = computed(() =>
  days.map((d, i) => {
    const active = i === store.day
    return {
      wd: d.toLocaleDateString(loc.value, { weekday: 'short' }).replace('.', ''),
      num: d.getDate(),
      mo: d.toLocaleDateString(loc.value, { month: 'short' }).replace('.', ''),
      pick: () => {
        store.day = i
        store.booked = false
      },
      style: active
        ? { background: '#12110e', color: '#f3f0e9', borderColor: '#12110e' }
        : { background: 'transparent', color: '#12110e', borderColor: 'rgba(18,17,14,.25)' },
    }
  }),
)

const slotItems = computed(() =>
  SLOTS.map((l, i) => {
    const active = i === store.slot
    return {
      label: l,
      pick: () => {
        store.slot = i
        store.booked = false
      },
      style: active
        ? { background: '#12110e', color: '#f3f0e9', borderColor: '#12110e' }
        : { background: 'transparent', color: '#12110e', borderColor: 'rgba(18,17,14,.25)' },
    }
  }),
)

const dayObj = computed(() => (store.day >= 0 ? days[store.day] : null))

const bookReady = computed(() => !!(dayObj.value && store.slot >= 0))

const bookLabel = computed(() =>
  bookReady.value
    ? `${t.value.ag.modes[store.mode]} · ${dayObj.value.toLocaleDateString(loc.value, { weekday: 'long', day: 'numeric', month: 'long' })} · ${SLOTS[store.slot]}`
    : t.value.ag.pick,
)

const bookBg = computed(() => (bookReady.value ? '#12110e' : '#8f8c80'))

const waBook = computed(
  () =>
    `https://wa.me/${WA}?text=${encodeURIComponent(
      (store.lang === 'en' ? 'Hi Inhabi, I’d like to book: ' : 'Hola Inhabi, quiero agendar: ') +
        bookLabel.value,
    )}`,
)

const book = () => {
  if (bookReady.value) store.booked = true
}
</script>

<template>
  <section id="agenda" data-screen-label="Agenda" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div class="eyebrow">{{ t.ag.eyebrow }}</div>
        <h2 class="title">{{ t.ag.title }}</h2>
        <p class="sub">{{ t.ag.sub }}</p>
        <div class="modes">
          <button v-for="(m, i) in modes" :key="i" class="chip" :style="m.style" @click="m.pick">
            {{ m.label }}
          </button>
        </div>
      </div>

      <div class="panel">
        <!-- Días -->
        <span class="label">{{ t.ag.dayL }}</span>
        <div class="days">
          <button v-for="(d, i) in dayItems" :key="i" class="day" :style="d.style" @click="d.pick">
            <span class="day-wd">{{ d.wd }}</span>
            <span class="day-num">{{ d.num }}</span>
            <span class="day-mo">{{ d.mo }}</span>
          </button>
        </div>

        <!-- Horas -->
        <span class="label">{{ t.ag.timeL }}</span>
        <div class="slots">
          <button
            v-for="(s, i) in slotItems"
            :key="i"
            class="slot"
            :style="s.style"
            @click="s.pick"
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Confirmación -->
        <template v-if="!store.booked">
          <button class="book" :style="{ background: bookBg }" :disabled="!bookReady" @click="book">
            {{ bookLabel }}
          </button>
        </template>

        <template v-else>
          <div class="booked">
            <span class="booked-t">{{ t.ag.okT }}</span>
            <span class="booked-p">{{ bookLabel }}</span>
            <a :href="waBook" target="_blank" rel="noopener" class="booked-wa">
              {{ t.ag.okWa }} →
            </a>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  scroll-margin-top: 60px;
  background: #e6e1d6;
  color: #12110e;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}
.wrap {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: clamp(32px, 5vw, 80px);
  align-items: start;
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
    400 clamp(40px, 5vw, 80px)/0.95 'Instrument Serif',
    serif;
  letter-spacing: -0.01em;
  text-wrap: balance;
}
.sub {
  margin: 0;
  max-width: 42ch;
  color: #4d493f;
  line-height: 1.6;
  text-wrap: pretty;
}
.modes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  cursor: pointer;
  border: 1px solid #12110e;
  padding: 13px 20px;
  border-radius: 999px;
  font: 500 14px/1 Manrope;
  transition:
    background 0.25s,
    color 0.25s;
}
.chip:hover {
  background: rgba(18, 17, 14, 0.06);
}

.panel {
  display: grid;
  gap: 24px;
  background: #f3f0e9;
  padding: 28px;
}
.label {
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6f7a5f;
}

.days {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  gap: 6px;
}
.day {
  cursor: pointer;
  display: grid;
  gap: 6px;
  justify-items: center;
  padding: 12px 4px;
  border: 1px solid;
  transition:
    background 0.2s,
    color 0.2s;
}
.day-wd {
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.day-num {
  font:
    400 28px/1 'Instrument Serif',
    serif;
}
.day-mo {
  font:
    400 10px/1 'IBM Plex Mono',
    monospace;
  text-transform: uppercase;
  opacity: 0.7;
}

.slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.slot {
  cursor: pointer;
  padding: 13px 4px;
  border: 1px solid;
  font:
    500 13px/1 'IBM Plex Mono',
    monospace;
  transition:
    background 0.2s,
    color 0.2s;
}

.book {
  cursor: pointer;
  border: 0;
  color: #f3f0e9;
  padding: 17px 20px;
  border-radius: 999px;
  font: 600 14px/1 Manrope;
  transition: background 0.3s;
}
.book:disabled {
  cursor: default;
}

.booked {
  display: grid;
  gap: 12px;
  padding: 20px;
  background: #12110e;
  color: #f3f0e9;
}
.booked-t {
  font:
    400 26px/1.1 'Instrument Serif',
    serif;
}
.booked-p {
  font-size: 14px;
  line-height: 1.5;
  color: #d8d4c8;
}
.booked-wa {
  font: 600 14px/1 Manrope;
  color: #cdd2c0;
}
</style>
