/* Dados fictícios das telas de versões, responsáveis, perfis e conta. */

export const workoutVersions = [
  { v: 4, when: '12/10/2026', by: 'Carla Mendes', changes: ['Trocou rosca direta por rosca martelo', 'Descanso do supino de 60 s para 90 s'], current: true },
  { v: 3, when: '28/09/2026', by: 'Carla Mendes', changes: ['Adicionou prancha ao fim do treino'], current: false },
  { v: 2, when: '10/09/2026', by: 'Sugestão da IA, aprovada por você', changes: ['Aumentou as séries da remada de 2 para 3'], current: false },
  { v: 1, when: '01/09/2026', by: 'Carla Mendes', changes: ['Criou o treino'], current: false },
]

export type Guardian = { id: string; name: string; relation: string; email: string; main: boolean }
export const guardians: Guardian[] = [
  { id: 'g1', name: 'Sandra Lopes', relation: 'Mãe', email: 'sandra.lopes@aura.example', main: true },
  { id: 'g2', name: 'Marcos Lopes', relation: 'Pai', email: 'marcos.lopes@aura.example', main: false },
]

export const accessProfiles = [
  { id: 'personal', name: 'Personal', people: 5, text: 'Cuida dos próprios alunos, treinos e assinatura.', fixed: true },
  { id: 'aluno', name: 'Aluno', people: 142, text: 'Vê e registra o próprio treino. Decide o que libera ao personal.', fixed: true },
  { id: 'admin', name: 'Admin', people: 1, text: 'Gerencia usuários, planos e cupons. Não vê dados de saúde.', fixed: true },
  { id: 'suporte', name: 'Suporte', people: 0, text: 'Atende chamados e vê contas, sem editar planos.', fixed: false },
]

export const comingSoon: Record<string, { title: string; text: string }> = {
  agenda: { title: 'Agenda', text: 'Marque sessões presenciais e receba lembretes.' },
  financeiro: { title: 'Financeiro', text: 'Controle o que cada aluno paga a você.' },
  relatorios: { title: 'Relatórios', text: 'Veja a evolução dos alunos em gráficos para compartilhar.' },
}

export const deleteEffects = {
  personal: ['Seus alunos perdem o acesso aos treinos que você criou.', 'A assinatura é cancelada e não há cobrança nova.', 'Seus treinos, exercícios e anotações são apagados.'],
  aluno: ['Seu histórico de treinos é apagado.', 'Seu personal deixa de ver seus dados na hora.'],
  admin: ['Você perde o acesso de administração.', 'Se você for a única pessoa admin, indique outra antes de excluir.'],
} as const
