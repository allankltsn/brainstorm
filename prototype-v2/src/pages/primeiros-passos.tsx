import { Check, ChevronRight, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { PageHeader } from '@/components/page'
import { Progress } from '@/components/ui/progress'
import { firstName, sessions } from '@/lib/data'
import { studentOnboarding } from '@/lib/engagement'
import { cn } from '@/lib/utils'

/* Lista com destino por passo: o ProgressTracker do affectUI só marca e desmarca, não leva a outra tela. */
export function PrimeirosPassos() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState(studentOnboarding)
  const done = steps.filter((s) => s.done).length
  const pct = Math.round((done / steps.length) * 100)
  const next = steps.find((s) => !s.done)

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Primeiros passos"
        description={next ? `${firstName(sessions.aluno.name)}, faltam ${steps.length - done} passos para deixar tudo pronto.` : 'Tudo pronto. Agora é só treinar.'}
      />
      <div className="mb-6">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            {done} de {steps.length} feitos
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" aria-label="Progresso dos primeiros passos" />
      </div>

      {!next && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-success-soft p-4 text-sm text-success">
          <PartyPopper className="size-5 shrink-0" />
          <p>Você concluiu todos os passos. Sua personal foi avisada.</p>
        </div>
      )}

      <ol className="grid gap-2">
        {steps.map((s, i) => (
          <li key={s.id} className={cn('flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card p-4', s === next && 'border-primary/40')}>
            <span
              className={cn('flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium', s.done ? 'bg-success-soft text-success' : 'bg-muted')}
              aria-hidden="true"
            >
              {s.done ? <Check className="size-4" /> : i + 1}
            </span>
            <div className="min-w-0 flex-1 basis-48">
              <p className={cn('text-sm font-medium', s.done && 'text-muted-foreground line-through')}>
                {s.label}
                <span className="sr-only">{s.done ? ' (feito)' : ' (a fazer)'}</span>
              </p>
              <p className="text-xs text-muted-foreground">{s.detail}</p>
            </div>
            {!s.done && (
              <div className="flex gap-1 pl-12 sm:pl-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSteps((l) => l.map((x) => (x.id === s.id ? { ...x, done: true } : x)))
                    toast.success('Passo marcado como feito')
                  }}
                >
                  Já fiz
                </Button>
                <Button size="sm" variant={s === next ? 'primary' : 'secondary'} iconRight={<ChevronRight />} onClick={() => navigate(s.to)}>
                  {s.cta}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
