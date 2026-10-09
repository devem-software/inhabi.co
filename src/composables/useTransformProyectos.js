/**
 * Convierte un texto a un "slug" apto para nombres de archivos de imagen.
 * "Casa Cuatro Vientos"                -> "casacuatrovientos"
 * "Serna & Velasco"                    -> "sernavelasco"
 * "Edificio Posgrados Universidad..."  -> "edificioposgradosuniversidad..."
 */
function slugify(texto = "") {
  return texto
    .toString()
    .normalize("NFD")                    // separa acentos
    .replace(/[\u0300-\u036f]/g, "")     // quita acentos
    .toLowerCase()
    .trim()
    .replace(/&/g, "")                   // quita &
    .replace(/[^a-z0-9]+/g, "")          // solo alfanumérico
}

/**
 * Mapea el nombre de la categoría al `tipo` esperado.
 * "Vivienda Residencial" -> "vivienda"
 * "Institucional"        -> "institucional"
 * "Comercial"            -> "comercial"
 */
function normalizarTipo(categoria = "") {
  const c = categoria.toLowerCase()
  if (c.includes("vivienda") || c.includes("residencial")) return "vivienda"
  if (
    c.includes("institucional") ||
    c.includes("educativo") ||
    c.includes("corporativo")
  ) {
    return "institucional"
  }
  if (c.includes("comercial")) return "comercial"
  return "otro"
}

/**
 * Genera nombres de imágenes placeholder a partir del slug.
 * Reemplaza esto si luego tienes las imágenes reales.
 */
function generarImagenes(slug) {
  return [
    `${slug}_1`,
    `${slug}_2`,
    `${slug}_3`,
  ]
}

/**
 * Transforma el JSON de INHABI a un único array de proyectos.
 *
 * @param {Array} categorias - El JSON original (array de categorías con proyectos).
 * @returns {{ proyectos: Array }}
 */
export function transformarProyectos(portafolio, generarImagenes = null) {
  // Guarda de seguridad
  if (!Array.isArray(portafolio)) {
    console.warn("transformarProyectos: portafolio no es un arreglo válido.", portafolio);
    return [];
  }

  const toSlug = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const imagenesPorDefecto = (id, titulo) => {
    const slug = toSlug(titulo);
    return [
      `/assets/proyectos/${id}/${slug}-01.jpg`,
      `/assets/proyectos/${id}/${slug}-02.jpg`,
    ];
  };

  const generar = generarImagenes || imagenesPorDefecto;
  let consecutivo = 1;

  return portafolio.reduce((acumulado, categoria) => {
    if (!categoria?.proyectos) return acumulado;
    const proyectosCategoria = categoria.proyectos.map((proyecto) => {
      const id = consecutivo++;
      return {
        id,
        titulo: proyecto.nombre,
        tipo: normalizarTipo(categoria.categoria),
        imagenes: generar(id, proyecto.nombre),
        intervencion: proyecto.alcance,
        resena: proyecto.descripcion,
        cliente: proyecto.nombre,
      };
    });
    return [...acumulado, ...proyectosCategoria];
  }, []);
}
