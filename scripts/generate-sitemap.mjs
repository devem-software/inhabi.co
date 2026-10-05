
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const domain = 'https://devem-software.github.io'
const base = '/inhabi.co/'

// 1. Páginas estáticas principales de tu web
const staticPages = [
  { path: '', changefreq: 'monthly', priority: '1.0' },
  { path: 'cotiza', changefreq: 'monthly', priority: '0.8' },
  { path: 'proyectos', changefreq: 'weekly', priority: '0.9' }
]

const dynamicPages = []

try {
  // 2. Leer dinámicamente los proyectos desde src/data/proyectos/es.json (o los idiomas disponibles)
  const proyectosFilePath = resolve('src/data/proyectos/es.json')
  const fileContent = await readFile(proyectosFilePath, 'utf-8')
  const data = JSON.parse(fileContent)
  const proyectos = data.proyectos ?? []

  // Conjunto para evitar categorías duplicadas en el sitemap
  const categoriasUnicas = new Set()

  proyectos.forEach(p => {
    if (p.tipo) {
      categoriasUnicas.add(p.tipo.toLowerCase())
    }
    if (p.tipo && p.slug) {
      // Ruta de detalle: /proyectos/:categoria/:slug
      dynamicPages.push({
        path: `proyectos/${p.tipo.toLowerCase()}/${p.slug}`,
        changefreq: 'monthly',
        priority: '0.7'
      })
    }
  })

  // 3. Agregar páginas de categorías dinámicas: /proyectos/:categoria
  categoriasUnicas.forEach(cat => {
    dynamicPages.push({
      path: `proyectos/${cat}`,
      changefreq: 'weekly',
      priority: '0.8'
    })
  })
} catch (error) {
  console.warn('Aviso: No se pudieron leer los proyectos dinámicos para el sitemap.', error.message)
}

// Unir todas las páginas (estáticas + dinámicas)
const allPages = [...staticPages, ...dynamicPages]
const today = new Date().toISOString().slice(0, 10)

const urls = allPages.map(page => `
  <url>
    <loc>${domain}${base}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

await mkdir(resolve('dist'), { recursive: true })
await writeFile(resolve('dist/sitemap.xml'), sitemap.trim() + '\n')

console.log(`Sitemap generado correctamente con ${allPages.length} URLs (incluyendo dinámicas).`)
