import { Check } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Pill, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContent } from '@/lib/content'
import { useCrm } from '@/lib/crm'
import { brl, currentPlan, plans, type PlanId } from '@/lib/crm-data'
import { credits, numberFmt, session } from '@/lib/data'
import { useTab } from '@/lib/use-tab'
import { cn } from '@/lib/utils'

const TABS = ['conta', 'plano', 'privacidade'] as const

function Account() {
  const [name, setName] = useState(session.name)
  const [error, setError] = useState('')
  const [notify, setNotify] = useState({ aprovacao: true, leads: true, resumo: false })
  const save = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Informe seu nome.')
    setError('')
    toast.success('Conta atualizada')
  }
  return (
    <form onSubmit={save} noValidate className="grid grid-cols-1 gap-4">
      <Section title="Seus dados" description="Como você aparece para a equipe.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} error={error} size="lg" autoComplete="name" />
          <TextField label="E-mail" type="email" defaultValue={session.email} readOnly size="lg" hint="Para trocar o e-mail, fale com o suporte." />
        </div>
      </Section>
      <Section title="Avisos" description="Quando avisar você por e-mail.">
        <div className="grid gap-4">
          <Switch label="Conteúdo esperando aprovação" checked={notify.aprovacao} onChange={(e) => setNotify((n) => ({ ...n, aprovacao: e.target.checked }))} />
          <Switch label="Novo lead" checked={notify.leads} onChange={(e) => setNotify((n) => ({ ...n, leads: e.target.checked }))} />
          <Switch label="Resumo semanal" description="Leads, posts publicados e créditos usados." checked={notify.resumo} onChange={(e) => setNotify((n) => ({ ...n, resumo: e.target.checked }))} />
        </div>
      </Section>
      <div className="flex justify-end">
        <Button type="submit" className="min-h-11">
          Salvar
        </Button>
      </div>
    </form>
  )
}

function PlanTab() {
  const { creditsLeft, creditsTotal } = useContent()
  const [plan, setPlan] = useState<PlanId>(currentPlan)
  const [coupon, setCoupon] = useState('')
  const [couponError, setCouponError] = useState('')
  const applyCoupon = (e: FormEvent) => {
    e.preventDefault()
    // Protótipo: não há validação real de cupom.
    if (!coupon.trim()) return setCouponError('Digite o código do cupom.')
    setCouponError('Cupom não encontrado. Confira o código.')
  }
  return (
    <div className="grid grid-cols-1 gap-4">
      <Section title="Créditos de IA" description={`Renovam em ${credits.renewsOn}`}>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {numberFmt.format(creditsLeft)} <span className="text-sm font-normal text-muted-foreground">de {numberFmt.format(creditsTotal)}</span>
        </p>
        <Progress className="mt-3" value={(creditsLeft / creditsTotal) * 100} aria-label="Créditos restantes" />
      </Section>
      <Section title="Plano" description="Preços de exemplo. A cobrança ainda não está ligada.">
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {plans.map((p) => {
            const active = p.id === plan
            return (
              <li key={p.id} className={cn('flex flex-col gap-3 rounded-xl border p-4', active && 'border-primary')}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{p.name}</h3>
                  {active && <Pill tone="brand">Seu plano</Pill>}
                </div>
                <p className="text-2xl font-semibold tracking-tight tabular-nums">
                  {brl.format(p.price)} <span className="text-sm font-normal text-muted-foreground">por mês</span>
                </p>
                <ul className="grid gap-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-success" aria-hidden="true" /> {numberFmt.format(p.credits)} créditos de IA por mês
                  </li>
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2">
                      <Check className="size-4 text-success" aria-hidden="true" /> {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="mt-auto min-h-11"
                  disabled={active}
                  onClick={() => {
                    setPlan(p.id)
                    toast.success(`Plano alterado para ${p.name}`, { description: 'Protótipo: nenhuma cobrança foi feita.' })
                  }}
                >
                  {active ? 'Plano atual' : `Mudar para ${p.name}`}
                </Button>
              </li>
            )
          })}
        </ul>
      </Section>
      <Section title="Cupom" description="Tem um código de desconto?">
        <form onSubmit={applyCoupon} noValidate className="flex flex-wrap items-end gap-2">
          <TextField
            label="Código do cupom"
            value={coupon}
            onChange={(e) => {
              setCoupon(e.target.value.toUpperCase())
              setCouponError('')
            }}
            error={couponError}
            size="lg"
            autoComplete="off"
            className="min-w-0 flex-1 basis-56"
          />
          <Button type="submit" variant="outline" className="min-h-11">
            Aplicar
          </Button>
        </form>
      </Section>
    </div>
  )
}

function Privacy() {
  const { leads } = useCrm()
  const [gate, setGate] = useState(true)
  const without = leads.filter((l) => !l.consent).length
  return (
    <div className="grid grid-cols-1 gap-4">
      <Section title="Consentimento (LGPD)" description="Como a marca pede e respeita a autorização de contato.">
        <div className="grid gap-4">
          <Switch
            label="Pedir autorização em todo formulário"
            description="O lead marca uma caixa aceitando o contato antes de enviar."
            checked={gate}
            onChange={(e) => {
              setGate(e.target.checked)
              if (!e.target.checked) toast.warning('Formulários sem pedido de autorização', { description: 'Leads captados assim ficam fora das campanhas.' })
            }}
          />
          <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            {without === 0
              ? 'Todos os seus leads autorizaram o contato.'
              : `${numberFmt.format(without)} ${without === 1 ? 'lead não autorizou' : 'leads não autorizaram'} o contato e ${without === 1 ? 'fica' : 'ficam'} fora das campanhas.`}
          </p>
        </div>
      </Section>
      <Section title="Seus dados" description="Você pode levar ou apagar tudo o que guardamos.">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="min-h-11" onClick={() => toast.info('Exportação ainda não está ligada', { description: 'Neste protótipo, nenhum arquivo é gerado.' })}>
            Exportar dados
          </Button>
          <Button variant="outline" className="min-h-11 text-destructive" onClick={() => toast.info('Exclusão de conta ainda não está ligada', { description: 'Neste protótipo, nada é apagado.' })}>
            Excluir conta
          </Button>
        </div>
      </Section>
    </div>
  )
}

export function Configuracoes() {
  const [tab, setTab] = useTab(TABS)
  return (
    <>
      <PageHeader title="Configurações" description="Sua conta, seu plano e a privacidade dos seus leads." />
      <Tabs value={tab} onValueChange={(t) => setTab(t as (typeof TABS)[number])}>
        <TabsList>
          <TabsTrigger value="conta">Conta</TabsTrigger>
          <TabsTrigger value="plano">Plano</TabsTrigger>
          <TabsTrigger value="privacidade">Privacidade</TabsTrigger>
        </TabsList>
        <TabsContent value="conta" className="mt-4">
          <Account />
        </TabsContent>
        <TabsContent value="plano" className="mt-4">
          <PlanTab />
        </TabsContent>
        <TabsContent value="privacidade" className="mt-4">
          <Privacy />
        </TabsContent>
      </Tabs>
    </>
  )
}
