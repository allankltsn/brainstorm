import type { ReactNode } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/data'
import { cn } from '@/lib/utils'

/* Cabeçalho único de página: título, uma linha de apoio e no máximo uma ação principal. */
export function PageHeader({ title, description, actions, className }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand'
const TONES: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-info-soft text-info',
  brand: 'bg-brand-soft text-brand-text',
}

/* Etiqueta de estado: sempre texto (+ ícone opcional), nunca só cor. */
export function Pill({ tone = 'neutral', icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium whitespace-nowrap [&_svg]:size-3.5', TONES[tone], className)}>
      {icon}
      {children}
    </span>
  )
}

export function Person({ name, sub, size = 'md' }: { name: string; sub?: ReactNode; size?: 'sm' | 'md' }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar className={size === 'sm' ? 'size-8' : 'size-9'}>
        <AvatarFallback className="bg-muted text-xs font-medium">{initials(name)}</AvatarFallback>
      </Avatar>
      <span className="grid min-w-0 leading-tight">
        <span className="truncate text-sm font-medium">{name}</span>
        {sub && <span className="truncate text-xs text-muted-foreground">{sub}</span>}
      </span>
    </span>
  )
}

export function Section({ title, description, action, children, className }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-xl border bg-card', className)}>
      <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  )
}
