import { type ReactNode, useEffect, useState } from 'react'
import { Rocket, TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

type Mode = 'light' | 'dark'
type View = 'tokens' | 'componentes'

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

const RADII = [
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
        <button key={o.value} type="button" className="seg-btn" data-active={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function TokensView({ theme, mode }: { theme: string; mode: Mode }) {
  const vars = useComputedVars([theme, mode])
  return (
    <>
      <section className="intro">
        <h1>Design tokens</h1>
        <p>
          Uma fonte única (<code>tokens/</code>) gera o CSS de cada tema. Trocar o tema acima
          recolore tudo — a marca é uma cor só. Contraste verificado em WCAG AA no build.
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
                  <div className="chip" style={{ background: `var(--${t})` }} />
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
        <p className="muted">Escala derivada de <code>--radius</code> (base 0.75rem): sm…4xl.</p>
        <div className="radii">
          {RADII.map((r) => (
            <div key={r.nome} className="radius-item">
              <div className="radius-box" style={{ borderRadius: r.mult === 1 ? 'var(--radius)' : `calc(var(--radius) * ${r.mult})` }} />
              <code>{r.nome}</code>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

function Demo({ title, children, full = false }: { title: string; children: ReactNode; full?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-3 font-mono text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className={full ? 'flex flex-col gap-3' : 'flex flex-wrap items-center gap-3'}>{children}</div>
    </div>
  )
}

function ComponentsView() {
  return (
    <>
      <section className="intro">
        <h1>Componentes</h1>
        <p>
          Primitivos instaláveis pelo CLI do shadcn a partir do registry <code>@aura</code>
          {' '}(<code>npx shadcn add @aura/button</code>). Mesmos tokens da aba Tokens — trocar o
          tema recolore tudo. Lote inicial da Fase 2.
        </p>
      </section>

      <div className="grid gap-4">
        <Demo title="Button · variantes">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Demo>

        <Demo title="Button · tamanhos e ícone">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button><Rocket /> Com ícone</Button>
          <Button disabled>Desabilitado</Button>
        </Demo>

        <Demo title="Badge">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Demo>

        <Demo title="Alert" full>
          <Alert>
            <Rocket />
            <AlertTitle>Tudo certo</AlertTitle>
            <AlertDescription>Seu treino foi salvo e sincronizado.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Não foi possível salvar</AlertTitle>
            <AlertDescription>Verifique a conexão e tente de novo.</AlertDescription>
          </Alert>
        </Demo>

        <Demo title="Card" full>
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Plano Premium</CardTitle>
              <CardDescription>Acesso completo ao app e aos treinos.</CardDescription>
              <CardAction>
                <Badge>Novo</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">R$ 49/mês · cancele quando quiser.</p>
            </CardContent>
            <CardFooter>
              <Button>Assinar</Button>
            </CardFooter>
          </Card>
        </Demo>

        <Demo title="Input + Label" full>
          <div className="grid max-w-sm gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@exemplo.com" />
          </div>
        </Demo>

        <Demo title="Separator" full>
          <div className="text-sm">Acima</div>
          <Separator />
          <div className="text-sm">Abaixo</div>
        </Demo>

        <Demo title="Skeleton" full>
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Demo>
      </div>
    </>
  )
}

export default function App() {
  const [theme, setTheme] = useState('aura-fit')
  const [mode, setMode] = useState<Mode>('light')
  const [view, setView] = useState<View>('tokens')

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-theme', theme)
    el.setAttribute('data-mode', mode)
  }, [theme, mode])

  return (
    <div className="page">
      <header className="topbar">
        <div className="brandline">
          <span className="mark" aria-hidden="true" />
          <strong>aura-ui</strong>
          <span className="pill">Fase 2</span>
        </div>
        <nav className="nav">
          <button type="button" className="nav-btn" data-active={view === 'tokens'} onClick={() => setView('tokens')}>Tokens</button>
          <button type="button" className="nav-btn" data-active={view === 'componentes'} onClick={() => setView('componentes')}>Componentes</button>
        </nav>
        <div className="controls">
          <Segmented value={theme} onChange={setTheme} options={THEMES.map((t) => ({ value: t.name, label: t.label }))} />
          <Segmented value={mode} onChange={setMode} options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]} />
        </div>
      </header>

      <main className="wrap">
        {view === 'tokens' ? <TokensView theme={theme} mode={mode} /> : <ComponentsView />}
      </main>

      <footer className="foot">
        aura-ui · versão 0.1.1 · tema <strong>{theme}</strong> · {mode === 'light' ? 'claro' : 'escuro'}
      </footer>
    </div>
  )
}
