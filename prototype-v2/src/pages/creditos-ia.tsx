import { ArrowLeft, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { NumberTicker } from '@/components/affect/number-ticker'
import { PageHeader, Pill, Section } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { brl } from '@/lib/data'
import { aiCosts, aiCredits, aiPacks, aiUsage } from '@/lib/finance'
import { dateDayMonth, dateShort } from '@/lib/format'
import { useLoad } from '@/lib/use-load'
import { cn } from '@/lib/utils'

type Pack = (typeof aiPacks)[number]

export function CreditosIA() {
  const { state, empty, retry } = useLoad()
  const [extra, setExtra] = useState(aiCredits.extra)
  const [pack, setPack] = useState<Pack | null>(null)
  const [buying, setBuying] = useState(false)

  const left = aiCredits.monthly - aiCredits.used
  const total = left + extra
  const pct = Math.round((aiCredits.used / aiCredits.monthly) * 100)
  const low = total <= 20
  const usage = empty ? [] : aiUsage

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/ia" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sugerir treino
      </Link>
      <PageHeader title="Créditos de IA" description="Cada ação da Aura gasta créditos. Eles renovam todo mês com o seu plano." />

      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Saldo disponível</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
              <NumberTicker value={total} /> <span className="text-base font-normal text-muted-foreground">créditos</span>
            </p>
          </div>
          {low ? <Pill tone="warning">Saldo baixo</Pill> : <Pill tone="success">Suficiente para o mês</Pill>}
        </div>
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>
              {aiCredits.used} de {aiCredits.monthly} créditos do plano {aiCredits.planName} usados
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" aria-label={`${aiCredits.used} de ${aiCredits.monthly} créditos do plano usados`} />
        </div>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          {[
            ['Do plano', `${left} créditos`],
            ['Avulsos (não vencem)', `${extra} créditos`],
            ['Renova em', dateShort(aiCredits.renewsOn)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-muted px-3 py-2.5">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 [&>section]:min-w-0">
        <Section title="Quanto cada ação gasta" description="Você vê o custo antes de confirmar.">
          <ul className="divide-y text-sm">
            {aiCosts.map((c) => (
              <li key={c.action} className="flex items-center justify-between gap-4 py-2.5">
                <span>{c.action}</span>
                <span className="shrink-0 font-medium tabular-nums">
                  {c.cost} {c.cost === 1 ? 'crédito' : 'créditos'}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Comprar créditos avulsos" description="Não vencem e só são usados quando os do plano acabam.">
          <ul className="grid gap-2">
            {aiPacks.map((p) => (
              <li key={p.id} className={cn('flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3', p.best && 'border-primary/40')}>
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                    {p.credits} créditos {p.best && <Pill tone="brand">Mais escolhido</Pill>}
                  </p>
                  <p className="text-xs text-muted-foreground">{brl(p.price)}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setPack(p)}>
                  Comprar
                </Button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Uso recente" description="Outubro de 2026" className="mt-6">
        {state === 'carregando' && <ListSkeleton rows={3} label="Carregando o uso de créditos" />}
        {state === 'erro' && <ErrorState what="o uso de créditos" onRetry={retry} />}
        {state === 'pronto' && usage.length === 0 && (
          <EmptyState
            icon={<Sparkles />}
            title="Nenhum crédito usado neste mês"
            text="Peça uma sugestão de treino para ver como a Aura trabalha."
            action={
              <Link to="/ia" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
                Sugerir treino
              </Link>
            }
          />
        )}
        {state === 'pronto' && usage.length > 0 && (
          <ul className="-mx-2 divide-y">
            {usage.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-2 py-3 text-sm">
                <span className="w-14 shrink-0 text-xs text-muted-foreground tabular-nums">{dateDayMonth(u.date)}</span>
                <span className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate font-medium">{u.action}</span>
                  {u.who && <span className="truncate text-xs text-muted-foreground">Para {u.who}</span>}
                </span>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {u.cost} {u.cost === 1 ? 'crédito' : 'créditos'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Dialog open={pack !== null} onOpenChange={(o) => !o && setPack(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comprar {pack?.credits} créditos</DialogTitle>
            <DialogDescription>
              {pack && brl(pack.price)} no cartão final 4242, o mesmo da sua assinatura. Os créditos entram na hora.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPack(null)}>
              Agora não
            </Button>
            <Button
              loading={buying}
              onClick={() => {
                setBuying(true)
                setTimeout(() => {
                  if (pack) {
                    setExtra((e) => e + pack.credits)
                    toast.success(`${pack.credits} créditos adicionados`)
                  }
                  setBuying(false)
                  setPack(null)
                }, 800)
              }}
            >
              {buying ? 'Confirmando' : 'Confirmar compra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
