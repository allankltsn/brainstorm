import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { SERVICES, SERVICE_TONE } from '@/lib/services'
import { cn } from '@/lib/utils'

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Brand />
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/entrar">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/criar-conta">Criar conta</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-55 blur-[90px] dark:opacity-35"
        style={{ background: 'conic-gradient(from 150deg, var(--svc-fit), var(--svc-vagas), var(--svc-barber), var(--svc-brand), var(--svc-fit))' }}
      />
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Um ecossistema, quatro serviços
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Todo o seu Aura em um só lugar
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Assine os serviços Aura que o seu negócio precisa — academia, barbearia, CRM e
            recrutamento — e acompanhe tudo por um único painel, com uma conta só.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/criar-conta">Criar conta grátis</Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToId('servicos')}>
              Conhecer os serviços
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Servicos() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <div className="max-w-xl">
        <h2 className="text-3xl font-semibold tracking-tight">O ecossistema Aura</h2>
        <p className="mt-3 text-muted-foreground">
          Cada serviço resolve uma frente do seu negócio. Assine só o que usar — e junte quando precisar.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => {
          const tone = SERVICE_TONE[s.id]
          const Icon = s.icon
          return (
            <article key={s.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <span className={cn('flex size-11 items-center justify-center rounded-xl', tone.bg, tone.text)}>
                <Icon className="size-5.5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.nome}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{s.tagline}</p>
              <button
                type="button"
                onClick={() => scrollToId('precos')}
                className={cn('mt-4 self-start text-sm font-medium hover:underline', tone.text)}
              >
                Saiba mais
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function Precos() {
  return (
    <section id="precos" className="scroll-mt-20 border-y border-border bg-secondary/40 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight">Planos por serviço</h2>
          <p className="mt-3 text-muted-foreground">
            Preço claro por serviço, sem pacote fechado. Cancele quando quiser.
          </p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const tone = SERVICE_TONE[s.id]
            return (
              <div key={s.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2">
                  <span className={cn('size-2.5 rounded-full', tone.dot)} />
                  <h3 className="font-semibold">{s.nome}</h3>
                </div>
                <p className="mt-4 font-display text-3xl font-semibold">
                  {brl(s.precoMensal)}
                  <span className="text-base font-normal text-muted-foreground">/mês</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {s.destaques.map((d) => (
                    <li key={d} className="flex items-start gap-2">
                      <Check className={cn('mt-0.5 size-4 shrink-0', tone.text)} />
                      <span className="text-muted-foreground">{d}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link to="/criar-conta">Assinar {s.nome.replace('Aura ', '')}</Link>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CtaFinal() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card px-8 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40 blur-3xl dark:opacity-25"
          style={{ background: 'linear-gradient(90deg, var(--svc-fit), var(--svc-barber), var(--svc-brand), var(--svc-vagas))' }}
        />
        <div className="relative mx-auto max-w-lg">
          <h2 className="text-3xl font-semibold tracking-tight">Comece com uma conta Aura</h2>
          <p className="mt-3 text-muted-foreground">
            Crie sua conta, assine os serviços que usa e veja tudo reunido no seu painel.
          </p>
          <Button asChild size="lg" className="mt-7">
            <Link to="/criar-conta">Criar conta grátis</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Brand />
        <p className="text-sm text-muted-foreground">Protótipo do ecossistema Aura · dados fictícios</p>
      </div>
    </footer>
  )
}

export function Landing() {
  return (
    <div className="min-h-svh bg-background">
      <Header />
      <main>
        <Hero />
        <Servicos />
        <Precos />
        <CtaFinal />
      </main>
      <Footer />
    </div>
  )
}
