<script setup>
import { computed } from "vue";
import { IMG } from "@/composables/useInhabiStore";

const props = defineProps({
  /* Requeridos */
  image: { type: String, required: true },
  title: { type: String, required: true },

  /* Opcionales */
  description: { type: String, default: "" },
  tag: { type: String, default: "" },
  link: { type: String, default: "" },
  labelLink: { type: String, default: "" },
});



/* Solo renderiza el CTA si hay link Y label */
const hasCta = computed(() => Boolean(props.link && props.labelLink));
</script>

<template>
  <article class="inhabi-card">
    <!-- Imagen de fondo -->
    <div class="inhabi-card__media">
      <img :src="IMG(image)" :alt="title" loading="lazy" />
    </div>

    <!-- Etiqueta superior opcional -->
    <span v-if="tag" class="inhabi-card__tag">{{ tag }}</span>

    <!-- Contenido inferior con degradado -->
    <div class="inhabi-card__content">
      <h3 class="inhabi-card__title">{{ title }}</h3>

      <p v-if="description" class="inhabi-card__desc">
        {{ description }}
      </p>

      <router-link
        v-if="hasCta"
        :to="link"
        class="inhabi-card__link btn btn__outline"
      >
        {{ labelLink }}
      </router-link>
    </div>
  </article>
</template>

<style scoped lang="scss">
/* ============================================================
   CARD
   ============================================================ */
.inhabi-card {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--dark);
  border: 1px solid var(--ink-muted);
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: var(--ink-soft-accent);
    transform: translateY(-2px);

    .inhabi-card__media img {
      transform: scale(1.1);
    }
  }

  /* ---------- Media ---------- */
  &__media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  /* ---------- Tag ---------- */
  &__tag {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 2;
    padding: 6px 10px;
    font-family: var(--font-mono);
    font-size: 0.625rem;
    font-weight: 100;
    line-height: 1;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--light);
    background: rgba(18, 17, 14, 0.2);
    border-radius: 1rem;
  }

  /* ---------- Contenido inferior ---------- */
  &__content {
    position: absolute;
    inset: auto 0 0 0;
    z-index: 2;
    padding: 1.5rem;
    background: linear-gradient(
      0deg,
      rgba(18, 17, 14, 0.95) 0%,
      rgba(18, 17, 14, 0.75) 50%,
      transparent 100%
    );
  }

  &__title {
    margin: 0;
    font-family: var(--font-cursive);
    font-size: 2rem;
    font-weight: 500;
    line-height: 1;
    color: var(--light);
  }

  &__desc {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--ink-soft-accent);
    overflow: hidden;
    font-family:var(--font-classic);
  }

  &__link {
    margin-top: 1.5rem;
  }
}
</style>
