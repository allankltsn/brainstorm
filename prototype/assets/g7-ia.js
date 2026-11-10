/* g7-ia.js - lote D (Prescricao com IA): TRN-40 painel de sugestoes, TRN-41 importar planilha ou texto, TRN-42 dados usados pela IA e consentimento IA.
   Carregar depois de g7-core.js e data-g7-ia.js. Tudo [MOCK]; respostas fixas de demonstracao. A IA so sugere, nunca grava: "Aceitar" leva ao rascunho do editor
   (ids opacos na URL) e o "Salvar" do editor e o gravar. Nada de saude, pedido, resposta ou rascunho vai para localStorage/sessionStorage/caches. */
(function () {
  var G4 = window.G4, G5 = window.G5, G6 = window.G6, G7 = window.G7, A = window.AURA, D = window.G5DATA, I = window.G7IA;
  var esc = G7.esc, ico = G7.ico, badge = G7.badge, alertBox = G7.alertBox, selo = G7.selo, plural = G7.plural, V = G7.variant() || '';
  var LEGAL_ND = 'Isto não é diagnóstico nem orientação de saúde. Em caso de dúvida, o aluno deve procurar um profissional de saúde. [LEGAL] [MOCK] texto provisório.';

  function mount(o) {
    G4.setDefaultRole('personal');
    var r = G4.routes(); r.alunos = G4.url('../alunos/meus-alunos.html'); r.exercicios = G4.url('../exercicios/catalogo.html'); r.treinos = G4.url('../treinos/biblioteca.html');
    r.alertas = G4.url('../acompanhamento/alertas.html'); r.execucoes = G4.url('../acompanhamento/execucoes.html'); r.questionarios = G4.url('../acompanhamento/questionarios.html'); r.mensagens = G4.url('../acompanhamento/mensagens.html');
    r.ia = G4.url('painel-sugestoes.html'); r['dados-ia'] = G4.url('dados-ia.html'); r['importar-ia'] = G4.url('importar.html');
    window.AuraShell.mount({ role: 'personal', active: o.active, title: o.title, routes: r });
    document.addEventListener('aura:shellready', function () { document.title = o.id + ' · ' + o.title + ' · aura-fit'; });
  }
  function url(p, extra) { return G4.url(p, extra); }
  function param(k) { return G7.param(k); }
  function crumbs(items) { return G5.breadcrumb([['Início', G7.home()]].concat(items)); }
  function fmt(iso) { return A.fmtDate(String(iso).slice(0, 10)); }
  function timeEl(iso) { return '<time datetime="' + esc(iso) + '">' + esc(A.fmtDateTime(iso)) + '</time>'; }
  function live(el, msg) { G7.live(el, msg); }
  function btn(label, attrs, cls) { return '<button type="button" class="btn ' + (cls || 'btn-secondary') + '" ' + (attrs || '') + '>' + label + '</button>'; }

  /* ---------- situacao do aluno perante a IA (matriz 0.2 do UX); ordem de prioridade fixa ---------- */
  function situ(sid, stale) {
    var st = D.find(sid); if (!st) return null;
    var gate = D.gate(st, {}), ia = I.iaState[sid] || 'NEVER_GIVEN', key;
    if (gate.reason === 'idade') key = 'menor';
    else if (st.status === 'ENDED') key = 'encerrado';
    else if (st.status === 'SUSPENDED') key = 'pausado';
    else if (st.status === 'ENDING') key = 'encerrando';
    else if (stale) key = 'nao-confirmado';
    else if (ia === 'NEVER_GIVEN') key = 'ia-nao';
    else if (ia === 'REVOKED') key = 'ia-revogado';
    else key = 'ok';
    return { st: st, gate: gate, ia: ia, key: key, health: key === 'ok' && gate.ok, healthWhy: key === 'ok' && !gate.ok ? (gate.reason === 'revogado' ? 'saude-revogada' : 'saude-nao-liberada') : '' };
  }
  var BLOCK = {
    menor: ['Aguardando confirmação de idade ou responsável legal', 'Conta em espera. A IA não lê nada deste aluno.'],
    pausado: ['Vínculo pausado', 'A IA não lê dados de aluno com vínculo pausado.'],
    encerrando: ['Vínculo em encerramento', 'A IA não lê dados de aluno com vínculo em encerramento.'],
    encerrado: ['Vínculo encerrado', 'Só ficam o nome e o período do vínculo.'],
    'nao-confirmado': ['Não confirmado agora', 'Não conseguimos confirmar o uso de IA deste aluno agora. Por segurança, a IA não lê dados dele até confirmar.'],
    'ia-nao': ['Este aluno não liberou o uso de IA.', 'A IA não lê dados dele. Você pode pedir a liberação ao aluno ou usar a IA sem dados do aluno.'],
    'ia-revogado': ['O aluno revogou o uso de IA.', 'A IA não lê mais os dados dele. Sugestões antigas deste aluno ficam ocultas. O que você já salvou no treino não muda.']
  };
  var CATWHY = { menor: 'Bloqueado: aguardando idade ou responsável legal', pausado: 'Bloqueado: vínculo pausado', encerrando: 'Bloqueado: vínculo em encerramento', encerrado: 'Bloqueado: vínculo encerrado', 'nao-confirmado': 'Bloqueado: consentimento não confirmado agora', 'ia-nao': 'Bloqueado: uso de IA não liberado', 'ia-revogado': 'Bloqueado: uso de IA revogado', 'saude-nao-liberada': 'Bloqueado: saúde não liberada', 'saude-revogada': 'Bloqueado: saúde revogada' };
  function catSituation(S, c) { if (S.key !== 'ok') return CATWHY[S.key]; if (c.health && !S.health) return CATWHY[S.healthWhy]; return ''; }
  function iaLabel(S) { return { GRANTED: 'Liberado', NEVER_GIVEN: 'Não liberado', REVOKED: 'Revogado' }[S.ia]; }
  function stateBadge(S) {
    if (S.key === 'nao-confirmado') return badge('warning', 'clock', 'Não confirmado agora');
    if (S.ia === 'GRANTED') return badge('success', 'check-circle', 'Liberado');
    if (S.ia === 'REVOKED') return badge('danger', 'ban', 'Revogado');
    return badge('neutral', 'lock', 'Não liberado');
  }
  function quotaBox(used) {
    var L = I.quota.limit, rest = Math.max(0, L - used);
    return '<div class="g8-quota"><p id="g8-qt"><strong>' + used + ' de ' + L + ' sugestões neste mês.</strong> Restam ' + rest + '.</p><progress class="g8-progress" max="' + L + '" value="' + used + '" aria-labelledby="g8-qt"></progress>' +
      (used >= L * 0.9 && used < L ? '<p class="g5-hint" role="status">Você usou ' + used + ' de ' + L + ' sugestões neste mês.</p>' : '') + '</div>';
  }
  function limitBox() { return alertBox('info', 'Você chegou ao limite de sugestões do mês.', 'Você pode montar treinos normalmente, sem IA. A cota volta em ' + I.quota.resetsAt + ' [MOCK]. <a class="btn btn-secondary" href="' + esc(url('../config/assinatura.html')) + '">Ver planos</a>'); }
  function noPlanBox() { return alertBox('info', 'O seu plano não inclui sugestões com IA.', 'O resto do Aura continua igual. <a class="btn btn-secondary" href="' + esc(url('../config/assinatura.html')) + '">Ver planos</a>'); }
  function faixa() { return '<p class="g8-faixa" role="note">' + ico('info') + '<span><strong>A IA só sugere. Você decide e salva.</strong> Ela pode errar.</span></p>'; }
  function head(h, sub, id) { return '<h1 id="titulo">' + esc(h) + ' ' + selo(id) + '</h1><p id="sub">' + esc(sub) + '</p>'; }

  /* ---------- pedido de liberacao (I5): so personal responsavel; sem texto livre; 1 por mes [MOCK] ---------- */
  var asked = {};
  function askModal(S, opener, after, again) {
    var body = '<ul class="g4-list-plain"><li>O aluno recebe um aviso genérico no app: "Seu personal pediu para usar IA no seu treino".</li><li>Ele decide e pode recusar sem consequência para o treino.</li><li>Você não vê dados até ele liberar.</li><li>Você pode pedir uma vez por mês [MOCK].</li></ul>' + (again ? '<p><strong>O aluno já revogou antes. Pedir de novo pode incomodar. Continuar?</strong></p>' : '');
    var busy = false;
    G7.modal({ title: 'Pedir ao aluno que libere o uso de IA?', body: body, okLabel: 'Enviar pedido', cancelLabel: 'Cancelar', opener: opener, onOk: function (wrap) {
      if (busy) return false;
      if (V === 'erro-pedido') { setTimeout(function () { after('erro'); }, 0); return true; }
      asked[S.st.id] = '2026-10-16'; setTimeout(function () { after('ok'); }, 0); window.AuraUI.toast('Pedido enviado.', { tone: 'success' }); return true;
    } });
  }

  /* ---------- matriz de categorias (TRN-42 e passo 3 do TRN-40) ---------- */
  function matrix(S, o) {
    o = o || {};
    var rows = I.CATS.map(function (c) {
      var why = catSituation(S, c), ok = !why, id = 'cat-' + c.key;
      var sw = ok && o.switches ? '<label class="switch"><input type="checkbox" role="switch" data-cat="' + c.key + '" aria-labelledby="' + id + ' sw-' + c.key + '"' + (o.cats && o.cats[c.key] ? ' checked' : '') + (o.off ? ' disabled' : '') + '><span class="switch-text" id="sw-' + c.key + '">Usar nesta sugestão <span class="g8-state" data-st="' + c.key + '">' + (o.cats && o.cats[c.key] ? '(ligado)' : '(desligado)') + '</span></span></label>' : '<span class="muted">' + (ok ? 'Escolha na geração' : 'Não disponível') + '</span>';
      return '<tr><th scope="row" class="cell-main" id="' + id + '">' + esc(c.label) + (c.selo ? ' ' + selo(c.selo) : '') + '</th><td data-label="Situação">' + (ok ? badge('success', 'check-circle', 'Disponível') : badge('neutral', 'lock', why)) + '</td><td data-label="Motivo">' + esc(ok ? (c.health ? 'Saúde liberada e uso de IA liberado.' : 'Não é dado de saúde.') : why.replace('Bloqueado: ', '')) + '</td><td data-label="Usar nesta sugestão">' + sw + '</td></tr>';
    }).join('');
    rows += '<tr><th scope="row" class="cell-main">' + esc(I.MEDIA.label) + '</th><td data-label="Situação">' + badge('neutral', 'ban', I.MEDIA.text) + '</td><td data-label="Motivo">Padrão conservador. [LEGAL] [MOCK] texto provisório.</td><td data-label="Usar nesta sugestão"><span class="muted">Sem exceção</span></td></tr>';
    return '<div class="table-wrap" tabindex="0" role="region" aria-label="Categorias de dados e situação"><table class="table"><caption class="sr-only">Categorias de dados que a IA pode ler e a situação de cada uma</caption><thead><tr><th scope="col">Categoria</th><th scope="col">Situação</th><th scope="col">Motivo</th><th scope="col">Usar nesta sugestão</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function studentSelect(id, sel, label) {
    return '<div class="field"><label for="' + id + '">' + esc(label) + '</label><div class="select-wrap"><select class="select" id="' + id + '">' + I.students.map(function (sid) {
      var s = situ(sid), bad = ['menor', 'pausado', 'encerrando', 'encerrado'].indexOf(s.key) !== -1;
      return '<option value="' + sid + '"' + (sid === sel ? ' selected' : '') + '>' + esc(s.st.name + (bad ? ' (indisponível)' : '')) + '</option>';
    }).join('') + '</select></div></div>';
  }
  function blockCard(S, o) {
    o = o || {}; var b = BLOCK[S.key]; if (!b) return '';
    var acts = '';
    var did = !!asked[S.st.id], dd = did ? ' disabled aria-describedby="g8-askwhy"' : '';
    if (o.ask && S.key === 'ia-nao') acts = btn('Pedir liberação', 'data-ask' + dd, 'btn-secondary') + btn('Usar sem dados do aluno', 'data-nodata');
    else if (o.ask && S.key === 'ia-revogado') acts = btn('Usar sem dados do aluno', 'data-nodata') + btn('Pedir liberação', 'data-ask data-again' + dd);
    else if (o.ask && S.key === 'nao-confirmado') acts = btn('Tentar de novo', 'data-retry') + btn('Usar sem dados do aluno', 'data-nodata');
    else if (o.ask) acts = btn('Usar sem dados do aluno', 'data-nodata');
    return '<section class="card g8-block" aria-labelledby="g8-bh"><div class="card-body stack"><h2 class="h3" id="g8-bh">' + ico('lock') + ' ' + esc(b[0]) + '</h2><p>' + esc(b[1]) + '</p>' + (asked[S.st.id] ? '<p class="g5-hint" id="g8-askwhy" role="status">Pedido enviado em ' + fmt(asked[S.st.id]) + '. Aguardando o aluno.</p>' : '') + (acts ? '<div class="row">' + acts + '</div>' : '') + '</div></section>';
  }

  /* ======================= TRN-40 Painel de sugestoes ======================= */
  var PRE40 = { 'para-aluno': 's03', 'ia-sem-consentimento': 's01', 'ia-revogado': 's07', 'saude-nao-liberada': 's04', 'saude-revogada': 's06', 'nao-confirmado': 's03', 'vinculo-pausado': 's05', 'vinculo-encerrando': 's23', 'vinculo-encerrado': 's21', 'menor-em-espera': 's20',
    'resultado-com-pontos-de-atencao': 's03', aceitando: 's03', 'aceita-no-rascunho': 's03', dispensada: 's03', conflito: 's03', offline: 's03', 'resposta-bloqueada': 's03', 'erro-gerar': 's03', 'ia-indisponivel': 's03', 'resposta-vazia': 's03' };
  var RESULT_V = ['resultado', 'resultado-sem-pontos-de-atencao', 'resultado-com-pontos-de-atencao', 'sugestao-sem-evidencia', 'sugestao-exercicio-fora-do-catalogo', 'aceitando', 'aceita-no-rascunho', 'dispensada', 'conflito', 'offline'];
  var ERR_V = ['erro-gerar', 'resposta-vazia', 'resposta-bloqueada', 'ia-indisponivel'];
  var HEALTHWORDS = /(les[aã]o|cirurgia|diagn[oó]stic|medicament|doen[cç]a|press[aã]o alta|diabet)/i;

  function painel() {
    var origem = param('origem') || 'modelo', sidParam = param('aluno'), preSid = PRE40[V] || (sidParam && D.find(sidParam) ? sidParam : '');
    var S = { step: 1, mode: preSid ? 'STUDENT' : 'NONE', sid: preSid || 's03', inp: { goal: '', level: '', days: '3', dur: '60', equip: '', restr: '', free: '' }, cats: {}, res: null, sug: {}, att: {}, fb: {}, busy: false, tab: 'sug', used: I.quota.used, err: null, errs: {}, timer: null };
    if (V === 'sem-dados-do-aluno') { S.mode = 'NONE'; S.step = 2; }
    if (V === 'pedido-passo-1') S.step = 1; if (V === 'pedido-passo-2') { S.step = 2; } if (V === 'dados-passo-3') { S.step = 3; S.mode = 'STUDENT'; } if (V === 'resumo') { S.step = 4; S.mode = 'STUDENT'; }
    var filled = V !== 'padrao' && V !== 'pedido-passo-1' && V !== 'pedido-passo-2' && V !== 'erro-validacao' && V !== 'sem-dados-do-aluno';
    if (filled) S.inp = { goal: 'Hipertrofia', level: 'Intermediário', days: '3', dur: '60', equip: 'Halteres e barra', restr: '', free: '' };
    if (V === 'erro-validacao') { S.step = 2; }
    if (V === 'limite-cota') S.used = I.quota.limit;
    var NOPLAN = V === 'sem-plano-ia', OFFLINE = V === 'offline', CONFLICT = V === 'conflito';
    var el;

    function curS() { return S.mode === 'STUDENT' ? situ(S.sid, V === 'nao-confirmado') : null; }
    function studentBlocked() { var s = curS(); return !!s && s.key !== 'ok'; }
    function healthOK() { var s = curS(); return !!s && s.health; }
    function chosenLabels() { return I.CATS.filter(function (c) { return S.cats[c.key]; }).map(function (c) { return c.label.toLowerCase(); }); }
    function genDisabledWhy() {
      if (NOPLAN) return 'O seu plano não inclui sugestões com IA.';
      if (S.used >= I.quota.limit) return 'Você chegou ao limite de sugestões do mês.';
      if (OFFLINE) return 'Sem conexão. Gerar fica desabilitado.';
      if (S.mode === 'STUDENT' && studentBlocked()) return 'Este aluno não está disponível para a IA. Escolha "Sem dados do aluno".';
      return '';
    }
    function build() {
      var health = S.mode === 'STUDENT' && healthOK() && I.CATS.some(function (c) { return c.health && S.cats[c.key]; });
      var sugs = I.SUG.map(function (x) { return Object.assign({}, x, { whyAll: x.why.concat(chosenLabels().filter(function (l) { return l !== 'objetivo do treino'; })) }); });
      var atts = health ? I.ATT.filter(function (a) { return S.cats[a.needs]; }) : [];
      if (V === 'resultado-com-pontos-de-atencao' && !atts.length) atts = I.ATT.slice();
      S.res = { sugs: sugs, atts: atts, health: health || (V === 'resultado-com-pontos-de-atencao'), cats: chosenLabels().slice(), mode: S.mode, at: '2026-10-16T10:00' };
      if (V === 'aceita-no-rascunho') S.sug.sg2 = 'IN_DRAFT';
      if (V === 'dispensada') S.sug.sg3 = 'DISMISSED';
    }
    if (RESULT_V.indexOf(V) !== -1) {
      if (V === 'resultado-com-pontos-de-atencao') { S.cats = { GOAL: true, PAIN: true, EXECUTIONS: true, MEASURES: true }; }
      if (V === 'resultado-sem-pontos-de-atencao') { S.mode = 'NONE'; }
      if (V === 'resultado' || V === 'sugestao-sem-evidencia' || V === 'sugestao-exercicio-fora-do-catalogo') { S.mode = 'NONE'; }
      if (['aceitando', 'aceita-no-rascunho', 'dispensada', 'conflito', 'offline'].indexOf(V) !== -1) S.cats = { GOAL: true, PAIN: true, EXECUTIONS: true };
      S.step = 5; build();
    }
    if (ERR_V.indexOf(V) !== -1) { S.step = 4; S.err = V; }
    if (V === 'gerando') { S.step = 4; S.busy = true; }

    function editorUrl(ids) {
      var q = ids && ids.length ? 'ia=' + ids.join(',') : '';
      if (origem === 'treino' && S.sid) return url('../treinos/treino-aluno-editor.html', 'aluno=' + S.sid + (q ? '&' + q : ''));
      return url('../treinos/modelo-editor.html', 'variant=novo' + (q ? '&' + q : ''));
    }
    function draftIds() { return Object.keys(S.sug).filter(function (k) { return S.sug[k] === 'IN_DRAFT'; }); }
    function dirtyLeave() { return !!S.res && S.res.sugs.some(function (x) { return !S.sug[x.id]; }); }

    /* ---- pecas de tela ---- */
    function stepper() {
      var names = ['Contexto', 'Pedido', 'Dados', 'Resumo', 'Resultado'];
      return '<ol class="g8-stepper" aria-label="Etapas">' + names.map(function (n, i) { return '<li' + (S.step === i + 1 ? ' aria-current="step"' : '') + '><span class="g8-n" aria-hidden="true">' + (i + 1) + '</span> ' + esc(n) + '</li>'; }).join('') + '</ol>';
    }
    function sec1() {
      var s = curS(), h = '<section class="card g8-sec" data-s="1" aria-labelledby="g8-h1"><div class="card-body stack"><h2 class="h3" id="g8-h1">1. Contexto</h2>' +
        '<fieldset class="stack-sm g7-fs"><legend class="h4">Para quem é a sugestão</legend>' +
        '<label class="check g7-opt"><input type="radio" name="g8-mode" value="STUDENT"' + (S.mode === 'STUDENT' ? ' checked' : '') + '><span class="check-text">Para um aluno</span></label>' +
        '<label class="check g7-opt"><input type="radio" name="g8-mode" value="NONE"' + (S.mode === 'NONE' ? ' checked' : '') + '><span class="check-text">Sem dados do aluno<small>A IA não lê nada de ninguém. Só usa o que você digitar.</small></span></label></fieldset>';
      if (S.mode === 'STUDENT') h += studentSelect('g8-aluno', S.sid, 'Aluno') + (s ? (s.key !== 'ok' ? blockCard(s, { ask: !OFFLINE }) : (!s.health ? '<p class="g8-hidden" role="status">' + ico('lock') + '<span>Oculto por privacidade: ' + (s.healthWhy === 'saude-revogada' ? 'Saúde revogada pelo aluno' : 'Saúde não liberada pelo aluno') + '. A IA usa só o objetivo do treino.</span></p>' : '<p class="muted">' + stateBadge(s) + ' Uso de IA e saúde liberados por este aluno.</p>')) : '');
      else h += '<p class="muted">Modo sem dados do aluno: não há dado de pessoa. Não cole dado de saúde de pessoa identificável.</p>';
      return h + '</div></section>';
    }
    function counter(id, max, v) { return '<span class="field-help" id="' + id + '-c">' + (v || '').length + ' de ' + max + ' caracteres</span>'; }
    function sec2() {
      var e = S.errs, i = S.inp, rDis = S.mode === 'STUDENT' && !healthOK();
      function sel(id, label, opts, v, er) { return '<div class="field"><label for="' + id + '">' + label + '</label><div class="select-wrap"><select class="select" id="' + id + '"' + (er ? ' aria-invalid="true" aria-describedby="' + id + '-e"' : '') + '><option value="">Escolha</option>' + opts.map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></div>' + (er ? '<span class="field-error" id="' + id + '-e">' + esc(er) + '</span>' : '') + '</div>'; }
      return '<section class="card g8-sec" data-s="2" aria-labelledby="g8-h2"><div class="card-body stack"><h2 class="h3" id="g8-h2">2. Pedido</h2><div class="g8-grid">' +
        sel('g8-goal', 'Objetivo <span class="field-required">*</span>', ['Hipertrofia', 'Força', 'Emagrecimento', 'Condicionamento'], i.goal, e.goal) +
        sel('g8-level', 'Nível', ['Iniciante', 'Intermediário', 'Avançado'], i.level) +
        sel('g8-days', 'Dias por semana', ['1', '2', '3', '4', '5', '6', '7'], i.days, e.days) +
        sel('g8-dur', 'Duração por sessão (min)', ['30', '45', '60', '90'], i.dur) +
        '</div><div class="field"><label for="g8-equip">Equipamento</label><input class="input" id="g8-equip" maxlength="120" value="' + esc(i.equip) + '"></div>' +
        '<div class="field"><label for="g8-restr">Restrições digitadas (opcional)</label><textarea class="textarea" id="g8-restr" maxlength="300" rows="2" aria-describedby="g8-restr-h g8-restr-c"' + (rDis ? ' disabled' : '') + '>' + esc(i.restr) + '</textarea><span class="field-help" id="g8-restr-h">' + (rDis ? 'Desativado: este aluno não liberou saúde. ' : '') + 'Até 300 caracteres. Não cole dado de saúde de pessoa identificável. O texto não é guardado no navegador.</span>' + counter('g8-restr', 300, i.restr) + '<span class="field-help" id="g8-restr-w" role="status"></span></div>' +
        '<div class="field"><label for="g8-free">Pedido livre (opcional)</label><textarea class="textarea" id="g8-free" rows="3"' + (e.free ? ' aria-invalid="true" aria-describedby="g8-free-e"' : ' aria-describedby="g8-free-c"') + '>' + esc(i.free) + '</textarea>' + (e.free ? '<span class="field-error" id="g8-free-e">' + esc(e.free) + '</span>' : counter('g8-free', 500, i.free)) + '</div></div></section>';
    }
    function sec3() {
      var s = curS(), body;
      if (S.mode !== 'STUDENT') body = '<p>A IA não vai ler dados de nenhum aluno. Ela usa só o que você digitou no pedido.</p>';
      else if (!s || s.key !== 'ok') body = '<p>Este aluno não está disponível para a IA. Nenhum dado dele será lido. Volte ao contexto.</p>';
      else body = '<p>Marque o que a IA pode ler. Categorias de saúde começam desmarcadas a cada geração.</p>' + matrix(s, { switches: true, cats: S.cats, off: S.busy || OFFLINE }) + '<p><a href="' + esc(url('dados-ia.html', 'aluno=' + S.sid)) + '">Ver dados usados pela IA</a></p>';
      return '<section class="card g8-sec" data-s="3" aria-labelledby="g8-h3"><div class="card-body stack"><h2 class="h3" id="g8-h3">3. Dados que a IA vai ler</h2>' + body + '</div></section>';
    }
    function sec4() {
      var why = genDisabledWhy(), labels = chosenLabels();
      var st = S.busy ? '<div class="stack-sm" role="status"><progress class="g8-progress" aria-label="Gerando sugestões"></progress><p>Gerando sugestões. Isto pode levar até 30 segundos.</p>' + btn('Cancelar', 'data-cancelgen') + '</div>' : '';
      var err = '';
      if (S.err === 'erro-gerar') err = alertBox('danger', 'Não foi possível gerar sugestões agora.', 'Nada foi alterado e sua cota não foi usada. ' + btn('Tentar de novo', 'data-gen'));
      if (S.err === 'resposta-vazia') err = alertBox('warning', 'A IA não conseguiu sugerir nada para este pedido.', 'Ajuste o pedido ou monte o treino sem IA. <a href="' + esc(editorUrl()) + '">Montar sem IA</a>');
      if (S.err === 'resposta-bloqueada') err = alertBox('warning', 'A IA não pôde responder a este pedido.', 'Reescreva de outra forma.');
      if (S.err === 'ia-indisponivel') err = alertBox('warning', 'O serviço de IA está fora do ar.', 'Você pode continuar montando o treino sem IA. <a href="' + esc(editorUrl()) + '">Abrir o editor</a>');
      return '<section class="card g8-sec" data-s="4" aria-labelledby="g8-h4"><div class="card-body stack"><h2 class="h3" id="g8-h4">4. Resumo</h2>' +
        '<ul class="g4-list-plain"><li>Isto usa 1 sugestão da sua cota (' + S.used + ' de ' + I.quota.limit + ' neste mês).</li><li>A IA lê só os dados marcados: ' + esc(S.mode === 'STUDENT' && labels.length ? labels.join(', ') : 'nenhum dado de aluno') + '.</li><li>Fotos e vídeos nunca vão à IA.</li><li>Nada é salvo.</li></ul>' + err + st +
        '<div class="row g8-genrow">' + btn('Gerar sugestões', 'data-gen' + (why || S.busy ? ' disabled aria-describedby="g8-why"' : ''), 'btn-primary') + btn('Cancelar', 'data-cancel') + '</div>' + (why ? '<p class="g5-hint" id="g8-why">' + esc(why) + '</p>' : '') + '</div></section>';
    }
    function srcList(ids) {
      if (!ids.length) return '<p class="g8-nosrc">' + badge('neutral', 'info', 'Sem fonte citada') + ' Trate como ideia a conferir.</p>';
      return '<details class="g8-ev"><summary>Evidência (' + plural(ids.length, 'fonte', 'fontes') + ')</summary><ul class="g4-list-plain">' + ids.map(function (k) { var s = I.SRC[k]; return '<li>' + esc(s.org) + ', ' + s.year + ', ' + esc(s.type) + '. ' + esc(s.title) + ' ' + '<a href="#" data-ext rel="noopener" target="_blank">Abrir fonte<span class="g8-ext"> (abre em nova aba; você vai sair do Aura)</span></a><br><span class="muted">' + esc(s.sum) + '</span></li>'; }).join('') + '</ul><p class="g5-hint">O resumo foi escrito pela IA e pode conter erros. Confira a fonte.</p></details>';
    }
    function sugCard(x) {
      var stt = S.sug[x.id], fb = S.fb[x.id], dis = OFFLINE || CONFLICT ? ' disabled aria-describedby="g8-ac-why"' : '';
      var cat = x.kind === 'Exercício' ? '<p>' + (x.cat ? badge('success', 'check-circle', 'No catálogo: ' + x.cat) : badge('warning', 'alert', 'Não encontrado no catálogo') + ' A IA não cria exercício sozinha.') + '</p>' : '';
      var acts;
      if (stt === 'IN_DRAFT') acts = badge('success', 'check-circle', 'Levada ao rascunho') + btn('Remover do rascunho', 'data-undraft="' + x.id + '" aria-label="Remover do rascunho: ' + esc(x.title) + '"');
      else if (stt === 'DISMISSED') acts = badge('neutral', 'ban', 'Dispensada') + btn('Restaurar', 'data-restore="' + x.id + '" aria-label="Restaurar sugestão: ' + esc(x.title) + '"');
      else acts = btn('Aceitar', 'data-accept="' + x.id + '" aria-label="Aceitar sugestão: ' + esc(x.title) + '"' + dis) + btn('Dispensar', 'data-dismiss="' + x.id + '" aria-label="Dispensar sugestão: ' + esc(x.title) + '"');
      var fbb = '<span class="g8-fb">' + btn('Útil', 'data-fb="USEFUL:' + x.id + '" aria-pressed="' + (fb === 'USEFUL') + '" aria-label="Marcar como útil: ' + esc(x.title) + '"', 'btn-neutral') + btn('Não útil', 'data-fb="NOT_USEFUL:' + x.id + '" aria-pressed="' + (fb === 'NOT_USEFUL') + '" aria-label="Marcar como não útil: ' + esc(x.title) + '"', 'btn-neutral') + '</span>';
      return '<article class="card g8-sug' + (stt === 'IN_DRAFT' ? ' is-draft' : '') + '" aria-labelledby="h-' + x.id + '"><div class="card-body stack-sm"><div class="row">' + badge('info', 'sparkles', 'Gerado por IA') + '<span class="badge">' + esc(x.kind) + '</span></div><h3 class="h4" id="h-' + x.id + '">' + esc(x.title) + '</h3><p>' + esc(x.change) + '</p>' +
        '<p><strong>Por que a IA sugeriu:</strong> Considerou: ' + esc(x.whyAll.join(', ')) + '.</p>' + cat + srcList(x.ev) + '<div class="row g8-acts">' + acts + '</div>' + fbb + '</div></article>';
    }
    function attCard(a) {
      var stt = S.att[a.id];
      var acts = stt === 'SEEN' ? badge('info', 'eye', 'Visto nesta tela') : stt === 'DISMISSED' ? badge('neutral', 'ban', 'Dispensado') + btn('Restaurar', 'data-attrest="' + a.id + '" aria-label="Restaurar ponto de atenção: ' + esc(a.sev) + '"') : btn('Entendi', 'data-attseen="' + a.id + '" aria-label="Entendi: ' + esc(a.sev) + '"') + btn('Dispensar', 'data-attdis="' + a.id + '" aria-label="Dispensar ponto de atenção: ' + esc(a.sev) + '"');
      return '<article class="card g8-att" aria-labelledby="h-' + a.id + '"><div class="card-body stack-sm"><div class="row">' + badge('info', 'sparkles', 'Gerado por IA') + badge('warning', 'eye', a.sev) + '</div><h3 class="h4" id="h-' + a.id + '">Ponto de atenção</h3><p>' + esc(a.text) + '</p>' + srcList(a.ev) + '<p class="g5-hint">' + esc(LEGAL_ND) + '</p><div class="row">' + acts + '</div></div></article>';
    }
    function attPane() {
      var r = S.res, s = curS(), h = '<section class="g8-pane" data-pane="att" aria-labelledby="g8-hatt"><h2 class="h3" id="g8-hatt">Pontos de atenção</h2>';
      if (!r.health) {
        var why = r.mode !== 'STUDENT' ? 'a IA não leu dados de saúde nesta geração (modo sem dados do aluno).' : (s && s.key === 'ok' && !s.health ? 'a IA não leu dados de saúde nesta geração.' : 'a IA não leu dados de saúde nesta geração, porque nenhuma categoria de saúde foi marcada.');
        h += '<p class="muted">Pontos de atenção indisponíveis: ' + esc(why) + '</p>' + (s && s.key === 'ok' && !s.health ? G7.gateCard(s.gate) : '');
      } else if (!r.atts.length) h += '<p>A IA não apontou pontos de atenção. Isso não garante que não existam.</p>';
      else h += '<div class="stack">' + r.atts.map(attCard).join('') + '</div>';
      return h + '</section>';
    }
    function howPane() {
      var r = S.res;
      return '<section class="g8-pane" data-pane="how" aria-labelledby="g8-hhow"><h2 class="h3" id="g8-hhow">Como a IA chegou aqui</h2><details class="card g8-how"><summary>Ver a justificativa</summary><div class="card-body"><ul class="g4-list-plain"><li><strong>Dados lidos:</strong> ' + esc(r.mode === 'STUDENT' && r.cats.length ? r.cats.join(', ') + ' (últimos 30 dias)' : 'nenhum dado de aluno; só o pedido digitado') + '.</li><li><strong>Não lidos:</strong> o que ficou desmarcado, fotos e vídeos.</li><li><strong>Limites:</strong> A IA não examina o aluno, não conhece o histórico completo e pode errar.</li><li><strong>Quem decide:</strong> você.</li><li><strong>O que ficou registrado:</strong> data, quem pediu e categorias, sem o conteúdo.</li></ul>' + (r.mode === 'STUDENT' ? '<p><a href="' + esc(url('dados-ia.html', 'aluno=' + S.sid)) + '">Ver dados usados</a></p>' : '') + '</div></details></section>';
    }
    function resultHtml() {
      var r = S.res; if (!r) {
        return '<div class="g8-empty">' + (S.busy ? '' : '<div class="empty-state"><div class="empty-state-icon">' + ico('sparkles') + '</div><h2 class="h3">Nenhuma sugestão ainda.</h2><p>Descreva o treino que você quer montar e a IA sugere um ponto de partida. Você revisa tudo.</p>' + btn('Começar', 'data-start', 'btn-secondary') + '</div>') + '</div>';
      }
      var visible = r.sugs, n = visible.length, na = r.atts.length, ids = draftIds();
      var draftbar = ids.length ? '<div class="alert alert-info g8-draftbar" role="status">' + ico('info') + '<div class="alert-body"><div class="alert-title">' + plural(ids.length, 'sugestão no rascunho', 'sugestões no rascunho') + '. Nada foi salvo.</div><p><a class="btn btn-primary" href="' + esc(editorUrl(ids)) + '">Abrir o editor com o rascunho</a></p></div></div>' : '';
      return '<div class="g8-result"><div class="g8-rhead"><h2 class="h3" id="g8-rh" tabindex="-1">Resultado</h2><p class="g5-hint">' + (n + ' ' + (n === 1 ? 'sugestão' : 'sugestões')) + (r.health ? ' e ' + plural(na, 'ponto de atenção', 'pontos de atenção') : '') + '. Sugestões não aceitas serão descartadas ao sair. O treino salvo não muda.</p>' +
        (CONFLICT ? alertBox('warning', 'Este treino mudou desde que você pediu.', 'Recarregue antes de aceitar. ' + btn('Recarregar', 'data-reload')) : '') + ((OFFLINE || CONFLICT) ? '<p class="g5-hint" id="g8-ac-why">' + (OFFLINE ? 'Sem conexão: aceitar fica desabilitado. O resultado na tela continua legível.' : 'Aceitar está desabilitado até recarregar.') + '</p>' : '') + draftbar +
        G7.tabs('Resultado', [['sug', 'Sugestões', n], ['att', 'Atenção'], ['how', 'Como chegou aqui']], S.tab, 'rs-') + '</div>' +
        '<div id="rs-pn" role="tabpanel" aria-labelledby="rs-' + S.tab + '" tabindex="0" class="g8-panes g8-show-' + S.tab + '"><section class="g8-pane" data-pane="sug" aria-labelledby="g8-hsug"><h2 class="h3" id="g8-hsug">Sugestões</h2><div class="stack">' + visible.map(sugCard).join('') + '</div></section>' + attPane() + howPane() + '</div>' +
        '<div class="row g8-rfoot">' + btn('Gerar de novo', 'data-regen' + (genDisabledWhy() ? ' disabled aria-describedby="g8-why2"' : '')) + '<a class="btn btn-secondary" href="' + esc(editorUrl()) + '" data-leave>Voltar ao editor sem usar</a></div>' + (genDisabledWhy() ? '<p class="g5-hint" id="g8-why2">' + esc(genDisabledWhy()) + '</p>' : '') + '</div>';
    }
    function draw() {
      var banners = (OFFLINE ? G7.offlineBox() : '') + (NOPLAN ? noPlanBox() : '') + (S.used >= I.quota.limit && !NOPLAN ? limitBox() : '');
      el.innerHTML = '<div class="stack">' + faixa() + (NOPLAN ? '' : quotaBox(S.used)) + banners + G7.liveBox() + stepper() +
        '<div class="g8-layout"><div class="g8-form" data-step="' + S.step + '">' + sec1() + sec2() + sec3() + sec4() +
        '<div class="row g8-mnav">' + (S.step > 1 ? btn('Voltar', 'data-prev') : '') + (S.step < 4 ? btn('Continuar', 'data-next', 'btn-primary') : '') + '</div></div><div class="g8-out" id="g8-out">' + resultHtml() + '</div></div></div>';
      var t = el.querySelector('[role="tablist"]'); if (t) G7.tabKeys(el, function (k) { S.tab = k; var cur = el.querySelector('#rs-' + k); drawResultOnly(); var f = el.querySelector('#rs-' + k); if (f) f.focus(); });
    }
    function drawResultOnly() { var out = el.querySelector('#g8-out'); out.innerHTML = resultHtml(); var t = el.querySelector('[role="tablist"]'); if (t) G7.tabKeys(el, function (k) { S.tab = k; drawResultOnly(); var f = el.querySelector('#rs-' + k); if (f) f.focus(); }); }
    function setStep(n, focusSel) { S.step = n; draw(); var f = focusSel && el.querySelector(focusSel); if (f) f.focus(); }

    function validate() {
      S.errs = {}; var i = S.inp;
      if (!i.goal) S.errs.goal = 'Informe o objetivo.';
      if (!i.days) S.errs.days = 'Escolha ao menos um dia por semana.';
      if (i.free.length > 500) S.errs.free = 'O pedido passou de 500 caracteres.';
      return !Object.keys(S.errs).length;
    }
    function generate() {
      if (S.busy || genDisabledWhy()) return;
      if (!validate()) { setStep(2); var f = el.querySelector('[aria-invalid="true"]'); if (f) f.focus(); return; }
      S.busy = true; S.err = null; S.res = null; draw(); live(el, 'Gerando sugestões.');
      var b = el.querySelector('.g8-form'); if (b) b.setAttribute('aria-busy', 'true');
      S.timer = setTimeout(function () {
        S.busy = false; S.timer = null;
        if (ERR_V.indexOf(V) !== -1) { S.err = V; draw(); return; }
        S.used += 1; build(); S.step = 5; draw();
        var r = S.res; live(el, r.sugs.length + ' sugestões prontas e ' + r.atts.length + ' pontos de atenção');
        var h = el.querySelector('#g8-rh'); if (h) h.focus();
      }, 800);
    }
    function acceptFlow(id, opener) {
      var x = S.res.sugs.filter(function (s) { return s.id === id; })[0]; if (!x || OFFLINE || CONFLICT) return;
      G7.modal({ title: 'Levar esta sugestão ao rascunho?', opener: opener, okLabel: 'Levar ao rascunho', cancelLabel: 'Cancelar',
        body: '<p><strong>O que muda:</strong> ' + esc(x.change) + '</p><ul class="g4-list-plain"><li>Nada é salvo ainda.</li><li>Você poderá editar tudo no editor.</li><li>O aluno não é avisado.</li></ul>',
        onOk: function () { S.sug[id] = 'IN_DRAFT'; setTimeout(function () { drawResultOnly(); window.AuraUI.toast('Sugestão levada ao rascunho.', { tone: 'success' }); live(el, 'Sugestão levada ao rascunho.'); var b = el.querySelector('[data-undraft="' + id + '"]'); if (b) b.focus(); }, 0); return true; } });
    }
    function bind() {
      el.addEventListener('click', function (e) {
        var t = e.target, b;
        if (t.closest('[data-ext]')) { e.preventDefault(); window.AuraUI.toast('Link de demonstração: nada foi aberto.', { tone: 'info' }); return; }
        if ((b = t.closest('[data-accept]'))) return acceptFlow(b.dataset.accept, b);
        if ((b = t.closest('[data-dismiss]'))) { S.sug[b.dataset.dismiss] = 'DISMISSED'; drawResultOnly(); live(el, 'Sugestão dispensada.'); return; }
        if ((b = t.closest('[data-restore]'))) { delete S.sug[b.dataset.restore]; drawResultOnly(); live(el, 'Sugestão restaurada.'); return; }
        if ((b = t.closest('[data-undraft]'))) { delete S.sug[b.dataset.undraft]; drawResultOnly(); live(el, 'Sugestão removida do rascunho.'); return; }
        if ((b = t.closest('[data-fb]'))) { var p = b.dataset.fb.split(':'); S.fb[p[1]] = S.fb[p[1]] === p[0] ? null : p[0]; drawResultOnly(); var nb = el.querySelector('[data-fb="' + b.dataset.fb + '"]'); if (nb) nb.focus(); return; }
        if ((b = t.closest('[data-attseen]'))) { S.att[b.dataset.attseen] = 'SEEN'; drawResultOnly(); return; }
        if ((b = t.closest('[data-attdis]'))) { S.att[b.dataset.attdis] = 'DISMISSED'; drawResultOnly(); return; }
        if ((b = t.closest('[data-attrest]'))) { delete S.att[b.dataset.attrest]; drawResultOnly(); return; }
        if (t.closest('[data-gen]') && !t.closest('[disabled]')) return generate();
        if (t.closest('[data-regen]') && !t.closest('[disabled]')) { window.AuraUI.confirm({ title: 'Gerar de novo?', text: 'Isto usa mais 1 sugestão da sua cota (' + S.used + ' de ' + I.quota.limit + ' neste mês). As sugestões atuais não aceitas serão descartadas.', confirmLabel: 'Gerar de novo', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) { S.sug = {}; generate(); } }); return; }
        if (t.closest('[data-cancelgen]')) { clearTimeout(S.timer); S.busy = false; S.err = null; draw(); live(el, 'Geração cancelada.'); return; }
        if (t.closest('[data-cancel]')) { var back = editorUrl(); if (dirtyLeave()) { window.AuraUI.confirm({ title: 'Sair sem usar as sugestões?', text: 'Sugestões não aceitas serão descartadas. O treino salvo não muda.', confirmLabel: 'Sair', cancelLabel: 'Continuar aqui' }).then(function (ok) { if (ok) location.href = back; }); } else location.href = back; return; }
        if ((b = t.closest('[data-leave]')) && dirtyLeave()) { e.preventDefault(); var hrefL = b.getAttribute('href'); window.AuraUI.confirm({ title: 'Sair sem usar as sugestões?', text: 'Sugestões não aceitas serão descartadas. O treino salvo não muda.', confirmLabel: 'Sair', cancelLabel: 'Continuar aqui' }).then(function (ok) { if (ok) location.href = hrefL; }); return; }
        if (t.closest('[data-next]')) return setStep(Math.min(4, S.step + 1), '#g8-h' + Math.min(4, S.step + 1));
        if (t.closest('[data-prev]')) return setStep(Math.max(1, S.step - 1), '#g8-h' + Math.max(1, S.step - 1));
        if (t.closest('[data-start]')) { setStep(2); var g = el.querySelector('#g8-goal'); if (g) g.focus(); return; }
        if (t.closest('[data-nodata]')) { S.mode = 'NONE'; S.cats = {}; draw(); var r0 = el.querySelector('input[name="g8-mode"]:checked'); if (r0) r0.focus(); return; }
        if (t.closest('[data-reload]')) { location.reload(); return; }
        if (t.closest('[data-retry]')) { location.href = location.pathname + '?' + location.search.replace(/^\?/, '').split('&').filter(function (q) { return q && q.indexOf('variant=') !== 0; }).join('&'); return; }
        if ((b = t.closest('[data-ask]'))) { var S2 = curS(); if (!S2 || OFFLINE) return; askModal(S2, b, function (r) { if (r === 'erro') { var m = el.querySelector('#g8-bh'); if (m) m.parentNode.insertAdjacentHTML('beforeend', alertBox('danger', '', 'Não foi possível enviar o pedido. O aluno não foi avisado.')); } else { draw(); live(el, 'Pedido enviado.'); } }, b.hasAttribute('data-again')); }
      });
      el.addEventListener('change', function (e) {
        var t = e.target;
        if (t.name === 'g8-mode') { S.mode = t.value; if (S.mode === 'NONE') S.cats = {}; draw(); var r = el.querySelector('input[name="g8-mode"]:checked'); if (r) r.focus(); return; }
        if (t.id === 'g8-aluno') { S.sid = t.value; S.cats = {}; draw(); el.querySelector('#g8-aluno').focus(); return; }
        if (t.dataset && t.dataset.cat) { S.cats[t.dataset.cat] = t.checked; var s = el.querySelector('[data-st="' + t.dataset.cat + '"]'); if (s) s.textContent = t.checked ? '(ligado)' : '(desligado)'; live(el, t.checked ? 'Ligado.' : 'Desligado.'); return; }
        var m = { 'g8-goal': 'goal', 'g8-level': 'level', 'g8-days': 'days', 'g8-dur': 'dur' }[t.id]; if (m) { S.inp[m] = t.value; delete S.errs[m]; }
      });
      el.addEventListener('input', function (e) {
        var t = e.target, m = { 'g8-equip': 'equip', 'g8-restr': 'restr', 'g8-free': 'free' }[t.id]; if (!m) return;
        S.inp[m] = t.value; var c = el.querySelector('#' + t.id + '-c'); if (c) c.textContent = t.value.length + ' de ' + (t.id === 'g8-restr' ? 300 : 500) + ' caracteres';
        if (t.id === 'g8-restr') { var w = el.querySelector('#g8-restr-w'); if (w) w.textContent = HEALTHWORDS.test(t.value) ? 'Parece conter dado de saúde. Remova antes de gerar. (Aviso simples de protótipo, não é proteção.) [LEGAL-REVIEW]' : ''; }
      });
      window.addEventListener('beforeunload', function (e) { if (dirtyLeave() && !OFFLINE) { e.preventDefault(); e.returnValue = ''; } });
    }
    G6.boot(V === 'sem-permissao' ? 'sem-permissao' : V === 'carregando' ? 'carregando' : V === 'erro' ? 'erro' : '', { rows: 5, skel: 'cards', errText: 'Não foi possível carregar o painel de sugestões.', render: function (e) {
      el = e; document.getElementById('bc').innerHTML = crumbs([['Prescrição com IA']]);
      draw(); bind();
      if (V === 'aceitando') acceptFlow('sg2', null);
      if (V === 'gerando') { var bz = el.querySelector('.g8-form'); if (bz) bz.setAttribute('aria-busy', 'true'); }
    } });
  }

  /* ======================= TRN-41 Importar planilha ou texto ======================= */
  function importar() {
    var instr = V === 'texto-com-instrucao';
    var S = { step: 1, src: V === 'origem-texto' || instr ? 'TEXT' : 'FILE', ack: !!(V !== 'aviso-nao-marcado' && V !== 'padrao' && V !== 'origem-arquivo' && V !== 'origem-texto'), rows: null, dec: {}, err: null, busy: V === 'lendo', fileName: 'planilha-treino.csv', text: '', used: V === 'limite-cota' ? I.quota.limit : I.quota.used, timer: null };
    if (V === 'erro-validacao') { S.src = 'TEXT'; S.err = 'arquivo-vazio'; S.ack = true; }
    if (V === 'aviso-nao-marcado') S.ack = false;
    if (V === 'padrao' || V === 'origem-arquivo' || V === 'origem-texto') S.ack = false;
    if (['arquivo-grande', 'arquivo-formato-invalido', 'arquivo-com-macros', 'arquivo-vazio', 'limite-linhas', 'erro-ler'].indexOf(V) !== -1) { S.err = V; S.ack = true; }
    var REV = ['revisao', 'revisao-ambigua', 'revisao-nao-reconhecida', 'revisao-tudo-decidido', 'aceitar-reconhecidas', 'resumo', 'levando-ao-editor', 'texto-com-instrucao', 'conflito'];
    if (REV.indexOf(V) !== -1) { S.rows = I.ROWS(instr); S.step = V === 'resumo' || V === 'levando-ao-editor' ? 4 : 3; S.ack = true; }
    if (V === 'revisao-tudo-decidido' || V === 'resumo' || V === 'levando-ao-editor') S.rows.forEach(function (r) { if (r.status === 'RECOGNIZED') S.dec[r.n] = 'ACCEPT'; else S.dec[r.n] = 'IGNORE'; });
    if (V === 'resumo' || V === 'levando-ao-editor') { S.dec[9] = 'ACCEPT'; S.rows[8].unit = 'kg'; S.rows[8].status = 'RECOGNIZED'; S.dec[11] = 'ACCEPT'; S.rows[10].status = 'RECOGNIZED'; }
    var NOPLAN = V === 'sem-plano-ia', OFFLINE = V === 'offline', CONFLICT = V === 'conflito', LEVAR = V === 'levando-ao-editor';
    var el;
    /* ?aluno= e ignorado de proposito: importar nao usa dados de alunos */
    var aluno = param('aluno');
    var STAT = { RECOGNIZED: ['success', 'check-circle', 'Reconhecido'], AMBIGUOUS: ['warning', 'alert', 'Confirmar'], UNRECOGNIZED: ['danger', 'ban', 'Não reconhecido'], IGNORED: ['neutral', 'ban', 'Ignorada'] };
    function stOf(r) { return S.dec[r.n] === 'IGNORE' ? 'IGNORED' : r.status; }
    function accepted() { return S.rows ? S.rows.filter(function (r) { return S.dec[r.n] === 'ACCEPT'; }) : []; }
    function counts() { var c = { RECOGNIZED: 0, AMBIGUOUS: 0, UNRECOGNIZED: 0 }; S.rows.forEach(function (r) { c[r.status]++; }); return c; }
    function whyOff() { return NOPLAN ? 'O seu plano não inclui sugestões com IA.' : S.used >= I.quota.limit ? 'Você chegou ao limite de sugestões do mês.' : OFFLINE ? 'Sem conexão. Ler arquivo fica desabilitado.' : !S.ack ? 'Marque a confirmação acima para continuar.' : ''; }
    var ERRTXT = { 'arquivo-grande': ['O arquivo passa de 2 MB.', 'Escolha um arquivo menor.'], 'arquivo-formato-invalido': ['Formato não aceito.', 'Use .csv, .xlsx ou .txt.'], 'arquivo-com-macros': ['Este arquivo tem macros ou links externos.', 'Salve uma cópia sem eles e tente de novo.'], 'arquivo-vazio': ['Não encontramos linhas de treino neste arquivo.', 'Confira o arquivo ou cole o texto.'], 'limite-linhas': ['Este arquivo tem mais de 200 linhas.', 'Divida em partes.'], 'erro-ler': ['Não foi possível ler o arquivo.', 'Nada foi importado.'] };
    function source() {
      var why = whyOff();
      var errBox = S.err ? '<div class="alert alert-danger" role="alert" tabindex="-1" id="g9-err">' + ico('alert') + '<div class="alert-body"><div class="alert-title">' + esc(ERRTXT[S.err][0]) + '</div><p>' + esc(ERRTXT[S.err][1]) + '</p>' + (S.err === 'erro-ler' ? '<p>' + btn('Tentar de novo', 'data-read') + btn('Escolher outro arquivo', 'data-other') + '</p>' : '') + '</div></div>' : '';
      var loading = S.busy ? '<div class="stack-sm" role="status"><progress class="g8-progress" aria-label="Lendo o arquivo"></progress><p>Lendo o arquivo. Pode levar até 30 segundos.</p>' + btn('Cancelar', 'data-cancelread') + '</div>' : '';
      var inputHtml = S.src === 'FILE' ? '<div class="field"><label for="g9-file">Arquivo (.csv, .xlsx ou .txt; até 2 MB e 200 linhas [MOCK])</label><input class="input" id="g9-file" type="file" accept=".csv,.xlsx,.txt"><span class="field-help">Você também pode arrastar o arquivo para esta área, mas o botão acima é a forma principal. Nome do arquivo: <span id="g9-fn">' + esc(S.fileName) + '</span></span></div>' :
        '<div class="field"><label for="g9-text">Colar texto (até 10 000 caracteres)</label><textarea class="textarea" id="g9-text" rows="6" maxlength="10000" aria-describedby="g9-text-c">' + esc(S.text) + '</textarea><span class="field-help" id="g9-text-c">' + S.text.length + ' de 10 000 caracteres. O texto não é guardado no navegador.</span></div>';
      return '<section class="card" aria-labelledby="g9-h1"><div class="card-body stack"><h2 class="h3" id="g9-h1">1. Origem</h2>' +
        '<fieldset class="stack-sm g7-fs"><legend class="h4">De onde vem</legend><label class="check g7-opt"><input type="radio" name="g9-src" value="FILE"' + (S.src === 'FILE' ? ' checked' : '') + '><span class="check-text">Enviar arquivo</span></label><label class="check g7-opt"><input type="radio" name="g9-src" value="TEXT"' + (S.src === 'TEXT' ? ' checked' : '') + '><span class="check-text">Colar texto</span></label></fieldset>' + inputHtml +
        '<p>Use só para a estrutura do treino: exercícios, séries, repetições, cargas e observações. [LEGAL] [MOCK] texto provisório.</p><p class="g5-hint">O arquivo não é guardado depois da leitura nesta versão. Retenção real a confirmar. [LEGAL]</p>' +
        '<label class="check g7-opt"><input type="checkbox" id="g9-ack"' + (S.ack ? ' checked' : '') + '><span class="check-text">Confirmo que este arquivo não contém dados de saúde de pessoas identificáveis.</span></label>' + errBox + loading +
        '<div class="row">' + btn('Ler arquivo', 'data-read' + (why || S.busy ? ' disabled aria-describedby="g9-why"' : ''), 'btn-primary') + '</div>' + (why ? '<p class="g5-hint" id="g9-why">' + esc(why) + '</p>' : '') + '</div></section>';
    }
    function rowHtml(r) {
      var s = stOf(r), dd = S.dec[r.n], b = STAT[s], needUnit = r.load && !r.unit, name = 'linha ' + r.n;
      var cols = '<td data-label="Linha original"><span class="g9-orig">' + esc(r.orig) + '</span>' + (instr && r.n === 12 ? '<br>' + badge('neutral', 'info', 'Texto do arquivo, sem efeito') : '') + '</td><td data-label="Sessão">' + esc(r.day) + '</td><td data-label="Exercício">' + (r.ex ? esc(r.ex) : '<span class="muted">Não reconhecido</span>') + '</td><td data-label="Séries">' + esc(r.sets) + '</td><td data-label="Repetições">' + esc(r.reps) + '</td><td data-label="Carga">' + (r.load ? esc(r.load) + (r.unit ? ' ' + esc(r.unit) : '') : '') + (needUnit ? '<br><span class="field-error">Informe a unidade (kg)</span>' : '') + '</td><td class="g9-obs" data-label="Observação">' + esc(r.note) + '</td>';
      var st = '<td data-label="Situação">' + badge(b[0], b[1], b[2]) + (dd === 'ACCEPT' ? ' ' + badge('success', 'check', 'Aceita') : '') + (r.warning && s !== 'IGNORED' && !(dd === 'ACCEPT') ? '<br><span class="muted">' + esc(r.warning) + '</span>' : '') + '</td>';
      var off = OFFLINE || CONFLICT || LEVAR ? ' disabled' : '';
      var acts = '<td data-label="Ações"><div class="row g9-ra">' + btn('Aceitar', 'data-racc="' + r.n + '" aria-label="Aceitar ' + name + '"' + off) + btn('Editar', 'data-redit="' + r.n + '" aria-label="Editar ' + name + '"' + off) + btn('Ignorar', 'data-rign="' + r.n + '" aria-label="Ignorar ' + name + '"' + off) + '</div></td>';
      return '<tr class="' + (s === 'IGNORED' ? 'is-ignored' : '') + '"><th scope="row" class="cell-main">' + r.n + '</th>' + cols + st + acts + '</tr>';
    }
    function review() {
      var c = counts(), rec = S.rows.filter(function (r) { return r.status === 'RECOGNIZED' && !S.dec[r.n]; }).length, acc = accepted().length;
      var undec = S.rows.filter(function (r) { return !S.dec[r.n]; }).length;
      var table = '<div class="table-wrap" tabindex="0" role="region" aria-label="Linhas importadas para revisão"><table class="table g9-table"><caption class="sr-only">Revisão linha a linha do arquivo importado</caption><thead><tr><th scope="col">Nº</th><th scope="col">Linha original</th><th scope="col">Sessão</th><th scope="col">Exercício</th><th scope="col">Séries</th><th scope="col">Repetições</th><th scope="col">Carga</th><th scope="col" class="g9-obs">Observação</th><th scope="col">Situação</th><th scope="col">Ações</th></tr></thead><tbody>' + S.rows.map(rowHtml).join('') + '</tbody></table></div>';
      var sum = '<aside class="card g9-sum" aria-labelledby="g9-hs"><div class="card-body stack"><h2 class="h3" id="g9-hs">Resumo</h2><p aria-live="polite" role="status" id="g9-cnt">' + S.rows.length + ' linhas: ' + c.RECOGNIZED + ' reconhecidas, ' + c.AMBIGUOUS + ' para confirmar, ' + c.UNRECOGNIZED + ' não reconhecida. ' + acc + ' aceitas, ' + undec + ' sem decisão.</p>' +
        btn('Aceitar reconhecidas (' + rec + ')', 'data-accrec' + (rec && !OFFLINE && !CONFLICT && !LEVAR ? '' : ' disabled')) + '<p class="g5-hint">Ambíguas e não reconhecidas exigem decisão linha a linha. Elas não entram por padrão.</p>' + btn('Levar ao editor', 'data-take' + (acc && !OFFLINE && !CONFLICT && !LEVAR ? '' : ' disabled aria-describedby="g9-why2"'), 'btn-primary') + btn('Cancelar', 'data-cancel') +
        (!acc ? '<p class="g5-hint" id="g9-why2">Aceite ao menos uma linha para levar ao editor.</p>' : (OFFLINE ? '<p class="g5-hint" id="g9-why2">Sem conexão: levar ao editor fica desabilitado.</p>' : '')) + (LEVAR ? '<p role="status" aria-busy="true">Levando ao editor…</p>' : '') + '</div></aside>';
      return '<section aria-labelledby="g9-h3"><h2 class="h3" id="g9-h3" tabindex="-1">3. Revisão linha a linha</h2>' + (CONFLICT ? alertBox('warning', 'O modelo mudou desde que você abriu o editor.', 'Recarregue antes de levar os itens. ' + btn('Recarregar', 'data-reload')) : '') + '<div class="g9-layout"><div>' + table + '</div>' + sum + '</div></section>';
    }
    function draw() {
      var banners = (OFFLINE ? G7.offlineBox() : '') + (NOPLAN ? noPlanBox() : '') + (S.used >= I.quota.limit && !NOPLAN ? limitBox() : '') + (aluno ? '<p class="g5-hint" role="status">Importar não usa dados de alunos.</p>' : '');
      var body = S.rows ? review() : source();
      if (!S.rows && !S.busy && !S.err && V === 'padrao') body = '<div class="empty-state"><div class="empty-state-icon">' + ico('file-text') + '</div><h2 class="h3">Nenhum arquivo ou texto ainda.</h2><p>Envie um arquivo ou cole o texto do treino para começar.</p></div>' + body;
      el.innerHTML = '<div class="stack">' + faixa().replace('A IA só sugere. Você decide e salva.', 'A IA só sugere. Nada é salvo até você levar ao editor e salvar.') + (NOPLAN ? '' : quotaBox(S.used)) + banners + G7.liveBox() + body + '</div>';
      if (S.err) { var eb = el.querySelector('#g9-err'); if (eb && !el.__focused) { eb.focus(); el.__focused = true; } }
    }
    function readIt() {
      if (S.busy || whyOff()) return;
      var f = el.querySelector('#g9-file');
      if (S.src === 'FILE' && f && f.files && f.files[0]) {
        var file = f.files[0], nm = file.name.toLowerCase(); S.fileName = file.name;
        if (!/\.(csv|xlsx|txt)$/.test(nm)) { S.err = /\.(xlsm|xlsb)$/.test(nm) ? 'arquivo-com-macros' : 'arquivo-formato-invalido'; draw(); return; }
        if (file.size > 2 * 1024 * 1024) { S.err = 'arquivo-grande'; draw(); return; }
        if (file.size === 0) { S.err = 'arquivo-vazio'; draw(); return; }
      }
      if (S.src === 'TEXT' && !S.text.trim()) { S.err = 'arquivo-vazio'; draw(); return; }
      S.err = null; S.busy = true; draw(); live(el, 'Lendo o arquivo.');
      S.timer = setTimeout(function () { S.busy = false; S.rows = I.ROWS(false); S.step = 3; S.used += 1; draw(); live(el, '12 linhas lidas. Revise cada uma.'); var h = el.querySelector('#g9-h3'); if (h) h.focus(); }, 800);
    }
    function editModal(r, opener) {
      var o = I.CATALOG.map(function (n) { return '<option' + (n === r.ex ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('');
      G7.modal({ title: 'Editar linha ' + r.n, opener: opener, okLabel: 'Salvar e aceitar', cancelLabel: 'Cancelar',
        body: '<div class="field"><label for="ed-ex">Exercício do catálogo</label><div class="select-wrap"><select class="select" id="ed-ex"><option value="">Não reconhecido</option>' + o + '</select></div></div><div class="g8-grid"><div class="field"><label for="ed-sets">Séries</label><input class="input" id="ed-sets" inputmode="numeric" value="' + esc(r.sets) + '"></div><div class="field"><label for="ed-reps">Repetições</label><input class="input" id="ed-reps" value="' + esc(r.reps) + '"></div><div class="field"><label for="ed-load">Carga</label><input class="input" id="ed-load" value="' + esc(r.load) + '"></div><div class="field"><label for="ed-unit">Unidade</label><div class="select-wrap"><select class="select" id="ed-unit"><option value="">Sem unidade</option><option value="kg"' + (r.unit === 'kg' ? ' selected' : '') + '>kg</option><option value="lb"' + (r.unit === 'lb' ? ' selected' : '') + '>lb</option></select></div></div></div><p class="field-error" id="ed-err" role="alert"></p>',
        onOk: function (wrap) {
          var g = function (id) { return wrap.querySelector('#' + id).value; }, er = wrap.querySelector('#ed-err');
          if (!g('ed-ex')) { er.textContent = 'Escolha um exercício do catálogo.'; return false; }
          if (g('ed-load') && !g('ed-unit')) { er.textContent = 'Informe a unidade (kg).'; return false; }
          r.ex = g('ed-ex'); r.sets = g('ed-sets'); r.reps = g('ed-reps'); r.load = g('ed-load'); r.unit = g('ed-unit'); r.status = 'RECOGNIZED'; r.warning = ''; S.dec[r.n] = 'ACCEPT';
          setTimeout(function () { draw(); live(el, 'Linha ' + r.n + ' aceita.'); var b = el.querySelector('[data-redit="' + r.n + '"]'); if (b) b.focus(); }, 0); return true;
        } });
    }
    function bind() {
      el.addEventListener('click', function (e) {
        var t = e.target, b;
        if (t.closest('[data-read]') && !t.closest('[disabled]')) return readIt();
        if (t.closest('[data-other]')) { S.err = null; draw(); var f = el.querySelector('#g9-file'); if (f) f.focus(); return; }
        if (t.closest('[data-cancelread]')) { clearTimeout(S.timer); S.busy = false; draw(); live(el, 'Leitura cancelada.'); return; }
        if (t.closest('[data-cancel]')) { var go = url('../treinos/biblioteca.html'); if (S.rows && accepted().length) { window.AuraUI.confirm({ title: 'Cancelar a importação?', text: 'As decisões desta revisão serão descartadas. Nada foi importado.', confirmLabel: 'Cancelar importação', cancelLabel: 'Continuar revisando' }).then(function (ok) { if (ok) location.href = go; }); } else location.href = go; return; }
        if (t.closest('[data-reload]')) { location.reload(); return; }
        if ((b = t.closest('[data-racc]'))) { var r = S.rows[+b.dataset.racc - 1]; if (r.status !== 'RECOGNIZED' || (r.load && !r.unit)) return editModal(r, b); S.dec[r.n] = 'ACCEPT'; draw(); live(el, 'Linha ' + r.n + ' aceita.'); var nb = el.querySelector('[data-racc="' + r.n + '"]'); if (nb) nb.focus(); return; }
        if ((b = t.closest('[data-redit]'))) return editModal(S.rows[+b.dataset.redit - 1], b);
        if ((b = t.closest('[data-rign]'))) { var n = +b.dataset.rign; S.dec[n] = 'IGNORE'; draw(); live(el, 'Linha ' + n + ' ignorada.'); var nb2 = el.querySelector('[data-rign="' + n + '"]'); if (nb2) nb2.focus(); return; }
        if ((b = t.closest('[data-accrec]')) && !b.disabled) {
          var n2 = S.rows.filter(function (r) { return r.status === 'RECOGNIZED' && !S.dec[r.n] && !(r.load && !r.unit); }).length;
          G7.modal({ title: 'Aceitar ' + plural(n2, 'linha reconhecida', 'linhas reconhecidas') + '?', opener: b, okLabel: 'Aceitar reconhecidas', cancelLabel: 'Cancelar', body: '<p>Você ainda revisa tudo no editor.</p>', onOk: function () { S.rows.forEach(function (r) { if (r.status === 'RECOGNIZED' && !S.dec[r.n] && !(r.load && !r.unit)) S.dec[r.n] = 'ACCEPT'; }); setTimeout(function () { draw(); live(el, plural(n2, 'linha aceita', 'linhas aceitas') + '.'); var h = el.querySelector('#g9-hs'); if (h) h.focus(); }, 0); return true; } }); return;
        }
        if ((b = t.closest('[data-take]')) && !b.disabled) {
          var k = accepted().length;
          G7.modal({ title: 'Levar ' + plural(k, 'item', 'itens') + ' ao editor de modelo?', opener: b, okLabel: 'Levar ao editor', cancelLabel: 'Cancelar', body: '<ul class="g4-list-plain"><li>Nada é salvo ainda.</li><li>Itens ignorados ou não decididos ficam de fora.</li><li>Você poderá editar tudo.</li></ul>', onOk: function () { window.AuraUI.toast('Itens levados ao editor.', { tone: 'success' }); location.href = url('../treinos/modelo-editor.html', 'variant=novo&ia=imp&n=' + k); return true; } });
        }
      });
      el.addEventListener('change', function (e) {
        var t = e.target;
        if (t.name === 'g9-src') { S.src = t.value; S.err = null; draw(); var r = el.querySelector('input[name="g9-src"]:checked'); if (r) r.focus(); return; }
        if (t.id === 'g9-ack') { S.ack = t.checked; draw(); el.querySelector('#g9-ack').focus(); return; }
        if (t.id === 'g9-file' && t.files && t.files[0]) { S.fileName = t.files[0].name; var fn = el.querySelector('#g9-fn'); if (fn) fn.textContent = S.fileName; }
      });
      el.addEventListener('input', function (e) { if (e.target.id === 'g9-text') { S.text = e.target.value; var c = el.querySelector('#g9-text-c'); if (c) c.textContent = S.text.length + ' de 10 000 caracteres. O texto não é guardado no navegador.'; } });
      window.addEventListener('beforeunload', function (e) { if (S.rows && accepted().length && !LEVAR) { e.preventDefault(); e.returnValue = ''; } });
    }
    G6.boot(V === 'sem-permissao' ? 'sem-permissao' : V === 'carregando' ? 'carregando' : V === 'erro' ? 'erro' : '', { rows: 5, skel: 'list', errText: 'Não foi possível carregar a importação.', render: function (e) {
      el = e; document.getElementById('bc').innerHTML = crumbs([['Prescrição com IA', url('painel-sugestoes.html')], ['Importar planilha ou texto']]);
      draw(); bind();
    } });
  }

  /* ======================= TRN-42 Dados usados pela IA e consentimento ======================= */
  var PRE42 = { 'ia-liberada-saude-liberada': 's03', 'ia-liberada-sem-saude': 's04', 'ia-nao-liberada': 's01', 'pedido-modal': 's01', 'pedido-enviado': 's01', 'pedido-ja-enviado': 's01', 'pedido-limite': 's01', 'enviando-pedido': 's01', 'erro-pedido': 's01', 'ia-revogada': 's07', 'nao-confirmado': 's03', 'vinculo-pausado': 's05', 'vinculo-encerrando': 's23', 'vinculo-encerrado': 's21', 'menor-em-espera': 's20' };
  function dados() {
    var sid = param('aluno') && D.find(param('aluno')) ? param('aluno') : (PRE42[V] || 's03');
    var MGR = V === 'gestor-leitura', NOPLAN = V === 'sem-plano-ia', LIM = V === 'limite-cota', OFFLINE = V === 'offline', CONFLICT = V === 'conflito';
    var S = { sid: sid, sent: V === 'pedido-enviado', waiting: V === 'pedido-ja-enviado', limit: V === 'pedido-limite', err: V === 'erro-pedido' ? 'x' : null, busy: V === 'enviando-pedido' };
    var el;
    function cur() { return situ(S.sid, V === 'nao-confirmado'); }
    function usageTable(s) {
      var rows = V === 'registro-vazio' ? [] : I.USAGE.slice(0, V === 'registro-com-itens' || V === 'padrao' || MGR || V.indexOf('ia-liberada') === 0 || V === 'nao-confirmado' ? 6 : 4);
      if (!rows.length) return '<p>A IA ainda não leu dados deste aluno.</p>';
      return '<div class="table-wrap" tabindex="0" role="region" aria-label="Registro de uso da IA"><table class="table"><caption class="sr-only">Registro de uso da IA: quando, quem pediu e quais categorias foram lidas, sem conteúdo</caption><thead><tr><th scope="col">Quando</th><th scope="col">Quem pediu</th><th scope="col">Categorias lidas</th><th scope="col">Resultado</th></tr></thead><tbody>' + rows.map(function (u) {
        return '<tr><th scope="row" class="cell-main">' + timeEl(u.at) + '</th><td data-label="Quem pediu">' + esc(u.by) + '</td><td data-label="Categorias lidas">' + esc(u.cats.join(', ')) + '</td><td data-label="Resultado">' + badge(u.result === 'Gerado' ? 'success' : u.result === 'Erro' ? 'danger' : 'neutral', u.result === 'Gerado' ? 'check-circle' : u.result === 'Erro' ? 'alert' : 'ban', u.result) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    }
    function consentCard(s) {
      var when = I.iaChanged[s.st.id];
      var txt = { ok: 'O aluno liberou o uso de IA. A IA lê só o que ele liberou e o que você marcar a cada sugestão.', 'ia-nao': 'O aluno ainda não liberou o uso de IA. A IA não lê nada dele.', 'ia-revogado': 'O aluno revogou o uso de IA. A IA parou de ler os dados dele.', 'nao-confirmado': 'Não conseguimos confirmar a autorização agora. Tratado como não liberado.' }[s.key] || 'A IA não lê dados deste aluno neste estado do vínculo.';
      var banner = s.key === 'ia-revogado' ? alertBox('warning', 'A IA parou de ler os dados deste aluno.', 'Registro e sugestões anteriores ficam ocultos. [LEGAL]') : '';
      return banner + '<section class="card" aria-labelledby="g10-hc"><div class="card-body stack"><h2 class="h3" id="g10-hc">Consentimento de Uso de IA</h2><p>' + stateBadge(s) + (when ? ' <span class="muted">desde <time datetime="' + when + '">' + fmt(when) + '</time></span>' : '') + '</p><p>' + esc(txt) + '</p><p class="muted">Quem decide: o aluno.</p></div></section>';
    }
    function actions(s) {
      var h = '<div class="row">', can = !MGR && s.st.status === 'ACTIVE' && s.key !== 'menor' && (s.key === 'ia-nao' || s.key === 'ia-revogado');
      if (MGR) return '<p class="g5-hint">Só o responsável pede liberação ao aluno.</p>';
      if (can) {
        var off = OFFLINE || CONFLICT || S.busy || S.sent || S.waiting || S.limit;
        var why = OFFLINE ? 'Sem conexão: o pedido fica desabilitado.' : S.limit ? 'Você já pediu este mês. Você poderá pedir de novo em 16/11.' : S.waiting ? 'Pedido enviado em 14/10. Aguardando o aluno.' : S.sent ? 'Pedido enviado. Aguardando o aluno.' : '';
        h += btn('Pedir liberação', 'data-ask' + (s.key === 'ia-revogado' ? ' data-again' : '') + (off ? ' disabled aria-describedby="g10-why"' : ''), s.key === 'ia-nao' ? 'btn-primary' : 'btn-secondary');
        h += '<a class="btn btn-secondary" href="' + esc(url('painel-sugestoes.html')) + '">Usar IA sem dados do aluno</a></div>';
        return h + (why ? '<p class="g5-hint" id="g10-why" role="status">' + esc(why) + '</p>' : '');
      }
      return '';
    }
    function draw() {
      var s = cur(), blocked = s.key !== 'ok', info = (NOPLAN ? noPlanBox() : '') + (LIM ? alertBox('info', 'Você chegou ao limite de sugestões do mês.', 'Esta tela continua disponível. Só "Gerar" some. A cota volta em ' + I.quota.resetsAt + ' [MOCK].') : '');
      var head = (OFFLINE ? G7.offlineBox() : '') + (CONFLICT ? alertBox('warning', 'O estado do consentimento mudou.', 'Recarregue. O pedido não foi enviado. ' + btn('Recarregar', 'data-reload')) : '') + (S.err ? alertBox('danger', '', 'Não foi possível enviar o pedido. O aluno não foi avisado. ' + btn('Tentar de novo', 'data-ask')) : '') + (S.sent ? alertBox('success', 'Pedido enviado.', 'O aluno recebeu um aviso genérico. Você não vê dados até ele liberar.') : '') + (S.busy ? '<p role="status" aria-busy="true">Enviando pedido…</p>' : '');
      var blockedBanner = blocked && BLOCK[s.key] ? blockCard(s) : '';
      var matr = '<section class="card" aria-labelledby="g10-hm"><div class="card-body stack"><h2 class="h3" id="g10-hm">Categorias</h2><p class="muted">Bloqueado não mostra contagem nem prévia do dado. Fotos e vídeos nunca vão à IA nesta versão. Os interruptores de escolha ficam no painel de sugestões e começam desligados a cada geração.</p>' + matrix(s, { switches: false }) + '</div></section>';
      var reg = s.key === 'encerrado' ? '<p class="muted">Registro oculto. Só nome e período do vínculo: ' + fmt(s.st.startedAt) + ' a ' + fmt(s.st.endedAt) + '.</p>' : (s.key === 'ia-revogado' || s.key === 'ia-nao' || blocked && s.key !== 'ok') ? '<p class="muted">Registro oculto neste estado. O pedido e a resposta nunca são mostrados.</p>' : usageTable(s);
      var regSec = '<section class="card" aria-labelledby="g10-hr"><div class="card-body stack"><h2 class="h3" id="g10-hr">Registro de uso</h2>' + (MGR ? '<p class="muted">Visão do gestor: registro do tenant, sem conteúdo.</p>' : '') + reg + '<p class="g5-hint">Guarda data, quem pediu e categorias. Nunca o conteúdo. Retenção: [LEGAL] [MOCK].</p></div></section>';
      var students = I.students.length ? studentSelect('g10-aluno', S.sid, 'Aluno') : '';
      el.innerHTML = '<div class="stack">' + G7.liveBox() + '<p class="g8-faixa" role="note">' + ico('info') + '<span>Este aluno sabe que você, os outros responsáveis e o gestor da conta veem os dados que ele liberou. A IA só lê o que ele liberou para IA. [LEGAL] [MOCK] texto provisório.</span></p>' + info + head + (V === 'sem-alunos' ? '<div class="empty-state"><div class="empty-state-icon">' + ico('users') + '</div><h2 class="h3">Você ainda não tem alunos.</h2><p>Convide um aluno para ver aqui o que a IA pode ler.</p></div>' :
        students + (MGR ? alertBox('info', 'Leitura', 'Você lê a matriz e o registro, sem conteúdo. Só o responsável pede liberação ao aluno.') : '') + '<div class="g10-layout"><div class="stack">' + blockedBanner + (blocked && !BLOCK[s.key] ? '' : (BLOCK[s.key] ? '' : '')) + consentCard(s) + actions(s) + matr +
        '<section class="card" aria-labelledby="g10-hn"><div class="card-body stack"><h2 class="h3" id="g10-hn">Usar IA sem dados de aluno</h2><p>Isto não lê nada de ninguém.</p><p><a href="' + esc(url('painel-sugestoes.html')) + '">Abrir painel sem dados do aluno</a></p></div></section>' +
        '<p class="g5-hint">Consentimento e direitos do aluno: o aluno pode revogar a qualquer momento em ALU-06. A IA para de ler na hora. Isto não promete apagar o que já foi gerado. [LEGAL]</p></div><div class="stack">' + regSec + '</div></div>' +
        '<p><a class="btn btn-secondary" href="' + esc(url('../alunos/aluno-detalhe.html', 'id=' + s.st.id)) + '">Abrir aluno</a> <a class="btn btn-secondary" href="' + esc(url('painel-sugestoes.html', 'aluno=' + s.st.id)) + '">Voltar às sugestões</a></p>') + '</div>';
    }
    function startAsk(opener) {
      var s = cur();
      askModal(s, opener, function (r) { if (r === 'erro') S.err = 'x'; else { S.err = null; S.sent = true; } draw(); live(el, r === 'erro' ? 'Não foi possível enviar o pedido.' : 'Pedido enviado.'); var b = el.querySelector('[data-ask]'); if (b) b.focus(); }, s.key === 'ia-revogado');
    }
    G6.boot(V === 'sem-permissao' ? 'sem-permissao' : V === 'carregando' ? 'carregando' : V === 'erro' ? 'erro' : '', { rows: 5, skel: 'cards', errText: 'Não foi possível carregar os dados usados pela IA.', render: function (e) {
      el = e; document.getElementById('bc').innerHTML = crumbs([['Prescrição com IA', url('painel-sugestoes.html')], ['Dados usados pela IA']]);
      draw();
      el.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ask]'); if (b && !b.disabled) return startAsk(b);
        if (ev.target.closest('[data-reload]')) location.reload();
      });
      el.addEventListener('change', function (ev) { if (ev.target.id === 'g10-aluno') { S.sid = ev.target.value; S.sent = false; S.waiting = false; S.limit = false; S.err = null; draw(); el.querySelector('#g10-aluno').focus(); } });
      if (V === 'pedido-modal') startAsk(null);
    } });
  }

  window.G8 = { mount: mount, crumbs: crumbs, head: head, painel: painel, importar: importar, dados: dados, situ: situ };
})();
