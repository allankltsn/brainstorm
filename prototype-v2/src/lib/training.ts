/* Exercícios e treinos de exemplo (fictícios). */

export const GROUPS = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core'] as const
export type Group = (typeof GROUPS)[number]

export type Exercise = {
  id: string
  name: string
  group: Group
  equipment: string
  kind: 'Força' | 'Mobilidade' | 'Cardio'
  muscles: string[]
  steps: string[]
  tips: string[]
  seconds: number
}

const ex = (id: string, name: string, group: Group, equipment: string, muscles: string[], steps: string[], tips: string[], kind: Exercise['kind'] = 'Força'): Exercise => ({
  id,
  name,
  group,
  equipment,
  kind,
  muscles,
  steps,
  tips,
  seconds: 30 + ((Number(id.slice(1)) * 7) % 30),
})

export const exercises: Exercise[] = [
  ex('e01', 'Supino reto', 'Peito', 'Barra e banco', ['Peitoral', 'Tríceps', 'Ombro anterior'], ['Deite no banco e mantenha os pés firmes no chão.', 'Segure a barra com as mãos um pouco mais abertas que a largura dos ombros.', 'Desça a barra controladamente até o peito.', 'Empurre a barra para cima, mantendo o core ativado.'], ['Mantenha a lombar encostada no banco.', 'Controle o movimento.', 'Evite abrir demais os cotovelos.']),
  ex('e02', 'Supino inclinado', 'Peito', 'Halteres e banco', ['Peitoral superior', 'Ombro anterior'], ['Ajuste o banco entre 30 e 45 graus.', 'Suba os halteres até quase estender os braços.', 'Desça devagar até a linha do peito.'], ['Não bata os halteres no alto.', 'Mantenha os punhos firmes.']),
  ex('e03', 'Crucifixo', 'Peito', 'Halteres e banco', ['Peitoral'], ['Deite com os halteres acima do peito.', 'Abra os braços com os cotovelos levemente dobrados.', 'Volte fechando o movimento como um abraço.'], ['Use carga que permita controlar a descida.']),
  ex('e04', 'Puxada alta', 'Costas', 'Polia', ['Dorsal', 'Bíceps'], ['Sente e prenda as coxas no apoio.', 'Puxe a barra até a altura do queixo.', 'Volte devagar até estender os braços.'], ['Não jogue o tronco para trás.', 'Leve os cotovelos para baixo e para trás.']),
  ex('e05', 'Remada curvada', 'Costas', 'Barra', ['Dorsal', 'Trapézio', 'Bíceps'], ['Incline o tronco com a coluna reta.', 'Puxe a barra em direção ao umbigo.', 'Desça controlando o peso.'], ['Mantenha o abdômen firme.', 'Não arredonde as costas.']),
  ex('e06', 'Levantamento terra', 'Costas', 'Barra', ['Posterior de coxa', 'Glúteos', 'Lombar'], ['Posicione os pés na largura do quadril.', 'Segure a barra e mantenha as costas retas.', 'Suba estendendo quadril e joelhos juntos.'], ['Barra sempre próxima do corpo.', 'Comece com carga leve.']),
  ex('e07', 'Agachamento livre', 'Pernas', 'Barra', ['Quadríceps', 'Glúteos'], ['Apoie a barra nos ombros.', 'Desça como se fosse sentar, joelhos na direção dos pés.', 'Suba empurrando o chão.'], ['Calcanhares no chão.', 'Olhe para a frente.']),
  ex('e08', 'Leg press', 'Pernas', 'Máquina', ['Quadríceps', 'Glúteos'], ['Apoie os pés na plataforma na largura dos ombros.', 'Desça até os joelhos formarem cerca de 90 graus.', 'Empurre sem travar os joelhos.'], ['Não tire o quadril do banco.']),
  ex('e09', 'Afundo', 'Pernas', 'Halteres', ['Quadríceps', 'Glúteos'], ['Dê um passo à frente.', 'Desça até o joelho de trás quase tocar o chão.', 'Volte e troque a perna.'], ['Tronco reto.', 'Passo longo o bastante para o joelho não passar do pé.']),
  ex('e10', 'Desenvolvimento', 'Ombros', 'Halteres', ['Deltoides', 'Tríceps'], ['Sente com os halteres na altura dos ombros.', 'Empurre para cima até quase estender os braços.', 'Desça devagar.'], ['Não arqueie a lombar.']),
  ex('e11', 'Rosca direta', 'Braços', 'Barra', ['Bíceps'], ['Fique em pé com a barra à frente das coxas.', 'Dobre os cotovelos levando a barra até o peito.', 'Desça controlando.'], ['Cotovelos parados ao lado do corpo.']),
  ex('e12', 'Tríceps na polia', 'Braços', 'Polia', ['Tríceps'], ['Segure a barra com os cotovelos junto ao corpo.', 'Estenda os braços para baixo.', 'Volte até 90 graus.'], ['Só o antebraço se move.']),
  ex('e13', 'Prancha', 'Core', 'Peso do corpo', ['Abdômen', 'Lombar'], ['Apoie antebraços e pontas dos pés.', 'Mantenha o corpo em linha reta.', 'Respire normalmente.'], ['Não deixe o quadril cair.']),
  ex('e14', 'Mobilidade de ombros', 'Ombros', 'Bastão', ['Ombros'], ['Segure o bastão com os braços estendidos.', 'Leve acima da cabeça e para trás, sem dor.', 'Volte devagar.'], ['Movimento lento e sem forçar.'], 'Mobilidade'),
]

export const findExercise = (id?: string) => exercises.find((e) => e.id === id)

export type WorkoutItem = { key: string; exerciseId: string; sets: number; reps: string; rest: number; note?: string }
export type WorkoutSection = { id: string; title: string; items: WorkoutItem[] }
export type Workout = { id: string; name: string; goal: string; days: number; students: number; sections: WorkoutSection[] }

let n = 0
export const item = (exerciseId: string, sets = 3, reps = '10 a 12', rest = 60): WorkoutItem => ({ key: `i${++n}`, exerciseId, sets, reps, rest })

const w = (id: string, name: string, goal: string, days: number, students: number, main: string[]): Workout => ({
  id,
  name,
  goal,
  days,
  students,
  sections: [
    { id: 'aquecimento', title: 'Aquecimento', items: [item('e14', 2, '10', 30)] },
    { id: 'principal', title: 'Exercícios principais', items: main.map((e) => item(e)) },
  ],
})

export const workouts: Workout[] = [
  w('t1', 'Treino A · Superior', 'Ganhar massa', 4, 5, ['e01', 'e05', 'e10', 'e11']),
  w('t2', 'Treino B · Inferior', 'Ganhar massa', 4, 5, ['e07', 'e08', 'e09']),
  w('t3', 'Full body', 'Condicionamento', 3, 6, ['e07', 'e01', 'e04', 'e13']),
  w('t4', 'Força base', 'Força', 3, 4, ['e07', 'e01', 'e06']),
  w('t5', 'Adaptação 2x', 'Iniciantes', 2, 1, ['e08', 'e04', 'e02', 'e13']),
  w('t6', 'Emagrecimento', 'Emagrecer', 4, 1, ['e09', 'e05', 'e10', 'e13']),
]

export const countItems = (wk: Workout) => wk.sections.reduce((t, s) => t + s.items.length, 0)

/* estimativa simples: 40 s por série mais o descanso */
export const estimateMinutes = (items: WorkoutItem[]) => Math.round(items.reduce((t, i) => t + i.sets * (40 + i.rest), 0) / 60)
export const workoutMinutes = (wk: Workout) => estimateMinutes(wk.sections.flatMap((s) => s.items))
export const findWorkout = (id?: string | null) => workouts.find((x) => x.id === id)

/* Programação semanal: um treino (ou descanso) por dia. "Hoje" é sexta, como no resto do protótipo. */
export const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] as const
export const TODAY_INDEX = 4
export type WeekPlan = (string | null)[]

const PLANS: Record<string, WeekPlan> = {
  'Hipertrofia A/B': ['t1', 't2', null, 't1', 't2', null, null],
  'Treino A/B': ['t1', null, 't2', null, 't1', 't2', null],
  ABC: ['t1', 't2', null, 't3', 't1', null, null],
  'Full body': ['t3', null, 't3', null, 't3', null, null],
  'Condicionamento 3x': ['t3', null, 't3', null, 't3', null, null],
  'Força base': ['t4', null, 't4', null, 't1', null, null],
  'Adaptação 2x': [null, 't5', null, null, 't5', null, null],
  Emagrecimento: ['t6', 't3', null, 't6', 't3', null, null],
}
const REST_WEEK: WeekPlan = [null, null, null, null, null, null, null]
export const weekPlanFor = (plan: string | null): WeekPlan => [...((plan && PLANS[plan]) || REST_WEEK)]

/* Aluno logado (Jorge): semana, o que já fez e a carga usada da última vez em cada exercício. */
export const myWeek: WeekPlan = weekPlanFor('Força base')
export const myDoneDays = [0, 2]
const LAST_LOAD: Record<string, number> = { e01: 40, e02: 14, e03: 10, e04: 45, e05: 35, e06: 60, e07: 50, e08: 120, e09: 12, e10: 12, e11: 20, e12: 25 }
export const lastLoad = (exerciseId: string): number | null => LAST_LOAD[exerciseId] ?? null
export const firstReps = (reps: string) => Number(reps.match(/\d+/)?.[0] ?? 10)
