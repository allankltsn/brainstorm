import { useEffect, useState } from 'react'

type Mode = 'light' | 'dark'

const THEMES = [
  { name: 'aura-fit', label: 'Aura Fit' },
  { name: 'aura-brand', label: 'Aura Brand' },
]

const COLOR_GROUPS: { grupo: string; tokens: string[] }[] = [
  {
    grupo: 'Base e superfícies',
    tokens: [
      'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
      'secondary', 'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground',
      'border', 'input',
    ],
  },
  { grupo: 'Marca', tokens: ['primary', 'primary-foreground', 'ring', 'brand-soft', 'brand-text'] },
  {
    grupo: 'Feedback',
    tokens: ['destructive', 'success', 'success-soft', 'warning', 'warning-soft', 'info', 'info-soft'],
  },
  { grupo: 'Charts', tokens: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'] },
  {
    grupo: 'Sidebar',
    tokens: [
      'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
    ],
  },
]

const RADII: { nome: string; mult: number }[] = [
  { nome: 'sm', mult: 0.6 }, { nome: 'md', mult: 0.8 }, { nome: 'lg', mult: 1 },
  { nome: 'xl', mult: 1.4 }, { nome: '2xl', mult: 1.8 }, { nome: '3xl', mult: 2.2 }, { nome: '4xl', mult: 2.6 },
]

function useComputedVars(deps: unknown[]) {
  const [vars, setVars] = useState<Record<string, string>>({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const all = COLOR_GROUPS.flatMap((g) => g.tokens)
    const next: Record<string, string> = {}
    for (const t of all) next[t] = cs.getPropertyValue(`--${t}`).trim()
    setVars(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return vars
}

function Segmented<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]
}) {
  return (
    <div className="seg" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="seg-btn"
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState('aura-fit')
  const [mode, setMode] = useState<Mode>('light')

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-theme', theme)
    el.setAttribute('data-mode', mode)
  }, [theme, mode])

  const vars = useComputedVars([theme, mode])

  return (
    <div className="page">
      <header className="topbar">
        <div className="brandline">
          <span className="mark" aria-hidden="true" />
          <strong>aura-ui</strong>
          <span className="pill">Fase 1 · tokens</span>
        </div>
        <div className="controls">
          <Segmented
            value={theme}
            onChange={setTheme}
            options={THEMES.map((t) => ({ value: t.name, label: t.label }))}
          />
          <Segmented
            value={mode}
            onChange={setMode}
            options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]}
          />
        </div>
      </header>

      <main className="wrap">
        <section className="intro">
          <h1>Design tokens</h1>
          <p>
            Uma fonte única (<code>tokens/</code>) gera o CSS de cada tema. Trocar o tema acima
            recolore toda esta página — a marca é uma cor só. Contraste verificado em WCAG AA no build.
          </p>
        </section>

        <section>
          <h2>Cores</h2>
          {COLOR_GROUPS.map((g) => (
            <div key={g.grupo} className="group">
              <h3>{g.grupo}</h3>
              <div className="swatches">
                {g.tokens.map((t) => (
                  <div key={t} className="swatch">
                    <div
                      className="chip"
                      style={{ background: `var(--${t})` }}
                      data-soft={t.endsWith('-foreground') || t === 'background' || t === 'card' || t === 'popover'}
                    />
                    <div className="swatch-meta">
                      <code>--{t}</code>
                      <span className="val">{vars[t] || ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2>Tipografia</h2>
          <div className="type-card">
            <span className="type-tag">font-sans · display-lg</span>
            <p className="t-display">Aura — movimento com clareza</p>
            <span className="type-tag">heading</span>
            <p className="t-heading">Seções, títulos e ênfase</p>
            <span className="type-tag">body-md</span>
            <p className="t-body">
              Corpo de texto em Geist. O kit usa três slots de fonte: sans, heading (igual ao corpo
              por padrão) e mono. Cada tema pode trocar a sans.
            </p>
            <span className="type-tag">label-md · mono</span>
            <p className="t-mono">--primary · 0.75rem · JetBrains Mono</p>
          </div>
        </section>

        <section>
          <h2>Raio</h2>
          <p className="muted">
            Escala derivada de <code>--radius</code> (base {`{`}0.75rem{`}`}): sm…4xl.
          </p>
          <div className="radii">
            {RADII.map((r) => (
              <div key={r.nome} className="radius-item">
                <div
                  className="radius-box"
                  style={{ borderRadius: r.mult === 1 ? 'var(--radius)' : `calc(var(--radius) * ${r.mult})` }}
                />
                <code>{r.nome}</code>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot">
        aura-ui · versão 0.1.1 · tema <strong>{theme}</strong> · {mode === 'light' ? 'claro' : 'escuro'}
      </footer>
    </div>
  )
}
