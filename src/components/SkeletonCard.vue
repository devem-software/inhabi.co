<template>
  <div class="skeleton-card" :class="{ 'skeleton-card--horizontal': horizontal }">
    <div class="skeleton-card__image skeleton-shimmer"></div>
    <div class="skeleton-card__content">
      <div class="skeleton-card__tag skeleton-shimmer"></div>
      <div class="skeleton-card__title skeleton-shimmer"></div>
      <div class="skeleton-card__title skeleton-card__title--short skeleton-shimmer"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.skeleton-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 25rem;
  min-width: 20rem;
  background-color: var(--dark-hover, #1a1a1a);
  border-radius: 12px;
  overflow: hidden;
  isolation: isolate;

  &--horizontal {
    flex-direction: row;
    .skeleton-card__image {
      width: 40%;
      height: auto;
      min-height: 160px;
    }
  }

  &__image {
    width: 100%;
    aspect-ratio: 16 / 10;
    background-color: var(--dark-hover, #1a1a1a);
  }

  &__content {
    padding: 1rem 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__tag {
    width: 5rem;
    height: 0.75rem;
    border-radius: 4px;
    background-color: var(--dark-hover, #1a1a1a);
  }

  &__title {
    width: 85%;
    height: 1rem;
    border-radius: 4px;
    background-color: var(--dark-hover, #1a1a1a);

    &--short {
      width: 55%;
    }
  }
}

/* Efecto shimmer */
.skeleton-shimmer {
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    animation: shimmer 1.6s infinite;
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
