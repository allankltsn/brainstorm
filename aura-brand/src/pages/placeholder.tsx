import { Link, useLocation } from 'react-router-dom'
import { EmptyCalendar } from '@/components/affect/empty-calendar'
import { currentNav } from '@/lib/nav'

export function Placeholder() {
  const { pathname } = useLocation()
  const label = currentNav(pathname)?.label ?? 'Esta tela'
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <EmptyCalendar label="Ilustração de calendário vazio" className="mb-2" />
      <h1 className="text-xl font-semibold tracking-tight">{label} ainda não está pronta</h1>
      <p className="max-w-md text-sm text-muted-foreground">Estamos começando pelo brand kit, que é a base das outras telas.</p>
      <Link to="/marca" className="flex min-h-11 items-center text-sm font-medium text-brand-text underline-offset-4 hover:underline">
        Ir para o brand kit
      </Link>
    </div>
  )
}
