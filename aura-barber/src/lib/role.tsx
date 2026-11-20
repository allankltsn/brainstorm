import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role } from './data'
import { lerProfId, lerClienteId, salvarId, KEY_PROF, KEY_CLIENTE, PROF_PADRAO, CLIENTE_PADRAO } from './identidade'

const KEY = 'aura-barber-role'

type RoleCtx = {
  role: Role
  setRole: (r: Role) => void
  profId: string
  setProfId: (id: string) => void
  clienteId: string
  setClienteId: (id: string) => void
}

const Ctx = createContext<RoleCtx>({
  role: 'dono',
  setRole: () => {},
  profId: PROF_PADRAO,
  setProfId: () => {},
  clienteId: CLIENTE_PADRAO,
  setClienteId: () => {},
})

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const r = localStorage.getItem(KEY)
      if (r === 'dono' || r === 'barbeiro' || r === 'cliente') return r
    } catch {
      /* ignora */
    }
    return 'dono'
  })
  const [profId, setProfIdState] = useState<string>(() => lerProfId())
  const [clienteId, setClienteIdState] = useState<string>(() => lerClienteId())

  const setRole = (r: Role) => {
    setRoleState(r)
    try {
      localStorage.setItem(KEY, r)
    } catch {
      /* ignora */
    }
  }
  const setProfId = (id: string) => {
    setProfIdState(id)
    salvarId(KEY_PROF, id)
  }
  const setClienteId = (id: string) => {
    setClienteIdState(id)
    salvarId(KEY_CLIENTE, id)
  }

  return (
    <Ctx.Provider value={{ role, setRole, profId, setProfId, clienteId, setClienteId }}>{children}</Ctx.Provider>
  )
}

export const useRole = () => useContext(Ctx)
