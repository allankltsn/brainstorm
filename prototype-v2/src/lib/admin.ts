/* Dados da área do admin (fictícios): usuários da plataforma, planos e cupons. */

export type UserRole = 'admin' | 'suporte' | 'personal' | 'aluno'
export type UserStatus = 'ativo' | 'bloqueado' | 'pendente'
export type PlatformUser = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  since: string
  lastLogin: string
  plan: string | null
  students?: number
  payment?: 'em dia' | 'em atraso'
  blockReason?: string
}

export const ROLE_NAME: Record<UserRole, string> = { admin: 'Administrador', suporte: 'Suporte', personal: 'Personal', aluno: 'Aluno' }

const mail = (n: string) =>
  `${n
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')}@exemplo.com.br`
const u = (id: number, name: string, role: UserRole, status: UserStatus, since: string, lastLogin: string, plan: string | null = null, o: Partial<PlatformUser> = {}): PlatformUser => ({
  id: `u${String(id).padStart(2, '0')}`,
  name,
  email: mail(name),
  role,
  status,
  since,
  lastLogin,
  plan,
  ...o,
})

/* As três contas de demonstração usam o mesmo e-mail do login. */
const DEMO: Record<string, string> = { 'Ana Ribeiro': 'admin@aura.demo', 'Carla Mendes': 'personal@aura.demo', 'Jorge Batista': 'aluno@aura.demo' }

export const platformUsers: PlatformUser[] = [
  u(1, 'Ana Ribeiro', 'admin', 'ativo', '12/01/2026', 'Hoje, 08:41'),
  u(2, 'Henrique Salles', 'admin', 'ativo', '12/01/2026', 'Ontem, 17:20'),
  u(3, 'Sofia Matos', 'suporte', 'ativo', '02/03/2026', 'Hoje, 09:05'),
  u(4, 'Carla Mendes', 'personal', 'ativo', '03/02/2026', 'Hoje, 07:55', 'Pro', { students: 18, payment: 'em dia' }),
  u(5, 'Camila Prado', 'personal', 'ativo', '18/02/2026', 'Ontem, 21:08', 'Pro', { students: 24, payment: 'em dia' }),
  u(6, 'Thiago Ventura', 'personal', 'ativo', '09/03/2026', 'Há 2 dias', 'Pro', { students: 27, payment: 'em atraso' }),
  u(7, 'Larissa Cunha', 'personal', 'ativo', '22/04/2026', 'Há 4 dias', 'Starter', { students: 3, payment: 'em dia' }),
  u(8, 'Bruno Sampaio', 'personal', 'bloqueado', '15/05/2026', '30/08/2026', 'Pro', { students: 11, payment: 'em atraso', blockReason: 'Cobrança contestada pelo titular. Aguardando contato.' }),
  u(9, 'Patrícia Nogueira', 'personal', 'ativo', '02/06/2026', 'Hoje, 06:30', 'Premium', { students: 46, payment: 'em dia' }),
  u(10, 'Diego Farias', 'personal', 'ativo', '19/07/2026', 'Ontem, 12:14', 'Pro', { students: 9, payment: 'em dia' }),
  u(11, 'Renan Azevedo', 'personal', 'pendente', '10/10/2026', 'Nunca', 'Starter', { students: 0 }),
  u(12, 'Marina Lopes', 'aluno', 'ativo', '04/02/2026', 'Há 9 dias'),
  u(13, 'Felipe Almeida', 'aluno', 'ativo', '05/03/2026', 'Há 7 dias'),
  u(14, 'Jorge Batista', 'aluno', 'ativo', '08/06/2026', 'Hoje, 07:10'),
  u(15, 'Renata Silva', 'aluno', 'ativo', '09/07/2026', 'Há 4 dias'),
  u(16, 'Helena Matos', 'aluno', 'ativo', '13/03/2026', 'Ontem, 19:10'),
  u(17, 'Tiago Moreira', 'aluno', 'pendente', '14/10/2026', 'Nunca'),
  u(18, 'Roberto Lima', 'aluno', 'bloqueado', '11/01/2026', '08/09/2026', null, { blockReason: 'Conta encerrada a pedido do titular.' }),
].map((x) => (DEMO[x.name] ? { ...x, email: DEMO[x.name] } : x))

export type Plan = {
  id: string
  name: string
  tagline: string
  status: 'ativo' | 'rascunho' | 'arquivado'
  monthly: number | null
  yearly: number | null
  students: number | null
  ai: string
  subscribers: number
  popular?: boolean
}
export const plans: Plan[] = [
  { id: 'starter', name: 'Starter', tagline: 'Para começar sem custo', status: 'ativo', monthly: 0, yearly: 0, students: 3, ai: 'Sem IA', subscribers: 2 },
  { id: 'pro', name: 'Pro', tagline: 'Para quem está crescendo', status: 'ativo', monthly: 49.9, yearly: 499, students: 30, ai: 'IA limitada', subscribers: 5, popular: true },
  { id: 'premium', name: 'Premium', tagline: 'Para quem atende sem limites', status: 'ativo', monthly: 89.9, yearly: 899, students: null, ai: 'IA ampla', subscribers: 1 },
  { id: 'equipes', name: 'Equipes', tagline: 'Vários personais na mesma conta', status: 'rascunho', monthly: null, yearly: null, students: null, ai: 'IA ampla', subscribers: 0 },
]

export type Coupon = {
  id: string
  code: string
  kind: 'percentual' | 'fixo'
  value: number
  duration: string
  until: string
  limit: number
  uses: number
  plans: string[]
  status: 'ativo' | 'pausado' | 'expirado' | 'esgotado' | 'agendado'
}
export const coupons: Coupon[] = [
  { id: 'c1', code: 'BEMVINDA20', kind: 'percentual', value: 20, duration: 'Primeira cobrança', until: '31/12/2026', limit: 200, uses: 37, plans: ['Pro', 'Premium'], status: 'ativo' },
  { id: 'c8', code: 'FORCA5', kind: 'fixo', value: 5, duration: '12 meses', until: '31/01/2027', limit: 500, uses: 88, plans: ['Pro'], status: 'ativo' },
  { id: 'c2', code: 'PRO10OFF', kind: 'fixo', value: 10, duration: '3 meses', until: '31/01/2027', limit: 50, uses: 12, plans: ['Pro'], status: 'ativo' },
  { id: 'c6', code: 'ANUAL50', kind: 'fixo', value: 50, duration: 'Primeira cobrança', until: '28/02/2027', limit: 100, uses: 5, plans: ['Pro', 'Premium'], status: 'ativo' },
  { id: 'c7', code: 'BLACK40', kind: 'percentual', value: 40, duration: 'Primeira cobrança', until: '30/11/2026', limit: 300, uses: 0, plans: ['Premium'], status: 'agendado' },
  { id: 'c5', code: 'PREMIUM15', kind: 'percentual', value: 15, duration: '6 meses', until: '30/11/2026', limit: 40, uses: 9, plans: ['Premium'], status: 'pausado' },
  { id: 'c4', code: 'LANCAMENTO', kind: 'percentual', value: 30, duration: 'Primeira cobrança', until: '31/12/2026', limit: 100, uses: 100, plans: ['Pro', 'Premium'], status: 'esgotado' },
  { id: 'c3', code: 'VERAO10', kind: 'percentual', value: 10, duration: 'Primeira cobrança', until: '31/03/2026', limit: 150, uses: 61, plans: ['Pro', 'Premium'], status: 'expirado' },
]
export const discountLabel = (c: Pick<Coupon, 'kind' | 'value'>) => (c.kind === 'percentual' ? `${c.value}% de desconto` : `R$ ${c.value.toFixed(2).replace('.', ',')} de desconto`)

/* Séries do painel do admin. */
export const mrrTrend = [
  { mes: 'Mai', receita: 149.7, anterior: 99.8 },
  { mes: 'Jun', receita: 239.6, anterior: 149.7 },
  { mes: 'Jul', receita: 289.5, anterior: 239.6 },
  { mes: 'Ago', receita: 289.5, anterior: 289.5 },
  { mes: 'Set', receita: 339.4, anterior: 289.5 },
  { mes: 'Out', receita: 399.4, anterior: 339.4 },
]
export const signupsWeek = [
  { semana: '07/09', contas: 3 },
  { semana: '14/09', contas: 5 },
  { semana: '21/09', contas: 4 },
  { semana: '28/09', contas: 8 },
  { semana: '05/10', contas: 6 },
  { semana: '12/10', contas: 11 },
]
export const adminSparks = { personais: [4, 5, 5, 6, 7, 7, 8], alunos: [88, 97, 104, 116, 125, 133, 142], receita: [149.7, 239.6, 289.5, 289.5, 339.4, 399.4] }
