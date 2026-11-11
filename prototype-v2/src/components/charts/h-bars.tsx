import { useState, type ReactNode } from 'react'
import { useInView } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'

export type HBarRow = { id: string; label: string; sub?: ReactNode; value: number }

/*
 * Barras horizontais (estilo affectUI): rótulo e valor em cima, barra fina embaixo.
 * Crescem da esquerda em sequência ao aparecer; a linha sob o mouse fica forte e as outras esmaecem.
 */
export function HBars({ rows, max, format = String, className }: { rows: HBarRow[]; max?: number; format?: (v: number) => string; className?: string }) {
  const [ref, seen] = useInView<HTMLOListElement>(0.15)
  const [hover, setHover] = useState<string | null>(null)
  const top = max ?? Math.max(...rows.map((r) => r.value), 1)
  return (
    <ol ref={ref} className={cn('grid gap-1', className)} onMouseLeave={() => setHover(null)}>
      {rows.map((r, i) => (
        <li
          key={r.id}
          tabIndex={0}
          onMouseEnter={() => setHover(r.id)}
          onFocus={() => setHover(r.id)}
          onBlur={() => setHover(null)}
          className={cn(
            '-mx-2 rounded-lg px-2 py-2 outline-none transition-[background-color,opacity] duration-200 focus-visible:ring-2 focus-visible:ring-ring',
            hover === r.id && 'bg-muted/60',
            hover !== null && hover !== r.id && 'opacity-50',
          )}
        >
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-muted-foreground">
              {r.label}
              {r.sub && <span className="text-xs"> · {r.sub}</span>}
            </span>
            <span className="shrink-0 font-medium tabular-nums">{format(r.value)}</span>
          </div>
          <div role="meter" aria-valuemin={0} aria-valuemax={top} aria-valuenow={r.value} aria-label={`${r.label}: ${format(r.value)}`} className="mt-2 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-chart-1 transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: seen ? `${Math.round((r.value / top) * 100)}%` : '0%', transitionDelay: seen ? `${i * 80}ms` : '0ms' }}
            />
          </div>
        </li>
      ))}
    </ol>
  )
}
