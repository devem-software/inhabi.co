// scripts/clean.mjs
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

try {
  await rm(resolve('dist'), { recursive: true, force: true })
  console.log('Carpeta dist limpiada correctamente.')
} catch (error) {
  console.error('Error al limpiar la carpeta dist:', error.message)
}