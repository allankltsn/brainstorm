import { MailCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/affect/button'
import { TextField } from '@/components/affect/text-field'
import { AuthLayout } from '@/components/auth-layout'
import { DemoBadge } from '@/components/demo-badge'
import { maskEmail } from '@/lib/data'
import { DEMO } from '@/lib/demo'
import { focusFirstInvalid } from '@/lib/focus-invalid'
import { useTimers } from '@/lib/use-timers'

const linkClass = 'font-medium text-brand-text underline-offset-4 hover:underline'

export function EsqueciSenha() {
  const later = useTimers()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return
    const form = e.currentTarget
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Digite um e-mail válido, como nome@aura.example.')
      return focusFirstInvalid(form)
    }
    setError(undefined)
    setLoading(true)
    later(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  if (sent)
    return (
      <AuthLayout>
        <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
          <MailCheck className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Confira seu e-mail</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Se <strong className="font-medium text-foreground">{maskEmail(email)}</strong> tiver uma conta, enviamos um link para criar uma nova senha. Ele vale por 1 hora.
        </p>
        <div className="mt-8 grid gap-3">
          <Button variant="secondary" size="lg" onClick={() => toast.success('Link reenviado')}>
            Reenviar link
          </Button>
          {DEMO && (
            <>
              <Link to="/redefinir-senha" className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Abrir o link do e-mail (simulação)
                <DemoBadge />
              </Link>
              <Link to="/redefinir-senha?estado=expirado" className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Abrir um link expirado (simulação)
                <DemoBadge />
              </Link>
            </>
          )}
        </div>
        <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
          <Link to="/login" className={linkClass}>
            Voltar para entrar
          </Link>
        </p>
      </AuthLayout>
    )

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight">Esqueceu a senha?</h1>
      <p className="mt-1 text-sm text-muted-foreground">Digite o e-mail da conta. Enviamos um link para criar uma nova senha.</p>
      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        <TextField label="E-mail" type="email" size="lg" autoComplete="email" placeholder="nome@aura.example" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Enviando' : 'Enviar link'}
        </Button>
      </form>
      <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">
        <Link to="/login" className={linkClass}>
          Voltar para entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
