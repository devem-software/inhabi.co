import { reactive, computed } from "vue";

const es = import("@/data/langs/es.json");

export const WA = "573227276453";

const URLS_POR_MODO = {
  development: '',
  github: "https://devem-software.github.io/inhabi.co/",
  cloudflare: "https://inhabi-co.pages.dev/",
  // Puedes agregar más aquí en el futuro
};

export const siteUrl = () => {
  return URLS_POR_MODO[import.meta.env.MODE]
};

/* ---------- Resolución de imágenes y assets ---------- */
/* Vite bundlea todo lo que esté en src/img y src/assets en build-time.
   import.meta.glob con { eager: true } devuelve un objeto { ruta: url }
   de forma SÍNCRONA (URLs ya hasheadas). No hay que usar `import()` dinámico. */

const IMG_MODULES = import.meta.glob("../img/**/*.{jpg,jpeg,png,webp,avif,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const ASSET_MODULES = import.meta.glob("../assets/**/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

const SERVICIOS_MODULES = import.meta.glob("@/data/servicios/**/*.json", {
  eager: true,
  import: "default",
});

function resolve(modules, prefix, name) {
  // Siempre unimos el prefijo base con la ruta/nombre que ingreses
  const basePath = `${prefix}/${name}`;

  // Si ya viene con extensión: "r02-equipo.png" o "logos/cafam.png"
  if (/\.[a-z0-9]+$/i.test(name)) {
    if (modules[basePath]) return modules[basePath];

    // Búsqueda flexible de respaldo si la ruta exacta varía en el glob
    const altKey = Object.keys(modules).find((k) => k.endsWith(name));
    if (altKey) return modules[altKey];
  }

  // Si no tiene extensión: probar todas las extensiones admitidas
  for (const ext of ["jpg", "jpeg", "png", "webp", "avif", "svg"]) {
    const key = `${basePath}.${ext}`;
    if (modules[key]) return modules[key];

    // Búsqueda flexible por terminación
    const altKey = Object.keys(modules).find((k) => k.endsWith(`${name}.${ext}`));
    if (altKey) return modules[altKey];
  }

  console.warn(`[inhabi] recurso no encontrado: ${name} (buscado en ${basePath})`);
  return "";
}

/** Imagen dentro de src/img/  →  IMG('r44-157') o IMG('r02-equipo.png') */
export const IMG = (name) => {
  const resolved = resolve(IMG_MODULES, "../img", name);
  console.log(resolved);
  return resolved;
};

/** Asset dentro de src/assets/  →  ASSET('inhabi-logo-hd.png') */
export const ASSET = (name) => resolve(ASSET_MODULES, "../assets", name);

export const FRONT_IMAGES = [
  "viv_01",
  "viv_02",
  "viv_03",
  "inst_01",
  "inst_02",
  "inst_03",
  "loc_01",
  "loc_02",
  "loc_03",
];

export const R = {
  industrial: {
    vital: ["r17-81", "bano_industrial_vital"],
    balance: ["r14-74", "bano_industrial_balance"],
    integral: ["r20-88", "bano_industrial_integral"],
  },
  minimal: {
    vital: ["r26-106", "r28-110"],
    balance: ["r23-97", "r25-103"],
    integral: ["r29-113", "r31-117"],
  },
  natural: {
    vital: ["r35-129", "r37-133"],
    balance: ["r32-122", "r34-126"],
    integral: ["r38-136", "r40-140"],
  },
};

export const TIPO_PROYECTO = {
  es: {
    vivienda: {
      id: "vivienda",
      label: "Vivienda",
      description: "Calidez, comodidad",
    },
    comercial: {
      id: "comercial",
      label: "Comercial",
      description: "Proyeccion, ambiente",
    },
    institucional: {
      id: "institucional",
      label: "Institucional",
      description: "Elegancia, profesionalismo",
    },
  },
  en: {
    vivienda: {
      id: "vivienda",
      label: "Residential",
      description: "Residential project",
    },
    comercial: {
      id: "comercial",
      label: "Commercial",
      description: "Commercial project",
    },
    institucional: {
      id: "institucional",
      label: "Institutional",
      description: "Institutional project",
    },
  },
};

export const COMBOS = [
  {
    id: "vital",
    n: "01",
    img: "r04-38",
    es: {
      name: "Vital",
      kw: "Práctico · Estructurado · Evolucionado",
      d: "Mantiene el sello de diseño elevando la experiencia con mobiliario más amplio, más compartimentos y mejor organización diaria.",
    },
    en: {
      name: "Vital",
      kw: "Practical · Structured · Evolved",
      d: "Keeps our design signature while elevating the experience with larger furniture, more storage and better everyday organisation.",
    },
  },
  {
    id: "balance",
    n: "02",
    img: "r03-35",
    es: {
      name: "Balance",
      kw: "Accesible · Esencial · Eficiente",
      d: "La prueba de que el alto diseño es accesible: una propuesta funcional y compacta que aprovecha cada metro cuadrado con estilo impecable.",
    },
    en: {
      name: "Balance",
      kw: "Accessible · Essential · Efficient",
      d: "Proof that high design can be accessible: a compact, functional proposal that makes the most of every square metre with impeccable style.",
    },
  },
  {
    id: "integral",
    n: "03",
    img: "r05-42",
    es: {
      name: "Integral",
      kw: "Sofisticación · Imponente · Distinción",
      d: "La experiencia más completa y sofisticada: mobiliario de gran escala, áreas sociales integradas y almacenamiento superior en todo el hogar.",
    },
    en: {
      name: "Integral",
      kw: "Sophistication · Presence · Distinction",
      d: "The most complete, sophisticated experience: large-scale furniture, integrated social areas and superior storage throughout the home.",
    },
  },
];

export const STYLES = [
  {
    id: "natural",
    n: "01",
    mb: "r09-52",
    es: {
      name: "Natural",
      kw: "Vitalidad · Calidez · Regeneración",
      d: "Un refugio acogedor que trae la vitalidad del exterior hacia adentro mediante texturas orgánicas y elementos vivos. Restaura tu energía diaria y resalta la calidez de tu verdadera identidad.",
      fit: "Si te identificas con la luz, la calidez de los materiales orgánicos y los espacios que recargan el espíritu, este estilo es para ti.",
    },
    en: {
      name: "Natural",
      kw: "Vitality · Warmth · Renewal",
      d: "A welcoming refuge that brings the vitality of the outdoors inside through organic textures and living elements. It restores your daily energy and highlights the warmth of who you are.",
      fit: "If you connect with light, the warmth of organic materials and spaces that recharge the spirit, this style is for you.",
    },
    hs: [
      [22, 22, "Grifería negra mate", "Matte black faucet"],
      [50, 16, "Lámpara cerámica", "Ceramic pendant"],
      [42, 52, "Enchape verde acanalado", "Fluted sage tile"],
      [10, 50, "Rejilla en ratán", "Rattan cane"],
      [77, 26, "Espejo ovalado", "Oval mirror"],
      [46, 87, "Lavamanos en piedra", "Stone basin"],
      [86, 78, "Vegetación viva", "Living greenery"],
    ],
  },
  {
    id: "minimal",
    n: "02",
    mb: "r11-62",
    es: {
      name: "Minimal",
      kw: "Claridad · Armonía · Calma",
      d: "Espacios limpios y armónicos que eliminan las distracciones visuales para conectar con lo esencial. Su diseño fluido equilibra la energía del hogar y crea un entorno de paz absoluta.",
      fit: "Si te identificas con la sensación de respirar profundo, el orden impecable y la elegancia de lo simple, este estilo es para ti.",
    },
    en: {
      name: "Minimal",
      kw: "Clarity · Harmony · Calm",
      d: "Clean, harmonious spaces that remove visual noise to connect with the essential. Its fluid design balances the home’s energy and creates an environment of absolute peace.",
      fit: "If you connect with deep breaths, impeccable order and the elegance of simplicity, this style is for you.",
    },
    hs: [
      [15, 30, "Roble claro", "Light oak"],
      [36, 24, "Mármol blanco", "White marble"],
      [51, 14, "Lámpara negra", "Black pendant"],
      [51, 33, "Grifería negra", "Black fixtures"],
      [60, 56, "Espiga en porcelanato", "Herringbone tile"],
      [88, 28, "Espejo retroiluminado", "Backlit mirror"],
      [15, 68, "Tabla en madera", "Wood board"],
    ],
  },
  {
    id: "industrial",
    n: "03",
    mb: "r10-57",
    es: {
      name: "Industrial",
      kw: "Carácter · Fortaleza · Autenticidad",
      d: "Una propuesta sofisticada que celebra la fuerza y textura de la arquitectura expuesta. Estructuras sólidas y una distribución equilibrada de la luz proyectan un ambiente auténtico.",
      fit: "Si te identificas con los tonos sobrios, la personalidad urbana y los entornos con carácter audaz y libre, este estilo es para ti.",
    },
    en: {
      name: "Industrial",
      kw: "Character · Strength · Authenticity",
      d: "A sophisticated proposal that celebrates the strength and texture of exposed architecture. Solid structures and balanced light create an authentic atmosphere.",
      fit: "If you connect with sober tones, urban personality and bold, free-spirited spaces, this style is for you.",
    },
    hs: [
      [9, 30, "Malla metálica", "Woven metal"],
      [32, 40, "Nogal", "Walnut veneer"],
      [50, 14, "Lámpara industrial", "Industrial pendant"],
      [70, 34, "Granito negro", "Black granite"],
      [48, 51, "Mosaico 3D", "3D mosaic"],
      [28, 68, "Subway blanco", "White subway tile"],
      [91, 57, "Grifería negra", "Black faucet"],
    ],
  },
];

export const PROJECTS = [
  { slug: "prieto-208", n: "01", name: "Prieto 208", img: "r43-149" },
  { slug: "serna-velasco", n: "02", name: "Serna & Velasco", img: "r44-157" },
  { slug: "terraza-nodo", n: "03", name: "Terraza Nodo", img: "r47-162" },
];

export const LOGOS = [
  "cafam",
  "carnes_piamontesa",
  "lala",
  "mascoagro",
  "movar",
  "nativas",
  "piamontesa",
  "platzi",
  "suarez",
  "techo",
  "universidad_libre",
  "vid_construcciones",
  "embajada_francia",
  "liftit",
];

export const T = {
  es: {
    nav: {
      combos: "Combos",
      estilos: "Estilos",
      config: "Configurador",
      proyectos: "Proyectos",
      cotizar: "Cotizar",
      agendar: "Agendar",
      estudio: "Nosotros",
      servicios: "Servicios",
      inicio: "Inicio",
    },
    hero: {
      eyebrow: "Arquitectura e interiorismo · Bogotá",
      h1a: "Espacios que se",
      h1b: "habitan con emoción.",
      sub: "Diseñamos soluciones exclusivas, innovadoras y de alta calidad, centradas en quien las habita. Tu remodelación, completamente ejecutada en menos de 60 días.",
      cta1: "Diseña tu espacio",
      cta2: "Solicitar cotización",
    },
    steps: [
      ["Elige", "Tu combo"],
      ["Escoge", "Tu estilo"],
      ["Recibe", "En 60 días"],
    ],
    estudio: {
      eyebrow: "Acerca de la empresa",
      title: "Que tu presupuesto se invierta en diseño, confort y bienestar.",
      p1: "Somos un equipo de profesionales especializado en el desarrollo de proyectos arquitectónicos y de interiorismo. Nos enfocamos en crear espacios que transmiten emociones, promoviendo el bienestar y el equilibrio.",
      p2: "Nuestra pasión se refleja en cada proyecto: soluciones exclusivas, innovadoras y de alta calidad, totalmente centradas en las necesidades de quien los habita.",
    },
    servicios: {
      eyebrow: "Servicios",
      title: "Lo que hacemos",
      sub: "Cuatro líneas de trabajo, un mismo estándar de diseño y ejecución.",
      cta: "Cotizar este servicio",
    },
    combos: {
      eyebrow: "Elige",
      title: "Tres tipos de remodelación según tu presupuesto.",
      sub: "Cada combo define la escala del mobiliario, el almacenamiento y el alcance de la intervención.",
      cta: "Ver en el configurador",
    },
    estilos: {
      eyebrow: "Escoge",
      title: "El estilo, los colores y los acabados que más te gusten.",
      mat: "Materiales del moodboard",
      cta: "Aplicar este estilo",
    },
    config: {
      eyebrow: "Diseños aplicados en tu proyecto",
      title: "Combina tu combo con tu estilo.",
      sub: "Así se vería cada combinación en tu vivienda. Cambia el combo, el estilo o el espacio y mira el render al instante.",
      comboL: "Combo",
      styleL: "Estilo",
      rooms: ["Cocina", "Baño"],
      yourSel: "Tu selección",
      note: "Llevamos esta combinación directo a tu solicitud de cotización.",
      cta: "Cotizar esta combinación",
    },
    cmp: {
      eyebrow: "Mismo espacio, dos estilos",
      title: "Desliza para ver cómo cambia el carácter del hogar.",
      tabs: ["Cocina", "Baño"],
    },
    recibe: {
      eyebrow: "Recibe",
      days: "días",
      p: "Recibe tu vivienda completamente remodelada, con todos los estándares de calidad y supervisada por nuestro equipo de profesionales, en un periodo máximo de 60 días.",
    },
    proy: {
      eyebrow: "Nuestro proyectos",
      title: "Arquitectura que genera valor.",
      p: "Diseño interior, arquitectura y ejecución técnica integrados para crear espacios funcionales, estéticos y altamente competitivos.",
      ver: "Ver",
      inter: "Nuestro trabajo",
      resena: "Reseña",
    },
    cot: {
      eyebrow: "Cotiza tu proyecto",
      title: "Cuéntanos sobre tu espacio.",
      sub: "Cada proyecto se cotiza según el metraje, el alcance, la ubicación y los acabados. Completa los datos y te enviamos una propuesta a la medida.",
      tipoL: "Tipo de inmueble",
      tipos: ["Apartamento", "Casa", "Oficina", "Local comercial", "VIS"],
      configEsp: "Configuración de espacios",
      m2L: "Área aproximada",
      espL: "Espacios a intervenir",
      disL: "Escoje el diseño",
      datL: "Datos de contacto",
      esp: ["Cocina", "Habitaciones", "Baños", "Lavanderia", "Sala", "Comedor"],
      nameL: "Nombre",
      telL: "Teléfono",
      cityL: "Ciudad / barrio",
      msgL: "Cuéntanos más (opcional)",
      sumT: "Resumen de tu solicitud",
      kTipo: "Inmueble",
      kArea: "Área",
      kCombo: "Combo",
      kEstilo: "Estilo",
      kEsp: "Espacios",
      kPlazo: "Plazo de ejecución",
      plazoA: "Hasta 60 días",
      plazoB: "Cronograma a medida",
      none: "Por definir",
      send: "Enviar solicitud",
      wa: "Enviar por WhatsApp",
      thanksT: "Recibimos tu solicitud.",
      thanks: "Te contactaremos en menos de 24 horas hábiles para agendar la visita técnica.",
    },
    ag: {
      eyebrow: "Agenda una cita",
      title: "Visitemos tu espacio.",
      sub: "Elige una visita técnica en tu inmueble o una videollamada con nuestro equipo de diseño.",
      modes: ["Visita al inmueble", "Videollamada"],
      dayL: "Elige el día",
      timeL: "Elige la hora",
      pick: "Elige día y hora",
      confirm: "Confirmar",
      okT: "Cita solicitada.",
      okWa: "Confirmar por WhatsApp",
    },
    foot: { eyebrow: "¡Trabajemos juntos!", tag: "Arquitectura · Interiorismo · Remodelación" },
    hola: "Hola Inhabi, quiero información sobre sus remodelaciones.",
  },
  en: {
    nav: {
      combos: "Packages",
      estilos: "Styles",
      config: "Configurator",
      proyectos: "Projects",
      cotizar: "Quote",
      agendar: "Book",
      estudio: "About us",
      servicios: "Services",
      inicio: "Home",
    },
    hero: {
      eyebrow: "Architecture & interior design · Bogotá",
      h1a: "Spaces designed",
      h1b: "to be felt.",
      sub: "We design exclusive, innovative, high-quality solutions centred on the people who live in them. Your renovation, fully delivered in under 60 days.",
      cta1: "Design your space",
      cta2: "Request a quote",
    },
    steps: [
      ["Select", "Your package"],
      ["Choose", "Your style"],
      ["Receive", "In 60 days"],
    ],
    estudio: {
      eyebrow: "About the studio",
      title: "Your budget, invested in design, comfort and wellbeing.",
      p1: "We are a team of professionals specialised in architecture and interior design projects. We focus on creating spaces that convey emotion, promoting wellbeing and balance.",
      p2: "Our passion shows in every project: exclusive, innovative, high-quality solutions, fully centred on the needs of those who inhabit them.",
    },
    servicios: {
      eyebrow: "Services",
      title: "Lo que hacemos",
      sub: "Cuatro líneas de trabajo, un mismo estándar de diseño y ejecución.",
      cta: "Cotizar este servicio",
    },
    combos: {
      eyebrow: "Select",
      title: "Three renovation packages for your budget.",
      sub: "Each package defines furniture scale, storage and the scope of the intervention.",
      cta: "See it in the configurator",
    },
    estilos: {
      eyebrow: "Choose",
      title: "The style, colours and finishes you love most.",
      mat: "Moodboard materials",
      cta: "Apply this style",
    },
    config: {
      eyebrow: "Designs applied to your project",
      title: "Pair your package with your style.",
      sub: "See how each combination would look in your home. Switch package, style or room and the render updates instantly.",
      comboL: "Package",
      styleL: "Style",
      rooms: ["Kitchen", "Bath"],
      yourSel: "Your selection",
      note: "We carry this combination straight into your quote request.",
      cta: "Quote this combination",
    },
    cmp: {
      eyebrow: "Same space, two styles",
      title: "Drag to see how the character of the home changes.",
      tabs: ["Kitchen", "Bath"],
    },
    recibe: {
      eyebrow: "Receive",
      days: "days",
      p: "Receive your home fully renovated to every quality standard, supervised by our team of professionals, within a maximum of 60 days.",
    },
    proy: {
      eyebrow: "Our projects",
      title: "Architecture that creates value.",
      p: "Interior design, architecture and technical execution integrated to create functional, beautiful and highly competitive spaces.",
      ver: "View",
      inter: "Our work",
      resena: "Project review",
    },
    cot: {
      eyebrow: "Get a quote",
      title: "Tell us about your space.",
      sub: "Every project is quoted by area, scope, location and finishes. Fill in the details and we’ll send a tailored proposal.",
      tipoL: "Property type",
      tipos: ["Apartment", "House", "Office", "Retail"],
      m2L: "Approximate area",
      configEsp: "Configuration of spaces",
      espL: "Spaces to renovate",
      disL: "Select your design",
      datL: "Contact data",
      esp: ["Kitchen", "Bedrooms", "Bathrooms", "Laundry", "Living room", "Dining room"],
      nameL: "Name",
      telL: "Phone",
      cityL: "City / area",
      msgL: "Tell us more (optional)",
      sumT: "Request summary",
      kTipo: "Property",
      kArea: "Area",
      kCombo: "Package",
      kEstilo: "Style",
      kEsp: "Spaces",
      kPlazo: "Delivery time",
      plazoA: "Up to 60 days",
      plazoB: "Custom schedule",
      none: "To be defined",
      send: "Send request",
      wa: "Send via WhatsApp",
      thanksT: "Request received.",
      thanks: "We’ll contact you within 24 business hours to schedule the site visit.",
    },
    ag: {
      eyebrow: "Book a meeting",
      title: "Let’s visit your space.",
      sub: "Choose an on-site technical visit or a video call with our design team.",
      modes: ["On-site visit", "Video call"],
      dayL: "Pick a day",
      timeL: "Pick a time",
      pick: "Select day and time",
      confirm: "Confirm",
      okT: "Meeting requested.",
      okWa: "Confirm on WhatsApp",
    },
    foot: { eyebrow: "Let’s work together", tag: "Architecture · Interiors · Renovation" },
    hola: "Hi Inhabi, I’d like information about your renovations.",
  },
};

export const SLOTS = ["9:00", "10:30", "12:00", "14:30", "16:00", "17:30"];
export const HERO_B = [
  ["r38-136", "Integral · Natural"],
  ["r40-140", "Integral · Natural"],
  ["r20-88", "Integral · Industrial"],
];

/* ---------- Estado global compartido ---------- */
export const store = reactive({
  lang: "es",
  combo: "vital",
  style: "natural",
  room: 0,
  hot: -1,
  heroI: 0,
  cmp: 50,
  cmpRoom: 0,
  dragging: false,
  q: {
    tipo: 0,
    m2: 35,
    esp: [0, 1],
    nombre: "",
    apellido: "",
    tel: "",
    email: "",
    ciudad: "",
    msg: "",
  },
  sent: false,
  mode: 0,
  day: -1,
  slot: -1,
  booked: false,
});

/* ---------- Computed helpers ---------- */
export const t = computed(() => T[store.lang]);
export const currentCombo = computed(() => COMBOS.find((c) => c.id === store.combo));
export const currentStyle = computed(() => STYLES.find((x) => x.id === store.style));
export const currentImgs = computed(() => R[store.style][store.combo]);
export const currentLabel = computed(
  () => `${currentCombo.value[store.lang].name} · ${currentStyle.value[store.lang].name}`,
);
export const currentServicios = computed(() => {
  const archivo = SERVICIOS_MODULES[`/src/data/servicios/${store.lang || "es"}.json`];
  return archivo?.servicios ?? [];
});

export const currentTipo = computed(() => TIPO_PROYECTO[store.lang]);

/* Botón on/off helper */
export const on = (active) =>
  active
    ? { bg: "#12110e", fg: "#f3f0e9", border: "#12110e" }
    : { bg: "transparent", fg: "#12110e", border: "rgba(18,17,14,.25)" };

/* Smooth-scroll respetando offset del nav */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (el)
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 60, behavior: "smooth" });
}
