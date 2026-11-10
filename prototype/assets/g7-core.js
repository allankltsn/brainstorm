/* g7-core.js - helpers do G7 (training: Acompanhamento, lote E) + TRN-30 Alertas e TRN-34 Notificacoes.
   Carregar depois de grupo-g4.js, grupo-g5.js, grupo-g6.js, data.js, data-g5.js e shell.js. Tudo [MOCK]. A IA nunca grava. Nada de saude vai para o navegador (sem storage). */
(function () {
  var G4 = window.G4, G5 = window.G5, G6 = window.G6, A = window.AURA, D = window.G5DATA, E = D.E;
  var esc = G4.esc, ico = G4.ico, badge = G5.badge, alertBox = G5.alertBox, selo = G5.selo;

  function mount(o) {
    G4.setDefaultRole('personal');
    var r = G4.routes(); r.alunos = G4.url('../alunos/meus-alunos.html'); r.exercicios = G4.url('../exercicios/catalogo.html'); r.treinos = G4.url('../treinos/biblioteca.html');
    r.alertas = G4.url('alertas.html'); r.execucoes = G4.url('execucoes.html'); r.questionarios = G4.url('questionarios.html'); r.mensagens = G4.url('mensagens.html');
    window.AuraShell.mount({ role: 'personal', active: o.active, title: o.title, routes: r });
    document.addEventListener('aura:shellready', function () { document.title = o.id + ' · ' + o.title + ' · aura-fit'; });
  }
  function url(p, extra) { return G4.url(p, extra); }
  function param(k) { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } }
  function home() { return url('../home/personal.html'); }
  function crumbs(items) { return G5.breadcrumb([['Início', home()]].concat(items)); }
  function stu(sid) { return D.find(sid); }
  function first(n) { return String(n).split(' ')[0]; }
  function when(iso, ago) { return '<time datetime="' + esc(iso) + '">' + esc(ago || A.fmtDateTime(iso)) + '</time><span class="g7-abs"> · ' + A.fmtDateTime(iso) + '</span>'; }

  /* variantes de portao (vale para as 5 telas): variante -> aluno de exemplo (+ projecao vencida) */
  var GV = { 'sem-consentimento': ['s04'], revogado: ['s06'], 'nao-confirmado': ['s01', true], 'vinculo-pausado': ['s05'], 'vinculo-encerrando': ['s23'], 'vinculo-encerrado': ['s21'], 'menor-em-espera': ['s20'] };
  function gv(V) {
    var k = String(V || '').replace(/^detalhe-oculto-/, '').replace(/^detalhe-/, '').replace(/^envio-aluno-fora-do-portao$/, 'sem-consentimento');
    var x = GV[k]; if (!x) return null;
    var st = stu(x[0]), opts = x[1] ? { stale: true } : {};
    return { key: k, sid: x[0], st: st, opts: opts, g: D.gate(st, opts) };
  }
  function gateCard(g) { return G5.privCard(g); }
  function noteHidden(text) { return '<p class="g7-hidden-note" role="status">' + ico('lock') + '<span>' + esc(text) + '</span></p>'; }
  function offlineBox() { return alertBox('info', 'Sem conexão', 'Mostrando a última carga, às 14:32. Ações que gravam dados ficam desativadas até a conexão voltar.'); }
  function plural(n, a, b) { return G6.plural(n, a, b); }
  function empty(icon, title, text, extra) { return '<div class="empty-state"><div class="empty-state-icon">' + ico(icon) + '</div><h2 class="h3">' + esc(title) + '</h2><p>' + esc(text) + '</p>' + (extra || '') + '</div>'; }
  function iaBlock(title, line) {
    return '<details class="g7-ia card"><summary>' + ico('sparkles') + '<span>' + esc(title) + '</span> ' + selo('I1') + '</summary><div class="g7-ia-body"><p>' + esc(line) + '</p><p class="muted">A IA não envia, grava nem altera dado. A resposta ao aluno é sempre sua.</p><p><a class="btn btn-secondary" href="' + esc(url('../ia/painel-sugestoes.html')) + '">Abrir Prescrição com IA</a></p></div></details>';
  }

  /* modal com dois botoes de mesmo peso. o: {title, body, okLabel, cancelLabel, opener, onOk(wrap)->false para manter aberto, busy} */
  function modal(o) {
    var id = 'g7m-' + Math.floor(Math.random() * 1e6), t = id + '-t', d = id + '-d';
    var wrap = document.createElement('div'); wrap.className = 'modal-backdrop'; wrap.hidden = true; wrap.dataset.autoremove = '1'; wrap.id = id;
    wrap.innerHTML = '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="' + t + '" aria-describedby="' + d + '"><div class="modal-header"><h2 class="modal-title" id="' + t + '">' + esc(o.title) + '</h2></div>' +
      '<div class="modal-body stack" id="' + d + '">' + o.body + '</div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-r="1">' + esc(o.okLabel) + '</button><button type="button" class="btn btn-secondary" data-r="0" autofocus>' + esc(o.cancelLabel || 'Cancelar') + '</button></div></div>';
    document.body.appendChild(wrap);
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-r]'); if (!b) return;
      var yes = b.dataset.r === '1';
      if (yes && o.onOk && o.onOk(wrap) === false) return;
      window.AuraUI.closeModal(wrap);
    });
    window.AuraUI.openModal(wrap, o.opener); return wrap;
  }
  function liveBox() { return '<div class="sr-only" role="status" aria-live="polite" data-g7-live></div>'; }
  function live(el, msg) { var l = el.querySelector('[data-g7-live]'); if (l) l.textContent = msg; }
  function tabs(label, list, cur, pre) {
    return '<div class="g5-tabs"><div class="tabs" role="tablist" aria-label="' + esc(label) + '">' + list.map(function (t) {
      return '<button type="button" class="tab" role="tab" id="' + pre + t[0] + '" aria-controls="' + pre + 'pn" aria-selected="' + (cur === t[0]) + '" tabindex="' + (cur === t[0] ? 0 : -1) + '">' + esc(t[1]) + (t[2] != null ? ' (' + t[2] + ')' : '') + '</button>';
    }).join('') + '</div></div>';
  }
  function tabKeys(root, onPick) {
    var tl = root.querySelector('[role="tablist"]'); if (!tl) return;
    tl.addEventListener('click', function (e) { var b = e.target.closest('[role="tab"]'); if (b) onPick(b.id.replace(/^[a-z0-9]+-/, ''), b); });
    tl.addEventListener('keydown', function (e) {
      var tabsEl = [].slice.call(tl.querySelectorAll('[role="tab"]')), i = tabsEl.indexOf(document.activeElement); if (i < 0) return;
      var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabsEl.length - 1 : -1;
      if (n < 0) return; e.preventDefault(); n = (n + tabsEl.length) % tabsEl.length; tabsEl[n].focus(); tabsEl[n].click();
    });
    G5.tabScroll(root);
  }

  /* ======================= TRN-30 Central de alertas ======================= */
  var KIND = { PAIN: ['Dor', 'alert', 'danger'], ABSENCE: ['Falta', 'calendar', 'warning'], CHECKIN_OVERDUE: ['Check-in atrasado', 'clock', 'info'] };
  var STATUS = { OPEN: ['Aberto', 'warning', 'alert'], ACKNOWLEDGED: ['Visto', 'info', 'eye'], RESOLVED: ['Resolvido', 'success', 'check-circle'] };
  var SEL = { 'detalhe-dor': 'a01', 'detalhe-falta': 'a05', 'detalhe-checkin': 'a08', 'detalhe-oculto-sem-consentimento': 'a15', 'detalhe-oculto-revogado': 'a04', 'detalhe-oculto-nao-confirmado': 'a01', 'detalhe-oculto-pausado': 'a06', 'detalhe-oculto-encerrando': 'a16', 'detalhe-menor-em-espera': 'a17', 'vinculo-encerrado': 'a14', resolvendo: 'a01', resolvido: 'a12', 'erro-resolver': 'a02', conflito: 'a02' };

  function alertas() {
    var V = G6.variant() || 'padrao', st = { tab: (V === 'so-resolvidos' || V === 'vinculo-encerrado' || V === 'resolvido') ? 'res' : 'ab', sel: SEL[V] || param('alerta') || null, checked: [], q: V === 'filtro-sem-resultado' ? 'zzz' : (param('aluno') ? (stu(param('aluno')) || { name: '' }).name : ''), tipo: '', estado: '', per: '' };
    var items = E.alerts.map(function (a) { return Object.assign({}, a); });
    var manager = V === 'fila-gestor', offline = V === 'offline', undo = null, msg = '';
    var staleFor = function (a) { return V === 'detalhe-oculto-nao-confirmado' && a.id === st.sel ? { stale: true } : {}; };
    if (V === 'sem-alertas') items = [];
    function sOf(a) { return stu(a.sid); }
    function gOf(a) { return D.gate(sOf(a), staleFor(a)); }
    function listed(a) {
      var s = sOf(a);
      if (V === 'sem-alertas') return false;
      if (st.tab === 'ab') { if (a.status === 'RESOLVED' || s.status === 'ENDED') return false; if (a.noOwner && !manager) return false; if (V === 'so-vistos' && a.status !== 'ACKNOWLEDGED') return false; }
      else if (a.status !== 'RESOLVED') return false;
      if (st.tipo && (a.kind !== st.tipo || !gOf(a).ok)) return false;
      if (st.estado && a.status !== st.estado) return false;
      if (st.q && !(s.name.toLowerCase().indexOf(st.q.toLowerCase()) !== -1)) return false;
      return true;
    }
    function count(tab) { return items.filter(function (a) { var s = sOf(a); return tab === 'ab' ? (a.status !== 'RESOLVED' && s.status !== 'ENDED' && (!a.noOwner || manager) && V !== 'sem-alertas') : a.status === 'RESOLVED'; }).length; }
    function kd(a, g) { return g.ok ? KIND[a.kind] : ['Alerta', 'alert', 'info']; }
    function order(l) { return l.slice().sort(function (x, y) { var rk = { PAIN: 0, ABSENCE: 1, CHECKIN_OVERDUE: 2 }; function r(a) { return gOf(a).ok ? rk[a.kind] : 1; } return (r(x) - r(y)) || (y.at < x.at ? -1 : 1); }); }
    function genericLine(a, g) {
      if (!g.ok) return 'Novo alerta';
      if (a.kind === 'PAIN') return 'Novo alerta de dor';
      var d = E.alertDetail(a.id, {});
      return a.kind === 'ABSENCE' ? 'Falta no dia previsto' : 'Questionário atrasado desde ' + A.fmtDate(d ? d.dueAt : a.at).slice(0, 5);
    }
    function row(a) {
      var s = sOf(a), g = gOf(a), k = kd(a, g), sx = STATUS[a.status], hold = g.reason === 'idade', nm = hold ? 'Aluno' : s.name;
      var lk = s.status === 'SUSPENDED' ? badge('warning', 'clock', 'Vínculo pausado') : s.status === 'ENDING' ? badge('warning', 'clock', 'Vínculo encerrando') : s.status === 'ENDED' ? badge('neutral', 'ban', 'Aluno com vínculo encerrado') : hold ? badge('warning', 'alert', 'Conta em espera') : '';
      var chk = a.status === 'OPEN' && a.mine && !hold && s.status === 'ACTIVE' && !offline ? '<label class="check g7-chk"><input type="checkbox" data-chk="' + a.id + '"' + (st.checked.indexOf(a.id) !== -1 ? ' checked' : '') + '><span class="sr-only">Selecionar alerta' + (g.ok ? ' de ' + k[0] : '') + ' de ' + esc(nm) + '</span></label>' : '';
      return '<article class="card g7-row' + (st.sel === a.id ? ' card-selected' : '') + '" data-id="' + a.id + '" aria-labelledby="h-' + a.id + '"><div class="card-body g7-rowbody">' + chk +
        '<div class="grow stack-sm"><h2 class="h4" id="h-' + a.id + '">' + ico(k[1]) + ' ' + k[0] + '</h2><p>' + esc(genericLine(a, g)) + '</p><p class="muted">' + (a.noOwner ? badge('neutral', 'user', 'Sem responsável') + ' ' : '') + esc(nm) + ' · ' + when(a.at, a.ago) + '</p>' +
        '<div class="row">' + badge(sx[1], sx[2], sx[0]) + lk + '</div></div><button type="button" class="btn btn-secondary" data-open="' + a.id + '">Abrir alerta<span class="sr-only">: ' + k[0] + ', ' + esc(nm) + '</span></button></div></article>';
    }
    function canAct(a) {
      var g = gOf(a), s = sOf(a);
      return !offline && a.status !== 'RESOLVED' && a.mine && (g.ok || ['revogado', 'sem-consentimento', 'nao-confirmado'].indexOf(g.reason) !== -1) && s.status === 'ACTIVE';
    }
    function detail(a) {
      var s = sOf(a), g = gOf(a), k = kd(a, g), sx = STATUS[a.status], d = E.alertDetail(a.id, staleFor(a)), hold = g.reason === 'idade', nm = hold ? 'Aluno' : s.name, h = '';
      h += '<button type="button" class="btn btn-text g7-back" data-back>' + ico('arrow-left') + 'Voltar para a lista</button><div class="stack"><h2 class="h3" id="g7-dh" tabindex="-1">' + (g.ok ? 'Alerta de ' + k[0] : 'Alerta') + '</h2><p class="muted">' + esc(nm) + ' · ' + when(a.at, a.ago) + ' · ' + badge(sx[1], sx[2], sx[0]) + '</p>';
      if (s.status === 'ENDED') return h + noteHidden('Aluno com vínculo encerrado. Só metadado: o detalhe fica oculto.') + gateCard(g) + '</div>';
      if (V === 'conflito') h += alertBox('warning', 'Este alerta já foi visto por Rafael Antunes.', 'Nada é sobrescrito. <button type="button" class="btn btn-secondary" data-reload>Recarregar</button>');
      if (V === 'erro-resolver' && msg === 'err') h += alertBox('danger', '', 'Não foi possível resolver. O alerta continua aberto. <button type="button" class="btn btn-secondary" data-resolve>Tentar de novo</button>');
      if (msg === 'ok') h += alertBox('success', '', 'Alerta resolvido. Ele saiu da fila de abertos e está em Resolvidos.');
      if (undo) h += alertBox('info', '', 'Alerta marcado como visto. <button type="button" class="btn btn-secondary" data-undo>Desfazer</button>');
      if (d) {
        h += '<dl class="g7-dl">';
        if (a.kind === 'PAIN') h += '<div><dt>Região</dt><dd>' + esc(d.region) + '</dd></div><div><dt>Intensidade</dt><dd>' + d.intensity + ' de 10</dd></div><div><dt>Nota do aluno</dt><dd>' + esc(d.note || 'Sem nota.') + '</dd></div><div><dt>Sessão e série</dt><dd>' + esc(d.session) + ', ' + esc(d.set) + '</dd></div><div><dt>Registro</dt><dd>Registrado pelo aluno em ' + A.fmtDateTime(d.when) + '</dd></div>';
        else if (a.kind === 'ABSENCE') h += '<div><dt>Dia previsto</dt><dd>' + esc(d.expectedDay) + '</dd></div><div><dt>Sessão prevista</dt><dd>' + esc(d.session) + '</dd></div><div><dt>Registro</dt><dd>Registro do sistema</dd></div>';
        else h += '<div><dt>Questionário</dt><dd>' + esc(d.questionnaire) + '</dd></div><div><dt>Enviado em</dt><dd>' + A.fmtDate(d.sentAt) + '</dd></div><div><dt>Prazo</dt><dd>' + A.fmtDate(d.dueAt) + '</dd></div><div><dt>Registro</dt><dd>Registro do sistema</dd></div>';
        h += '</dl>';
        if (a.kind === 'PAIN') h += '<p class="g7-legal">' + ico('info') + 'Se houver sinal de gravidade, oriente o aluno a procurar atendimento de saúde. <span class="muted">[LEGAL] [MOCK] texto provisório.</span></p>';
        h += '<div class="g7-links"><span class="h4">Ações sugeridas (só links, nada é feito sozinho)</span><div class="row"><a class="btn btn-secondary" href="' + esc(url('mensagens.html', 'aluno=' + s.id)) + '">Falar com o aluno</a>';
        if (a.kind === 'PAIN' && E.sessions({}).length) { var ses = { a01: 'x01', a02: 'x04', a03: 'x06' }[a.id]; if (ses) h += '<a class="btn btn-secondary" href="' + esc(url('execucao-detalhe.html', 'sessao=' + ses)) + '">Ver execução</a>'; }
        if (a.kind === 'CHECKIN_OVERDUE') h += '<a class="btn btn-secondary" href="' + esc(url('questionario-enviar.html', 'aluno=' + s.id)) + '">Enviar questionário</a>';
        h += '<a class="btn btn-secondary" href="' + esc(url('../alunos/aluno-detalhe.html', 'id=' + s.id)) + '">Abrir aluno</a></div></div>';
      } else if (!hold) h += gateCard(g) + (canAct(a) ? '<p class="g5-hint">Você pode registrar que tratou o alerta mesmo sem ver o detalhe.</p>' : '<p class="g5-hint">Leitura apenas: nenhuma ação é possível neste estado do vínculo.</p>');
      else h += gateCard(g) + alertBox('warning', 'Bloqueado', 'Conta em espera: o alerta só é lido, sem detalhe e sem ações.');
      if (!manager || a.mine) {
        if (canAct(a)) h += '<div class="row g7-acts">' + (a.status === 'OPEN' ? '<button type="button" class="btn btn-secondary" data-seen>Marcar como visto</button>' : '') + '<button type="button" class="btn btn-primary" data-resolve' + (V === 'resolvendo' ? ' aria-busy="true" disabled' : '') + '>' + (V === 'resolvendo' ? 'Salvando…' : 'Resolver') + '</button></div>';
        else if (a.status === 'RESOLVED' && a.today && !offline) h += '<div class="row"><button type="button" class="btn btn-secondary" data-reopen>Reabrir</button><span class="g5-hint">Só no mesmo dia.</span></div>';
        else if (offline) h += '<p class="g5-hint" role="status">Sem conexão: as ações ficam desativadas.</p>';
      }
      if (manager && !a.mine) h += '<p class="g5-hint">Só o responsável pelo aluno trata este alerta.</p>';
      if (a.status === 'RESOLVED') h += '<p class="muted">Resolvido em ' + A.fmtDateTime(a.resolvedAt) + ' por ' + esc(a.resolvedBy) + '.</p>';
      h += iaBlock('Sugestões da IA', 'Quando existir, a IA só sugere. Você decide.');
      return h + '</div>';
    }
    function draw(el) {
      var shown = order(items.filter(listed)), a = st.sel && items.filter(function (x) { return x.id === st.sel; })[0], n = count('ab');
      var vis = shown.length;
      var filt = '<details class="g7-filters card" ' + (window.innerWidth >= 640 || st.q || st.tipo ? 'open' : '') + '><summary>Filtros</summary><div class="card-body g5-filters g7-fgrid">' +
        '<div class="field"><label for="f-q">Aluno</label><input class="input" id="f-q" type="search" autocomplete="off" value="' + esc(st.q) + '"></div>' +
        '<div class="field"><label for="f-t">Tipo</label><div class="select-wrap"><select class="select" id="f-t"><option value="">Todos</option><option value="PAIN"' + (st.tipo === 'PAIN' ? ' selected' : '') + '>Dor</option><option value="ABSENCE"' + (st.tipo === 'ABSENCE' ? ' selected' : '') + '>Falta</option><option value="CHECKIN_OVERDUE"' + (st.tipo === 'CHECKIN_OVERDUE' ? ' selected' : '') + '>Check-in atrasado</option></select></div></div>' +
        '<div class="field"><label for="f-e">Estado</label><div class="select-wrap"><select class="select" id="f-e"><option value="">Todos</option><option value="OPEN"' + (st.estado === 'OPEN' ? ' selected' : '') + '>Aberto</option><option value="ACKNOWLEDGED"' + (st.estado === 'ACKNOWLEDGED' ? ' selected' : '') + '>Visto</option></select></div></div>' +
        '<div class="field"><label for="f-p">Período</label><div class="select-wrap"><select class="select" id="f-p"><option>Últimos 30 dias</option><option>Últimos 7 dias</option></select></div></div></div></details>';
      var list;
      if (!vis) list = (V === 'sem-alertas' && st.tab === 'ab') ? empty('check-circle', 'Nenhum alerta aberto.', 'Quando algo precisar da sua atenção, aparece aqui.') : st.tab === 'res' && !st.q && !st.tipo ? empty('check-circle', 'Nenhum alerta resolvido ainda.', '') : '<div class="empty-state" role="status"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Nenhum alerta encontrado para esses filtros.</h2><button type="button" class="btn btn-secondary" data-clear>Limpar filtros</button></div>';
      else list = '<div class="stack">' + shown.map(row).join('') + '</div>';
      el.innerHTML = (offline ? offlineBox() : '') + (manager ? alertBox('info', 'Fila do gestor', 'Você lê todos os alertas da conta. Só o responsável trata os alertas do próprio aluno. Alertas sem responsável aparecem com selo de texto.') : '') + liveBox() +
        '<p class="g7-count" aria-live="polite" role="status"><strong>' + plural(n, 'alerta aberto', 'alertas abertos') + '</strong></p>' +
        '<p class="g5-hint">Ordem: alertas de Dor primeiro, depois os mais recentes. É só uma ordem de leitura, não uma avaliação clínica.</p>' +
        tabs('Alertas', [['ab', 'Abertos', count('ab')], ['res', 'Resolvidos', count('res')]], st.tab, 'al-') + filt +
        '<div class="g7-split' + (a ? ' has-detail' : '') + '"><div id="al-pn" role="tabpanel" aria-labelledby="al-' + st.tab + '" tabindex="0" class="stack g7-listcol"><div class="row-between"><button type="button" class="btn btn-secondary" data-batch' + (st.checked.length ? '' : ' disabled') + '>Marcar selecionados como vistos' + (st.checked.length ? ' (' + st.checked.length + ')' : '') + '</button><span class="g5-hint">Resolver é sempre um alerta por vez.</span></div>' + list + '</div>' +
        '<section class="g7-detail card" id="g7-detail" ' + (a ? 'aria-labelledby="g7-dh"' : 'aria-label="Detalhe do alerta" hidden') + '><div class="card-body">' + (a ? detail(a) : '') + '</div></section></div>';
      [].forEach.call(document.querySelectorAll('.nav-link[href*="alertas.html"] .badge-warning'), function (nb) { nb.innerHTML = n + '<span class="sr-only"> abertos</span>'; });
      tabKeys(el, function (k) { st.tab = k === 'res' ? 'res' : 'ab'; st.sel = null; st.checked = []; draw(el); var t = el.querySelector('#al-' + st.tab); if (t) t.focus(); });
    }
    function openDetail(el, id, opener) { st.sel = id; undo = null; msg = ''; draw(el); var h = el.querySelector('#g7-dh'); if (h) h.focus(); el.__opener = opener; }
    function closeDetail(el) { var id = st.sel; st.sel = null; draw(el); var b = el.querySelector('[data-open="' + id + '"]'); if (b) b.focus(); }
    function resolveFlow(el, a, opener) {
      var g = gOf(a), okh = g.ok;
      modal({ title: 'Resolver este alerta?', opener: opener, okLabel: 'Resolver', cancelLabel: 'Cancelar',
        body: '<ul class="g4-list-plain"><li>O alerta sai da fila de abertos e fica em Resolvidos.</li><li>O aluno não é avisado.</li><li>Você pode reabrir hoje.</li></ul>' +
          '<div class="field"><label for="nota">Nota de resolução (opcional)</label><textarea class="textarea" id="nota" maxlength="300" rows="3"' + (okh ? '' : ' disabled') + ' aria-describedby="nota-h"></textarea><span class="field-help" id="nota-h">Até 300 caracteres. Não escreva informação de saúde aqui' + (okh ? ', a menos que o aluno já tenha liberado.' : '. O campo fica desativado sem a liberação do aluno.') + ' A nota não é guardada no navegador.</span></div>',
        onOk: function () {
          if (V === 'erro-resolver') { msg = 'err'; setTimeout(function () { draw(el); var h0 = el.querySelector('#g7-dh'); if (h0) h0.focus(); }, 0); return true; }
          a.status = 'RESOLVED'; a.today = true; a.resolvedAt = E.today + 'T10:00'; a.resolvedBy = 'Você'; msg = 'ok'; st.tab = 'res'; setTimeout(function () { draw(el); var h1 = el.querySelector('#g7-dh'); if (h1) h1.focus(); window.AuraUI.toast('Alerta resolvido.', { tone: 'success' }); live(el, 'Alerta resolvido.'); }, 0); return true;
        } });
    }
    G6.boot(V, { rows: 5, skel: 'cards', errText: 'Não foi possível carregar os alertas.', render: function (el) {
      draw(el);
      el.addEventListener('click', function (e) {
        var t = e.target, a = st.sel && items.filter(function (x) { return x.id === st.sel; })[0], b;
        if ((b = t.closest('[data-open]'))) return openDetail(el, b.dataset.open, b);
        if (t.closest('[data-back]')) return closeDetail(el);
        if (t.closest('[data-clear]')) { st.q = ''; st.tipo = ''; st.estado = ''; return draw(el); }
        if (t.closest('[data-reload]')) { location.reload(); return; }
        if (!a) return;
        if (V === 'conflito' && (t.closest('[data-seen]') || t.closest('[data-resolve]'))) return;
        if (t.closest('[data-seen]')) { a.status = 'ACKNOWLEDGED'; undo = a.id; draw(el); live(el, 'Alerta marcado como visto.'); return; }
        if (t.closest('[data-undo]')) { a.status = 'OPEN'; undo = null; draw(el); return; }
        if (t.closest('[data-resolve]')) return resolveFlow(el, a, t.closest('[data-resolve]'));
        if (t.closest('[data-reopen]')) { a.status = 'OPEN'; a.today = false; st.tab = 'ab'; msg = ''; draw(el); live(el, 'Alerta reaberto.'); }
      });
      el.addEventListener('change', function (e) {
        var c = e.target.closest && e.target.closest('[data-chk]');
        if (c) { var i = st.checked.indexOf(c.dataset.chk); if (c.checked && i === -1) st.checked.push(c.dataset.chk); else if (i !== -1) st.checked.splice(i, 1); var bt = el.querySelector('[data-batch]'); bt.disabled = !st.checked.length; bt.textContent = 'Marcar selecionados como vistos' + (st.checked.length ? ' (' + st.checked.length + ')' : ''); live(el, plural(st.checked.length, 'alerta selecionado', 'alertas selecionados')); return; }
        if (e.target.id === 'f-t') { st.tipo = e.target.value; draw(el); el.querySelector('#f-t').focus(); }
        if (e.target.id === 'f-e') { st.estado = e.target.value; draw(el); el.querySelector('#f-e').focus(); }
      });
      el.addEventListener('input', function (e) { if (e.target.id === 'f-q') { st.q = e.target.value; var pos = e.target.selectionStart; draw(el); var q = el.querySelector('#f-q'); q.focus(); q.setSelectionRange(pos, pos); } });
      el.addEventListener('click', function (e) { var b = e.target.closest('[data-batch]'); if (!b || b.disabled) return; var n = st.checked.length; items.forEach(function (x) { if (st.checked.indexOf(x.id) !== -1) x.status = 'ACKNOWLEDGED'; }); st.checked = []; draw(el); live(el, plural(n, 'alerta marcado como visto', 'alertas marcados como vistos') + '.'); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.sel && !document.body.classList.contains('has-modal')) closeDetail(el); }, true);
    } });
  }

  /* ======================= TRN-34 Notificacoes ======================= */
  var NK = { ALERT: ['Alertas', 'alert'], MESSAGE: ['Mensagens', 'mail'], QUESTIONNAIRE: ['Questionários', 'clipboard'], LINK: ['Vínculos e convites', 'users'], SYSTEM: ['Sistema', 'info'] };
  function notificacoes() {
    var V = G6.variant() || 'pagina', panel = V === 'painel';
    var items = E.notifs.map(function (n) { return Object.assign({}, n); });
    if (V === 'tudo-lido') items.forEach(function (n) { n.read = true; });
    if (V === 'vazio') items = [];
    var st = { tab: (V === 'so-nao-lidas') ? 'nl' : 'todas', kind: V === 'filtro-sem-resultado' ? 'SYSTEM_X' : '', more: V === 'limite-itens' };
    var prefs = { inApp: true, email: false, push: false, muteMsg: false, muteQ: false }, offline = V === 'offline', pmsg = '';
    function unread() { return items.filter(function (n) { return !n.read; }).length; }
    function gateNote(n) {
      var g = gv(V), s = n.sid ? stu(n.sid) : null, gg = s ? D.gate(s, {}) : { ok: true };
      if (V === 'alerta-oculto-por-privacidade' && n.id === 'n05') return gateCard(D.gate(stu('s06'), {}));
      if (g && n.id === { 'vinculo-pausado': 'n08', 'vinculo-encerrado': 'n08', 'menor-em-espera': 'n07' }[V]) return gateCard(g.g);
      if (!gg.ok && n.kind !== 'LINK' && V === 'pagina' && n.id === 'n11') return '';
      return '';
    }
    function item(n) {
      var k = NK[n.kind], s = n.sid ? stu(n.sid) : null, g = s ? D.gate(s, {}) : { ok: true }, hold = g.reason === 'idade';
      var nm = s && !hold && n.kind !== 'SYSTEM' ? ' de ' + first(s.name) : '';
      var text = n.kind === 'ALERT' && nm ? 'Novo alerta' + nm : n.text;
      var hold2 = V === 'menor-em-espera' && n.id === 'n07';
      return '<li class="g7-notif' + (n.read ? '' : ' is-unread') + '"><div class="g7-nico">' + ico(k[1]) + '</div><div class="grow"><p class="h4"><span class="g7-kind">' + k[0] + ': </span>' + esc(hold2 ? 'Convite aceito' : text) + '</p><p class="muted">' + when(n.at, n.ago) + (n.read ? '' : ' · ' + badge('info', 'bell', 'Não lida')) + '</p></div>' +
        (n.href ? '<a class="btn btn-secondary" href="' + esc(n.href.indexOf('http') === 0 || n.href.indexOf('../') === 0 ? n.href : url(n.href.split('?')[0], n.href.split('?')[1])) + '">Abrir<span class="sr-only">: ' + esc(text) + '</span></a>' : '') +
        (!n.read ? '<button type="button" class="btn btn-text" data-read="' + n.id + '"' + (offline ? ' disabled aria-describedby="off-why"' : '') + '>Marcar como lida<span class="sr-only">: ' + esc(text) + '</span></button>' : '') + '</li>' + (gateNote(n) ? '<li class="g7-gate-prev"><p class="g5-hint">Ao abrir este aviso, você vê:</p>' + gateNote(n) + '</li>' : '');
    }
    function listHtml() {
      var shown = items.filter(function (n) { return (st.tab === 'todas' || !n.read) && (!st.kind || n.kind === st.kind); });
      if (panel) shown = shown.slice(0, 5);
      if (!shown.length) return st.kind ? '<div class="empty-state" role="status"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Nenhuma notificação para esse filtro.</h2><button type="button" class="btn btn-secondary" data-clear>Limpar filtro</button></div>' : (!items.length ? empty('bell', 'Nenhuma notificação.', 'Avisos sobre seus alunos aparecem aqui.', '<p>' + selo('C2') + '</p>') : empty('check-circle', 'Você leu tudo.', ''));
      var days = {}, order = []; shown.forEach(function (n) { var d = n.at.slice(0, 10); if (!days[d]) { days[d] = []; order.push(d); } days[d].push(n); });
      return order.map(function (d) { return '<section aria-labelledby="d-' + d + '"><h3 class="h4 g7-day" id="d-' + d + '">' + (d === E.today ? 'Hoje' : A.fmtDate(d)) + '</h3><ul class="g7-notifs">' + days[d].map(item).join('') + '</ul></section>'; }).join('') +
        (st.more ? '<p class="g5-hint" role="status">Mostrando os últimos 90 dias.</p><div class="g5-more"><button type="button" class="btn btn-secondary" data-more>Carregar mais</button></div>' : '');
    }
    function prefsHtml() {
      var busy = V === 'preferencias-salvando';
      function sw(id, label, on, dis, help) { return '<label class="switch"><input type="checkbox" role="switch" id="' + id + '"' + (on ? ' checked' : '') + (dis ? ' disabled' : '') + '><span class="switch-text">' + esc(label) + ' <span class="g7-state" data-state="' + id + '">' + (on ? '(ligado)' : '(desligado)') + '</span>' + (help ? '<small>' + esc(help) + '</small>' : '') + '</span></label>'; }
      return '<section class="card" aria-labelledby="t-pref" id="prefs"><div class="card-header"><h2 class="card-title" id="t-pref">Preferências</h2></div><div class="card-body stack">' +
        (V === 'erro-preferencias' ? alertBox('danger', '', 'Não foi possível salvar. Suas preferências continuam as mesmas.') : '') +
        '<fieldset class="stack-sm g7-fs"><legend class="h4">Canais</legend>' + sw('p-app', 'No app', prefs.inApp, true, 'Sempre ligado.') + sw('p-mail', 'E-mail', prefs.email, offline || busy) + sw('p-push', 'Aviso no celular', prefs.push, offline || busy) +
        '<p class="g5-hint">E-mails e avisos no celular mostram só "Novo alerta de um aluno". Os detalhes ficam no app.</p></fieldset>' +
        '<fieldset class="stack-sm g7-fs"><legend class="h4">Tipos</legend>' + sw('p-al', 'Alertas', true, true, 'Alertas não podem ser desligados.') + sw('p-ms', 'Mensagens', !prefs.muteMsg, offline || busy) + sw('p-qs', 'Questionários', !prefs.muteQ, offline || busy) + '</fieldset>' +
        '<div class="row"><button type="button" class="btn btn-primary" id="b-prefs"' + (busy ? ' aria-busy="true" disabled' : '') + (offline ? ' disabled' : '') + '>' + (busy ? 'Salvando…' : 'Salvar preferências') + '</button></div><div class="sr-only" role="status" aria-live="polite" data-g7-live></div></div></section>';
    }
    function draw(el) {
      var n = unread();
      var head = '<p class="g7-count" aria-live="polite" role="status">' + (n ? plural(n, 'notificação não lida', 'notificações não lidas') : 'Nenhuma notificação não lida') + '</p>';
      var kinds = '<div class="field g7-kindsel"><label for="f-k">Tipo</label><div class="select-wrap"><select class="select" id="f-k"><option value="">Todos</option>' + Object.keys(NK).map(function (k) { return '<option value="' + k + '"' + (st.kind === k ? ' selected' : '') + '>' + NK[k][0] + '</option>'; }).join('') + '</select></div></div>';
      var body = (offline ? offlineBox() + '<p class="sr-only" id="off-why">Sem conexão: marcar como lida está desativado.</p>' : '') + head +
        tabs('Notificações', [['nl', 'Não lidas', n], ['todas', 'Todas']], st.tab, 'nt-') + kinds +
        '<div class="row-between"><button type="button" class="btn btn-secondary" data-readall' + (n && !offline ? '' : ' disabled') + '>Marcar todas como lidas</button></div>' +
        '<div id="nt-pn" role="tabpanel" aria-labelledby="nt-' + st.tab + '" tabindex="0" class="stack">' + listHtml() + '</div>' + liveBox();
      if (panel) { el.innerHTML = '<div class="g7-bell card" role="dialog" aria-label="Notificações" aria-modal="false"><div class="card-body stack">' + body + '<a class="btn btn-primary" href="' + esc(url('notificacoes.html')) + '">Ver todas</a></div></div><p class="g5-hint">Esc fecha o painel e devolve o foco ao sino do cabeçalho.</p>'; }
      else el.innerHTML = '<div class="g7-split2"><div class="stack">' + body + '</div>' + (V === 'preferencias' || V === 'preferencias-salvando' || V === 'erro-preferencias' || V === 'pagina' || V === 'offline' || V === 'limite-itens' ? prefsHtml() : '') + '</div>';
      tabKeys(el, function (k) { st.tab = k === 'nl' ? 'nl' : 'todas'; draw(el); el.querySelector('#nt-' + st.tab).focus(); });
    }
    G6.boot(V, { rows: 8, skel: 'list', errText: 'Não foi possível carregar as notificações.', render: function (el) {
      draw(el);
      el.addEventListener('click', function (e) {
        var b;
        if ((b = e.target.closest('[data-read]'))) { items.forEach(function (n) { if (n.id === b.dataset.read) n.read = true; }); draw(el); live(el, 'Notificação marcada como lida.'); return; }
        if (e.target.closest('[data-readall]')) { modal({ title: 'Marcar todas como lidas?', opener: e.target.closest('[data-readall]'), okLabel: 'Marcar todas', body: '<p>Os avisos continuam na lista.</p>', onOk: function () { items.forEach(function (n) { n.read = true; }); setTimeout(function () { draw(el); live(el, 'Todas as notificações foram marcadas como lidas.'); var t3 = el.querySelector('#nt-' + st.tab); if (t3) t3.focus(); }, 0); return true; } }); return; }
        if (e.target.closest('[data-clear]')) { st.kind = ''; draw(el); return; }
        if (e.target.closest('[data-more]')) { st.more = false; draw(el); return; }
        if (e.target.closest('#b-prefs')) { window.AuraUI.toast('Preferências salvas.', { tone: 'success' }); live(el, 'Preferências salvas.'); }
      });
      el.addEventListener('change', function (e) {
        if (e.target.id === 'f-k') { st.kind = e.target.value; draw(el); el.querySelector('#f-k').focus(); return; }
        var s = el.querySelector('[data-state="' + e.target.id + '"]'); if (s) s.textContent = e.target.checked ? '(ligado)' : '(desligado)';
      });
      document.addEventListener('keydown', function (e) { if (panel && e.key === 'Escape') { var b = document.querySelector('.topbar [aria-label*="otific"]'); if (b) b.focus(); } });
    } });
  }

  window.G7 = { mount: mount, url: url, param: param, home: home, crumbs: crumbs, stu: stu, first: first, when: when, gv: gv, gateCard: gateCard, noteHidden: noteHidden, offlineBox: offlineBox, plural: plural, empty: empty, iaBlock: iaBlock,
    modal: modal, liveBox: liveBox, live: live, tabs: tabs, tabKeys: tabKeys, esc: esc, ico: ico, badge: badge, alertBox: alertBox, selo: selo, alertas: alertas, notificacoes: notificacoes, variant: G6.variant, boot: G6.boot };
})();
