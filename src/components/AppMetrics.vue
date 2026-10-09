<script setup>
import { computed } from "vue";

const props = defineProps({
  /**
   * Arreglo de valores a mostrar en cada tarjeta.
   * Ej: [10, "13.760 m²", 19, 11]
   */
  values: {
    type: Array,
    default: () => [],
  },
  /**
   * Arreglo de labels (uno por cada valor).
   * Ej: ["Diseñando", "Diseñados", "Proyectos", "Ciudades"]
   */
  labels: {
    type: Array,
    default: () => [],
  },
});

/**
 * Combina values + labels en un solo arreglo de tarjetas.
 * Si faltan labels, se usa un string vacío.
 * Si faltan values, se usa "—" como placeholder.
 */
const items = computed(() =>
  props.values.map((value, i) => ({
    value: value ?? "—",
    label: props.labels[i] ?? "",
    // Permite alternar estilos si quieres (ver más abajo)
    variant: i % 2 === 0 ? "light" : "dark",
  }))
);
</script>

<template>
  <section class="metrics">
    <div class="metrics__grid">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="metric"
        :class="`metric--${item.variant}`"
      >
        <div class="metric__value" v-html="item.value"></div>
        <div class="metric__label">{{ item.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../styles/_mixins.scss" as mx;

.metrics {
  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: space-between;
    align-items: stretch;
  }

  .metric {
    padding: 1rem;
    border-radius: 1rem;
    background: var(--light);
    color: var(--dark-hover);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.5rem;
    gap: 0.5rem;
    flex-direction: column;
    text-align: center;

    @include mx.movil {
      width: 15rem;
      gap: 1rem;
    }

    &--light {
      background: var(--light);
      color: var(--dark-hover);
    }

    &--dark {
      background: var(--dark-hover);
      color: var(--light);
    }

    &__label {
      font-family: var(--font-cursive);
      font-size: 1rem;

      @include mx.movil {
        font-size: 1.5rem;
      }
    }

    &__value {
      font-family: var(--font-cursive);
      font-size: 1.25rem;
      line-height:1;
      font-weight: 700;

      @include mx.movil {
        font-size: 2.5rem;
      }
    }
  }
}
</style>
