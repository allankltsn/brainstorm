import { useEffect, useRef, useState, type ReactNode } from 'react'

/* O gráfico só entra (e anima) quando aparece na tela. Sem IntersectionObserver, aparece direto. */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen] as const
}

/* Respeita a configuração "reduzir movimento" do sistema. */
export function useReducedMotion() {
  const [reduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  return reduced
}

export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={className}>
      {seen && children}
    </div>
  )
}
