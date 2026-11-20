import { cn } from '@/lib/utils'

/* A marca do Aura Echo: uma "aura" — anéis concêntricos ao redor de um núcleo. */
export function AuraMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground', className)}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="5.2" strokeWidth="1.6" strokeOpacity="0.85" />
        <circle cx="12" cy="12" r="8.2" strokeWidth="1.3" strokeOpacity="0.45" />
      </svg>
    </span>
  )
}

export function Brand({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <AuraMark className={markClassName} />
      <span className="font-display text-lg font-semibold tracking-tight">Aura Echo</span>
    </span>
  )
}
