import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { motion, useInView } from "motion/react"
import { useEffect, useId, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/* Kit de gráficos do aura-fit.
   Estilo padrão (inspirado nas telas de Analytics do affectUI): linha fina, área em degradê suave,
   grade horizontal discreta, rótulos pequenos, cartões de KPI com variação em chip.
   Todo gráfico (1) entra em cena animado quando aparece na tela e (2) reage ao ponteiro
   com linha-guia, pontos e uma dica com os valores. */

export const chartColors = { main: "#ff6f78", strong: "#d0202b", prev: "#6b6b6b", ok: "#52d88a", warn: "#f1b93a", grid: "rgb(255 255 255 / .07)" }
const ease = [0.22, 1, 0.36, 1] as const

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

/** Chip de variação: verde quando o movimento é bom, vermelho quando não é. */
export function Delta({ children, good = true, down = false }: { children: ReactNode; good?: boolean; down?: boolean }) {
  const I = down ? ArrowDownRight : ArrowUpRight
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums", good ? "bg-ok/12 text-ok" : "bg-bad/12 text-bad")}>
      <I size={12} /> {children}
    </span>
  )
}

export type Serie = { name: string; data: number[]; color?: string; dashed?: boolean; area?: boolean }

function smooth(pts: [number, number][]) {
  return pts.map(([x, y], i) => {
    if (i === 0) return `M${x},${y}`
    const [px, py] = pts[i - 1]
    const mx = (px + x) / 2
    return `C${mx},${py} ${mx},${y} ${x},${y}`
  }).join(" ")
}

/** Gráfico de linha/área com linha-guia e dica que seguem o ponteiro. `compact` vira sparkline. */
export function LineChart({
  series, labels, height = 220, format = (v) => `${v}`, compact = false, className,
}: { series: Serie[]; labels: string[]; height?: number; format?: (v: number) => string; compact?: boolean; className?: string }) {
  const [ref, W] = useWidth<HTMLDivElement>()
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const [hi, setHi] = useState<number | null>(null)
  const id = useId().replace(/:/g, "")

  const n = labels.length
  const pad = compact ? { l: 2, r: 2, t: 6, b: 6 } : { l: 44, r: 10, t: 12, b: 26 }
  const all = series.flatMap((s) => s.data)
  const rawMax = Math.max(...all)
  const rawMin = Math.min(...all)
  const min = compact ? rawMin - (rawMax - rawMin) * 0.15 : 0
  const max = compact ? rawMax + (rawMax - rawMin) * 0.15 : niceMax(rawMax)
  const iw = Math.max(W - pad.l - pad.r, 1)
  const ih = height - pad.t - pad.b
  const x = (i: number) => pad.l + (n === 1 ? iw / 2 : (i * iw) / (n - 1))
  const y = (v: number) => pad.t + ih - ((v - min) / (max - min || 1)) * ih
  const ticks = compact ? [] : [0, 0.5, 1].map((t) => min + (max - min) * t)

  const onMove = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left - pad.l) / iw) * (n - 1))
    setHi(Math.max(0, Math.min(n - 1, i)))
  }
  const tipLeft = hi === null ? 0 : x(hi)
  const flip = tipLeft > W * 0.62

  return (
    <div ref={ref} className={cn("relative select-none", className)} style={{ height }} onPointerMove={onMove} onPointerLeave={() => setHi(null)}>
      {W > 0 && (
        <svg width={W} height={height} className="block overflow-visible" role="img" aria-label={`${series.map((s) => s.name).join(" e ")}: de ${format(series[0].data[0])} a ${format(series[0].data[n - 1])}`}>
          <defs>
            <clipPath id={`c${id}`}>
              <motion.rect x={0} y={0} height={height} initial={{ width: 0 }} animate={{ width: inView ? W + 12 : 0 }} transition={{ duration: 1.5, ease }} />
            </clipPath>
            {series.map((s, k) => (
              <linearGradient key={k} id={`g${id}${k}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color ?? chartColors.main} stopOpacity={0.3} />
                <stop offset="100%" stopColor={s.color ?? chartColors.main} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={chartColors.grid} />
              <text x={pad.l - 8} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#8a8a8a">{format(t)}</text>
            </g>
          ))}
          {!compact && [0, Math.floor((n - 1) / 2), n - 1].map((i) => (
            <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} fontSize="10" fill="#8a8a8a">{labels[i]}</text>
          ))}
          <g clipPath={`url(#c${id})`}>
            {series.map((s, k) => {
              const pts = s.data.map((v, i) => [x(i), y(v)] as [number, number])
              const d = smooth(pts)
              return (
                <g key={s.name}>
                  {s.area && <path d={`${d} L${x(n - 1)},${pad.t + ih} L${x(0)},${pad.t + ih} Z`} fill={`url(#g${id}${k})`} />}
                  <path d={d} fill="none" stroke={s.color ?? chartColors.main} strokeWidth={s.dashed ? 1.25 : 1.75} strokeDasharray={s.dashed ? "4 4" : undefined} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )
            })}
          </g>
          {hi !== null && (
            <g>
              <line x1={x(hi)} x2={x(hi)} y1={pad.t} y2={pad.t + ih} stroke="rgb(255 255 255 / .28)" strokeDasharray="3 3" />
              {series.map((s) => (
                <circle key={s.name} cx={x(hi)} cy={y(s.data[hi])} r={compact ? 3 : 4} fill="#141414" stroke={s.color ?? chartColors.main} strokeWidth="2" />
              ))}
            </g>
          )}
        </svg>
      )}
      {hi !== null && (
        <motion.div
          initial={false}
          animate={{ left: tipLeft, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className={cn("pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-lg border border-line-strong bg-[#141414]/95 px-2.5 py-1.5 text-[11px] shadow-xl", flip ? "-translate-x-[calc(100%+10px)]" : "translate-x-[10px]")}
        >
          <p className="mb-0.5 font-medium text-muted">{labels[hi]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center gap-1.5 font-semibold tabular-nums text-ink">
              <span className="size-1.5 rounded-full" style={{ background: s.color ?? chartColors.main }} />
              {!compact && <span className="font-normal text-muted">{s.name}</span>}
              {format(s.data[hi])}
            </p>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function niceMax(v: number) {
  const p = 10 ** Math.floor(Math.log10(v || 1))
  const m = v / p
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p
}

/** Barras verticais: crescem ao entrar na tela; a barra sob o ponteiro acende e mostra o valor. */
export function Bars({
  data, labels, height = 150, format = (v) => `${v}`, accentFrom, className, max,
}: { data: number[]; labels: string[]; height?: number; format?: (v: number) => string; accentFrom?: number; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const [hi, setHi] = useState<number | null>(null)
  const top = max ?? Math.max(...data)
  return (
    <div ref={ref} className={cn("select-none", className)} onPointerLeave={() => setHi(null)} role="img" aria-label={labels.map((l, i) => `${l}: ${format(data[i])}`).join(", ")}>
      <div className="relative flex items-end gap-1.5 border-b border-white/[0.07]" style={{ height }}>
        {[0.5, 1].map((t) => <span key={t} aria-hidden="true" className="absolute inset-x-0 border-t border-white/[0.07]" style={{ bottom: `${t * 100}%` }} />)}
        {data.map((v, i) => {
          const accent = accentFrom !== undefined && i >= accentFrom
          return (
            <div key={i} className="relative flex h-full flex-1 items-end" onPointerEnter={() => setHi(i)}>
              {hi === i && (
                <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-line-strong bg-[#141414]/95 px-2 py-1 text-[11px] font-semibold tabular-nums text-ink shadow-xl" style={{ bottom: `calc(${(v / top) * 100}% + 8px)` }}>
                  {format(v)}
                </motion.span>
              )}
              <motion.span
                className={cn("block w-full origin-bottom rounded-t-md transition-[filter,opacity] duration-200", accent ? "bg-gradient-to-t from-brand to-accent" : "bg-white/[0.14]", hi !== null && hi !== i && "opacity-40", hi === i && "brightness-125")}
                style={{ height: `${(v / top) * 100}%` }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: inView ? 1 : 0 }}
                transition={{ duration: 0.9, delay: i * 0.06, ease }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {labels.map((l, i) => <span key={i} className={cn("flex-1 text-center text-[10px] transition-colors", hi === i ? "text-ink" : "text-faint")}>{l}</span>)}
      </div>
    </div>
  )
}

/** Lista com barras horizontais (ranking): a linha sob o ponteiro acende e mostra a fatia do total. */
export function BarList({ items, format = (v) => `${v}`, className }: { items: { label: string; value: number }[]; format?: (v: number) => string; className?: string }) {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const [hi, setHi] = useState<number | null>(null)
  const top = Math.max(...items.map((i) => i.value))
  const total = items.reduce((a, b) => a + b.value, 0)
  return (
    <ul ref={ref} className={cn("space-y-1.5", className)} onPointerLeave={() => setHi(null)}>
      {items.map((it, i) => (
        <li key={it.label} onPointerEnter={() => setHi(i)} className={cn("relative flex h-9 items-center justify-between overflow-hidden rounded-lg px-3 text-[13px] transition-opacity duration-200", hi !== null && hi !== i && "opacity-45")}>
          <motion.span
            aria-hidden="true"
            className={cn("absolute inset-y-0 left-0 origin-left rounded-lg transition-colors duration-200", hi === i ? "bg-primary/45" : i === 0 ? "bg-primary/30" : "bg-white/[0.08]")}
            style={{ width: `${(it.value / top) * 100}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView ? 1 : 0 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease }}
          />
          <span className="relative font-medium text-ink">{it.label}</span>
          <span className="relative tabular-nums text-muted">
            {hi === i && <span className="mr-2 text-accent">{Math.round((it.value / total) * 100)}%</span>}
            {format(it.value)}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** Anel de progresso que se desenha ao entrar na tela. */
export function Ring({ value, size = 120, label, sub }: { value: number; size?: number; label: string; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-12% 0px" })
  const [hover, setHover] = useState(false)
  const r = size / 2 - 9
  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} role="img" aria-label={`${label}: ${Math.round(value * 100)}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / .08)" strokeWidth="9" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringg)" strokeWidth={hover ? 11 : 9} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: inView ? value : 0 }} transition={{ duration: 1.4, ease }} />
        <defs><linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ff6f78" /><stop offset="100%" stopColor="#b1111b" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tabular-nums tracking-tight text-ink">{hover && sub ? sub : `${Math.round(value * 100)}%`}</span>
        <span className="text-[10px] text-faint">{label}</span>
      </div>
    </div>
  )
}
