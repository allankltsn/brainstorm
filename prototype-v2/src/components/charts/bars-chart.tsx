import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart'
import { useReducedMotion } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'
import { ChartTip } from './chart-tip'
import { Reveal } from './reveal'

/*
 * Barras no estilo affectUI: finas, cantos suaves, grade horizontal discreta.
 * Mouse por cima: a coluna sob o ponteiro fica forte, as outras esmaecem e a dica mostra o valor.
 * Ao aparecer na tela, as barras crescem da base.
 */
export function BarsChart({ data, xKey, yKey, label, color = 'var(--chart-1)', format = String, axisFormat = format, tipTitle, reference, axisWidth = 40, highlight, height = 'h-52', className }: {
  data: Record<string, string | number>[]
  xKey: string
  yKey: string
  label: string
  color?: string
  format?: (v: number) => string
  axisFormat?: (v: number) => string
  tipTitle?: (label: string) => string
  reference?: { y: number; label: string }
  axisWidth?: number
  /** índice da barra em destaque enquanto o mouse está fora do gráfico */
  highlight?: number
  height?: string
  className?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const reduced = useReducedMotion()
  const config = { [yKey]: { label, color } } satisfies ChartConfig
  const on = hover ?? highlight ?? null

  return (
    <Reveal className={cn(height, 'w-full', className)}>
      <ChartContainer config={config} className={cn(height, 'aspect-auto w-full')}>
        <BarChart
          data={data}
          margin={{ top: 12, left: 0, right: 8, bottom: 0 }}
          barCategoryGap="22%"
          onMouseMove={(s) => setHover(s.isTooltipActive && s.activeTooltipIndex != null ? Number(s.activeTooltipIndex) : null)}
          onMouseLeave={() => setHover(null)}
        >
          <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.7} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis width={axisWidth} tickLine={false} axisLine={false} tickMargin={6} tickCount={3} tickFormatter={(v: number) => axisFormat(v)} />
          {reference && (
            <ReferenceLine y={reference.y} stroke="var(--muted-foreground)" strokeOpacity={0.6} strokeDasharray="3 4" label={{ value: reference.label, position: 'insideTopRight', fontSize: 11, fill: 'var(--muted-foreground)' }} />
          )}
          <ChartTooltip cursor={false} offset={14} content={<ChartTip series={[{ key: yKey, label, color }]} format={format} title={tipTitle} />} />
          <Bar dataKey={yKey} radius={[4, 4, 1, 1]} maxBarSize={32} isAnimationActive={!reduced} animationDuration={800} animationEasing="ease-out">
            {data.map((_, i) => (
              <Cell key={i} fill={color} fillOpacity={on === null ? 0.85 : on === i ? 1 : 0.35} className="transition-[fill-opacity] duration-200" />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Reveal>
  )
}
