import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { serviceBySlug, SERVICE_TONE } from '@/lib/services'
import { useEcho } from '@/lib/store'
import { cn } from '@/lib/utils'

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

export function ServicoDetalhe() {
  const { slug } = useParams()
  const service = slug ? serviceBySlug(slug) : undefined
  const { subscriptions, contratar, cancelar } = useEcho()

  if (!service) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p className="text-muted-foreground">Serviço não encontrado.</p>
        <Button asChild variant="outline">
          <Link to="/app/loja">Voltar à loja</Link>
        </Button>
      </div>
    )
  }

  const tone = SERVICE_TONE[service.id]
  const Icon = service.icon
  const sub = subscriptions.find((s) => s.serviceId === service.id)
  const ativo = sub?.status === 'ativa'

  const assinar = () => {
    contratar(service.id)
    toast.success(`${service.nome} contratado`, { description: 'Já aparece no seu painel.' })
  }
  const cancelarAssinatura = () => {
    cancelar(service.id)
    toast(`Assinatura de ${service.nome} cancelada`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link to="/app/loja" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Loja
      </Link>

      <header className="flex items-start gap-4">
        <span className={cn('flex size-14 items-center justify-center rounded-2xl', tone.bg, tone.text)}>
          <Icon className="size-7" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{service.nome}</h2>
          <p className="mt-1 text-muted-foreground">{service.tagline}</p>
        </div>
      </header>

      <p className="text-[0.9375rem] leading-relaxed text-foreground/90">{service.descricao}</p>

      <ul className="space-y-2.5">
        {service.destaques.map((d) => (
          <li key={d} className="flex items-start gap-2.5 text-sm">
            <Check className={cn('mt-0.5 size-4 shrink-0', tone.text)} />
            <span>{d}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl border border-border bg-card p-6">
        {ativo ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Plano</p>
                <p className="font-medium">{brl(service.precoMensal)}/mês</p>
              </div>
              <div>
                <p className="text-muted-foreground">Desde</p>
                <p className="font-medium">{sub?.desde}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Próxima cobrança</p>
                <p className="font-medium">{sub?.proximaCobranca}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild className="gap-1.5">
                <a href={service.url} target="_blank" rel="noreferrer">
                  Abrir {service.nome} <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={cancelarAssinatura}>
                Cancelar assinatura
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-semibold">
                {brl(service.precoMensal)}
                <span className="text-base font-normal text-muted-foreground">/mês</span>
              </p>
              {sub?.status === 'cancelada' && <p className="text-sm text-muted-foreground">Assinatura cancelada</p>}
            </div>
            <Button onClick={assinar}>{sub?.status === 'cancelada' ? 'Reativar' : 'Contratar'}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
