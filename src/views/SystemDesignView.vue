<!-- src/views/SystemDesignView.vue -->
<template>
  <div class="ds-layout">
    <!-- ================= SIDEBAR ================= -->
    <aside class="ds-sidebar">
      <h1>Inhabi</h1>
      <p class="ds-brand-sub">Design System v1.0</p>
      <nav class="ds-nav">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{ 'is-active': activeSection === item.id }"
        >
          <span>{{ item.num }}</span> {{ item.label }}
        </a>
      </nav>
    </aside>

    <!-- ================= MAIN ================= -->
    <main class="ds-main">
      <!-- HERO -->
      <header id="intro" class="ds-hero">
        <p class="ds-section__eyebrow">00 · Introducción</p>
        <h1>Design System<br /><em style="color: var(--sage)">Inhabi</em></h1>
        <p>
          Sistema de diseño normalizado a partir del sitio original. Consolida colores, tipografía,
          botones, tarjetas, formularios y componentes reutilizables en tokens CSS y clases
          utilitarias. Todas las clases llevan el prefijo del sistema y funcionan tanto en
          superficies oscuras como claras.
        </p>
        <div class="flex gap-12 wrap mt-48">
          <span class="badge badge--sage">CSS Tokens</span>
          <span class="badge badge--ghost">Vanilla CSS</span>
          <span class="badge badge--ghost">Accesible (AA)</span>
          <span class="badge badge--ghost">Motion reducido</span>
        </div>
      </header>

      <!-- TOKENS -->
      <section id="tokens" class="ds-section">
        <p class="ds-section__eyebrow">01 · Fundación</p>
        <h2>Tokens de diseño</h2>
        <p>
          Variables globales que alimentan todos los componentes. Cámbialas y todo el sistema se
          adapta automáticamente.
        </p>

        <div class="ds-sub">
          <h3>Espaciado fluido</h3>
          <p>Se adaptan al viewport con <code>clamp()</code>, sin breakpoints duros.</p>
          <CodeBlock :code="codeSpacing" />
        </div>

        <div class="ds-sub">
          <h3>Radios</h3>
          <CodeBlock :code="codeRadii" />
        </div>

        <div class="ds-sub">
          <h3>Movimiento</h3>
          <CodeBlock :code="codeMotion" />
        </div>

        <div class="ds-sub">
          <h3>Sombras</h3>
          <CodeBlock :code="codeShadows" />
        </div>
      </section>

      <!-- COLORES -->
      <section id="colores" class="ds-section">
        <p class="ds-section__eyebrow">02 · Fundación</p>
        <h2>Paleta de colores</h2>
        <p>
          Dos superficies base (tinta y crema), un acento verde salvia y escalas de texto/borde
          derivadas.
        </p>

        <div class="ds-sub">
          <h3>Marca</h3>
          <div class="swatches">
            <div
              v-for="c in brandColors"
              :key="c.token"
              class="swatch"
              :class="{ 'is-copied': copiedToken === c.token }"
              role="button"
              tabindex="0"
              :aria-label="`Copiar ${c.hex}`"
              @click="copyColor(c.hex, c.token)"
              @keydown.enter.prevent="copyColor(c.hex, c.token)"
              @keydown.space.prevent="copyColor(c.hex, c.token)"
            >
              <div
                class="swatch__color"
                :style="{
                  background: c.hex,
                  borderBottom: c.token === '--ink' ? '1px solid rgba(243,240,233,.1)' : 'none',
                }"
              >
                <transition name="fade">
                  <span v-if="copiedToken === c.token" class="swatch__feedback">✓ Copiado</span>
                </transition>
              </div>
              <div class="swatch__meta">
                <p class="swatch__name">{{ c.name }}</p>
                <p class="swatch__hex">{{ c.hex.toUpperCase() }}</p>
                <p class="swatch__token">{{ c.token }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Texto sobre oscuro</h3>
          <div class="swatches">
            <div
              v-for="c in darkTextColors"
              :key="c.token"
              class="swatch"
              :class="{ 'is-copied': copiedToken === c.token }"
              role="button"
              tabindex="0"
              :aria-label="`Copiar ${c.hex}`"
              @click="copyColor(c.hex, c.token)"
              @keydown.enter.prevent="copyColor(c.hex, c.token)"
              @keydown.space.prevent="copyColor(c.hex, c.token)"
            >
              <div
                class="swatch__color"
                :style="{
                  background: c.hex,
                  borderBottom: c.token === '--ink' ? '1px solid rgba(243,240,233,.1)' : 'none',
                }"
              >
                <transition name="fade">
                  <span v-if="copiedToken === c.token" class="swatch__feedback">✓ Copiado</span>
                </transition>
              </div>
              <div class="swatch__meta">
                <p class="swatch__name">{{ c.name }}</p>
                <p class="swatch__hex">{{ c.hex.toUpperCase() }}</p>
                <p class="swatch__token">{{ c.token }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Texto sobre claro</h3>
          <div class="swatches">
            <div
              v-for="c in lightTextColors"
              :key="c.token"
              class="swatch"
              :class="{ 'is-copied': copiedToken === c.token }"
              role="button"
              tabindex="0"
              :aria-label="`Copiar ${c.hex}`"
              @click="copyColor(c.hex, c.token)"
              @keydown.enter.prevent="copyColor(c.hex, c.token)"
              @keydown.space.prevent="copyColor(c.hex, c.token)"
            >
              <div
                class="swatch__color"
                :style="{
                  background: c.hex,
                  borderBottom: c.token === '--ink' ? '1px solid rgba(243,240,233,.1)' : 'none',
                }"
              >
                <transition name="fade">
                  <span v-if="copiedToken === c.token" class="swatch__feedback">✓ Copiado</span>
                </transition>
              </div>
              <div class="swatch__meta">
                <p class="swatch__name">{{ c.name }}</p>
                <p class="swatch__hex">{{ c.hex.toUpperCase() }}</p>
                <p class="swatch__token">{{ c.token }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Bordes</h3>
          <table class="ds-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Valor</th>
                <th>Uso</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in borders" :key="b.token">
                <td>
                  <code>{{ b.token }}</code>
                </td>
                <td>{{ b.value }}</td>
                <td>{{ b.usage }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TIPOGRAFÍA -->
      <section id="tipografia" class="ds-section">
        <p class="ds-section__eyebrow">03 · Fundación</p>
        <h2>Tipografía</h2>
        <p>
          Tres familias con roles claros: <strong>Instrument Serif</strong> para titulares y cifras,
          <strong>Manrope</strong> para cuerpo, <strong>IBM Plex Mono</strong>
          para etiquetas y datos técnicos.
        </p>

        <div class="ds-sub">
          <h3>Escala</h3>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">Display · 148px</p>
            <p class="t-display">Habitar</p>
          </div>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">H1 · 120px</p>
            <p class="t-h1">Espacios que se <em style="color: var(--sage)">sienten</em>.</p>
          </div>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">H2 · 88px</p>
            <p class="t-h2">Tres formas de habitar</p>
          </div>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">H3 · 56px</p>
            <p class="t-h3">Mismo espacio, otro carácter</p>
          </div>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">H4 · 40px</p>
            <p class="t-h4">Detalles que importan</p>
          </div>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">Cuerpo + Lead + Italic</p>
            <p class="t-lead">Diseñamos soluciones exclusivas, innovadoras y de alta calidad.</p>
            <p class="t-body mt-24">
              Cada proyecto se cotiza según metraje, alcance, ubicación y acabados. Completa los
              datos y te enviamos una propuesta a la medida.
            </p>
            <p class="t-italic" style="font-size: 22px; color: var(--sage); margin-top: 20px">
              Si te identificas con la luz, la calidez y los espacios que recargan el espíritu…
            </p>
          </div>

          <div class="ds-demo ds-demo--dark">
            <p class="ds-demo__label">Eyebrow + Mono label</p>
            <p class="t-eyebrow">Arquitectura e interiorismo · Bogotá</p>
            <p class="t-mono-label" style="color: var(--fg-soft); margin-top: 14px">
              WhatsApp · +57 322 727 6453
            </p>
          </div>

          <CodeBlock :code="codeTypography" />
        </div>
      </section>

      <!-- BOTONES -->
      <section id="botones" class="ds-section">
        <p class="ds-section__eyebrow">04 · Componente</p>
        <h2>Botones</h2>
        <p>
          Variantes que se adaptan automáticamente a la superficie contenedora. Añade
          <code>.surface--light</code> al contenedor y los botones adoptan la paleta clara.
        </p>

        <div class="ds-sub">
          <h3>Sobre superficie oscura</h3>
          <div class="ds-demo ds-demo--dark flex gap-12 wrap center">
            <button class="btn btn--primary">Diseña tu espacio</button>
            <button class="btn btn--outline">Solicitar cotización</button>
            <button class="btn btn--ghost">Ver más</button>
            <button class="btn btn--sage">Agendar visita</button>
          </div>

          <h3 style="margin-top: 32px">Sobre superficie clara</h3>
          <div class="ds-demo ds-demo--light surface--light flex gap-12 wrap center">
            <button class="btn btn--primary">Cotizar esta combinación</button>
            <button class="btn btn--outline">Explorar</button>
            <button class="btn btn--ghost">Cancelar</button>
          </div>

          <h3 style="margin-top: 32px">Tamaños</h3>
          <div class="ds-demo ds-demo--dark flex gap-12 wrap center">
            <button class="btn btn--sm btn--primary">Small</button>
            <button class="btn btn--primary">Default</button>
            <button class="btn btn--lg btn--primary">Large</button>
          </div>

          <h3 style="margin-top: 32px">Tabs y selector de idioma</h3>
          <div class="ds-demo ds-demo--dark2 flex gap-12 wrap center">
            <button class="btn-tab is-on">01 Natural</button>
            <button class="btn-tab">02 Minimal</button>
            <button class="btn-tab">03 Industrial</button>
            <div class="lang-toggle" style="margin-left: 12px">
              <button class="is-on">ES</button>
              <button>EN</button>
            </div>
          </div>

          <div class="ds-demo ds-demo--light surface--light flex gap-12 wrap center">
            <button class="btn-tab is-on">Apartamento</button>
            <button class="btn-tab">Casa</button>
            <button class="btn-tab">Oficina</button>
          </div>

          <CodeBlock :code="codeButtons" />
        </div>
      </section>

      <!-- BADGES -->
      <section id="badges" class="ds-section">
        <p class="ds-section__eyebrow">05 · Componente</p>
        <h2>Badges &amp; etiquetas</h2>
        <p>Pequeñas cápsulas informativas: categorías, estados, numeración de pasos.</p>

        <div class="ds-demo ds-demo--dark flex gap-12 wrap center">
          <span class="badge">01 · Combos</span>
          <span class="badge badge--sage">Nuevo</span>
          <span class="badge badge--cream">Integral · Natural</span>
          <span class="badge badge--ghost">En obra</span>
          <span class="step-index">01 —</span>
        </div>

        <CodeBlock :code="codeBadges" />
      </section>

      <!-- TARJETAS -->
      <section id="tarjetas" class="ds-section">
        <p class="ds-section__eyebrow">06 · Componente</p>
        <h2>Tarjetas</h2>
        <p>
          Tres familias: combo (paquete con imagen), proyecto (link visual) y opción de
          configurador.
        </p>

        <div class="ds-sub">
          <h3>Tarjeta Combo</h3>
          <div class="ds-demo ds-demo--dark">
            <div
              class="grid-auto"
              style="grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr))"
            >
              <article class="card is-active">
                <div class="card__media" style="aspect-ratio: 16/10">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                    alt=""
                  />
                </div>
                <div class="card__body">
                  <div class="card__head">
                    <span class="card__title">Vital</span>
                    <span class="card__kicker">02</span>
                  </div>
                  <span class="card__kw">Práctico · Estructurado</span>
                  <p class="card__desc">
                    Mantiene el sello de diseño elevando la experiencia con mobiliario más amplio y
                    mejor organización diaria.
                  </p>
                  <span class="card__cta">Ver en el configurador →</span>
                </div>
              </article>

              <article class="card">
                <div class="card__media" style="aspect-ratio: 16/10">
                  <img
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                    alt=""
                  />
                </div>
                <div class="card__body">
                  <div class="card__head">
                    <span class="card__title">Integral</span>
                    <span class="card__kicker">03</span>
                  </div>
                  <span class="card__kw">Sofisticación · Presencia</span>
                  <p class="card__desc">
                    La experiencia más completa: mobiliario de gran escala, áreas sociales
                    integradas y almacenamiento superior.
                  </p>
                  <span class="card__cta">Ver en el configurador →</span>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Tarjeta Proyecto</h3>
          <div class="ds-demo ds-demo--dark">
            <div
              class="grid-auto"
              style="grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr))"
            >
              <a href="#" class="card-project">
                <div class="card__media">
                  <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80"
                    alt=""
                  />
                </div>
                <div class="card-project__meta">
                  <span class="card-project__name">Prieto 208</span>
                  <span class="card-project__tag">01 · Ver →</span>
                </div>
              </a>

              <a href="#" class="card-project">
                <div class="card__media">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                    alt=""
                  />
                </div>
                <div class="card-project__meta">
                  <span class="card-project__name">Serna &amp; Velasco</span>
                  <span class="card-project__tag">02 · Ver →</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Opciones del configurador (sobre claro)</h3>
          <div class="ds-demo ds-demo--light surface--light" style="display: grid; gap: 12px">
            <div style="max-width: 320px; display: grid; gap: 6px">
              <button class="opt is-on"><span>Balance</span><span class="opt__n">01</span></button>
              <button class="opt"><span>Vital</span><span class="opt__n">02</span></button>
              <button class="opt"><span>Integral</span><span class="opt__n">03</span></button>
            </div>

            <div
              style="
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                max-width: 360px;
                margin-top: 20px;
              "
            >
              <button class="opt-thumb is-on">
                <div class="opt-thumb__img">
                  <img
                    src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80"
                    alt=""
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                </div>
                <span class="opt-thumb__label">Natural</span>
              </button>

              <button class="opt-thumb">
                <div class="opt-thumb__img">
                  <img
                    src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&q=80"
                    alt=""
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                </div>
                <span class="opt-thumb__label">Minimal</span>
              </button>

              <button class="opt-thumb">
                <div class="opt-thumb__img">
                  <img
                    src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400&q=80"
                    alt=""
                    style="width: 100%; height: 100%; object-fit: cover"
                  />
                </div>
                <span class="opt-thumb__label">Industrial</span>
              </button>
            </div>
          </div>

          <CodeBlock :code="codeCards" />
        </div>
      </section>

      <!-- FORMULARIOS -->
      <section id="formularios" class="ds-section">
        <p class="ds-section__eyebrow">07 · Componente</p>
        <h2>Formularios</h2>
        <p>
          Inputs minimalistas con subrayado, chips de selección múltiple, rangos y botones de
          día/hora. Todos heredan el tema de su contenedor.
        </p>

        <div class="ds-sub">
          <h3>Campos (superficie clara)</h3>
          <div class="ds-demo ds-demo--light surface--light">
            <div
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
                gap: 20px;
              "
            >
              <label class="field">
                <span class="field__label">Nombre</span>
                <input class="input" type="text" placeholder="Tu nombre" />
              </label>
              <label class="field">
                <span class="field__label">Teléfono</span>
                <input class="input" type="tel" placeholder="+57 …" />
              </label>
              <label class="field">
                <span class="field__label">Email</span>
                <input class="input" type="email" placeholder="tu@correo.com" />
              </label>
              <label class="field">
                <span class="field__label">Ciudad / barrio</span>
                <input class="input" type="text" placeholder="Bogotá" />
              </label>
            </div>
            <label class="field mt-24">
              <span class="field__label">Cuéntanos más</span>
              <textarea class="textarea" rows="3" placeholder="Detalles del proyecto…"></textarea>
            </label>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Chips de selección múltiple</h3>
          <div class="ds-demo ds-demo--light surface--light flex gap-8 wrap">
            <button class="chip is-on"><span class="chip__mark">✓</span> Cocina</button>
            <button class="chip is-on"><span class="chip__mark">✓</span> Baños</button>
            <button class="chip"><span class="chip__mark">+</span> Zona social</button>
            <button class="chip"><span class="chip__mark">+</span> Habitaciones</button>
            <button class="chip"><span class="chip__mark">+</span> Estudio</button>
            <button class="chip"><span class="chip__mark">+</span> Terraza</button>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Range (área)</h3>
          <div class="ds-demo ds-demo--light surface--light" style="display: grid; gap: 14px">
            <div class="flex between baseline">
              <span class="field__label">Área aproximada</span>
              <span style="font: 400 44px/1 var(--font-display)">{{ rangeValue }} m²</span>
            </div>
            <input
              v-model.number="rangeValue"
              class="range"
              type="range"
              min="20"
              max="400"
              step="5"
            />
          </div>
        </div>

        <div class="ds-sub">
          <h3>Selector de día y hora</h3>
          <div class="ds-demo ds-demo--light surface--light" style="display: grid; gap: 20px">
            <div
              style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
                gap: 6px;
              "
            >
              <button
                v-for="d in demoDays"
                :key="d.num"
                class="day"
                :class="{ 'is-on': selectedDay === d.num }"
                @click="selectedDay = d.num"
              >
                <span class="day__wd">{{ d.wd }}</span>
                <span class="day__num">{{ d.num }}</span>
                <span class="day__mo">{{ d.mo }}</span>
              </button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px">
              <button
                v-for="s in demoTimes"
                :key="s"
                class="btn-tab"
                :class="{ 'is-on': selectedTime === s }"
                @click="selectedTime = s"
              >
                {{ s }}
              </button>
            </div>
          </div>
        </div>

        <CodeBlock :code="codeForms" />
      </section>

      <!-- NAVEGACIÓN -->
      <section id="navegacion" class="ds-section">
        <p class="ds-section__eyebrow">08 · Componente</p>
        <h2>Navegación</h2>
        <p>
          Barra fija con fondo translúcido que aparece al hacer scroll. Los enlaces usan mono
          uppercase para un aire editorial.
        </p>

        <div class="ds-demo ds-demo--dark" style="padding: 0; overflow: hidden">
          <div style="position: relative; height: 90px">
            <div class="nav is-scrolled" style="position: absolute">
              <a
                href="#"
                style="display: flex; align-items: center; font: 400 20px/1 var(--font-display)"
              >
                Inhabi
              </a>
              <div class="nav__links">
                <a href="#">Combos</a>
                <a href="#">Estilos</a>
                <a href="#">Configurador</a>
                <a href="#">Proyectos</a>
                <a href="#">Cotizar</a>
                <div class="lang-toggle">
                  <button class="is-on">ES</button>
                  <button>EN</button>
                </div>
                <a href="#" class="btn btn--primary btn--sm">Agendar</a>
              </div>
            </div>
          </div>
        </div>

        <CodeBlock :code="codeNav" />
      </section>

      <!-- SECCIONES -->
      <section id="secciones" class="ds-section">
        <p class="ds-section__eyebrow">09 · Layout</p>
        <h2>Secciones y contenedores</h2>
        <p>
          Cuatro combinaciones de fondo alternadas. El contenedor limita a 1400&nbsp;px; el gutter
          es fluido.
        </p>

        <div class="ds-sub">
          <h3>Fondos</h3>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 12px;
            "
          >
            <div
              v-for="bg in sectionBackgrounds"
              :key="bg.cls"
              class="ds-demo"
              :class="bg.cls"
              style="text-align: center; margin: 0"
            >
              <p class="ds-demo__label" style="margin: 0">{{ bg.label }}</p>
            </div>
          </div>

          <CodeBlock :code="codeSection" />
        </div>
      </section>

      <!-- ESPECIALES -->
      <section id="especiales" class="ds-section">
        <p class="ds-section__eyebrow">10 · Componente</p>
        <h2>Componentes especiales</h2>
        <p>
          Patrones recurrentes del sitio: botón flotante de WhatsApp, panel sticky de resumen,
          callout de éxito y comparador antes/después.
        </p>

        <div class="ds-sub">
          <h3>Panel sticky de resumen</h3>
          <div
            class="ds-demo ds-demo--light surface--light"
            style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
              gap: 24px;
              align-items: start;
            "
          >
            <div style="display: grid; gap: 16px">
              <p class="t-body">
                A la derecha verás el panel de resumen con imagen, lista de filas y botones de
                acción. Sustituye la imagen por el render del configurador.
              </p>
              <button class="btn btn--primary">Enviar solicitud</button>
            </div>

            <div class="sticky-panel" style="position: relative; top: 0">
              <span class="t-mono-sm" style="color: var(--sage)"> Resumen de tu solicitud </span>
              <div style="aspect-ratio: 16/10; overflow: hidden; background: #1b1a16">
                <img
                  src="https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80"
                  alt=""
                  style="width: 100%; height: 100%; object-fit: cover"
                />
              </div>
              <div>
                <div class="summary-row"><span>Inmueble</span><span>Apartamento</span></div>
                <div class="summary-row"><span>Área</span><span>120 m²</span></div>
                <div class="summary-row"><span>Combo</span><span>Vital</span></div>
                <div class="summary-row"><span>Estilo</span><span>Natural</span></div>
                <div class="summary-row"><span>Plazo</span><span>Hasta 60 días</span></div>
              </div>
              <button class="btn btn--primary btn--block">Enviar solicitud</button>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Callout de éxito</h3>
          <div class="ds-demo ds-demo--light surface--light">
            <div class="callout-success" style="max-width: 420px">
              <strong>Recibimos tu solicitud.</strong>
              <span style="font-size: 14px; line-height: 1.5">
                Te contactaremos en menos de 24 horas hábiles para agendar la visita técnica.
              </span>
            </div>
          </div>
        </div>

        <div class="ds-sub">
          <h3>Comparador antes / después</h3>
          <div class="ds-demo ds-demo--dark">
            <CompareSlider />
          </div>

          <CodeBlock :code="codeCompare" />
        </div>

        <div class="ds-sub">
          <h3>Botón flotante WhatsApp</h3>
          <p style="color: var(--fg-soft); font-size: 14px">
            En producción ocupa la esquina inferior derecha. Aquí lo mostramos inline.
          </p>
          <div class="ds-demo ds-demo--dark">
            <a
              href="#"
              class="fab"
              style="position: relative; right: auto; bottom: auto; display: inline-flex"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <!-- ANIMACIONES -->
      <section id="animaciones" class="ds-section">
        <p class="ds-section__eyebrow">11 · Movimiento</p>
        <h2>Animaciones</h2>
        <p>
          Curvas y duraciones consistentes. Se desactivan automáticamente con
          <code>prefers-reduced-motion</code>.
        </p>

        <div class="ds-sub">
          <h3>Clases utilitarias</h3>
          <div
            class="ds-demo ds-demo--dark"
            style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
              gap: 16px;
            "
          >
            <div
              v-for="anim in ['anim-in', 'anim-up', 'anim-up-slow']"
              :key="anim"
              :class="anim"
              style="padding: 20px; background: var(--ink-soft); text-align: center"
            >
              <p class="t-mono-sm" style="color: var(--sage)">.{{ anim }}</p>
            </div>
          </div>

          <CodeBlock :code="codeAnimations" />
        </div>
      </section>

      <!-- UTILIDADES -->
      <section id="utilidades" class="ds-section">
        <p class="ds-section__eyebrow">12 · Ayudas</p>
        <h2>Utilidades</h2>
        <p>Clases de una sola función para composición rápida.</p>

        <table class="ds-table">
          <thead>
            <tr>
              <th>Clase</th>
              <th>Efecto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in utilities" :key="u.cls">
              <td>
                <code>{{ u.cls }}</code>
              </td>
              <td>{{ u.effect }}</td>
            </tr>
          </tbody>
        </table>

        <div class="ds-sub">
          <h3>Estructura recomendada de archivos</h3>
          <CodeBlock :code="codeFileStructure" />
        </div>

        <div class="ds-sub">
          <h3>Adopción en HTML</h3>
          <CodeBlock :code="codeAdoption" />
        </div>
      </section>

      <footer
        style="padding: 64px 0 0; border-top: 1px solid var(--border-dark-1); text-align: center"
      >
        <p class="t-eyebrow">Inhabi Design System · v1.0</p>
        <p
          style="
            font: 400 11px/1.6 var(--font-mono);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--fg-ghost);
            margin-top: 12px;
          "
        >
          Arquitectura · Interiorismo · Remodelación
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import CodeBlock from "@/components/system-design/CodeBlock.vue";
import CompareSlider from "@/components/system-design/CompareSlider.vue";
import ColorSwatch from "@/components/system-design/ColorSwatch.vue";
import { siteUrl } from "@/composables/useInhabiStore";


/* ---------------- Navegación lateral ---------------- */
const navItems = [
  { id: "intro", num: "00", label: "Introducción" },
  { id: "tokens", num: "01", label: "Tokens" },
  { id: "colores", num: "02", label: "Colores" },
  { id: "tipografia", num: "03", label: "Tipografía" },
  { id: "botones", num: "04", label: "Botones" },
  { id: "badges", num: "05", label: "Badges" },
  { id: "tarjetas", num: "06", label: "Tarjetas" },
  { id: "formularios", num: "07", label: "Formularios" },
  { id: "navegacion", num: "08", label: "Navegación" },
  { id: "secciones", num: "09", label: "Secciones" },
  { id: "especiales", num: "10", label: "Especiales" },
  { id: "animaciones", num: "11", label: "Animaciones" },
  { id: "utilidades", num: "12", label: "Utilidades" },
];
const activeSection = ref("intro");

const handleScroll = () => {
  const y = window.scrollY + 140;
  let current = navItems[0].id;
  for (const item of navItems) {
    const el = document.getElementById(item.id);
    if (el && el.offsetTop <= y) current = item.id;
  }
  activeSection.value = current;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/* ---------------- Datos de color ---------------- */
const brandColors = [
  { name: "Ink", hex: "#12110e", token: "--ink" },
  { name: "Ink Soft", hex: "#1b1a16", token: "--ink-soft" },
  { name: "Ink Hover", hex: "#2b2a24", token: "--ink-hover" },
  { name: "Cream", hex: "#f3f0e9", token: "--cream" },
  { name: "Cream Soft", hex: "#e6e1d6", token: "--cream-soft" },
  { name: "Sage", hex: "#cdd2c0", token: "--sage" },
];
const darkTextColors = [
  { name: "FG", hex: "#f3f0e9", token: "--fg" },
  { name: "FG Muted", hex: "#d8d4c8", token: "--fg-muted" },
  { name: "FG Soft", hex: "#b9b5a8", token: "--fg-soft" },
  { name: "FG Dim", hex: "#a8a597", token: "--fg-dim" },
  { name: "FG Ghost", hex: "#8f8c80", token: "--fg-ghost" },
];
const lightTextColors = [
  { name: "Ink FG", hex: "#12110e", token: "--ink-fg" },
  { name: "Ink Muted", hex: "#4d493f", token: "--ink-muted" },
  { name: "Ink Soft", hex: "#6b675c", token: "--ink-soft-fg" },
  { name: "Ink Accent", hex: "#6f7a5f", token: "--ink-accent" },
];
const borders = [
  {
    token: "--border-dark-1",
    value: "rgba(243,240,233,.12)",
    usage: "Divisores sutiles sobre oscuro",
  },
  { token: "--border-dark-2", value: "rgba(243,240,233,.20)", usage: "Bordes de tarjeta / meta" },
  { token: "--border-dark-3", value: "rgba(243,240,233,.35)", usage: "Botones tab, inputs" },
  { token: "--border-dark-4", value: "rgba(243,240,233,.50)", usage: "Botón outline, focus" },
  { token: "--border-light-1", value: "rgba(18,17,14,.15)", usage: "Divisores sobre claro" },
  { token: "--border-light-2", value: "rgba(18,17,14,.25)", usage: "Chips, inputs claro" },
  { token: "--border-light-3", value: "#12110e", usage: "Borde sólido principal" },
];

/* ---------------- Datos de utilidades ---------------- */
const utilities = [
  { cls: ".flex", effect: "display: flex" },
  { cls: ".flex-col", effect: "flex-direction: column" },
  { cls: ".gap-8 / .gap-12 / .gap-16 / .gap-24 / .gap-48", effect: "Espaciado entre hijos" },
  { cls: ".wrap", effect: "flex-wrap: wrap" },
  { cls: ".center", effect: "align-items: center" },
  { cls: ".between", effect: "justify-content: space-between" },
  { cls: ".baseline", effect: "align-items: baseline" },
  { cls: ".mt-24 / .mb-24 / .mt-48", effect: "Márgenes verticales" },
  { cls: ".hr", effect: "Divisor oscuro" },
  { cls: ".hr--light", effect: "Divisor claro" },
];

const sectionBackgrounds = [
  { cls: "ds-demo--dark", label: ".section--dark" },
  { cls: "ds-demo--dark2", label: ".section--dark2" },
  { cls: "ds-demo--light", label: ".section--light" },
  { cls: "ds-demo--light2", label: ".section--light2" },
];

/* ---------------- Demo interactiva ---------------- */
const rangeValue = ref(120);
const selectedDay = ref(29);
const selectedTime = ref("10:30");
const demoDays = [
  { wd: "Lun", num: 28, mo: "Sep" },
  { wd: "Mar", num: 29, mo: "Sep" },
  { wd: "Mié", num: 30, mo: "Sep" },
  { wd: "Jue", num: 1, mo: "Oct" },
  { wd: "Vie", num: 2, mo: "Oct" },
];
const demoTimes = ["9:00", "10:30", "12:00", "14:30", "16:00", "17:30"];

/* ---------------- Bloques de código ---------------- */
const codeSpacing = `/* Espaciado */
--gutter:    clamp(20px, 4vw, 56px);
--section-y: clamp(72px, 10vw, 140px);
--max-w:     1400px;`;

const codeRadii = `--r-pill: 999px;  /* Botones, badges */
--r-sm:   4px;    /* Chips, badges cuadrados */
--r-md:   8px;    /* Tarjetas */
--r-lg:   16px;`;

const codeMotion = `--ease:    cubic-bezier(.2, .7, .2, 1);
--ease-io: cubic-bezier(.76, 0, .24, 1);
--t-fast:  .2s;   --t-base: .3s;   --t-slow: .4s;`;

const codeShadows = `--shadow-sm: 0 4px 12px rgba(0,0,0,.18);
--shadow-md: 0 10px 30px rgba(0,0,0,.28);
--shadow-lg: 0 20px 50px rgba(0,0,0,.35);`;

const codeTypography = `<p class="t-display">Habitar</p>
<p class="t-h1">Espacios que se <em>sienten</em>.</p>
<p class="t-h2">Tres formas de habitar</p>
<p class="t-lead">…</p>
<p class="t-eyebrow">Arquitectura e interiorismo</p>`;

const codeButtons = `<!-- Botones base -->
<button class="btn btn--primary">Diseña tu espacio</button>
<button class="btn btn--outline">Solicitar cotización</button>
<button class="btn btn--ghost">Ver más</button>
<button class="btn btn--sage">Agendar visita</button>

<!-- Tamaños -->
<button class="btn btn--sm btn--primary">Small</button>
<button class="btn btn--lg btn--primary">Large</button>

<!-- Tabs -->
<button class="btn-tab is-on">01 Natural</button>
<button class="btn-tab">02 Minimal</button>

<!-- Selector de idioma -->
<div class="lang-toggle">
  <button class="is-on">ES</button>
  <button>EN</button>
</div>`;

const codeBadges = `<span class="badge">01 · Combos</span>
<span class="badge badge--sage">Nuevo</span>
<span class="badge badge--cream">Integral · Natural</span>
<span class="badge badge--ghost">En obra</span>`;

const codeCards = `<!-- Tarjeta combo -->
<article class="card is-active">
  <div class="card__media" style="aspect-ratio:16/10">
    <img src="…" alt="">
  </div>
  <div class="card__body">
    <div class="card__head">
      <span class="card__title">Vital</span>
      <span class="card__kicker">02</span>
    </div>
    <span class="card__kw">Práctico · Estructurado</span>
    <p class="card__desc">Descripción…</p>
    <span class="card__cta">Ver en el configurador →</span>
  </div>
</article>`;

const codeForms = `<!-- Campo -->
<label class="field">
  <span class="field__label">Nombre</span>
  <input class="input" type="text" placeholder="Tu nombre">
</label>

<!-- Chip -->
<button class="chip is-on">
  <span class="chip__mark">✓</span> Cocina
</button>

<!-- Día -->
<button class="day is-on">
  <span class="day__wd">Mar</span>
  <span class="day__num">29</span>
  <span class="day__mo">Sep</span>
</button>`;

const codeNav = `<nav class="nav">
  <a href="#top">Inhabi</a>
  <div class="nav__links">
    <a href="#combos">Combos</a>
    <a href="#estilos">Estilos</a>
    <div class="lang-toggle">…</div>
    <a href="#agenda" class="btn btn--primary btn--sm">Agendar</a>
  </div>
</nav>

<!-- JS: añade .is-scrolled al superar 60px de scroll -->`;

const codeSection = `<section class="section section--dark">
  <div class="container">
    <header class="section-head">
      <div class="section-head__col">
        <p class="t-eyebrow">01 — Combos</p>
        <h2 class="t-h2">Tres tipos de remodelación</h2>
      </div>
      <p class="section-head__sub t-body">…</p>
    </header>
  </div>
</section>`;

const codeCompare = `<div class="compare">
  <img src="antes.jpg">
  <img src="despues.jpg" style="clip-path:inset(0 50% 0 0)">
  <div class="compare__handle" style="left:50%">
    <div class="compare__knob">‹ ›</div>
  </div>
</div>`;

const codeAnimations = `<div class="anim-up">…</div>

/* Keyframes disponibles */
@keyframes inFade  { from { opacity: 0 } to { opacity: 1 } }
@keyframes inUp    { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
@keyframes inLine  { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes kb      { from { transform: scale(1.12) } to { transform: scale(1) } }

/* Respeta reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}`;

const codeFileStructure = `styles/
├── tokens.css        /* Variables :root — importar primero */
├── reset.css         /* Reset mínimo */
├── typography.css    /* .t-display, .t-h1, .t-body… */
├── buttons.css       /* .btn, .btn-tab, .lang-toggle */
├── cards.css         /* .card, .card-project, .opt, .opt-thumb */
├── forms.css         /* .field, .input, .chip, .day, .range */
├── navigation.css    /* .nav, .nav__links */
├── sections.css      /* .section, .container, .section-head */
├── components.css    /* .fab, .sticky-panel, .compare, .callout */
├── animations.css    /* @keyframes + .anim-* */
└── utilities.css     /* .flex, .gap-*, .mt-* */

main.css  /* importa todo en orden */`;

const codeAdoption = `<link rel="stylesheet" href="styles/main.css">

<!-- Sección clara: envuelve en .surface--light para que los componentes hereden -->
<section class="section section--light surface--light">
  <div class="container">
    <button class="btn btn--primary">Acción</button>
  </div>
</section>`;

/* ---------- Copiar HEX de la paleta ---------- */
const copiedToken = ref(null);
let copyTimer = null;

function copyColor(hex, token) {
  // Normaliza a #RRGGBB mayúsculas
  let value = String(hex).trim();
  if (!value.startsWith("#")) value = "#" + value;
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    value =
      "#" +
      value
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("");
  }
  value = value.toUpperCase();

  // Copia con fallback
  const done = () => {
    copiedToken.value = token;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copiedToken.value = null), 1300);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(value)
      .then(done)
      .catch(() => fallback());
  } else {
    fallback();
  }

  function fallback() {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch {}
    document.body.removeChild(ta);
  }
}

// SEO para SYSTEM DESIGN

import { useHead } from "@vueuse/head";


useHead({
  title: "Inhabi | Arquitectura, interiorismo y remodelación en Bogotá",

  meta: [
    {
      name: "description",
      content:
        "Diseñamos y ejecutamos proyectos de arquitectura, interiorismo y remodelación en Bogotá. Soluciones integrales, diseño personalizado y ejecución técnica.",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: "Inhabi | Arquitectura e interiorismo",
    },
    {
      property: "og:description",
      content: "Transformamos espacios con arquitectura, diseño interior y remodelación integral.",
    },
    {
      property: "og:url",
      content: siteUrl,
    },
    {
      property: "og:image",
      content: `${siteUrl}inhabi-social.jpg`,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
  ],

  link: [
    {
      rel: "canonical",
      href: siteUrl,
    },
  ],

  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "GeneralContractor",
        name: "Inhabi",
        url: siteUrl,
        image: `${siteUrl}inhabi-social.jpg`,
        description: "Arquitectura, interiorismo y remodelación integral en Bogotá, Colombia.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bogotá",
          addressRegion: "Bogotá D.C.",
          addressCountry: "CO",
        },
        areaServed: {
          "@type": "City",
          name: "Bogotá",
        },
      }),
    },
  ],
});
</script>

<style scoped>
/* =========================================================
   INHABI DESIGN SYSTEM · v1.0 (Vue SFC)
   ========================================================= */

/* ---------- 1. TOKENS ---------- */
:root {
  --ink: #12110e;
  --ink-soft: #1b1a16;
  --ink-hover: #2b2a24;
  --cream: #f3f0e9;
  --cream-soft: #e6e1d6;
  --sage: #cdd2c0;
  --sage-soft: #d6dbc9;

  --fg: #f3f0e9;
  --fg-muted: #d8d4c8;
  --fg-soft: #b9b5a8;
  --fg-dim: #a8a597;
  --fg-ghost: #8f8c80;

  --ink-fg: #12110e;
  --ink-muted: #4d493f;
  --ink-soft-fg: #6b675c;
  --ink-accent: #6f7a5f;

  --border-dark-1: rgba(243, 240, 233, 0.12);
  --border-dark-2: rgba(243, 240, 233, 0.2);
  --border-dark-3: rgba(243, 240, 233, 0.35);
  --border-dark-4: rgba(243, 240, 233, 0.5);
  --border-light-1: rgba(18, 17, 14, 0.15);
  --border-light-2: rgba(18, 17, 14, 0.25);
  --border-light-3: #12110e;

  --font-display: "Instrument Serif", Georgia, serif;
  --font-sans: "Manrope", system-ui, -apple-system, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --r-pill: 999px;
  --r-sm: 4px;
  --r-md: 8px;
  --r-lg: 16px;

  --gutter: clamp(20px, 4vw, 56px);
  --section-y: clamp(72px, 10vw, 140px);
  --max-w: 1400px;

  --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
  --ease-io: cubic-bezier(0.76, 0, 0.24, 1);
  --t-fast: 0.2s;
  --t-base: 0.3s;
  --t-slow: 0.4s;

  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.18);
  --shadow-md: 0 10px 30px rgba(0, 0, 0, 0.28);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.35);
}

/* ---------- 2. RESET (encapsulado al componente) ---------- */
.ds-layout *,
.ds-layout *::before,
.ds-layout *::after {
  box-sizing: border-box;
}

.ds-layout {
  background: var(--ink);
  color: var(--fg);
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
}
.ds-layout a {
  color: inherit;
  text-decoration: none;
}
.ds-layout button {
  font: inherit;
  cursor: pointer;
}
.ds-layout img {
  max-width: 100%;
  display: block;
}
.ds-layout input,
.ds-layout select,
.ds-layout textarea {
  font-family: inherit;
}

/* ---------- 3. TIPOGRAFÍA ---------- */
.t-display {
  font: 400 clamp(56px, 8vw, 148px)/0.92 var(--font-display);
  letter-spacing: -0.02em;
  margin: 0;
}
.t-h1 {
  font: 400 clamp(48px, 6vw, 120px)/0.95 var(--font-display);
  letter-spacing: -0.02em;
  margin: 0;
}
.t-h2 {
  font: 400 clamp(40px, 5.4vw, 88px)/0.95 var(--font-display);
  letter-spacing: -0.01em;
  margin: 0;
}
.t-h3 {
  font: 400 clamp(32px, 3.6vw, 56px)/1 var(--font-display);
  margin: 0;
}
.t-h4 {
  font: 400 clamp(24px, 2.4vw, 40px)/1.05 var(--font-display);
  margin: 0;
}
.t-italic {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
}
.t-num {
  font: 400 clamp(140px, 22vw, 340px)/0.78 var(--font-display);
  letter-spacing: -0.04em;
}

.t-body {
  font-size: 17px;
  line-height: 1.7;
  color: var(--fg-muted);
  margin: 0;
}
.t-body-sm {
  font-size: 15px;
  line-height: 1.6;
  color: var(--fg-soft);
  margin: 0;
}
.t-lead {
  font-size: 18px;
  line-height: 1.6;
  color: var(--fg-muted);
  margin: 0;
}

.t-eyebrow {
  font: 500 11px/1.4 var(--font-mono);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage);
  margin: 0;
}
.t-mono {
  font: 400 13px/1 var(--font-mono);
}
.t-mono-sm {
  font: 500 10px/1.4 var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.t-mono-label {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.surface--light .t-body,
.surface--light .t-lead {
  color: var(--ink-muted);
}
.surface--light .t-body-sm {
  color: var(--ink-soft-fg);
}
.surface--light .t-eyebrow {
  color: var(--ink-accent);
}
.surface--light .t-mono {
  color: var(--ink-muted);
}

/* ---------- 4. BOTONES ---------- */
.btn {
  --btn-bg: transparent;
  --btn-fg: var(--fg);
  --btn-bd: transparent;
  --btn-bg-h: var(--sage);
  --btn-fg-h: var(--ink);
  --btn-bd-h: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 26px;
  border-radius: var(--r-pill);
  background: var(--btn-bg);
  color: var(--btn-fg);
  border: 1px solid var(--btn-bd);
  font: 600 14px/1 var(--font-sans);
  letter-spacing: 0;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--t-base) var(--ease),
    color var(--t-base) var(--ease),
    border-color var(--t-base) var(--ease),
    transform var(--t-base) var(--ease);
}
.btn:hover {
  background: var(--btn-bg-h);
  color: var(--btn-fg-h);
  border-color: var(--btn-bd-h);
}
.btn:active {
  transform: translateY(1px);
}
.btn:focus-visible {
  outline: 2px solid var(--sage);
  outline-offset: 3px;
}

.btn--primary {
  --btn-bg: var(--cream);
  --btn-fg: var(--ink);
  --btn-bg-h: var(--sage);
  --btn-fg-h: var(--ink);
}
.btn--outline {
  --btn-bd: var(--border-dark-4);
  --btn-bg-h: rgba(243, 240, 233, 0.08);
  --btn-fg-h: var(--fg);
  --btn-bd-h: var(--cream);
}
.btn--ghost {
  --btn-fg: var(--fg-muted);
  --btn-bg-h: rgba(243, 240, 233, 0.08);
  --btn-fg-h: var(--fg);
}
.btn--sage {
  --btn-bg: var(--sage);
  --btn-fg: var(--ink);
  --btn-bg-h: var(--cream);
  --btn-fg-h: var(--ink);
}

.btn--sm {
  padding: 11px 16px;
  font-size: 13px;
}
.btn--lg {
  padding: 20px 34px;
  font-size: 16px;
}
.btn--block {
  display: flex;
  width: 100%;
}

.surface--light .btn--primary {
  --btn-bg: var(--ink);
  --btn-fg: var(--cream);
  --btn-bg-h: var(--ink-hover);
  --btn-fg-h: var(--cream);
}
.surface--light .btn--outline {
  --btn-bd: var(--border-light-3);
  --btn-fg: var(--ink);
  --btn-bg-h: rgba(18, 17, 14, 0.06);
  --btn-fg-h: var(--ink);
  --btn-bd-h: var(--ink);
}
.surface--light .btn--ghost {
  --btn-fg: var(--ink-muted);
  --btn-bg-h: rgba(18, 17, 14, 0.06);
  --btn-fg-h: var(--ink);
}

.btn-tab {
  padding: 12px 20px;
  border-radius: var(--r-pill);
  border: 1px solid var(--border-dark-3);
  background: transparent;
  color: var(--fg);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: all var(--t-base) var(--ease);
}
.btn-tab:hover {
  border-color: var(--cream);
}
.btn-tab.is-on {
  background: var(--cream);
  color: var(--ink);
  border-color: var(--cream);
}
.surface--light .btn-tab {
  border-color: var(--border-light-3);
  color: var(--ink);
}
.surface--light .btn-tab.is-on {
  background: var(--ink);
  color: var(--cream);
  border-color: var(--ink);
}

.lang-toggle {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--border-dark-3);
  border-radius: var(--r-pill);
}
.lang-toggle button {
  border: 0;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--r-pill);
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.12em;
  background: transparent;
  color: var(--fg);
  transition: all var(--t-base) var(--ease);
}
.lang-toggle button.is-on {
  background: var(--cream);
  color: var(--ink);
}

/* ---------- 5. BADGES ---------- */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--ink);
  color: var(--cream);
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  border-radius: var(--r-sm);
}
.badge--sage {
  background: var(--sage);
  color: var(--ink);
}
.badge--cream {
  background: var(--cream);
  color: var(--ink);
}
.badge--ghost {
  background: rgba(243, 240, 233, 0.1);
  color: var(--fg-muted);
}

.step-index {
  font: 400 13px/1 var(--font-mono);
  color: var(--sage);
}

/* ---------- 6. TARJETAS ---------- */
.card {
  display: flex;
  flex-direction: column;
  background: #000;
  border: 1px solid var(--border-dark-1);
  transition:
    border-color var(--t-base) var(--ease),
    transform var(--t-slow) var(--ease);
  color: var(--fg);
}
.card:hover {
  transform: translateY(-4px);
}
.card.is-active {
  border-color: var(--sage);
}

.card__media {
  position: relative;
  overflow: hidden;
  background: var(--ink-soft);
}
.card__media img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 1.2s var(--ease);
}
.card:hover .card__media img {
  transform: scale(1.05);
}

.card__body {
  padding: 24px;
  display: grid;
  gap: 14px;
  border-top: 1px solid var(--border-dark-1);
}
.card__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.card__title {
  font: 400 40px/1 var(--font-display);
}
.card__kicker {
  font: 400 12px/1 var(--font-mono);
  color: var(--sage);
}
.card__kw {
  font: 500 10px/1.4 var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--sage);
}
.card__desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--fg-soft);
}
.card__cta {
  font: 600 13px/1 var(--font-sans);
  color: var(--fg);
  margin-top: 6px;
}

.card-project {
  display: grid;
  gap: 18px;
  color: var(--fg);
}
.card-project .card__media {
  aspect-ratio: 3/4;
}
.card-project__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  border-top: 1px solid var(--border-dark-2);
  padding-top: 14px;
}
.card-project__name {
  font: 400 30px/1 var(--font-display);
}
.card-project__tag {
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sage);
  white-space: nowrap;
}

.opt {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--border-light-2);
  background: transparent;
  color: var(--ink);
  font: 400 24px/1 var(--font-display);
  text-align: left;
  transition: all var(--t-fast) var(--ease);
}
.opt:hover {
  border-color: var(--ink);
}
.opt.is-on {
  background: var(--ink);
  color: var(--cream);
  border-color: var(--ink);
}
.opt__n {
  font: 400 11px/1 var(--font-mono);
}

.opt-thumb {
  display: grid;
  gap: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--border-light-2);
  background: transparent;
  color: var(--ink);
  transition: all var(--t-fast) var(--ease);
}
.opt-thumb .opt-thumb__img {
  aspect-ratio: 1;
  overflow: hidden;
}
.opt-thumb .opt-thumb__label {
  padding: 10px 4px;
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.opt-thumb.is-on {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--cream);
}

/* ---------- 7. FORMULARIOS ---------- */
.field {
  display: grid;
  gap: 8px;
}
.field__label {
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-accent);
}
.surface--dark .field__label {
  color: var(--sage);
}

.input,
.textarea {
  border: 0;
  border-bottom: 1px solid var(--border-light-3);
  background: transparent;
  padding: 10px 0;
  font-size: 17px;
  color: var(--ink);
  outline: none;
  transition: border-color var(--t-base) var(--ease);
  width: 100%;
}
.input:focus,
.textarea:focus {
  border-color: var(--sage);
}
.textarea {
  resize: vertical;
  min-height: 60px;
}
.input::placeholder,
.textarea::placeholder {
  color: var(--fg-ghost);
}

.surface--dark .input,
.surface--dark .textarea {
  border-bottom-color: var(--border-dark-4);
  color: var(--fg);
}

.range {
  width: 100%;
  accent-color: var(--ink);
  background: transparent;
}
.surface--dark .range {
  accent-color: var(--sage);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 1px solid var(--border-light-2);
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--ink);
  font: 500 14px/1.2 var(--font-sans);
  white-space: nowrap;
  flex-shrink: 0;
  transition: all var(--t-fast) var(--ease);
}
.chip:hover {
  border-color: var(--ink);
}
.chip.is-on {
  background: var(--ink);
  color: var(--cream);
  border-color: var(--ink);
}
.chip__mark {
  font-family: var(--font-mono);
  font-size: 12px;
  opacity: 0.7;
}

.day {
  display: grid;
  gap: 6px;
  justify-items: center;
  padding: 12px 4px;
  border: 1px solid var(--border-light-2);
  background: transparent;
  color: var(--ink);
  transition: all var(--t-fast) var(--ease);
}
.day:hover {
  border-color: var(--ink);
}
.day.is-on {
  background: var(--ink);
  color: var(--cream);
  border-color: var(--ink);
}
.day__wd {
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.day__num {
  font: 400 28px/1 var(--font-display);
}
.day__mo {
  font: 400 10px/1 var(--font-mono);
  text-transform: uppercase;
  opacity: 0.7;
}

/* ---------- 8. NAVEGACIÓN ---------- */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px var(--gutter);
  transition:
    background var(--t-slow) var(--ease),
    backdrop-filter var(--t-slow) var(--ease);
}
.nav.is-scrolled {
  background: rgba(18, 17, 14, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.nav__links {
  display: flex;
  align-items: center;
  gap: clamp(14px, 2.2vw, 32px);
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.nav__links a {
  transition: color var(--t-fast) var(--ease);
}
.nav__links a:hover {
  color: var(--sage);
}

/* ---------- 9. SECCIONES ---------- */
.section {
  padding: var(--section-y) var(--gutter);
  scroll-margin-top: 60px;
}
.section--dark {
  background: var(--ink);
  color: var(--fg);
}
.section--dark2 {
  background: var(--ink-soft);
  color: var(--fg);
}
.section--light {
  background: var(--cream);
  color: var(--ink);
}
.section--light2 {
  background: var(--cream-soft);
  color: var(--ink);
}

.container {
  max-width: var(--max-w);
  margin: 0 auto;
}

.section-head {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
  align-items: flex-end;
}
.section-head__col {
  display: grid;
  gap: 20px;
}
.section-head__sub {
  margin: 0;
  max-width: 42ch;
  line-height: 1.6;
}

.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 20px;
}

/* ---------- 10. COMPONENTES ESPECIALES ---------- */
.fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 40;
  padding: 15px 20px;
  background: var(--sage);
  color: var(--ink);
  border-radius: var(--r-pill);
  font: 600 13px/1 var(--font-sans);
  box-shadow: var(--shadow-md);
  transition:
    background var(--t-base) var(--ease),
    transform var(--t-base) var(--ease);
}
.fab:hover {
  background: var(--cream);
  transform: translateY(-2px);
}

.sticky-panel {
  position: sticky;
  top: 90px;
  display: grid;
  gap: 22px;
  background: var(--ink);
  color: var(--fg);
  padding: 28px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border-dark-1);
  font-size: 14px;
}
.summary-row span:first-child {
  color: var(--fg-dim);
}
.summary-row span:last-child {
  text-align: right;
}

.callout-success {
  display: grid;
  gap: 8px;
  padding: 18px;
  background: var(--sage);
  color: var(--ink);
}
.callout-success strong {
  font: 400 26px/1.1 var(--font-display);
}

.compare {
  position: relative;
  overflow: hidden;
  cursor: ew-resize;
  touch-action: none;
  user-select: none;
  background: var(--ink-soft);
}
.compare img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.compare__handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--cream);
  pointer-events: none;
}
.compare__knob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font: 500 14px/1 var(--font-mono);
  box-shadow: var(--shadow-md);
}

/* ---------- 11. ANIMACIONES ---------- */
@keyframes inFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes inUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes inLine {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes kb {
  from {
    transform: scale(1.12);
  }
  to {
    transform: scale(1);
  }
}

.anim-in {
  animation: inFade 0.6s var(--ease) both;
}
.anim-up {
  animation: inUp 0.8s var(--ease) both;
}
.anim-up-slow {
  animation: inUp 1s var(--ease) both;
}

@media (prefers-reduced-motion: reduce) {
  .ds-layout *,
  .ds-layout *::before,
  .ds-layout *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* ---------- 12. UTILIDADES ---------- */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.gap-6 {
  gap: 6px;
}
.gap-8 {
  gap: 8px;
}
.gap-12 {
  gap: 12px;
}
.gap-16 {
  gap: 16px;
}
.gap-20 {
  gap: 20px;
}
.gap-24 {
  gap: 24px;
}
.gap-32 {
  gap: 32px;
}
.gap-48 {
  gap: 48px;
}
.wrap {
  flex-wrap: wrap;
}
.center {
  align-items: center;
}
.between {
  justify-content: space-between;
}
.baseline {
  align-items: baseline;
}
.mt-24 {
  margin-top: 24px;
}
.mt-48 {
  margin-top: 48px;
}
.mb-24 {
  margin-bottom: 24px;
}
.hr {
  border: 0;
  border-top: 1px solid var(--border-dark-1);
  margin: 0;
}
.hr--light {
  border-top-color: var(--border-light-1);
}

/* =========================================================
   ESTILOS EXCLUSIVOS DE LA PÁGINA DE DOCUMENTACIÓN
   ========================================================= */
.ds-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
}

.ds-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 32px 24px;
  border-right: 1px solid var(--border-dark-1);
  background: var(--ink-soft);
}
.ds-sidebar h1 {
  font: 400 28px/1 var(--font-display);
  margin: 0 0 6px;
}
.ds-brand-sub {
  font: 500 10px/1.4 var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-ghost);
  margin: 0 0 28px;
}
.ds-nav {
  display: grid;
  gap: 2px;
}
.ds-nav a {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 9px 12px;
  border-radius: var(--r-sm);
  font: 500 12px/1 var(--font-sans);
  color: var(--fg-soft);
  transition:
    background var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.ds-nav a:hover,
.ds-nav a.is-active {
  background: rgba(243, 240, 233, 0.06);
  color: var(--fg);
}
.ds-nav a span {
  font: 400 10px/1 var(--font-mono);
  color: var(--fg-ghost);
  min-width: 20px;
}

.ds-main {
  padding: 48px clamp(24px, 4vw, 64px) 120px;
  max-width: 1200px;
}

.ds-hero {
  padding: 56px 0 72px;
  border-bottom: 1px solid var(--border-dark-1);
  margin-bottom: 72px;
}
.ds-hero h1 {
  font: 400 clamp(56px, 7vw, 96px)/0.95 var(--font-display);
  letter-spacing: -0.02em;
  margin: 12px 0 20px;
}
.ds-hero p {
  max-width: 62ch;
  color: var(--fg-soft);
  line-height: 1.7;
  font-size: 17px;
  margin: 0;
}

.ds-section {
  padding: 56px 0;
  border-bottom: 1px solid var(--border-dark-1);
}
.ds-section:last-of-type {
  border-bottom: 0;
}
.ds-section h2 {
  font: 400 clamp(32px, 3.4vw, 52px)/1 var(--font-display);
  letter-spacing: -0.01em;
  margin: 8px 0 12px;
}
.ds-section > p {
  max-width: 68ch;
  color: var(--fg-soft);
  margin: 0 0 28px;
  line-height: 1.7;
}
.ds-section__eyebrow {
  font: 500 11px/1 var(--font-mono);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sage);
}

.ds-sub {
  margin-top: 40px;
}
.ds-sub h3 {
  font: 400 24px/1.2 var(--font-display);
  margin: 0 0 6px;
}
.ds-sub > p {
  color: var(--fg-soft);
  font-size: 14px;
  margin: 0 0 18px;
}

.ds-demo {
  border: 1px solid var(--border-dark-1);
  border-radius: var(--r-md);
  padding: 28px;
  margin-bottom: 14px;
  background: rgba(243, 240, 233, 0.02);
}
.ds-demo--dark {
  background: var(--ink);
}
.ds-demo--dark2 {
  background: var(--ink-soft);
}
.ds-demo--light {
  background: var(--cream);
  color: var(--ink);
  border-color: var(--border-light-1);
}
.ds-demo--light2 {
  background: var(--cream-soft);
  color: var(--ink);
  border-color: var(--border-light-1);
}
.ds-demo__label {
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-ghost);
  margin: 0 0 20px;
}

/* Swatches */
.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.swatch {
  border: 1px solid var(--border-dark-1);
  border-radius: var(--r-md);
  overflow: hidden;
  background: rgba(243, 240, 233, 0.02);
  cursor: pointer;
}
.swatch__color {
  height: 84px;
}
.swatch__meta {
  padding: 12px;
}
.swatch__name {
  font: 500 13px/1.2 var(--font-sans);
  margin: 0 0 3px;
}
.swatch__hex {
  font: 400 11px/1 var(--font-mono);
  color: var(--fg-ghost);
}
.swatch__token {
  font: 400 10px/1.4 var(--font-mono);
  color: var(--fg-dim);
  margin-top: 6px;
}

/* Tabla de tokens */
.ds-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.ds-table th,
.ds-table td {
  text-align: left;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border-dark-1);
  vertical-align: top;
}
.ds-table th {
  font: 500 10px/1 var(--font-mono);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-ghost);
  font-weight: 500;
}
.ds-table td code {
  font: 400 12px/1.4 var(--font-mono);
  color: var(--sage);
  background: rgba(243, 240, 233, 0.04);
  padding: 2px 6px;
  border-radius: 3px;
}
.ds-table td:first-child {
  color: var(--fg);
}

/* Responsive */
@media (max-width: 900px) {
  .ds-layout {
    grid-template-columns: 1fr;
  }
  .ds-sidebar {
    position: relative;
    height: auto;
    overflow: visible;
    border-right: 0;
    border-bottom: 1px solid var(--border-dark-1);
    padding: 24px;
  }
  .ds-nav {
    grid-template-columns: repeat(2, 1fr);
  }
  .ds-main {
    padding: 32px 20px 80px;
  }
}
</style>
