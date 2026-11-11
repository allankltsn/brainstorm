import { cpSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Rotas do host que o GitHub Pages precisa servir com HTTP 200 (sem passar pelo 404.html).
const ENTRY_ROUTES = ['login', 'brand']

// Copia o index.html final para <rota>/index.html, com os mesmos assets (REV-BL-01 / UX-BL-01).
function entryRoutes() {
  return {
    name: 'entry-routes',
    apply: 'build',
    closeBundle() {
      const out = resolve(import.meta.dirname, 'dist')
      for (const route of ENTRY_ROUTES) {
        mkdirSync(resolve(out, route), { recursive: true })
        cpSync(resolve(out, 'index.html'), resolve(out, route, 'index.html'))
      }
    },
  }
}

// VITE_BASE=/brainstorm/ no GitHub Pages; "/" em desenvolvimento.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), entryRoutes()],
})
