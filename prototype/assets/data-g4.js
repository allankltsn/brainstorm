/* data-g4.js - dados extras exclusivos do G4 (homes e configuracoes). Ficticios. Le window.AURA; nao altera nada dele. */
(function () {
  var A = window.AURA;
  // consentimento extra do G4: IA (Pro/Premium). Entra na lista de consentimentos do aluno em CFG-05.
  var iaConsent = { key: 'ia', label: 'Usar inteligência artificial para sugerir treinos', purpose: 'Seu personal receber sugestões de treino. Seus dados de saúde só seguem para a IA com este consentimento.', legalBase: 'Consentimento específico (art. 11)', granted: false, grantedAt: null, required: false, version: A.legal.privacyVersion };
  window.G4DATA = {
    iaConsent: iaConsent,
    sharingExtra: [
      { with: 'Provedor de inteligência artificial (planos Pro e Premium)', what: 'Dados do treino. Dados de saúde só com o seu consentimento para IA', why: 'Para o seu personal receber sugestões de treino' },
      { with: 'Serviços fora do Brasil', what: 'Dados de pagamento e e-mail, em serviços de terceiros', why: 'Esses serviços podem guardar dados em outros países, com regras de proteção equivalentes (revisar com advogado antes de produção)' },
      { with: 'Hospedagem em nuvem', what: 'Todos os dados da sua conta, guardados com acesso restrito', why: 'Para o aplicativo funcionar' }
    ],
    controller: 'aura-fit Tecnologia Ltda. (empresa fictícia deste protótipo)',
    // Home do personal: a persona Carla tem 18 alunos (teste C3). O data.js traz 5; sobrepomos so aqui.
    personal: {
      activeStudents: A.kpis.personal.activeStudents, studentLimit: A.kpis.personal.studentLimit, planName: 'Pro',
      revenueMonth: A.kpis.personal.revenueMonth,
      attention: [
        { name: 'Felipe Almeida', days: 7 }, { name: 'Marina Lopes', days: 9 },
        { name: 'Carlos Nunes', days: 12 }, { name: 'Paulo Ramos', days: 8 }
      ],
      workoutsWeek: [['Sex', 3], ['Sáb', 2], ['Dom', 1], ['Seg', 6], ['Ter', 5], ['Qua', 7], ['Qui', 4]]
    },
    admin: {
      mrr6: [['Mai', 149.7], ['Jun', 199.6], ['Jul', 249.5], ['Ago', 299.5], ['Set', 349.4], ['Out', 399.4]]
    },
    // semana do aluno (12 a 18/10): feito, descanso (planejado), hoje, livre
    week: [['Seg', 'feito'], ['Ter', 'descanso'], ['Qua', 'feito'], ['Qui', 'descanso'], ['Sex', 'hoje'], ['Sáb', 'livre'], ['Dom', 'livre']],
    profile: { phone: '(11) 90000-0000', phoneMasked: '(11) •••••-0000', birth: '1962-03-14' },
    // quais avisos opcionais cada perfil ve (CFG-03)
    notifTypes: { admin: ['seguranca', 'convites', 'novidades'], personal: ['cobranca', 'seguranca', 'convites', 'novidades'], aluno: ['seguranca', 'treinos', 'novidades'] },
    notifReason: {
      cobranca: 'Avisos de cobrança são necessários para você não perder o acesso sem saber.',
      seguranca: 'Avisos de segurança protegem sua conta, por isso não dá para desligar.'
    }
  };
})();
