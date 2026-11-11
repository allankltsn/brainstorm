import { useState } from 'react'
import { useInView } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'

/*
 * Minibarras de cartão de número (estilo affectUI): cinza, com a última mais escura.
 * Crescem em sequência ao aparecer; o mouse escurece a barra e mostra o valor dela.
 */
export function MiniBars({ data, label, format = String, className }: { data: number[]; label: string; format?: (v: number) => string; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.5)
  const [hover, setHover] = useState<number | null>(null)
  const low = Math.min(...data)
  const span = Math.max(...data) - low || 1
  const on = hover ?? data.length - 1
  return (
    <div ref={ref} role="img" aria-label={`${label}: de ${format(data[0])} para ${format(data[data.length - 1])}`} className={cn('relative flex h-8 items-end gap-0.5', className)} onMouseLeave={() => setHover(null)}>
      {hover !== null && (
        <span className="pointer-events-none absolute -top-5 right-0 text-xs font-medium whitespace-nowrap tabular-nums">{format(data[hover])}</span>
      )}
      {data.map((v, i) => (
        <span key={i} className="flex h-full w-2 items-end" onMouseEnter={() => setHover(i)}>
          <span
            className={cn('w-full origin-bottom rounded-xs transition-[scale,background-color] duration-500 ease-out motion-reduce:transition-none', on === i ? 'bg-foreground/50' : 'bg-foreground/12')}
            style={{ height: `${30 + ((v - low) / span) * 70}%`, scale: seen ? '1 1' : '1 0', transitionDelay: seen && hover === null ? `${i * 45}ms` : '0ms' }}
          />
        </span>
      ))}
    </div>
  )
}
