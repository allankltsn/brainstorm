/* Dados 100% fictícios, espelhando prototype/assets/data*.js. "Hoje" é fixo: 16/10/2026. */

export type Role = 'personal' | 'aluno' | 'admin'

export const TODAY_LABEL = 'sexta-feira, 16 de outubro'

/* Contas de demonstração (fictícias). O login do protótipo só aceita estas três. */
export const sessions: Record<Role, { name: string; email: string; password: string; title: string }> = {
  personal: { name: 'Carla Mendes', email: 'personal@aura.demo', password: 'Personal@123', title: 'Personal trainer' },
  aluno: { name: 'Jorge Batista', email: 'aluno@aura.demo', password: 'Aluno@123', title: 'Aluno' },
  admin: { name: 'Ana Ribeiro', email: 'admin@aura.demo', password: 'Admin@123', title: 'Administradora' },
}

export const initials = (name: string) => {
  const p = name.trim().split(/\s+/)
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase()
}
export const firstName = (name: string) => name.split(' ')[0]
export const maskEmail = (e: string) => {
  const [u, d] = e.split('@')
  return `${u.slice(0, 2)}***@${d}`
}
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export type Consent = 'liberado' | 'revogado' | 'pendente'
export type Student = {
  id: string
  name: string
  email: string
  mode: 'Presencial' | 'Remoto'
  status: 'ativo' | 'pausado' | 'pendente' | 'encerrado'
  plan: string | null
  lastSession: string
  lastSessionDays: number | null
  alerts: number
  health: Consent
  since: string
  done: number
  note?: string
}

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]+/g, '.')

const rel = (d: number | null) => (d === null ? 'Nunca' : d === 0 ? 'Hoje' : d === 1 ? 'Ontem' : `Há ${d} dias`)

function mk(n: number, name: string, o: Partial<Student> = {}): Student {
  const days = o.lastSessionDays !== undefined ? o.lastSessionDays : (n * 3) % 6
  return {
    id: `s${String(n).padStart(2, '0')}`,
    name,
    email: `${slug(name)}@exemplo.com.br`,
    mode: n % 3 === 0 ? 'Presencial' : 'Remoto',
    status: 'ativo',
    plan: ['Treino A/B', 'Full body', 'ABC', 'Força base'][n % 4],
    alerts: 0,
    health: 'liberado',
    since: `${String(3 + (n % 20)).padStart(2, '0')}/0${1 + (n % 8)}/2026`,
    done: 10 + n * 3,
    ...o,
    lastSessionDays: days,
    lastSession: rel(days),
  }
}

export const students: Student[] = [
  mk(1, 'Marina Lopes', { mode: 'Remoto', plan: 'Hipertrofia A/B', lastSessionDays: 9, alerts: 1 }),
  mk(2, 'Felipe Almeida', { mode: 'Presencial', plan: 'Condicionamento 3x', lastSessionDays: 7, alerts: 1 }),
  mk(3, 'Carlos Nunes', { mode: 'Remoto', plan: 'Força base', lastSessionDays: 12 }),
  mk(4, 'Paulo Ramos', { mode: 'Presencial', plan: 'Adaptação 2x', lastSessionDays: 8, health: 'pendente' }),
  mk(5, 'Jorge Batista', { status: 'pausado', plan: 'Força base', lastSessionDays: 15 }),
  mk(6, 'Renata Silva', { plan: 'Emagrecimento', lastSessionDays: 4, health: 'revogado' }),
  mk(7, 'Daniel Costa', { plan: null, lastSessionDays: null }),
  ...[
    'Larissa Prado',
    'Otávio Reis',
    'Helena Matos',
    'Rafael Dias',
    'Beatriz Cunha',
    'Gustavo Leal',
    'Patrícia Melo',
    'Leandro Faria',
    'Sofia Barreto',
    'Eduardo Pinto',
    'Júlia Campos',
  ].map((nm, i) => mk(8 + i, nm)),
  mk(19, 'Tiago Moreira', { status: 'pendente', plan: null, lastSessionDays: null, health: 'pendente', note: 'Aguardando liberar dados de saúde' }),
  mk(20, 'Bianca Torres', { status: 'pendente', plan: null, lastSessionDays: null, health: 'pendente', note: 'Aguardando confirmação de idade' }),
  mk(21, 'Roberto Lima', { status: 'encerrado', plan: null, lastSessionDays: 38, done: 64 }),
  mk(22, 'Camila Souza', { status: 'encerrado', plan: null, lastSessionDays: 118, done: 112 }),
  mk(23, 'André Pires', { status: 'encerrado', plan: null, lastSessionDays: 6, done: 41 }),
]

export const STUDENT_LIMIT = 30
export const activeStudents = () => students.filter((s) => s.status === 'ativo' || s.status === 'pausado')

export const agendaToday = [
  { time: '07:00', name: 'Lucas Ferreira', workout: 'Treino A: Superior', mode: 'Presencial' },
  { time: '09:30', name: 'Gabriela Santos', workout: 'Treino B: Inferior', mode: 'Presencial' },
  { time: '12:00', name: 'Bruno Oliveira', workout: 'Treino A: Superior', mode: 'Online' },
  { time: '18:30', name: 'Juliana Costa', workout: 'Treino C: Full body', mode: 'Online' },
]

export const workoutsWeek = [
  { dia: 'Sex', treinos: 3 },
  { dia: 'Sáb', treinos: 2 },
  { dia: 'Dom', treinos: 1 },
  { dia: 'Seg', treinos: 6 },
  { dia: 'Ter', treinos: 5 },
  { dia: 'Qua', treinos: 7 },
  { dia: 'Qui', treinos: 4 },
]

export const revenueMonth = 4250

export const notifications = [
  { id: 'n1', title: 'Marina Lopes respondeu o questionário', when: 'há 20 min', unread: true },
  { id: 'n2', title: 'Convite aceito por Tiago Moreira', when: 'há 2 h', unread: false },
  { id: 'n3', title: 'Sua assinatura renova em 03/11', when: 'ontem', unread: false },
]

export const week: { d: string; state: 'feito' | 'descanso' | 'hoje' | 'livre' }[] = [
  { d: 'Seg', state: 'feito' },
  { d: 'Ter', state: 'descanso' },
  { d: 'Qua', state: 'feito' },
  { d: 'Qui', state: 'descanso' },
  { d: 'Sex', state: 'hoje' },
  { d: 'Sáb', state: 'livre' },
  { d: 'Dom', state: 'livre' },
]

/* Séries fictícias para gráficos e relatórios. */
export const trend8 = [
  { semana: '31/08', feitos: 31, anterior: 27 },
  { semana: '07/09', feitos: 34, anterior: 29 },
  { semana: '14/09', feitos: 33, anterior: 31 },
  { semana: '21/09', feitos: 38, anterior: 30 },
  { semana: '28/09', feitos: 36, anterior: 34 },
  { semana: '05/10', feitos: 41, anterior: 33 },
  { semana: '12/10', feitos: 39, anterior: 36 },
  { semana: '19/10', feitos: 46, anterior: 38 },
]
export const avgByWeekday = [
  { dia: 'Seg', treinos: 6.2 },
  { dia: 'Ter', treinos: 5.1 },
  { dia: 'Qua', treinos: 6.8 },
  { dia: 'Qui', treinos: 4.6 },
  { dia: 'Sex', treinos: 3.9 },
  { dia: 'Sáb', treinos: 2.4 },
  { dia: 'Dom', treinos: 1.1 },
]
export const adherenceByPlan = [
  { plan: 'Hipertrofia A/B', pct: 88, students: 5 },
  { plan: 'Força base', pct: 81, students: 4 },
  { plan: 'Full body', pct: 74, students: 6 },
  { plan: 'Condicionamento 3x', pct: 67, students: 3 },
  { plan: 'Adaptação 2x', pct: 52, students: 2 },
]
export const sparks = {
  alunos: [22, 23, 23, 25, 26, 27, 28],
  treinos: [18, 22, 25, 21, 27, 24, 28],
  semTreinar: [2, 3, 2, 4, 3, 4, 4],
  receita: [3200, 3400, 3350, 3700, 3900, 4100, 4250],
}
export const loadHistory = [
  { data: '05/09', kg: 30 },
  { data: '12/09', kg: 32.5 },
  { data: '19/09', kg: 32.5 },
  { data: '26/09', kg: 35 },
  { data: '03/10', kg: 37.5 },
  { data: '09/10', kg: 40 },
]

/* Evolução de carga por exercício (kg), vista pelo personal no detalhe do aluno. */
export const loadByExercise: Record<string, { data: string; kg: number }[]> = {
  'Supino reto': loadHistory,
  'Agachamento livre': [
    { data: '05/09', kg: 40 },
    { data: '12/09', kg: 42.5 },
    { data: '19/09', kg: 45 },
    { data: '26/09', kg: 45 },
    { data: '03/10', kg: 47.5 },
    { data: '09/10', kg: 50 },
  ],
  'Remada curvada': [
    { data: '05/09', kg: 30 },
    { data: '12/09', kg: 30 },
    { data: '19/09', kg: 32.5 },
    { data: '26/09', kg: 32.5 },
    { data: '03/10', kg: 35 },
    { data: '09/10', kg: 35 },
  ],
}
export const weeklySessions = [
  { semana: '07/09', treinos: 3 },
  { semana: '14/09', treinos: 4 },
  { semana: '21/09', treinos: 3 },
  { semana: '28/09', treinos: 4 },
  { semana: '05/10', treinos: 2 },
  { semana: '12/10', treinos: 1 },
]
