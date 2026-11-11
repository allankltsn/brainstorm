/* Dados 100% fictícios dos relatórios do personal. "Hoje" é 16/10/2026. */

export type ReportPeriod = 'semanas' | 'meses'
export type ReportDelta = { text: string; tone: 'good' | 'bad' | 'neutral' }

export type Report = {
  label: string
  versus: string
  kpis: { id: 'treinos' | 'adesao' | 'alunos' | 'receita'; label: string; value: number; delta: ReportDelta; bars: number[] }[]
  trend: { ponto: string; atual: number; anterior: number }[]
  revenue: { ponto: string; recebido: number }[]
  revenueGoal: number
}

export const reports: Record<ReportPeriod, Report> = {
  semanas: {
    label: 'Últimas 8 semanas',
    versus: 'Estas 8 semanas vs. as 8 anteriores',
    kpis: [
      { id: 'treinos', label: 'Treinos concluídos', value: 298, delta: { text: '+15,5%', tone: 'good' }, bars: [31, 34, 33, 38, 36, 41, 39, 46] },
      { id: 'adesao', label: 'Adesão média', value: 78, delta: { text: '+4 pontos', tone: 'good' }, bars: [70, 72, 71, 75, 74, 79, 77, 82] },
      { id: 'alunos', label: 'Alunos ativos', value: 18, delta: { text: '+3', tone: 'good' }, bars: [15, 15, 16, 16, 17, 17, 18, 18] },
      { id: 'receita', label: 'Receita recebida', value: 8120, delta: { text: '+9,2%', tone: 'good' }, bars: [860, 910, 940, 1010, 980, 1090, 1120, 1210] },
    ],
    trend: [
      { ponto: '24/08', atual: 31, anterior: 27 },
      { ponto: '31/08', atual: 34, anterior: 29 },
      { ponto: '07/09', atual: 33, anterior: 31 },
      { ponto: '14/09', atual: 38, anterior: 30 },
      { ponto: '21/09', atual: 36, anterior: 34 },
      { ponto: '28/09', atual: 41, anterior: 33 },
      { ponto: '05/10', atual: 39, anterior: 36 },
      { ponto: '12/10', atual: 46, anterior: 38 },
    ],
    revenue: [860, 910, 940, 1010, 980, 1090, 1120, 1210].map((recebido, i) => ({ ponto: ['24/08', '31/08', '07/09', '14/09', '21/09', '28/09', '05/10', '12/10'][i], recebido })),
    revenueGoal: 1100,
  },
  meses: {
    label: 'Últimos 6 meses',
    versus: 'Estes 6 meses vs. os 6 anteriores',
    kpis: [
      { id: 'treinos', label: 'Treinos concluídos', value: 812, delta: { text: '+22,1%', tone: 'good' }, bars: [98, 112, 124, 139, 158, 181] },
      { id: 'adesao', label: 'Adesão média', value: 74, delta: { text: '-1 ponto', tone: 'bad' }, bars: [76, 75, 73, 72, 74, 78] },
      { id: 'alunos', label: 'Alunos ativos', value: 18, delta: { text: '+7', tone: 'good' }, bars: [11, 12, 14, 15, 17, 18] },
      { id: 'receita', label: 'Receita recebida', value: 21480, delta: { text: '+31,4%', tone: 'good' }, bars: [2650, 2980, 3400, 3720, 4080, 4650] },
    ],
    trend: [
      { ponto: 'mai', atual: 98, anterior: 84 },
      { ponto: 'jun', atual: 112, anterior: 91 },
      { ponto: 'jul', atual: 124, anterior: 102 },
      { ponto: 'ago', atual: 139, anterior: 118 },
      { ponto: 'set', atual: 158, anterior: 127 },
      { ponto: 'out', atual: 181, anterior: 143 },
    ],
    revenue: [2650, 2980, 3400, 3720, 4080, 4650].map((recebido, i) => ({ ponto: ['mai', 'jun', 'jul', 'ago', 'set', 'out'][i], recebido })),
    revenueGoal: 4200,
  },
}

/* Média de treinos concluídos por dia da semana. */
export const avgByWeekday = [
  { dia: 'Seg', treinos: 6.2 },
  { dia: 'Ter', treinos: 5.1 },
  { dia: 'Qua', treinos: 6.8 },
  { dia: 'Qui', treinos: 4.6 },
  { dia: 'Sex', treinos: 3.9 },
  { dia: 'Sáb', treinos: 2.4 },
  { dia: 'Dom', treinos: 1.1 },
]

/* Adesão: treinos feitos sobre treinos planejados, em %. */
export const adherenceByPlan = [
  { id: 'hip', plan: 'Hipertrofia A/B', pct: 88, students: 5 },
  { id: 'for', plan: 'Força base', pct: 81, students: 4 },
  { id: 'full', plan: 'Full body', pct: 74, students: 6 },
  { id: 'cond', plan: 'Condicionamento 3x', pct: 67, students: 3 },
  { id: 'adap', plan: 'Adaptação 2x', pct: 52, students: 2 },
]

export const reportBreakdown: { id: string; label: string; value: string; tone: 'good' | 'bad' | 'neutral'; spark: number[] }[] = [
  { id: 'plan', label: 'Treinos planejados', value: '382', tone: 'neutral', spark: [44, 46, 46, 48, 48, 49, 50, 51] },
  { id: 'done', label: 'Treinos concluídos', value: '298', tone: 'good', spark: [31, 34, 33, 38, 36, 41, 39, 46] },
  { id: 'miss', label: 'Faltas', value: '84', tone: 'bad', spark: [13, 12, 13, 10, 12, 8, 11, 5] },
  { id: 'check', label: 'Check-ins feitos', value: '41', tone: 'good', spark: [3, 5, 4, 6, 5, 6, 5, 7] },
  { id: 'forms', label: 'Questionários respondidos', value: '63', tone: 'good', spark: [6, 7, 7, 8, 8, 9, 8, 10] },
  { id: 'pain', label: 'Relatos de dor', value: '5', tone: 'neutral', spark: [1, 0, 1, 1, 0, 1, 0, 1] },
]

/* Minibarras dos números do início (últimos 7 dias ou 7 meses). */
export const homeSparks = {
  alunos: [14, 15, 15, 16, 17, 17, 18],
  treinos: [18, 22, 25, 21, 27, 24, 28],
  receita: [3200, 3400, 3350, 3700, 3900, 4100, 4250],
}
