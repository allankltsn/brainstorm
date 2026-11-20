import { Link } from 'react-router-dom'
import { ServiceCard } from '@/components/service-card'
import { Button } from '@/components/ui/button'
import { SERVICES } from '@/lib/services'
import { useEcho } from '@/lib/store'

export function Inicio() {
  const { profile, isContratado } = useEcho()
  const meus = SERVICES.filter((s) => isContratado(s.id))
  const descobrir = SERVICES.filter((s) => !isContratado(s.id))
  const primeiroNome = profile.nome.split(' ')[0]

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight">Olá, {primeiroNome}</h2>
        <p className="mt-1 text-muted-foreground">
          {meus.length > 0
            ? 'Aqui está tudo o que você tem no seu Aura.'
            : 'Comece escolhendo um serviço para o seu negócio.'}
        </p>
      </header>

      {meus.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Meus serviços</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meus.map((s) => (
              <ServiceCard key={s.id} service={s} contratado />
            ))}
          </div>
        </section>
      )}

      {descobrir.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {meus.length > 0 ? 'Descobrir mais' : 'Serviços Aura'}
            </h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/loja">Ver a loja</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {descobrir.map((s) => (
              <ServiceCard key={s.id} service={s} contratado={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
