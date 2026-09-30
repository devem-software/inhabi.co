<script setup>
import { computed } from 'vue'
import { PROJECTS, IMG, store, t } from '@/composables/useInhabiStore'

const items = computed(() =>
  PROJECTS.map((p) => ({
    ...p,
    img: IMG(p.img),
    href: `Proyecto.dc.html?p=${p.slug}${store.lang === 'en' ? '&lang=en' : ''}`,
  })),
)
</script>

<template>
  <section id="proyectos" data-screen-label="Proyectos" class="sec">
    <div class="wrap">
      <div v-reveal class="head">
        <div class="head-left">
          <div class="eyebrow">{{ t.proy.eyebrow }}</div>
          <h2 class="title">{{ t.proy.title }}</h2>
        </div>
        <p class="p">{{ t.proy.p }}</p>
      </div>

      <div class="grid">
        <a v-for="p in items" :key="p.slug" :href="p.href" class="card">
          <div class="card-media">
            <img :src="p.img" :alt="p.name" />
          </div>
          <div class="card-foot">
            <span class="card-name">{{ p.name }}</span>
            <span class="card-meta">{{ p.n }} · {{ t.proy.ver }} →</span>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  scroll-margin-top: 60px;
  background: #F3F0E9;
  color:#12110e;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}
.wrap {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 56px;
}
.head {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-end;
}
.head-left {
  display: grid;
  gap: 20px;
}
.eyebrow {
  font:
    500 11px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6f7a5f;
}
.title {
  margin: 0;
  font:
   400 clamp(38px, 4.6vw, 72px)/1 'Instrument Serif',
    serif;
  letter-spacing: -0.01em;
  text-wrap: balance;
}
.p {
  margin: 0;
  max-width: 44ch;
  color: #4d493f;
  line-height: 1.6;
  text-wrap: pretty;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 20px;
}
.card {
  display: grid;
  gap: 18px;
  color: #f3f0e9;
}
.card-media {
  aspect-ratio: 4/5;
  overflow: hidden;
  position: relative;
  background: #1b1a16;
}
.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .2s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.card:hover .card-media img {
  transform: scale(1.05);
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  border-top: 1px solid rgba(243, 240, 233, 0.2);
  padding-top: 14px;
}
.card-name {
  font:
    400 30px/1 'Instrument Serif',
    serif;
    color:#2B2A24;
}
.card-meta {
  font:
    500 10px/1 'IBM Plex Mono',
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8F8C80;
  white-space: nowrap;
}
</style>
