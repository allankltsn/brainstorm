/* Dados 100% fictícios de engajamento: primeiros passos do aluno, aniversários e frase do dia. "Hoje" é 16/10/2026. */

export type OnboardingStep = { id: string; label: string; detail: string; to: string; cta: string; done: boolean }

export const studentOnboarding: OnboardingStep[] = [
  { id: 'convite', label: 'Aceitar o convite da sua personal', detail: 'Feito quando você criou sua conta.', to: '/inicio', cta: 'Ver início', done: true },
  { id: 'saude', label: 'Responder a primeira avaliação', detail: 'Conta seu objetivo, sua rotina e se há alguma restrição.', to: '/inicio', cta: 'Responder', done: true },
  { id: 'liberar', label: 'Escolher o que sua personal pode ver', detail: 'Dados de saúde, fotos e uso de IA. Você muda isso quando quiser.', to: '/configuracoes?aba=privacidade', cta: 'Escolher', done: false },
  { id: 'checkin', label: 'Fazer o primeiro check-in', detail: 'Peso e medidas de hoje, para acompanhar sua evolução.', to: '/check-in', cta: 'Fazer check-in', done: false },
  { id: 'treino', label: 'Concluir o primeiro treino', detail: 'Abra o treino de hoje e marque as séries feitas.', to: '/treino', cta: 'Abrir treino', done: false },
  { id: 'avisos', label: 'Ligar o lembrete de treino', detail: 'Um aviso no horário que você costuma treinar.', to: '/configuracoes?aba=avisos', cta: 'Ajustar avisos', done: false },
]

/* inDays: quantos dias faltam (0 = hoje). */
export const birthdays = [
  { sid: 's08', name: 'Larissa Prado', day: '2026-10-16', inDays: 0, age: 29 },
  { sid: 's03', name: 'Carlos Nunes', day: '2026-10-18', inDays: 2, age: 41 },
  { sid: 's12', name: 'Beatriz Cunha', day: '2026-10-21', inDays: 5, age: 34 },
]

export const birthdayDraft = (first: string) => `Parabéns, ${first}! Que este novo ano venha com saúde e muita disposição. Bora comemorar com um treino caprichado?`

export const quotes = [
  { text: 'Constância vence intensidade. O treino de hoje não precisa ser perfeito, só precisa acontecer.', by: 'aura-fit' },
  { text: 'Você não precisa de motivação todos os dias. Precisa de um horário marcado.', by: 'aura-fit' },
  { text: 'Pequenos avanços, repetidos por meses, viram grandes mudanças.', by: 'aura-fit' },
]

/* 16/10 é o dia 289 do ano; em produção, o índice vem da data real. */
export const quoteOfDay = quotes[289 % quotes.length]
