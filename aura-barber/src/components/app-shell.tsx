import { NavLink, Outlet } from 'react-router-dom'
import { Moon, Scissors, Sun } from 'lucide-react'
import { useRole } from '@/lib/role'
import { useTheme } from '@/lib/theme'
import { NAV, ROLE_LABEL } from '@/lib/nav'
import { db, type Role } from '@/lib/data'
import { Select } from '@/components/affect/select'

const ROLES: Role[] = ['dono', 'barbeiro', 'cliente']

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Scissors size={16} />
      </span>
      <span className="font-semibold">Aura Barber</span>
    </div>
  )
}

function RoleSwitch() {
  const { role, setRole } = useRole()
  return (
    <Select
      size="sm"
      aria-label="Perfil"
      value={role}
      options={ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] }))}
      onChange={(v) => setRole(v as Role)}
    />
  )
}

// Quem sou eu dentro do papel: profissional (barbeiro) ou cliente. Dono é único → nada.
function IdentidadeSwitch() {
  const { role, profId, setProfId, clienteId, setClienteId } = useRole()
  if (role === 'barbeiro') {
    return (
      <Select
        size="sm"
        aria-label="Sou (profissional)"
        value={profId}
        options={db.profissionais.map((p) => ({ value: p.id, label: `Sou: ${p.nome}` }))}
        onChange={setProfId}
      />
    )
  }
  if (role === 'cliente') {
    return (
      <Select
        size="sm"
        aria-label="Sou (cliente)"
        value={clienteId}
        options={db.clientes.map((c) => ({ value: c.id, label: `Sou: ${c.nome}` }))}
        onChange={setClienteId}
      />
    )
  }
  return null
}

function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  return (
    <button
      type="button"
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="grid size-9 place-items-center rounded-lg border bg-background text-foreground"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export function AppShell() {
  const { role } = useRole()
  const itens = NAV[role]
  const linkBase = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition'

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r bg-card p-4 md:flex">
        <div className="px-1 py-2">
          <BrandMark />
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {itens.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`
              }
            >
              <i.icon size={18} />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <IdentidadeSwitch />
          <RoleSwitch />
        </div>
      </aside>

      {/* Topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:pl-64">
        <div className="md:hidden">
          <BrandMark />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-32 md:hidden">
            <IdentidadeSwitch />
          </div>
          <div className="w-28 md:hidden">
            <RoleSwitch />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="px-4 py-6 pb-24 md:pl-64">
        <Outlet />
      </main>

      {/* Barra inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-card md:hidden">
        {itens.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2 text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`
            }
          >
            <i.icon size={20} />
            {i.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
