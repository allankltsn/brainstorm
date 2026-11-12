import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { Checkbox } from '@/components/affect/checkbox'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'
import { passwordRules } from '@/lib/auth'
import { DEMO_EMAIL } from '@/lib/demo'
import { focusFirstInvalid } from '@/lib/focus-invalid'
import { useTimers } from '@/lib/use-timers'

type Errors = Partial<Record<'name' | 'email' | 'pwd' | 'terms', string>>

export function Cadastro() {
  const navigate = useNavigate()
  const later = useTimers()
  const [f, setF] = useState({ name: '', email: '', pwd: '', terms: false })
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    const form = e.currentTarget
    const next: Errors = {}
    if (f.name.trim().split(/\s+/).length < 2) next.name = 'Digite nome e sobrenome.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) next.email = 'Digite um e-mail válido, como nome@aura.example.'
    else if (f.email === DEMO_EMAIL) next.email = 'Este e-mail já tem conta. Tente entrar.'
    if (!passwordRules(f.pwd).every((r) => r.ok)) next.pwd = 'Use 8 caracteres ou mais, com letra e número.'
    if (!f.terms) next.terms = 'Para continuar, aceite os termos de uso.'
    setErrors(next)
    if (Object.keys(next).length) return focusFirstInvalid(form)
    setLoading(true)
    later(() => navigate('/verificar-email', { state: { email: f.email } }), 900)
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Criar conta de personal</h1>
      <p className="mt-1 text-sm text-muted-foreground">O plano Starter é grátis e cabe até 5 alunos.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        <TextField label="Nome completo" size="lg" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={errors.name} />
        <TextField label="E-mail" type="email" size="lg" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={errors.email} />
        <TextField label="Senha" type="password" size="lg" autoComplete="new-password" hint="8 caracteres ou mais, com letra e número." value={f.pwd} onChange={(e) => setF({ ...f, pwd: e.target.value })} error={errors.pwd} />
        <Checkbox
          checked={f.terms}
          onChange={(e) => setF({ ...f, terms: e.target.checked })}
          error={errors.terms}
          label={
            <>
              Li e aceito os{' '}
              <Link to="/termos" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                termos de uso<span className="sr-only"> (abre em nova aba)</span>
              </Link>{' '}
              e a{' '}
              <Link to="/privacidade" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                política de privacidade<span className="sr-only"> (abre em nova aba)</span>
              </Link>
              .
            </>
          }
        />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Criando conta' : 'Criar conta'}
        </Button>
      </form>
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-brand-text underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
