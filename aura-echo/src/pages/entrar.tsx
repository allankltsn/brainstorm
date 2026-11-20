import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/* Auth cosmético: o protótipo não valida nada; qualquer envio entra no portal. */
function AuthLayout({ titulo, children, rodape }: { titulo: string; children: ReactNode; rodape: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-12">
        <Link to="/" className="mb-8 self-start">
          <Brand />
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
        {children}
        <p className="mt-6 text-sm text-muted-foreground">{rodape}</p>
      </div>
    </div>
  )
}

export function Entrar() {
  const navigate = useNavigate()
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    navigate('/app/inicio')
  }
  return (
    <AuthLayout
      titulo="Entrar na sua conta"
      rodape={
        <>
          Ainda não tem conta? <Link to="/criar-conta" className="font-medium text-primary hover:underline">Criar conta</Link>
        </>
      }
    >
      <form onSubmit={enviar} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@empresa.com.br" autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full">Entrar</Button>
      </form>
    </AuthLayout>
  )
}

export function CriarConta() {
  const navigate = useNavigate()
  const enviar = (e: FormEvent) => {
    e.preventDefault()
    navigate('/app/inicio')
  }
  return (
    <AuthLayout
      titulo="Criar sua conta Aura"
      rodape={
        <>
          Já tem conta? <Link to="/entrar" className="font-medium text-primary hover:underline">Entrar</Link>
        </>
      }
    >
      <form onSubmit={enviar} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" placeholder="Seu nome" autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="voce@empresa.com.br" autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" placeholder="Crie uma senha" autoComplete="new-password" />
        </div>
        <Button type="submit" className="w-full">Criar conta</Button>
      </form>
    </AuthLayout>
  )
}
