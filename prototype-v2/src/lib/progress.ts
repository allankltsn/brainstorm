/* Dados 100% fictícios de evolução do aluno: treinos feitos, cargas, frequência, check-ins e linha do tempo. "Hoje" é 16/10/2026. */

export type PastSession = {
  id: string
  date: string
  workout: string
  minutes: number
  effort: 'Leve' | 'Moderado' | 'Intenso'
  volume: number
  pain?: string
}

export const pastSessions: PastSession[] = [
  { id: 'h12', date: '2026-10-14', workout: 'Treino B: Inferior', minutes: 51, effort: 'Intenso', volume: 4820 },
  { id: 'h11', date: '2026-10-12', workout: 'Treino A: Superior', minutes: 47, effort: 'Moderado', volume: 3910 },
  { id: 'h10', date: '2026-10-09', workout: 'Treino B: Inferior', minutes: 49, effort: 'Moderado', volume: 4650 },
  { id: 'h09', date: '2026-10-07', workout: 'Treino A: Superior', minutes: 44, effort: 'Moderado', volume: 3840 },
  { id: 'h08', date: '2026-10-05', workout: 'Treino B: Inferior', minutes: 53, effort: 'Intenso', volume: 4590, pain: 'Desconforto leve no joelho esquerdo no afundo.' },
  { id: 'h07', date: '2026-09-30', workout: 'Treino A: Superior', minutes: 46, effort: 'Leve', volume: 3720 },
  { id: 'h06', date: '2026-09-28', workout: 'Treino B: Inferior', minutes: 50, effort: 'Moderado', volume: 4410 },
  { id: 'h05', date: '2026-09-23', workout: 'Treino A: Superior', minutes: 45, effort: 'Moderado', volume: 3650 },
  { id: 'h04', date: '2026-09-21', workout: 'Treino B: Inferior', minutes: 48, effort: 'Moderado', volume: 4280 },
  { id: 'h03', date: '2026-09-16', workout: 'Treino A: Superior', minutes: 43, effort: 'Leve', volume: 3540 },
  { id: 'h02', date: '2026-09-14', workout: 'Treino B: Inferior', minutes: 47, effort: 'Moderado', volume: 4120 },
  { id: 'h01', date: '2026-09-09', workout: 'Treino A: Superior', minutes: 42, effort: 'Leve', volume: 3400 },
]

const WEEKS = ['24/08', '31/08', '07/09', '14/09', '21/09', '28/09', '05/10', '12/10']

/* Maior carga da semana em cada exercício, em kg. */
export const loadByExercise: { id: string; name: string; series: { semana: string; carga: number }[] }[] = [
  { id: 'supino', name: 'Supino reto com halteres', loads: [14, 14, 16, 16, 16, 18, 18, 20] },
  { id: 'remada', name: 'Remada curvada', loads: [24, 26, 26, 28, 28, 30, 30, 32] },
  { id: 'agachamento', name: 'Agachamento livre', loads: [40, 40, 45, 45, 50, 50, 55, 55] },
  { id: 'desenvolvimento', name: 'Desenvolvimento de ombros', loads: [10, 10, 10, 12, 12, 12, 12, 14] },
].map(({ loads, ...e }) => ({ ...e, series: loads.map((carga, i) => ({ semana: WEEKS[i], carga })) }))

export const WEEKLY_GOAL = 3
export const weeklyFrequency = [2, 3, 1, 2, 2, 2, 3, 2].map((treinos, i) => ({ semana: WEEKS[i], treinos }))

export type CheckInEntry = {
  id: string
  date: string
  weight: number
  waist?: number
  hip?: number
  arm?: number
  thigh?: number
  photos: number
  note?: string
}

export const checkIns: CheckInEntry[] = [
  { id: 'c5', date: '2026-10-02', weight: 82.4, waist: 91, hip: 101, arm: 35.5, thigh: 58, photos: 2, note: 'Semana boa, dormi melhor.' },
  { id: 'c4', date: '2026-09-18', weight: 83.1, waist: 92, hip: 101.5, arm: 35, thigh: 57.5, photos: 0 },
  { id: 'c3', date: '2026-09-04', weight: 83.9, waist: 93, hip: 102, arm: 35, thigh: 57.5, photos: 2 },
  { id: 'c2', date: '2026-08-21', weight: 84.6, waist: 94, hip: 102.5, arm: 34.5, thigh: 57, photos: 0, note: 'Viajei a trabalho, treinei menos.' },
  { id: 'c1', date: '2026-08-07', weight: 85.2, waist: 95, hip: 103, arm: 34.5, thigh: 57, photos: 3 },
]

export const CHECKIN_EVERY_DAYS = 14
export const NEXT_CHECKIN = '2026-10-16'

export type TimelineKind = 'treino' | 'checkin' | 'questionario' | 'mensagem' | 'anotacao' | 'vinculo'
export type TimelineEvent = { id: string; date: string; time?: string; kind: TimelineKind; title: string; detail?: string; to?: string }

export const timeline: TimelineEvent[] = [
  { id: 't12', date: '2026-10-14', time: '07:40', kind: 'treino', title: 'Concluiu o Treino B: Inferior', detail: '51 min · esforço intenso', to: '/acompanhamento/treinos/x1' },
  { id: 't11', date: '2026-10-13', time: '18:12', kind: 'mensagem', title: 'Você enviou uma mensagem', detail: '“Boa! Na quinta a gente sobe a carga do agachamento.”', to: '/mensagens' },
  { id: 't10', date: '2026-10-12', time: '07:35', kind: 'treino', title: 'Concluiu o Treino A: Superior', detail: '47 min · esforço moderado', to: '/acompanhamento/treinos/x1' },
  { id: 't09', date: '2026-10-10', time: '09:02', kind: 'anotacao', title: 'Anotação', detail: 'Pediu para evitar afundo até o joelho melhorar. Troquei por leg press.' },
  { id: 't08', date: '2026-10-08', time: '20:15', kind: 'questionario', title: 'Respondeu “Rotina da semana”', detail: 'Cansaço 6 de 10 · falou de dor no joelho', to: '/acompanhamento/respostas/r1' },
  { id: 't07', date: '2026-10-05', time: '07:48', kind: 'treino', title: 'Concluiu o Treino B: Inferior', detail: '53 min · relatou desconforto no joelho', to: '/acompanhamento/treinos/x1' },
  { id: 't06', date: '2026-10-02', time: '08:10', kind: 'checkin', title: 'Fez o check-in', detail: '82,4 kg · 0,7 kg a menos que no anterior · 2 fotos' },
  { id: 't05', date: '2026-09-21', time: '10:30', kind: 'anotacao', title: 'Anotação', detail: 'Prefere treinar cedo. Evitar sessões com mais de 50 minutos.' },
  { id: 't04', date: '2026-09-18', time: '08:05', kind: 'checkin', title: 'Fez o check-in', detail: '83,1 kg · 0,8 kg a menos que no anterior' },
  { id: 't03', date: '2026-09-01', time: '09:00', kind: 'vinculo', title: 'Novo plano de treino', detail: 'Força base, de 01/09/2026 a 30/11/2026' },
  { id: 't02', date: '2026-08-07', time: '08:20', kind: 'checkin', title: 'Fez o primeiro check-in', detail: '85,2 kg · 3 fotos' },
  { id: 't01', date: '2026-08-03', time: '14:45', kind: 'vinculo', title: 'Aceitou o convite', detail: 'Começou o acompanhamento com você.' },
]
