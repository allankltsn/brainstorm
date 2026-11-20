import type { ServiceId } from './services'

export type DemoProfileId = 'completo' | 'parcial' | 'novo'

export type DemoProfile = {
  id: DemoProfileId
  nome: string
  email: string
  descricao: string
  contratados: ServiceId[]
}

/* Perfis de demonstração: trocar o perfil reconfigura o estado mock,
   para validar o portal cheio, parcial e o zero-state. */
export const PROFILES: DemoProfile[] = [
  {
    id: 'completo',
    nome: 'Marina Costa',
    email: 'marina@studioaura.com.br',
    descricao: 'Cliente completo — assina os 4 serviços',
    contratados: ['fit', 'barber', 'brand', 'vagas'],
  },
  {
    id: 'parcial',
    nome: 'Rafael Dias',
    email: 'rafael@dias.co',
    descricao: 'Cliente parcial — Fit e Brand',
    contratados: ['fit', 'brand'],
  },
  {
    id: 'novo',
    nome: 'Bia Nunes',
    email: 'bia@novaconta.com.br',
    descricao: 'Cliente novo — nada contratado',
    contratados: [],
  },
]

export const DEFAULT_PROFILE_ID: DemoProfileId = 'completo'

export const profileById = (id: DemoProfileId): DemoProfile =>
  PROFILES.find((p) => p.id === id) ?? PROFILES[0]
