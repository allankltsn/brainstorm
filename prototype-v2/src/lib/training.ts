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
/* from: id do modelo pronto de onde o treino foi copiado (permite restaurar do modelo). */
export type Workout = { id: string; name: string; goal: string; days: number; students: number; sections: WorkoutSection[]; from?: string }

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
  { ...w('t3', 'Full body', 'Condicionamento', 3, 6, ['e07', 'e01', 'e04', 'e13']), from: 'm1' },
  w('t4', 'Força base', 'Força', 3, 4, ['e07', 'e01', 'e06']),
  w('t5', 'Adaptação 2x', 'Iniciantes', 2, 1, ['e08', 'e04', 'e02', 'e13']),
  w('t6', 'Emagrecimento', 'Emagrecer', 4, 1, ['e09', 'e05', 'e10', 'e13']),
]

/* Modelos prontos do aura-fit: ninguém edita o original; "usar" cria uma cópia em Meus treinos. */
export const systemTemplates: (Workout & { level: string; text: string })[] = [
  { ...w('m1', 'Full body 3x', 'Condicionamento', 3, 0, ['e07', 'e01', 'e04', 'e10', 'e13']), level: 'Iniciante', text: 'O corpo todo em três dias, com um dia de descanso entre eles.' },
  { ...w('m2', 'Superior e inferior 4x', 'Ganhar massa', 4, 0, ['e01', 'e05', 'e10', 'e11', 'e12']), level: 'Intermediário', text: 'Dois dias de membros superiores e dois de inferiores.' },
  { ...w('m3', 'Força 5x5', 'Força', 3, 0, ['e07', 'e01', 'e06']), level: 'Intermediário', text: 'Poucos exercícios, cargas altas e progressão a cada semana.' },
  { ...w('m4', 'Adaptação para iniciantes', 'Iniciantes', 2, 0, ['e08', 'e04', 'e02', 'e13']), level: 'Iniciante', text: 'Máquinas e peso do corpo para aprender os movimentos.' },
  { ...w('m5', 'Emagrecimento em circuito', 'Emagrecer', 4, 0, ['e09', 'e05', 'e10', 'e13']), level: 'Todos os níveis', text: 'Circuito com pouco descanso, para gastar mais em menos tempo.' },
]
export const findTemplate = (id?: string | null) => systemTemplates.find((t) => t.id === id)

export const countItems = (wk: Workout) => wk.sections.reduce((t, s) => t + s.items.length, 0)
