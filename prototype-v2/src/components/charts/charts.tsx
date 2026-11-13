import { useId, useState, type ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import { Reveal, useInView, useReducedMotion } from './in-view'

/*
 * Estilo único de gráficos do app (affectUI + shadcn/recharts):
 * - sem moldura pesada: grade só horizontal e discreta, eixos sem traço, rótulos pequenos;
 * - barras arredondadas, áreas com degradê suave, cores só dos tokens --chart-*;
 * - ao passar o mouse: a série destacada fica forte, o resto esmaece, e uma dica mostra o valor;
 * - ao aparecer na tela: tudo cresce da base em ~0,9 s (desligado com "reduzir movimento").
 */
const DURATION = 900
const axis = { tickLine: false, axisLine: false, tickMargin: 8 } as const

type Common = { className?: string; height?: string }

/* Barras: passe o mouse e a barra destacada fica forte; as outras esmaecem. */
export function BarsChart({ data, xKey, yKey, label, color = 'var(--chart-1)', format = (v) => String(v), highlight, height = 'h-56', className }: Common & {
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  label: string
  color?: string
  format?: (v: number) => string
  /** índice da barra em destaque quando o mouse não está sobre o gráfico */
  highlight?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const config = { [yKey]: { label, color } } satisfies ChartConfig
  const on = hover ?? highlight ?? null
  return (
    <Reveal className={cn(height, 'w-full', className)}>
      <ChartContainer config={config} className={cn(height, 'w-full aspect-auto')}>
        <BarChart data={data} margin={{ top: 8, left: 0, right: 0 }} onMouseLeave={() => setHover(null)}>
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis dataKey={xKey} {...axis} />
          <ChartTooltip cursor={{ fill: 'var(--muted)', radius: 8, opacity: 0.6 }} content={<ChartTooltipContent hideIndicator formatter={(v) => <span className="font-medium tabular-nums">{format(Number(v))}</span>} />} />
          <Bar dataKey={yKey} radius={[8, 8, 3, 3]} maxBarSize={44} isAnimationActive={!reduced} animationDuration={DURATION} animationEasing="ease-out" onMouseEnter={(_, i) => setHover(i)}>
            {data.map((_, i) => (
              <Cell key={i} fill={`var(--color-${yKey})`} fillOpacity={on === null || on === i ? 1 : 0.35} style={{ transition: 'fill-opacity .2s' }} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Reveal>
  )
}

export type Series = { key: string; label: string; color: string; dashed?: boolean }

/* Tendência: a primeira série é uma área com degradê; as demais, linhas pontilhadas para comparar. */
export function TrendChart({ data, xKey, series, format = (v) => String(v), axisFormat, yDomain, height = 'h-60', className }: Common & {
  data: Record<string, string | number>[]
  xKey: string
  series: Series[]
  format?: (v: number) => string
  /** rótulo curto do eixo, quando o valor completo não cabe (ex.: dinheiro) */
  axisFormat?: (v: number) => string
  yDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
}) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const config = Object.fromEntries(series.map((s) => [s.key, { label: s.label, color: s.color }])) satisfies ChartConfig
  const [main, ...rest] = series
  return (
    <Reveal className={cn(height, 'w-full', className)}>
      <ChartContainer config={config} className={cn(height, 'w-full aspect-auto')}>
        <AreaChart data={data} margin={{ top: 8, left: 0, right: 8 }}>
          <defs>
            <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${main.key})`} stopOpacity={0.28} />
              <stop offset="100%" stopColor={`var(--color-${main.key})`} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis dataKey={xKey} {...axis} minTickGap={16} />
          <YAxis {...axis} width={40} domain={yDomain} tickFormatter={(v) => (axisFormat ?? format)(Number(v))} />
          <ChartTooltip cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }} content={<ChartTooltipContent indicator="line" formatter={(v, name) => <span className="flex w-full justify-between gap-4"><span className="text-muted-foreground">{config[String(name)]?.label}</span><span className="font-medium tabular-nums">{format(Number(v))}</span></span>} />} />
          {rest.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} stroke={`var(--color-${s.key})`} strokeWidth={2} strokeDasharray={s.dashed ? '5 5' : undefined} dot={false} activeDot={{ r: 4 }} isAnimationActive={!reduced} animationDuration={DURATION} />
          ))}
          <Area type="monotone" dataKey={main.key} stroke={`var(--color-${main.key})`} strokeWidth={2.5} fill={`url(#g-${id})`} dot={false} activeDot={{ r: 6, strokeWidth: 3, stroke: 'var(--card)' }} isAnimationActive={!reduced} animationDuration={DURATION} animationEasing="ease-out" />
        </AreaChart>
      </ChartContainer>
    </Reveal>
  )
}

/* Minigráfico para dentro de um cartão de número. */
export function Sparkline({ data, color = 'var(--chart-1)', label, format = (v) => String(v), className }: { data: number[]; color?: string; label: string; format?: (v: number) => string; className?: string }) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const rows = data.map((v, i) => ({ i, v }))
  const config = { v: { label, color } } satisfies ChartConfig
  return (
    <Reveal className={cn('h-10 w-full', className)}>
      <ChartContainer config={config} className="h-10 w-full aspect-auto">
        <AreaChart data={rows} margin={{ top: 4, bottom: 2, left: 2, right: 2 }}>
          <defs>
            <linearGradient id={`s-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel hideIndicator formatter={(v) => <span className="font-medium tabular-nums">{format(Number(v))}</span>} />} />
          <Area type="monotone" dataKey="v" stroke="var(--color-v)" strokeWidth={2} fill={`url(#s-${id})`} dot={false} activeDot={{ r: 3.5, strokeWidth: 2, stroke: 'var(--card)' }} isAnimationActive={!reduced} animationDuration={DURATION} />
        </AreaChart>
      </ChartContainer>
    </Reveal>
  )
}

export type HBarRow = { id: string; label: ReactNode; sub?: ReactNode; value: number; max?: number; right?: ReactNode }

/* Barras horizontais: crescem da esquerda em sequência; a linha sob o mouse ganha destaque. */
export function HBars({ rows, format = (v) => `${v}%`, className }: { rows: HBarRow[]; format?: (v: number) => string; className?: string }) {
  const [ref, seen] = useInView<HTMLOListElement>(0.1)
  const [hover, setHover] = useState<string | null>(null)
  const top = Math.max(...rows.map((r) => r.max ?? r.value), 1)
  return (
    <ol ref={ref} className={cn('grid gap-1', className)} onMouseLeave={() => setHover(null)}>
      {rows.map((r, i) => {
        const w = Math.round(((r.value) / (r.max ?? top)) * 100)
        const dim = hover !== null && hover !== r.id
        return (
          <li
            key={r.id}
            onMouseEnter={() => setHover(r.id)}
            onFocus={() => setHover(r.id)}
            onBlur={() => setHover(null)}
            className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-2 py-2 transition-[background-color,opacity] duration-200', hover === r.id && 'bg-muted/60', dim && 'opacity-60')}
          >
            <div className="min-w-0 flex-1 basis-40 leading-tight">
              <p className="truncate text-sm font-medium">{r.label}</p>
              {r.sub && <p className="truncate text-xs text-muted-foreground">{r.sub}</p>}
            </div>
            <div className="flex min-w-40 flex-1 items-center gap-3">
              <div role="meter" aria-valuemin={0} aria-valuemax={r.max ?? top} aria-valuenow={r.value} aria-label={`${r.label}: ${format(r.value)}`} className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full origin-left rounded-full bg-primary transition-[width,filter] duration-[900ms] ease-out motion-reduce:transition-none"
                  style={{ width: seen ? `${w}%` : '0%', transitionDelay: seen ? `${i * 70}ms` : '0ms', filter: hover === r.id ? 'brightness(1.15)' : undefined }}
                />
              </div>
              <span className={cn('w-16 shrink-0 text-right text-sm tabular-nums transition-all', hover === r.id ? 'font-semibold' : 'text-muted-foreground')}>{format(r.value)}</span>
            </div>
            {r.right}
          </li>
        )
      })}
    </ol>
  )
}
