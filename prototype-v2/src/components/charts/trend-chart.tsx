import { useId } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { useReducedMotion } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'
import { ChartTip } from './chart-tip'
import { Reveal } from './reveal'

export type TrendSeries = {
  key: string
  label: string
  color?: string
  /** série de comparação: mesma cor, mais clara */
  muted?: boolean
  dashed?: boolean
}

const COLORS = ['var(--chart-1)', 'var(--chart-3)', 'var(--chart-2)', 'var(--chart-4)']

/*
 * Linhas no estilo affectUI: finas e retas, grade horizontal discreta, poucos rótulos no eixo.
 * Mouse por cima: uma linha vertical acompanha o ponteiro, cada série ganha um ponto e a dica mostra os valores.
 * Ao aparecer na tela, as linhas se desenham da esquerda para a direita.
 */
export function TrendChart({ data, xKey, series, format = String, axisFormat = format, tipTitle, area = false, reference, axisWidth = 40, yDomain, height = 'h-56', className }: {
  data: Record<string, string | number>[]
  xKey: string
  series: TrendSeries[]
  format?: (v: number) => string
  axisFormat?: (v: number) => string
  tipTitle?: (label: string) => string
  /** preenche a primeira série com um degradê suave */
  area?: boolean
  reference?: { y: number; label: string }
  axisWidth?: number
  yDomain?: [number | string, number | string]
  height?: string
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const reduced = useReducedMotion()
  const items = series.map((s, i) => ({ ...s, color: s.color ?? COLORS[i % COLORS.length] }))
  const config = Object.fromEntries(items.map((s) => [s.key, { label: s.label, color: s.color }])) satisfies ChartConfig
  const motion = { isAnimationActive: !reduced, animationDuration: 900, animationEasing: 'ease-out' } as const
  const [main] = items

  return (
    <Reveal className={cn(height, 'w-full', className)}>
      <ChartContainer config={config} className={cn(height, 'aspect-auto w-full')}>
        <ComposedChart data={data} margin={{ top: 12, left: 0, right: 8, bottom: 0 }}>
          <defs>
            <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={main.color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={main.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.7} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={10} interval="preserveStartEnd" minTickGap={56} />
          <YAxis width={axisWidth} tickLine={false} axisLine={false} tickMargin={6} tickCount={3} domain={yDomain} tickFormatter={(v: number) => axisFormat(v)} />
          {reference && (
            <ReferenceLine y={reference.y} stroke="var(--muted-foreground)" strokeOpacity={0.6} strokeDasharray="3 4" label={{ value: reference.label, position: 'insideTopRight', fontSize: 11, fill: 'var(--muted-foreground)' }} />
          )}
          <ChartTooltip cursor={{ stroke: 'var(--input)', strokeWidth: 1 }} offset={14} content={<ChartTip series={items} format={format} title={tipTitle} />} />
          {area && <Area dataKey={main.key} type="linear" stroke="none" fill={`url(#area-${id})`} activeDot={false} tooltipType="none" legendType="none" {...motion} />}
          {[...items].reverse().map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type="linear"
              stroke={s.color}
              strokeWidth={s.muted ? 1.5 : 2}
              strokeOpacity={s.muted ? 0.45 : 1}
              strokeDasharray={s.dashed ? '4 4' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4.5, fill: s.color, stroke: 'var(--card)', strokeWidth: 2 }}
              {...motion}
            />
          ))}
        </ComposedChart>
      </ChartContainer>
    </Reveal>
  )
}
