<!-- src/components/Breadcrumbs.vue -->
<template>
  <nav class="breadcrumbs" aria-label="Migas de pan">
    <ol class="breadcrumbs__list">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="crumb.path || index"
        class="breadcrumbs__item"
      >
        <!-- Enlace si tiene path y no es el último elemento -->
        <router-link
          v-if="crumb.path && index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="breadcrumbs__link"
        >
          {{ crumb.label }}
        </router-link>

        <!-- Texto plano si es el último elemento o no tiene path -->
        <span
          v-else
          class="breadcrumbs__current"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ crumb.label }}
        </span>

        <!-- Separador | (no se muestra en el último elemento) -->
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumbs__separator">
          |
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Función auxiliar para formatear texto (ej: "diseno-interior" -> "Diseno interior")
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const breadcrumbs = computed(() => {
  // Siempre empezamos con Inicio
  const crumbs = [{ label: 'Inicio', path: '/' }];

  if (route.name === 'home') return crumbs;

  switch (route.name) {
    case 'servicios':
      crumbs.push({ label: 'Servicios', path: '/servicios' });
      break;

    case 'diseño': // Nota: maneja el nombre con 'ñ' tal como está en tu router
      crumbs.push(
        { label: 'Servicios', path: '/servicios' },
        { label: 'Diseño', path: '/servicios/diseno' }
      );
      break;

    case 'proyectos':
      crumbs.push({ label: 'Proyectos', path: '/proyectos' });
      if (route.params.categoria) {
        crumbs.push({
          label: formatLabel(route.params.categoria),
          path: `/proyectos/${route.params.categoria}`
        });
      }
      break;

    case 'proyecto-detalle':
      crumbs.push(
        { label: 'Proyectos', path: '/proyectos' },
        {
          label: formatLabel(route.params.categoria),
          path: `/proyectos/${route.params.categoria}`
        },
        {
          label: formatLabel(route.params.proyecto),
          path: null // null indica que es la página actual, sin enlace
        }
      );
      break;

    default:
      // Para rutas de un solo nivel (cotiza, system-design, etc.)
      const labelMap = {
        'cotiza': 'Cotiza',
        'system-design': 'System Design',
      };
      const label = labelMap[route.name] || formatLabel(route.name);
      crumbs.push({ label, path: route.path });
      break;
  }

  return crumbs;
});
</script>

<style scoped>
.breadcrumbs {
  padding: 2rem 0;
  font-size: 0.75rem; /* 14px */
}

.breadcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.breadcrumbs__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform:uppercase;
  letter-spacing: 1px;
  font-family: var(--font-mono);
}

.breadcrumbs__link {
  color: var(--ink-soft-accent);
  text-decoration: none;
  border-radius: 3rem;
  border:1px solid transparent;
  padding: .125rem .5rem;
  transition: all 0.2s ease;
}

.breadcrumbs__link:hover {
  color: var(--ink-accent);
  border-color: var(--ink-soft-accent);
}

.breadcrumbs__current {
  color: #111;
  font-weight: 600;
}

.breadcrumbs__separator {
  color: #ccc;
  user-select: none;
  margin: 0 0.25rem;
}
</style>
