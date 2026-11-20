import { Link, useLocation } from 'react-router-dom'
import { EmptyCalendar } from '@/components/affect/empty-calendar'
import { pageTitle } from '@/lib/nav'

export function Placeholder() {
  const { pathname } = useLocation()
  const t = pageTitle(pathname)
  const label = t === 'aura-brand' ? 'Esta tela' : t
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <EmptyCalendar label="Ilustração de calendário vazio" className="mb-2" />
      <h1 className="text-xl font-semibold tracking-tight">{label} ainda não foi construída</h1>
      <p className="max-w-md text-sm text-muted-foreground">Este módulo entra numa próxima etapa do MVP. Por enquanto, o brand kit está pronto para testar.</p>
      <Link to="/marca" className="text-sm font-medium text-brand-text underline-offset-4 hover:underline">
        Abrir a marca
      </Link>
    </div>
  )
}
