export type TipSeries = { key: string; label: string; color: string; muted?: boolean }

type Props = {
  series: TipSeries[]
  format: (v: number) => string
  /** troca o rótulo do eixo por um título mais completo */
  title?: (label: string) => string
  /* preenchidos pelo recharts */
  active?: boolean
  label?: string | number
  payload?: readonly { dataKey?: unknown; value?: unknown }[]
}

/* Dica dos gráficos no estilo affectUI: título, divisor e uma linha por série com quadradinho de cor. */
export function ChartTip({ series, format, title, active, label, payload }: Props) {
  if (!active || !payload?.length) return null
  const rows = series.flatMap((s) => {
    const item = payload.find((p) => p.dataKey === s.key)
    return typeof item?.value === 'number' ? [{ ...s, value: item.value }] : []
  })
  if (!rows.length) return null
  const heading = title ? title(String(label ?? '')) : String(label ?? '')
  return (
    <div className="min-w-36 rounded-xl border bg-popover px-3 py-2.5 text-xs text-popover-foreground shadow-lg">
      {heading && <p className="mb-2 border-b pb-2 text-sm font-medium">{heading}</p>}
      <ul className="grid gap-1.5">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-xs" style={{ background: r.color, opacity: r.muted ? 0.45 : 1 }} aria-hidden="true" />
            <span className="text-muted-foreground">{r.label}</span>
            <span className="ml-auto pl-4 font-medium tabular-nums">{format(r.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
