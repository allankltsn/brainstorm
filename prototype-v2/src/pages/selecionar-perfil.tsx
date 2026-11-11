import { ChevronRight, Dumbbell, ShieldCheck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/auth-layout'
import type { Role } from '@/lib/data'
import { useRole } from '@/lib/role'

const PROFILES: { role: Role; label: string; text: string; icon: React.ReactNode }[] = [
  { role: 'personal', label: 'Personal', text: 'Cuidar dos meus alunos e treinos.', icon: <Dumbbell /> },
  { role: 'aluno', label: 'Aluno', text: 'Ver e fazer meu treino.', icon: <User /> },
  { role: 'admin', label: 'Admin', text: 'Gerenciar a plataforma.', icon: <ShieldCheck /> },
]

export function SelecionarPerfil() {
  const navigate = useNavigate()
  const { setRole } = useRole()
  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Como você quer entrar?</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sua conta tem mais de um perfil. Dá para trocar depois, no menu do usuário.</p>
      <ul className="mt-8 grid gap-3">
        {PROFILES.map((p) => (
          <li key={p.role}>
            <button
              type="button"
              className="flex w-full items-center gap-4 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => {
                setRole(p.role)
                navigate('/inicio')
              }}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-text [&_svg]:size-5">{p.icon}</span>
              <span className="grid flex-1">
                <span className="text-sm font-medium">{p.label}</span>
                <span className="text-sm text-muted-foreground">{p.text}</span>
              </span>
              <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </AuthLayout>
  )
}
