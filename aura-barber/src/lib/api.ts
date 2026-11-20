/*
 * Camada de acesso fina, no formato dos endpoints do BFF do AuraFit.
 * Hoje opera sobre o mock em memória (db); amanhã a implementação troca por `fetch`
 * no BFF global, sem as telas mudarem. As telas SÓ falam com este módulo.
 */
import { db } from './data'
import type { User, UserSettings, Empresa, Filial, Membership, MembershipStatus, Invite, Role, Profissional, Agendamento, Disponibilidade } from './data'

// ---- Usuário ----
export function getMe(userId: string): User | undefined {
  return db.userById(userId)
}

export function updateUser(userId: string, parcial: Partial<Pick<User, 'name' | 'phone' | 'avatarUrl'>>): void {
  const u = db.userById(userId)
  if (u) Object.assign(u, parcial)
}

const SETTINGS_PADRAO: Omit<UserSettings, 'userId'> = {
  theme: 'system',
  locale: 'pt-BR',
  notifyEmail: true,
  notifyPush: true,
  notifyWhatsapp: false,
}

export function getMySettings(userId: string): UserSettings {
  return db.userSettings.find((s) => s.userId === userId) ?? { userId, ...SETTINGS_PADRAO }
}

export function updateMySettings(userId: string, parcial: Partial<Omit<UserSettings, 'userId'>>): void {
  const s = db.userSettings.find((x) => x.userId === userId)
  if (s) Object.assign(s, parcial)
  else db.userSettings.push({ userId, ...SETTINGS_PADRAO, ...parcial })
}

// ---- Empresa ----
export function getEmpresa(): Empresa {
  return db.empresa
}

export function gradeValida(n: number): boolean {
  return n === 15 || n === 30 || n === 60
}

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/
export function horarioValido(abertura: string, fechamento: string): boolean {
  if (!HHMM.test(abertura) || !HHMM.test(fechamento)) return false
  const min = (s: string) => {
    const [h, m] = s.split(':').map(Number)
    return h * 60 + m
  }
  return min(abertura) < min(fechamento)
}

export function updateEmpresa(parcial: Partial<Empresa>): { ok: boolean; erro?: string } {
  if (parcial.slug !== undefined && parcial.slug.trim() === '')
    return { ok: false, erro: 'O identificador (slug) não pode ficar vazio.' }
  if (parcial.nome !== undefined && parcial.nome.trim() === '')
    return { ok: false, erro: 'O nome não pode ficar vazio.' }
  db.atualizarEmpresa(parcial)
  return { ok: true }
}

// ---- Filiais (horário/grade vivem aqui, não na Empresa) ----
export function listFiliais(): Filial[] {
  return db.filiais
}
export function getFilial(id: string): Filial | undefined {
  return db.filialById(id)
}

export function updateFilial(id: string, parcial: Partial<Filial>): { ok: boolean; erro?: string } {
  const f = db.filialById(id)
  if (!f) return { ok: false, erro: 'Filial não encontrada.' }
  if (parcial.abertura !== undefined || parcial.fechamento !== undefined) {
    const a = parcial.abertura ?? f.abertura
    const b = parcial.fechamento ?? f.fechamento
    if (!horarioValido(a, b)) return { ok: false, erro: 'A abertura precisa ser antes do fechamento (HH:MM).' }
  }
  if (parcial.gradeMin !== undefined && !gradeValida(parcial.gradeMin))
    return { ok: false, erro: 'A grade deve ser 15, 30 ou 60 minutos.' }
  if (parcial.nome !== undefined && parcial.nome.trim() === '')
    return { ok: false, erro: 'O nome da filial não pode ficar vazio.' }
  db.atualizarFilial(id, parcial)
  return { ok: true }
}

export function criarFilial(dados: { nome: string; abertura: string; fechamento: string; gradeMin: number }): {
  ok: boolean
  erro?: string
  filial?: Filial
} {
  if (dados.nome.trim() === '') return { ok: false, erro: 'O nome da filial não pode ficar vazio.' }
  if (!horarioValido(dados.abertura, dados.fechamento))
    return { ok: false, erro: 'A abertura precisa ser antes do fechamento (HH:MM).' }
  if (!gradeValida(dados.gradeMin)) return { ok: false, erro: 'A grade deve ser 15, 30 ou 60 minutos.' }
  const f: Filial = { id: `f-${Date.now()}`, empresaId: db.empresa.id, status: 'ACTIVE', ...dados }
  db.pushFilial(f)
  return { ok: true, filial: f }
}

export function profissionaisDaFilial(filialId: string): Profissional[] {
  return db.profissionais.filter((p) => p.filialId === filialId)
}
export function agendamentosDaFilial(filialId: string): Agendamento[] {
  return db.agendamentos.filter((a) => a.filialId === filialId)
}

/** Filial inicial por papel: barbeiro usa a própria; demais, a primeira. Cai na primeira se o id sumiu. */
export function filialPadrao(role: Role, profId: string): string {
  const primeira = db.filiais[0]?.id ?? ''
  if (role === 'barbeiro') {
    const f = db.profissionalById(profId)?.filialId
    return f && db.filialById(f) ? f : primeira
  }
  return primeira
}

// ---- Memberships e convites ----
export type MembershipView = Membership & { user: User }

export function listMemberships(role: Role): MembershipView[] {
  return db.memberships
    .filter((m) => m.role === role)
    .map((m) => ({ ...m, user: db.userById(m.userId) }))
    .filter((m): m is MembershipView => Boolean(m.user))
}

function gerarCodigo(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}
function emDias(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export function createInvite(role: Role): Invite {
  const inv: Invite = {
    id: `i-${Date.now()}`,
    codigo: gerarCodigo(),
    empresaId: db.empresa.id,
    role,
    expiraEm: emDias(7),
  }
  db.pushInvite(inv)
  return inv
}

export function setMembershipStatus(id: string, status: MembershipStatus): void {
  const m = db.memberships.find((x) => x.id === id)
  if (m) m.status = status
}

/** Cria um profissional já nascendo como User + Membership(barbeiro), fiel ao padrão identidade. */
export function criarProfissional(dados: {
  nome: string
  servicos: string[]
  disponibilidade: Disponibilidade[]
  comissaoPct: number
  filialId?: string
}): Profissional {
  const n = Date.now()
  const userId = `u-${n}`
  const agora = new Date().toISOString()
  const filialId = dados.filialId ?? db.filiais[0]?.id ?? ''
  db.users.push({ id: userId, email: `${userId}@aurabarber.app`, name: dados.nome, status: 'ACTIVE', emailVerified: false, criadoEm: agora })
  db.memberships.push({ id: `m-${n}`, userId, empresaId: db.empresa.id, filialId, role: 'barbeiro', status: 'ACTIVE', criadoEm: agora })
  const prof: Profissional = {
    id: `p-${n}`,
    userId,
    filialId,
    nome: dados.nome,
    servicos: dados.servicos,
    disponibilidade: dados.disponibilidade,
    comissaoPct: dados.comissaoPct,
  }
  db.profissionais.push(prof)
  return prof
}

// ---- Identidade atual (resolve o User do papel/identidade logados) ----
export function userIdDaIdentidade(role: Role, profId: string, clienteId: string): string | undefined {
  if (role === 'dono') return db.empresa.ownerUserId
  if (role === 'barbeiro') return db.profissionalById(profId)?.userId
  return db.clienteById(clienteId)?.userId
}
