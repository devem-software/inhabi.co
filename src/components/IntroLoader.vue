<script setup>
import { onMounted, onUnmounted } from 'vue'
import LogoComponent from '@/components/LogoComponent.vue'
import { store } from '@/composables/useInhabiStore'

const emit = defineEmits(['done'])
let timer

const skip = () => {
  clearTimeout(timer)
  cleanup()
  emit('done')
}
const cleanup = () => {
  window.removeEventListener('wheel', skip)
  window.removeEventListener('keydown', skip)
  window.removeEventListener('touchstart', skip)
}

onMounted(() => {
  // Ajustado a 4000ms para permitir que las nuevas esperas y animaciones terminen
  timer = setTimeout(() => emit('done'), 4000)
  window.addEventListener('wheel', skip, { passive: true })
  window.addEventListener('keydown', skip)
  window.addEventListener('touchstart', skip, { passive: true })
})
onUnmounted(() => {
  clearTimeout(timer)
  cleanup()
})
</script>

<template>
  <div aria-hidden="true" class="intro-root">
    <!-- Fondo negro que se dividirá de forma vertical -->
    <div class="panel panel-left"></div>
    <div class="panel panel-right"></div>

    <!-- Contenedor general -->
    <div class="center">
      <div class="inner">
        <div class="logo-wrap">
          <!-- Logo animado con selectores profundos -->
          <LogoComponent class="animated-logo" icon text />
        </div>
        <!-- Subtítulo -->
        <div class="caption">
          {{ store.lang === 'en' ? 'Architecture · Interiors' : 'Arquitectura · Interiorismo' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-root {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}

/* EFECTO PERSIANA (Inicia en 2.8s tras las esperas) */
.panel {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.5%;
  background: #1b1a16;
}
.panel-left {
  left: 0;
  animation: slideOutLeft 0.8s cubic-bezier(0.76, 0, 0.24, 1) 2.8s forwards;
}
.panel-right {
  right: 0;
  animation: slideOutRight 0.8s cubic-bezier(0.76, 0, 0.24, 1) 2.8s forwards;
}

/* Contenedor central (logo y texto), desaparece al abrirse el fondo */
.center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeOutCenter 0.4s ease 2.8s forwards;
}
.inner {
  position: relative;
  width: min(760px, 78vw);
  display: grid;
  gap: clamp(18px, 2vw, 28px);
}
.logo-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/*
  EL LOGO (Contenedor general)
  Ajustado al 36% para que el icono quede en el centro geométrico perfecto.
*/
.animated-logo {
  width: 100%;
  /* EL CAMBIO ESTÁ AQUÍ */
  transform: translateX(40%);
  animation: centerFullLogo 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
}

/*
  EL ICONO
*/
.animated-logo :deep(.logo__icon) {
  opacity: 0;
  /* Ajustamos el transform-origin para que coincida con el centro real del icono */
  transform-origin: 14% 50%;
  animation:
    iconAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards,
    iconToWhite 0.3s ease-in 1.2s forwards;
}

/*
  EL TEXTO (Efecto de empuje)
*/
.animated-logo :deep(.logo__text) {
  opacity: 0;
  clip-path: inset(0 100% 0 0);
  animation: revealTextWidth 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.5s forwards;
}

/* Subtítulo debajo del logo */
.caption {
  text-align: center;
  font:
    500 clamp(10px, 0.8vw, 14px)/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.5em;
  color: #e6e1d6;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeIn 0.6s ease 2s forwards;
}

/* ---- KEYFRAMES DEL LOGO ---- */

@keyframes iconAppear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes iconToWhite {
  100% {
    fill: #ffffff !important;
  }
}

@keyframes centerFullLogo {
  100% {
    transform: translateX(0);
  }
}

/* Efecto ancho de texto 0% a 100% */
@keyframes revealTextWidth {
  0% {
    opacity: 1;
    clip-path: inset(0 100% 0 0);
  }
  100% {
    opacity: 1;
    clip-path: inset(0 0 0 0);
  }
}

/* ---- KEYFRAMES DEL CONTENEDOR Y PUERTAS ---- */

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@keyframes slideOutLeft {
  to {
    transform: translateX(-100%);
  }
}

@keyframes slideOutRight {
  to {
    transform: translateX(100%);
  }
}

@keyframes fadeOutCenter {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
