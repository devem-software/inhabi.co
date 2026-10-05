<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { store, t, currentServicios } from '@/composables/useInhabiStore'
import LogoComponent from '@/components/LogoComponent.vue'

const props = defineProps({ scrolled: Boolean })

/* ---------- Estado del menú móvil y dropdowns ---------- */
const menuOpen = ref(false)
const activeDesktopDropdown = ref(null) // Guarda el índice del ítem de escritorio abierto
const activeMobileSub = ref(null) // Guarda el índice del ítem móvil abierto

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (!menuOpen.value) activeMobileSub.value = null
}
function closeMenu() {
  menuOpen.value = false
  activeDesktopDropdown.value = null
  activeMobileSub.value = null
}

function onKeydown(e) {
  if (e.key === 'Escape') closeMenu()
}

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})

/* Listado dinámico de servicios para el submenú */
const listServicesItems = computed(() => {
  return currentServicios.value.map((s) => ({ href: `#${s.id}`, label: s.title }))
})

/* ---------- Estilo dinámico del nav ---------- */
const navStyle = computed(() => ({
  background: props.scrolled || menuOpen.value ? 'rgba(18,17,14,.88)' : 'transparent',
  backdropFilter: props.scrolled || menuOpen.value ? 'blur(12px)' : 'none',
}))

/* ---------- Enlaces generales con soporte universal de children ---------- */
const links = computed(() => [
  {
    href: '#proyectos',
    label: t.value.nav.proyectos,
  },
  {
    href: '#servicios',
    label: t.value.nav.servicios,
    children: listServicesItems.value, // Soporte dinámico desde los JSON de servicios
  },
  { href: '#estudio', label: t.value.nav.estudio },
])

/* ---------- Helper idioma ---------- */
function langStyle(lang) {
  const active = store.lang === lang
  return {
    background: active ? '#f3f0e9' : 'transparent',
    color: active ? '#12110e' : '#f3f0e9',
  }
}
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
        <!-- Ítem con submenú en Escritorio -->
        <div
          v-if="l.children"
          class="nav-item-dropdown"
          @mouseenter="activeDesktopDropdown = index"
          @mouseleave="activeDesktopDropdown = null"
        >
          <a :href="l.href" class="nav-dropdown-toggle">
            {{ l.label }}
            <span class="arrow" :class="{ 'is-rotated': activeDesktopDropdown === index }">▾</span>
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

        <!-- Ítem simple en Escritorio -->
        <a v-else :href="l.href">{{ l.label }}</a>
      </template>

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
          <template v-for="(l, i) in links" :key="l.href">
            <!-- Si tiene hijos (Submenú móvil universal) -->
            <div v-if="l.children" class="mobile-item-group">
              <button
                class="mobile-link mobile-dropdown-btn"
                @click="activeMobileSub = activeMobileSub === i ? null : i"
              >
                <span class="mobile-num">0{{ i + 1 }}</span>
                <span class="mobile-label">{{ l.label }}</span>
                <span class="mobile-arrow" :class="{ 'is-rotated': activeMobileSub === i }">▾</span>
              </button>

              <div v-show="activeMobileSub === i" class="mobile-sublinks">
                <a
                  v-for="sub in l.children"
                  :key="sub.label"
                  :href="sub.href"
                  class="mobile-sublink"
                  @click="closeMenu"
                >
                  — {{ sub.label }}
                </a>
              </div>
            </div>

            <!-- Enlace normal móvil -->
            <a v-else :href="l.href" class="mobile-link" @click="closeMenu">
              <span class="mobile-num">0{{ i + 1 }}</span>
              <span class="mobile-label">{{ l.label }}</span>
              <span class="mobile-arrow">→</span>
            </a>
          </template>
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
  padding: 0.75rem clamp(20px, 4vw, 56px);
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
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* ---------- Dropdown de Escritorio ---------- */
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
  font-size: 10px;
  transition: transform 0.25s;
}
.arrow.is-rotated,
.nav-item-dropdown:hover .arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  background: rgba(18, 17, 14, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(243, 240, 233, 0.12);
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
.dropdown-menu a {
  padding: 12px 16px;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: #f3f0e9;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s;
}
.dropdown-menu a:hover {
  background: #f3f0e9;
  color: #12110e;
}

/* Transición del Dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
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
    500 10px/1 'IBM Plex Mono',
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
   OVERLAY MÓVIL
   ============================================================ */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: color-mix(in srgb, #12110e 98%, transparent);
  display: flex;
  flex-direction: column;
  padding: 96px clamp(20px, 6vw, 40px) 32px;
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

.mobile-links {
  display: grid;
  gap: 0;
  border-top: 1px solid rgba(243, 240, 233, 0.12);
}
.mobile-link {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 22px 0;
  border-bottom: 1px solid rgba(243, 240, 233, 0.12);
  font:
    400 clamp(24px, 7vw, 44px)/1 'Instrument Serif',
    serif;
  letter-spacing: -0.01em;
  color: #f3f0e9;
  cursor: pointer;
}

.mobile-dropdown-btn .mobile-arrow {
  transition: transform 0.3s ease;
}
.mobile-dropdown-btn .mobile-arrow.is-rotated {
  transform: rotate(180deg);
}

/* Submenú móvil */
.mobile-sublinks {
  display: flex;
  flex-direction: column;
  padding-left: 48px;
  border-bottom: 1px solid rgba(243, 240, 233, 0.12);
  background: rgba(255, 255, 255, 0.02);
}
.mobile-sublink {
  padding: 14px 0;
  font:
    400 18px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.1em;
  color: #cdd2c0;
  text-transform: uppercase;
  transition: color 0.2s;
}
.mobile-sublink:hover {
  color: #f3f0e9;
}

.mobile-num {
  font:
    400 16px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  color: #cdd2c0;
}
.mobile-arrow {
  font:
    400 24px/1 'Instrument Serif',
    serif;
  color: #cdd2c0;
  opacity: 0.6;
}

.mobile-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 0.35s ease;
}
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
