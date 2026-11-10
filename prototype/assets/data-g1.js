/* data-g1.js - dados exclusivos do grupo G1 (ficticios). Complementa window.AURA; nunca substitui. */
window.AURA_G1 = {
  convidado: { nome: 'Jorge Batista', email: 'jorge.batista@exemplo.com.br', nascimentoMenor: '12/05/2012' },
  exemplo: { nome: 'Carla Mendes', email: 'carla.mendes@exemplo.com.br', emailIncompleto: 'carla.mendes@exemplo', senhaFraca: 'abc123', senhaOk: 'Treino#2026', telefone: '(11) 91234-5678' },
  home: { admin: '../home/admin.html?role=admin', personal: '../home/personal.html?role=personal', aluno: '../home/aluno.html?role=aluno' },
  modulos: {
    alunos: { titulo: 'Alunos', frase: 'Aqui você vai acompanhar cada aluno, com histórico e observações, sem planilha.', icone: 'users' },
    treinos: { titulo: 'Treinos', frase: 'Aqui você vai montar e enviar os treinos dos seus alunos.', icone: 'dumbbell' },
    'prescricao-ia': { titulo: 'Prescrição IA', frase: 'Aqui você vai receber sugestões de treino para revisar e ajustar do seu jeito.', icone: 'sparkles' },
    financeiro: { titulo: 'Financeiro', frase: 'Aqui você vai ver quanto entra por mês e quem está em dia.', icone: 'chart' },
    relatorios: { titulo: 'Relatórios', frase: 'Aqui você vai ver a evolução dos seus alunos em gráficos simples.', icone: 'file-text' },
    agenda: { titulo: 'Agenda', frase: 'Aqui você vai organizar seus horários de atendimento.', icone: 'calendar' }
  },
  origens: { 'aluno.html': 'Início', 'personal.html': 'Início', 'admin.html': 'Início', 'aluno-treino-do-dia.html': 'Treino de hoje', 'configuracoes.html': 'Configurações', 'meus-dados.html': 'Meus dados', 'assinatura.html': 'Minha assinatura' },
  suporteEmail: 'suporte@exemplo.com.br'
};
/* com quem compartilhamos: linhas que complementam AURA.sharing (decisao 002, item 10) */
window.AURA_G1.extraSharing = [
  { with: 'Serviço de inteligência artificial (planos Pro e Premium)', what: 'Dados de treino e, só se você autorizar, dados de saúde', why: 'Para sugerir treinos ao seu personal, que revisa tudo antes de chegar a você' },
  { with: 'Hospedagem e nuvem', what: 'Todos os dados do aplicativo', why: 'Para o aplicativo funcionar e guardar seus dados com segurança' },
  { with: 'Autoridades', what: 'Só o que a lei ou uma ordem judicial exigir', why: 'Para cumprir a lei' }
];
window.AURA_G1.controlador = { nome: 'Aura Fit Tecnologia Ltda. (empresa fictícia do protótipo)', cnpj: '00.000.000/0001-00 (fictício)' };
