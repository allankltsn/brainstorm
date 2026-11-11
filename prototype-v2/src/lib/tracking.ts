/* Dados fictícios de acompanhamento: treinos feitos, modelos de questionário, importação e permissões. */

export type DoneSession = {
  id: string
  name: string
  workout: string
  when: string
  duration: string
  effort: 'Leve' | 'Moderado' | 'Intenso'
  note?: string
  pain?: string
  items: { exercise: string; planned: string; done: string; load: string }[]
}

const base = [
  { exercise: 'Supino reto com halteres', planned: '3 × 10 a 12', done: '3 × 12', load: '18 kg' },
  { exercise: 'Remada curvada', planned: '3 × 10', done: '3 × 10', load: '30 kg' },
  { exercise: 'Desenvolvimento de ombros', planned: '3 × 12', done: '2 × 12', load: '12 kg' },
  { exercise: 'Prancha', planned: '3 × 30 s', done: '3 × 30 s', load: '—' },
]

export const doneSessions: DoneSession[] = [
  { id: 'x1', name: 'Carlos Nunes', workout: 'Força base · Treino A', when: 'Hoje, 07:40', duration: '52 min', effort: 'Moderado', note: 'Consegui subir a carga na remada.', items: base },
  { id: 'x2', name: 'Beatriz Cunha', workout: 'Treino A/B · Treino B', when: 'Hoje, 06:55', duration: '47 min', effort: 'Leve', items: base },
  { id: 'x3', name: 'Helena Matos', workout: 'ABC · Treino C', when: 'Ontem, 19:10', duration: '58 min', effort: 'Intenso', pain: 'Desconforto no ombro direito no desenvolvimento.', items: base },
  { id: 'x4', name: 'Júlia Campos', workout: 'ABC · Treino A', when: 'Ontem, 18:02', duration: '44 min', effort: 'Moderado', items: base },
  { id: 'x5', name: 'Larissa Prado', workout: 'Treino A/B · Treino A', when: 'Ontem, 07:15', duration: '50 min', effort: 'Moderado', items: base },
]

export const formTemplates = [
  { id: 'rotina', name: 'Rotina da semana', questions: 5, origin: 'Do aura-fit' },
  { id: 'avaliacao', name: 'Primeira avaliação', questions: 12, origin: 'Do aura-fit' },
  { id: 'retorno', name: 'Retorno pós-lesão', questions: 7, origin: 'Criado por você' },
]

export const importPreview = [
  { row: 2, text: 'Supino reto 3x10', match: 'Supino reto com halteres', sets: 3, reps: '10', ok: true },
  { row: 3, text: 'Remada curv. 3x10', match: 'Remada curvada', sets: 3, reps: '10', ok: true },
  { row: 4, text: 'Desenv. 3x12', match: 'Desenvolvimento de ombros', sets: 3, reps: '12', ok: true },
  { row: 5, text: 'Puxada frente 3x?', match: null, sets: 3, reps: '', ok: false },
  { row: 6, text: 'Prancha 3x30s', match: 'Prancha', sets: 3, reps: '30 s', ok: true },
]

export const aiDataUsed = [
  { label: 'Objetivo e nível do aluno', used: true, note: 'Informados por você no pedido.' },
  { label: 'Histórico de treinos (séries, cargas, frequência)', used: true, note: 'Só de alunos que liberaram o uso de IA.' },
  { label: 'Dados de saúde', used: false, note: 'Só entram se o aluno liberar saúde e IA.' },
  { label: 'Nome, e-mail e fotos', used: false, note: 'Nunca são enviados para a IA.' },
]

export const permissions = [
  { action: 'Ver e convidar alunos', personal: true, aluno: false, admin: false },
  { action: 'Criar e editar treinos', personal: true, aluno: false, admin: false },
  { action: 'Registrar treino feito', personal: false, aluno: true, admin: false },
  { action: 'Ver dados de saúde (com liberação)', personal: true, aluno: true, admin: false },
  { action: 'Gerenciar usuários', personal: false, aluno: false, admin: true },
  { action: 'Editar planos e cupons', personal: false, aluno: false, admin: true },
]

export const couponUses = [
  { who: 'Rodrigo Teixeira', plan: 'Pro', when: '12/10/2026', saved: 9.98 },
  { who: 'Marcela Duarte', plan: 'Pro', when: '03/10/2026', saved: 9.98 },
  { who: 'Sérgio Matos', plan: 'Pro', when: '21/09/2026', saved: 9.98 },
  { who: 'Vinícius Prado', plan: 'Pro', when: '08/09/2026', saved: 9.98 },
]
