import { Outlet } from 'react-router-dom'

// Esqueleto do portal na ECO-01; sidebar, nav e menu do usuário vêm na ECO-04.
export function AppShell() {
  return (
    <div className="min-h-svh">
      <Outlet />
    </div>
  )
}
