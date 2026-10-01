<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import { store, t, ASSET } from "@/composables/useInhabiStore";
import LogoComponent from "@/components/LogoComponent.vue";


const props = defineProps({ scrolled: Boolean });

/* ---------- Estado del menú móvil ---------- */
const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
function closeMenu() {
  menuOpen.value = false;
}

function onKeydown(e) {
  if (e.key === "Escape") closeMenu();
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  if (open) window.addEventListener("keydown", onKeydown);
  else window.removeEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});

/* ---------- Estilo dinámico del nav ---------- */
const navStyle = computed(() => ({
  background: props.scrolled || menuOpen.value ? "rgba(18,17,14,.88)" : "transparent",
  backdropFilter: props.scrolled || menuOpen.value ? "blur(12px)" : "none",
}));

/* ---------- Enlaces del menú móvil ---------- */
const links = computed(() => [
  { href: "#proyectos", label: t.value.nav.proyectos },
  { href: "#servicios", label: t.value.nav.servicios },
  { href: "#estudio", label: t.value.nav.estudio },
]);

/* ---------- Helper idioma ---------- */
function langStyle(lang) {
  const active = store.lang === lang;
  return {
    background: active ? "#f3f0e9" : "transparent",
    color: active ? "#12110e" : "#f3f0e9",
  };
}
</script>

<template>
  <nav class="nav" :style="navStyle">
    <!-- Marca -->
    <a href="#top" class="brand" @click="closeMenu">
      <LogoComponent class="brand-logo" icon text/>
    </a>

    <!-- Navegación escritorio / tablet -->
    <div class="nav-links">
      <a href="#proyectos">{{ t.nav.proyectos }}</a>
      <a href="#servicios">{{ t.nav.servicios }}</a>
      <a href="#estudio">{{ t.nav.estudio }}</a>


      <div class="lang-switch">
        <button class="lang-btn" :style="langStyle('es')" @click="store.lang = 'es'">ES</button>
        <button class="lang-btn" :style="langStyle('en')" @click="store.lang = 'en'">EN</button>
      </div>

      <router-link to="/cotiza" class="nav-cta" @click="closeMenu">
        {{ t.nav.cotizar }}
      </router-link>
    </div>

    <!-- Botón hamburguesa (solo móvil) -->
    <button
      class="burger"
      :class="{ 'is-open': menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Abrir menú"
      @click="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <!-- Overlay pantalla completa (solo móvil) -->
  <Transition name="menu-fade">
    <div v-if="menuOpen" class="mobile-menu" role="dialog" aria-modal="true">
      <div class="mobile-menu-inner">
        <nav class="mobile-links">
          <a
            v-for="(l, i) in links"
            :key="l.href"
            :href="l.href"
            class="mobile-link"
            :style="{ animationDelay: 0.06 + i * 0.05 + 's' }"
            @click="closeMenu"
          >
            <span class="mobile-num">0{{ i + 1 }}</span>
            <span class="mobile-label">{{ l.label }}</span>
            <span class="mobile-arrow">→</span>
          </a>
        </nav>

        <div class="mobile-foot">
          <div class="lang-switch">
            <button class="lang-btn" :style="langStyle('es')" @click="store.lang = 'es'">ES</button>
            <button class="lang-btn" :style="langStyle('en')" @click="store.lang = 'en'">EN</button>
          </div>

          <router-link to="/cotiza" class="nav-cta" @click="closeMenu">
            {{ t.nav.cotizar }}
          </router-link>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ============================================================
   NAV BASE (escritorio + tablet)
   ============================================================ */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: .75rem clamp(20px, 4vw, 56px);
  transition:
    background 0.4s,
    backdrop-filter 0.4s;
}

.brand {
  display: flex;
  align-items: center;
}
.brand-logo {
  height: 1.5rem;
  width: auto;
  display: block;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.2vw, 32px);
  font:
    500 11px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.lang-switch {
  display: flex;
  gap: 2px;
  border: 1px solid rgba(243, 240, 233, 0.25);
  border-radius: 999px;
  padding: 3px;
}
.lang-btn {
  border: 0;
  cursor: pointer;
  border-radius: 999px;
  padding: 6px 10px;
  font:
    500 10px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.12em;
  transition:
    background 0.25s,
    color 0.25s;
}
.nav-cta {
  background: #f3f0e9;
  color: #12110e;
  padding: 11px 16px;
  border-radius: 999px;
  transition:
    background 0.25s,
    color 0.25s;
}
.nav-cta:hover {
  background: #cdd2c0;
  color: #12110e;
}

/* ============================================================
   BOTÓN HAMBURGUESA — oculto por defecto
   ============================================================ */
.burger {
  display: none;
  position: relative;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition:
    background 0.25s,
    border-color 0.25s;
}
.burger:hover {
  border-color: rgba(243, 240, 233, 0.55);
}

.burger span {
  position: absolute;
  left: 50%;
  width: 18px;
  height: 1.5px;
  background: #f3f0e9;
  transform: translateX(-50%);
  transition:
    transform 0.35s cubic-bezier(0.76, 0, 0.24, 1),
    opacity 0.25s,
    top 0.35s cubic-bezier(0.76, 0, 0.24, 1);
}
.burger span:nth-child(1) {
  top: 16px;
}
.burger span:nth-child(2) {
  top: 21.5px;
}
.burger span:nth-child(3) {
  top: 27px;
}

.burger.is-open span:nth-child(1) {
  top: 21.5px;
  transform: translateX(-50%) rotate(45deg);
}
.burger.is-open span:nth-child(2) {
  opacity: 0;
}
.burger.is-open span:nth-child(3) {
  top: 21.5px;
  transform: translateX(-50%) rotate(-45deg);
}

/* ============================================================
   OVERLAY MÓVIL — oculto por defecto
   ============================================================ */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 55; /* debajo del nav (z:60) para dejar visible la barra */
  background: color-mix(in srgb, #12110e 98%, transparent);
  display: flex;
  flex-direction: column;
  padding: 96px clamp(20px, 6vw, 40px) 32px; /* 96px = alto aproximado del nav */
  overflow-y: auto;
}

.mobile-menu-inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 48px;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}

/* -------- Enlaces -------- */
.mobile-links {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(243, 240, 233, 0.12);
}
.mobile-link {
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 22px 0;
  border-bottom: 1px solid rgba(243, 240, 233, 0.12);
  font:
    400 clamp(24px, 7vw, 44px)/1 "Instrument Serif",
    serif;
  letter-spacing: -0.01em;
  opacity: 0;
  transform: translateY(14px);
  animation: menuLinkIn 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  transition:
    color 0.25s,
    padding-left 0.3s;
}
.mobile-link:hover {
  color: #cdd2c0;
  padding-left: 8px;
}

.mobile-num {
  font:
    400 16px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.16em;
  color: #cdd2c0;
  align-self: center;
}
.mobile-label {
  line-height: 1;
}
.mobile-arrow {
  font:
    400 24px/1 "Instrument Serif",
    serif;
  color: #cdd2c0;
  opacity: 0.6;
  transition:
    opacity 0.25s,
    transform 0.3s;
}
.mobile-link:hover .mobile-arrow {
  opacity: 1;
  transform: translateX(6px);
}

/* -------- Footer del menú -------- */
.mobile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

/* ============================================================
   TRANSICIONES OVERLAY
   ============================================================ */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.35s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
}

@keyframes menuLinkIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============================================================
   BREAKPOINTS
   ============================================================ */

/* Tablet y superior: nav normal, sin hamburguesa */
@media (min-width: 768px) {
  .burger {
    display: none !important;
  }
  .mobile-menu {
    display: none !important;
  }
}

/* Móvil: ocultar enlaces, mostrar hamburguesa */
@media (max-width: 767px) {
  .nav-links {
    display: none;
  }
  .burger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

/* Móvil muy pequeño: ajustar tamaño del overlay */
@media (max-width: 360px) {
  .mobile-link {
    font-size: 28px;
    padding: 18px 0;
  }
  .mobile-num {
    font-size: 11px;
  }
}
</style>
