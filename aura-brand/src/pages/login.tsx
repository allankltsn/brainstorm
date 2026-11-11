import { CheckCircle2, Lock, RefreshCw } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { OtpInput, type OtpStatus } from '@/components/affect/otp-input'
import { TextField } from '@/components/affect/text-field'
import { Brand } from '@/components/app-shell'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Brand className="text-xl" />
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</div>
        <p className="text-xs text-muted-foreground">Protótipo de testes. Todos os dados são fictícios.</p>
      </div>
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-12 text-zinc-50 lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden="true" className="absolute -top-40 -right-40 size-[36rem] rounded-full bg-primary/50 blur-[120px]" />
        <div aria-hidden="true" className="absolute -bottom-56 -left-32 size-[30rem] rounded-full bg-primary/25 blur-[120px]" />
        <div className="relative max-w-md">
          <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance">Sua marca, do briefing à venda.</h2>
          <p className="mt-4 text-base text-zinc-300">Brand kit, conteúdo, captação e atendimento num lugar só.</p>
          <ul className="mt-8 grid gap-3 text-sm text-zinc-200">
            {[
              [CheckCircle2, 'A IA sugere, você aprova antes de publicar'],
              [Lock, 'Seus dados protegidos, como manda a LGPD'],
              [RefreshCw, 'Cancele a assinatura quando quiser'],
            ].map(([Icon, text]) => (
              <li key={text as string} className="flex items-center gap-3">
                <Icon className="size-4.5 text-zinc-400" />
                {text as string}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

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
          <Link to="/em-migracao" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
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
            setPassword('aurabrand123')
            setErrors({})
          }}
        >
          Preencher com a conta de teste
        </button>
      </form>
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link to="/verificar-email" className="font-medium text-brand-text underline-offset-4 hover:underline">
          Criar conta da empresa
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
