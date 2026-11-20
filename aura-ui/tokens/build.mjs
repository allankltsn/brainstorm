// Gera, a partir da fonte única (base.json + themes/<tema>.json), os artefatos por tema:
//   src/themes/<tema>.css        -> :root/.dark + @theme inline (consumível por apps Tailwind 4)
//   src/themes/<tema>.aui.css    -> ponte --aui-* + overrides affectUI (botão, glow)
//   src/themes/<tema>.tokens.ts  -> valores JS (charts/canvas)
//   DESIGN.<tema>.md             -> formato aura.build (frontmatter + regras + guardrails)
//   src/themes/doc-themes.css    -> todos os temas escopados por [data-theme][data-mode] (doc)
// Mais a checagem de contraste WCAG AA (falha o build nos pares estritos).
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const SRC_THEMES = resolve(root, 'src', 'themes')
mkdirSync(SRC_THEMES, { recursive: true })

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const base = readJson(resolve(here, 'base.json'))
const themeFiles = readdirSync(resolve(here, 'themes')).filter((f) => f.endsWith('.json'))
const themes = themeFiles.map((f) => readJson(resolve(here, 'themes', f)))

// Ordem canônica dos tokens semânticos de cor no CSS.
const COLOR_ORDER = [
  'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
  'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring',
  'brand-soft', 'brand-text', 'success', 'success-soft', 'warning', 'warning-soft', 'info', 'info-soft',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
  'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
  'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
]

const mergedMode = (theme, mode) => ({ ...base[mode], ...theme.brand[mode] })
const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())

// ---------- contraste WCAG ----------
const srgb = (hex) => {
  const h = hex.replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
}
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (hex) => {
  const [r, g, b] = srgb(hex).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}
// pares estritos (texto, AA 4.5) — falham o build; o ring é 3:1.
const STRICT_TEXT = [
  ['foreground', 'background'], ['card-foreground', 'card'], ['popover-foreground', 'popover'],
  ['primary-foreground', 'primary'], ['secondary-foreground', 'secondary'], ['accent-foreground', 'accent'],
  ['sidebar-foreground', 'sidebar'], ['sidebar-primary-foreground', 'sidebar-primary'],
  ['sidebar-accent-foreground', 'sidebar-accent'],
]
const REPORT_TEXT = [
  ['muted-foreground', 'muted'], ['brand-text', 'brand-soft'],
  ['success', 'success-soft'], ['warning', 'warning-soft'], ['info', 'info-soft'],
]
const RING = [['ring', 'background']]

// ---------- geradores ----------
function themeCss(theme) {
  const block = (mode, sel) => {
    const m = mergedMode(theme, mode)
    const lines = COLOR_ORDER.map((k) => `    --${k}: ${m[k]};`)
    if (mode === 'light') {
      lines.push(`    --radius: ${base.radius};`)
      lines.push(`    --spacing: ${base.spacing};`)
      lines.push(`    --font-sans: ${theme.font.sans};`)
      lines.push(`    --font-heading: ${base.fonts.heading};`)
      lines.push(`    --font-mono: ${base.fonts.mono};`)
      lines.push(`    --shadow-card: ${m['shadow-card']};`)
      lines.push(`    --shadow-popover: ${m['shadow-popover']};`)
      lines.push(`    --ease-out: ${base.motion['ease-out']};`)
      lines.push(`    --duration-fast: ${base.motion['duration-fast']};`)
      lines.push(`    --duration-base: ${base.motion['duration-base']};`)
      lines.push(`    --duration-slow: ${base.motion['duration-slow']};`)
    } else {
      lines.push(`    --shadow-card: ${m['shadow-card']};`)
      lines.push(`    --shadow-popover: ${m['shadow-popover']};`)
    }
    return `${sel} {\n${lines.join('\n')}\n}`
  }
  const colorMap = COLOR_ORDER.map((k) => `    --color-${k}: var(--${k});`).join('\n')
  const radiusMap = Object.entries(base.radiusScale)
    .map(([k, v]) => (v === 1 ? `    --radius-${k}: var(--radius);` : `    --radius-${k}: calc(var(--radius) * ${v});`))
    .join('\n')
  const atTheme = `@theme inline {
    --font-sans: var(--font-sans);
    --font-heading: var(--font-heading);
    --font-mono: var(--font-mono);
    --spacing: var(--spacing);
${colorMap}
${radiusMap}
}`
  return `/* Tema ${theme.label} (${theme.name}). GERADO por tokens/build.mjs — não edite à mão.
   Fonte: tokens/base.json + tokens/themes/${theme.name}.json. */
@custom-variant dark (&:is(.dark *));

${block('light', ':root')}

${block('dark', '.dark')}

${atTheme}
`
}

function auiCss(theme) {
  const bridge = `/* Ponte affectUI do tema ${theme.label}: componentes --aui-* leem os tokens do kit. GERADO. */
:root, .dark {
    --aui-font: var(--font-sans);
    --aui-font-mono: var(--font-mono);
    --aui-ink: var(--foreground);
    --aui-muted: var(--muted-foreground);
    --aui-surface: var(--card);
    --aui-subtle: var(--muted);
    --aui-border: var(--border);
    --aui-border-strong: var(--input);
    --aui-primary: var(--primary);
    --aui-on-primary: var(--primary-foreground);
    --aui-blue: var(--primary);
    --aui-focus: color-mix(in srgb, var(--ring) 70%, transparent);
    --aui-danger: var(--destructive);
    --aui-success: var(--success);
    --aui-radius: 10px;
}`
  const btn = Object.entries(theme.aui.button).map(([k, v]) => `    --${k}: ${v};`).join('\n')
  const button = `:root .ui-button {\n${btn}\n}`
  const cardPrimary = `:root .ui-sr__btn--primary,
:root .ui-di__btn--primary,
:root .ui-tp__btn[data-primary],
:root .ui-tp__btn--primary {
    background: var(--primary);
    border-color: transparent;
    color: var(--primary-foreground);
}
:root .ui-sr__btn--primary:hover,
:root .ui-di__btn--primary:hover,
:root .ui-tp__btn--primary:hover {
    background: color-mix(in srgb, var(--primary) 88%, black);
}`
  let glow = ''
  if (theme.aui.glow) {
    const g = Object.entries(theme.aui.glow).map(([k, v]) => `    --${k}: ${v};`).join('\n')
    glow = `\n\n/* Nuvem da Aura (affectUI) na cor da marca */\n:root .ui-glw[data-color] {\n${g}\n}`
  }
  return `${bridge}\n\n/* Botão principal do affectUI na cor da marca */\n${button}\n\n/* Ação principal nos cartões do affectUI */\n${cardPrimary}${glow}\n`
}

function tokensTs(theme) {
  const obj = (mode) => {
    const m = mergedMode(theme, mode)
    const entries = COLOR_ORDER.map((k) => `    '${k}': '${m[k]}',`).join('\n')
    return `{\n${entries}\n  }`
  }
  return `// Valores do tema ${theme.label} para charts/canvas. GERADO por tokens/build.mjs.
export const ${camel(theme.name)}Tokens = {
  light: ${obj('light')},
  dark: ${obj('dark')},
} as const
`
}

function designMd(theme) {
  const l = mergedMode(theme, 'light')
  return `---
theme: ${theme.name}
label: ${theme.label}
colors:
  primary: "${l.primary}"
  background: "${l.background}"
  surface: "${l.card}"
  text-primary: "${l.foreground}"
  text-secondary: "${l['muted-foreground']}"
  border: "${l.border}"
  accent: "${l['brand-text']}"
typography:
  display-lg: { font: "${theme.font.sans}", size: "3.5rem", weight: 600 }
  body-md: { font: "${theme.font.sans}", size: "1rem", weight: 400 }
  label-md: { font: "${base.fonts.mono}", size: "0.85rem", weight: 500 }
spacing: { base: "${base.spacing}", gap: "1rem", card-padding: "1.25rem", section-padding: "5rem" }
rounded: { card: "${base.radius}", control: "calc(${base.radius} * 0.8)", pill: "999px" }
---

# ${theme.label} — DESIGN

## Colors
A cor da marca (\`--primary\`, ${l.primary}) aparece só em ações principais, foco e destaques.
Fundo e texto vêm da rampa neutra (zinc). Tons derivados (\`brand-soft\`, hover) saem de \`--primary\`
via \`color-mix\`; trocar a marca é trocar uma cor. Modo claro e escuro no mesmo tema.

## Typography
Corpo e títulos em ${theme.font.sans}; rótulos técnicos e código em mono (${base.fonts.mono}).

## Guardrails
- Nunca usar hex solto nem cor primitiva do Tailwind: só tokens semânticos.
- Mesmo raio e borda em botões, cards e badges.
- Efeitos de fundo sempre atrás do conteúdo; respeitar \`prefers-reduced-motion\`.
- Todo par texto/fundo passa em WCAG AA; anel de foco em 3:1.
`
}

function docThemesCss(themes) {
  const parts = []
  parts.push(`/* Todos os temas escopados por [data-theme][data-mode] — usado só pela doc. GERADO. */`)
  themes.forEach((theme, i) => {
    const vars = (mode) => {
      const m = mergedMode(theme, mode)
      const lines = COLOR_ORDER.map((k) => `  --${k}: ${m[k]};`)
      lines.push(`  --radius: ${base.radius};`)
      lines.push(`  --font-sans: ${theme.font.sans};`)
      lines.push(`  --font-mono: ${base.fonts.mono};`)
      lines.push(`  --shadow-card: ${m['shadow-card']};`)
      lines.push(`  --shadow-popover: ${m['shadow-popover']};`)
      return lines.join('\n')
    }
    // default (sem data-theme) = primeiro tema, claro
    if (i === 0) parts.push(`:root {\n${vars('light')}\n}`)
    parts.push(`[data-theme="${theme.name}"] {\n${vars('light')}\n}`)
    parts.push(`[data-theme="${theme.name}"][data-mode="dark"] {\n${vars('dark')}\n}`)
  })
  return parts.join('\n\n') + '\n'
}

// ---------- executa ----------
const failures = []
const warnings = []
const rows = []
for (const theme of themes) {
  for (const mode of ['light', 'dark']) {
    const m = mergedMode(theme, mode)
    const check = (pairs, threshold, hard) => {
      for (const [fg, bg] of pairs) {
        const r = ratio(m[fg], m[bg])
        rows.push(`${theme.name}/${mode}  ${fg} on ${bg}: ${r.toFixed(2)} (min ${threshold})`)
        if (r < threshold) {
          const msg = `${theme.name}/${mode}: ${fg} on ${bg} = ${r.toFixed(2)} < ${threshold}`
          if (hard) failures.push(msg)
          else warnings.push(msg)
        }
      }
    }
    check(STRICT_TEXT, 4.5, true)
    check(REPORT_TEXT, 4.5, false)
    check(RING, 3.0, true)
  }
  writeFileSync(resolve(SRC_THEMES, `${theme.name}.css`), themeCss(theme))
  writeFileSync(resolve(SRC_THEMES, `${theme.name}.aui.css`), auiCss(theme))
  writeFileSync(resolve(SRC_THEMES, `${theme.name}.tokens.ts`), tokensTs(theme))
  writeFileSync(resolve(root, `DESIGN.${theme.name}.md`), designMd(theme))
}
writeFileSync(resolve(SRC_THEMES, 'doc-themes.css'), docThemesCss(themes))

console.log(`tokens: ${themes.length} temas -> ${themes.map((t) => t.name).join(', ')}`)
console.log(rows.join('\n'))
if (warnings.length) {
  console.log('\n⚠ contraste abaixo de AA (não-estrito, revisar):')
  warnings.forEach((w) => console.log('  ' + w))
}
if (failures.length) {
  console.error('\n✗ contraste reprovado (pares estritos):')
  failures.forEach((f) => console.error('  ' + f))
  process.exit(1)
}
console.log('\n✔ contraste: pares estritos OK')
