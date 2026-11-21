"use client"

import * as React from "react"
import {
  Blocks,
  Check,
  Component,
  Moon,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  TestTube,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StatCard } from "@/components/ui/stat-card"

const NAV_LINKS = ["Componentes", "Preços", "Docs"]

const FEATURES = [
  {
    icon: Component,
    title: "136 componentes",
    description:
      "De botões a tabelas e comandos — tudo acessível, tipado e pronto para colar no seu app.",
  },
  {
    icon: Moon,
    title: "Escuro por padrão",
    description:
      "Tema escuro como base e claro de brinde. Troque com uma classe, sem reescrever estilos.",
  },
  {
    icon: Paintbrush,
    title: "Tokens semânticos",
    description:
      "Cores por significado (background, card, primary). Rebranding é só mexer nas variáveis.",
  },
  {
    icon: Zap,
    title: "Zero runtime",
    description:
      "Só React e Tailwind. Nada de CSS-in-JS pesando no bundle ou atrasando a primeira pintura.",
  },
  {
    icon: ShieldCheck,
    title: "Acessível de fábrica",
    description:
      "Construído sobre Radix: foco, teclado e leitores de tela cuidados em cada primitivo.",
  },
  {
    icon: TestTube,
    title: "212 testes",
    description:
      "Cada componente coberto. Atualize com a confiança de que nada quebrou silenciosamente.",
  },
]

const METRICS = [
  { label: "Componentes", value: "136" },
  { label: "Temas", value: "2" },
  { label: "Testes", value: "212" },
  { label: "Dependências extras", value: "0" },
]

const PLANS = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    description: "Para projetos pessoais e protótipos.",
    features: ["Todos os 136 componentes", "Tema claro e escuro", "Licença MIT"],
    cta: "Começar",
    variant: "outline" as const,
    featured: false,
  },
  {
    name: "Pro",
    price: "R$ 49",
    period: "por mês",
    description: "Para quem envia produto toda semana.",
    features: [
      "Tudo do Grátis",
      "Blocos compostos prontos",
      "Figma sincronizado",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    variant: "default" as const,
    featured: true,
  },
  {
    name: "Equipe",
    price: "R$ 199",
    period: "por mês",
    description: "Para times com um design system vivo.",
    features: [
      "Tudo do Pro",
      "Tokens da marca",
      "Até 20 assentos",
      "Onboarding dedicado",
    ],
    cta: "Falar com vendas",
    variant: "outline" as const,
    featured: false,
  },
]

const TESTIMONIALS = [
  {
    quote:
      "Montei o painel inteiro em uma tarde. Os tokens semânticos deixaram o rebranding trivial.",
    name: "Marina Alves",
    role: "Eng. Frontend, Nuvemzinha",
    initials: "MA",
  },
  {
    quote:
      "O modo escuro já vem redondo. Finalmente um kit que não trata dark como uma gambiarra.",
    name: "Rafael Costa",
    role: "Product Designer, Órbita",
    initials: "RC",
  },
  {
    quote:
      "212 testes me dão coragem de atualizar sem medo. Virou padrão em todos os nossos apps.",
    name: "Juliana Prado",
    role: "Tech Lead, Correnteza",
    initials: "JP",
  },
]

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className
      )}
    >
      <Sparkles className="size-4" />
    </span>
  )
}

function LandingScreen({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="landing-screen"
      className={cn("min-h-screen bg-background text-foreground", className)}
      {...props}
    >
      {/* 1. Top nav */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#" className="flex items-center gap-2">
            <BrandMark />
            <span className="font-heading text-base font-semibold">aura-ui</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="transition-colors hover:text-foreground">
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
            <Button size="sm">Começar agora</Button>
          </div>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div>
            <Badge variant="secondary">
              <Blocks className="size-3" />
              136 componentes
            </Badge>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              O design system que você não precisa manter
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground text-pretty">
              Componentes React acessíveis, tema escuro de fábrica e tokens
              semânticos. Cole no seu app e envie ainda hoje.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg">Começar agora</Button>
              <Button size="lg" variant="outline">
                Ver componentes
              </Button>
            </div>
          </div>

          {/* product-preview mock panel */}
          <Card className="gap-0 py-0 shadow-sm" aria-hidden="true">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-2 text-xs text-muted-foreground">preview.aura-ui.dev</span>
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-md bg-primary/20" />
                  <div className="h-2.5 w-24 rounded-full bg-muted-foreground/25" />
                </div>
                <Badge variant="outline">Ativo</Badge>
              </div>
              <div className="space-y-2 rounded-lg border border-border p-3">
                <div className="h-2.5 w-2/3 rounded-full bg-muted-foreground/25" />
                <div className="h-2.5 w-1/2 rounded-full bg-muted-foreground/15" />
                <div className="h-2.5 w-3/4 rounded-full bg-muted-foreground/15" />
              </div>
              <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-lg bg-primary/80" />
                <div className="h-8 w-20 rounded-lg border border-border" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Feature grid */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Tudo que um app precisa
            </h2>
            <p className="mt-3 text-muted-foreground">
              Primitivos cuidadosos que se compõem em telas inteiras sem atrito.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5">
                    <feature.icon />
                  </span>
                  <CardTitle className="mt-3">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Metrics strip */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <StatCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </section>

      {/* 5. Pricing */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Preço simples, sem surpresas
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comece de graça. Suba de plano quando o time crescer.
            </p>
          </div>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative",
                  plan.featured && "ring-2 ring-primary"
                )}
              >
                {plan.featured && (
                  <Badge className="absolute end-4 top-4">Recomendado</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-heading text-3xl font-semibold">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <Separator />
                  <ul className="space-y-2.5 text-sm">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.variant} className="w-full">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
            Quem usa, recomenda
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <Card key={item.name}>
                <CardContent className="flex h-full flex-col gap-4">
                  <p className="text-sm leading-relaxed text-pretty">
                    “{item.quote}”
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{item.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA band */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:py-24">
          <h2 className="font-heading text-2xl font-semibold text-balance sm:text-3xl">
            Pronto para enviar mais rápido?
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Instale o aura-ui e tenha telas inteiras funcionando em minutos.
          </p>
          <Button size="lg" variant="secondary">
            Começar agora
          </Button>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2">
                <BrandMark />
                <span className="font-heading text-base font-semibold">aura-ui</span>
              </a>
              <p className="max-w-xs text-sm text-muted-foreground">
                O design system escuro por padrão para apps React.
              </p>
            </div>
            <FooterColumn
              title="Produto"
              links={["Componentes", "Blocos", "Temas", "Preços"]}
            />
            <FooterColumn
              title="Recursos"
              links={["Docs", "Guia", "Changelog", "Status"]}
            />
            <FooterColumn
              title="Empresa"
              links={["Sobre", "Blog", "Contato", "Termos"]}
            />
          </div>
          <Separator className="my-8" />
          <p className="text-center text-xs text-muted-foreground">
            © 2026 aura-ui. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{title}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition-colors hover:text-foreground">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { LandingScreen }
