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

type Tab = 'dados' | 'aparencia' | 'avisos'

export function Configuracoes() {
  const { role } = useRole()
  const me = sessions[role]
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState<Tab>('dados')
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
      </div>
    </div>
  )
}
