import { useInView } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'

const TONE = { good: 'text-success', bad: 'text-destructive', neutral: 'text-muted-foreground' } as const
const W = 56
const H = 20

/* Linha de tendência para linhas de tabela (estilo affectUI). Desenha-se ao aparecer na tela. */
export function Sparkline({ data, tone = 'neutral', className }: { data: number[]; tone?: keyof typeof TONE; className?: string }) {
  const [ref, seen] = useInView<SVGSVGElement>(0.5)
  const min = Math.min(...data)
  const span = Math.max(...data) - min || 1
  const points = data.map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - 2 - ((v - min) / span) * (H - 4)).toFixed(1)}`).join(' ')
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className={cn('h-5 w-14 shrink-0', TONE[tone], className)} aria-hidden="true">
      <polyline
        points={points}
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={seen ? 0 : 1}
        className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
      />
    </svg>
  )
}
