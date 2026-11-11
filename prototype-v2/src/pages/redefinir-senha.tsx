import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'
import { passwordRules } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function RedefinirSenha() {
  const navigate = useNavigate()
  const [pwd, setPwd] = useState('')
  const [again, setAgain] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const rules = passwordRules(pwd)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!rules.every((r) => r.ok)) return setError('A senha ainda não atende a todos os requisitos.')
    if (pwd !== again) return setError('As senhas não são iguais.')
    setError(undefined)
    setLoading(true)
    setTimeout(() => navigate('/login'), 900)
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Criar nova senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">Escolha uma senha que você não use em outros lugares.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        <TextField label="Nova senha" type="password" size="lg" autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        <ul className="-mt-2 grid gap-1 text-sm" aria-label="Requisitos da senha">
          {rules.map((r) => (
            <li key={r.label} className={cn('flex items-center gap-2', r.ok ? 'text-success' : 'text-muted-foreground')}>
              <CheckCircle2 className={cn('size-4', !r.ok && 'opacity-40')} />
              {r.label}
              <span className="sr-only">{r.ok ? ' (cumprido)' : ' (pendente)'}</span>
            </li>
          ))}
        </ul>
        <TextField label="Repita a nova senha" type="password" size="lg" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} error={error} />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Salvando' : 'Salvar nova senha'}
        </Button>
      </form>
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-brand-text underline-offset-4 hover:underline">
          Cancelar
        </Link>
      </p>
    </AuthLayout>
  )
}
