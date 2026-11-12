// Compila aura-landing, prototype-v2 e aura-brand SEM alterá-los e copia o dist de cada um
// para init/public/aura, init/public/proto e init/public/brand-app (servidos pelo host).
// "brand-app" (e não "brand") porque o host gera dist/brand/index.html como entrada da rota /brand.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

// Versão exata do pnpm (SEC-BL-02 / REV-BL-06): nada de "pnpm@10" flutuante.
const PNPM = 'pnpm@10.34.9'

const root = resolve(import.meta.dirname, '..', '..')
const apps = [
  { dir: 'aura-landing', out: 'aura' },
  { dir: 'prototype-v2', out: 'proto' },
  { dir: 'aura-brand', out: 'brand-app' },
]

// Versão única: init/package.json é a fonte; os apps têm que carregar o mesmo valor (ver README).
const version = JSON.parse(readFileSync(resolve(root, 'init', 'package.json'), 'utf8')).version
const diverge = apps.filter(({ dir }) => JSON.parse(readFileSync(resolve(root, dir, 'package.json'), 'utf8')).version !== version)
if (diverge.length) {
  console.error(`Versão divergente: init/package.json=${version}, mas ${diverge.map((a) => a.dir).join(', ')} tem outro valor. Alinhe os package.json antes do build.`)
  process.exit(1)
}

for (const { dir, out } of apps) {
  const cwd = resolve(root, dir)
  console.log(`\n▶ ${dir}`)
  // aura-landing usa pnpm (pnpm-lock.yaml); prototype-v2 e aura-brand usam npm (package-lock.json).
  // O install roda sempre, a partir do lockfile: não reaproveita node_modules antigo.
  const pnpm = existsSync(resolve(cwd, 'pnpm-lock.yaml'))
  const run = pnpm ? `npx --yes ${PNPM}` : 'npm'
  execSync(pnpm ? `${run} install --frozen-lockfile` : 'npm ci --no-audit --no-fund', { cwd, stdio: 'inherit' })
  execSync(`${run} run build`, { cwd, stdio: 'inherit' })
  const dest = resolve(root, 'init', 'public', out)
  rmSync(dest, { recursive: true, force: true })
  cpSync(resolve(cwd, 'dist'), dest, { recursive: true })
}
