/* Dados fictícios das telas de versões, responsáveis, perfis e conta. */

export const workoutVersions = [
  { v: 4, when: '12/10/2026', by: 'Carla Mendes', changes: ['Trocou rosca direta por rosca martelo', 'Descanso do supino de 60 s para 90 s'], current: true },
  { v: 3, when: '28/09/2026', by: 'Carla Mendes', changes: ['Adicionou prancha ao fim do treino'], current: false },
  { v: 2, when: '10/09/2026', by: 'Sugestão da IA, aprovada por você', changes: ['Aumentou as séries da remada de 2 para 3'], current: false },
  { v: 1, when: '01/09/2026', by: 'Carla Mendes', changes: ['Criou o treino'], current: false },
]

export type Guardian = { id: string; name: string; relation: string; email: string; main: boolean }
export const guardians: Guardian[] = [
  { id: 'g1', name: 'Sandra Lopes', relation: 'Mãe', email: 'sandra.lopes@exemplo.com.br', main: true },
  { id: 'g2', name: 'Marcos Lopes', relation: 'Pai', email: 'marcos.lopes@exemplo.com.br', main: false },
]

export const accessProfiles = [
  { id: 'personal', name: 'Personal', people: 5, text: 'Cuida dos próprios alunos, treinos e assinatura.', fixed: true },
  { id: 'aluno', name: 'Aluno', people: 142, text: 'Vê e registra o próprio treino. Decide o que libera ao personal.', fixed: true },
  { id: 'admin', name: 'Admin', people: 1, text: 'Gerencia usuários, planos e cupons. Não vê dados de saúde.', fixed: true },
  { id: 'suporte', name: 'Suporte', people: 0, text: 'Atende chamados e vê contas, sem editar planos.', fixed: false },
]

export const comingSoon: Record<string, { title: string; text: string }> = {
  agenda: { title: 'Agenda', text: 'Marque sessões presenciais e receba lembretes.' },
  nutricao: { title: 'Nutrição', text: 'Acompanhe a alimentação dos alunos junto com o treino.' },
}

export const deleteEffects = {
  personal: ['Seus alunos perdem o acesso aos treinos que você criou.', 'A assinatura é cancelada e não há cobrança nova.', 'Seus treinos, exercícios e anotações são apagados.'],
  aluno: ['Seu histórico de treinos é apagado.', 'Seu personal deixa de ver seus dados na hora.'],
  admin: ['Você perde o acesso de administração.', 'Se você for a única pessoa admin, indique outra antes de excluir.'],
} as const

/* O que cada perfil liberou e pode retirar a qualquer hora (LGPD). fixed: necessário para a conta existir. */
export type Grant = { id: string; label: string; text: string; effect: string; fixed?: boolean }
export const grants: Record<'personal' | 'aluno' | 'admin', Grant[]> = {
  aluno: [
    { id: 'saude', label: 'Dados de saúde para a personal', text: 'Lesões, dores e respostas dos questionários.', effect: 'Sua personal deixa de ver seus dados de saúde na hora e não pode mais pedir sugestões de treino à IA para você.' },
    { id: 'historico', label: 'Histórico de treinos para a personal', text: 'Séries, cargas e frequência.', effect: 'Sua personal deixa de ver o que você treinou. Você continua vendo o seu histórico.' },
    { id: 'fotos', label: 'Fotos do check-in', text: 'As fotos que você envia junto com peso e medidas.', effect: 'Sua personal deixa de ver as fotos. Peso e medidas continuam liberados.' },
    { id: 'ia', label: 'Uso dos meus dados pela IA', text: 'A Aura lê seu histórico para sugerir ajustes à personal.', effect: 'A Aura para de usar seus dados. Os treinos passam a ser montados só pela personal.' },
    { id: 'termos', label: 'Termos de uso e privacidade', text: 'Aceitos em 02/09/2026.', effect: '', fixed: true },
  ],
  personal: [
    { id: 'novidades', label: 'Comunicações do aura-fit', text: 'Dicas e novidades por e-mail.', effect: 'Você deixa de receber e-mails de novidades. Avisos da conta e de segurança continuam.' },
    { id: 'melhoria', label: 'Uso das minhas prescrições para melhorar a IA', text: 'Treinos sem o nome dos alunos ajudam a Aura a sugerir melhor.', effect: 'Seus treinos deixam de ser usados para melhorar as sugestões. Nada muda no que você já criou.' },
    { id: 'termos', label: 'Termos de uso e privacidade', text: 'Aceitos em 14/03/2026.', effect: '', fixed: true },
  ],
  admin: [
    { id: 'novidades', label: 'Comunicações do aura-fit', text: 'Dicas e novidades por e-mail.', effect: 'Você deixa de receber e-mails de novidades. Avisos da conta e de segurança continuam.' },
    { id: 'termos', label: 'Termos de uso e privacidade', text: 'Aceitos em 05/01/2026.', effect: '', fixed: true },
  ],
}
