import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { OtpInput, type OtpStatus } from '@/components/affect/otp-input'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'
import { DemoBadge } from '@/components/demo-badge'
import { DEMO, DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/demo'
import { maskEmail } from '@/lib/data'
import { focusFirstInvalid } from '@/lib/focus-invalid'
import { useTimers } from '@/lib/use-timers'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const later = useTimers()
  const resetDone = (location.state as { passwordReset?: boolean } | null)?.passwordReset === true
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string>()
  const [loading, setLoading] = useState(false)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    const form = e.currentTarget
    const next: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Digite um e-mail válido, como nome@aura.example.'
    if (!password) next.password = 'Digite sua senha.'
    setErrors(next)
    setFormError(undefined)
    if (Object.keys(next).length) return focusFirstInvalid(form)
    setLoading(true)
    later(() => {
      // Na demonstração só a conta de teste entra; qualquer outra credencial vê o estado de erro.
      if (DEMO && (email !== DEMO_EMAIL || password !== DEMO_PASSWORD)) {
        setLoading(false)
        setFormError('E-mail ou senha incorretos. Confira os dados e tente de novo.')
        return
      }
      navigate('/inicio', { replace: true })
    }, 900)
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">Use o e-mail e a senha da sua conta.</p>
      {resetDone && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-success-soft p-3 text-sm text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          Senha alterada. Entre com a nova senha.
        </p>
      )}
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        {formError && (
          <p role="alert" className="rounded-lg border border-destructive/40 p-3 text-sm text-destructive">
            {formError}
          </p>
        )}
        <TextField
          label="E-mail"
          type="email"
          size="lg"
          autoComplete="email"
          placeholder="nome@aura.example"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <TextField
          label="Senha"
          type="password"
          size="lg"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <div className="-mt-1 text-right">
          <Link to="/esqueci-senha" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Entrando' : 'Entrar'}
        </Button>
        {DEMO && (
          <button
            type="button"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            onClick={() => {
              setEmail(DEMO_EMAIL)
              setPassword(DEMO_PASSWORD)
              setErrors({})
              setFormError(undefined)
            }}
          >
            Preencher com a conta de teste
            <DemoBadge />
          </button>
        )}
      </form>
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-brand-text underline-offset-4 hover:underline">
          Criar conta de personal
        </Link>
      </p>
    </AuthLayout>
  )
}

export function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const later = useTimers()
  const [status, setStatus] = useState<OtpStatus>('idle')
  const sentTo = (location.state as { email?: string } | null)?.email
  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Confirme seu e-mail</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enviamos um código de 6 números para{' '}
        {sentTo ? <strong className="font-medium text-foreground">{maskEmail(sentTo)}</strong> : 'o seu e-mail'}.
      </p>
      <div className="mt-8">
        <OtpInput
          length={6}
          separator
          autoFocus
          label="Código de verificação"
          status={status}
          errorMessage="Código incorreto. Confira e tente de novo."
          clearOnError
          successLabel="E-mail confirmado"
          resendIn={30}
          onResend={() => setStatus('idle')}
          onChange={() => status === 'error' && setStatus('idle')}
          onComplete={(code) => {
            if (status === 'verifying' || status === 'success') return
            setStatus('verifying')
            later(() => {
              if (code === '000000') return setStatus('error')
              setStatus('success')
              later(() => navigate('/inicio', { replace: true }), 1100)
            }, 900)
          }}
        />
      </div>
      {DEMO && (
        <p className="mt-6 text-xs text-muted-foreground">
          <DemoBadge />
          No protótipo qualquer código funciona. Use 000000 para ver o erro.
        </p>
      )}
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-brand-text underline-offset-4 hover:underline">
          Voltar para entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
