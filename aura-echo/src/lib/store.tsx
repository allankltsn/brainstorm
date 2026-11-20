import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_PROFILE_ID, profileById, type DemoProfile, type DemoProfileId } from './profiles'
import type { ServiceId } from './services'

const KEY = 'aura-echo-profile'

export type SubStatus = 'ativa' | 'cancelada'
export type Subscription = {
  serviceId: ServiceId
  status: SubStatus
  desde: string
  proximaCobranca: string
}

// Datas mockadas e fixas, por serviço, só para dar realismo ao protótipo.
const DESDE: Record<ServiceId, string> = {
  fit: 'ago. 2025',
  barber: 'jan. 2026',
  brand: 'mar. 2025',
  vagas: 'set. 2026',
}
const PROXIMA_COBRANCA = '05/12/2026'
const DESDE_NOVA = 'nov. 2026'

// ---- Núcleo puro (testável sem React) --------------------------------------

export function resolveProfileId(stored: string | null): DemoProfileId {
  if (stored === 'completo' || stored === 'parcial' || stored === 'novo') return stored
  return DEFAULT_PROFILE_ID
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : undefined
  } catch {
    return undefined
  }
}

export function readStoredProfileId(storage: Storage | undefined = safeStorage()): string | null {
  try {
    return storage?.getItem(KEY) ?? null
  } catch {
    return null
  }
}

export function subscriptionsFor(profileId: DemoProfileId): Subscription[] {
  return profileById(profileId).contratados.map<Subscription>((id) => ({
    serviceId: id,
    status: 'ativa',
    desde: DESDE[id],
    proximaCobranca: PROXIMA_COBRANCA,
  }))
}

export function aplicarContratar(subs: Subscription[], id: ServiceId): Subscription[] {
  if (subs.some((s) => s.serviceId === id)) {
    return subs.map<Subscription>((s) => (s.serviceId === id ? { ...s, status: 'ativa' } : s))
  }
  const nova: Subscription = { serviceId: id, status: 'ativa', desde: DESDE_NOVA, proximaCobranca: PROXIMA_COBRANCA }
  return [...subs, nova]
}

export function aplicarCancelar(subs: Subscription[], id: ServiceId): Subscription[] {
  return subs.map<Subscription>((s) => (s.serviceId === id ? { ...s, status: 'cancelada' } : s))
}

// ---- Provider / hook -------------------------------------------------------

type EchoContext = {
  profile: DemoProfile
  profileId: DemoProfileId
  setProfile: (id: DemoProfileId) => void
  subscriptions: Subscription[]
  contratar: (id: ServiceId) => void
  cancelar: (id: ServiceId) => void
  isContratado: (id: ServiceId) => boolean
}

const Ctx = createContext<EchoContext | null>(null)

export function EchoProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState<DemoProfileId>(() => resolveProfileId(readStoredProfileId()))
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => subscriptionsFor(profileId))

  const value = useMemo<EchoContext>(() => {
    const setProfile = (id: DemoProfileId) => {
      setProfileId(id)
      setSubscriptions(subscriptionsFor(id))
      try {
        localStorage.setItem(KEY, id)
      } catch {
        /* ignora: sem storage, o perfil só não persiste */
      }
    }
    return {
      profile: profileById(profileId),
      profileId,
      setProfile,
      subscriptions,
      contratar: (id: ServiceId) => setSubscriptions((s) => aplicarContratar(s, id)),
      cancelar: (id: ServiceId) => setSubscriptions((s) => aplicarCancelar(s, id)),
      isContratado: (id: ServiceId) => subscriptions.some((s) => s.serviceId === id && s.status === 'ativa'),
    }
  }, [profileId, subscriptions])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEcho(): EchoContext {
  const v = useContext(Ctx)
  if (!v) throw new Error('useEcho precisa do EchoProvider')
  return v
}
