import path from 'node:path'
import { defineConfig } from 'vitest/config'

// Config separada do vite.config.ts: evita o choque de tipos entre o vite 8
// e o vite embutido no vitest. Só precisa do alias @ para os testes puros.
export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
