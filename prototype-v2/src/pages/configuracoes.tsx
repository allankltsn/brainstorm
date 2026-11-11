import { Monitor, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { Switch } from '@/components/affect/switch'
import { TextField } from '@/components/affect/text-field'
import { PageHeader, Section } from '@/components/page'
import { sessions } from '@/lib/data'
import { useRole } from '@/lib/role'
import { useTheme, type Theme } from '@/lib/theme'
import { useTab } from '@/lib/use-tab'
import { Progress } from '@/components/ui/progress'
import { Pill } from '@/components/page'

const TABS = ['dados', 'aparencia', 'avisos', 'assinatura', 'privacidade'] as const
type Tab = (typeof TABS)[number]

export function Configuracoes() {
  const { role } = useRole()
  const me = sessions[role]
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useTab<Tab>(TABS)
  const [saving, setSaving] = useState(false)
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Configurações" description="Seus dados, a aparência do app e os avisos que você recebe." />
      <SegmentedControl<Tab>
        variant="underline"
        kind="tabs"
        aria-label="Seções das configurações"
        value={tab}
        onChange={setTab}
        className="mb-6"
        options={[
          { value: 'dados', label: 'Meus dados', controls: 'painel-config' },
          { value: 'aparencia', label: 'Aparência', controls: 'painel-config' },
          { value: 'avisos', label: 'Avisos', controls: 'painel-config' },
          ...(role === 'personal' ? [{ value: 'assinatura' as const, label: 'Assinatura', controls: 'painel-config' }] : []),
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
              <Switch placement="end" defaultChecked label="Convites" description="Quando alguém aceita ou recusa um convite seu." />
              <Switch placement="end" defaultChecked label="Treinos" description="Quando um aluno conclui ou deixa de fazer um treino." />
              <Switch placement="end" label="Novidades" description="Dicas e novos recursos do aura-fit." />
              <Switch placement="end" checked disabled readOnly label="Segurança" description="Protegem sua conta, por isso não dá para desligar." />
            </div>
          </Section>
        )}
        {tab === 'assinatura' && (
          <Section title="Plano Pro" description="Próxima cobrança em 03/11/2026, de R$ 49,90." action={<Pill tone="success">Ativa</Pill>}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span>Alunos ativos</span>
              <span className="text-muted-foreground">18 de 30</span>
            </div>
            <Progress value={60} className="h-2" aria-label="18 de 30 vagas usadas" />
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
              <Switch placement="end" defaultChecked label="Sugestões de treino com IA" description="A Aura monta rascunhos. Nada vai para o aluno sem você aprovar." />
              <Switch placement="end" defaultChecked label="Usar histórico de treinos" description="Séries, cargas e frequência dos alunos que liberaram os dados." />
              <Switch placement="end" label="Conversa por voz" description="O microfone só liga quando você toca no botão, a cada conversa." />
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}
