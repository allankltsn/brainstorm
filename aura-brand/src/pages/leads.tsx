import { Copy, FileText, Plus, ShieldCheck, ShieldOff } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/affect/checkbox'
import { Select } from '@/components/affect/select'
import { Switch } from '@/components/affect/switch'
import { TagInput } from '@/components/affect/tag-input'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCrm } from '@/lib/crm'
import { brl, FUNNEL, SOURCES, STAGE_LABEL, STAGES, type Lead, type Source, type Stage } from '@/lib/crm-data'
import { numberFmt } from '@/lib/data'
import { useLoaded } from '@/lib/use-loaded'
import { useTab } from '@/lib/use-tab'

const TABS = ['funil', 'formularios'] as const
const STAGE_OPTIONS = STAGES.map((value) => ({ value, label: STAGE_LABEL[value] }))
const SOURCE_OPTIONS = SOURCES.map((value) => ({ value, label: value }))
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LeadCard({ lead }: { lead: Lead }) {
  const { moveLead } = useCrm()
  return (
    <li className="grid gap-3 rounded-lg border bg-card p-3">
      <Person name={lead.name} sub={lead.email} size="sm" />
      <div className="flex flex-wrap items-center gap-2">
        <Pill>{lead.source}</Pill>
        <span className="text-sm font-medium tabular-nums">{brl.format(lead.value)}</span>
        {lead.consent ? (
          <Pill tone="success" icon={<ShieldCheck aria-hidden="true" />}>
            Consentiu
          </Pill>
        ) : (
          <Pill tone="warning" icon={<ShieldOff aria-hidden="true" />}>
            Sem consentimento
          </Pill>
        )}
      </div>
      <Select
        aria-label={`Etapa de ${lead.name}`}
        options={STAGE_OPTIONS}
        value={lead.stage}
        size="lg"
        onChange={(v) => {
          moveLead(lead.id, v as Stage)
          toast.success(`${lead.name} foi para ${STAGE_LABEL[v as Stage]}`)
        }}
      />
    </li>
  )
}

function Funnel() {
  const { leads } = useCrm()
  const lost = leads.filter((l) => l.stage === 'perdido')
  if (leads.length === 0) return <p className="py-10 text-center text-sm text-muted-foreground">Nenhum lead ainda. Crie o primeiro ou ative um formulário.</p>
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {FUNNEL.map((stage) => {
          const list = leads.filter((l) => l.stage === stage)
          const total = list.reduce((sum, l) => sum + l.value, 0)
          return (
            <section key={stage} aria-label={STAGE_LABEL[stage]} className="min-w-0 rounded-xl bg-muted/60 p-3">
              <header className="mb-3 flex items-baseline justify-between gap-2 px-1">
                <h2 className="text-sm font-semibold">
                  {STAGE_LABEL[stage]} <span className="font-normal text-muted-foreground">({list.length})</span>
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">{brl.format(total)}</span>
              </header>
              {list.length === 0 ? (
                <p className="px-1 py-4 text-sm text-muted-foreground">Nenhum lead nesta etapa.</p>
              ) : (
                <ul className="grid gap-2">
                  {list.map((l) => (
                    <LeadCard key={l.id} lead={l} />
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
      {lost.length > 0 && (
        <Section title={`Perdidos (${lost.length})`} description="Mude a etapa para trazer um lead de volta ao funil." className="mt-4">
          <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {lost.map((l) => (
              <LeadCard key={l.id} lead={l} />
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

function Forms({ onNew }: { onNew: () => void }) {
  const { forms, toggleForm } = useCrm()
  const copy = async (id: string) => {
    // Endereço de exemplo: o protótipo não publica formulários.
    const link = `https://aura-brand.example/f/${id}`
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Link copiado')
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }
  return (
    <Section
      title="Formulários"
      description="Cada envio vira um lead, com a origem registrada."
      action={
        <Button variant="outline" className="min-h-11" onClick={onNew}>
          <Plus /> Novo formulário
        </Button>
      }
    >
      {forms.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Nenhum formulário ainda. Crie um para começar a captar leads.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {forms.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
              <div className="min-w-0 flex-1 basis-56">
                <p className="text-sm font-medium">{f.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {f.fields.join(', ')} · {numberFmt.format(f.leads)} leads
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch label={f.active ? 'Ativo' : 'Pausado'} checked={f.active} onChange={(e) => toggleForm(f.id, e.target.checked)} />
                <Button variant="ghost" size="icon" className="size-11" aria-label={`Copiar link de ${f.name}`} onClick={() => copy(f.id)}>
                  <Copy />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function NewLeadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addLead } = useCrm()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [value, setValue] = useState('')
  const [source, setSource] = useState<Source>('Indicação')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; value?: string }>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const amount = Number(value.replace(',', '.'))
    const found: typeof errors = {}
    if (!name.trim()) found.name = 'Informe o nome.'
    if (!EMAIL.test(email.trim())) found.email = 'Digite um e-mail completo.'
    if (value.trim() && !(amount >= 0)) found.value = 'Use só números.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    addLead({ name: name.trim(), email: email.trim(), source, value: amount || 0, consent })
    toast.success('Lead criado', { description: consent ? 'Ele entrou na etapa Novo.' : 'Sem consentimento, ele não recebe campanhas.' })
    setName('')
    setEmail('')
    setValue('')
    setConsent(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Novo lead</DialogTitle>
            <DialogDescription>Ele entra na etapa Novo do funil.</DialogDescription>
          </DialogHeader>
          <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} size="lg" autoComplete="off" />
          <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} size="lg" autoComplete="off" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Origem" options={SOURCE_OPTIONS} value={source} onChange={(v) => setSource(v as Source)} size="lg" />
            <TextField label="Valor estimado" optional prefix="R$" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} error={errors.value} size="lg" />
          </div>
          <Checkbox label="A pessoa autorizou o contato" description="Sem essa autorização, o lead fica fora das campanhas (LGPD)." checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <DialogFooter>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="min-h-11">
              Criar lead
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function NewFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addForm } = useCrm()
  const [name, setName] = useState('')
  const [fields, setFields] = useState(['Nome', 'E-mail'])
  const [errors, setErrors] = useState<{ name?: string; fields?: string }>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found: typeof errors = {}
    if (!name.trim()) found.name = 'Dê um nome ao formulário.'
    if (fields.length === 0) found.fields = 'Adicione pelo menos um campo.'
    setErrors(found)
    if (Object.keys(found).length > 0) return
    addForm(name.trim(), fields)
    toast.success('Formulário criado', { description: 'Ele já está ativo. Copie o link para divulgar.' })
    setName('')
    setFields(['Nome', 'E-mail'])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Novo formulário</DialogTitle>
            <DialogDescription>Todo formulário pede a autorização de contato antes do envio.</DialogDescription>
          </DialogHeader>
          <TextField label="Nome do formulário" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} size="lg" autoComplete="off" />
          <TagInput label="Campos" hint="Pressione Enter para adicionar." value={fields} onChange={setFields} error={errors.fields} max={8} />
          <DialogFooter>
            <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="min-h-11">
              Criar formulário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function Leads() {
  const loaded = useLoaded()
  const { leads } = useCrm()
  const [tab, setTab] = useTab(TABS)
  const [newLead, setNewLead] = useState(false)
  const [newForm, setNewForm] = useState(false)
  const open = leads.filter((l) => l.stage !== 'ganho' && l.stage !== 'perdido')

  return (
    <>
      <PageHeader
        title="Leads"
        description={`${open.length} em aberto, somando ${brl.format(open.reduce((s, l) => s + l.value, 0))}.`}
        actions={
          <Button className="min-h-11" onClick={() => setNewLead(true)}>
            <Plus /> Novo lead
          </Button>
        }
      />
      {!loaded ? (
        <div className="grid gap-4" aria-busy="true" aria-label="Carregando leads">
          <Skeleton className="h-9 w-56" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {FUNNEL.map((s) => (
              <Skeleton key={s} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <Tabs value={tab} onValueChange={(t) => setTab(t as (typeof TABS)[number])}>
          <TabsList>
            <TabsTrigger value="funil">Funil</TabsTrigger>
            <TabsTrigger value="formularios">Formulários</TabsTrigger>
          </TabsList>
          <TabsContent value="funil" className="mt-4">
            <Funnel />
          </TabsContent>
          <TabsContent value="formularios" className="mt-4">
            <Forms onNew={() => setNewForm(true)} />
          </TabsContent>
        </Tabs>
      )}
      <NewLeadDialog open={newLead} onOpenChange={setNewLead} />
      <NewFormDialog open={newForm} onOpenChange={setNewForm} />
    </>
  )
}
