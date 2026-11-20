import { ArrowLeft, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Select } from '@/components/affect/select'
import { TextArea } from '@/components/affect/text-area'
import { TextField } from '@/components/affect/text-field'
import { ThinkingLoader } from '@/components/affect/thinking-loader'
import { brandName } from '@/components/brand-preview'
import { Pill, Section } from '@/components/page'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useBrand } from '@/lib/brand'
import { whenLabel } from '@/lib/content'
import { audienceOf, AUDIENCES, suggestCampaign, TODAY, useCrm, type Audience, type Campaign } from '@/lib/crm'
import { cn } from '@/lib/utils'

/* Campanhas de e-mail e WhatsApp: aba do Atendimento. */
const CAMPAIGN_LABEL: Record<Campaign['status'], string> = { rascunho: 'Rascunho', agendada: 'Agendada', enviada: 'Enviada' }
const CAMPAIGN_TONE = { rascunho: 'neutral', agendada: 'brand', enviada: 'success' } as const
const pct = (n: number, of: number) => (of ? `${Math.round((n / of) * 100)}%` : 'sem dados')
/* Campanha recém-enviada ainda não tem leitura: mostra "aguardando" em vez de 0%. */
const fresh = (g: Campaign) => g.sent > 0 && g.opened + g.clicked + g.replied === 0
export const EMPTY_CAMPAIGN: Campaign = { id: '', name: '', channel: 'email', audience: 'todos', subject: '', body: '', status: 'rascunho', when: `${TODAY}T15:00`, sent: 0, opened: 0, clicked: 0, replied: 0 }

export function CampaignEditor({ initial, onDone }: { initial: Campaign; onDone: () => void }) {
  const { kit } = useBrand()
  const { contacts, deals, campaigns, saveCampaign, removeCampaign, sendCampaign, restore, snapshot } = useCrm()
  // campanha nova ganha o id uma vez só, quando a tela abre
  const [g, setG] = useState(() => (initial.id ? initial : { ...initial, id: `g${Date.now().toString(36)}` }))
  const [tried, setTried] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const set = (p: Partial<Campaign>) => setG((cur) => ({ ...cur, ...p }))
  const isNew = !campaigns.some((x) => x.id === g.id)
  const sent = g.status === 'enviada'
  const { reach, blocked } = audienceOf(contacts, deals, g.audience)
  const past = g.when < `${TODAY}T10:00`
  const missing = { name: !g.name.trim(), subject: g.channel === 'email' && !g.subject.trim(), body: !g.body.trim() }
  const invalid = Object.values(missing).some(Boolean)
  const limit = g.channel === 'whatsapp' ? 600 : 2000

  if (sent)
    return (
      <Section title={g.name} description={`Enviada por ${g.channel === 'email' ? 'e-mail' : 'WhatsApp'} em ${whenLabel(g.when)} para ${g.sent} ${g.sent === 1 ? 'contato' : 'contatos'}.`} action={<Pill tone="success">Enviada</Pill>}>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Enviadas', String(g.sent)],
            ['Abertas', fresh(g) ? 'Aguardando' : pct(g.opened, g.sent)],
            ['Cliques', fresh(g) ? 'Aguardando' : pct(g.clicked, g.sent)],
            ['Respostas', fresh(g) ? 'Aguardando' : pct(g.replied, g.sent)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border p-3">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        {fresh(g) && <p className="mt-3 text-xs text-muted-foreground">Os números de abertura e clique aparecem conforme as pessoas leem.</p>}
        {g.subject && <p className="mt-5 text-sm font-medium">{g.subject}</p>}
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{g.body}</p>
        <div className="mt-5 flex justify-end border-t pt-4">
          <Button variant="secondary" onClick={onDone}>
            Voltar para as campanhas
          </Button>
        </div>
      </Section>
    )

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-5">
        <Section title={isNew ? 'Nova campanha' : g.name} description="Uma mensagem para vários contatos de uma vez. Nada sai sem você confirmar." className="min-w-0 lg:col-span-3">
          <form
            className="grid gap-5"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              setTried(true)
              if (invalid || past) return
              saveCampaign({ ...g, status: 'agendada' })
              toast.success(`Campanha agendada para ${whenLabel(g.when)}`)
              onDone()
            }}
          >
            <TextField label="Nome da campanha" hint="Só você vê." value={g.name} onChange={(e) => set({ name: e.target.value })} maxLength={60} error={tried && missing.name ? 'Dê um nome à campanha.' : undefined} />
            <div className="grid gap-2">
              <span id="canal-label" className="text-sm font-medium">
                Canal
              </span>
              <SegmentedControl<Campaign['channel']>
                aria-labelledby="canal-label"
                fullWidth
                value={g.channel}
                onChange={(channel) => set({ channel })}
                options={[
                  { value: 'email', label: 'E-mail' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                ]}
              />
            </div>
            <Select label="Para quem" options={AUDIENCES} value={g.audience} onChange={(v) => set({ audience: v as Audience })} hint={`${reach.length} ${reach.length === 1 ? 'contato vai receber' : 'contatos vão receber'}.${blocked ? ` ${blocked} ${blocked === 1 ? 'fica de fora por não ter dado' : 'ficam de fora por não terem dado'} consentimento.` : ''}`} />
            {thinking ? (
              <ThinkingLoader phases={['Lendo o tom de voz', 'Escrevendo a mensagem']} interval={600} />
            ) : (
              <>
                {g.channel === 'email' && <TextField label="Assunto" value={g.subject} onChange={(e) => set({ subject: e.target.value })} maxLength={50} counter hint="Até 50 caracteres aparecem inteiros no celular." error={tried && missing.subject ? 'Escreva o assunto do e-mail.' : undefined} />}
                <TextArea label="Mensagem" minRows={5} maxRows={14} maxLength={limit} counter value={g.body} onChange={(e) => set({ body: e.target.value })} error={tried && missing.body ? 'Escreva a mensagem.' : undefined} />
                <div>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    icon={<Sparkles />}
                    onClick={() => {
                      setThinking(true)
                      setTimeout(() => {
                        set(suggestCampaign(g.name, g.channel, brandName(kit)))
                        setThinking(false)
                        toast('A Aura escreveu um rascunho', { description: 'Revise o texto antes de agendar. Usou 5 créditos de IA.' })
                      }, 1300)
                    }}
                  >
                    {g.body.trim() ? 'Pedir outro texto à Aura' : 'Pedir um texto à Aura'}
                  </Button>
                </div>
              </>
            )}
            <TextField label="Enviar em" type="datetime-local" value={g.when} onChange={(e) => set({ when: e.target.value })} error={tried && past ? 'Escolha uma data e hora no futuro.' : undefined} className="max-w-xs" />
            <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
              {!isNew && (
                <Button
                  type="button"
                  variant="ghost"
                  className="mr-auto"
                  onClick={() => {
                    const before = snapshot()
                    removeCampaign(g.id)
                    onDone()
                    toast(`"${g.name}" foi excluída`, { action: { label: 'Desfazer', onClick: () => restore(before) } })
                  }}
                >
                  Excluir campanha
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!g.name.trim()) return setTried(true)
                  saveCampaign({ ...g, status: 'rascunho' })
                  toast('Rascunho salvo')
                  onDone()
                }}
              >
                Salvar rascunho
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={reach.length === 0}
                onClick={() => {
                  setTried(true)
                  if (!invalid) setConfirm(true)
                }}
              >
                Enviar agora
              </Button>
              <Button type="submit" disabled={reach.length === 0}>
                Agendar envio
              </Button>
            </div>
            {reach.length === 0 && (
              <p role="alert" className="text-sm text-destructive">
                Ninguém neste público pode receber a campanha. Escolha outro público ou registre o consentimento dos contatos.
              </p>
            )}
          </form>
        </Section>
        <div className="min-w-0 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold">Como chega</h2>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">
              {g.channel === 'email' ? 'E-mail' : 'WhatsApp'} de {brandName(kit)}
            </p>
            {g.channel === 'email' && <p className="mt-2 text-sm font-semibold">{g.subject || 'Assunto do e-mail'}</p>}
            <p className={cn('mt-2 text-sm leading-relaxed whitespace-pre-line', g.channel === 'whatsapp' && 'rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5')}>{g.body || 'A mensagem aparece aqui.'}</p>
            {g.channel === 'email' && <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Você recebe este e-mail porque aceitou mensagens de {brandName(kit)}. Sair da lista.</p>}
          </div>
        </div>
      </div>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Enviar agora para {reach.length} {reach.length === 1 ? 'contato' : 'contatos'}?
            </DialogTitle>
            <DialogDescription>
              "{g.name}" sai por {g.channel === 'email' ? 'e-mail' : 'WhatsApp'} na hora. Depois de enviada, não dá para cancelar nem editar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Continuar editando
            </Button>
            <Button
              onClick={() => {
                const n = sendCampaign(g)
                toast.success(`Campanha enviada para ${n} ${n === 1 ? 'contato' : 'contatos'}`)
                setConfirm(false)
                onDone()
              }}
            >
              Enviar campanha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function Campaigns({ onOpen }: { onOpen: (id: string) => void }) {
  const { campaigns, contacts, deals } = useCrm()
  return (
    <Section
      title="Campanhas"
      description="E-mail e WhatsApp para vários contatos. Só recebe quem aceitou mensagens da marca."
    >
      {campaigns.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma campanha ainda. Crie a primeira para falar com vários contatos de uma vez.</p>
      ) : (
        <ul className="-mx-2 divide-y">
          {campaigns.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
              <div className="min-w-0 flex-1 basis-64">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {g.name}
                  <Pill>{g.channel === 'email' ? 'E-mail' : 'WhatsApp'}</Pill>
                  <Pill tone={CAMPAIGN_TONE[g.status]}>{CAMPAIGN_LABEL[g.status]}</Pill>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                  {g.status === 'enviada' && (fresh(g) ? `${g.sent} enviadas em ${whenLabel(g.when)}. Aguardando as primeiras aberturas.` : `${g.sent} enviadas em ${whenLabel(g.when)}. ${pct(g.opened, g.sent)} abertas, ${pct(g.clicked, g.sent)} cliques, ${pct(g.replied, g.sent)} respostas.`)}
                  {g.status === 'agendada' && `Sai em ${whenLabel(g.when)} para ${audienceOf(contacts, deals, g.audience).reach.length} contatos.`}
                  {g.status === 'rascunho' && (g.body.trim() ? 'Falta agendar.' : 'Falta escrever a mensagem.')}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => onOpen(g.id)}>
                {g.status === 'enviada' ? 'Ver resultado' : 'Editar'}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}


/* Lista de campanhas ou o editor, conforme o ?campanha= da URL. */
export function CampaignsPanel({ campaignId, onOpen, onClose }: { campaignId: string | null; onOpen: (id: string) => void; onClose: () => void }) {
  const { campaigns } = useCrm()
  const editing = campaignId ? (campaigns.find((g) => g.id === campaignId) ?? EMPTY_CAMPAIGN) : null
  if (!editing) return <Campaigns onOpen={onOpen} />
  return (
    <>
      <button type="button" onClick={onClose} className="mb-4 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" />
        Voltar para as campanhas
      </button>
      <CampaignEditor key={campaignId} initial={editing} onDone={onClose} />
    </>
  )
}
