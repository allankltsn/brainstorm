import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { type Service, SERVICE_TONE } from '@/lib/services'
import { cn } from '@/lib/utils'

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })

type Props = { service: Service; contratado: boolean }

export function ServiceCard({ service, contratado }: Props) {
  const tone = SERVICE_TONE[service.id]
  const Icon = service.icon
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex size-10 items-center justify-center rounded-xl', tone.bg, tone.text)}>
          <Icon className="size-5" />
        </span>
        {contratado ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" /> Ativo
          </span>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {brl(service.precoMensal)}<span className="text-xs">/mês</span>
          </span>
        )}
      </div>
      <h3 className="mt-4 font-semibold">{service.nome}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{service.tagline}</p>
      <div className="mt-5 flex items-center gap-2">
        {contratado ? (
          <>
            <Button asChild size="sm" className="gap-1.5">
              <a href={service.url} target="_blank" rel="noreferrer">
                Abrir <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to={`/app/loja/${service.slug}`}>Detalhes</Link>
            </Button>
          </>
        ) : (
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link to={`/app/loja/${service.slug}`}>Contratar</Link>
          </Button>
        )}
      </div>
    </article>
  )
}
