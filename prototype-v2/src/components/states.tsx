import { CloudOff } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/affect/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/* Estados de lista e de formulário, iguais em todas as telas: vazio, erro e carregando. */

export function EmptyState({ icon, title, text, action, className }: { icon: ReactNode; title: string; text: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-14 text-center', className)}>
      <span className="text-muted-foreground [&_svg]:size-8">{icon}</span>
      <p className="font-medium">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function ErrorState({ what, onRetry }: { what: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-xl border px-6 py-14 text-center">
      <CloudOff className="size-8 text-muted-foreground" />
      <p className="font-medium">Não deu para carregar {what}</p>
      <p className="max-w-sm text-sm text-muted-foreground">Confira sua conexão e tente de novo. Nada foi perdido.</p>
      <Button variant="secondary" className="mt-2" onClick={onRetry}>
        Tentar de novo
      </Button>
    </div>
  )
}

export function ListSkeleton({ rows = 4, label, className }: { rows?: number; label: string; className?: string }) {
  return (
    <div role="status" aria-label={label} className={cn('grid gap-3', className)}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-16 rounded-xl" />
      ))}
    </div>
  )
}
