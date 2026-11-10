/* data.js - modelo window.AURA conforme docs/design/ia-e-fluxos.md 0.1. Dados 100% ficticios (e-mails @exemplo.com.br).
   "Hoje" no prototipo e fixo: 2026-10-16. Grupos so leem; so o G0 altera este arquivo.
   Chaves antigas (metrics, workoutToday, notifications, sessions, subscriptions, rolePerms...) continuam como alias. */
(function () {
  var TODAY = '2026-10-16';
  var D = '@exemplo.com.br';

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function parse(s) {
    if (!s) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : new Date(s);
  }
  function addDays(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function addMonths(s, n) { var d = parse(s), day = d.getDate(); d.setDate(1); d.setMonth(d.getMonth() + n); var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(day, last)); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function daysBetween(a, b) { var x = parse(a), y = parse(b); return Math.round((new Date(y.getFullYear(), y.getMonth(), y.getDate()) - new Date(x.getFullYear(), x.getMonth(), x.getDate())) / 86400000); }
  function fmtBRL(v) {
    var n = Number(v) || 0;
    try { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/ /g, ' '); }
    catch (e) { return 'R$ ' + n.toFixed(2).replace('.', ','); }
  }
  function fmtDate(s) { var d = parse(s); return d ? pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() : '-'; }
  function fmtDateTime(s) { var d = parse(s); return d ? fmtDate(s) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) : '-'; }
  function relDate(s) {
    var d = parse(s), t = parse(TODAY);
    if (!d) return 'nunca';
    var diff = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
    if (diff <= 0) return 'hoje';
    if (diff === 1) return 'ontem';
    if (diff < 30) return 'há ' + diff + ' dias';
    return fmtDate(s);
  }
  function initials(name) {
    var p = String(name || '?').trim().split(/\s+/);
    return (p[0].charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : '')).toUpperCase();
  }
  // LGPD: ma***@exemplo.com.br
  function maskEmail(e) {
    var p = String(e || '').split('@');
    return p.length < 2 ? e : p[0].slice(0, 2) + '***@' + p[1];
  }

  /* ---------- permissoes e papeis (alinhado a aura-packages/packages/authz + 4 do ia-e-fluxos) ---------- */
  var permissions = [
    { key: 'profile:read', group: 'Minha conta', label: 'Ver o próprio perfil', description: 'Abrir e consultar os dados do próprio cadastro.' },
    { key: 'profile:update', group: 'Minha conta', label: 'Editar o próprio perfil', description: 'Corrigir nome, telefone e preferências da própria conta.' },
    { key: 'invites:read', group: 'Convites', label: 'Ver convites', description: 'Consultar convites enviados e o estado de cada um.' },
    { key: 'invites:create', group: 'Convites', label: 'Convidar pessoas', description: 'Enviar convite por e-mail ou link.' },
    { key: 'users:read', group: 'Usuários', label: 'Ver usuários', description: 'Ver a lista de usuários, sem dados de saúde.' },
    { key: 'users:manage', group: 'Usuários', label: 'Bloquear, reativar e alterar usuários', description: 'Bloqueio é reversível e fica registrado no histórico.' },
    { key: 'roles:read', group: 'Papéis', label: 'Ver papéis e permissões', description: 'Consultar a matriz de permissões por papel.' },
    { key: 'roles:manage', group: 'Papéis', label: 'Alterar papéis e permissões', description: 'Editar a matriz, com confirmação.' },
    { key: 'tenants:read', group: 'Contas', label: 'Ver contas de personais', description: 'Ver a conta de cada personal e seus vínculos.' },
    { key: 'audit:read', group: 'Auditoria', label: 'Ver histórico de ações', description: 'Consultar quem fez o quê e quando.' },
    { key: 'plans:read', group: 'Planos', label: 'Ver cadastro de planos', description: 'Ver planos, limites e preços.', isNew: true },
    { key: 'plans:manage', group: 'Planos', label: 'Criar e editar planos', description: 'Mudar limites, preços e situação dos planos.', isNew: true },
    { key: 'coupons:read', group: 'Cupons', label: 'Ver cupons e relatório', description: 'Ver cupons e quem usou cada um.', isNew: true },
    { key: 'coupons:manage', group: 'Cupons', label: 'Criar, editar e pausar cupons', description: 'Cadastrar e controlar cupons de desconto.', isNew: true },
    { key: 'billing:read', group: 'Cobrança', label: 'Ver receita e assinaturas da plataforma', description: 'Ver receita e situação das assinaturas.', isNew: true },
    { key: 'subscription:manage', group: 'Cobrança', label: 'Gerir a própria assinatura', description: 'Assinar, trocar de plano e cancelar a própria assinatura.', isNew: true }
  ];
  var ALL = permissions.map(function (p) { return p.key; });
  var BASE = ['profile:read', 'profile:update'];
  var rolePerms = {
    admin: ALL.filter(function (k) { return k !== 'subscription:manage'; }),
    suporte: BASE.concat(['invites:read', 'users:read', 'tenants:read', 'audit:read', 'plans:read', 'coupons:read', 'billing:read']),
    personal: BASE.concat(['invites:read', 'invites:create', 'subscription:manage']),
    aluno: BASE.slice()
  };

  /* ---------- usuarios (25) ---------- */
  var COLORS = ['primary', 'info', 'neutral'];
  var users = [
    // id, nome, papel, status, criado, ultimo login, verificado, plano, bloqueio, menor
    ['u01', 'Marina Duarte', 'admin', 'ativo', '2026-01-12', '2026-10-16T08:41', true, null],
    ['u02', 'Henrique Salles', 'admin', 'ativo', '2026-01-12', '2026-10-15T17:20', true, null],
    ['u25', 'Sofia Matos', 'suporte', 'ativo', '2026-03-02', '2026-10-16T09:05', true, null],
    ['u03', 'Carla Mendes', 'personal', 'ativo', '2026-02-03', '2026-10-16T07:55', true, 'Pro'],
    ['u04', 'Camila Prado', 'personal', 'ativo', '2026-02-18', '2026-10-15T21:08', true, 'Pro'],
    ['u05', 'Thiago Ventura', 'personal', 'ativo', '2026-03-09', '2026-10-14T10:32', true, 'Pro'],
    ['u06', 'Larissa Cunha', 'personal', 'ativo', '2026-04-22', '2026-10-12T19:47', true, 'Starter'],
    ['u07', 'Bruno Sampaio', 'personal', 'bloqueado', '2026-05-15', '2026-08-30T09:12', true, 'Pro', 'Cobrança contestada pelo titular. Aguardando contato.'],
    ['u08', 'Fernanda Leal', 'personal', 'pendente_verificacao', '2026-10-15', null, false, 'Starter'],
    ['u09', 'Jorge Batista', 'aluno', 'ativo', '2026-03-01', '2026-10-16T06:30', true, null],
    ['u10', 'Gabriela Santos', 'aluno', 'ativo', '2026-03-04', '2026-10-15T18:14', true, null],
    ['u11', 'Bruno Oliveira', 'aluno', 'bloqueado', '2026-03-20', '2026-10-15T07:02', true, null, 'Vários acessos de lugares diferentes em pouco tempo. Aguardando a pessoa confirmar que foi ela.'],
    ['u12', 'Juliana Costa', 'aluno', 'ativo', '2026-04-02', '2026-10-13T20:40', true, null],
    ['u13', 'Felipe Almeida', 'aluno', 'ativo', '2026-04-11', '2026-10-09T12:05', true, null],
    ['u14', 'Patricia Nogueira', 'aluno', 'ativo', '2026-05-06', '2026-10-16T05:50', true, null],
    ['u15', 'Diego Rocha', 'aluno', 'bloqueado', '2026-05-19', '2026-09-02T18:00', true, null, 'Solicitação do próprio titular.'],
    ['u16', 'Amanda Teixeira', 'aluno', 'ativo', '2026-06-01', '2026-10-14T08:25', true, null],
    ['u17', 'Vinicius Barros', 'aluno', 'convidado', '2026-10-13', null, false, null],
    ['u18', 'Renata Lopes', 'aluno', 'ativo', '2026-06-14', '2026-10-15T19:33', true, null],
    ['u19', 'Eduardo Pinto', 'aluno', 'ativo', '2026-07-08', '2026-10-11T07:48', true, null],
    ['u20', 'Isabela Martins', 'aluno', 'convidado', '2026-10-14', null, false, null, null, true],
    ['u21', 'Gustavo Ribeiro', 'aluno', 'ativo', '2026-07-27', '2026-10-16T06:10', true, null],
    ['u22', 'Beatriz Andrade', 'aluno', 'ativo', '2026-08-05', '2026-10-10T21:15', true, null],
    ['u23', 'Matheus Cardoso', 'aluno', 'bloqueado', '2026-08-19', '2026-09-21T14:22', false, null, 'Conta com atividade suspeita.'],
    ['u24', 'Leticia Farias', 'aluno', 'pendente_verificacao', '2026-10-14', null, false, null, null, true]
  ].map(function (r, i) {
    var personalOf = { u09: 'u03', u10: 'u03', u11: 'u03', u12: 'u03', u13: 'u03', u17: 'u03', u14: 'u04', u15: 'u04', u16: 'u04', u20: 'u04', u18: 'u05', u19: 'u05', u21: 'u05', u22: 'u06', u23: 'u06', u24: 'u06' };
    var slug = r[1].toLowerCase().replace(/[^a-z ]/g, function (c) { return { 'á': 'a', 'ã': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ç': 'c' }[c] || ''; }).replace(/ /g, '.');
    var email = slug + D;
    var u = {
      id: r[0], name: r[1], initials: initials(r[1]), email: email, emailMasked: maskEmail(email), roles: [r[2]], status: r[3],
      emailVerified: r[6], plan: r[7], createdAt: r[4], lastLoginAt: r[5]
    };
    if (r[8]) u.blockedReason = r[8];
    if (r[9]) u.isMinor = true;
    u.avatarColor = COLORS[i % 3];
    // alias (tela de prova e shell)
    u.role = r[2]; u.lastAccess = r[5]; u.personalId = personalOf[r[0]] || null; u.planId = r[7] ? r[7].toLowerCase() : null;
    return u;
  });

  var roleDefs = [
    ['admin', 'Administrador', 'Gerencia usuários, perfis, planos e cupons da plataforma.'],
    ['suporte', 'Suporte', 'Consulta usuários, planos e cupons para atender pessoas. Não altera nada.'],
    ['personal', 'Personal', 'Profissional que convida e acompanha seus alunos.'],
    ['aluno', 'Aluno', 'Pessoa convidada por um personal. Usa o app no celular.']
  ];
  var roles = roleDefs.map(function (r) {
    return { id: 'role-' + r[0], key: r[0], name: r[1], description: r[2], system: true, permissions: rolePerms[r[0]].slice(),
      usersCount: users.filter(function (u) { return u.roles.indexOf(r[0]) !== -1; }).length };
  });
  var roleLabel = { admin: 'Administrador', suporte: 'Suporte', personal: 'Personal', aluno: 'Aluno' };

  /* ---------- planos (precos: CONTRACT 9) ---------- */
  var plans = [
    { id: 'starter', name: 'Starter', status: 'ativo', order: 1, popular: false, limits: { students: 3, ai: 'nenhuma', aiMonthly: 0 }, prices: { monthly: 0, yearly: 0 }, features: ['Até 3 alunos', 'Treinos ilimitados por aluno', 'Sem IA'], subscribers: 2, tagline: 'Para começar sem custo' },
    { id: 'pro', name: 'Pro', status: 'ativo', order: 2, popular: true, limits: { students: 30, ai: 'limitada', aiMonthly: 50 }, prices: { monthly: 49.9, yearly: 499 }, features: ['Até 30 alunos', 'IA limitada', 'Suporte por e-mail'], subscribers: 4, tagline: 'Para quem está crescendo' },
    { id: 'premium', name: 'Premium', status: 'ativo', order: 3, popular: false, limits: { students: null, ai: 'ampla', aiMonthly: 300 }, prices: { monthly: 89.9, yearly: 899 }, features: ['Alunos ilimitados', 'IA ampla', 'Suporte prioritário'], subscribers: 1, tagline: 'Para quem atende sem limites' },
    // so para telas de admin (ADM/PLN-07): nao entram no catalogo publico (filtrar status === 'ativo')
    { id: 'equipes', name: 'Equipes', status: 'rascunho', order: 4, popular: false, limits: { students: null, ai: 'ampla', aiMonthly: 600 }, prices: { monthly: null, yearly: null }, features: ['Vários personais na mesma conta'], subscribers: 0, tagline: 'Em desenho' },
    { id: 'pro-beta', name: 'Pro Beta', status: 'arquivado', order: 5, popular: false, limits: { students: 15, ai: 'limitada', aiMonthly: 20 }, prices: { monthly: null, yearly: null }, features: ['Plano de teste encerrado'], subscribers: 0, tagline: 'Encerrado' }
  ];
  plans.forEach(function (p) { p.monthly = p.prices.monthly; p.yearly = p.prices.yearly; p.students = p.limits.students; p.ai = { nenhuma: 'Sem IA', limitada: 'IA limitada', ampla: 'IA ampla' }[p.limits.ai]; p.highlight = p.popular; });

  /* ---------- cupons ---------- */
  var coupons = [
    ['c1', 'BEMVINDA20', 'percentual', 20, 'primeira', null, '2026-06-01', '2026-12-31', 200, 37, ['pro', 'premium'], 'ativo', 'Marina Duarte'],
    ['c2', 'PRO10OFF', 'fixo', 10, 'n_meses', 3, '2026-08-01', '2027-01-31', 50, 12, ['pro'], 'ativo', 'Marina Duarte'],
    ['c3', 'VERAO10', 'percentual', 10, 'primeira', null, '2026-01-05', '2026-03-31', 150, 61, ['pro', 'premium'], 'expirado', 'Henrique Salles'],
    ['c4', 'LANCAMENTO', 'percentual', 30, 'primeira', null, '2026-02-01', '2026-12-31', 100, 100, ['pro', 'premium'], 'esgotado', 'Marina Duarte'],
    ['c5', 'PREMIUM15', 'percentual', 15, 'n_meses', 6, '2026-05-01', '2026-11-30', 40, 9, ['premium'], 'pausado', 'Henrique Salles'],
    ['c6', 'ANUAL50', 'fixo', 50, 'primeira', null, '2026-09-01', '2027-02-28', 100, 5, ['pro', 'premium'], 'ativo', 'Marina Duarte'],
    ['c7', 'BLACK40', 'percentual', 40, 'primeira', null, '2026-11-25', '2026-11-30', 300, 0, ['premium'], 'ativo', 'Henrique Salles'], // validFrom no futuro: "ainda nao comecou"
    ['c8', 'FORCA5', 'fixo', 5, 'n_meses', 12, '2026-07-01', '2027-01-31', 500, 88, ['pro'], 'ativo', 'Marina Duarte']
  ].map(function (r) {
    var c = { id: r[0], code: r[1], type: r[2], value: r[3], duration: r[4], validFrom: r[6], validUntil: r[7], maxUses: r[8], uses: r[9], planIds: r[10], status: r[11], createdBy: r[12] };
    if (r[5]) c.months = r[5];
    c.limit = c.maxUses; c.plans = c.planIds; // alias
    return c;
  });
  var redemptions = [
    ['c1', 'Carla M.', 'pro', 'mensal', '2026-10-14'], ['c1', 'Camila P.', 'premium', 'anual', '2026-10-09'], ['c8', 'Thiago V.', 'pro', 'mensal', '2026-10-05'],
    ['c6', 'Larissa C.', 'pro', 'anual', '2026-10-02'], ['c2', 'Bruno S.', 'pro', 'mensal', '2026-09-28'], ['c1', 'Ana L.', 'pro', 'mensal', '2026-09-21'],
    ['c8', 'Paulo R.', 'pro', 'mensal', '2026-09-15'], ['c4', 'Carla M.', 'premium', 'anual', '2026-08-30']
  ].map(function (r) {
    var c = coupons.filter(function (x) { return x.id === r[0]; })[0], pl = plans.filter(function (x) { return x.id === r[2]; })[0];
    var base = r[3] === 'anual' ? pl.prices.yearly : pl.prices.monthly;
    return { couponId: r[0], userName: r[1], planId: r[2], cycle: r[3], date: r[4], discountValue: c.type === 'percentual' ? Math.round(base * c.value) / 100 : c.value };
  });

  /* ---------- assinatura do personal (variantes por status) ---------- */
  var NEXT_CHARGE = '2026-11-03'; // FONTE UNICA da proxima cobranca do plano atual (home, Minha assinatura, sino, resumo)
  function sub(status, o) {
    var s = {
      planId: 'pro', cycle: 'mensal', status: status, amount: 49.9, couponApplied: null, nextChargeAt: NEXT_CHARGE,
      paymentMethod: { brand: 'Visa', last4: '4242', exp: '08/2028' },
      invoices: [
        { date: '2026-10-03', amount: 49.9, status: 'paga', number: 'AF-2026-0142' },
        { date: '2026-09-03', amount: 49.9, status: 'paga', number: 'AF-2026-0098' },
        { date: '2026-08-03', amount: 49.9, status: 'paga', number: 'AF-2026-0061' }
      ]
    };
    for (var k in o) s[k] = o[k];
    return s;
  }
  var subscriptionVariants = {
    ativa: sub('ativa'),
    vencendo: sub('vencendo', { nextChargeAt: '2026-10-19', paymentMethod: { brand: 'Mastercard', last4: '4444', exp: '10/2026' } }),
    inadimplente: sub('inadimplente', {
      nextChargeAt: '2026-10-17', failedAt: TODAY, graceUntil: addDays(TODAY, 7), retryAt: addDays(TODAY, 2), paymentMethod: { brand: 'Visa', last4: '1881', exp: '05/2027' },
      invoices: [{ date: TODAY, amount: 49.9, status: 'falhou', number: 'AF-2026-0150' }, { date: '2026-09-03', amount: 49.9, status: 'paga', number: 'AF-2026-0098' }]
    }),
    cancelamento_agendado: sub('cancelamento_agendado', { cycle: 'anual', amount: 499, nextChargeAt: null, endsAt: '2027-02-03', couponApplied: 'ANUAL50',
      invoices: [{ date: '2026-02-03', amount: 449, status: 'paga', number: 'AF-2026-0011' }] }),
    cancelada: sub('cancelada', { nextChargeAt: null, endsAt: '2026-09-15', planId: 'pro',
      invoices: [{ date: '2026-08-15', amount: 49.9, status: 'paga', number: 'AF-2026-0057' }] })
  };

  subscriptionVariants.pagamento_pendente = subscriptionVariants.inadimplente; // nome novo, mesmo objeto

  var subscriptions = [ // alias antigo (lista de assinaturas da plataforma)
    { id: 's01', userId: 'u03', planId: 'pro', cycle: 'monthly', status: 'ativa', amount: 49.9, renewsAt: NEXT_CHARGE, coupon: null },
    { id: 's02', userId: 'u04', planId: 'pro', cycle: 'monthly', status: 'vencendo', amount: 49.9, renewsAt: '2026-10-19', coupon: null },
    { id: 's03', userId: 'u05', planId: 'pro', cycle: 'monthly', status: 'inadimplente', amount: 49.9, renewsAt: '2026-10-09', coupon: 'FORCA5' },
    { id: 's04', userId: 'u06', planId: 'starter', cycle: 'monthly', status: 'ativa', amount: 0, renewsAt: null, coupon: null },
    { id: 's05', userId: 'u07', planId: 'pro', cycle: 'monthly', status: 'cancelada', amount: 49.9, renewsAt: '2026-09-15', coupon: 'PRO10OFF' }
  ];

  /* ---------- convites, auditoria, alunos, agenda ---------- */
  var invites = [
    ['i1', 'vinicius.barros', 'aluno', 'Carla Mendes', '2026-10-13T10:00', '2026-10-20T10:00', 'pendente'],
    ['i2', 'isabela.martins', 'aluno', 'Camila Prado', '2026-10-14T15:30', '2026-10-21T15:30', 'pendente'],
    ['i3', 'gabriela.santos', 'aluno', 'Carla Mendes', '2026-03-03T09:00', '2026-03-10T09:00', 'aceito'],
    ['i4', 'paulo.ramos', 'aluno', 'Carla Mendes', '2026-09-01T09:00', '2026-09-08T09:00', 'expirado'],
    ['i5', 'carlos.nunes', 'aluno', 'Thiago Ventura', '2026-09-20T11:20', '2026-09-27T11:20', 'revogado'],
    ['i6', 'sofia.matos', 'suporte', 'Marina Duarte', '2026-03-01T08:00', '2026-03-08T08:00', 'aceito'],
    ['i7', 'novo.admin', 'admin', 'Marina Duarte', '2026-10-15T09:40', '2026-10-22T09:40', 'pendente'],
    ['i8', 'leticia.farias', 'aluno', 'Larissa Cunha', '2026-09-01T10:00', '2026-09-08T10:00', 'aceito']
  ].map(function (r) { return { id: r[0], emailMasked: maskEmail(r[1] + D), role: r[2], invitedBy: r[3], sentAt: r[4], expiresAt: r[5], status: r[6] }; });

  var audit = [
    ['2026-10-15T16:40', 'Henrique Salles', 'Bloqueou o acesso', 'Bruno Oliveira', 'Motivo: atividade suspeita. Vários acessos de lugares diferentes em pouco tempo.'],
    ['2026-10-16T08:12', 'Marina Duarte', 'Bloqueou o acesso', 'Matheus Cardoso', 'Motivo: conta com atividade suspeita.'],
    ['2026-10-15T17:25', 'Henrique Salles', 'Alterou permissões do papel', 'Personal', 'Adicionou "Gerir a própria assinatura".'],
    ['2026-10-15T09:40', 'Marina Duarte', 'Enviou convite', 'novo.admin', 'Papel: Administrador.'],
    ['2026-10-14T11:03', 'Marina Duarte', 'Criou o cupom', 'ANUAL50', 'R$ 50,00 de desconto na primeira assinatura.'],
    ['2026-10-12T14:30', 'Henrique Salles', 'Pausou o cupom', 'PREMIUM15', 'Pedido do comercial.'],
    ['2026-10-10T16:00', 'Marina Duarte', 'Reativou o acesso', 'Larissa Cunha', 'Pendência resolvida.'],
    ['2026-10-08T10:15', 'Sofia Matos', 'Consultou o cadastro', 'Camila Prado', 'Atendimento de suporte.'],
    ['2026-10-02T13:45', 'Henrique Salles', 'Alterou o plano', 'Pro', 'Limite de IA de 40 para 50 por mês.']
  ].map(function (r) { return { at: r[0], actorName: r[1], action: r[2], targetName: r[3], detail: r[4], actor: r[1], target: r[3], reason: r[4] }; });

  var extraNames = ['Marcos Tavares', 'Helena Guimarães', 'Rodrigo Alves', 'Vera Campos', 'Leandro Honório', 'Bianca Otero', 'Sérgio Quintela', 'Monique Esteves', 'Ícaro Jardim', 'Priscila Wagner', 'Jonas Zago', 'Elisa Uchoa', 'Nando Yamada', 'Tatiana Vilela', 'Caio Duarte'];
  audit.sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  var students = [
    ['u09', 'Jorge Batista', 'ativo', '2026-10-16', 'aceito', 'Hipertrofia'],
    ['u10', 'Gabriela Santos', 'ativo', '2026-10-15', 'aceito', 'Condicionamento'],
    ['u11', 'Bruno Oliveira', 'bloqueado', '2026-10-15', 'aceito', 'Força'],
    ['u12', 'Juliana Costa', 'ativo', '2026-10-13', 'aceito', 'Mobilidade'],
    ['u13', 'Felipe Almeida', 'inativo', '2026-10-09', 'aceito', 'Hipertrofia'],
    ['u17', 'Vinicius Barros', 'convidado', null, 'pendente', 'Não informado'],
    ['u26', 'Paulo Ramos', 'convidado', null, 'expirado', 'Não informado']
  ].concat(extraNames.map(function (n, i) {
    var day = 16 - (i % 6); // 11 a 16/10
    return ['x' + (i + 1), n, 'ativo', '2026-10-' + pad(day), 'aceito', ['Hipertrofia', 'Condicionamento', 'Emagrecimento saudável', 'Mobilidade', 'Força'][i % 5]];
  })).map(function (r) {
    var d = r[3] ? Math.round((parse(TODAY) - parse(r[3])) / 86400000) : null;
    return { id: r[0], name: r[1], initials: initials(r[1]), status: r[2], lastWorkoutAt: r[3], daysInactive: d, inviteStatus: r[4], goal: r[5] };
  });
  var agendaToday = [
    { time: '07:00', studentName: 'Jorge Batista', workoutName: 'Treino A: Superior', mode: 'presencial' },
    { time: '09:30', studentName: 'Gabriela Santos', workoutName: 'Treino B: Inferior', mode: 'presencial' },
    { time: '12:00', studentName: 'Bruno Oliveira', workoutName: 'Treino A: Superior', mode: 'online' },
    { time: '18:30', studentName: 'Juliana Costa', workoutName: 'Treino C: Full body', mode: 'online' }
  ];

  /* ---------- indicadores das homes ---------- */
  var kpis = {
    admin: {
      activeUsers: users.filter(function (u) { return u.status === 'ativo'; }).length, mrr: 399.4,
      subscriptionsByStatus: { ativa: 2, vencendo: 1, inadimplente: 1, cancelamento_agendado: 0, cancelada: 1 },
      newSignups30d: 9,
      alerts: [
        { type: 'warning', text: '1 assinatura em atraso há 7 dias.', link: '../admin/usuarios.html' },
        { type: 'info', text: '2 convites pendentes de aluno vencem em 5 dias.', link: '../admin/usuarios.html' },
        { type: 'info', text: 'O cupom LANCAMENTO esgotou (100 de 100 usos).', link: '../admin/cupons.html' }
      ]
    },
    personal: { activeStudents: 18, studentLimit: 30, revenueMonth: 4250, atRisk: 4 }
  };

  var healthNotice = 'O aura-fit não substitui a orientação de um profissional de saúde. Se sentir dor, tontura ou mal-estar, pare o exercício e procure ajuda.';
  var todayExercises = [
    { name: 'Supino reto com barra', sets: 4, reps: '10-12', restSec: 90, load: '40 kg', done: true },
    { name: 'Remada curvada', sets: 4, reps: '10-12', restSec: 90, load: '35 kg', done: true },
    { name: 'Desenvolvimento com halteres', sets: 3, reps: '12', restSec: 75, load: '14 kg', done: true },
    { name: 'Rosca direta', sets: 3, reps: '12', restSec: 60, load: '20 kg', done: false },
    { name: 'Tríceps na polia', sets: 3, reps: '12-15', restSec: 60, load: '25 kg', done: false }
  ];
  var alunoHome = {
    todayWorkout: { name: 'Treino A: Superior', durationMin: 45, exercises: todayExercises, readOnly: true, personalName: 'Carla Mendes', healthNotice: healthNotice, level: 'Moderado',
      note: 'Registro de séries e cargas chega em uma próxima versão. Aqui você só consulta o treino.' },
    streak: { weeksActive: 3, restDaysPlanned: 2 },
    nextWorkout: { name: 'Treino B: Inferior', date: '2026-10-19' },
    personalMessage: { from: 'Carla Mendes', text: 'Bom treino! Se algo incomodar, pare e me avise.', at: '2026-10-15T18:20' },
    weekPlan: [{ name: 'Treino A: Superior', day: 'Seg' }, { name: 'Treino B: Inferior', day: 'Qua' }, { name: 'Treino C: Full body', day: 'Sex' }]
  };

  var notificationPrefs = {
    channels: { email: true, push: false },
    types: [
      { key: 'cobranca', label: 'Cobrança e renovação da assinatura', transactional: true, enabled: true },
      { key: 'seguranca', label: 'Segurança da conta (novo acesso, troca de senha)', transactional: true, enabled: true },
      { key: 'convites', label: 'Convites aceitos e pendentes', transactional: false, enabled: true },
      { key: 'treinos', label: 'Lembretes de treino', transactional: false, enabled: false },
      { key: 'novidades', label: 'Novidades e dicas do aura-fit', transactional: false, enabled: false }
    ]
  };
  var consents = [
    { key: 'termos', label: 'Termos de uso e Política de privacidade', purpose: 'Criar e manter sua conta.', legalBase: 'Execução de contrato', granted: true, grantedAt: '2026-03-01T10:12', required: true },
    { key: 'saude', label: 'Dados de saúde (peso, medidas, fotos, anamnese)', purpose: 'Seu personal montar e ajustar seus treinos.', legalBase: 'Consentimento específico (art. 11)', granted: false, grantedAt: null, required: false },
    { key: 'compartilhar_personal', label: 'Compartilhar treinos e registros com seu personal', purpose: 'Seu personal acompanhar você.', legalBase: 'Consentimento', granted: true, grantedAt: '2026-03-01T10:14', required: false },
    { key: 'email_novidades', label: 'Receber novidades por e-mail', purpose: 'Enviar dicas e novidades do produto.', legalBase: 'Consentimento', granted: false, grantedAt: null, required: false },
    { key: 'analytics', label: 'Medir o uso do app para melhorar', purpose: 'Entender quais telas confundem as pessoas.', legalBase: 'Consentimento', granted: false, grantedAt: null, required: false }
  ];
  var sharing = [
    { with: 'Seu personal Carla Mendes', what: 'Treinos e registros', why: 'Para acompanhar você' },
    { with: 'Stripe (pagamentos)', what: 'Nome, e-mail e dados da cobrança', why: 'Para processar a assinatura. Nunca vemos o número do seu cartão.' },
    { with: 'Serviço de e-mail', what: 'Seu e-mail', why: 'Para enviar convites, avisos de segurança e cobrança' }
  ];
  var legal = { termsVersion: '1.2', privacyVersion: '1.1', updatedAt: '2026-09-30', dpoEmail: 'privacidade@exemplo.com.br' };
  var maintenance = { returnAt: '2026-10-16T14:00' };

  /* ---------- quem esta logado em cada perfil ---------- */
  function me(role, userId, tenant, title) {
    var u = users.filter(function (x) { return x.id === userId; })[0];
    return { id: u.id, name: u.name, initials: u.initials, email: u.email, emailMasked: u.emailMasked, role: role, tenantName: tenant, avatarColor: u.avatarColor, title: title,
      memberships: role === 'aluno' ? [{ role: 'aluno', label: 'Aluno · Carla Mendes' }] : role === 'admin' ? [{ role: 'admin', label: 'Administrador · aura-fit' }, { role: 'personal', label: 'Personal · Studio Marina' }] : [{ role: role, label: title }] };
  }
  var meObj = {
    admin: me('admin', 'u01', 'aura-fit', 'Administradora'),
    personal: me('personal', 'u03', 'Studio Carla Mendes', 'Personal Trainer'),
    aluno: me('aluno', 'u09', 'Studio Carla Mendes', 'Aluno')
  };
  var sessions = {};
  Object.keys(meObj).forEach(function (k) { sessions[k] = { userId: meObj[k].id, name: meObj[k].name, title: meObj[k].title }; });

  /* ---------- aliases / legado da tela de prova ---------- */
  var metrics = {
    admin: { totalUsers: users.length, activePersonals: users.filter(function (u) { return u.role === 'personal' && u.status === 'ativo'; }).length,
      activeStudents: users.filter(function (u) { return u.role === 'aluno' && u.status === 'ativo'; }).length,
      pendingInvites: invites.filter(function (i) { return i.status === 'pendente'; }).length,
      blocked: users.filter(function (u) { return u.status === 'bloqueado'; }).length, mrr: kpis.admin.mrr, mrrDelta: 8.2, delinquent: 1 },
    personal: { students: 18, studentsLimit: 30, sessionsWeek: 14, pendingInvites: 1, planId: 'pro', renewsAt: NEXT_CHARGE },
    aluno: { weekGoal: 4, weekDone: 3, streakWeeks: 3 }
  };
  var workoutToday = { name: alunoHome.todayWorkout.name, duration: 45, level: 'Moderado', personal: 'Carla Mendes', exercises: todayExercises, next: alunoHome.weekPlan };
  var notifications = [
    { id: 'n1', role: 'admin', icon: 'user', title: 'Novo personal cadastrado', text: 'Fernanda Leal criou a conta e falta verificar o e-mail.', at: '2026-10-16T08:10', unread: true },
    { id: 'n2', role: 'admin', icon: 'alert', title: 'Pagamento em atraso', text: 'A assinatura de Thiago Ventura está em atraso há 7 dias.', at: '2026-10-15T09:00', unread: true },
    { id: 'n3', role: 'admin', icon: 'tag', title: 'Cupom esgotado', text: 'LANCAMENTO chegou a 100 de 100 usos.', at: '2026-10-12T14:30', unread: false },
    { id: 'n4', role: 'personal', icon: 'users', title: 'Convite aceito', text: 'Gabriela Santos entrou na sua lista de alunos.', at: '2026-10-16T07:30', unread: true },
    { id: 'n6', role: 'aluno', icon: 'dumbbell', title: 'Treino de hoje disponível', text: 'Treino A: Superior, cerca de 45 minutos.', at: '2026-10-16T06:00', unread: true },
    { id: 'n7', role: 'aluno', icon: 'info', title: 'Seu personal atualizou o treino', text: 'Carla ajustou as cargas do Treino B.', at: '2026-10-14T18:20', unread: false }
  ];

  // O sino do personal acompanha a assinatura atual (mesma data da home e de Minha assinatura)
  function buildNotifications(sub) {
    var list = notifications.filter(function (n) { return n.id !== 'n5' && n.id !== 'n5p'; });
    if (sub.status === 'inadimplente') {
      list.push({ id: 'n5p', role: 'personal', icon: 'alert', title: 'Pagamento pendente', text: 'Não conseguimos cobrar seu cartão. Atualize o pagamento até ' + fmtDate(sub.graceUntil) + ' para manter o acesso completo.', at: TODAY + 'T08:00', unread: true });
    } else if (sub.nextChargeAt) {
      var n = daysBetween(TODAY, sub.nextChargeAt);
      list.push({ id: 'n5', role: 'personal', icon: 'credit-card', title: n <= 0 ? 'Renovação hoje' : 'Renovação em ' + n + (n === 1 ? ' dia' : ' dias'), text: 'Seu plano ' + planName(sub.planId) + ' renova em ' + fmtDate(sub.nextChargeAt) + '. Você pode cancelar quando quiser.', at: '2026-10-15T10:00', unread: false });
    }
    return list;
  }
  function planName(id) { for (var i = 0; i < plans.length; i++) if (plans[i].id === id) return plans[i].name; return id; }

  var statusMeta = {
    'ativo': { tone: 'success', icon: 'check-circle', label: 'Ativo' },
    'bloqueado': { tone: 'danger', icon: 'ban', label: 'Bloqueado' },
    'convidado': { tone: 'warning', icon: 'mail', label: 'Convidado' },
    'pendente_verificacao': { tone: 'warning', icon: 'clock', label: 'Verificação pendente' },
    'convite pendente': { tone: 'warning', icon: 'clock', label: 'Convite pendente' },
    'inativo': { tone: 'neutral', icon: 'ban', label: 'Inativo' },
    'ativa': { tone: 'success', icon: 'check-circle', label: 'Ativa' },
    'vencendo': { tone: 'warning', icon: 'clock', label: 'Vencendo' },
    'inadimplente': { tone: 'danger', icon: 'alert', label: 'Pagamento pendente' },
    'pagamento_pendente': { tone: 'danger', icon: 'alert', label: 'Pagamento pendente' },
    'cancelamento_agendado': { tone: 'warning', icon: 'calendar', label: 'Cancelamento agendado' },
    'cancelada': { tone: 'neutral', icon: 'x-circle', label: 'Cancelada' },
    'pausado': { tone: 'neutral', icon: 'ban', label: 'Pausado' },
    'expirado': { tone: 'neutral', icon: 'clock', label: 'Expirado' },
    'esgotado': { tone: 'warning', icon: 'alert', label: 'Esgotado' },
    'pendente': { tone: 'warning', icon: 'clock', label: 'Pendente' },
    'aceito': { tone: 'success', icon: 'check-circle', label: 'Aceito' },
    'revogado': { tone: 'neutral', icon: 'ban', label: 'Revogado' },
    'rascunho': { tone: 'info', icon: 'edit', label: 'Rascunho' },
    'arquivado': { tone: 'neutral', icon: 'file-text', label: 'Arquivado' },
    'paga': { tone: 'success', icon: 'check-circle', label: 'Paga' },
    'falhou': { tone: 'danger', icon: 'x-circle', label: 'Falhou' },
    'válido': { tone: 'success', icon: 'check-circle', label: 'Válido' },
    'agendado': { tone: 'info', icon: 'calendar', label: 'Agendado' }
  };
  function badge(status) {
    var m = statusMeta[status] || { tone: 'neutral', icon: 'info', label: status };
    return '<span class="badge badge-' + m.tone + '"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + m.icon + '"/></svg>' + m.label + '</span>';
  }
  // Selo "Modelo": dado de demonstracao em modulos fora da Fase 1 (classe .badge-model + tooltip acessivel)
  var modelUid = 0;
  function modelBadge(tip) {
    modelUid += 1;
    var id = 'modelo-tip-' + modelUid;
    return '<span class="tooltip-host"><button type="button" class="badge badge-model" aria-describedby="' + id + '"><svg class="icon" aria-hidden="true" focusable="false"><use href="#i-info"/></svg>Modelo</button><span class="tooltip" role="tooltip" id="' + id + '">' + (tip || 'Dados de demonstração') + '</span></span>';
  }
  function can(role, perm) { return (rolePerms[role] || []).indexOf(perm) !== -1; }
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  /* ---------- sessao do prototipo (sessionStorage): nome digitado, e-mail de teste, estado da assinatura ---------- */
  var SKEY = 'aura-session';
  function readS() { try { return JSON.parse(window.sessionStorage.getItem(SKEY)) || {}; } catch (e) { return {}; } }
  function writeS(o) { try { window.sessionStorage.setItem(SKEY, JSON.stringify(o)); } catch (e) {} }
  function queryRole() { var m = /[?&]role=(admin|personal|aluno)\b/.exec(location.search); return m ? m[1] : null; }
  var testAccounts = [
    { email: 'carla.mendes@exemplo.com.br', role: 'personal', name: 'Carla Mendes', note: 'Personal com 18 alunos, plano Pro ativo.' },
    { email: 'pendente@exemplo.com.br', role: 'personal', name: 'Carla Mendes', sub: 'inadimplente', note: 'Personal com pagamento pendente (faixa no topo, prazo de 7 dias).' },
    { email: 'jorge.batista@exemplo.com.br', role: 'aluno', name: 'Jorge Batista', note: 'Aluno.' },
    { email: 'admin@exemplo.com.br', role: 'admin', name: 'Marina Duarte', note: 'Administradora.' }
  ];
  function findAccount(email) { var e = String(email || '').trim().toLowerCase(); for (var i = 0; i < testAccounts.length; i++) if (testAccounts[i].email === e) return testAccounts[i]; return null; }
  var SAFE_FROM = /^[a-z0-9_\-]+\/[a-z0-9_\-]+\.html(\?[A-Za-z0-9_=&%.\-]*)?$/i;

  var AuraSession = {
    get: function (role) { var S = readS(); role = role || queryRole() || S.role || 'personal'; var m = window.AURA && window.AURA.me[role]; return { role: role, name: (S.names && S.names[role]) || (m && m.name) || '', email: S.email || null, sub: S.sub || null }; },
    // nome digitado no cadastro: me.* e a lista de usuarios passam a mostrar esse nome
    setName: function (name, role) {
      name = String(name || '').trim().slice(0, 80); if (!name) return;
      var S = readS(); role = role || queryRole() || 'personal'; S.names = S.names || {}; S.names[role] = name; writeS(S); apply();
    },
    // "Entrar": conta de teste conhecida define papel/nome/estado da assinatura; e-mail desconhecido usa roleHint (sem revelar se existe)
    signIn: function (email, roleHint) {
      var acc = findAccount(email), S = readS(), role = acc ? acc.role : (roleHint || queryRole() || 'aluno');
      S.email = String(email || '').trim().toLowerCase(); S.role = role; S.sub = acc && acc.sub ? acc.sub : null; if (acc) { S.names = S.names || {}; S.names[role] = acc.name; }
      writeS(S); apply();
      return { role: role, account: acc, redirect: AuraSession.loginRedirect(role) };
    },
    signOut: function () { try { window.sessionStorage.removeItem(SKEY); } catch (e) {} },
    testAccounts: testAccounts,
    // ?from= (formato "grupo/arquivo.html?query", relativo a screens/); so aceita caminho interno
    safeFrom: function (from) { return from && SAFE_FROM.test(from) && from.indexOf('..') === -1 ? from : null; },
    currentFrom: function () { var m = /screens\/([^/]+\/[^/?#]+\.html)/.exec(location.pathname); if (!m) return null; var q = location.search.replace(/[?&]from=[^&]*/g, '').replace(/^&/, '?'); return m[1] + (q === '?' ? '' : q); },
    fromUrl: function (from) { var f = AuraSession.safeFrom(from); return f ? '../' + f : null; },
    loginRedirect: function (role, from) {
      if (from === undefined) { var m = /[?&]from=([^&]*)/.exec(location.search); from = m ? decodeURIComponent(m[1]) : null; }
      var u = AuraSession.fromUrl(from);
      if (u) return /[?&]role=/.test(u) ? u.replace(/([?&]role=)[a-z]+/, '$1' + role) : u + (u.indexOf('?') === -1 ? '?' : '&') + 'role=' + role;
      return '../home/' + role + '.html?role=' + role;
    }
  };

  /* ---------- rascunho (sessionStorage, 30 min, mesmo usuario, so campos permitidos) ---------- */
  var NEVER = /senha|password|passwd|codigo|code|otp|token|nasc|birth|respons|guardian|saude|health|peso|altura|medida|anamnese|cartao|card|cvc|cvv|pin|cpf/i;
  var AuraDraft = {
    ttlMin: 30,
    key: function (screen) { return 'aura-draft:' + screen; },
    userKey: function () { var S = readS(); return (S.email || 'anon') + '|' + (queryRole() || S.role || 'personal'); },
    // fields: <form> ou objeto {nome: valor}; allowed: lista de nomes permitidos (o que nao estiver aqui nunca e guardado)
    save: function (screen, fields, allowed) {
      var data = {}, src = {};
      if (fields && fields.elements) {
        Array.prototype.forEach.call(fields.elements, function (el) { if (el.name && el.type !== 'password' && el.type !== 'hidden' && el.type !== 'file' && el.type !== 'submit') src[el.name] = el.type === 'checkbox' ? (el.checked ? '1' : '') : (el.type === 'radio' ? (el.checked ? el.value : src[el.name]) : el.value); });
      } else src = fields || {};
      (allowed || []).forEach(function (k) { if (!NEVER.test(k) && src[k] != null && String(src[k]) !== '') data[k] = String(src[k]).slice(0, 2000); });
      if (!Object.keys(data).length) { AuraDraft.clear(screen); return false; }
      try { window.sessionStorage.setItem(AuraDraft.key(screen), JSON.stringify({ u: AuraDraft.userKey(), at: Date.now(), data: data })); return true; } catch (e) { return false; }
    },
    // devolve os dados (ou null se expirou/outro usuario); com form, tambem preenche os campos
    restore: function (screen, form) {
      var rec; try { rec = JSON.parse(window.sessionStorage.getItem(AuraDraft.key(screen))); } catch (e) { rec = null; }
      if (!rec || rec.u !== AuraDraft.userKey() || Date.now() - rec.at > AuraDraft.ttlMin * 60000) { if (rec) AuraDraft.clear(screen); return null; }
      if (form && form.elements) {
        Object.keys(rec.data).forEach(function (k) {
          var el = form.elements[k]; if (!el || NEVER.test(k)) return;
          if (el.type === 'checkbox') el.checked = !!rec.data[k]; else if (el.length && el[0] && el[0].type === 'radio') Array.prototype.forEach.call(el, function (r) { r.checked = r.value === rec.data[k]; }); else el.value = rec.data[k];
          try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
        });
      }
      return rec.data;
    },
    has: function (screen) { return !!AuraDraft.restore(screen); },
    clear: function (screen) { try { if (screen) window.sessionStorage.removeItem(AuraDraft.key(screen)); else Object.keys(window.sessionStorage).forEach(function (k) { if (k.indexOf('aura-draft:') === 0) window.sessionStorage.removeItem(k); }); } catch (e) {} }
  };

  /* ---------- plano atual: uma fonte so (subscription) ---------- */
  var LIVE = ['ativa', 'vencendo', 'inadimplente', 'cancelamento_agendado'];
  function currentSub() { return window.AURA.subscription; }
  function isCurrentPlan(planId, cycle) { var s = currentSub(); return !!s && s.planId === planId && LIVE.indexOf(s.status) !== -1 && (!cycle || s.cycle === cycle); }
  // data da proxima cobranca: plano atual (mesmo ciclo) = subscription.nextChargeAt; assinatura nova = hoje + 1 mes/1 ano
  function renewalFor(planId, cycle) { var s = currentSub(); if (isCurrentPlan(planId, cycle) && s.nextChargeAt) return s.nextChargeAt; return addMonths(TODAY, cycle === 'anual' ? 12 : 1); }
  function currentPlan() { var s = currentSub(); return { planId: s.planId, plan: plans.filter(function (p) { return p.id === s.planId; })[0], cycle: s.cycle, status: s.status, nextChargeAt: s.nextChargeAt, subscription: s }; }

  function apply() {
    var A = window.AURA, S = readS(), q = /[?&]sub=([a-z_]+)/.exec(location.search);
    var st = (q && q[1]) || S.sub;
    if (st === 'pagamento_pendente') st = 'inadimplente';
    A.subscription = (st && subscriptionVariants[st]) || subscriptionVariants.ativa;
    A.notifications = buildNotifications(A.subscription);
    if (S.names) Object.keys(S.names).forEach(function (role) {
      var m = A.me[role], u = m && A.byId(A.users, m.id), n = S.names[role]; if (!m) return;
      m.name = n; m.initials = initials(n); A.sessions[role].name = n; if (u) { u.name = n; u.initials = m.initials; }
    });
  }

  window.AuraSession = AuraSession; window.AuraDraft = AuraDraft;
  window.AURA = {
    today: TODAY,
    isExample: false, // selo "Exemplo" removido (decisao 002); use AURA.modelBadge() para KPIs de modulos fora da Fase 1
    me: meObj, users: users, roles: roles, permissions: permissions, plans: plans, coupons: coupons, redemptions: redemptions,
    subscription: subscriptionVariants.ativa, subscriptionVariants: subscriptionVariants,
    invites: invites, audit: audit, students: students, agendaToday: agendaToday, kpis: kpis, alunoHome: alunoHome,
    notificationPrefs: notificationPrefs, consents: consents, sharing: sharing, legal: legal, maintenance: maintenance,
    healthNotice: healthNotice,
    membershipVariants: { alunoDoisPersonais: [{ role: 'aluno', label: 'Aluno · Carla Mendes' }, { role: 'aluno', label: 'Aluno · Camila Prado' }], personalEAdmin: meObj.admin.memberships },
    // alias / auxiliares
    rolePerms: rolePerms, roleLabel: roleLabel, statusMeta: statusMeta, sessions: sessions, subscriptions: subscriptions,
    metrics: metrics, workoutToday: workoutToday, notifications: notifications,
    fmtBRL: fmtBRL, fmtDate: fmtDate, fmtDateTime: fmtDateTime, relDate: relDate, initials: initials,
    maskEmail: maskEmail, can: can, byId: byId, badge: badge, modelBadge: modelBadge,
    addDays: addDays, addMonths: addMonths, daysBetween: daysBetween,
    testAccounts: testAccounts, nextChargeAt: NEXT_CHARGE, isCurrentPlan: isCurrentPlan, renewalFor: renewalFor, currentPlan: currentPlan, applySession: apply
  };
  apply();
})();
