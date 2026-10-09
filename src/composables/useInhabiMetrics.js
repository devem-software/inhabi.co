// composables/useProyectosStats.js
import { computed, ref } from 'vue'

// ---------- Helpers ----------

/** Suma todas las variantes de área de un proyecto */
function sumarArea(area) {
  return (area.construida ?? 0) + (area.privada ?? 0) + (area.disenada_m2 ?? 0)
}

/** Extrae ciudades desde un string de ubicación.
 *  Soporta formatos: "Ciudad", "Ciudad, Depto", "Ciudad1 / Ciudad2"
 */
function extraerCiudades(ubicacion) {
  if (!ubicacion) return []

  // Separar por "/" (caso "Socorro / Bogotá D.C.")
  const partes = ubicacion.split('/').map(p => p.trim())
  const ciudades = []

  for (const parte of partes) {
    // Tomar solo la ciudad (antes de la coma si existe)
    const ciudad = parte.split(',')[0].trim()
    if (ciudad) ciudades.push(ciudad)
  }

  return ciudades
}

// ---------- Composable ----------
export function useInhabiMetrics(data) {
  // Normalizar a ref reactivo
  const proyectosRef = computed(() => {
    const raw = data && 'value' in data ? data.value : data
    return raw?.proyectos ?? []
  })

  // 1. Cantidad de proyectos
  const cantidadProyectos = computed(() => proyectosRef.value.length)

  // 2. Experiencia (años de trayectoria estimados por cantidad de proyectos)
  //    Como el JSON no trae fechas, usamos la cantidad de proyectos como
  //    indicador de experiencia. Puedes ajustar esta lógica si tienes
  //    un año de fundación o fechas de proyecto.
  const experiencia = computed(() => 10 || cantidadProyectos.value)

  // 3. Metros totales
  const metrosTotales = computed(() =>
    proyectosRef.value.reduce((acc, p) => acc + sumarArea(p.area), 0)
  )

  // 4. Metros por categoría (agrupado por "tipo")
  const metrosPorCategoria = computed(() => {
    const mapa = new Map()

    for (const p of proyectosRef.value) {
      const actual = mapa.get(p.tipo) ?? { metros: 0, cantidadProyectos: 0 }
      actual.metros += sumarArea(p.area)
      actual.cantidadProyectos += 1
      mapa.set(p.tipo, actual)
    }

    return Array.from(mapa.entries())
      .map(([categoria, info]) => ({
        categoria,
        metros: info.metros,
        cantidadProyectos: info.cantidadProyectos,
      }))
      .sort((a, b) => b.metros - a.metros)
  })

  // 5. Ciudades (únicas y ordenadas)
  const ciudades = computed(() => {
    const set = new Set()
    for (const p of proyectosRef.value) {
      for (const c of extraerCiudades(p.ubicacion)) {
        set.add(c)
      }
    }
    return Array.from(set).sort()
  })

  // 6. Cantidad de ciudades
  const cantidadCiudades = computed(() => ciudades.value.length)

  // Resultado consolidado
  const stats = computed(() => ({
    experiencia: experiencia.value,
    cantidadProyectos: cantidadProyectos.value,
    metrosPorCategoria: metrosPorCategoria.value,
    metrosTotales: metrosTotales.value,
    ciudades: ciudades.value,
    cantidadCiudades: cantidadCiudades.value,
  }))

  return {
    experiencia,
    cantidadProyectos,
    metrosPorCategoria,
    metrosTotales,
    ciudades,
    cantidadCiudades,
    stats,
  }
}