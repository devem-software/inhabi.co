<template>
<div v-for="s in serviciosList" :key="s.id" class="card servicio-card" :id="s.id">
  <!-- Imagen -->
  <div class="card__media servicio-card__media">
    <img :src="IMG(`/servicios/${s.img}`)" :alt="s.title" loading="lazy" />
    <span class="servicio-card__num">{{ s.n }}</span>
  </div>

  <!-- Cuerpo -->
  <div class="card__body servicio-card__body">
    <div class="servicio-card__head">
      <h3 class="card__title">{{ s.title }}</h3>
    </div>
    <span class="card__kw">{{ s.kw }}</span>
    <p class="card__desc">{{ s.d }}</p>

    <!-- Lista de entregables -->
    <ul class="servicio-card__list">
      <li v-for="item in s.list" :key="item">
        <span class="servicio-card__dot" aria-hidden="true"></span>
        {{ item }}
      </li>
    </ul>
  </div>
</div>
</template>
<script setup>
</script>
<style lang="scss" scoped>
.card{
  &__service{
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-dark-1);
    overflow: hidden;
    background: var(--ink-soft, #1b1a16);
    border-radius: 0.5rem;
    border: 1px solid var(--border-dark-1, rgba(243, 240, 233, 0.12));
    transition:
      border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      &:hover{
        border-color: #fff;
        transform: translateY(-.125rem)
      }
  }
}
</style>
