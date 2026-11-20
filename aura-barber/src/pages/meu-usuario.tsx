import { useState } from 'react'
import { PageHeader, Panel } from '@/components/layout'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { Switch } from '@/components/affect/switch'
import { SegmentedControl } from '@/components/affect/segmented-control'
import { useRole } from '@/lib/role'
import { useTheme } from '@/lib/theme'
import { getMe, getMySettings, updateUser, updateMySettings, userIdDaIdentidade } from '@/lib/api'
import type { User, UserSettings } from '@/lib/data'

export function MeuUsuario() {
  const { role, profId, clienteId } = useRole()
  const userId = userIdDaIdentidade(role, profId, clienteId)
  const user = userId ? getMe(userId) : undefined

  if (!userId || !user) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="Meu usuário" subtitle="Perfil e preferências." />
        <Panel className="p-5">
          <p className="text-sm text-muted-foreground">Não foi possível identificar o usuário atual.</p>
        </Panel>
      </div>
    )
  }
  // key={userId}: ao trocar de identidade, o form remonta já com os dados do novo usuário
  // (evita gravar o perfil de um usuário com os valores de outro).
  return <MeuUsuarioForm key={userId} userId={userId} user={user} settings={getMySettings(userId)} />
}

function MeuUsuarioForm({ userId, user, settings }: { userId: string; user: User; settings: UserSettings }) {
  const { setTheme } = useTheme()
  const [nome, setNome] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [theme, setThemePref] = useState<UserSettings['theme']>(settings.theme)
  const [locale, setLocale] = useState(settings.locale)
  const [nEmail, setNEmail] = useState(settings.notifyEmail)
  const [nPush, setNPush] = useState(settings.notifyPush)
  const [nWhats, setNWhats] = useState(settings.notifyWhatsapp)
  const [salvo, setSalvo] = useState(false)

  const mexeu = () => setSalvo(false)
  const salvar = () => {
    updateUser(userId, { name: nome.trim() || user.name, phone: phone.trim() || undefined })
    updateMySettings(userId, { theme, locale, notifyEmail: nEmail, notifyPush: nPush, notifyWhatsapp: nWhats })
    if (theme !== 'system') setTheme(theme)
    setSalvo(true)
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Meu usuário" subtitle="Perfil e preferências." />

      <Panel className="space-y-4 p-5">
        <p className="text-sm font-medium text-foreground">Perfil</p>
        <TextField label="Nome" value={nome} onChange={(e) => { setNome(e.target.value); mexeu() }} />
        <TextField label="Telefone" value={phone} onChange={(e) => { setPhone(e.target.value); mexeu() }} />
        <TextField label="E-mail" value={user.email} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Status da conta: <span className="capitalize">{user.status.toLowerCase()}</span>
          {user.emailVerified ? ' · e-mail verificado' : ' · e-mail não verificado'}
        </p>
      </Panel>

      <Panel className="mt-4 space-y-4 p-5">
        <p className="text-sm font-medium text-foreground">Preferências</p>
        <div>
          <p className="mb-1.5 text-sm text-muted-foreground">Tema</p>
          <SegmentedControl
            aria-label="Tema"
            value={theme}
            options={[
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
              { value: 'system', label: 'Sistema' },
            ]}
            onChange={(v) => { setThemePref(v as UserSettings['theme']); mexeu() }}
          />
        </div>
        <div>
          <p className="mb-1.5 text-sm text-muted-foreground">Idioma</p>
          <SegmentedControl
            aria-label="Idioma"
            value={locale}
            options={[
              { value: 'pt-BR', label: 'Português' },
              { value: 'en-US', label: 'English' },
            ]}
            onChange={(v) => { setLocale(v); mexeu() }}
          />
        </div>
        <div className="space-y-2 border-t pt-3">
          <Switch label="Notificações por e-mail" placement="end" checked={nEmail} onChange={(e) => { setNEmail(e.target.checked); mexeu() }} />
          <Switch label="Notificações push" placement="end" checked={nPush} onChange={(e) => { setNPush(e.target.checked); mexeu() }} />
          <Switch label="Notificações por WhatsApp" placement="end" checked={nWhats} onChange={(e) => { setNWhats(e.target.checked); mexeu() }} />
        </div>
      </Panel>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={salvar}>Salvar</Button>
        {salvo && <span className="text-sm text-muted-foreground">Salvo ✓</span>}
      </div>
    </div>
  )
}
