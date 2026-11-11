import { ArrowRight, CheckCircle2, Circle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ApprovalList } from '@/components/approval-list'
import { PageHeader, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useContent } from '@/lib/content'
import { useCrm } from '@/lib/crm'
import { brl, leadsByDay } from '@/lib/crm-data'
import { brandKit, brandKitChecklist, credits, firstName, kpis, numberFmt, session, todayLabel } from '@/lib/data'
import { useLoaded } from '@/lib/use-loaded'

function KpiGrid({ loaded }: { loaded: boolean }) {
  const { items } = useContent()
  const { leads } = useCrm()
  const count = (status: string) => items.filter((i) => i.status === status).length
  const live: Record<string, number> = { leads: leads.filter((l) => l.stage !== 'ganho' && l.stage !== 'perdido').length, agendados: count('agendado'), producao: count('ajuste'), aprovacao: count('aprovacao') }
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((k) => (
        <li key={k.id} className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">{k.label}</p>
          {loaded ? <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{numberFmt.format(live[k.id] ?? k.value)}</p> : <Skeleton className="mt-2 h-7 w-12" />}
          <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
        </li>
      ))}
    </ul>
  )
}

function ApprovalQueue({ loaded }: { loaded: boolean }) {
  return (
    <Section title="Precisa de você" description="A IA só sugere. Nada é publicado sem a sua aprovação.">
      {loaded ? (
        <ApprovalList />
      ) : (
        <div className="grid gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
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

const chartConfig = { leads: { label: 'Leads', color: 'var(--chart-1)' } } satisfies ChartConfig

function LeadsReport() {
  const { leads } = useCrm()
  const won = leads.filter((l) => l.stage === 'ganho')
  const total = leadsByDay.reduce((sum, d) => sum + d.leads, 0)
  return (
    <Section
      title="Leads nos últimos 7 dias"
      description={`${total} novos leads · ${won.length} ${won.length === 1 ? 'negócio ganho' : 'negócios ganhos'}, somando ${brl.format(won.reduce((s, l) => s + l.value, 0))}`}
      action={
        <Button asChild variant="outline" className="min-h-11">
          <Link to="/leads">Ver funil</Link>
        </Button>
      }
    >
      <ChartContainer config={chartConfig} className="h-48 w-full">
        <BarChart data={leadsByDay} margin={{ top: 8, left: 0, right: 0 }} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
          <Bar dataKey="leads" fill="var(--color-leads)" radius={6} maxBarSize={44} />
        </BarChart>
      </ChartContainer>
    </Section>
  )
}

function Credits() {
  const { creditsLeft: left, creditsTotal: total } = useContent()
  return (
    <Section title="Créditos de IA" description={`Renovam em ${credits.renewsOn}`}>
      <p className="text-2xl font-semibold tracking-tight tabular-nums">
        {numberFmt.format(left)} <span className="text-sm font-normal text-muted-foreground">de {numberFmt.format(total)}</span>
      </p>
      <Progress className="mt-3" value={(left / total) * 100} aria-label="Créditos restantes" />
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
      <div className="grid grid-cols-1 gap-4">
        <KpiGrid loaded={loaded} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="grid min-w-0 grid-cols-1 content-start gap-4 lg:col-span-2">
            <ApprovalQueue loaded={loaded} />
            <LeadsReport />
          </div>
          <div className="grid min-w-0 grid-cols-1 content-start gap-4">
            <BrandKitProgress />
            <Credits />
          </div>
        </div>
      </div>
    </>
  )
}
