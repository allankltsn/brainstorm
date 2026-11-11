// Compila aura-landing, prototype-v2 e aura-brand SEM alterá-los e copia o dist de cada um
// para init/public/aura, init/public/proto e init/public/brand (servidos pelo host).
import { execSync } from 'node:child_process'
import { cpSync, existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..', '..')
const apps = [
  { dir: 'aura-landing', out: 'aura' },
  { dir: 'prototype-v2', out: 'proto' },
  { dir: 'aura-brand', out: 'brand' },
]

for (const { dir, out } of apps) {
  const cwd = resolve(root, dir)
  console.log(`\n▶ ${dir}`)
  // aura-landing usa pnpm (pnpm-lock.yaml); prototype-v2 e aura-brand usam npm (package-lock.json).
  const pnpm = existsSync(resolve(cwd, 'pnpm-lock.yaml'))
  const run = pnpm ? 'npx --yes pnpm@10' : 'npm'
  if (!existsSync(resolve(cwd, 'node_modules')))
    execSync(pnpm ? `${run} install --frozen-lockfile` : 'npm ci --no-audit --no-fund', { cwd, stdio: 'inherit' })
  execSync(`${run} run build`, { cwd, stdio: 'inherit' })
  const dest = resolve(root, 'init', 'public', out)
  rmSync(dest, { recursive: true, force: true })
  cpSync(resolve(cwd, 'dist'), dest, { recursive: true })
}
