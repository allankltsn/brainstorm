import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const BASE = process.env.VITE_BASE || '/'

// Rotas do host que o GitHub Pages precisa servir com HTTP 200 (sem passar pelo 404.html).
const ENTRY_ROUTES = ['login', 'brand']

// Copia o index.html final para <rota>/index.html, com os mesmos assets (REV-BL-01 / UX-BL-01).
function entryRoutes() {
  return {
    name: 'entry-routes',
    apply: 'build',
    closeBundle() {
      const out = resolve(import.meta.dirname, 'dist')
      // 404.html (sem JS): o link da home usa a base do build, não um caminho relativo (REV-BL-13 / UX-BL-14).
      const f404 = resolve(out, '404.html')
      writeFileSync(f404, readFileSync(f404, 'utf8').replaceAll('%BASE%', BASE))
      for (const route of ENTRY_ROUTES) {
        mkdirSync(resolve(out, route), { recursive: true })
        cpSync(resolve(out, 'index.html'), resolve(out, route, 'index.html'))
      }
    },
  }
}

// VITE_BASE=/brainstorm/ no GitHub Pages; "/" em desenvolvimento.
export default defineConfig({
  base: BASE,
  plugins: [react(), entryRoutes()],
})
