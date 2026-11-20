import type { ReactNode } from 'react'
import { Check, CircleAlert, CircleHelp } from 'lucide-react'
import { FIT_LABEL, type Fit, type FieldStatus } from '@/lib/data'

const FIT_STYLE: Record<Fit, string> = {
  alta: 'bg-success-soft text-success',
  media: 'bg-warning-soft text-warning',
  baixa: 'bg-muted text-muted-foreground',
}

export function FitBadge({ fit }: { fit: Fit }) {
  return (
    <span
      title="Compatibilidade com o seu perfil"
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${FIT_STYLE[fit]}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {FIT_LABEL[fit]}
    </span>
  )
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  )
}

/* Semáforo do read-back por campo. */
export function StatusMark({ status }: { status: FieldStatus }) {
  if (status === 'ok')
    return (
      <span className="grid size-5 place-items-center rounded-full bg-success-soft text-success">
        <Check size={13} strokeWidth={2.5} />
      </span>
    )
  if (status === 'warn')
    return (
      <span className="grid size-5 place-items-center rounded-full bg-warning-soft text-warning">
        <CircleHelp size={13} strokeWidth={2.5} />
      </span>
    )
  return (
    <span className="grid size-5 place-items-center rounded-full bg-destructive/15 text-destructive">
      <CircleAlert size={13} strokeWidth={2.5} />
    </span>
  )
}
