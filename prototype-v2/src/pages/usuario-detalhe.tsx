import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { Select } from '@/components/affect/select'
import { PageHeader, Person, Pill, Section } from '@/components/page'
import { accounts } from '@/lib/billing'
import { NaoEncontrada } from '@/pages/nao-encontrada'

export function UsuarioDetalhe() {
  const { id } = useParams()
  const a = accounts.find((x) => x.id === id)
  const [role, setRole] = useState<string | null>(a?.role ?? null)
  if (!a) return <NaoEncontrada />
  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/usuarios" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Usuários
      </Link>
      <PageHeader
        title={<Person name={a.name} sub={a.email} />}
        actions={<Pill tone={a.status === 'ativo' ? 'success' : a.status === 'bloqueado' ? 'danger' : 'neutral'}>{a.status === 'ativo' ? 'Ativo' : a.status === 'bloqueado' ? 'Bloqueado' : 'Convite enviado'}</Pill>}
      />
      <div className="grid gap-6">
        <Section title="Conta">
          <dl className="grid gap-3 text-sm">
            {[
              ['Na plataforma desde', a.since],
              ['Plano', a.plan ?? 'Não se aplica'],
              ['Último acesso', a.status === 'convidado' ? 'Nunca' : 'Hoje, 08:12'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>
        <Section title="Perfil de acesso" description="Define o que a pessoa pode ver e fazer." action={<Link to="/usuarios/permissoes" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">Ver permissões</Link>}>
          <div className="flex flex-wrap items-end gap-3">
            <Select
              aria-label="Perfil de acesso"
              className="w-52"
              value={role}
              onChange={setRole}
              options={[
                { value: 'personal', label: 'Personal' },
                { value: 'aluno', label: 'Aluno' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
            <Button variant="secondary" disabled={role === a.role} onClick={() => toast.success('Perfil atualizado')}>
              Salvar perfil
            </Button>
          </div>
        </Section>
        <Section title="Segurança">
          <Button variant="secondary" icon={<KeyRound />} onClick={() => toast.success('Link para criar nova senha enviado', { description: a.email })}>
            Enviar link de nova senha
          </Button>
        </Section>
      </div>
    </div>
  )
}
