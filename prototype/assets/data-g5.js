/* data-g5.js - dados ficticios do G5 (training: Meus alunos, lote A). Le window.AURA; nao altera nada dele.
   "Hoje" no prototipo = AURA.today (2026-10-16). Todo dado de saude aqui e MOCK; so existe para quem tem consentimento GRANTED. */
(function () {
  var A = window.AURA;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function slug(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, '.'); }
  var SEED = {};
  var C = { G: 'GRANTED', R: 'REVOKED', N: 'NEVER_GIVEN' };
  function consents(s, f, v, i) { return { SAUDE_GERAL: C[s], FOTOS: C[f], VIDEO: C[v], IA: C[i] }; }

  function mk(n, name, o) {
    var email = slug(name) + '@exemplo.com.br';
    var st = {
      id: 's' + pad(n), studentUserId: 'u-aluno-' + pad(n), name: name, email: email, emailMasked: A.maskEmail(email), avatarInitials: A.initials(name),
      status: 'ACTIVE', followMode: n % 3 === 0 ? 'PRESENCIAL' : 'REMOTO', ageStatus: 'ADULT', accountOnHold: false, awaiting: null,
      startedAt: '2026-0' + (1 + (n % 8)) + '-' + pad(3 + (n % 20)), endedAt: null, linkGeneration: 1,
      activeAssignmentName: 'Treino ' + ['A/B', 'Full body', 'ABC', 'Força base'][n % 4], lastSessionAt: '2026-10-' + pad(8 + (n % 8)), openAlerts: 0,
      consents: consents('G', 'N', 'N', 'N'), responsibleName: 'Carla Mendes', completedWorkouts: 10 + n * 3, reason: ''
    };
    for (var k in o) st[k] = o[k];
    // PRV-A-04: campos de treino/sessao ficam num seed fechado; so saem por trainView() dentro do portao de saude
    SEED[st.id] = { activeAssignmentName: st.activeAssignmentName, lastSessionAt: st.lastSessionAt, completedWorkouts: st.completedWorkouts };
    st.hasPlan = !!st.activeAssignmentName;
    st.planStart = st.hasPlan ? '2026-09-01' : null; st.planEnd = st.hasPlan ? '2026-11-30' : null;
    delete st.activeAssignmentName; delete st.lastSessionAt; delete st.completedWorkouts;
    return st;
  }

  var core = [
    mk(1, 'Marina Lopes', { followMode: 'REMOTO', activeAssignmentName: 'Hipertrofia A/B', lastSessionAt: '2026-10-14', openAlerts: 1, startedAt: '2026-02-10', consents: consents('G', 'G', 'G', 'N') }),
    mk(2, 'Felipe Almeida', { followMode: 'PRESENCIAL', activeAssignmentName: 'Condicionamento 3x', lastSessionAt: '2026-10-09', openAlerts: 1, startedAt: '2026-03-02' }),
    mk(3, 'Carlos Nunes', { followMode: 'REMOTO', activeAssignmentName: 'Força base', lastSessionAt: '2026-10-15', startedAt: '2026-04-20', consents: consents('G', 'G', 'N', 'G') }),
    mk(4, 'Paulo Ramos', { followMode: 'PRESENCIAL', activeAssignmentName: 'Adaptação 2x', lastSessionAt: '2026-10-13', startedAt: '2026-05-04', consents: consents('N', 'N', 'N', 'N') }),
    mk(5, 'Jorge Batista', { status: 'SUSPENDED', followMode: 'REMOTO', activeAssignmentName: 'Força base', lastSessionAt: '2026-10-01', startedAt: '2026-01-12', pausedAt: '2026-10-05' }),
    mk(6, 'Renata Silva', { followMode: 'REMOTO', activeAssignmentName: 'Emagrecimento', lastSessionAt: '2026-10-12', startedAt: '2026-02-22', consents: consents('R', 'N', 'N', 'N') }),
    mk(7, 'Daniel Costa', { followMode: 'REMOTO', activeAssignmentName: null, lastSessionAt: null, startedAt: '2026-10-01', emptyHealth: true })
  ];
  var fill = ['Larissa Prado', 'Otávio Reis', 'Helena Matos', 'Rafael Dias', 'Beatriz Cunha', 'Gustavo Leal', 'Patrícia Melo', 'Leandro Faria', 'Sofia Barreto', 'Eduardo Pinto', 'Júlia Campos'];
  var extra = ['Vitor Almeida', 'Aline Cardoso', 'Bruno Teixeira', 'Cíntia Rocha', 'Diego Furtado', 'Elaine Borges', 'Fábio Siqueira', 'Gabriela Nery', 'Heitor Maia', 'Isabela Duarte', 'Jonas Pacheco', 'Kátia Vieira'];
  var students = core.slice();
  fill.forEach(function (nm, i) { students.push(mk(8 + i, nm, {})); });                 // 18 ativos no total
  var more = extra.map(function (nm, i) { return mk(30 + i, nm, {}); });                // usados so nas variantes de limite

  var pending = [
    mk(19, 'Tiago Moreira', { startedAt: '2026-10-14', awaiting: 'consent', consents: consents('N', 'N', 'N', 'N'), activeAssignmentName: null, lastSessionAt: null, followMode: 'PRESENCIAL' }),
    mk(20, 'Bianca Torres', { startedAt: '2026-10-15', awaiting: 'age', ageStatus: 'MINOR_NO_GUARDIAN', accountOnHold: true, consents: consents('N', 'N', 'N', 'N'), activeAssignmentName: null, lastSessionAt: null, responsibleName: 'Carla Mendes' })
  ];
  var history = [
    mk(21, 'Roberto Lima', { status: 'ENDED', startedAt: '2026-03-02', endedAt: '2026-09-10', completedWorkouts: 64, activeAssignmentName: null, lastSessionAt: '2026-09-08', reason: 'Encerrado' }),
    mk(22, 'Camila Souza', { status: 'ENDED', startedAt: '2025-11-05', endedAt: '2026-06-20', completedWorkouts: 112, activeAssignmentName: null, lastSessionAt: '2026-06-18', reason: 'Encerrado' }),
    mk(23, 'André Pires', { status: 'ENDING', startedAt: '2026-01-12', endedAt: '2026-10-14', completedWorkouts: 41, activeAssignmentName: null, lastSessionAt: '2026-10-10', reason: 'Encerrando' })
  ];
  var invites = [
    { emailMasked: A.maskEmail('vinicius.barros@exemplo.com.br'), sentAt: '2026-10-13T10:00', expiresAt: '2026-10-20T10:00', status: 'pendente' },
    { emailMasked: A.maskEmail('isabela.martins@exemplo.com.br'), sentAt: '2026-10-14T15:30', expiresAt: '2026-10-21T15:30', status: 'pendente' },
    { emailMasked: A.maskEmail('paulo.henrique@exemplo.com.br'), sentAt: '2026-09-01T09:00', expiresAt: '2026-09-08T09:00', status: 'expirado' }
  ];
  var acceptedNoSeat = { emailMasked: A.maskEmail('luana.freitas@exemplo.com.br'), sentAt: '2026-10-12T09:00', expiresAt: '2026-10-19T09:00', status: 'aceito-sem-vaga' };

  // variante-so: menor com responsavel legal (PRV-A-07), dentro do portao; fora das listas
  var minorGuardian = mk(24, 'Lívia Andrade', { ageStatus: 'MINOR_WITH_GUARDIAN', activeAssignmentName: 'Adaptação 2x', lastSessionAt: '2026-10-12', startedAt: '2026-09-02', consents: consents('G', 'N', 'N', 'N') });
  function all() { return students.concat(more, pending, history, [minorGuardian]); }
  function find(id) { var l = all(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }

  var SCOPES = [['SAUDE_GERAL', 'Saúde geral'], ['FOTOS', 'Fotos'], ['VIDEO', 'Vídeos'], ['IA', 'Uso de IA']];
  function consentList(st) {
    return SCOPES.map(function (s) {
      var state = st.consents[s[0]];
      return { scope: s[0], label: s[1], state: state, textVersion: 'Termo v1', grantedAt: state === 'NEVER_GIVEN' ? null : st.startedAt, revokedAt: state === 'REVOKED' ? '2026-10-02' : null };
    });
  }

  /* Portao unico de conteudo de saude/treino (regra 8 da UX; PRV-A-01..04): SAUDE_GERAL GRANTED, projecao vigente, vinculo ACTIVE, sem bloqueio de idade. */
  function gate(st, opts) {
    opts = opts || {};
    var g = function (ok, reason, text) { return { ok: ok, reason: reason, text: text }; };
    if (st.accountOnHold || st.ageStatus === 'UNKNOWN' || st.ageStatus === 'MINOR_NO_GUARDIAN') return g(false, 'idade', 'Aguardando confirmação de idade ou responsável legal. Conta em espera.');
    if (st.status === 'ENDED') return g(false, 'encerrado', 'Oculto após o encerramento.');
    if (st.status !== 'ACTIVE') return g(false, 'vinculo', 'Oculto enquanto o vínculo não está ativo.');
    if (opts.stale) return g(false, 'nao-confirmado', 'Não conseguimos confirmar a autorização do aluno agora. Por segurança, fica oculto até confirmar.');
    if (st.consents.SAUDE_GERAL === 'REVOKED') return g(false, 'revogado', 'O aluno retirou a liberação. O que foi registrado antes fica guardado e oculto.');
    if (st.consents.SAUDE_GERAL !== 'GRANTED') return g(false, 'sem-consentimento', 'O aluno ainda não liberou os dados de saúde.');
    return g(true, '', '');
  }
  function trainView(st, opts) {
    if (!gate(st, opts).ok) return null;
    var x = SEED[st.id] || {};
    return { activeAssignmentName: x.activeAssignmentName || null, lastSessionAt: x.lastSessionAt || null, completedWorkouts: x.completedWorkouts };
  }

  var ASSIGN_DAYS = ['Seg', 'Qua', 'Sex'];
  function detail(st, opts) {
    var d = { assignments: [], sessions: [], alerts: [], questionnaires: [], feedback: [], media: [], responsibles: [], health: null };
    var tv = trainView(st, opts);
    // alertas (metadado generico) e responsaveis nao sao saude
    if (st.openAlerts) d.alerts.push(st.id === 's01' ? { id: 'al1', kind: 'PAIN', status: 'OPEN', createdAt: '2026-10-14', recipientIsMe: true } : { id: 'al2', kind: 'ABSENCE', status: 'OPEN', createdAt: '2026-10-15', recipientIsMe: true });
    d.responsibles = [{ userId: 'u-personal', name: 'Carla Mendes', isPrimary: true, since: st.startedAt, endedAt: null }];
    if (st.id === 's01') d.responsibles.push({ userId: 'u-personal-2', name: 'Rafael Antunes', isPrimary: false, since: '2026-05-02', endedAt: null });
    if (!tv) return d;   // fora do portao: nenhum dado de saude/treino e gerado
    var lastSessionAt = tv.lastSessionAt;
    st = Object.assign({}, st, { activeAssignmentName: tv.activeAssignmentName, lastSessionAt: lastSessionAt });
    if (st.activeAssignmentName) {
      d.assignments.push({ id: 'a1', name: st.activeAssignmentName, startDate: '2026-09-01', endDate: '2026-11-30', status: st.status === 'SUSPENDED' ? 'PAUSED' : 'ACTIVE', weekdays: ASSIGN_DAYS, source: st.id === 's01' ? 'Modelo Hipertrofia v2' : 'Personalizado', weekDone: 2, weekPlanned: 3 });
      d.assignments.push({ id: 'a0', name: 'Adaptação inicial', startDate: '2026-07-01', endDate: '2026-08-31', status: 'ENDED', weekdays: ['Ter', 'Qui'], source: 'Modelo Iniciante v1' });
    }
    if (st.lastSessionAt) {
      var stat = ['COMPLETED', 'COMPLETED', 'SKIPPED', 'COMPLETED', 'ABANDONED'], names = [st.activeAssignmentName || 'Treino', 'Treino B', 'Treino A', 'Treino B', 'Treino A'];
      for (var i = 0; i < 5; i++) d.sessions.push({ id: 'x' + i, date: A.addDays(st.lastSessionAt, -2 * i), workoutName: names[i], status: stat[i], durationMin: stat[i] === 'COMPLETED' ? 48 + i * 3 : 0, origin: st.followMode === 'PRESENCIAL' ? 'PERSONAL_APP' : 'STUDENT_APP', registeredBy: st.followMode === 'PRESENCIAL' ? 'Você' : 'Aluno' });
    }
    d.questionnaires = [
      { id: 'q1', name: 'Avaliação inicial', sentAt: st.startedAt, dueAt: A.addDays(st.startedAt, 7), status: 'SUBMITTED' },
      { id: 'q2', name: 'Check-in semanal', sentAt: '2026-10-12', dueAt: '2026-10-19', status: 'PENDING' },
      { id: 'q3', name: 'Check-in semanal', sentAt: '2026-10-05', dueAt: '2026-10-12', status: 'OVERDUE' }
    ];
    d.feedback = [
      { id: 'f1', author: st.name.split(' ')[0], text: 'Terminei o treino, achei leve hoje.', reaction: 'Sem reação', at: '2026-10-14' },
      { id: 'f2', author: 'Você', text: 'Boa. Na próxima sessão aumentamos a carga.', reaction: 'Curtiu', at: '2026-10-14' },
      { id: 'f3', author: st.name.split(' ')[0], text: 'Combinado.', reaction: 'Sem reação', at: '2026-10-15' }
    ];
    if (st.consents.FOTOS === 'GRANTED') d.media.push({ id: 'm1', kind: 'foto', takenAt: '2026-10-01', alt: 'Foto de evolução, vista frontal', scope: 'FOTOS' }, { id: 'm2', kind: 'foto', takenAt: '2026-09-01', alt: '', scope: 'FOTOS' });
    if (st.consents.VIDEO === 'GRANTED') d.media.push({ id: 'm3', kind: 'video', takenAt: '2026-10-10', alt: 'Vídeo do agachamento', scope: 'VIDEO' });
    if (!st.emptyHealth) {
      d.health = {
        pain: [
          { id: 'p1', at: '2026-10-14', bodyRegion: 'Ombro direito', intensity: 7, sessionName: 'Hipertrofia A', origin: 'Aluno' },
          { id: 'p2', at: '2026-10-07', bodyRegion: 'Joelho esquerdo', intensity: 4, sessionName: 'Hipertrofia B', origin: 'Aluno' },
          { id: 'p3', at: '2026-09-30', bodyRegion: 'Lombar', intensity: 3, sessionName: 'Hipertrofia A', origin: 'Você' }
        ],
        measures: [
          { at: '2026-07-15', kind: 'WEIGHT_KG', value: 72.4, unit: 'kg', registeredBy: 'Aluno' },
          { at: '2026-08-15', kind: 'WEIGHT_KG', value: 71.5, unit: 'kg', registeredBy: 'Aluno' },
          { at: '2026-09-15', kind: 'WEIGHT_KG', value: 70.8, unit: 'kg', registeredBy: 'Você' },
          { at: '2026-10-14', kind: 'WEIGHT_KG', value: 70.1, unit: 'kg', registeredBy: 'Aluno' },
          { at: '2026-07-15', kind: 'BODY_FAT_PERCENT', value: 27.5, unit: '%', registeredBy: 'Você' },
          { at: '2026-10-14', kind: 'BODY_FAT_PERCENT', value: 25.9, unit: '%', registeredBy: 'Você' }
        ],
        programGoal: 'Hipertrofia com foco em ombros e dorsais, 3 sessões por semana.',
        studentGoals: ['[MOCK] Quero correr 5 km sem parar até dezembro.'],
        nutrition: { meals: ['[MOCK] Café da manhã: ovos, pão integral e fruta', '[MOCK] Almoço: arroz, feijão, frango e salada', '[MOCK] Jantar: sopa de legumes'], targets: '[MOCK] 2.000 kcal por dia', notes: '[MOCK] Evita lactose.' }
      };
    }
    return d;
  }

  window.G5DATA = {
    plan: { name: 'Pro', limit: A.kpis.personal.studentLimit, active: students.length, staleSince: '2026-10-09' },
    managerName: 'Ricardo Teles',
    students: students, more: more, pending: pending, history: history, invites: invites, acceptedNoSeat: acceptedNoSeat,
    find: find, consentList: consentList, detail: detail, gate: gate, trainView: trainView,
    // variante da tela -> aluno de exemplo
    byVariant: { padrao: 's01', 'sem-consentimento': 's04', revogado: 's06', pendente: 's19', 'menor-em-espera': 's20', pausado: 's05', encerrado: 's21', encerrando: 's23', presencial: 's02', vazio: 's07', 'menor-com-responsavel': 's24', 'nao-confirmado': 's01' }
  };
})();

/* ---- Lote E (Acompanhamento, TRN-30..34): dados ficticios [MOCK]. Detalhe de saude so sai por funcoes que passam pelo portao (D.gate); nada de saude fica exposto em listas. ---- */
(function () {
  var D = window.G5DATA;
  var E = { today: '2026-10-16' };
  function ok(sid, opts) { return D.gate(D.find(sid), opts).ok; }

  /* ---- alertas (TRN-30): a lista so tem metadado; o detalhe so sai com o portao aberto ---- */
  var ALERTS = [
    { id: 'a01', kind: 'PAIN', status: 'OPEN', at: '2026-10-16T08:40', ago: 'há 2 h', sid: 's01', mine: true },
    { id: 'a02', kind: 'PAIN', status: 'OPEN', at: '2026-10-16T07:10', ago: 'há 3 h', sid: 's02', mine: true },
    { id: 'a03', kind: 'PAIN', status: 'OPEN', at: '2026-10-15T19:30', ago: 'ontem', sid: 's03', mine: true },
    { id: 'a04', kind: 'PAIN', status: 'OPEN', at: '2026-10-15T10:05', ago: 'ontem', sid: 's06', mine: true },
    { id: 'a05', kind: 'ABSENCE', status: 'OPEN', at: '2026-10-16T06:00', ago: 'há 4 h', sid: 's02', mine: true },
    { id: 'a06', kind: 'ABSENCE', status: 'OPEN', at: '2026-10-14T06:00', ago: 'há 2 dias', sid: 's05', mine: true },
    { id: 'a07', kind: 'ABSENCE', status: 'ACKNOWLEDGED', at: '2026-10-13T06:00', ago: 'há 3 dias', sid: 's03', mine: true },
    { id: 'a08', kind: 'CHECKIN_OVERDUE', status: 'OPEN', at: '2026-10-16T05:00', ago: 'há 5 h', sid: 's01', mine: true },
    { id: 'a09', kind: 'CHECKIN_OVERDUE', status: 'OPEN', at: '2026-10-15T05:00', ago: 'ontem', sid: 's03', mine: false, noOwner: true },
    { id: 'a10', kind: 'CHECKIN_OVERDUE', status: 'OPEN', at: '2026-10-12T05:00', ago: 'há 4 dias', sid: 's02', mine: true },
    { id: 'a11', kind: 'PAIN', status: 'RESOLVED', at: '2026-10-09T09:00', ago: 'há 7 dias', sid: 's01', mine: true, resolvedAt: '2026-10-09T15:00', resolvedBy: 'Você', today: false },
    { id: 'a12', kind: 'ABSENCE', status: 'RESOLVED', at: '2026-10-08T06:00', ago: 'há 8 dias', sid: 's02', mine: true, resolvedAt: '2026-10-16T09:00', resolvedBy: 'Você', today: true },
    { id: 'a13', kind: 'CHECKIN_OVERDUE', status: 'RESOLVED', at: '2026-10-06T05:00', ago: 'há 10 dias', sid: 's03', mine: true, resolvedAt: '2026-10-07T10:00', resolvedBy: 'Rafael Antunes', today: false },
    { id: 'a14', kind: 'PAIN', status: 'RESOLVED', at: '2026-09-05T09:00', ago: 'há 41 dias', sid: 's21', mine: true, resolvedAt: '2026-09-05T12:00', resolvedBy: 'Você', today: false },
    { id: 'a15', kind: 'PAIN', status: 'OPEN', at: '2026-10-14T11:00', ago: 'há 2 dias', sid: 's04', mine: true },
    { id: 'a16', kind: 'PAIN', status: 'OPEN', at: '2026-10-13T11:00', ago: 'há 3 dias', sid: 's23', mine: true },
    { id: 'a17', kind: 'ABSENCE', status: 'OPEN', at: '2026-10-15T06:00', ago: 'ontem', sid: 's20', mine: true }
  ];
  var ADET = {
    a01: { region: 'Ombro direito [MOCK]', intensity: 6, note: '[MOCK] Desconforto ao final da série.', session: 'Hipertrofia A', set: 'Supino reto, série 3', when: '2026-10-16T08:35' },
    a02: { region: 'Joelho [MOCK]', intensity: 4, note: '[MOCK] Incômodo ao agachar.', session: 'Condicionamento 3x', set: 'Agachamento, série 2', when: '2026-10-16T07:05' },
    a03: { region: 'Lombar [MOCK]', intensity: 3, note: '', session: 'Força base', set: 'Levantamento terra, série 1', when: '2026-10-15T19:25' },
    a05: { expectedDay: 'quinta-feira, 15/10/2026', session: 'Condicionamento 3x, sessão B' },
    a07: { expectedDay: 'segunda-feira, 12/10/2026', session: 'Força base, sessão A' },
    a08: { questionnaire: 'Check-in semanal', sentAt: '2026-10-09', dueAt: '2026-10-15' },
    a09: { questionnaire: 'Check-in semanal', sentAt: '2026-10-08', dueAt: '2026-10-14' },
    a10: { questionnaire: 'Check-in semanal', sentAt: '2026-10-05', dueAt: '2026-10-12' }
  };
  E.alerts = ALERTS;
  E.alertDetail = function (id, opts) {
    var a = ALERTS.filter(function (x) { return x.id === id; })[0];
    return a && ADET[id] && ok(a.sid, opts) ? ADET[id] : null;
  };

  /* ---- execucoes (TRN-31): so alunos dentro do portao existem aqui (regra 8) ---- */
  function sets(rows) { return rows.map(function (r) { return { planned: r[0], reps: r[1], load: r[2], rpe: r[3], extra: !!r[4], comment: r[5] || '' }; }); }
  var SESSIONS = [
    { id: 'x01', sid: 's01', date: '2026-10-15T07:30', label: 'Hipertrofia A', min: 52, status: 'COMPLETED', done: 12, total: 14, rpe: 8, video: 'READY', origin: 'aluno', ready: 'Sono bom, energia média, humor bom', feedback: [],
      ex: [{ name: 'Supino reto [MOCK]', sets: sets([['10 x 40 kg', 10, 40, 7], ['10 x 40 kg', 10, 40, 8], ['10 x 40 kg', 8, 40, 9, false, '[MOCK] A última foi pesada.']]) }, { name: 'Remada baixa [MOCK]', sets: sets([['12 x 35 kg', 12, 35, 7], ['12 x 35 kg', 12, 35, 7], ['12 x 35 kg', 12, 35, 8]]) }],
      pain: [{ region: 'Ombro direito [MOCK]', intensity: 6, note: '[MOCK] Desconforto ao final da série.', setRef: 'Supino reto, série 3', alertId: 'a01' }] },
    { id: 'x02', sid: 's01', date: '2026-10-13T07:30', label: 'Hipertrofia B', min: 49, status: 'COMPLETED', done: 14, total: 14, rpe: 7, video: null, origin: 'aluno', feedback: [{ role: 'Aluno', name: 'Marina', body: '[MOCK] Terminei o treino, achei leve hoje.', at: '2026-10-13T09:00', reactions: [] }, { role: 'Você', name: 'Carla Mendes', body: '[MOCK] Boa. Na próxima sessão aumentamos a carga.', at: '2026-10-13T11:00', reactions: ['Curti'] }],
      ex: [{ name: 'Agachamento [MOCK]', sets: sets([['10 x 50 kg', 10, 50, 7], ['10 x 50 kg', 10, 50, 7]]) }, { name: 'Elevação pélvica [MOCK]', sets: sets([['12 x 60 kg', 12, 60, 6], ['12 x 60 kg', 12, 60, 7]]) }], pain: [] },
    { id: 'x03', sid: 's01', date: '2026-10-11T07:30', label: 'Hipertrofia A', min: 55, status: 'COMPLETED', done: 15, total: 14, rpe: 7, video: 'READY', origin: 'aluno', feedback: [{ role: 'Aluno', name: 'Marina', body: '[MOCK] Fiz uma série a mais.', at: '2026-10-11T09:00', reactions: [] }],
      ex: [{ name: 'Supino reto [MOCK]', sets: sets([['10 x 40 kg', 10, 40, 7], ['10 x 40 kg', 10, 40, 7], ['10 x 40 kg', 10, 40, 8], ['Extra', 8, 40, 8, true, '[MOCK] Série extra.']]) }], pain: [] },
    { id: 'x04', sid: 's02', date: '2026-10-14T18:00', label: 'Condicionamento 3x, sessão A', min: 44, status: 'COMPLETED', done: 10, total: 10, rpe: 6, video: null, origin: 'voce', feedback: [],
      ex: [{ name: 'Remo na máquina [MOCK]', subst: 'Remada curvada [MOCK]', reason: '[MOCK] Equipamento ocupado.', sets: sets([['12 x 30 kg', 12, 30, 6], ['12 x 30 kg', 12, 30, 6]]) }], pain: [] },
    { id: 'x05', sid: 's02', date: '2026-10-12T18:00', label: 'Condicionamento 3x, sessão B', min: 20, status: 'INTERRUPTED', done: 5, total: 12, rpe: 5, video: null, origin: 'voce', feedback: [], ex: [{ name: 'Agachamento [MOCK]', sets: sets([['12 x 40 kg', 12, 40, 5], ['12 x 40 kg', 6, 40, 6]]) }], pain: [] },
    { id: 'x06', sid: 's03', date: '2026-10-16T09:10', label: 'Força base, sessão A', min: 18, status: 'IN_PROGRESS', done: 4, total: 12, rpe: null, video: null, origin: 'aluno', feedback: [], ex: [{ name: 'Levantamento terra [MOCK]', sets: sets([['5 x 60 kg', 5, 60, 7], ['5 x 60 kg', 5, 60, 7]]) }], pain: [] },
    { id: 'x07', sid: 's03', date: '2026-10-13T09:10', label: 'Força base, sessão B', min: 50, status: 'COMPLETED', done: 12, total: 12, rpe: 7, video: 'PENDING', origin: 'aluno', feedback: [{ role: 'Você', name: 'Carla Mendes', body: '[MOCK] Boa técnica.', at: '2026-10-13T12:00', reactions: ['Forte'] }], ex: [{ name: 'Levantamento terra [MOCK]', sets: sets([['5 x 60 kg', 5, 60, 7], ['5 x 60 kg', 5, 60, 7]]) }], pain: [] },
    { id: 'x08', sid: 's03', date: '2026-10-10T09:10', label: 'Força base, sessão A', min: 47, status: 'COMPLETED', done: 12, total: 12, rpe: 7, video: null, origin: 'aluno', feedback: [], ex: [{ name: 'Levantamento terra [MOCK]', sets: sets([['5 x 57,5 kg', 5, 57.5, 7], ['5 x 57,5 kg', 5, 57.5, 7]]) }], pain: [] }
  ];
  E.sessions = function (opts) { return SESSIONS.filter(function (x) { return ok(x.sid, opts); }); };
  E.session = function (id, opts) { var s = SESSIONS.filter(function (x) { return x.id === id; })[0]; return s && ok(s.sid, opts) ? s : null; };

  /* ---- questionarios (TRN-32): modelos nao sao dado de aluno; envios e respostas so no portao ---- */
  E.templates = [
    { id: 't1', kind: 'Check-in', name: 'Check-in semanal', scope: 'GLOBAL', version: 2, vstatus: 'Publicada', n: 6 },
    { id: 't2', kind: 'Anamnese', name: 'Anamnese inicial', scope: 'GLOBAL', version: 1, vstatus: 'Publicada', n: 14 },
    { id: 't3', kind: 'Avaliação', name: 'Avaliação de medidas', scope: 'GLOBAL', version: 3, vstatus: 'Publicada', n: 9 },
    { id: 't4', kind: 'Check-in', name: 'Check-in semanal (sua cópia)', scope: 'TENANT', version: 3, vstatus: 'Rascunho', n: 7 },
    { id: 't5', kind: 'Avaliação', name: 'Avaliação de fotos mensal', scope: 'TENANT', version: 1, vstatus: 'Publicada', n: 5 }
  ];
  E.questions = [
    { key: 'peso', type: 'Número', label: 'Peso (kg)', on: true, std: true },
    { key: 'sono', type: 'Escala', label: 'Como foi o seu sono?', on: true, std: false },
    { key: 'inc', type: 'Sim/Não', label: 'Sentiu algum incômodo?', on: true, std: false },
    { key: 'foto', type: 'Foto', label: 'Foto de evolução', on: false, std: true, sensitive: true },
    { key: 'livre', type: 'Texto', label: 'Quer contar algo? [MOCK]', on: true, std: false }
  ];
  var SUBS = [
    { id: 'q01', sid: 's01', tpl: 'Check-in semanal', ver: 2, status: 'PENDING', sent: '2026-10-14', due: '2026-10-21', origin: 'voce' },
    { id: 'q02', sid: 's02', tpl: 'Check-in semanal', ver: 2, status: 'PENDING', sent: '2026-10-14', due: '2026-10-21', origin: 'voce' },
    { id: 'q03', sid: 's03', tpl: 'Check-in semanal', ver: 2, status: 'PENDING', sent: '2026-10-15', due: null, origin: 'voce' },
    { id: 'q04', sid: 's02', tpl: 'Check-in semanal', ver: 2, status: 'PENDING', sent: '2026-10-05', due: '2026-10-12', origin: 'voce', overdue: true },
    { id: 'q05', sid: 's01', tpl: 'Avaliação de medidas', ver: 3, status: 'SUBMITTED', sent: '2026-10-01', due: null, at: '2026-10-02', origin: 'aluno' },
    { id: 'q06', sid: 's03', tpl: 'Check-in semanal', ver: 2, status: 'SUBMITTED', sent: '2026-10-08', due: '2026-10-15', at: '2026-10-12', origin: 'aluno' },
    { id: 'q07', sid: 's01', tpl: 'Check-in semanal', ver: 2, status: 'SUBMITTED', sent: '2026-10-07', due: '2026-10-14', at: '2026-10-09', origin: 'aluno' },
    { id: 'q08', sid: 's03', tpl: 'Anamnese inicial', ver: 1, status: 'CANCELED', sent: '2026-09-20', due: null, origin: 'voce' }
  ];
  var ANS = [['Peso (kg)', '70,1 kg'], ['Como foi o seu sono?', '3 de 5 (1 = muito ruim, 5 = muito bom)'], ['Sentiu algum incômodo?', 'Não'], ['Quer contar algo? [MOCK]', '[MOCK] Semana tranquila.']];
  E.submissions = function (opts) { return SUBS.filter(function (x) { return ok(x.sid, opts); }); };
  E.submission = function (id, opts) { var s = SUBS.filter(function (x) { return x.id === id; })[0]; return s && ok(s.sid, opts) ? s : null; };
  E.answers = function (id, opts) { var s = E.submission(id, opts); return s && s.status === 'SUBMITTED' ? ANS : null; };
  E.weights = [['03/08', 72.4], ['14/09', 71.0], ['02/10', 70.4], ['09/10', 70.1]];

  /* ---- chat (TRN-33): lista so com metadado; texto so no portao; fora dele a conversa e "mensagem geral" ---- */
  E.convs = [
    { id: 'c1', sid: 's01', unread: 2, last: '2026-10-16T09:12', lastText: 'hoje' },
    { id: 'c2', sid: 's02', unread: 0, last: '2026-10-15T18:40', lastText: 'ontem' },
    { id: 'c3', sid: 's03', unread: 1, last: '2026-10-15T08:00', lastText: 'ontem' },
    { id: 'c4', sid: 's06', unread: 0, last: '2026-10-02T12:00', lastText: '02/10' },
    { id: 'c5', sid: 's05', unread: 0, last: '2026-10-05T12:00', lastText: '05/10' }
  ];
  var MSGS = {
    c1: [['S', '2026-10-15T20:00', '[MOCK] Treino de quinta movido para sexta?'], ['P', '2026-10-15T20:10', '[MOCK] Pode ser, sexta às 7h.'], ['S', '2026-10-16T09:00', '[MOCK] Combinado, obrigada.'], ['S', '2026-10-16T09:12', '[MOCK] Levo a garrafa nova.']],
    c2: [['P', '2026-10-14T10:00', '[MOCK] Bom dia, confirmado o horário de amanhã.'], ['S', '2026-10-14T10:30', '[MOCK] Confirmado.'], ['P', '2026-10-15T18:40', '[MOCK] Até lá.']],
    c3: [['S', '2026-10-14T17:00', '[MOCK] Posso trocar o horário de terça?'], ['P', '2026-10-14T17:20', '[MOCK] Posso sim, às 18h.'], ['S', '2026-10-15T08:00', '[MOCK] Perfeito.']]
  };
  E.messages = function (cid, opts) {
    var c = E.convs.filter(function (x) { return x.id === cid; })[0]; if (!c || !ok(c.sid, opts) || !MSGS[cid]) return [];
    return MSGS[cid].map(function (m, i) { return { id: cid + 'm' + i, role: m[0] === 'P' ? 'PERSONAL' : 'STUDENT', at: m[1], body: m[2] }; });
  };

  /* ---- notificacoes (TRN-34): texto SEMPRE generico ---- */
  E.notifs = [
    { id: 'n01', kind: 'ALERT', text: 'Novo alerta de um aluno', sid: 's01', at: '2026-10-16T08:40', ago: 'há 2 h', read: false, href: 'alertas.html?alerta=a01' },
    { id: 'n02', kind: 'MESSAGE', text: 'Nova mensagem', sid: 's01', at: '2026-10-16T09:12', ago: 'há 1 h', read: false, href: 'mensagens.html' },
    { id: 'n03', kind: 'ALERT', text: 'Novo alerta de um aluno', sid: 's02', at: '2026-10-16T07:10', ago: 'há 3 h', read: false, href: 'alertas.html' },
    { id: 'n04', kind: 'QUESTIONNAIRE', text: 'Questionário respondido', sid: 's03', at: '2026-10-12T12:00', ago: 'há 4 dias', read: true, href: 'questionario-resposta.html?id=q06' },
    { id: 'n05', kind: 'ALERT', text: 'Novo alerta de um aluno', sid: 's06', at: '2026-10-15T10:05', ago: 'ontem', read: true, href: 'alertas.html?variant=detalhe-oculto-revogado' },
    { id: 'n06', kind: 'MESSAGE', text: 'Nova mensagem', sid: 's03', at: '2026-10-15T08:00', ago: 'ontem', read: true, href: 'mensagens.html' },
    { id: 'n07', kind: 'LINK', text: 'Convite aceito', sid: 's19', at: '2026-10-14T10:00', ago: 'há 2 dias', read: true, href: '../alunos/meus-alunos.html' },
    { id: 'n08', kind: 'LINK', text: 'Vínculo pausado', sid: 's05', at: '2026-10-05T10:00', ago: 'há 11 dias', read: true, href: '../alunos/aluno-detalhe.html?id=s05' },
    { id: 'n09', kind: 'QUESTIONNAIRE', text: 'Questionário respondido', sid: 's01', at: '2026-10-09T10:00', ago: 'há 7 dias', read: true, href: 'questionario-resposta.html?id=q07' },
    { id: 'n10', kind: 'MESSAGE', text: 'Nova mensagem', sid: 's02', at: '2026-10-14T10:30', ago: 'há 2 dias', read: true, href: 'mensagens.html' },
    { id: 'n11', kind: 'ALERT', text: 'Novo alerta de um aluno', sid: 's04', at: '2026-10-14T11:00', ago: 'há 2 dias', read: true, href: 'alertas.html?variant=detalhe-oculto-sem-consentimento' },
    { id: 'n12', kind: 'SYSTEM', text: 'Manutenção programada no domingo', sid: null, at: '2026-10-10T08:00', ago: 'há 6 dias', read: true, href: '' }
  ];
  D.E = E;
})();
