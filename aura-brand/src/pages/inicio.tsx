import { ArrowRight, Check, CheckCircle2, Circle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader, Pill, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { approvals as initialApprovals, brandKit, brandKitChecklist, credits, firstName, kpis, numberFmt, session, todayLabel } from '@/lib/data'
import { useLoaded } from '@/lib/use-loaded'

function KpiGrid({ loaded }: { loaded: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((k) => (
        <li key={k.id} className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">{k.label}</p>
          {loaded ? <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{numberFmt.format(k.value)}</p> : <Skeleton className="mt-2 h-7 w-12" />}
          <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
        </li>
      ))}
    </ul>
  )
}

/* Regra do produto: a IA só sugere. Nada é publicado sem aprovação. */
function ApprovalQueue({ loaded }: { loaded: boolean }) {
  const [items, setItems] = useState(initialApprovals)
  const decide = (id: string, approved: boolean) => {
    setItems((list) => list.filter((i) => i.id !== id))
    if (approved) toast.success('Aprovado', { description: 'O post entrou na fila de agendamento.' })
    else toast.info('Devolvido para ajuste', { description: 'A IA vai propor uma nova versão.' })
  }
  return (
    <Section title="Precisa de você" description="A IA só sugere. Nada é publicado sem a sua aprovação.">
      {!loaded ? (
        <div className="grid gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
          <p className="text-sm font-medium">Tudo em dia</p>
          <p className="text-sm text-muted-foreground">Novas sugestões aparecem aqui quando ficarem prontas.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1 basis-64">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{a.title}</p>
                  <Pill>{a.channel}</Pill>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{a.detail}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="min-h-11" onClick={() => decide(a.id, false)}>
                  Pedir ajuste
                </Button>
                <Button variant="secondary" className="min-h-11" onClick={() => decide(a.id, true)}>
                  <Check /> Aprovar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function BrandKitProgress() {
  const steps = brandKitChecklist(brandKit)
  const done = steps.filter((s) => s.done).length
  return (
    <Section title="Brand kit" description={`${done} de ${steps.length} etapas concluídas`}>
      <Progress value={(done / steps.length) * 100} aria-label="Progresso do brand kit" />
      <ul className="mt-4 grid gap-2">
        {steps.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-sm">
            {s.done ? <CheckCircle2 className="size-4 text-success" aria-hidden="true" /> : <Circle className="size-4 text-muted-foreground" aria-hidden="true" />}
            <span className={s.done ? 'text-muted-foreground' : 'font-medium'}>{s.label}</span>
            <span className="sr-only">{s.done ? '(concluída)' : '(pendente)'}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Credits() {
  const left = credits.total - credits.used
  return (
    <Section title="Créditos de IA" description={`Renovam em ${credits.renewsOn}`}>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {numberFmt.format(left)} <span className="text-sm font-normal text-muted-foreground">de {numberFmt.format(credits.total)}</span>
      </p>
      <Progress className="mt-3" value={(left / credits.total) * 100} aria-label="Créditos restantes" />
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" /> Imagens e vídeos consomem mais créditos que textos.
      </p>
    </Section>
  )
}

export function Inicio() {
  const loaded = useLoaded()
  return (
    <>
      <PageHeader
        title={`Olá, ${firstName(session.name)}`}
        description={`${todayLabel()} · ${session.title}`}
        actions={
          <Button asChild className="min-h-11">
            <Link to="/marca">
              Completar brand kit <ArrowRight />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4">
        <KpiGrid loaded={loaded} />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ApprovalQueue loaded={loaded} />
          </div>
          <div className="grid content-start gap-4">
            <BrandKitProgress />
            <Credits />
          </div>
        </div>
      </div>
    </>
  )
}
