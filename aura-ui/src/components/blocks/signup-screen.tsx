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
import { FormControl, FormField, FormLabel } from "@/components/ui/form-field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.71h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.89-1.74 2.99-4.3 2.99-7.28Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.61-2.42l-3.22-2.51c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.91a6 6 0 0 1 0-3.82V7.5H3.08a10 10 0 0 0 0 9l3.33-2.59Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.78.5 3.82 1.5l2.85-2.85A9.97 9.97 0 0 0 12 2a10 10 0 0 0-8.92 5.5l3.33 2.59C7.2 7.73 9.4 5.98 12 5.98Z"
      />
    </svg>
  )
}

function SignupScreen({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="signup-screen"
      className={cn(
        "grid min-h-screen bg-background text-foreground lg:grid-cols-2",
        className
      )}
      {...props}
    >
      {/* Brand panel — hidden on mobile, visible on lg */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
            <Sparkles className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            Aura
          </span>
        </div>
        <div className="relative space-y-3">
          <h2 className="font-heading text-3xl leading-tight font-semibold">
            Comece sua jornada com a gente
          </h2>
          <p className="max-w-sm text-sm text-primary-foreground/80">
            Crie sua conta em segundos e tenha tudo o que você precisa num só
            lugar, do seu jeito.
          </p>
        </div>
        <p className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Aura. Todos os direitos reservados.
        </p>
      </aside>

      {/* Form column */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mb-2 flex items-center justify-center gap-2 lg:hidden">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="font-heading text-base font-semibold">Aura</span>
            </div>
            <CardTitle className="text-xl">Criar conta</CardTitle>
            <CardDescription>
              Preencha seus dados para começar agora mesmo.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormField>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Maria Silva" autoComplete="name" />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="maria@exemplo.com.br"
                  autoComplete="email"
                />
              </FormControl>
            </FormField>

            <FormField>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Crie uma senha segura"
                  autoComplete="new-password"
                />
              </FormControl>
            </FormField>

            <Label className="group/field items-start gap-2.5 font-normal text-muted-foreground">
              <Checkbox defaultChecked className="mt-0.5" />
              <span className="text-sm leading-snug">
                Aceito os{" "}
                <a
                  href="#"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  termos de uso
                </a>{" "}
                e a política de privacidade.
              </span>
            </Label>

            <Button type="submit" className="w-full">
              Criar conta
            </Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">ou</span>
              <Separator className="flex-1" />
            </div>

            <Button type="button" variant="outline" className="w-full">
              <GoogleGlyph />
              Continuar com Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{" "}
              <a
                href="#"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Entrar
              </a>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export { SignupScreen }
