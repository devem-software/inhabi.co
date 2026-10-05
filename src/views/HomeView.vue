<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { store, T, WA, siteUrl, LOGOS } from "@/composables/useInhabiStore";

import IntroLoader from "@/components/IntroLoader.vue";
import AppNav from "@/components/AppNav.vue";
import HeroCinematic from "@/components/HeroCinematic.vue";
import HeroEditorial from "@/components/HeroEditorial.vue";
import EstudioSection from "@/components/EstudioSection.vue";
import ProyectosSection from "@/components/ProyectosSection.vue";
import ServiciosSection from "@/components/ServiciosSection.vue";
import AppFooter from "@/components/AppFooter.vue";
// import CombosSection from "@/components/CombosSection.vue";
// import EstilosSection from "@/components/EstilosSection.vue";
// import ConfiguradorSection from "@/components/ConfiguradorSection.vue";
// import ComparadorSection from "@/components/ComparadorSection.vue";
// import RecibeSection from "@/components/RecibeSection.vue";
// import CotizarSection from "@/components/CotizarSection.vue";
// import AgendaSection from "@/components/AgendaSection.vue";
// import CotizadorSection from "@/components/CotizadorSection.vue";
import MarqueeSection from "@/components/MarqueeSection.vue";


/* ── Editor props equivalentes ───────────────────────── */
const introMode = "Cada carga"; // 'Cada carga' | 'Desactivada'

const wantIntro = introMode !== "Desactivada";
const showIntro = ref(wantIntro);
const introOn = computed(() => wantIntro);
const heroDelay = computed(() => (showIntro.value ? "2.65s" : "0s"));

/* ── Scroll del nav ──────────────────────────────────── */
const scrolled = ref(false);
const onScroll = () => {
  scrolled.value = window.scrollY > 60;
};
onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onUnmounted(() => window.removeEventListener("scroll", onScroll));

const waHello = computed(
  () => `https://wa.me/${WA}?text=${encodeURIComponent(T[store.lang].hola)}`,
);

// SEO para HOME
import { useHead } from "@vueuse/head";
import { seo } from "@/data/dataSeo.js";

useHead({
  ...seo,
});
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
    <!-- <CombosSection />   -->
    <!-- <EstilosSection />   -->
    <!-- <ComparadorSection /> -->
    <!-- <RecibeSection /> -->
    <!-- <CotizarSection /> -->
    <!-- <AgendaSection /> -->
    <AppFooter />

    <a :href="waHello" target="_blank" rel="noopener" aria-label="WhatsApp" class="wa-float"
      >WhatsApp</a
    >
  </div>
</template>
