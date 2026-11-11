import { Clock, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/affect/button'
import { AuthLayout } from '@/components/auth-layout'

export function SessaoExpirada() {
  return (
    <AuthLayout>
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Clock className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Sua sessão expirou</h1>
      <p className="mt-1 text-sm text-muted-foreground">Por segurança, pedimos a senha de novo depois de um tempo sem uso. O que você estava escrevendo foi guardado como rascunho.</p>
      <Link to="/login" className="mt-8">
        <Button size="lg" className="w-full">
          Entrar de novo
        </Button>
      </Link>
    </AuthLayout>
  )
}

export function Manutencao() {
  return (
    <AuthLayout>
      <span className="flex size-12 items-center justify-center rounded-full bg-warning-soft text-warning">
        <Wrench className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">Estamos em manutenção</h1>
      <p className="mt-1 text-sm text-muted-foreground">O aura-fit volta por volta das 06:00. Seus dados estão seguros e nada foi perdido.</p>
      <Button size="lg" variant="secondary" className="mt-8 w-full" onClick={() => location.reload()}>
        Tentar de novo
      </Button>
    </AuthLayout>
  )
}
