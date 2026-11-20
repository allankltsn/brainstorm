import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { serviceById, SERVICE_TONE } from '@/lib/services'
import { useEcho } from '@/lib/store'
import { cn } from '@/lib/utils'

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

export function Assinatura() {
  const { subscriptions, contratar, cancelar } = useEcho()

  if (subscriptions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <h2 className="text-lg font-semibold">Você ainda não assina nenhum serviço</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Escolha um serviço na loja para começar a usar o seu Aura.
          </p>
          <Button asChild className="mt-6">
            <Link to="/app/loja">Ver a loja</Link>
          </Button>
        </div>
      </div>
    )
  }

  const totalAtivo = subscriptions
    .filter((s) => s.status === 'ativa')
    .reduce((soma, s) => soma + (serviceById(s.serviceId)?.precoMensal ?? 0), 0)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm text-muted-foreground">Total mensal ativo</p>
          <p className="font-display text-3xl font-semibold">{brl(totalAtivo)}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/app/loja">Contratar mais serviços</Link>
        </Button>
      </div>

      <ul className="space-y-3">
        {subscriptions.map((sub) => {
          const service = serviceById(sub.serviceId)
          if (!service) return null
          const tone = SERVICE_TONE[service.id]
          const Icon = service.icon
          const ativa = sub.status === 'ativa'
          return (
            <li key={sub.serviceId} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5">
              <span className={cn('flex size-11 items-center justify-center rounded-xl', tone.bg, tone.text)}>
                <Icon className="size-5.5" />
              </span>
              <div className="min-w-40 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{service.nome}</span>
                  {ativa ? (
                    <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Ativa</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Cancelada</span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {brl(service.precoMensal)}/mês · desde {sub.desde}
                  {ativa ? ` · próxima ${sub.proximaCobranca}` : ''}
                </p>
              </div>
              {ativa ? (
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="ghost" className="gap-1.5">
                    <a href={service.url} target="_blank" rel="noreferrer">
                      Abrir <ArrowUpRight className="size-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      cancelar(service.id)
                      toast(`Assinatura de ${service.nome} cancelada`)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    contratar(service.id)
                    toast.success(`${service.nome} reativado`)
                  }}
                >
                  Reativar
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
