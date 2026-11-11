import { Check, Copy, Receipt } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill, Section } from '@/components/page'
import { EmptyState, ErrorState, ListSkeleton } from '@/components/states'
import { brl, todayWorkout } from '@/lib/data'
import { myCharges, PIX_CODE_EXAMPLE } from '@/lib/finance'
import { dateShort } from '@/lib/format'
import { useLoad } from '@/lib/use-load'

/* Visão do aluno: a mensalidade que ele paga à personal. O aluno não paga nada ao aura-fit. */
export function Pagamentos() {
  const { state, empty, retry } = useLoad()
  const [informed, setInformed] = useState(false)
  const all = empty ? [] : myCharges
  const due = all.find((c) => c.status !== 'pago')
  const history = all.filter((c) => c.status === 'pago')

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Pagamentos" description={`O que você combinou com ${todayWorkout.by}. Usar o aura-fit não tem custo para você.`} />

      {state === 'carregando' && <ListSkeleton rows={3} label="Carregando seus pagamentos" />}
      {state === 'erro' && <ErrorState what="seus pagamentos" onRetry={retry} />}
      {state === 'pronto' && all.length === 0 && <EmptyState icon={<Receipt />} title="Nenhuma cobrança" text="Quando sua personal enviar uma cobrança, ela aparece aqui com a forma de pagar." />}
      {state === 'pronto' && all.length > 0 && (
        <div className="grid gap-6">
          {due ? (
            <section className="rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{due.label}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{brl(due.amount)}</p>
                </div>
                {informed ? <Pill tone="info">Aguardando confirmação</Pill> : <Pill tone="warning">Vence em {dateShort(due.due)}</Pill>}
              </div>
              <div className="mt-5 grid gap-4">
                <TextField label="Pix copia e cola" readOnly copyable value={PIX_CODE_EXAMPLE} hint="Código de exemplo. Cole no app do seu banco para pagar." />
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    variant="secondary"
                    icon={<Copy />}
                    onClick={() => {
                      void navigator.clipboard?.writeText(PIX_CODE_EXAMPLE)
                      toast.success('Código Pix copiado')
                    }}
                  >
                    Copiar código
                  </Button>
                  <Button
                    icon={<Check />}
                    disabled={informed}
                    onClick={() => {
                      setInformed(true)
                      toast.success('Aviso enviado', { description: `${todayWorkout.by} confirma o pagamento assim que cair.` })
                    }}
                  >
                    {informed ? 'Pagamento informado' : 'Já paguei'}
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-success-soft p-4 text-sm text-success">
              <Check className="size-5 shrink-0" />
              <p>Tudo em dia. Nenhum pagamento em aberto.</p>
            </div>
          )}

          <Section title="Pagamentos anteriores">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Seus pagamentos confirmados aparecem aqui.</p>
            ) : (
              <ul className="-mx-2 divide-y">
                {history.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 px-2 py-3 text-sm">
                    <span className="grid min-w-0 leading-tight">
                      <span className="truncate font-medium">{c.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.paidOn && `Pago em ${dateShort(c.paidOn)}`} · {c.method}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">{brl(c.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}
    </div>
  )
}
