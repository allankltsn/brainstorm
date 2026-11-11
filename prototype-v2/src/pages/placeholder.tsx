import { Link, useLocation } from 'react-router-dom'
import { EmptyCalendar } from '@/components/affect/empty-calendar'
import { pageTitle } from '@/lib/nav'
import { useRole } from '@/lib/role'

export function Placeholder() {
  const { role } = useRole()
  const { pathname } = useLocation()
  const t = pageTitle(role, pathname)
  const label = t === 'aura-fit' ? 'Esta tela' : t
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <EmptyCalendar label="Ilustração de calendário vazio" className="mb-2" />
      <h1 className="text-xl font-semibold tracking-tight">{label} ainda não foi migrada</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Esta tela continua no protótipo antigo (pasta <code className="rounded bg-muted px-1 py-0.5 text-xs">prototype/</code>). Ela será refeita com o novo kit de interface.
      </p>
      <Link to="/inicio" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
        Voltar para o início
      </Link>
    </div>
  )
}
