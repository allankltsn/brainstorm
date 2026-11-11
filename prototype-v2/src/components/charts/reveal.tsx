import type { ReactNode } from 'react'
import { useInView } from '@/lib/use-in-view'

/* O gráfico só monta, e por isso só anima, quando entra na tela. A altura vem do className, para a página não pular. */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={className}>
      {seen && children}
    </div>
  )
}
