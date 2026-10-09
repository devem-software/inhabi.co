<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import { store, t, currentServicios, currentTipo } from "@/composables/useInhabiStore";
import LogoComponent from "@/components/LogoComponent.vue";

/* ============================================================
   PROPS
   ============================================================ */
const props = defineProps({ scrolled: Boolean });

/* ============================================================
   ESTADO DEL MENÚ
   ============================================================ */
const menuOpen = ref(false);
const activeDesktopDropdown = ref(null);
const activeMobileSub = ref(null);

/* ============================================================
   HELPERS
   ============================================================ */
const colorBase = (percent) =>
  `color-mix(in srgb, transparent ${percent}%, var(--dark))`;

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  if (!menuOpen.value) activeMobileSub.value = null;
}

function closeMenu() {
  menuOpen.value = false;
  activeDesktopDropdown.value = null;
  activeMobileSub.value = null;
}

function toggleMobileSub(index) {
  activeMobileSub.value = activeMobileSub.value === index ? null : index;
}

function toggleLang() {
  store.lang = store.lang === "es" ? "en" : "es";
}

function onKeydown(e) {
  if (e.key === "Escape") closeMenu();
}

/* ============================================================
   EFECTOS: bloquear scroll + listener de Escape
   ============================================================ */
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
  open
    ? window.addEventListener("keydown", onKeydown)
    : window.removeEventListener("keydown", onKeydown);
});

onUnmounted(() => {
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKeydown);
});

/* ============================================================
   DATOS DERIVADOS
   ============================================================ */
const listServicesItems = computed(() =>
  currentServicios.value.map((s) => ({ href: `#${s.id}`, label: s.title }))
);

const listProyectosItems = computed(() =>
  Object.entries(currentTipo.value).map((p) => ({
    href: `/proyectos/${p[1].id}`,
    label: p[1].label,
  }))
);

const links = computed(() => [
  { href: "#proyectos", label: t.value.nav.proyectos, children: listProyectosItems.value },
  { href: "#servicios", label: t.value.nav.servicios, children: listServicesItems.value },
  { href: "#estudio", label: t.value.nav.estudio },
]);

/* ============================================================
   ESTILO DINÁMICO DEL NAV
   ============================================================ */
const navStyle = computed(() => {
  const isCompact = props.scrolled || menuOpen.value;
  return {
    background: colorBase(isCompact ? 30 : 85),
    backdropFilter: isCompact ? "blur(4px)" : "blur(1px)",
  };
});

/* ============================================================
   LABELS IDIOMA
   ============================================================ */
const langAria = computed(() =>
  store.lang === "es" ? "Switch to English" : "Cambiar a Español"
);
</script>

<template>
  <nav class="nav" :style="navStyle">
    <!-- Marca -->
    <a href="#top" class="brand" @click="closeMenu">
      <LogoComponent class="brand-logo" icon text />
    </a>

    <!-- Navegación escritorio / tablet -->
    <div class="nav-links">
      <template v-for="(l, index) in links" :key="l.href">
        <!-- Ítem con submenú -->
        <div
          v-if="l.children"
          class="nav-item-dropdown"
          @mouseenter="activeDesktopDropdown = index"
          @mouseleave="activeDesktopDropdown = null"
        >
          <a :href="l.href" class="nav-dropdown-toggle">
            {{ l.label }}

            <span class="arrow">{{activeDesktopDropdown === index ? '-': '+'}}</span>
          </a>

          <Transition name="dropdown">
            <div v-if="activeDesktopDropdown === index" class="dropdown-menu">
              <a
                v-for="sub in l.children"
                :key="sub.label"
                :href="sub.href"
                @click="activeDesktopDropdown = null"
              >
                {{ sub.label }}
              </a>
            </div>
          </Transition>
        </div>

        <!-- Ítem simple -->
        <a v-else :href="l.href">{{ l.label }}</a>
      </template>

      <button
        class="lang-toggle btn btn__small btn__outline"
        :aria-label="langAria"
        @click="toggleLang"
      >
        <span :class="{ active: store.lang === 'es' }">ES</span>
        <span class="btn__separator">|</span>
        <span :class="{ active: store.lang === 'en' }">EN</span>
      </button>

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

  <!-- Overlay móvil -->
  <Transition name="menu-fade">
    <div v-if="menuOpen" class="mobile-menu" role="dialog" aria-modal="true">
      <div class="mobile-menu-inner">
        <nav class="mobile-links">
          <template v-for="(l, i) in links" :key="l.href">
            <!-- Ítem con submenú -->
            <div v-if="l.children" class="mobile-item-group">
              <button
                class="mobile-link mobile-dropdown-btn"
                @click="toggleMobileSub(i)"
              >
                <span class="mobile-label">{{ l.label }}</span>
                <span class="mobile-arrow">{{activeMobileSub === i ? '-': '+'}}</span>
              </button>

              <div v-show="activeMobileSub === i" class="mobile-sublinks">
                <a
                  v-for="sub in l.children"
                  :key="sub.label"
                  :href="sub.href"
                  class="mobile-sublink"
                  @click="closeMenu"
                >
                  {{ sub.label }}
                </a>
              </div>
            </div>

            <!-- Enlace simple -->
            <a v-else :href="l.href" class="mobile-link" @click="closeMenu">
              <span class="mobile-label">{{ l.label }}</span>
            </a>
          </template>
        </nav>

        <div class="mobile-foot">
          <button
            class="lang-toggle btn btn__small btn__outline"
            :aria-label="langAria"
            @click="toggleLang"
          >
            <span :class="{ active: store.lang === 'es' }">ES</span>
            <span class="btn__separator">|</span>
            <span :class="{ active: store.lang === 'en' }">EN</span>
          </button>

          <router-link to="/cotiza" class="btn" @click="closeMenu">
            {{ t.nav.cotizar }}
          </router-link>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ============================================================
   1. NAV BASE
   ============================================================ */
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0.75rem clamp(20px, 4vw, 56px);
  transition: all 0.4s ease;
}

.brand {
  display: flex;
  align-items: center;
}


/* ============================================================
   2. NAV LINKS (escritorio / tablet)
   ============================================================ */
.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(14px, 2.2vw, 32px);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: .75rem;
  font-weight: 500;
  font-family: var(--font-classic);
  line-height: 1;
}

/* ---------- Dropdown escritorio ---------- */
.nav-item-dropdown {
  position: relative;
}

.nav-dropdown-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.arrow {
  width: 1rem;
  display:flex;
  justify-content:center;
  align-items:center;
  font-size: 1rem;
}


.dropdown-menu {
  position: absolute;
  top: 150%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  background: rgba(18, 17, 14, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(243, 240, 233, 0.12);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
.dropdown-menu a {
  padding: 12px 16px;
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--light);
  transition: all .3s ease;
}
.dropdown-menu a:hover {
  background: var(--light);
  color: var(--dark);
}

/* Transición dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

/* ---------- CTA y lang ---------- */
.nav-cta {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 6rem;
  padding: 11px 16px;
  border-radius: 999px;
  background: var(--light);
  color: var(--dark);
  transition: background 0.25s, color 0.25s;
}
.nav-cta:hover {
  background: var(--bg-button);
  color: var(--dark);
}

.lang-toggle {
  gap: 4px;
  background: transparent;
  cursor: pointer;
  letter-spacing: 0.12em;
}
.lang-toggle span {
  opacity: 0.4;
  transition: opacity 0.25s;
}
.lang-toggle span.active {
  opacity: 1;
}
.lang-toggle .btn__separator {
  opacity: 0.25;
  margin: 0 2px;
}


/* ============================================================
   4. OVERLAY MÓVIL
   ============================================================ */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 55;
  display: flex;
  flex-direction: column;
  padding: 6rem clamp(20px, 6vw, 40px) 1rem;
  background: color-mix(in srgb, var(--dark) 98%, transparent);
  overflow-y: auto;
}

.mobile-menu-inner {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 48px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.mobile-links {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(243, 240, 233, 0.12);
}

.mobile-link {
  display: flex;
  justify-content:space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem 1rem;
  border: none;
  border-bottom: 1px solid rgba(243, 240, 233, 0.12);
  background: transparent;
  text-align: left;
  cursor: pointer;
  color: var(--light);
  font-size:clamp(24px, 7vw, 44px);
  font-weight: 500;
  font-family: var(--font-cursive);
  line-height: 1;
}

.mobile-dropdown-btn .mobile-arrow {
  transition: all 0.3s ease;
}
.mobile-dropdown-btn .mobile-arrow.is-rotated {
  transform: rotate(180deg);
}

.mobile-sublinks {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  gap:.5rem;
}
.mobile-sublink {
  padding: 1rem 1.25rem;
  color: var(--light-accent);
  line-height:1;
  font-size:1rem;
  font-family: var(--font-mono);
  letter-spacing: 2px;
  text-transform: uppercase;
  border-left: .25rem solid transparent;
}
.mobile-sublink:hover {
  color: var(--light);
  background:var(--dark-hover);
  border-left: .25rem solid var(--ink-muted);
}

.mobile-num {
  color: var(--bg-button);
  font: 400 16px/1 "IBM Plex Mono", monospace;
  letter-spacing: 0.16em;
}

.mobile-arrow {
  color: var(--bg-button);
  opacity: 0.6;

  font: 400 2rem/1 "Instrument Serif", serif;
}

.mobile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

/* Transición overlay */
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.35s ease;
}

/* ============================================================
   5. RESPONSIVE
   ============================================================ */
@media (min-width: 768px) {
  .burger,
  .mobile-menu {
    display: none !important;
  }
}

@media (max-width: 767px) {
  .nav-links {
    display: none;
  }
  .burger {
    display: flex;
    justify-content:center;
    align-items:center;
  }
}
</style>
