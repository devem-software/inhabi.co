<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { store, t, WA, LOGOS } from '@/composables/useInhabiStore'

import IntroLoader from '@/components/IntroLoader.vue'
import AppNav from '@/components/AppNav.vue'
import HeroCinematic from '@/components/HeroCinematic.vue'
import EstudioSection from '@/components/EstudioSection.vue'
import ProyectosSection from '@/components/ProyectosSection.vue'
import ServiciosSection from '@/components/ServiciosSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import MarqueeSection from '@/components/MarqueeSection.vue'
import ContactButton from '@/components/atoms/ContactButton.vue'

/* ── Editor props equivalentes ───────────────────────── */
const introMode = 'Cada carga' // 'Cada carga' | 'Desactivada'

const wantIntro = introMode !== 'Desactivada'
const showIntro = ref(wantIntro)
const introOn = computed(() => wantIntro)
const heroDelay = computed(() => (showIntro.value ? '2.65s' : '0s'))

/* ── Scroll del nav ──────────────────────────────────── */
const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 120
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
console.log()

const waHello = computed(() => `https://wa.me/${WA}?text=${encodeURIComponent(t.value.hola)}`)

// SEO para HOME
import { usePageSeo } from '@/composables/usePageSeo.js';

usePageSeo({
  title:"Inhabi.co"
}); // ← toma title/description/image de route.meta
</script>

<template>
  <div style="background: #12110e; color: #f3f0e9; min-height: 100vh; overflow-x: clip">
    <IntroLoader v-if="showIntro" @done="showIntro = false" />

    <AppNav :scrolled="scrolled" />

    <HeroCinematic :delay="heroDelay" :intro-on="introOn" />

    <MarqueeSection :images="LOGOS" :duration="300" :repeat="10" :gap="16" />
    <ProyectosSection />

    <ServiciosSection />
    <EstudioSection />
    <AppFooter />

    <ContactButton :message="waHello"/>
  </div>
</template>
