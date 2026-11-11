/* Dados fictícios de planos, cupons e usuários (espelham prototype/assets/data-g2.js e data-g3.js). */

export type Plan = {
  id: string
  name: string
  monthly: number
  students: number | null
  perks: string[]
  highlight?: boolean
  status: 'publicado' | 'rascunho' | 'arquivado'
  subscribers: number
}

export const plans: Plan[] = [
  { id: 'starter', name: 'Starter', monthly: 0, students: 5, perks: ['Até 5 alunos ativos', 'Biblioteca de exercícios', 'Treinos ilimitados'], status: 'publicado', subscribers: 3 },
  { id: 'pro', name: 'Pro', monthly: 49.9, students: 30, perks: ['Até 30 alunos ativos', 'Sugestões de treino com IA', 'Questionários e alertas'], highlight: true, status: 'publicado', subscribers: 4 },
  { id: 'studio', name: 'Studio', monthly: 99.9, students: null, perks: ['Alunos ilimitados', 'Tudo do Pro', 'Suporte prioritário'], status: 'publicado', subscribers: 1 },
  { id: 'elite', name: 'Elite (em teste)', monthly: 149.9, students: null, perks: ['Alunos ilimitados', 'Relatórios avançados'], status: 'rascunho', subscribers: 0 },
]

export const ANNUAL_DISCOUNT = 0.2

export type Coupon = { code: string; label: string; off: number; plan: string; uses: number; limit: number; ends: string; active: boolean }
export const coupons: Coupon[] = [
  { code: 'BEMVINDO10', label: '10% no primeiro mês', off: 0.1, plan: 'Todos', uses: 12, limit: 50, ends: '31/12/2026', active: true },
  { code: 'PRO20', label: '20% no plano Pro', off: 0.2, plan: 'Pro', uses: 4, limit: 20, ends: '30/11/2026', active: true },
  { code: 'BLACK50', label: '50% na primeira cobrança', off: 0.5, plan: 'Todos', uses: 30, limit: 30, ends: '27/11/2025', active: false },
]

export type Account = {
  id: string
  name: string
  email: string
  role: 'personal' | 'aluno' | 'admin'
  status: 'ativo' | 'bloqueado' | 'convidado'
  since: string
  plan?: string
}
export const accounts: Account[] = [
  { id: 'u1', name: 'Carla Mendes', email: 'carla.mendes@aura.example', role: 'personal', status: 'ativo', since: '12/03/2026', plan: 'Pro' },
  { id: 'u2', name: 'Rodrigo Teixeira', email: 'rodrigo.teixeira@aura.example', role: 'personal', status: 'ativo', since: '02/05/2026', plan: 'Studio' },
  { id: 'u3', name: 'Marcela Duarte', email: 'marcela.duarte@aura.example', role: 'personal', status: 'ativo', since: '18/06/2026', plan: 'Starter' },
  { id: 'u4', name: 'Vinícius Prado', email: 'vinicius.prado@aura.example', role: 'personal', status: 'bloqueado', since: '07/08/2026', plan: 'Pro' },
  { id: 'u5', name: 'Jorge Batista', email: 'jorge.batista@aura.example', role: 'aluno', status: 'ativo', since: '20/04/2026' },
  { id: 'u6', name: 'Marina Lopes', email: 'marina.lopes@aura.example', role: 'aluno', status: 'ativo', since: '03/05/2026' },
  { id: 'u7', name: 'Ana Ribeiro', email: 'ana.ribeiro@aura.example', role: 'admin', status: 'ativo', since: '01/01/2026' },
  { id: 'u8', name: 'Sérgio Matos', email: 'sergio.matos@aura.example', role: 'personal', status: 'convidado', since: '14/10/2026' },
]
