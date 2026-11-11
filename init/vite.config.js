import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// VITE_BASE=/brainstorm/ no GitHub Pages; "/" em desenvolvimento.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
})
