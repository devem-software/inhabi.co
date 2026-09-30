
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const domain = 'https://devem-software.github.io'
const base = '/inhabi.co/'

const pages = [
  {
    path: '',
    changefreq: 'monthly',
    priority: '1.0'
  },
  {
    path: 'system-design',
    changefreq: 'monthly',
    priority: '0.8'
  }
]

const today = new Date().toISOString().slice(0, 10)

const urls = pages.map(page => `
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

console.log('Sitemap generado correctamente')