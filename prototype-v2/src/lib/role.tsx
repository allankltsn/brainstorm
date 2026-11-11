import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role } from './data'

const KEY = 'aura-role'
const Ctx = createContext<{ role: Role; setRole: (r: Role) => void }>({ role: 'personal', setRole: () => {} })

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, set] = useState<Role>(() => {
    try {
      const r = localStorage.getItem(KEY)
      if (r === 'personal' || r === 'aluno' || r === 'admin') return r
    } catch {
      /* ignora */
    }
    return 'personal'
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
