import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { OtpInput, type OtpStatus } from '@/components/affect/otp-input'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Digite um e-mail válido, como nome@exemplo.com.br.'
    if (!password) next.password = 'Digite sua senha.'
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    setTimeout(() => navigate('/inicio'), 900)
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">Use o e-mail e a senha da sua conta.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        <TextField
          label="E-mail"
          type="email"
          size="lg"
          autoComplete="email"
          placeholder="nome@exemplo.com.br"
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
        <button
          type="button"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          onClick={() => {
            setEmail('carla.mendes@exemplo.com.br')
            setPassword('aurafit123')
            setErrors({})
          }}
        >
          Preencher com a conta de teste
        </button>
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
  const [status, setStatus] = useState<OtpStatus>('idle')
  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Confirme seu e-mail</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enviamos um código de 6 números para <strong className="font-medium text-foreground">ca***@exemplo.com.br</strong>.
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
            setStatus('verifying')
            setTimeout(() => {
              if (code === '000000') return setStatus('error')
              setStatus('success')
              setTimeout(() => navigate('/inicio'), 1100)
            }, 900)
          }}
        />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">No protótipo qualquer código funciona. Use 000000 para ver o erro.</p>
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-brand-text underline-offset-4 hover:underline">
          Voltar para entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
