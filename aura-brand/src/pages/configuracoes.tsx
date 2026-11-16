import { Monitor, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { CHANNELS, useContent, type NetworkState } from '@/lib/content'
import { AI_CREDITS, session } from '@/lib/data'
import { useTheme, type Theme } from '@/lib/theme'
import { useTab } from '@/lib/use-tab'
import { Progress } from '@/components/ui/progress'
import { Pill } from '@/components/page'

const TABS = ['dados', 'redes', 'aparencia', 'avisos', 'assinatura', 'privacidade'] as const
type Tab = (typeof TABS)[number]

const NET_LABEL: Record<NetworkState, string> = { conectada: 'Conectada', expirada: 'Conexão expirada', desconectada: 'Não conectada' }
const NET_TONE = { conectada: 'success', expirada: 'warning', desconectada: 'neutral' } as const

/* Contas onde os posts aprovados são publicados. */
function Networks() {
  const { networks, connect, disconnect, scheduled, failed } = useContent()
  return (
    <Section title="Redes" description="As contas onde os posts aprovados são publicados. A Aura nunca publica sem a sua aprovação.">
      <ul className="-mx-2 divide-y">
        {CHANNELS.map((c) => {
          const n = networks[c.value]
          const waiting = [...scheduled, ...failed].filter((i) => i.channel === c.value).length
          return (
            <li key={c.value} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 px-2 py-3.5">
              <div className="min-w-0 flex-1 basis-56">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                  {c.label}
                  <Pill tone={NET_TONE[n.state]}>{NET_LABEL[n.state]}</Pill>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {n.state === 'conectada' && `Publicando como ${n.account}.`}
                  {n.state === 'expirada' && `A autorização de ${n.account} venceu. Conecte de novo para voltar a publicar.`}
                  {n.state === 'desconectada' && 'Conecte para publicar os posts desta rede.'}
                  {n.state !== 'conectada' && waiting > 0 && ` ${waiting === 1 ? '1 post espera' : `${waiting} posts esperam`} esta conexão.`}
                </p>
              </div>
              {n.state === 'conectada' ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    disconnect(c.value)
                    toast(`${c.label} desconectado`, { description: 'Os posts agendados desta rede não saem até você conectar de novo.', action: { label: 'Desfazer', onClick: () => connect(c.value) } })
                  }}
                >
                  Desconectar
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    connect(c.value)
                    toast.success(`${c.label} conectado`, { description: waiting > 0 ? 'Os posts que não saíram estão na Agenda, prontos para publicar.' : undefined })
                  }}
                >
                  {n.state === 'expirada' ? `Conectar ${c.label} de novo` : `Conectar ${c.label}`}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">Protótipo: a conexão é simulada. No produto, este botão abre a tela de autorização da própria rede.</p>
    </Section>
  )
}

export function Configuracoes() {
  const me = session
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useTab<Tab>(TABS)
  const [saving, setSaving] = useState(false)
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configurações" description="Seus dados, as redes conectadas, a aparência do app e os avisos que você recebe." />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções das configurações"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'dados', label: 'Meus dados', controls: 'painel-config' },
          { value: 'redes', label: 'Redes', controls: 'painel-config' },
          { value: 'aparencia', label: 'Aparência', controls: 'painel-config' },
          { value: 'avisos', label: 'Avisos', controls: 'painel-config' },
          { value: 'assinatura', label: 'Assinatura', controls: 'painel-config' },
          { value: 'privacidade', label: 'Privacidade e IA', controls: 'painel-config' },
        ]}
      />
      <div id="painel-config" role="tabpanel">
        {tab === 'dados' && (
          <Section title="Meus dados" description="Usados para entrar e para falar com você.">
            <form
              className="grid gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                setSaving(true)
                setTimeout(() => {
                  setSaving(false)
                  toast.success('Dados salvos')
                }, 800)
              }}
            >
              <TextField label="Nome completo" defaultValue={me.name} autoComplete="name" />
              <TextField label="E-mail" type="email" defaultValue={me.email} readOnly copyable hint="Para trocar o e-mail, fale com o suporte." />
              <TextField label="Celular" optional type="tel" defaultValue="(11) 90000-0000" autoComplete="tel" />
              <div className="flex justify-end">
                <Button type="submit" loading={saving}>
                  {saving ? 'Salvando' : 'Salvar'}
                </Button>
              </div>
            </form>
          </Section>
        )}
        {tab === 'redes' && <Networks />}
        {tab === 'aparencia' && (
          <Section title="Tema" description="Vale só para este aparelho.">
            <SegmentedControl<Theme>
              aria-label="Tema do aplicativo"
              fullWidth
              value={theme}
              onChange={setTheme}
              options={[
                { value: 'light', label: 'Claro', icon: <Sun className="size-4" /> },
                { value: 'dark', label: 'Escuro', icon: <Moon className="size-4" /> },
                { value: 'system', label: 'Igual ao aparelho', icon: <Monitor className="size-4" /> },
              ]}
            />
          </Section>
        )}
        {tab === 'avisos' && (
          <Section title="Avisos por e-mail" description="As mudanças valem na hora.">
            <div className="grid gap-5">
              <Switch placement="end" defaultChecked label="Aprovações" description="Quando a Aura deixa um rascunho esperando você." />
              <Switch placement="end" defaultChecked label="Leads" description="Quando chega um contato novo por formulário ou mensagem." />
              <Switch placement="end" label="Novidades" description="Dicas e novos recursos do aura-brand." />
              <Switch placement="end" checked disabled readOnly label="Segurança" description="Protegem sua conta, por isso não dá para desligar." />
            </div>
          </Section>
        )}
        {tab === 'assinatura' && (
          <Section title="Plano Pro" description="Próxima cobrança em 03/12/2026, de R$ 89,90." action={<Pill tone="success">Ativa</Pill>}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span>Créditos de IA no mês</span>
              <span className="text-muted-foreground">{AI_CREDITS.used} de {AI_CREDITS.total.toLocaleString('pt-BR')}</span>
            </div>
            <Progress value={(AI_CREDITS.used / AI_CREDITS.total) * 100} className="h-2" aria-label={`${AI_CREDITS.used} de ${AI_CREDITS.total} créditos usados`} />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button variant="ghost" onClick={() => toast('Abrindo cancelamento')}>
                Cancelar assinatura
              </Button>
              <Button variant="secondary" onClick={() => toast('Abrindo formas de pagamento')}>
                Trocar cartão
              </Button>
              <Button onClick={() => toast('Abrindo os planos')}>Mudar de plano</Button>
            </div>
          </Section>
        )}
        {tab === 'privacidade' && (
          <Section title="Privacidade e inteligência artificial" description="Você decide o que a Aura pode usar.">
            <div className="grid gap-5">
              <Switch placement="end" defaultChecked label="Sugestões de conteúdo com IA" description="A Aura monta rascunhos. Nada é publicado sem você aprovar." />
              <Switch placement="end" defaultChecked label="Usar histórico de conversas" description="Só de contatos que consentiram com o uso dos dados (LGPD)." />
              <Switch placement="end" label="Conversa por voz" description="O microfone só liga quando você toca no botão, a cada conversa." />
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}
