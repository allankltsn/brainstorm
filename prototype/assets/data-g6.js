/* data-g6.js - dados ficticios do G6 (training: Exercicios TRN-10..14 e Treinos TRN-20..24, lotes B e C).
   Tudo [MOCK]. Nenhum dado de saude e nenhum dado de aluno aqui: alunos so entram por G5DATA (nome + portao unico de saude). */
(function () {
  var A = window.AURA;
  var MUS = [['peitoral', 'Peitoral'], ['costas', 'Costas'], ['ombros', 'Ombros'], ['biceps', 'Bíceps'], ['triceps', 'Tríceps'], ['quadriceps', 'Quadríceps'], ['posteriores', 'Posteriores de coxa'], ['gluteos', 'Glúteos'], ['panturrilhas', 'Panturrilhas'], ['abdomen', 'Abdômen'], ['lombar', 'Lombar'], ['antebracos', 'Antebraços']];
  var EQ = [['halter', 'Halter'], ['barra', 'Barra'], ['maquina', 'Máquina'], ['cabo', 'Cabo'], ['corpo', 'Peso do corpo'], ['elastico', 'Elástico'], ['kettlebell', 'Kettlebell'], ['banco', 'Banco']];
  var PAT = [['empurrar', 'Empurrar'], ['puxar', 'Puxar'], ['agachar', 'Agachar'], ['dobradica', 'Dobradiça de quadril'], ['core', 'Core'], ['passada', 'Passada']];
  var TAGS = ['iniciante', 'força', 'hipertrofia', 'mobilidade', 'unilateral', 'composto', 'isolador', 'em casa', 'aquecimento', 'core'];
  var LEVEL = { BEGINNER: 'Iniciante', INTERMEDIATE: 'Intermediário', ADVANCED: 'Avançado' };
  var VIS = { PRIVATE: 'Privado', SHARED: 'Compartilhado', PUBLIC: 'Público' };
  function lab(list, id) { for (var i = 0; i < list.length; i++) if (list[i][0] === id) return list[i][1]; return id; }

  /* [id, nome, nivel, padrao, primarios, secundarios, equipamentos, tags] */
  var SYS = [
    ['e01', 'Agachamento livre', 'INTERMEDIATE', 'agachar', ['quadriceps', 'gluteos'], ['lombar'], ['barra'], ['composto', 'força']],
    ['e02', 'Supino reto', 'INTERMEDIATE', 'empurrar', ['peitoral'], ['triceps', 'ombros'], ['barra', 'banco'], ['composto', 'hipertrofia']],
    ['e03', 'Remada curvada', 'INTERMEDIATE', 'puxar', ['costas'], ['biceps'], ['barra'], ['composto']],
    ['e04', 'Desenvolvimento com halteres', 'INTERMEDIATE', 'empurrar', ['ombros'], ['triceps'], ['halter', 'banco'], ['hipertrofia']],
    ['e05', 'Levantamento terra romeno', 'ADVANCED', 'dobradica', ['posteriores', 'gluteos'], ['lombar'], ['barra'], ['força', 'composto']],
    ['e06', 'Rosca direta', 'BEGINNER', 'puxar', ['biceps'], ['antebracos'], ['barra'], ['isolador']],
    ['e07', 'Tríceps na polia', 'BEGINNER', 'empurrar', ['triceps'], [], ['cabo'], ['isolador']],
    ['e08', 'Prancha', 'BEGINNER', 'core', ['abdomen'], ['ombros'], ['corpo'], ['core', 'em casa', 'iniciante']],
    ['e09', 'Afundo', 'BEGINNER', 'passada', ['quadriceps', 'gluteos'], [], ['halter', 'corpo'], ['unilateral', 'iniciante']],
    ['e10', 'Elevação pélvica', 'BEGINNER', 'dobradica', ['gluteos'], ['posteriores'], ['barra', 'banco'], ['iniciante']],
    ['e11', 'Puxada frontal', 'BEGINNER', 'puxar', ['costas'], ['biceps'], ['cabo', 'maquina'], ['iniciante', 'hipertrofia']],
    ['e12', 'Leg press', 'BEGINNER', 'agachar', ['quadriceps'], ['gluteos'], ['maquina'], ['iniciante']],
    ['e13', 'Flexão de braço', 'BEGINNER', 'empurrar', ['peitoral'], ['triceps', 'abdomen'], ['corpo'], ['em casa', 'iniciante']],
    ['e14', 'Abdominal infra', 'BEGINNER', 'core', ['abdomen'], [], ['corpo'], ['core', 'em casa']],
    ['e15', 'Panturrilha em pé', 'BEGINNER', 'empurrar', ['panturrilhas'], [], ['maquina'], ['isolador']],
    ['e16', 'Elevação lateral', 'BEGINNER', 'empurrar', ['ombros'], [], ['halter'], ['isolador', 'hipertrofia']]
  ];
  var MINE = [
    ['m01', 'Agachamento com pausa [MOCK]', 'INTERMEDIATE', 'agachar', ['quadriceps'], ['gluteos'], ['barra'], ['força'], 'PRIVATE', null, null, null],
    ['m02', 'Remada unilateral [MOCK]', 'BEGINNER', 'puxar', ['costas'], ['biceps'], ['halter', 'banco'], ['unilateral'], 'PRIVATE', null, null, null],
    ['m03', 'Circuito de core [MOCK]', 'BEGINNER', 'core', ['abdomen'], [], ['corpo'], ['core', 'em casa'], 'SHARED', null, null, null],
    ['m04', 'Ponte com elástico [MOCK]', 'BEGINNER', 'dobradica', ['gluteos'], [], ['elastico'], ['aquecimento'], 'PUBLIC', null, null, null],
    ['m05', 'Supino reto (cópia) [MOCK]', 'INTERMEDIATE', 'empurrar', ['peitoral'], ['triceps'], ['barra', 'banco'], ['hipertrofia'], 'PRIVATE', 'e02', 'Supino reto', null],
    ['m06', 'Exercício antigo [MOCK]', 'BEGINNER', 'core', ['abdomen'], [], ['corpo'], [], 'PRIVATE', null, null, '2026-09-20']
  ];
  var OTHERS = [
    ['c01', 'Remada alta com kettlebell [MOCK]', 'INTERMEDIATE', 'puxar', ['costas', 'ombros'], [], ['kettlebell'], ['composto'], 'SHARED', 'Rafael Antunes'],
    ['c02', 'Mobilidade de quadril [MOCK]', 'BEGINNER', 'passada', ['gluteos'], [], ['corpo'], ['mobilidade', 'aquecimento'], 'SHARED', 'Rafael Antunes'],
    ['c03', 'Pull-over com halter [MOCK]', 'INTERMEDIATE', 'puxar', ['costas', 'peitoral'], [], ['halter', 'banco'], ['isolador'], 'SHARED', 'Helena Duarte'],
    ['c04', 'Agachamento sumô [MOCK]', 'BEGINNER', 'agachar', ['quadriceps', 'gluteos'], [], ['kettlebell'], ['iniciante'], 'SHARED', 'Helena Duarte'],
    ['p01', 'Flexão inclinada [MOCK]', 'BEGINNER', 'empurrar', ['peitoral'], ['ombros'], ['banco', 'corpo'], ['iniciante', 'em casa'], 'PUBLIC', 'Marcos Valle'],
    ['p02', 'Bom dia com elástico [MOCK]', 'BEGINNER', 'dobradica', ['posteriores', 'lombar'], [], ['elastico'], ['aquecimento'], 'PUBLIC', 'Marcos Valle']
  ];
  function ex(r, kind) {
    var o = { id: r[0], name: r[1], level: r[2], pattern: r[3], primary: r[4], secondary: r[5], equipment: r[6], tags: r[7], posterRefState: 'READY', mediaCount: 1 };
    if (kind === 'sys') { o.scope = 'GLOBAL'; o.visibility = 'PUBLIC'; o.origin = 'SYSTEM'; o.owner = 'aura'; o.archivedAt = null; o.originId = null; o.originName = null; o.createdAt = '2026-01-10'; }
    else if (kind === 'mine') { o.scope = 'TENANT'; o.visibility = r[8]; o.origin = 'OWN'; o.owner = 'Você'; o.originId = r[9]; o.originName = r[10]; o.archivedAt = r[11]; o.createdAt = '2026-0' + (3 + (+r[0].slice(1) % 5)) + '-1' + (+r[0].slice(1) % 9); }
    else { o.scope = 'TENANT'; o.visibility = r[8]; o.origin = r[8] === 'PUBLIC' ? 'PUBLIC_OTHER' : 'SHARED_WITH_ME'; o.owner = r[9]; o.archivedAt = null; o.originId = null; o.originName = null; o.createdAt = '2026-06-05'; }
    return o;
  }
  var exercises = SYS.map(function (r) { return ex(r, 'sys'); }).concat(MINE.map(function (r) { return ex(r, 'mine'); }), OTHERS.map(function (r) { return ex(r, 'oth'); }));
  exercises[exercises.length - 2].posterRefState = 'NONE'; exercises[exercises.length - 2].mediaCount = 0;
  exercises[16 + 1].posterRefState = 'NONE'; exercises[16 + 1].mediaCount = 0;
  function exFind(id) { for (var i = 0; i < exercises.length; i++) if (exercises[i].id === id) return exercises[i]; return null; }

  function exDetail(e) {
    var d = Object.assign({}, e);
    d.instructions = ['[MOCK] Posicione-se com a postura confortável e os pés firmes no chão.', '[MOCK] Execute o movimento de forma controlada, sem pressa.', '[MOCK] Volte à posição inicial respirando de forma natural.'];
    d.commonMistakes = ['[MOCK] Pressa na descida.', '[MOCK] Perder o alinhamento do tronco.'];
    d.media = e.mediaCount ? [
      { id: 'v1', role: 'DEMO_VIDEO', refState: 'READY', durationSec: 24, title: 'Demonstração', alt: '[MOCK] Demonstração do exercício em vídeo, vista lateral, sem som.' },
      { id: 'i1', role: 'IMAGE', refState: 'READY', title: 'Posição inicial', alt: '[MOCK] Ilustração da posição inicial do exercício.' }
    ] : [];
    var rel = [];
    if (e.id === 'e01') rel = [['VARIATION', 'e12', 'Leg press'], ['SUBSTITUTE', 'e09', 'Afundo']];
    else if (e.id === 'e02') rel = [['VARIATION', 'e13', 'Flexão de braço']];
    else rel = [['SUBSTITUTE', 'e09', 'Afundo'], ['VARIATION', 'e13', 'Flexão de braço']];
    d.relations = rel.filter(function (r) { return r[1] !== e.id; }).map(function (r) { return { kind: r[0], relatedId: r[1], relatedName: r[2] }; });
    d.usedInModels = e.origin === 'OWN' || e.origin === 'SYSTEM' ? [{ id: 'p01', name: 'Full body iniciante [MOCK]' }, { id: 'p02', name: 'Hipertrofia A/B [MOCK]' }, { id: 'p03', name: 'Força base [MOCK]' }] : [];
    d.createdByName = e.owner === 'aura' ? 'aura (sistema)' : e.owner === 'Você' ? 'Carla Mendes' : e.owner;
    return d;
  }

  /* ---------------- modelos de treino (Programas) ---------------- */
  var programs = [
    { id: 'p01', name: 'Full body iniciante [MOCK]', goal: 'Adaptação geral', level: 'BEGINNER', status: 'ACTIVE', version: 3, sessionsCount: 3, itemsCount: 18, updatedAt: '2026-10-08', scope: 'OWN', owner: 'Você', usedBy: 3 },
    { id: 'p02', name: 'Hipertrofia A/B [MOCK]', goal: 'Hipertrofia', level: 'INTERMEDIATE', status: 'ACTIVE', version: 2, sessionsCount: 2, itemsCount: 14, updatedAt: '2026-09-28', scope: 'OWN', owner: 'Você', usedBy: 2 },
    { id: 'p03', name: 'Força base [MOCK]', goal: 'Força', level: 'INTERMEDIATE', status: 'ACTIVE', version: 4, sessionsCount: 3, itemsCount: 16, updatedAt: '2026-10-12', scope: 'OWN', owner: 'Você', usedBy: 1 },
    { id: 'p04', name: 'Condicionamento 3x [MOCK]', goal: 'Condicionamento', level: 'BEGINNER', status: 'ACTIVE', version: 1, sessionsCount: 3, itemsCount: 15, updatedAt: '2026-09-02', scope: 'OWN', owner: 'Você', usedBy: 1 },
    { id: 'p05', name: 'Adaptação inicial [MOCK]', goal: 'Adaptação geral', level: 'BEGINNER', status: 'DRAFT', version: 1, sessionsCount: 1, itemsCount: 5, updatedAt: '2026-10-14', scope: 'OWN', owner: 'Você', usedBy: 0 },
    { id: 'p06', name: 'Emagrecimento 4x [MOCK]', goal: 'Emagrecimento', level: 'INTERMEDIATE', status: 'DRAFT', version: 1, sessionsCount: 2, itemsCount: 9, updatedAt: '2026-10-15', scope: 'OWN', owner: 'Você', usedBy: 0 },
    { id: 'p07', name: 'Antigo ABC [MOCK]', goal: 'Hipertrofia', level: 'ADVANCED', status: 'ARCHIVED', version: 5, sessionsCount: 3, itemsCount: 22, updatedAt: '2026-06-30', scope: 'OWN', owner: 'Você', usedBy: 0 },
    { id: 'p08', name: 'Core e mobilidade [MOCK]', goal: 'Mobilidade', level: 'BEGINNER', status: 'ACTIVE', version: 2, sessionsCount: 1, itemsCount: 7, updatedAt: '2026-08-19', scope: 'OWN', owner: 'Você', usedBy: 0 },
    { id: 's01', name: 'Full body 3x [MOCK]', goal: 'Adaptação geral', level: 'BEGINNER', status: 'ACTIVE', version: 1, sessionsCount: 3, itemsCount: 15, updatedAt: '2026-05-01', scope: 'SYSTEM', owner: 'aura', usedBy: 0 },
    { id: 's02', name: 'Divisão A/B superior e inferior [MOCK]', goal: 'Hipertrofia', level: 'INTERMEDIATE', status: 'ACTIVE', version: 2, sessionsCount: 2, itemsCount: 12, updatedAt: '2026-05-01', scope: 'SYSTEM', owner: 'aura', usedBy: 0 },
    { id: 's03', name: 'Condicionamento em casa [MOCK]', goal: 'Condicionamento', level: 'BEGINNER', status: 'ACTIVE', version: 1, sessionsCount: 2, itemsCount: 10, updatedAt: '2026-05-01', scope: 'SYSTEM', owner: 'aura', usedBy: 0 },
    { id: 'x01', name: 'Peito e costas [MOCK]', goal: 'Hipertrofia', level: 'INTERMEDIATE', status: 'ACTIVE', version: 3, sessionsCount: 2, itemsCount: 11, updatedAt: '2026-08-10', scope: 'PUBLIC', owner: 'Marcos Valle', usedBy: 0 },
    { id: 'x02', name: 'Glúteos 2x [MOCK]', goal: 'Hipertrofia', level: 'BEGINNER', status: 'ACTIVE', version: 2, sessionsCount: 2, itemsCount: 9, updatedAt: '2026-07-22', scope: 'SHARED', owner: 'Rafael Antunes', usedBy: 0 },
    { id: 'x03', name: 'Força 5x5 [MOCK]', goal: 'Força', level: 'ADVANCED', status: 'ACTIVE', version: 1, sessionsCount: 2, itemsCount: 8, updatedAt: '2026-09-09', scope: 'SHARED', owner: 'Helena Duarte', usedBy: 0 }
  ];
  function prFind(id) { for (var i = 0; i < programs.length; i++) if (programs[i].id === id) return programs[i]; return null; }

  /* modelo exemplo (3 sessoes, 1 bi-set, 1 circuito, 1 item com exercicio arquivado). Sem dado de aluno. */
  var uid = 0;
  function U(p) { uid += 1; return (p || 'u') + uid; }
  function S(type, a, b, load, rpe, rest, tempo) { return { type: type, repsMin: a, repsMax: b, load: load, rpe: rpe, rest: rest, tempo: tempo || '', notes: '' }; }
  function IT(exId, name, sets, extra) { var it = { uid: U('i'), exerciseId: exId, name: name, origin: (exFind(exId) || {}).origin || 'SYSTEM', archived: false, unavailable: false, notes: '', sets: sets, done: null }; for (var k in extra) it[k] = extra[k]; return it; }
  function sample() {
    uid = 0;
    return {
      id: 'p01', name: 'Full body iniciante [MOCK]', goal: 'Adaptação geral', level: 'BEGINNER', description: '[MOCK] Modelo de exemplo para o protótipo.', status: 'ACTIVE', version: 3,
      sessions: [
        { uid: U('s'), label: 'A', name: 'Inferiores e core', notes: '', blocks: [
          { uid: U('b'), type: 'item', item: IT('e01', 'Agachamento livre', [S('WARMUP', 12, 12, null, null, 60), S('NORMAL', 8, 10, 40, 7, 90, '3-1-1-0'), S('NORMAL', 8, 10, 40, 7.5, 90), S('NORMAL', 8, 10, 40, 8, 120)]) },
          { uid: U('b'), type: 'group', gtype: 'BISET', rounds: 3, rest: 90, notes: '', items: [IT('e02', 'Supino reto', [S('NORMAL', 8, 10, 30, 7, 60), S('NORMAL', 8, 10, 30, 8, 60)]), IT('e03', 'Remada curvada', [S('NORMAL', 8, 10, 30, 7, 60), S('NORMAL', 8, 10, 30, 8, 60)])] },
          { uid: U('b'), type: 'item', item: IT('e12', 'Leg press', [S('NORMAL', 10, 12, 80, null, 90)]) }
        ] },
        { uid: U('s'), label: 'B', name: 'Core e acessórios', notes: '', blocks: [
          { uid: U('b'), type: 'group', gtype: 'CIRCUIT', rounds: 3, rest: 60, notes: '', items: [IT('e08', 'Prancha', [S('NORMAL', 30, 45, null, null, 20)]), IT('e09', 'Afundo', [S('NORMAL', 10, 12, null, 6, 20)]), IT('e10', 'Elevação pélvica', [S('NORMAL', 12, 15, 20, null, 20)])] },
          { uid: U('b'), type: 'item', item: IT('m06', 'Exercício antigo [MOCK]', [S('NORMAL', 15, 20, null, null, 45)], { archived: true, origin: 'OWN' }) }
        ] },
        { uid: U('s'), label: 'C', name: 'Superiores', notes: '', blocks: [
          { uid: U('b'), type: 'item', item: IT('e04', 'Desenvolvimento com halteres', [S('NORMAL', 8, 12, 10, 7, 90), S('NORMAL', 8, 12, 10, 8, 90)]) },
          { uid: U('b'), type: 'item', item: IT('e11', 'Puxada frontal', [S('NORMAL', 10, 12, 35, null, 60), S('NORMAL', 10, 12, 35, null, 60)]) }
        ] }
      ]
    };
  }
  function emptyModel() { uid = 0; return { id: null, name: '', goal: '', level: '', description: '', status: 'DRAFT', version: 1, sessions: [{ uid: U('s'), label: 'A', name: '', notes: '', blocks: [] }] }; }

  /* ---------------- alunos elegiveis (apenas nome + portao; sem treino/saude) ---------------- */
  var STUDENT_IDS = ['s01', 's02', 's03', 's08', 's04', 's06', 's20', 's05'];

  /* ---------------- historico de versoes do modelo ---------------- */
  var versions = [
    { version: 4, publishedAt: '2026-10-12', by: 'Carla Mendes', summary: 'Adicionou 1 sessão e trocou 2 exercícios.', status: 'CURRENT', changes: [{ kind: 'ADDED', path: 'Sessão C', before: '', after: 'Nova sessão com 2 exercícios' }, { kind: 'CHANGED', path: 'Sessão A, item 3', before: 'Leg press', after: 'Afundo' }, { kind: 'CHANGED', path: 'Sessão B, item 1', before: 'Prancha 3 séries', after: 'Prancha 4 séries' }] },
    { version: 3, publishedAt: '2026-09-15', by: 'Carla Mendes', summary: 'Ajustou séries e descansos da sessão A.', status: 'PREVIOUS', changes: [{ kind: 'CHANGED', path: 'Sessão A, item 1', before: 'Descanso 60 s', after: 'Descanso 90 s' }, { kind: 'REMOVED', path: 'Sessão A, item 4', before: 'Abdominal infra', after: '' }] },
    { version: 2, publishedAt: '2026-08-02', by: 'Carla Mendes', summary: 'Criou o bi-set de supino e remada.', status: 'PREVIOUS', changes: [{ kind: 'ADDED', path: 'Sessão A, bi-set', before: '', after: 'Supino reto + Remada curvada' }] },
    { version: 1, publishedAt: '2026-06-20', by: 'Carla Mendes', summary: 'Primeira versão do modelo.', status: 'PREVIOUS', changes: [{ kind: 'ADDED', path: 'Modelo', before: '', after: 'Estrutura inicial com 2 sessões' }] }
  ];
  var studentChanges = [
    { at: '2026-10-10', by: 'Carla Mendes', summary: 'Trocou 1 exercício da sessão B.', kind: 'ADJUST' },
    { at: '2026-09-22', by: 'Carla Mendes', summary: 'Retomou o treino.', kind: 'RESUMED' },
    { at: '2026-09-15', by: 'Carla Mendes', summary: 'Pausou o treino.', kind: 'PAUSED' },
    { at: '2026-09-01', by: 'Carla Mendes', summary: 'Atribuiu o modelo Full body iniciante v3.', kind: 'ASSIGNED' }
  ];

  window.G6DATA = {
    MUS: MUS, EQ: EQ, PAT: PAT, TAGS: TAGS, LEVEL: LEVEL, VIS: VIS, lab: lab,
    exercises: exercises, exFind: exFind, exDetail: exDetail, programs: programs, prFind: prFind,
    sample: sample, emptyModel: emptyModel, STUDENT_IDS: STUDENT_IDS, versions: versions, studentChanges: studentChanges,
    managerName: 'Ricardo Teles'
  };
})();
