<script setup>
import { computed } from 'vue'
import { WA, t } from '../composables/useInhabiStore'
import LogoComponent from './LogoComponent.vue'

const waHello = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(t.value.hola)}`)
</script>

<template>
  <footer data-screen-label="Contacto" class="footer">
    <img v-parallax="0.12" src="@/img/r10-57.jpg" alt="" class="bg" />

    <div class="wrap">
      <!-- Bloque grande "Let's work together" -->
      <a :href="waHello" target="_blank" rel="noopener" class="hero-link">
        <span class="eyebrow">{{ t.foot.eyebrow }}</span>
        <span class="big"> Let’s work <em style="color: #cdd2c0">together</em> </span>
      </a>

      <!-- Información -->
      <div class="info">
        <div class="info-col">
          <LogoComponent class="logo" icon text />
          <span style="color: #a8a597">INHABI S.A.S. · Bogotá – Colombia</span>
        </div>

        <div class="info-col">
          <span class="tag">WhatsApp</span>
          <a :href="waHello" target="_blank" rel="noopener">+57 322 727 6453</a>
        </div>

        <div class="info-col">
          <span class="tag">Email</span>
          <a href="mailto:Inhabi.arquitectura@gmail.com">Inhabi.arquitectura@gmail.com</a>
        </div>

        <div class="info-col">
          <span class="tag">Instagram</span>
          <a href="https://instagram.com/inhabi.co" target="_blank" rel="noopener">@inhabi.co</a>
        </div>
      </div>

      <!-- Línea inferior -->
      <div class="bottom">
        <span>© {{ new Date().getFullYear()}} Inhabi.co</span>
        <span>{{ t.foot.tag }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  overflow: hidden;
  background: #12110e;
  padding: clamp(80px, 12vw, 160px) clamp(20px, 4vw, 56px) 36px;
  padding-bottom:5rem;
}
.bg {
  position: absolute;
  left: 0;
  top: -10%;
  width: 100%;
  height: 120%;
  object-fit: cover;
  opacity: 0.18;
}
.wrap {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 72px;
}

.hero-link {
  display: grid;
  gap: 12px;
  color: #f3f0e9;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.big {
  font:
    400 clamp(56px, 11vw, 190px)/0.86 'Instrument Serif',
    serif;
  letter-spacing: -0.03em;
}

.info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 28px;
  border-top: 1px solid rgba(243, 240, 233, 0.18);
  padding-top: 28px;
  font-size: 15px;
  line-height: 1.7;
}
.info-col {
  display: grid;
  gap: 4px;
}
.logo {
  height: 20px;
  width: auto;
  justify-self: start;
  margin-bottom: 10px;
}
.tag {
  font:
    500 10px/1.8 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #8f8c80;
}

.bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font:
    400 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.12em;
  color: #8f8c80;
  text-transform: uppercase;
}
</style>
