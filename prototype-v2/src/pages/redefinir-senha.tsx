import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'
import { passwordRules } from '@/lib/auth'
import { focusFirstInvalid } from '@/lib/focus-invalid'
import { useTimers } from '@/lib/use-timers'
import { cn } from '@/lib/utils'

export function RedefinirSenha() {
  const navigate = useNavigate()
  const later = useTimers()
  const [params] = useSearchParams()
  // Simulação de link vencido ou inválido: #/redefinir-senha?estado=expirado (ou invalido)
  const linkState = params.get('estado')
  const [pwd, setPwd] = useState('')
  const [again, setAgain] = useState('')
  const [pwdError, setPwdError] = useState<string>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const rules = passwordRules(pwd)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    const form = e.currentTarget
    setPwdError(undefined)
    setError(undefined)
    if (!rules.every((r) => r.ok)) {
      setPwdError('A senha ainda não atende a todos os requisitos.')
      return focusFirstInvalid(form)
    }
    if (pwd !== again) {
      setError('As senhas não são iguais.')
      return focusFirstInvalid(form)
    }
    setLoading(true)
    later(() => navigate('/login', { replace: true, state: { passwordReset: true } }), 900)
  }

  if (linkState === 'expirado' || linkState === 'invalido')
    return (
      <AuthLayout>
        <h1 className="text-2xl font-semibold tracking-tight">{linkState === 'expirado' ? 'Este link expirou' : 'Este link não é válido'}</h1>
        <p role="alert" className="mt-1 text-sm text-muted-foreground">
          {linkState === 'expirado' ? 'O link para criar uma nova senha vale por 1 hora.' : 'O link está incompleto ou já foi usado.'} Peça um novo para continuar.
        </p>
        <div className="mt-8 grid gap-3">
          <Link to="/esqueci-senha" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
            Pedir um novo link
          </Link>
        </div>
        <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
          <Link to="/login" className="font-medium text-brand-text underline-offset-4 hover:underline">
            Voltar para entrar
          </Link>
        </p>
      </AuthLayout>
    )

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Criar nova senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">Escolha uma senha que você não use em outros lugares.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        <TextField label="Nova senha" type="password" size="lg" autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} error={pwdError} />
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
