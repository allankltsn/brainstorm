import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role } from './data'

const KEY = 'aura-barber-role'
const Ctx = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: 'dono', setRole: () => {} })

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, set] = useState<Role>(() => {
    try {
      const r = localStorage.getItem(KEY)
      if (r === 'dono' || r === 'barbeiro' || r === 'cliente') return r
    } catch {
      /* ignora */
    }
    return 'dono'
  })
  const setRole = (r: Role) => {
    set(r)
    try {
      localStorage.setItem(KEY, r)
    } catch {
      /* ignora */
    }
  }
  return <Ctx.Provider value={{ role, setRole }}>{children}</Ctx.Provider>
}

export const useRole = () => useContext(Ctx)
