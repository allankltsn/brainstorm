import { Check, CreditCard, Lock, PartyPopper, Tag } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill, Section } from '@/components/page'
import { ANNUAL_DISCOUNT, coupons, plans, type Plan } from '@/lib/billing'
import { brl } from '@/lib/data'
import { cn } from '@/lib/utils'

type Cycle = 'mensal' | 'anual'
type Step = 'escolher' | 'pagamento' | 'confirmado'
const CURRENT = 'pro'

const price = (p: Plan, c: Cycle) => (c === 'anual' ? p.monthly * (1 - ANNUAL_DISCOUNT) : p.monthly)

export function Planos() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('escolher')
  const [cycle, setCycle] = useState<Cycle>('mensal')
  const [chosen, setChosen] = useState<Plan>()
  return (
    <div className="mx-auto max-w-5xl">
      {step === 'escolher' && (
        <>
          <PageHeader title="Planos" description="Mude de plano quando quiser. A diferença é calculada na próxima cobrança." />
          <SegmentedControl<Cycle>
            aria-label="Ciclo de cobrança"
            value={cycle}
            onChange={setCycle}
            className="mb-6"
            options={[
              { value: 'mensal', label: 'Mensal' },
              { value: 'anual', label: 'Anual', badge: '20% menos' },
            ]}
          />
          <ul className="grid gap-4 md:grid-cols-3">
            {plans
              .filter((p) => p.status === 'publicado')
              .map((p) => {
                const current = p.id === CURRENT
                return (
                  <li key={p.id} className={cn('flex flex-col rounded-2xl border bg-card p-6', p.highlight && 'border-primary ring-1 ring-primary')}>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">{p.name}</h2>
                      {current && <Pill tone="success">Seu plano</Pill>}
                    </div>
                    <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
                      {p.monthly === 0 ? 'Grátis' : brl(price(p, cycle))}
                      {p.monthly > 0 && <span className="text-sm font-normal text-muted-foreground"> /mês</span>}
                    </p>
                    <ul className="mt-5 mb-6 grid flex-1 content-start gap-2 text-sm">
                      {p.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-success" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={p.highlight && !current ? 'primary' : 'secondary'}
                      disabled={current}
                      onClick={() => {
                        setChosen(p)
                        setStep('pagamento')
                      }}
                    >
                      {current ? 'Plano atual' : p.monthly < (plans.find((x) => x.id === CURRENT)?.monthly ?? 0) ? `Voltar para o ${p.name}` : `Escolher ${p.name}`}
                    </Button>
                  </li>
                )
              })}
          </ul>
        </>
      )}
      {step === 'pagamento' && chosen && <Pagamento plan={chosen} cycle={cycle} onBack={() => setStep('escolher')} onDone={() => setStep('confirmado')} />}
      {step === 'confirmado' && chosen && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
            <PartyPopper className="size-7" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight">Pagamento confirmado</h1>
          <p className="text-sm text-muted-foreground">Seu plano agora é o {chosen.name}. O recibo foi enviado para o seu e-mail.</p>
          <Button className="mt-2" onClick={() => navigate('/alunos')}>
            Convidar alunos
          </Button>
        </div>
      )}
    </div>
  )
}

function Pagamento({ plan, cycle, onBack, onDone }: { plan: Plan; cycle: Cycle; onBack: () => void; onDone: () => void }) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<(typeof coupons)[number]>()
  const [codeError, setCodeError] = useState<string>()
  const [card, setCard] = useState('')
  const [paying, setPaying] = useState(false)
  const base = price(plan, cycle) * (cycle === 'anual' ? 12 : 1)
  const discount = applied ? base * applied.off : 0

  function apply() {
    const c = coupons.find((x) => x.code === code.trim().toUpperCase())
    if (!c) return setCodeError('Cupom não encontrado. Confira o código.')
    if (!c.active || c.uses >= c.limit) return setCodeError('Este cupom expirou ou esgotou.')
    if (c.plan !== 'Todos' && c.plan !== plan.name) return setCodeError(`Este cupom vale só para o plano ${c.plan}.`)
    setCodeError(undefined)
    setApplied(c)
    toast.success('Cupom aplicado')
  }

  return (
    <>
      <PageHeader title="Resumo e pagamento" description="Revise o pedido e informe o cartão." actions={<Button variant="ghost" onClick={onBack}>Voltar aos planos</Button>} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid content-start gap-6">
          <Section title="Cupom de desconto" description="Opcional.">
            <div className="flex items-start gap-2">
              <TextField aria-label="Código do cupom" placeholder="Ex.: PRO20" prefix={<Tag className="size-4" />} value={code} onChange={(e) => setCode(e.target.value)} error={codeError} className="flex-1" />
              <Button variant="secondary" onClick={apply}>
                Aplicar
              </Button>
            </div>
          </Section>
          <Section title="Cartão" description="Pagamento simulado: nada será cobrado.">
            <div className="grid gap-4">
              <TextField label="Número do cartão" inputMode="numeric" placeholder="0000 0000 0000 0000" prefix={<CreditCard className="size-4" />} value={card} onChange={(e) => setCard(e.target.value.replace(/[^\d ]/g, ''))} />
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Validade" placeholder="MM/AA" />
                <TextField label="Código (CVV)" inputMode="numeric" maxLength={4} />
              </div>
            </div>
          </Section>
        </div>
        <aside className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="text-sm font-semibold">Pedido</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Plano {plan.name} ({cycle})</dt>
              <dd className="tabular-nums">{brl(base)}</dd>
            </div>
            {applied && (
              <div className="flex justify-between text-success">
                <dt>Cupom {applied.code}</dt>
                <dd className="tabular-nums">− {brl(discount)}</dd>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t pt-3 text-base font-semibold">
              <dt>Total hoje</dt>
              <dd className="tabular-nums">{brl(base - discount)}</dd>
            </div>
          </dl>
          <Button
            className="mt-5 w-full"
            size="lg"
            icon={<Lock />}
            loading={paying}
            onClick={() => {
              if (card.replace(/\s/g, '').length < 13) return toast.error('Informe o número do cartão')
              setPaying(true)
              setTimeout(onDone, 1000)
            }}
          >
            {paying ? 'Processando' : 'Pagar'}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">Você pode cancelar quando quiser, em Configurações.</p>
        </aside>
      </div>
    </>
  )
}
