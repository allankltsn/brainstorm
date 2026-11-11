/* Dados 100% fictícios: mensalidades que o personal cobra dos alunos e créditos de IA. "Hoje" é 16/10/2026. */

export type ChargeStatus = 'pago' | 'pendente' | 'atrasado'
export type ChargeMethod = 'Pix' | 'Cartão' | 'Boleto'
export type Charge = {
  id: string
  sid: string
  name: string
  label: string
  amount: number
  due: string
  status: ChargeStatus
  method: ChargeMethod
  paidOn?: string
}

export const charges: Charge[] = [
  { id: 'b01', sid: 's02', name: 'Felipe Almeida', label: 'Mensalidade de outubro', amount: 280, due: '2026-10-05', status: 'atrasado', method: 'Pix' },
  { id: 'b02', sid: 's04', name: 'Paulo Ramos', label: 'Mensalidade de outubro', amount: 320, due: '2026-10-10', status: 'atrasado', method: 'Boleto' },
  { id: 'b03', sid: 's01', name: 'Marina Lopes', label: 'Mensalidade de outubro', amount: 220, due: '2026-10-20', status: 'pendente', method: 'Pix' },
  { id: 'b04', sid: 's06', name: 'Renata Silva', label: 'Mensalidade de outubro', amount: 220, due: '2026-10-20', status: 'pendente', method: 'Cartão' },
  { id: 'b05', sid: 's05', name: 'Jorge Batista', label: 'Mensalidade de outubro', amount: 250, due: '2026-10-25', status: 'pendente', method: 'Pix' },
  { id: 'b06', sid: 's03', name: 'Carlos Nunes', label: 'Mensalidade de outubro', amount: 250, due: '2026-10-05', status: 'pago', method: 'Pix', paidOn: '2026-10-04' },
  { id: 'b07', sid: 's08', name: 'Larissa Prado', label: 'Mensalidade de outubro', amount: 220, due: '2026-10-05', status: 'pago', method: 'Cartão', paidOn: '2026-10-05' },
  { id: 'b08', sid: 's10', name: 'Helena Matos', label: 'Mensalidade de outubro', amount: 320, due: '2026-10-08', status: 'pago', method: 'Pix', paidOn: '2026-10-07' },
  { id: 'b09', sid: 's12', name: 'Beatriz Cunha', label: 'Pacote de 8 aulas', amount: 560, due: '2026-10-10', status: 'pago', method: 'Pix', paidOn: '2026-10-09' },
  { id: 'b10', sid: 's18', name: 'Júlia Campos', label: 'Mensalidade de outubro', amount: 220, due: '2026-10-12', status: 'pago', method: 'Boleto', paidOn: '2026-10-12' },
]

export const CHARGE_METHODS: ChargeMethod[] = ['Pix', 'Cartão', 'Boleto']

/* Visão do aluno (Jorge Batista): o que ele deve à personal e o que já pagou. */
export const myCharges: Charge[] = [
  charges[4],
  { id: 'm03', sid: 's05', name: 'Jorge Batista', label: 'Mensalidade de setembro', amount: 250, due: '2026-09-25', status: 'pago', method: 'Pix', paidOn: '2026-09-24' },
  { id: 'm02', sid: 's05', name: 'Jorge Batista', label: 'Mensalidade de agosto', amount: 250, due: '2026-08-25', status: 'pago', method: 'Pix', paidOn: '2026-08-25' },
  { id: 'm01', sid: 's05', name: 'Jorge Batista', label: 'Avaliação inicial', amount: 120, due: '2026-08-05', status: 'pago', method: 'Cartão', paidOn: '2026-08-03' },
]

export const PIX_CODE_EXAMPLE = '00020126580014br.gov.bcb.pix0136exemplo-aura-fit-5204000053039865406250.005802BR6304ABCD'

export const aiCredits = {
  planName: 'Pro',
  monthly: 100,
  used: 62,
  extra: 20,
  renewsOn: '2026-11-03',
}

/* Quanto cada ação da Aura consome. */
export const aiCosts = [
  { action: 'Sugerir um treino completo', cost: 5 },
  { action: 'Ler uma planilha importada', cost: 3 },
  { action: 'Prioridades do dia', cost: 1 },
  { action: 'Rascunho de mensagem', cost: 1 },
]

export const aiUsage = [
  { id: 'a8', date: '2026-10-16', action: 'Prioridades do dia', who: null, cost: 1 },
  { id: 'a7', date: '2026-10-15', action: 'Rascunho de mensagem', who: 'Marina Lopes', cost: 1 },
  { id: 'a6', date: '2026-10-15', action: 'Sugerir um treino completo', who: 'Daniel Costa', cost: 5 },
  { id: 'a5', date: '2026-10-14', action: 'Prioridades do dia', who: null, cost: 1 },
  { id: 'a4', date: '2026-10-13', action: 'Ler uma planilha importada', who: null, cost: 3 },
  { id: 'a3', date: '2026-10-12', action: 'Sugerir um treino completo', who: 'Carlos Nunes', cost: 5 },
  { id: 'a2', date: '2026-10-10', action: 'Rascunho de mensagem', who: 'Felipe Almeida', cost: 1 },
  { id: 'a1', date: '2026-10-09', action: 'Sugerir um treino completo', who: 'Renata Silva', cost: 5 },
]

export const aiPacks = [
  { id: 'p50', credits: 50, price: 14.9 },
  { id: 'p150', credits: 150, price: 39.9, best: true },
  { id: 'p400', credits: 400, price: 89.9 },
]
