import { NavLink, Outlet } from 'react-router-dom'
import { Moon, Sparkles, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { NAV } from '@/lib/nav'
import { profile } from '@/lib/data'

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles size={15} />
      </span>
      <span className="font-semibold tracking-tight">Aura Apply</span>
    </div>
  )
}

function ThemeToggle() {
  const { isDark, setTheme } = useTheme()
  return (
    <button
      type="button"
      aria-label="Alternar tema"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="grid size-9 place-items-center rounded-lg border bg-background text-muted-foreground transition hover:text-foreground"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

function Avatar() {
  const initials = profile.firstName.slice(0, 1).toUpperCase()
  return (
    <NavLink
      to="/perfil"
      aria-label="Perfil"
      className={({ isActive }) =>
        `grid size-9 place-items-center rounded-full border text-sm font-semibold transition ${
          isActive ? 'border-primary bg-brand-soft text-brand-text' : 'bg-card text-foreground hover:border-primary'
        }`
      }
    >
      {initials}
    </NavLink>
  )
}

export function AppShell() {
  const linkBase = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition'

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r bg-card p-4 md:flex">
        <div className="px-1 py-2">
          <BrandMark />
        </div>
        <nav className="mt-6 flex flex-col gap-1">
          {NAV.map((i) => (
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
      </aside>

      {/* Topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:pl-64">
        <div className="md:hidden">
          <BrandMark />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Avatar />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-24 md:pb-10">
          <Outlet />
        </div>
      </main>

      {/* Barra inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t bg-card md:hidden">
        {NAV.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`
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
