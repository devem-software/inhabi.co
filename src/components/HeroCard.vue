<script setup>
import { IMG } from "@/composables/useInhabiStore";

// Recibe las propiedades necesarias para la tarjeta
defineProps({
  image: {
    type: String,
    required: true, // Ej: "r43-149" o "proyectos/prieto"
  },
  title: {
    type: String,
    required: true, // Ej: "Prieto 208"
  },
  description: {
    type: String,
    required: true, // Ej: "Diseño interior y optimización de espacios."
  },
  tag: {
    type: String,
    default: "", // Opcional (ej: "01" o categoría)
  }
});
</script>

<template>
  <article class="inhabi-card">
    <!-- Imagen de fondo que ocupa toda la tarjeta -->
    <div class="inhabi-card__media">
      <img :src="IMG(image)" :alt="title" loading="lazy" />
    </div>

    <!-- Etiqueta opcional superior (como los números en tus tarjetas de servicios) -->
    <span v-if="tag" class="inhabi-card__tag">{{ tag }}</span>

    <!-- Degradado inferior y contenedor de texto -->
    <div class="inhabi-card__content">
      <h3 class="inhabi-card__title">{{ title }}</h3>
      <p class="inhabi-card__desc">{{ description }}</p>
    </div>
  </article>
</template>

<style scoped>
.inhabi-card {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* Garantiza que sea perfectamente cuadrada */
  overflow: hidden;
  background: var(--ink-soft, #1b1a16);
  border: 1px solid var(--border-dark-1, rgba(243, 240, 233, 0.12));
  transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.inhabi-card:hover {
  border-color: var(--sage, #cdd2c0);
  transform: translateY(-4px);
}

/* Imagen inmersiva */
.inhabi-card__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.inhabi-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.inhabi-card:hover .inhabi-card__media img {
  transform: scale(1.04); /* Sutil zoom estético al pasar el cursor */
}

/* Etiqueta superior opcional */
.inhabi-card__tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 10px;
  background: rgba(18, 17, 14, 0.72);
  color: var(--cream, #f3f0e9);
  font: 500 11px/1 var(--font-mono, "IBM Plex Mono", monospace);
  letter-spacing: 0.16em;
  border-radius: 4px;
  z-index: 2;
}

/* Contenedor de textos con degradado de oscuro a transparente */
.inhabi-card__content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px 24px 24px 24px;
  display: grid;
  gap: 8px;
  z-index: 2;
  
  /* Degradado clave: De negro profundo en la base a totalmente transparente arriba */
  background: linear-gradient(
    to top, 
    rgba(18, 17, 14, 0.95) 0%, 
    rgba(18, 17, 14, 0.75) 50%, 
    transparent 100%
  );
}

.inhabi-card__title {
  margin: 0;
  font: 400 32px/1.1 var(--font-display, "Instrument Serif", serif);
  letter-spacing: -0.01em;
  color: var(--cream, #f3f0e9);
}

.inhabi-card__desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--fg-soft, rgba(243, 240, 233, 0.75));
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limita la descripción a 2 líneas para mantener orden */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>