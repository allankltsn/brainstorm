import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { SERVICES, SERVICE_TONE, type ServiceId } from '@/lib/services'
import { useEcho } from '@/lib/store'
import { cn } from '@/lib/utils'

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

export function Loja() {
  const { isContratado, contratar, subscriptions } = useEcho()

  const assinar = (id: ServiceId, nome: string, reativando: boolean) => {
    contratar(id)
    toast.success(`${nome} ${reativando ? 'reativado' : 'contratado'}`, { description: 'Já aparece no seu painel.' })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight">Loja Aura</h2>
        <p className="mt-1 text-muted-foreground">Assine serviços avulsos. Preço por serviço, cancele quando quiser.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const tone = SERVICE_TONE[s.id]
          const Icon = s.icon
          const contratado = isContratado(s.id)
          const cancelado = subscriptions.some((x) => x.serviceId === s.id && x.status === 'cancelada')
          return (
            <article key={s.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <span className={cn('flex size-11 items-center justify-center rounded-xl', tone.bg, tone.text)}>
                  <Icon className="size-5.5" />
                </span>
                <div className="flex-1">
                  <Link to={`/app/loja/${s.slug}`} className="font-semibold hover:underline">
                    {s.nome}
                  </Link>
                  <p className="text-sm text-muted-foreground">{s.tagline}</p>
                </div>
                <span className="text-right text-sm font-medium">
                  {brl(s.precoMensal)}
                  <span className="block text-xs font-normal text-muted-foreground">por mês</span>
                </span>
              </div>

              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {s.destaques.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <Check className={cn('mt-0.5 size-4 shrink-0', tone.text)} />
                    <span className="text-muted-foreground">{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-2">
                {contratado ? (
                  <>
                    <Button asChild size="sm" className="gap-1.5">
                      <a href={s.url} target="_blank" rel="noreferrer">
                        Abrir <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                    <span className="text-sm text-muted-foreground">Contratado</span>
                  </>
                ) : (
                  <Button size="sm" className="w-full" onClick={() => assinar(s.id, s.nome, cancelado)}>
                    {cancelado ? 'Reativar' : 'Contratar'} {s.nome.replace('Aura ', '')}
                  </Button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
