"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormLabel,
} from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.86-.08-1.68-.22-2.47H12v4.68h6.47a5.53 5.53 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.57-5.17 3.57-8.85Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.62H1.27a12 12 0 0 0 0 10.76l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm",
        className
      )}
    >
      <Sparkles className="size-5" />
    </span>
  )
}

function LoginScreen({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="login-screen"
      className={cn(
        "grid min-h-screen w-full lg:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* Brand panel — hidden on < lg */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-muted p-10 lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent"
        />
        <div className="relative flex items-center gap-3">
          <BrandMark />
          <span className="font-heading text-lg font-semibold">aura ui</span>
        </div>
        <div className="relative max-w-sm space-y-4">
          <h2 className="font-heading text-2xl leading-tight font-semibold text-balance">
            Interfaces que fluem com a sua equipe.
          </h2>
          <p className="text-sm text-muted-foreground">
            Um kit coeso de componentes acessíveis para criar produtos bonitos
            em minutos, não em semanas.
          </p>
        </div>
        <figure className="relative max-w-sm space-y-3 border-l-2 border-primary/40 pl-4">
          <blockquote className="text-sm text-muted-foreground italic">
            &ldquo;Migramos todo o painel para o aura ui e economizamos semanas
            de trabalho de design.&rdquo;
          </blockquote>
          <figcaption className="text-xs font-medium text-foreground">
            Marina Costa
            <span className="font-normal text-muted-foreground">
              {" "}
              · Head de Produto, Nuvora
            </span>
          </figcaption>
        </figure>
      </aside>

      {/* Login card */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-sm [--card-spacing:--spacing(5)]">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex justify-center lg:hidden">
              <BrandMark />
            </div>
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription>
              Acesse sua conta para continuar.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <form className="flex flex-col gap-4">
              <FormField>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="voce@exemplo.com.br"
                    autoComplete="email"
                  />
                </FormControl>
              </FormField>

              <FormField>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </FormControl>
              </FormField>

              <div className="flex items-center justify-between gap-2">
                <Label className="group/field-label gap-2 font-normal">
                  <Checkbox defaultChecked />
                  Lembrar de mim
                </Label>
                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Entrar
              </Button>
            </form>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
            >
              <GoogleIcon className="size-4" />
              Continuar com Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem conta?{" "}
              <a
                href="#"
                className="font-medium text-primary hover:underline"
              >
                Criar conta
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export { LoginScreen }
