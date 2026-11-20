/*
 * Camada de acesso fina, no formato dos endpoints do BFF do AuraFit.
 * Hoje opera sobre o mock em memória (db); amanhã a implementação troca por `fetch`
 * no BFF global, sem as telas mudarem. As telas SÓ falam com este módulo.
 */
import { db } from './data'
import type { User, UserSettings, Empresa, Membership, MembershipStatus, Invite, Role, Profissional, Disponibilidade } from './data'

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
  const e = db.empresa
  if (parcial.abertura !== undefined || parcial.fechamento !== undefined) {
    const a = parcial.abertura ?? e.abertura
    const b = parcial.fechamento ?? e.fechamento
    if (!horarioValido(a, b)) return { ok: false, erro: 'A abertura precisa ser antes do fechamento (HH:MM).' }
  }
  if (parcial.gradeMin !== undefined && !gradeValida(parcial.gradeMin))
    return { ok: false, erro: 'A grade deve ser 15, 30 ou 60 minutos.' }
  if (parcial.slug !== undefined && parcial.slug.trim() === '')
    return { ok: false, erro: 'O identificador (slug) não pode ficar vazio.' }
  if (parcial.nome !== undefined && parcial.nome.trim() === '')
    return { ok: false, erro: 'O nome não pode ficar vazio.' }
  db.atualizarEmpresa(parcial)
  return { ok: true }
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
}): Profissional {
  const n = Date.now()
  const userId = `u-${n}`
  const agora = new Date().toISOString()
  db.users.push({ id: userId, email: `${userId}@aurabarber.app`, name: dados.nome, status: 'ACTIVE', emailVerified: false, criadoEm: agora })
  db.memberships.push({ id: `m-${n}`, userId, empresaId: db.empresa.id, role: 'barbeiro', status: 'ACTIVE', criadoEm: agora })
  const prof: Profissional = { id: `p-${n}`, userId, ...dados }
  db.profissionais.push(prof)
  return prof
}

// ---- Identidade atual (resolve o User do papel/identidade logados) ----
export function userIdDaIdentidade(role: Role, profId: string, clienteId: string): string | undefined {
  if (role === 'dono') return db.empresa.ownerUserId
  if (role === 'barbeiro') return db.profissionalById(profId)?.userId
  return db.clienteById(clienteId)?.userId
}
