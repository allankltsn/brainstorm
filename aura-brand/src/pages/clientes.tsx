import { Copy, MessageSquare, Plus, Search, ShieldAlert, Upload } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { Switch } from '@/components/affect/switch'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { brandName } from '@/components/brand-preview'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { fontPair, onColor, useBrand } from '@/lib/brand'
import { approvedKit } from '@/lib/content'
import { DealCard } from '@/components/deal-card'
import { brl, CONTACT_LIMIT, dateLabel, FIELDS, isEmail, MSG_CHANNELS, SOURCES, stageLabel, stageOf, STAGES, useCrm, type CaptureForm, type Deal, type FieldId, type Source, type Stage } from '@/lib/crm'
import { cn } from '@/lib/utils'

const TABS = ['funil', 'contatos', 'captacao', 'automacoes'] as const
type Tab = (typeof TABS)[number]

const STAGE_TONE = { novo: 'info', conversa: 'brand', proposta: 'warning', ganho: 'success', perdido: 'neutral' } as const
const ranNote = (ran: string[]) => (ran.length ? `Automação enviada: ${ran.join(', ')}.` : undefined)

function StageSelect({ deal }: { deal: Deal }) {
  const { moveDeal, restore, snapshot } = useCrm()
  return (
    <Select
      size="sm"
      aria-label={`Etapa do negócio ${deal.title}`}
      options={STAGES.map((s) => ({ value: s.id, label: s.label, description: s.hint }))}
      value={deal.stage}
      onChange={(v) => {
        const before = snapshot()
        const ran = moveDeal(deal.id, v as Stage)
        toast.success(`"${deal.title}" foi para ${stageLabel(v as Stage)}`, { description: ranNote(ran), action: { label: 'Desfazer', onClick: () => restore(before) } })
      }}
    />
  )
}

/* O funil é de negócios: uma empresa pode ter mais de um aberto. O cartão leva à ficha do contato. */
function Funnel({ onOpen }: { onOpen: (id: string) => void }) {
  const { deals, contact, company } = useCrm()
  const lost = deals.filter((d) => d.stage === 'perdido')
  const open = STAGES.filter((s) => s.id !== 'perdido')
  return (
    <>
      <div className="grid gap-4 lg:grid-cols-4">
        {open.map((s) => {
          const list = deals.filter((d) => d.stage === s.id)
          const total = list.reduce((n, d) => n + d.value, 0)
          return (
            <section key={s.id} aria-labelledby={`etapa-${s.id}`} className="min-w-0 rounded-xl border bg-muted/40 p-3">
              <header className="mb-3 flex items-baseline justify-between gap-2 px-1">
                <h2 id={`etapa-${s.id}`} className="text-sm font-semibold">
                  {s.label} <span className="font-normal text-muted-foreground">{list.length}</span>
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">{brl(total)}</span>
              </header>
              {list.length === 0 ? (
                <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">Nenhum negócio nesta etapa.</p>
              ) : (
                <ul className="grid min-w-0 grid-cols-1 gap-2">
                  {list.map((d) => {
                    const x = contact(d.contactId)
                    const org = company(x?.companyId ?? null)
                    if (!x) return null
                    return (
                      <li key={d.id} className="min-w-0 rounded-lg border bg-card p-3">
                        <button type="button" onClick={() => onOpen(x.id)} className="block w-full rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <span className="block truncate text-sm font-medium">{d.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">{org ? `${org.name} · ${x.name}` : x.name}</span>
                          <span className="mt-2 flex flex-wrap items-center gap-1.5">
                            <Pill>{SOURCES[x.source]}</Pill>
                            {d.value > 0 && <span className="text-xs font-medium tabular-nums">{brl(d.value)}</span>}
                            {!x.consent && (
                              <Pill tone="warning" icon={<ShieldAlert />}>
                                Sem consentimento
                              </Pill>
                            )}
                          </span>
                        </button>
                        <div className="mt-2.5">
                          <StageSelect deal={d} />
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )
        })}
      </div>
      {lost.length > 0 && (
        <Section title={`Perdidos (${lost.length})`} description="Negócios que não avançaram. Dá para trazer de volta ao funil." className="mt-6">
          <ul className="-mx-2 divide-y">
            {lost.map((d) => {
              const x = contact(d.contactId)
              if (!x) return null
              return (
                <li key={d.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-2 py-3">
                  <button type="button" onClick={() => onOpen(x.id)} className="min-w-0 flex-1 basis-56 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Person name={x.name} sub={`${d.title}${x.note ? `. ${x.note}` : ''}`} />
                  </button>
                  <div className="w-44">
                    <StageSelect deal={d} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>
      )}
    </>
  )
}

/* Lê um CSV simples: nome, e-mail, telefone. Aceita vírgula ou ponto e vírgula e ignora o cabeçalho. */
function parseCsv(text: string) {
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.split(/[;,]/).map((v) => v.trim().replace(/^"|"$/g, '')))
    .filter((r) => r.some(Boolean))
  const body = rows.length && /nome|name/i.test(rows[0][0]) ? rows.slice(1) : rows
  const valid = body.filter((r) => r[0] && (isEmail(r[1] ?? '') || (r[2] ?? '').replace(/\D/g, '').length >= 8))
  return { valid: valid.map((r) => ({ name: r[0], email: isEmail(r[1] ?? '') ? r[1] : '', phone: r[2] ?? '' })), skipped: body.length - valid.length }
}

function NewContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addContact } = useCrm()
  const [f, setF] = useState({ name: '', company: '', role: '', email: '', phone: '', detail: '', consent: false })
  const [tried, setTried] = useState(false)
  const noName = !f.name.trim()
  const noReach = !isEmail(f.email) && f.phone.replace(/\D/g, '').length < 8
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (noName || noReach) return
    const { ran } = addContact({ name: f.name.trim(), companyName: f.company.trim() || undefined, role: f.role.trim(), email: isEmail(f.email) ? f.email.trim() : '', phone: f.phone.trim(), source: 'manual', sourceDetail: f.detail.trim() || 'Adicionado à mão', consent: f.consent })
    toast.success(`${f.name.trim()} foi adicionado`, { description: ranNote(ran) ?? 'Está na etapa Novo do funil.' })
    setF({ name: '', company: '', role: '', email: '', phone: '', detail: '', consent: false })
    setTried(false)
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar contato</DialogTitle>
          <DialogDescription>Entra no funil com um negócio na etapa Novo. Para cliente de empresa, informe a empresa.</DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" noValidate onSubmit={submit}>
          <TextField label="Nome" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={tried && noName ? 'Informe o nome.' : undefined} autoComplete="off" />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Empresa" optional hint="Só para venda a empresas." value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} autoComplete="off" />
            <TextField label="Cargo" optional value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} disabled={!f.company.trim()} autoComplete="off" />
          </div>
          <TextField label="E-mail" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={tried && noReach ? 'Informe um e-mail ou um WhatsApp válido.' : undefined} autoComplete="off" />
          <TextField label="WhatsApp" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="(11) 90000-0000" autoComplete="off" />
          <TextField label="De onde veio" optional hint="Ex.: feira de sábado, indicação da Ana." value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} />
          <Checkbox checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} label="A pessoa aceitou receber mensagens da marca" description="Sem esse aceite, ela fica fora de campanhas e automações (LGPD)." />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar contato</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Contacts({ onOpen }: { onOpen: (id: string) => void }) {
  const { contacts, deals, company, addContacts } = useCrm()
  const [q, setQ] = useState('')
  const [source, setSource] = useState<'todas' | Source>('todas')
  const file = useRef<HTMLInputElement>(null)
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const shown = contacts.filter((x) => (source === 'todas' || x.source === source) && norm(`${x.name} ${x.email} ${x.phone} ${x.sourceDetail} ${company(x.companyId)?.name ?? ''}`).includes(norm(q.trim())))
  const used = contacts.length
  return (
    <Section
      title="Contatos"
      description={`${used} de ${CONTACT_LIMIT} contatos do plano Pro. Cada contato guarda de onde veio.`}
      action={
        <div className="flex flex-wrap gap-2">
          <input
            ref={file}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            aria-label="Arquivo CSV de contatos"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              const { valid, skipped } = parseCsv(await f.text())
              if (valid.length === 0) {
                toast.error('Nenhum contato encontrado na planilha', { description: 'Use um CSV com as colunas nome, e-mail e telefone.' })
                return
              }
              if (used + valid.length > CONTACT_LIMIT) {
                toast.error('A planilha passa do limite do plano', { description: `Cabem mais ${CONTACT_LIMIT - used} contatos no plano Pro.` })
                return
              }
              // importados entram sem consentimento: o aceite precisa ser registrado um a um
              addContacts(valid.map((r) => ({ ...r, source: 'planilha' as const, sourceDetail: `Planilha: ${f.name}`, consent: false })))
              toast.success(`${valid.length} ${valid.length === 1 ? 'contato importado' : 'contatos importados'}`, { description: `${skipped ? `${skipped} ${skipped === 1 ? 'linha ignorada' : 'linhas ignoradas'} por falta de nome ou contato. ` : ''}Entram sem consentimento até você registrar o aceite.` })
            }}
          />
          <Button size="sm" variant="secondary" icon={<Upload />} onClick={() => file.current?.click()}>
            Importar planilha
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap gap-3">
        <TextField aria-label="Buscar contato" placeholder="Buscar por nome, empresa, e-mail ou origem" prefix={<Search className="size-4" />} clearable value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} className="min-w-56 flex-1" />
        <div className="w-56">
          <Select aria-label="Filtrar por origem" value={source} onChange={(v) => setSource(v as 'todas' | Source)} options={[{ value: 'todas', label: 'Todas as origens' }, ...Object.entries(SOURCES).map(([value, label]) => ({ value, label }))]} />
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">{contacts.length === 0 ? 'Nenhum contato ainda. Adicione um ou importe uma planilha.' : 'Nenhum contato com esse filtro. Tente outro nome ou origem.'}</p>
      ) : (
        <ul className="-mx-2 divide-y">
          {shown.map((x) => (
            <li key={x.id}>
              <button type="button" onClick={() => onOpen(x.id)} className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 rounded-md px-2 py-3 text-left outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring">
                <span className="min-w-0 flex-1 basis-56">
                  <Person name={x.name} sub={company(x.companyId)?.name ?? (x.email || x.phone)} />
                </span>
                <span className="min-w-0 flex-1 basis-56 truncate text-xs text-muted-foreground">{x.sourceDetail}</span>
                <span className="flex flex-wrap items-center gap-1.5 sm:w-64 sm:justify-end">
                  {!x.consent && (
                    <Pill tone="warning" icon={<ShieldAlert />}>
                      Sem consentimento
                    </Pill>
                  )}
                  {(() => {
                    const st = stageOf(deals, x.id)
                    return st ? <Pill tone={STAGE_TONE[st]}>{stageLabel(st)}</Pill> : <Pill>Sem negócio</Pill>
                  })()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

/* Ficha do contato: empresa, negócios, consentimento, anotações e atalho para o atendimento. */
function ContactSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { contact, company, dealsOf, addDeal, patchContact, removeContact, openThread, restore, snapshot } = useCrm()
  const navigate = useNavigate()
  const x = id ? contact(id) : undefined
  const org = company(x?.companyId ?? null)
  const deals = x ? dealsOf(x.id) : []
  const [dealTitle, setDealTitle] = useState('')
  return (
    <Sheet open={!!x} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {x && (
          <>
            <SheetHeader>
              <SheetTitle>{x.name}</SheetTitle>
              <SheetDescription>
                {org ? `${x.role ? `${x.role}, ` : ''}${org.name}. ` : ''}Chegou em {dateLabel(x.createdAt)} por {SOURCES[x.source]}. {x.sourceDetail}.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 px-4 pb-6">
              <div className="grid gap-3">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                  <dt className="text-muted-foreground">E-mail</dt>
                  <dd className="truncate">{x.email || 'Não informado'}</dd>
                  <dt className="text-muted-foreground">WhatsApp</dt>
                  <dd>{x.phone || 'Não informado'}</dd>
                  {org && (
                    <>
                      <dt className="text-muted-foreground">Empresa</dt>
                      <dd>{[org.name, org.segment, org.city].filter(Boolean).join(' · ')}</dd>
                    </>
                  )}
                </dl>
                <Button
                  variant="secondary"
                  icon={<MessageSquare />}
                  onClick={() => {
                    const t = openThread(x.id)
                    navigate(`/atendimento?id=${t}`)
                  }}
                >
                  Abrir no atendimento
                </Button>
              </div>

              <section aria-labelledby="negocios-titulo" className="grid gap-2">
                <h3 id="negocios-titulo" className="text-sm font-semibold">
                  Negócios
                </h3>
                {deals.length === 0 && <p className="text-sm text-muted-foreground">Nenhum negócio com este contato.</p>}
                {[...deals].reverse().map((d) => (
                  <DealCard key={d.id} deal={d} />
                ))}
                <form
                  className="flex items-end gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (dealTitle.trim().length < 3) return
                    addDeal(x.id, dealTitle.trim(), 0)
                    setDealTitle('')
                    toast.success('Negócio criado em Novo')
                  }}
                >
                  <TextField size="sm" label="Novo negócio" placeholder="Ex.: café para o evento de dezembro" value={dealTitle} onChange={(e) => setDealTitle(e.target.value)} maxLength={80} className="flex-1" />
                  <Button type="submit" size="sm" variant="secondary" disabled={dealTitle.trim().length < 3}>
                    Criar
                  </Button>
                </form>
              </section>

              <Switch
                placement="end"
                checked={x.consent}
                onChange={(e) => patchContact(x.id, { consent: e.target.checked })}
                label="Aceitou receber mensagens"
                description={x.consent ? 'Pode entrar em campanhas e automações.' : 'Fica fora de campanhas e automações até dar o aceite (LGPD).'}
              />

              <TextArea label="Anotações" optional minRows={2} maxLength={300} value={x.note} onChange={(e) => patchContact(x.id, { note: e.target.value })} />

              <Button
                variant="destructive"
                onClick={() => {
                  const before = snapshot()
                  removeContact(x.id)
                  onClose()
                  toast(`${x.name} foi excluído`, { description: 'A conversa, os negócios e as propostas foram junto.', action: { label: 'Desfazer', onClick: () => restore(before) } })
                }}
              >
                Excluir contato
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

const EMPTY_FORM: CaptureForm = { id: '', kind: 'formulario', name: '', headline: '', description: '', fields: ['nome', 'telefone'], cta: 'Enviar', active: true, views: 0, leads: 0 }

/* O formulário como o cliente vê, com as cores e fontes aprovadas. Enviar aqui cria um contato de verdade no funil. */
function FormPreview({ form, live }: { form: CaptureForm; live: boolean }) {
  const { kit } = useBrand()
  const { submitForm } = useCrm()
  const k = approvedKit(kit)
  const font = fontPair(k.fontId)
  const [v, setV] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [error, setError] = useState('')
  const has = (f: FieldId) => form.fields.includes(f)
  const input = 'h-10 w-full rounded-md border bg-white px-3 text-sm text-zinc-900 outline-none focus-visible:ring-2'
  return (
    <form
      className="grid gap-3 rounded-xl border p-5"
      style={{ background: k.palette.surface, color: k.palette.ink, fontFamily: font.body, borderColor: k.palette.secondary }}
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (!live) return toast('Salve o formulário para testar o envio')
        if (has('nome') && !v.nome.trim()) return setError('Informe o seu nome.')
        if (has('email') && !isEmail(v.email)) return setError('Informe um e-mail válido.')
        if (has('telefone') && v.telefone.replace(/\D/g, '').length < 8) return setError('Informe um WhatsApp válido.')
        setError('')
        const { contact, ran } = submitForm(form.id, { name: v.nome.trim() || 'Contato sem nome', email: has('email') ? v.email.trim() : '', phone: has('telefone') ? v.telefone.trim() : '', note: has('mensagem') ? v.mensagem.trim() : '' })
        setV({ nome: '', email: '', telefone: '', mensagem: '' })
        toast.success(`${contact.name} entrou no funil`, { description: ranNote(ran) ?? 'Origem registrada: este formulário.' })
      }}
    >
      <p className="text-xs font-medium" style={{ color: k.palette.primary }}>
        {brandName(k)}
      </p>
      <p className="text-xl leading-tight font-bold text-balance" style={{ fontFamily: font.heading }}>
        {form.headline || 'Título do formulário'}
      </p>
      {form.description && <p className="text-sm leading-relaxed">{form.description}</p>}
      {(Object.keys(FIELDS) as FieldId[]).filter(has).map((f) => (
        <label key={f} className="grid gap-1 text-sm font-medium">
          {FIELDS[f]}
          {f === 'mensagem' ? (
            <textarea rows={3} value={v[f]} onChange={(e) => setV({ ...v, [f]: e.target.value })} className={cn(input, 'h-auto py-2')} style={{ borderColor: k.palette.secondary }} />
          ) : (
            <input type={f === 'email' ? 'email' : f === 'telefone' ? 'tel' : 'text'} value={v[f]} onChange={(e) => setV({ ...v, [f]: e.target.value })} className={input} style={{ borderColor: k.palette.secondary }} />
          )}
        </label>
      ))}
      {error && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <button type="submit" className="h-11 rounded-md px-4 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-offset-2" style={{ background: k.palette.primary, color: onColor(k.palette.primary) }}>
        {form.cta || 'Enviar'}
      </button>
      <p className="text-xs opacity-80">Ao enviar, você aceita receber mensagens de {brandName(k)}. Dá para sair quando quiser.</p>
    </form>
  )
}

function FormEditor({ initial, onDone }: { initial: CaptureForm; onDone: () => void }) {
  const { saveForm, removeForm, forms, restore, snapshot } = useCrm()
  // formulário novo ganha o id uma vez só, quando a tela abre
  const [form, setForm] = useState(() => (initial.id ? initial : { ...initial, id: `f${Date.now().toString(36)}` }))
  const [tried, setTried] = useState(false)
  const isNew = !forms.some((f) => f.id === form.id)
  const set = (p: Partial<CaptureForm>) => setForm((cur) => ({ ...cur, ...p }))
  const toggle = (f: FieldId, on: boolean) => set({ fields: on ? [...form.fields, f] : form.fields.filter((x) => x !== f) })
  const noReach = !form.fields.includes('email') && !form.fields.includes('telefone')
  const invalid = !form.name.trim() || !form.headline.trim() || !form.cta.trim() || noReach
  const link = `aura.link/${(form.name || 'formulario').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Section title={isNew ? 'Novo formulário' : form.name} description="Todo contato que chegar por aqui entra no funil com esta origem." className="min-w-0 lg:col-span-3">
        <form
          className="grid gap-5"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            setTried(true)
            if (invalid) return
            saveForm(form)
            toast.success(isNew ? 'Formulário criado' : 'Formulário salvo')
            onDone()
          }}
        >
          <div className="grid gap-2">
            <span id="tipo-label" className="text-sm font-medium">
              Tipo
            </span>
            <SegmentedControl<CaptureForm['kind']>
              aria-labelledby="tipo-label"
              fullWidth
              value={form.kind}
              onChange={(kind) => set({ kind })}
              options={[
                { value: 'formulario', label: 'Formulário' },
                { value: 'pagina', label: 'Página de captura' },
              ]}
            />
            <p className="text-xs text-muted-foreground">{form.kind === 'pagina' ? 'Uma página só sua, com link próprio para divulgar.' : 'Um bloco para colocar no seu site ou no link da bio.'}</p>
          </div>
          <TextField label="Nome interno" hint="Só você vê. Aparece como a origem do contato." value={form.name} onChange={(e) => set({ name: e.target.value })} maxLength={50} error={tried && !form.name.trim() ? 'Dê um nome ao formulário.' : undefined} />
          <TextField label="Título" value={form.headline} onChange={(e) => set({ headline: e.target.value })} maxLength={70} counter error={tried && !form.headline.trim() ? 'Escreva o título que o cliente vai ler.' : undefined} />
          <TextArea label="Texto de apoio" optional minRows={2} maxLength={200} counter value={form.description} onChange={(e) => set({ description: e.target.value })} />
          <fieldset className="grid gap-2.5">
            <legend className="mb-1 text-sm font-medium">O que pedir</legend>
            {(Object.keys(FIELDS) as FieldId[]).map((f) => (
              <Checkbox key={f} checked={form.fields.includes(f)} onChange={(e) => toggle(f, e.target.checked)} label={FIELDS[f]} />
            ))}
            {tried && noReach && (
              <p role="alert" className="text-sm text-destructive">
                Peça e-mail ou WhatsApp, senão não dá para responder o contato.
              </p>
            )}
            <p className="text-xs text-muted-foreground">Quanto menos campos, mais gente preenche.</p>
          </fieldset>
          <TextField label="Texto do botão" value={form.cta} onChange={(e) => set({ cta: e.target.value })} maxLength={30} error={tried && !form.cta.trim() ? 'Escreva o texto do botão.' : undefined} />
          <Switch placement="end" checked={form.active} onChange={(e) => set({ active: e.target.checked })} label="Recebendo contatos" description={form.active ? 'O link está no ar.' : 'O link mostra um aviso de formulário encerrado.'} />
          <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
            {!isNew && (
              <Button
                type="button"
                variant="ghost"
                className="mr-auto"
                onClick={() => {
                  const before = snapshot()
                  removeForm(form.id)
                  onDone()
                  toast(`"${form.name}" foi excluído`, { description: 'Os contatos que vieram por ele continuam no funil.', action: { label: 'Desfazer', onClick: () => restore(before) } })
                }}
              >
                Excluir formulário
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={onDone}>
              Cancelar
            </Button>
            <Button type="submit">{isNew ? 'Criar formulário' : 'Salvar formulário'}</Button>
          </div>
        </form>
      </Section>
      <div className="min-w-0 lg:col-span-2">
        <h2 className="mb-3 text-sm font-semibold">Como o cliente vê</h2>
        <FormPreview form={form} live={!isNew} />
        <p className="mt-3 text-xs text-muted-foreground">{isNew ? 'Depois de criar, dá para testar o envio por aqui.' : 'Preencha e envie para testar: o contato entra de verdade no funil.'}</p>
        {!isNew && (
          <Button
            size="sm"
            variant="secondary"
            icon={<Copy />}
            className="mt-3"
            onClick={() => {
              void navigator.clipboard?.writeText(`https://${link}`)
              toast.success('Link copiado', { description: link })
            }}
          >
            Copiar link
          </Button>
        )}
      </div>
    </div>
  )
}

function Capture({ onEdit }: { onEdit: (id: string) => void }) {
  const { forms, saveForm } = useCrm()
  return (
    <Section
      title="Formulários e páginas"
      description="Por onde os contatos chegam. Cada um registra a origem no funil."
      action={
        <Button size="sm" variant="secondary" icon={<Plus />} onClick={() => onEdit('novo')}>
          Criar formulário
        </Button>
      }
    >
      {forms.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhum formulário ainda. Crie o primeiro para começar a receber contatos.</p>
      ) : (
        <ul className="-mx-2 divide-y">
          {forms.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
              <div className="min-w-0 flex-1 basis-56">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {f.name}
                  <Pill>{f.kind === 'pagina' ? 'Página de captura' : 'Formulário'}</Pill>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {f.views} visitas, {f.leads} contatos ({f.views ? ((f.leads / f.views) * 100).toFixed(1).replace('.', ',') : '0'}% de conversão)
                </p>
              </div>
              <Switch size="sm" checked={f.active} onChange={(e) => saveForm({ ...f, active: e.target.checked })} label={f.active ? 'No ar' : 'Encerrado'} />
              <Button size="sm" variant="secondary" onClick={() => onEdit(f.id)}>
                Editar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function Automations() {
  const { automations, patchAutomation } = useCrm()
  return (
    <Section title="Automações por etapa" description="Mensagens de texto fixo, escritas por você, enviadas quando um contato entra na etapa. Só vão para quem aceitou receber mensagens.">
      <ul className="grid gap-4">
        {automations.map((a) => (
          <li key={a.id} className="rounded-lg border p-4">
            <Switch
              placement="end"
              checked={a.active}
              onChange={(e) => {
                patchAutomation(a.id, { active: e.target.checked })
                toast(e.target.checked ? `"${a.name}" ligada` : `"${a.name}" desligada`)
              }}
              label={a.name}
              description={`Quando um negócio entra em ${stageLabel(a.stage)}, por ${MSG_CHANNELS[a.channel]}. A mensagem aparece na conversa do cliente.`}
            />
            <TextArea aria-label={`Mensagem da automação ${a.name}`} className="mt-3" minRows={2} maxLength={320} counter value={a.text} onChange={(e) => patchAutomation(a.id, { text: e.target.value })} disabled={!a.active} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

export function Clientes() {
  const { contacts, deals, forms } = useCrm()
  const [params, setParams] = useSearchParams()
  const raw = params.get('aba') as Tab | null
  const tab: Tab = raw && TABS.includes(raw) ? raw : 'funil'
  const formId = params.get('form')
  const contactId = params.get('contato')
  const [adding, setAdding] = useState(params.get('novo') === '1')
  const go = (t: Tab, extra: Record<string, string> = {}) => setParams({ ...(t === 'funil' ? {} : { aba: t }), ...extra }, { replace: Object.keys(extra).length === 0 })
  const openContact = (id: string) => go(tab, { contato: id })
  const editing = formId ? (forms.find((f) => f.id === formId) ?? EMPTY_FORM) : null
  const fresh = deals.filter((d) => d.stage === 'novo').length
  const openValue = deals.filter((d) => d.stage === 'conversa' || d.stage === 'proposta').reduce((n, d) => n + d.value, 0)

  return (
    <>
      <PageHeader
        title="Clientes"
        description={`${fresh === 1 ? '1 negócio novo' : `${fresh} negócios novos`} no funil. ${brl(openValue)} em negociação.`}
        actions={
          !editing && (
            <Button icon={<Plus />} onClick={() => setAdding(true)}>
              Adicionar contato
            </Button>
          )
        }
      />
      {editing ? (
        <FormEditor key={formId} initial={editing} onDone={() => go('captacao')} />
      ) : (
        <>
          <SegmentedControl<Tab>
            variant="underline"
            kind="tabs"
            aria-label="Seções de clientes"
            value={tab}
            onChange={(t) => go(t)}
            className="mb-6"
            options={[
              { value: 'funil', label: 'Funil', controls: 'painel-clientes' },
              { value: 'contatos', label: 'Contatos', count: contacts.length, controls: 'painel-clientes' },
              { value: 'captacao', label: 'Captação', controls: 'painel-clientes' },
              { value: 'automacoes', label: 'Automações', controls: 'painel-clientes' },
            ]}
          />
          <div id="painel-clientes" role="tabpanel">
            {tab === 'funil' && <Funnel onOpen={openContact} />}
            {tab === 'contatos' && <Contacts onOpen={openContact} />}
            {tab === 'captacao' && <Capture onEdit={(id) => go('captacao', { form: id })} />}
            {tab === 'automacoes' && <Automations />}
          </div>
        </>
      )}
      <ContactSheet id={contactId} onClose={() => go(tab)} />
      <NewContactDialog open={adding} onOpenChange={setAdding} />
    </>
  )
}
