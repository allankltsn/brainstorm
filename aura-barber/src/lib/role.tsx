import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role } from './data'
import { db } from './data'
import { lerProfId, lerClienteId, salvarId, KEY_PROF, KEY_CLIENTE, PROF_PADRAO, CLIENTE_PADRAO } from './identidade'
import { filialPadrao } from './api'

const KEY = 'aura-barber-role'
const KEY_FILIAL = 'aura-barber-filial'

type RoleCtx = {
  role: Role
  setRole: (r: Role) => void
  profId: string
  setProfId: (id: string) => void
  clienteId: string
  setClienteId: (id: string) => void
  filialId: string
  setFilialId: (id: string) => void
}

const Ctx = createContext<RoleCtx>({
  role: 'dono',
  setRole: () => {},
  profId: PROF_PADRAO,
  setProfId: () => {},
  clienteId: CLIENTE_PADRAO,
  setClienteId: () => {},
  filialId: '',
  setFilialId: () => {},
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
  const [filialId, setFilialIdState] = useState<string>(() => {
    try {
      const f = localStorage.getItem(KEY_FILIAL)
      if (f && db.filialById(f)) return f
    } catch {
      /* ignora */
    }
    return filialPadrao(role, profId)
  })

  const setRole = (r: Role) => {
    setRoleState(r)
    try {
      localStorage.setItem(KEY, r)
    } catch {
      /* ignora */
    }
    // ao virar barbeiro, a filial ativa passa a ser a dele
    if (r === 'barbeiro') setFilialId(filialPadrao('barbeiro', profId))
  }
  const setProfId = (id: string) => {
    setProfIdState(id)
    salvarId(KEY_PROF, id)
    if (role === 'barbeiro') setFilialId(filialPadrao('barbeiro', id))
  }
  const setClienteId = (id: string) => {
    setClienteIdState(id)
    salvarId(KEY_CLIENTE, id)
  }
  const setFilialId = (id: string) => {
    setFilialIdState(id)
    try {
      localStorage.setItem(KEY_FILIAL, id)
    } catch {
      /* ignora */
    }
  }

  return (
    <Ctx.Provider value={{ role, setRole, profId, setProfId, clienteId, setClienteId, filialId, setFilialId }}>
      {children}
    </Ctx.Provider>
  )
}

export const useRole = () => useContext(Ctx)
