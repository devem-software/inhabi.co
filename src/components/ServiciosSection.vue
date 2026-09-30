<script setup>
import { computed } from "vue";
import { store, t, IMG } from "@/composables/useInhabiStore";

/* ─────────────────────────────────────────────────────────────
   Datos de servicios (ES / EN)
   ───────────────────────────────────────────────────────────── */
const SERVICIOS = [
  {
    id: "diseno",
    n: "01",
    img: "servicio_diseno",
    es: {
      title: "Diseño",
      kw: "Concepto · Identidad · Espacio",
      d: "Traducimos tu forma de habitar en un proyecto único. Exploramos materiales, luz y proporción para crear espacios que se sienten tan bien como se ven.",
      list: [
        "Diseño arquitectónico",
        "Diseño de interiores",
        "Mobiliario a medida",
        "Visualización 3D",
      ],
    },
    en: {
      title: "Design",
      kw: "Concept · Identity · Space",
      d: "We translate the way you live into a unique project. We explore materials, light and proportion to create spaces that feel as good as they look.",
      list: ["Architectural design", "Interior design", "Custom furniture", "3D visualization"],
    },
  },
  {
    id: "construccion",
    n: "02",
    img: "servicio_construccion",
    es: {
      title: "Construcción",
      kw: "Ejecución · Precisión · Calidad",
      d: "Ejecutamos cada proyecto con rigor técnico y acabados impecables. Nuestro equipo supervisa cada etapa para que el resultado final sea exactamente el que diseñamos.",
      list: ["Obra nueva", "Ampliaciones", "Adecuación de espacios", "Supervisión técnica"],
    },
    en: {
      title: "Construction",
      kw: "Execution · Precision · Quality",
      d: "We execute every project with technical rigor and impeccable finishes. Our team supervises each stage so the final result is exactly what we designed.",
      list: ["New construction", "Extensions", "Space fit-out", "Technical supervision"],
    },
  },
  {
    id: "remodelaciones",
    n: "03",
    img: "servicio_remodelacion",
    es: {
      title: "Remodelaciones",
      kw: "Transformación · Confianza · 60 días",
      d: "Renovamos tu vivienda de principio a fin en un plazo máximo de 60 días. Un solo equipo, un solo presupuesto, un solo responsable de principio a fin.",
      list: [
        "Remodelación integral",
        "Cocinas y baños",
        "Acabados y pisos",
        "Entrega llave en mano",
      ],
    },
    en: {
      title: "Renovations",
      kw: "Transformation · Trust · 60 days",
      d: "We renovate your home end to end within a maximum of 60 days. One team, one budget, one person accountable from start to finish.",
      list: ["Full renovation", "Kitchens & baths", "Finishes & flooring", "Turnkey delivery"],
    },
  },
  {
    id: "consultoria",
    n: "04",
    img: "servicio_consultoria",
    es: {
      title: "Consultoría",
      kw: "Estrategia · Viabilidad · Valor",
      d: "Acompañamos tu proyecto con criterio técnico y estratégico. Evaluamos viabilidad, alcance y presupuesto antes de invertir el primer peso.",
      list: [
        "Estudios de viabilidad",
        "Presupuestos y cronogramas",
        "Interventoría",
        "Asesoría en compra",
      ],
    },
    en: {
      title: "Consulting",
      kw: "Strategy · Feasibility · Value",
      d: "We support your project with technical and strategic criteria. We assess feasibility, scope and budget before you invest the first peso.",
      list: [
        "Feasibility studies",
        "Budgets & schedules",
        "Project supervision",
        "Purchase advisory",
      ],
    },
  },
];

const lang = computed(() => store.lang);

const imgUrl = (id) => computed(() => {
  alert(id)
  const url = IMG(id);
  console.log(url)
  return url;
});
</script>

<template>
  <section id="servicios" class="sec">
    <div class="wrap">
      <!-- ── Encabezado ─────────────────────────────── -->
      <header class="head" data-rv>
        <div class="head-left">
          <div class="eyebrow">{{ t.servicios.eyebrow }}</div>
          <h2 class="title">{{ t.servicios.title }}</h2>
        </div>
        <p class="sub">{{ t.servicios.sub }}</p>
      </header>

      <!-- ── Grid de tarjetas ───────────────────────── -->
      <div class="servicios__grid">
        <article v-for="s in SERVICIOS" :key="s.id" class="card servicio-card">
          <!-- Imagen -->
          <div class="card__media servicio-card__media">
            <img
              :src="IMG(s.img)"
              :alt="s[lang].title"
              loading="lazy"
            />
            <span class="servicio-card__num">{{ s.n }}</span>
          </div>

          <!-- Cuerpo -->
          <div class="card__body servicio-card__body">
            <div class="servicio-card__head">
              <h3 class="card__title">{{ s[lang].title }}</h3>
            </div>

            <span class="card__kw">{{ s[lang].kw }}</span>

            <p class="card__desc">{{ s[lang].d }}</p>

            <!-- Lista de entregables -->
            <ul class="servicio-card__list">
              <li v-for="item in s[lang].list" :key="item">
                <span class="servicio-card__dot" aria-hidden="true"></span>
                {{ item }}
              </li>
            </ul>

            <!-- CTA -->
            <!-- <a href="#cotizar" class="card__cta servicio-card__cta">
              {{ t.cta }}
              <span aria-hidden="true">→</span>
            </a> -->
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sec {
  scroll-margin-top: 60px;
  background: #1b1a16;
  padding: clamp(72px, 10vw, 140px) clamp(20px, 4vw, 56px);
}

.wrap {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 48px;
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
    500 11px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #cdd2c0;
}
.title {
  margin: 0;
  font:
    400 clamp(40px, 5.4vw, 88px)/0.95 "Instrument Serif",
    serif;
  letter-spacing: -0.01em;
  max-width: 16ch;
  text-wrap: balance;
}
.tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tab {
  cursor: pointer;
  border: 1px solid transparent;
  padding: 12px 20px;
  border-radius: 999px;
  font:
    500 11px/1 "IBM Plex Mono",
    monospace;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: all 0.25s;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
}
/* ============================================================
   SERVICIOS — hereda tokens de src/styles/design-system.css
   ============================================================ */

.servicios {
  background: var(--ink);
}

/* ── Encabezado de sección ──────────────────────────────── */
.servicios__head {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 56px;
}
.servicios__head-col {
  display: grid;
  gap: 20px;
}
.servicios__title {
  max-width: 14ch;
  text-wrap: balance;
}
.servicios__sub {
  margin: 0;
  max-width: 42ch;
  color: var(--fg-soft);
}

/* ── Grid ──────────────────────────────────────────────── */
.servicios__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 20px;
}

/* ── Tarjeta ───────────────────────────────────────────── */
.servicio-card {
  display: flex;
  flex-direction: column;
  background: #000;
  border: 1px solid var(--border-dark-1);
  transition:
    border-color var(--t-base) var(--ease),
    transform var(--t-slow) var(--ease);
}
.servicio-card:hover {
  border-color: var(--sage);
  transform: translateY(-4px);
}

/* Imagen */
.servicio-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ink-soft);
}
.servicio-card__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .2s var(--ease);
}
.servicio-card:hover .servicio-card__media img {
  transform: scale(1.05);
}

/* Número sobre la imagen */
.servicio-card__num {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 10px;
  background: rgba(18, 17, 14, 0.72);
  color: var(--cream);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.16em;
  border-radius: 4px;
}

/* Cuerpo */
.servicio-card__body {
  display: grid;
  gap: 14px;
  padding: 24px;
  border-top: 1px solid var(--border-dark-1);
  flex: 1;
  align-content: start;
}

.servicio-card__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.servicio-card .card__title {
  font: 400 40px/1 var(--font-display);
  margin: 0;
}

.servicio-card .card__kw {
  font: 500 10px/1.4 var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage);
}

.servicio-card .card__desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--fg-soft);
}

/* Lista de entregables */
.servicio-card__list {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  display: grid;
  gap: 8px;
  border-top: 1px solid var(--border-dark-1);
  padding-top: 16px;
}
.servicio-card__list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.4;
  color: var(--fg-muted);
}
.servicio-card__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--sage);
  flex-shrink: 0;
}

/* CTA */
.servicio-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 18px;
  font: 600 13px/1 var(--font-sans);
  color: var(--fg);
  border-top: 1px solid var(--border-dark-1);
  transition: color var(--t-fast) var(--ease);
}
.servicio-card__cta:hover {
  color: var(--sage);
}
.servicio-card__cta span {
  transition: transform var(--t-fast) var(--ease);
}
.servicio-card__cta:hover span {
  transform: translateX(4px);
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 767px) {
  .servicios__head {
    margin-bottom: 40px;
  }
  .servicio-card .card__title {
    font-size: 34px;
  }
}
</style>
