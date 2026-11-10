/* g6-treinos.js - telas TRN-20 a TRN-24 (lote C, Treinos). Tudo [MOCK], sem gravacao real. A IA so sugere (aqui apenas um encaixe "Em breve").
   Atribuicao e treino do aluno ficam atras do portao unico de saude (G5DATA.gate): fora dele o aluno aparece so pelo nome, sem treino, sem contagem. */
(function () {
  var G4 = window.G4, G5 = window.G5, G6 = window.G6, D = window.G6DATA, S5 = window.G5DATA, A = window.AURA, esc = G6.esc, ico = G6.ico, selo = G6.selo, badge = G6.badge, alertBox = G6.alertBox, V = G6.variant();
  var T = {};
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function crumbs(extra) { return G6.crumbs([['Início', G6.home()], ['Treinos', G6.url('biblioteca.html')]].concat((extra || []).map(function (x) { return typeof x === 'string' ? [x] : x; }))); }
  /* rascunho vindo da IA: so ids opacos na URL (?ia=sg2 ou ?ia=imp&n=9); nada e gravado nem guardado no navegador */
  function iaDraft() {
    var I = window.G7IA, info = I && I.draftInfo(G6.param('ia'), G6.param('n')); if (!info) return '';
    return alertBox('info', 'Sugerido pela IA, revisado por você: no rascunho, ainda não salvo.', '<ul class="g4-list-plain">' + info.items.map(function (i) { return '<li><strong>' + esc(i.title) + '.</strong> ' + esc(i.change) + '</li>'; }).join('') + '</ul><p>A IA só sugere. Confira, edite e use "Salvar" quando quiser. Ao salvar, a autoria é sua. Para desfazer, <a href="' + esc(location.pathname + location.search.replace(/[?&]ia=[^&]*/, '').replace(/[?&]n=[^&]*/, '').replace(/^&/, '?')) + '">abra o editor sem o rascunho</a>.</p>');
  }
  function reload() { location.href = location.pathname + '?' + location.search.replace(/^\?/, '').split('&').filter(function (p) { return p && p.indexOf('variant=') !== 0; }).join('&'); }
  var DAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'], DS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  function scopeBadge(p) { return p.scope === 'OWN' ? badge('primary', 'user', 'Seu') : p.scope === 'SYSTEM' ? badge('neutral', 'external', 'Do sistema') : p.scope === 'PUBLIC' ? badge('info', 'external', 'Público, de ' + p.owner) : badge('info', 'users', 'Compartilhado, de ' + p.owner); }

  /* =============== TRN-20 biblioteca =============== */
  T.biblioteca = function () {
    var st = { tab: V === 'sistema-vazio' ? 'sistema' : 'meus', q: V === 'filtro-sem-resultado' ? 'zzxx' : '', status: '', lvl: '', goal: '', view: 'cards' };
    function pool() {
      return D.programs.filter(function (p) {
        if (V === 'vazio' && p.scope === 'OWN') return false; if (V === 'so-rascunhos' && p.scope === 'OWN' && p.status !== 'DRAFT') return false; if (V === 'sistema-vazio' && p.scope === 'SYSTEM') return false; return true;
      });
    }
    function inTab(p, t) { return t === 'meus' ? p.scope === 'OWN' : t === 'sistema' ? p.scope === 'SYSTEM' : (p.scope === 'PUBLIC' || p.scope === 'SHARED'); }
    function list(t) { return pool().filter(function (p) { if (!inTab(p, t)) return false; if (st.q && norm(p.name).indexOf(norm(st.q)) === -1) return false; if (st.status ? p.status !== st.status : (p.status === 'ARCHIVED')) return false; if (st.lvl && p.level !== st.lvl) return false; if (st.goal && norm(p.goal).indexOf(norm(st.goal)) === -1) return false; return true; }); }
    function count(t) { return pool().filter(function (p) { return inTab(p, t) && p.status !== 'ARCHIVED'; }).length; }
    function card(p) {
      var own = p.scope === 'OWN', use = p.usedBy > 0 ? '<p class="muted">Em uso por ' + G6.plural(p.usedBy, 'aluno', 'alunos') + ' com acompanhamento ativo</p>' : '';
      return '<article class="card"><div class="card-body stack-sm"><div class="row-between" style="flex-wrap:nowrap"><h2 class="h4 g6-card-title"><a href="' + esc(G6.url('modelo-editor.html', 'id=' + p.id)) + '">' + esc(p.name) + '</a></h2><button type="button" class="btn btn-text btn-icon" aria-haspopup="menu" aria-expanded="false" data-more="' + p.id + '" aria-label="Mais ações: ' + esc(p.name) + '">' + ico('more') + '</button></div>' +
        '<p class="muted">' + esc(p.goal) + ' · ' + esc(G6.levelText(p.level)) + '</p><p>' + G6.plural(p.sessionsCount, 'sessão', 'sessões') + ', ' + G6.plural(p.itemsCount, 'exercício', 'exercícios') + ' · v' + p.version + '</p><div class="g6-chips">' + G6.statusBadge(p.status) + scopeBadge(p) + '</div>' +
        '<p class="muted">Atualizado em ' + G5.time(p.updatedAt) + '</p>' + use + '<div class="row"><a class="btn btn-secondary" href="' + esc(G6.url('atribuir.html', 'modelo=' + p.id)) + '"' + (p.status === 'ARCHIVED' ? ' aria-disabled="true" tabindex="-1"' : '') + '>Atribuir<span class="sr-only">: ' + esc(p.name) + '</span></a></div></div></article>';
    }
    function table(rows) {
      return '<div class="table-wrap" role="region" aria-label="Modelos de treino" tabindex="0"><table class="table"><caption class="sr-only">Modelos de treino</caption><thead><tr><th scope="col">Nome</th><th scope="col">Nível</th><th scope="col">Sessões</th><th scope="col">Versão</th><th scope="col">Status</th><th scope="col">Atualizado</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead><tbody>' + rows.map(function (p) {
        return '<tr><td class="cell-main"><a href="' + esc(G6.url('modelo-editor.html', 'id=' + p.id)) + '">' + esc(p.name) + '</a></td><td data-label="Nível">' + esc(G6.levelText(p.level)) + '</td><td data-label="Sessões">' + p.sessionsCount + '</td><td data-label="Versão">v' + p.version + '</td><td data-label="Status">' + G6.statusBadge(p.status) + '</td><td data-label="Atualizado">' + G5.time(p.updatedAt) + '</td><td class="col-actions"><a class="btn btn-secondary" href="' + esc(G6.url('atribuir.html', 'modelo=' + p.id)) + '">Atribuir<span class="sr-only">: ' + esc(p.name) + '</span></a> <button type="button" class="btn btn-text btn-icon" aria-haspopup="menu" aria-expanded="false" data-more="' + p.id + '" aria-label="Mais ações: ' + esc(p.name) + '">' + ico('more') + '</button></td></tr>';
      }).join('') + '</tbody></table></div>';
    }
    function res() {
      var l = list(st.tab), h = '<div class="g6-filters" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));align-items:end"><div class="field"><label for="f-q">Buscar por nome</label><input class="input" id="f-q" type="search" autocomplete="off" value="' + esc(st.q) + '"></div>' +
        '<div class="field"><label for="f-st">Status</label><div class="select-wrap"><select class="select" id="f-st"><option value="">Rascunho e ativo</option><option value="DRAFT"' + (st.status === 'DRAFT' ? ' selected' : '') + '>Rascunho</option><option value="ACTIVE"' + (st.status === 'ACTIVE' ? ' selected' : '') + '>Ativo</option><option value="ARCHIVED"' + (st.status === 'ARCHIVED' ? ' selected' : '') + '>Arquivado</option></select></div></div>' +
        '<div class="field"><label for="f-lv">Nível</label><div class="select-wrap"><select class="select" id="f-lv"><option value="">Todos</option><option value="BEGINNER"' + (st.lvl === 'BEGINNER' ? ' selected' : '') + '>Iniciante</option><option value="INTERMEDIATE"' + (st.lvl === 'INTERMEDIATE' ? ' selected' : '') + '>Intermediário</option><option value="ADVANCED"' + (st.lvl === 'ADVANCED' ? ' selected' : '') + '>Avançado</option></select></div></div>' +
        '<div class="field"><label for="f-go">Objetivo</label><input class="input" id="f-go" value="' + esc(st.goal) + '"></div></div>' +
        '<div class="row-between"><p class="muted" role="status" aria-live="polite">' + G6.plural(l.length, 'modelo encontrado', 'modelos encontrados') + '</p><div class="row g6-toggle" role="group" aria-label="Forma de exibição"><button type="button" class="chip" data-view="cards" aria-pressed="' + (st.view === 'cards') + '">Cartões</button><button type="button" class="chip" data-view="table" aria-pressed="' + (st.view === 'table') + '">Tabela</button></div></div>';
      if (!l.length) {
        if (st.q || st.status || st.lvl || st.goal) h += '<div class="empty-state" role="status"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Nenhum modelo encontrado.</h2><p>Tente outra busca ou remova filtros.</p><button type="button" class="btn btn-secondary" data-clear>Limpar busca e filtros</button></div>';
        else if (st.tab === 'meus') h += '<div class="empty-state"><div class="empty-state-icon">' + ico('dumbbell') + '</div><h2 class="h3">Você ainda não tem modelos de treino.</h2><p>Monte o primeiro, ou comece por um modelo do sistema.</p><div class="row"><a class="btn btn-primary" href="' + esc(G6.url('modelo-editor.html', 'variant=novo')) + '">Novo modelo</a><button type="button" class="btn btn-secondary" data-tab="sistema">Ver modelos do sistema</button></div></div>';
        else h += '<div class="empty-state"><div class="empty-state-icon">' + ico('clipboard') + '</div><h2 class="h3">Ainda não há modelos aqui.</h2><p>' + selo('M1') + (st.tab === 'publicos' ? selo('M2') : '') + '</p></div>';
      } else h += st.view === 'table' ? table(l) : '<div class="g6-grid is-side">' + l.map(card).join('') + '</div>';
      return h;
    }
    function page(el) {
      var tabs = [['meus', 'Meus', ''], ['sistema', 'Do sistema', selo('M1')], ['publicos', 'Públicos e compartilhados', selo('M1') + selo('M2')]];
      el.innerHTML = (V === 'offline' ? G6.offline() : '') + '<div class="g5-tabs"><div class="tabs" role="tablist" aria-label="Origem dos modelos">' + tabs.map(function (t) { return '<button type="button" class="tab" role="tab" id="tab-' + t[0] + '" aria-controls="pn" aria-selected="' + (st.tab === t[0]) + '" tabindex="' + (st.tab === t[0] ? 0 : -1) + '">' + t[1] + ' (' + count(t[0]) + ')' + (t[2] ? ' ' + t[2] : '') + '</button>'; }).join('') + '</div></div><div id="pn" role="tabpanel" aria-labelledby="tab-' + st.tab + '" tabindex="0" class="stack mt-4"></div>';
      draw(el);
    }
    function draw(el, keep) {
      var pn = el.querySelector('#pn'), act = document.activeElement && document.activeElement.id; pn.innerHTML = res();
      if (act && pn.querySelector('#' + act)) { var f = pn.querySelector('#' + act); f.focus(); if (f.setSelectionRange && f.type === 'search') f.setSelectionRange(f.value.length, f.value.length); }
    }
    G6.boot(V, { rows: 6, errText: 'Não foi possível carregar os modelos.', render: function (el) {
      page(el);
      el.addEventListener('input', function (e) { if (e.target.id === 'f-q') { st.q = e.target.value; draw(el); } else if (e.target.id === 'f-go') { st.goal = e.target.value; draw(el); } });
      el.addEventListener('change', function (e) { if (e.target.id === 'f-st') st.status = e.target.value; else if (e.target.id === 'f-lv') st.lvl = e.target.value; else return; draw(el); });
      el.addEventListener('click', function (e) {
        var t = e.target.closest('[role="tab"]'); if (t) { st.tab = t.id.replace('tab-', ''); page(el); el.querySelector('#' + t.id).focus(); return; }
        var v = e.target.closest('[data-view]'); if (v) { st.view = v.dataset.view; draw(el); return; }
        if (e.target.closest('[data-clear]')) { st.q = st.status = st.lvl = st.goal = ''; draw(el); return; }
        var tb = e.target.closest('[data-tab]'); if (tb) { st.tab = tb.dataset.tab; page(el); el.querySelector('#tab-' + st.tab).focus(); return; }
        var mb = e.target.closest('[data-more]'); if (mb) menu(mb, el);
      });
    } });
    function menu(btn, el) {
      var old = document.getElementById('g6-pop'); if (old) { old.remove(); if (old.dataset.for === btn.dataset.more) { btn.setAttribute('aria-expanded', 'false'); return; } }
      var p = D.prFind(btn.dataset.more), own = p.scope === 'OWN', items = [];
      items.push(['a', 'Abrir', G6.url('modelo-editor.html', 'id=' + p.id)]);
      if (p.status !== 'ARCHIVED') items.push(['a', 'Atribuir a aluno', G6.url('atribuir.html', 'modelo=' + p.id)]);
      items.push(['b', own ? 'Duplicar' : 'Duplicar para meus modelos', 'dup']);
      items.push(['a', 'Histórico', G6.url('historico-versoes.html', 'modelo=' + p.id)]);
      if (own) items.push(['b', p.status === 'ARCHIVED' ? 'Restaurar' : 'Arquivar', p.status === 'ARCHIVED' ? 'rest' : 'arch']);
      var pop = document.createElement('div'); pop.id = 'g6-pop'; pop.dataset.for = p.id; pop.className = 'g6-menu-pop'; pop.setAttribute('role', 'menu');
      pop.innerHTML = items.map(function (i) { return i[0] === 'a' ? '<a role="menuitem" href="' + esc(i[2]) + '">' + i[1] + '</a>' : '<button type="button" role="menuitem" data-k="' + i[2] + '">' + i[1] + (i[2] === 'dup' && !own ? ' ' + 'Requer API nova (M1)' : '') + '</button>'; }).join('');
      var r = btn.getBoundingClientRect(); document.body.appendChild(pop); pop.style.top = (window.scrollY + r.bottom + 4) + 'px'; pop.style.left = Math.max(8, Math.min(window.scrollX + r.right - 240, window.innerWidth - 252)) + 'px';
      btn.setAttribute('aria-expanded', 'true'); pop.querySelector('a,button').focus();
      function close() { pop.remove(); btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('keydown', onk); document.removeEventListener('mousedown', onm); }
      function onk(ev) { if (ev.key === 'Escape') { close(); btn.focus(); } } function onm(ev) { if (!pop.contains(ev.target) && ev.target !== btn) close(); }
      document.addEventListener('keydown', onk); document.addEventListener('mousedown', onm);
      pop.addEventListener('click', function (e) {
        var b = e.target.closest('[data-k]'); if (!b) return; var k = b.dataset.k; close();
        if (k === 'dup') AuraUI.toast('Cópia criada como rascunho: ' + p.name + ' (cópia). Demonstração, nada foi gravado.', { tone: 'success' });
        else if (k === 'arch') AuraUI.confirm({ title: 'Arquivar ' + p.name + '?', text: 'Ele sai da lista principal. Treinos já atribuídos a alunos continuam como estão (são cópias). Você pode restaurar.', confirmLabel: 'Arquivar', cancelLabel: 'Manter' }).then(function (ok) { if (ok) { p.status = 'ARCHIVED'; page(el); AuraUI.toast('Modelo arquivado.', { tone: 'info' }); } });
        else AuraUI.confirm({ title: 'Restaurar ' + p.name + '?', text: 'Ele volta para a lista principal como rascunho.', confirmLabel: 'Restaurar', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) { p.status = 'DRAFT'; page(el); AuraUI.toast('Modelo restaurado.', { tone: 'success' }); } });
      });
    }
  };

  /* =============== TRN-21 editor de modelo =============== */
  T.modelo = function () {
    var VID = { 'so-leitura-sistema': 's01', 'so-leitura-publico': 'x01', arquivado: 'p07', rascunho: 'p05', ativo: 'p01' };
    var id = G6.param('id') || VID[V] || (V === 'novo' ? null : 'p01'), prog = id ? D.prFind(id) : null;
    var isNew = V === 'novo' || !prog, ro = !isNew && (prog.scope !== 'OWN' || prog.status === 'ARCHIVED');
    var M = isNew ? D.emptyModel() : D.sample();
    if (!isNew) { M.id = prog.id; M.name = prog.name; M.goal = prog.goal; M.level = prog.level; M.status = prog.status; M.version = prog.version; }
    if (V === 'vazio-sessao') M.sessions.forEach(function (s) { s.blocks = []; });
    if (V === 'erro-validacao') { var a = M.sessions[0]; a.blocks[1].items.pop(); M.sessions[2].blocks[0].item.sets = []; M.sessions[0].blocks[0].item.sets[1].repsMax = 6; M.sessions[1].blocks[1].item.unavailable = true; M.name = ''; }
    document.getElementById('bc').innerHTML = crumbs([isNew ? 'Novo modelo' : M.name]);
    document.getElementById('titulo').textContent = isNew ? 'Novo modelo de treino' : M.name;
    var dirty = V === 'nao-salvo', problems = [], handle;
    function head() {
      var d = ro ? ' disabled' : '';
      return '<section class="card" aria-labelledby="t-cab"><div class="card-header"><h2 class="card-title" id="t-cab">Dados do modelo</h2><div class="row">' + G6.statusBadge(M.status) + '<span class="badge">Versão atual v' + M.version + '</span></div></div><div class="card-body g6-gridfields">' +
        '<div class="field"><label for="ed-name">Nome <span class="field-required">*</span></label><input class="input" id="ed-name" value="' + esc(M.name) + '"' + d + '></div><div class="field"><label for="ed-goal">Objetivo</label><input class="input" id="ed-goal" value="' + esc(M.goal) + '"' + d + '></div>' +
        '<div class="field"><label for="ed-lvl">Nível</label><div class="select-wrap"><select class="select" id="ed-lvl"' + d + '><option value="">Sem nível</option>' + [['BEGINNER', 'Iniciante'], ['INTERMEDIATE', 'Intermediário'], ['ADVANCED', 'Avançado']].map(function (x) { return '<option value="' + x[0] + '"' + (M.level === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="field" style="grid-column:1/-1"><label for="ed-desc">Descrição</label><textarea class="textarea" id="ed-desc"' + d + '>' + esc(M.description || '') + '</textarea><span class="field-help">Não escreva informação de saúde nas descrições e notas do modelo.</span></div></div></section>';
    }
    function bar() {
      var offl = V === 'offline', conf = V === 'conflito', saving = V === 'salvando', why = offl ? 'Sem conexão: salvar e publicar ficam desativados. Suas alterações continuam nesta tela enquanto ela estiver aberta.' : conf ? 'Recarregue para continuar.' : '';
      if (ro) return '<div class="g6-savebar"><button type="button" class="btn btn-primary" id="b-dup">Duplicar para meus modelos ' + selo('M1') + '</button><a class="btn btn-secondary" href="' + esc(G6.url('atribuir.html', 'modelo=' + (M.id || ''))) + '"' + (M.status === 'ARCHIVED' ? ' aria-disabled="true" tabindex="-1"' : '') + '>Atribuir</a><a class="btn btn-text" href="' + esc(G6.url('historico-versoes.html', 'modelo=' + M.id)) + '">Histórico</a><a class="btn btn-neutral" href="' + esc(G6.url('biblioteca.html')) + '">Fechar</a></div>' + (M.status === 'ARCHIVED' ? '<p class="g5-hint">Restaurar o modelo antes de atribuir.</p>' : '');
      var dis = (offl || conf || saving) ? ' disabled aria-describedby="why-bar"' : '';
      return '<div class="g6-savebar is-fixed"><button type="button" class="btn btn-primary" id="b-save"' + dis + (saving ? ' aria-busy="true"' : '') + '>' + (saving ? 'Salvando…' : 'Salvar rascunho') + '</button><button type="button" class="btn btn-secondary" id="b-pub"' + dis + '>Publicar versão ' + selo('M3') + '</button>' + (isNew ? '' : '<a class="btn btn-secondary" href="' + esc(G6.url('atribuir.html', 'modelo=' + M.id)) + '">Atribuir</a><a class="btn btn-text" href="' + esc(G6.url('historico-versoes.html', 'modelo=' + M.id)) + '">Histórico</a>') + '<button type="button" class="btn btn-neutral" id="b-close">Fechar</button><span class="g5-hint" role="status" id="dirty">' + (dirty ? 'Alterações não salvas.' : '') + '</span>' + (conf ? '<button type="button" class="btn btn-secondary" id="b-reload">Recarregar</button>' : '') + '</div>' + (why ? '<p class="g5-hint" id="why-bar">' + why + '</p>' : '');
    }
    function sideSum() { return G6.summary(M, problems); }
    G6.boot(V === 'sem-permissao' ? 'sem-permissao' : V === 'carregando' ? 'carregando' : '', { rows: 5, skel: 'list', render: function (el) {
      el.innerHTML = '<div class="stack-lg">' + (V === 'offline' ? G6.offline() : '') + (V === 'conflito' ? alertBox('warning', 'Conflito de edição', 'Este modelo foi alterado em outro lugar. Recarregue. Nada foi sobrescrito.') : '') + (V === 'erro-salvar' ? '<div id="save-err" role="alert" tabindex="-1"></div>' : '<div id="save-err" role="alert" tabindex="-1"></div>') +
        (ro ? alertBox('info', '', prog && prog.status === 'ARCHIVED' ? 'Este modelo está arquivado. Só leitura. Restaure para editar.' : 'Este modelo é de ' + esc(prog.owner) + ' e está em modo leitura. Duplique para os seus modelos para editar. ' + selo('M1')) : '') +
        alertBox('info', '', 'Mudanças neste modelo não alteram treinos já atribuídos.') + iaDraft() + '<div id="probs"></div>' +
        '<div class="g6-layout is-editor"><div class="stack-lg">' + head() + '<div id="ed"></div>' + G6.iaSlot() + '</div><aside class="g6-summary-wrap"><div class="g6-sticky stack" id="side">' + sideSum() + '</div></aside></div>' + bar() + '</div>';
      handle = G6.editor(el.querySelector('#ed'), M, { readonly: ro, onChange: function () { dirty = true; var d = el.querySelector('#dirty'); if (d) d.textContent = 'Alterações não salvas.'; el.querySelector('#side').innerHTML = sideSum(); } });
      try { localStorage.removeItem('g6-draft-model'); } catch (x) {}
      if (V === 'com-circuito') handle.goto(1);
      function showProblems() { problems = G6.validate(M); el.querySelector('#probs').innerHTML = G6.problemList(problems); el.querySelector('#side').innerHTML = sideSum(); var pb = el.querySelector('#g6-problems'); if (pb) pb.focus(); return !problems.length; }
      if (V === 'erro-validacao') showProblems();
      el.addEventListener('input', function (e) { var m = { 'ed-name': 'name', 'ed-goal': 'goal', 'ed-lvl': 'level', 'ed-desc': 'description' }[e.target.id]; if (m && !ro) { M[m] = e.target.value; dirty = true; el.querySelector('#dirty').textContent = 'Alterações não salvas.'; } });
      el.addEventListener('click', function (e) {
        var gl = e.target.closest('[data-goto]'); if (gl) { e.preventDefault(); var tg = el.querySelector('#' + gl.dataset.goto); if (tg) { var tab = null; M.sessions.forEach(function (s, i) { if (tg.closest && !tab) { } }); tg.focus(); tg.scrollIntoView({ block: 'center' }); } return; }
        if (e.target.closest('#b-save')) {
          if (V === 'erro-salvar') { var b = el.querySelector('#save-err'); b.innerHTML = alertBox('danger', '', 'Suas alterações continuam nesta tela; tente novamente.'); b.focus(); return; }
          dirty = false; el.querySelector('#dirty').textContent = ''; AuraUI.toast('Rascunho salvo. Demonstração, nada foi gravado.', { tone: 'success' });
        } else if (e.target.closest('#b-pub')) {
          if (!showProblems()) return;
          AuraUI.confirm({ title: 'Publicar a versão v' + (M.version + 1) + '?', text: 'Treinos já atribuídos NÃO mudam, pois cada aluno tem uma cópia.', confirmLabel: 'Publicar versão', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) { dirty = false; el.querySelector('#dirty').textContent = ''; AuraUI.toast('Versão v' + (M.version + 1) + ' publicada. Demonstração, nada foi gravado.', { tone: 'success' }); } });
        } else if (e.target.closest('#b-close')) G6.guard(function () { return dirty; }, G6.url('biblioteca.html'))();
        else if (e.target.closest('#b-reload')) reload();
        else if (e.target.closest('#b-dup')) AuraUI.toast('Cópia criada como rascunho: ' + M.name + ' (cópia). Demonstração, nada foi gravado.', { tone: 'success' });
      });
      window.addEventListener('beforeunload', function (e) { if (dirty && V !== 'nao-salvo') { e.preventDefault(); e.returnValue = ''; } });
    } });
  };

  /* =============== TRN-22 atribuir =============== */
  function gateInfo(st) {
    var g = S5.gate(st);
    if (g.ok) return { ok: true, reason: '' };
    if (g.reason === 'idade') return { ok: false, reason: 'Conta em espera' };
    if (g.reason === 'vinculo') return { ok: false, reason: st.status === 'ENDING' ? 'Vínculo encerrando' : 'Vínculo pausado' };
    return { ok: false, reason: 'Aguardando liberação de saúde' };
  }
  function daysGroup(prefix, sel, label, dis) {
    return '<fieldset class="field" style="border:0;padding:0;margin:0"><legend class="field-label">' + esc(label) + '</legend><div class="g6-days">' + DAYS.map(function (d, i) { return '<label class="check"><input type="checkbox" data-day="' + prefix + ':' + i + '"' + (sel.indexOf(i) !== -1 ? ' checked' : '') + (dis ? ' disabled' : '') + '><span class="check-text">' + d + '</span></label>'; }).join('') + '</div></fieldset>';
  }
  T.atribuir = function () {
    var mid = G6.param('modelo') || 'p01', prog = D.prFind(mid) || D.prFind('p01'), custom = V === 'personalizado';
    var emptyModel = V === 'limite-modelo-vazio', archived = prog.status === 'ARCHIVED';
    document.getElementById('bc').innerHTML = crumbs([prog.name, 'Atribuir']);
    var students = V === 'sem-alunos-ativos' ? [] : D.STUDENT_IDS.map(function (i) { return S5.find(i); }).filter(Boolean);
    if (V === 'nenhum-elegivel') students = students.filter(function (s) { return !gateInfo(s).ok; });
    var pre = G6.param('aluno') || (V === 'aluno-preselecionado' || V === 'ja-tem-treino' ? 's01' : V === 'aluno-fora-do-portao' ? 's04' : V === 'aluno-menor-em-espera' ? 's20' : V === 'aluno-pausado' ? 's05' : null);
    var sel = null, blockedPre = null;
    var pst = pre ? S5.find(pre) : null; if (pst && students.indexOf(pst) !== -1) { if (gateInfo(pst).ok) sel = pst.id; else blockedPre = pst; }
    var sessions = ['A', 'B', 'C'].slice(0, prog.sessionsCount), days = { A: [1, 4], B: [2, 5], C: [] };
    var F = { start: A.today, end: '', noEnd: true, free: V === 'treino-livre', note: '', how: 'end', q: '' };
    if (V === 'erro-validacao') { F.start = '2026-11-10'; F.end = '2026-11-01'; F.noEnd = false; sel = sel || 's02'; }
    function daysSummary() { if (F.free) return 'Treino livre (sem dia fixo)'; return sessions.map(function (s) { return s + ': ' + ((days[s] || []).length ? days[s].map(function (d) { return DS[d]; }).join(' e ') : 'sem dia'); }).join('; '); }
    function conflicts() { var seen = {}, c = false; sessions.forEach(function (s) { (days[s] || []).forEach(function (d) { if (seen[d]) c = true; seen[d] = 1; }); }); return !F.free && c; }
    function stu() { return sel ? S5.find(sel) : null; }
    function errs() { var e = []; if (!stu() && !custom) e.push(['q-stu', 'Escolha um aluno.']); if (!stu() && custom) e.push(['q-stu', 'Escolha um aluno.']); if (!F.start) e.push(['f-start', 'Informe a data de início.']); if (!F.noEnd && F.end && F.end <= F.start) e.push(['f-end', 'O fim deve ser depois do início.']); return e; }
    function html() {
      var st = stu(), ok = st && gateInfo(st).ok, ta = st && S5.trainView(st), eligible = students.filter(function (s) { return gateInfo(s).ok; }).length;
      var list = students.filter(function (s) { return !F.q || norm(s.name).indexOf(norm(F.q)) !== -1; });
      var stuHtml = V === 'sem-alunos-ativos' ? '<div class="empty-state"><div class="empty-state-icon">' + ico('users') + '</div><h3 class="h3">Você ainda não tem alunos ativos para atribuir.</h3><a class="btn btn-primary" href="' + esc(G6.url('../home/convidar-aluno.html')) + '">Convidar aluno</a></div>' :
        (!eligible ? alertBox('info', 'Nenhum aluno elegível agora.', 'Alunos aguardando liberação de saúde não recebem treinos até liberar.') : '') +
        '<div class="field"><label for="q-stu">Buscar aluno por nome</label><input class="input" id="q-stu" type="search" autocomplete="off" value="' + esc(F.q) + '"></div><ul class="g6-students" role="radiogroup" aria-label="Aluno">' + list.map(function (s) {
          var gi = gateInfo(s); return '<li><label class="check"><input type="radio" name="stu" value="' + s.id + '"' + (sel === s.id ? ' checked' : '') + (gi.ok ? '' : ' disabled aria-describedby="r-' + s.id + '"') + '><span class="check-text">' + esc(s.name) + (gi.ok ? '' : '<small id="r-' + s.id + '">' + gi.reason + '</small>') + '</span></label></li>';
        }).join('') + '</ul>' + (blockedPre ? alertBox('info', '', esc(blockedPre.name) + ': ' + gateInfo(blockedPre).reason + '. Este aluno não pode receber treino agora.') : '');
      var prev = ok && ta && ta.activeAssignmentName ? '<fieldset class="field" style="border:0;padding:0;margin:0"><legend class="field-label">Este aluno já tem um treino ativo (' + esc(ta.activeAssignmentName) + '). O atual será encerrado na data de início do novo?</legend><label class="check"><input type="radio" name="how" value="end"' + (F.how === 'end' ? ' checked' : '') + '><span class="check-text">Encerrar o atual no dia anterior</span></label><label class="check"><input type="radio" name="how" value="both"' + (F.how === 'both' ? ' checked' : '') + '><span class="check-text">Manter os dois</span></label></fieldset>' : '';
      var sumTxt = (st && ok ? 'Você vai atribuir ' + (custom ? 'um treino personalizado' : prog.name + ' v' + prog.version) + ' a ' + st.name + ', de ' + A.fmtDate(F.start) + (F.noEnd || !F.end ? ', sem data de fim' : ' a ' + A.fmtDate(F.end)) + ', nos dias: ' + daysSummary() + '.' : 'Escolha um aluno elegível para ver o resumo.');
      var blockModel = emptyModel ? 'Este modelo está vazio. Adicione exercícios antes de atribuir.' : archived ? 'Restaurar o modelo antes de atribuir.' : '';
      return '<div class="g6-layout is-editor"><form class="stack-lg" id="frm" novalidate onsubmit="return false">' + (V === 'offline' ? G6.offline() : '') + '<div id="errsum" tabindex="-1"></div>' + (V === 'erro-salvar' ? '<div id="save-err" role="alert" tabindex="-1"></div>' : '') + (blockModel ? alertBox('warning', '', blockModel) : '') +
        '<section class="card" aria-labelledby="s1"><div class="card-header"><h2 class="card-title" id="s1">1. Modelo</h2></div><div class="card-body stack-sm">' + (custom ? '<p><strong>Treino personalizado só para este aluno.</strong> Origem: Personalizado. Você monta o treino no próximo passo.</p>' : '<p><strong>' + esc(prog.name) + '</strong> · v' + prog.version + '</p><p class="muted">' + G6.plural(prog.sessionsCount, 'sessão', 'sessões') + ': ' + sessions.join(', ') + '</p>') + '<label class="check"><input type="checkbox" id="c-cust"' + (custom ? ' checked' : '') + '><span class="check-text">Montar um treino personalizado só para este aluno</span></label></div></section>' +
        '<section class="card" aria-labelledby="s2"><div class="card-header"><h2 class="card-title" id="s2">2. Aluno</h2></div><div class="card-body stack">' + stuHtml + prev + '</div></section>' +
        '<section class="card" aria-labelledby="s3"><div class="card-header"><h2 class="card-title" id="s3">3. Período</h2></div><div class="card-body g6-gridfields"><div class="field"><label for="f-start">Início <span class="field-required">*</span></label><input class="input" id="f-start" type="date" value="' + esc(F.start) + '"><span class="field-help">dd/mm/aaaa</span></div><div class="field"><label for="f-end">Fim</label><input class="input" id="f-end" type="date" value="' + esc(F.end) + '"' + (F.noEnd ? ' disabled' : '') + '><label class="check"><input type="checkbox" id="c-noend"' + (F.noEnd ? ' checked' : '') + '><span class="check-text">Sem data de fim</span></label></div></div></section>' +
        '<section class="card" aria-labelledby="s4"><div class="card-header"><h2 class="card-title" id="s4">4. Dias da semana</h2></div><div class="card-body stack"><label class="check"><input type="checkbox" id="c-free"' + (F.free ? ' checked' : '') + '><span class="check-text">Treino livre (sem dia fixo)</span></label>' + sessions.map(function (s) { return daysGroup(s, days[s] || [], 'Dias da sessão ' + s, F.free); }).join('') + (conflicts() ? alertBox('warning', '', 'Dois treinos no mesmo dia.') : '') + '<p class="muted" role="status">' + esc(daysSummary()) + '</p></div></section>' +
        '<section class="card" aria-labelledby="s5"><div class="card-header"><h2 class="card-title" id="s5">5. Notas para o aluno (opcional)</h2></div><div class="card-body field">' + (ok ? '<label for="f-note">Notas</label><textarea class="textarea" id="f-note" maxlength="300">' + esc(F.note) + '</textarea><span class="field-help">Não escreva informação de saúde aqui, a menos que o aluno já tenha liberado.</span>' : '<p class="muted">Escolha um aluno elegível para escrever notas.</p>') + '</div></section>' + '</form>' +
        '<aside class="g6-summary-wrap"><div class="g6-sticky stack"><section class="card" aria-labelledby="s6"><div class="card-header"><h2 class="card-title" id="s6">Resumo da atribuição</h2></div><div class="card-body stack"><p role="status" aria-live="polite" id="sum">' + esc(sumTxt) + '</p><ul class="g4-list-plain"><li>O aluno recebe uma cópia. Mudanças futuras no modelo não alteram a cópia.</li><li>Você pode ajustar só o treino dele depois.</li><li>O aluno é avisado do novo treino. [MOCK] texto a confirmar.</li></ul>' +
        '<div class="row"><button type="button" class="btn btn-primary" id="b-ok"' + (blockModel || V === 'offline' || V === 'salvando' ? ' disabled aria-describedby="why"' : '') + (V === 'salvando' ? ' aria-busy="true"' : '') + '>' + (V === 'salvando' ? 'Salvando…' : 'Atribuir treino') + '</button><a class="btn btn-neutral" href="' + esc(G6.url('biblioteca.html')) + '">Cancelar</a></div><p class="g5-hint" id="why">' + (blockModel || (V === 'offline' ? 'Sem conexão: atribuir fica desativado.' : '')) + '</p></div></section></div></aside></div>';
    }
    function show(el, focus) { el.innerHTML = html(); if (focus) { var f = el.querySelector(focus); if (f) { f.focus(); if (f.setSelectionRange && f.type === 'search') f.setSelectionRange(f.value.length, f.value.length); } } }
    G6.boot(V, { rows: 5, skel: 'list', render: function (el) {
      show(el);
      el.addEventListener('input', function (e) { var id = e.target.id; if (id === 'q-stu') { F.q = e.target.value; show(el, '#q-stu'); } else if (id === 'f-start') { F.start = e.target.value; refreshSum(); } else if (id === 'f-end') { F.end = e.target.value; refreshSum(); } else if (id === 'f-note') F.note = e.target.value; });
      function refreshSum() { var st = stu(); el.querySelector('#sum').textContent = st && gateInfo(st).ok ? 'Você vai atribuir ' + (custom ? 'um treino personalizado' : prog.name + ' v' + prog.version) + ' a ' + st.name + ', de ' + A.fmtDate(F.start) + (F.noEnd || !F.end ? ', sem data de fim' : ' a ' + A.fmtDate(F.end)) + ', nos dias: ' + daysSummary() + '.' : 'Escolha um aluno elegível para ver o resumo.'; }
      el.addEventListener('change', function (e) {
        var t = e.target;
        if (t.name === 'stu') { if (sel !== t.value) F.note = ''; sel = t.value; blockedPre = null; show(el, 'input[name="stu"][value="' + sel + '"]'); }
        else if (t.name === 'how') F.how = t.value;
        else if (t.id === 'c-noend') { F.noEnd = t.checked; show(el, '#c-noend'); }
        else if (t.id === 'c-free') { F.free = t.checked; show(el, '#c-free'); }
        else if (t.id === 'c-cust') { custom = t.checked; show(el, '#c-cust'); }
        else if (t.dataset.day) { var p = t.dataset.day.split(':'), d = days[p[0]] || (days[p[0]] = []), n = +p[1], i = d.indexOf(n); if (t.checked && i === -1) d.push(n); else if (i !== -1) d.splice(i, 1); show(el, '[data-day="' + t.dataset.day + '"]'); }
      });
      el.addEventListener('click', function (e) {
        if (!e.target.closest('#b-ok')) return; var er = errs(), box = el.querySelector('#errsum');
        box.innerHTML = er.length ? '<div class="alert alert-danger" role="alert">' + ico('alert') + '<div class="alert-body"><div class="alert-title">Corrija antes de atribuir</div><ul class="g4-list-plain">' + er.map(function (x) { return '<li><a href="#' + x[0] + '" data-goto="' + x[0] + '">' + esc(x[1]) + '</a></li>'; }).join('') + '</ul></div></div>' : '';
        if (er.length) { box.focus(); var t = el.querySelector('#' + er[0][0]) || el.querySelector('input[name="stu"]:not(:disabled)'); if (t) t.focus(); return; }
        if (V === 'erro-salvar') { var b = el.querySelector('#save-err'); b.innerHTML = alertBox('danger', '', 'Não foi possível atribuir. Nada foi enviado ao aluno.'); b.focus(); return; }
        var st = stu(), name = st.name;
        AuraUI.confirm({ title: 'Atribuir o treino a ' + name + '?', text: 'O aluno recebe uma cópia. Mudanças futuras no modelo não alteram a cópia. Você pode ajustar só o treino dele depois. O aluno é avisado do novo treino.', confirmLabel: 'Atribuir treino', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) { G5.flash('Treino atribuído a ' + name + '. Demonstração, nada foi gravado.', 'success'); location.href = G6.url('treino-aluno-editor.html', 'aluno=' + st.id + '&id=a1'); } });
      });
      el.addEventListener('click', function (e) { var g = e.target.closest('[data-goto]'); if (g) { e.preventDefault(); var t = el.querySelector('#' + g.dataset.goto) || el.querySelector('input[name="stu"]:not(:disabled)'); if (t) t.focus(); } });
    } });
  };

  /* =============== TRN-23 treino do aluno =============== */
  T.treinoAluno = function () {
    var SV = { padrao: 's01', personalizado: 's02', 'com-sessoes-feitas': 's01', pausado: 's01', encerrado: 's02', 'fora-do-portao': 's04', 'menor-em-espera': 's20', 'vinculo-pausado': 's05' };
    var sid = G6.param('aluno') || SV[V] || 's01', st = S5.find(sid);
    G6.boot(V === 'sem-permissao' ? 'sem-permissao' : V === 'carregando' ? 'carregando' : V === 'erro' ? 'erro' : '', { rows: 5, skel: 'list', errText: 'Não foi possível carregar o treino.', render: function (el) {
      if (!st) { document.getElementById('bc').innerHTML = crumbs(['Treino do aluno']); document.getElementById('titulo').textContent = 'Treino do aluno'; el.innerHTML = '<div class="empty-state"><h2 class="h3">Não achamos este aluno</h2><a class="btn btn-primary" href="' + esc(G6.url('../alunos/meus-alunos.html')) + '">Voltar para Meus alunos</a></div>'; return; }
      var back = G6.url('../alunos/aluno-detalhe.html', 'id=' + st.id + '&aba=treinos');
      document.getElementById('bc').innerHTML = G6.crumbs([['Início', G6.home()], ['Alunos', G6.url('../alunos/meus-alunos.html')], [st.name, G6.url('../alunos/aluno-detalhe.html', 'id=' + st.id)], ['Treino']]);
      document.getElementById('titulo').textContent = 'Treino de ' + st.name;
      var g = S5.gate(st);
      /* fora do portao: so o cartao de privacidade; nenhuma estrutura, exercicio, contagem ou acao de escrita */
      if (!g.ok) { el.innerHTML = '<div class="stack">' + G5.privacidade() + G5.privCard(g) + '</div>'; return; }
      if (['s01', 's02'].indexOf(st.id) === -1) { el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">' + ico('dumbbell') + '</div><h2 class="h3">Este aluno ainda não tem treino atribuído.</h2><a class="btn btn-primary" href="' + esc(G6.url('atribuir.html', 'aluno=' + st.id)) + '">Atribuir treino</a></div>'; return; }
      var M = D.sample(), status = V === 'pausado' ? 'PAUSED' : V === 'encerrado' ? 'ENDED' : 'ACTIVE', custom = V === 'personalizado' || st.id === 's02', ro = status === 'ENDED', done = V === 'com-sessoes-feitas';
      M.version = 3; if (custom) M.sessions.splice(2, 1);
      if (done) { G6.allItems(M.sessions[0]).forEach(function (i, k) { if (k < 3) i.done = '2026-10-' + (8 + k * 2); }); G6.allItems(M.sessions[1]).slice(0, 1).forEach(function (i) { i.done = '2026-10-13'; }); }
      var dirty = false, problems = [], F = { start: '2026-09-01', end: '2026-11-30', days: { A: [1, 4], B: [2, 5], C: [] } };
      var origin = custom ? 'Personalizado' : 'Modelo Full body iniciante v3', offl = V === 'offline', conf = V === 'conflito', saving = V === 'salvando';
      var stBadge = { ACTIVE: ['success', 'check-circle', 'Ativo'], PAUSED: ['warning', 'clock', 'Pausado'], ENDED: ['neutral', 'ban', 'Encerrado'] }[status];
      var changes = D.studentChanges.filter(function (c) { return c.kind === 'ADJUST'; });
      el.innerHTML = '<div class="stack-lg">' + G5.privacidade() + alertBox('info', '', 'O aluno vê os ajustes que você salvar.') + (offl ? G6.offline() : '') + iaDraft() + (conf ? alertBox('warning', 'Conflito de edição', 'Este treino foi alterado em outro lugar. Recarregue. Nada foi sobrescrito.') : '') + '<div id="save-err" role="alert" tabindex="-1"></div>' +
        (ro ? alertBox('info', '', 'Este treino foi encerrado em ' + A.fmtDate('2026-10-10') + '. Só leitura.') : '') + (status === 'PAUSED' ? alertBox('warning', '', 'Treino pausado. O aluno não o vê agora.') : '') + '<div id="probs"></div>' +
        '<div class="g6-layout is-editor"><div class="stack-lg"><section class="card" aria-labelledby="t-cab"><div class="card-header"><h2 class="card-title" id="t-cab">Dados do treino</h2>' + badge(stBadge[0], stBadge[1], stBadge[2]) + '</div><div class="card-body stack"><p>Origem: <strong>' + esc(origin) + '</strong> · Ajustado em ' + A.fmtDate('2026-10-10') + '</p><div class="g6-gridfields"><div class="field"><label for="f-s">Início</label><input class="input" id="f-s" type="date" value="' + F.start + '"' + (ro ? ' disabled' : '') + '></div><div class="field"><label for="f-e">Fim</label><input class="input" id="f-e" type="date" value="' + F.end + '"' + (ro ? ' disabled' : '') + '></div></div>' + '<details class="g6-det"><summary>Dias da semana</summary><div class="stack">' + M.sessions.map(function (s) { return daysGroup(s.label, F.days[s.label] || [], 'Dias da sessão ' + s.label, ro); }).join('') + '</div></details></div></section><div id="ed"></div></div>' +
        '<aside class="g6-summary-wrap"><div class="g6-sticky stack"><div id="side">' + G6.summary(M, []) + '</div><section class="card" aria-labelledby="t-aj"><div class="card-header"><h2 class="card-title" id="t-aj">Origem e ajustes</h2></div><div class="card-body stack-sm"><p>' + esc(origin) + '</p><ul class="g4-list-plain">' + changes.map(function (c) { return '<li>' + G5.time(c.at) + ': ' + esc(c.summary) + '</li>'; }).join('') + '</ul><a href="' + esc(G6.url('historico-versoes.html', 'aluno=' + st.id + '&id=a1')) + '">Ver histórico de ajustes</a> ' + selo('M4') + '</div></section></div></aside></div>' +
        '<div class="g6-savebar' + (ro ? '' : ' is-fixed') + '">' + (ro ? '' : '<button type="button" class="btn btn-primary" id="b-save"' + (offl || conf || saving ? ' disabled aria-describedby="why"' : '') + (saving ? ' aria-busy="true"' : '') + '>' + (saving ? 'Salvando…' : 'Salvar ajustes') + '</button>' + (status === 'PAUSED' ? '<button type="button" class="btn btn-secondary" id="b-resume">Retomar treino</button>' : '<button type="button" class="btn btn-secondary" id="b-pause"' + (offl ? ' disabled' : '') + '>Pausar treino</button>') + '<button type="button" class="btn btn-secondary" id="b-end"' + (offl ? ' disabled' : '') + '>Encerrar treino</button>' + '<button type="button" class="btn btn-neutral" disabled aria-disabled="true">Restaurar do modelo<span class="badge g5-soon">Em breve</span></button>' + selo('M4')) + '<a class="btn btn-secondary" href="' + esc(G6.url('../ia/painel-sugestoes.html', 'origem=treino&aluno=' + st.id)) + '">Sugerir com IA</a><a class="btn btn-text" href="' + esc(G6.url('historico-versoes.html', 'aluno=' + st.id + '&id=a1')) + '">Ver histórico</a><button type="button" class="btn btn-neutral" id="b-close">Fechar</button><span class="g5-hint" role="status" id="dirty"></span></div>' + (offl || conf ? '<p class="g5-hint" id="why">' + (offl ? 'Sem conexão: salvar fica desativado.' : 'Recarregue para continuar.') + '</p>' : '') + (conf ? '<div><button type="button" class="btn btn-secondary" id="b-reload">Recarregar</button></div>' : '') + '</div>';
      var h = G6.editor(el.querySelector('#ed'), M, { readonly: ro, health: true, onChange: function () { dirty = true; el.querySelector('#dirty').textContent = 'Alterações não salvas.'; el.querySelector('#side').innerHTML = G6.summary(M, problems); } });
      el.addEventListener('change', function (e) { var d = e.target.dataset.day; if (d) { var p = d.split(':'), a = F.days[p[0]] || (F.days[p[0]] = []), n = +p[1], i = a.indexOf(n); if (e.target.checked && i === -1) a.push(n); else if (i !== -1) a.splice(i, 1); dirty = true; el.querySelector('#dirty').textContent = 'Alterações não salvas.'; } else if (e.target.id === 'f-s' || e.target.id === 'f-e') { dirty = true; el.querySelector('#dirty').textContent = 'Alterações não salvas.'; } });
      el.addEventListener('click', function (e) {
        var gl = e.target.closest('[data-goto]'); if (gl) { e.preventDefault(); var tg = el.querySelector('#' + gl.dataset.goto); if (tg) tg.focus(); return; }
        if (e.target.closest('#b-save')) {
          problems = G6.validate(M).filter(function (p) { return p.target !== 'ed-name'; }); el.querySelector('#probs').innerHTML = G6.problemList(problems); el.querySelector('#side').innerHTML = G6.summary(M, problems);
          if (problems.length) { el.querySelector('#g6-problems').focus(); return; }
          if (V === 'erro-salvar') { var b = el.querySelector('#save-err'); b.innerHTML = alertBox('danger', '', 'Não foi possível salvar. Nada foi alterado.'); b.focus(); return; }
          function ok() { dirty = false; el.querySelector('#dirty').textContent = ''; G5.flash('Ajustes salvos. Demonstração, nada foi gravado.', 'success'); location.href = back; }
          if (done) AuraUI.confirm({ title: 'Salvar os ajustes?', text: 'Há sessões já feitas neste treino. Os registros delas continuam como foram; mudanças valem para as próximas.', confirmLabel: 'Salvar ajustes', cancelLabel: 'Cancelar' }).then(function (r) { if (r) ok(); }); else ok();
        } else if (e.target.closest('#b-pause')) AuraUI.confirm({ title: 'Pausar o treino de ' + st.name + '?', text: 'O aluno deixa de ver este treino hoje e você pode retomar.', confirmLabel: 'Pausar treino', cancelLabel: 'Cancelar' }).then(function (r) { if (r) AuraUI.toast('Treino pausado. Demonstração, nada foi gravado.', { tone: 'info' }); });
        else if (e.target.closest('#b-resume')) AuraUI.confirm({ title: 'Retomar o treino?', text: 'O aluno volta a ver este treino.', confirmLabel: 'Retomar treino', cancelLabel: 'Cancelar' }).then(function (r) { if (r) AuraUI.toast('Treino retomado. Demonstração.', { tone: 'success' }); });
        else if (e.target.closest('#b-end')) AuraUI.confirm({ title: 'Encerrar o treino de ' + st.name + '?', text: 'O treino fica no histórico. O aluno deixa de recebê-lo.', confirmLabel: 'Encerrar treino', cancelLabel: 'Cancelar', danger: true }).then(function (r) { if (r) AuraUI.toast('Treino encerrado. Demonstração, nada foi gravado.', { tone: 'warning' }); });
        else if (e.target.closest('#b-close')) G6.guard(function () { return dirty; }, back)();
        else if (e.target.closest('#b-reload')) reload();
      });
      window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
    } });
  };

  /* =============== TRN-24 historico =============== */
  T.historico = function () {
    var aluno = G6.param('aluno') || (V === 'treino-aluno' || V === 'sem-historico' ? 's01' : V === 'fora-do-portao' ? 's04' : null), mode = aluno ? 'aluno' : 'modelo';
    var mid = G6.param('modelo') || 'p01', prog = D.prFind(mid) || D.prFind('p01'), st = aluno ? S5.find(aluno) : null;
    document.getElementById('bc').innerHTML = mode === 'modelo' ? crumbs([prog.name, 'Histórico']) : G6.crumbs([['Início', G6.home()], ['Alunos', G6.url('../alunos/meus-alunos.html')], [st && V !== 'sem-permissao' ? st.name : 'Aluno', G6.url('../alunos/aluno-detalhe.html', 'id=' + aluno)], ['Histórico do treino']]);
    document.getElementById('sub').textContent = mode === 'modelo' ? prog.name : (st && V !== 'sem-permissao' ? 'Treino de ' + st.name : '');
    G6.boot(V, { rows: 4, skel: 'list', errText: 'Não foi possível carregar o histórico.', render: function (el) {
      var intro = alertBox('info', '', 'Treinos já atribuídos são cópias. Publicar uma versão nova não os altera.') + (V === 'offline' ? G6.offline() : '');
      if (mode === 'aluno') {
        if (!st) { el.innerHTML = '<div class="empty-state"><h2 class="h3">Não achamos este aluno</h2></div>'; return; }
        var g = S5.gate(st); if (!g.ok) { el.innerHTML = '<div class="stack">' + G5.privacidade() + G5.privCard(g) + '</div>'; return; }
        var ch = V === 'sem-historico' ? [] : D.studentChanges, kind = { ASSIGNED: 'Atribuído', ADJUST: 'Ajuste', PAUSED: 'Pausado', RESUMED: 'Retomado', ENDED: 'Encerrado' };
        el.innerHTML = '<div class="stack-lg">' + intro + '<h2 class="h3">Ajustes e eventos do treino ' + selo('M4') + '</h2>' + (ch.length ? '<ol class="g6-timeline">' + ch.map(function (c) { return '<li><div class="row"><time datetime="' + c.at + '">' + A.fmtDate(c.at) + '</time>' + badge('neutral', 'clock', kind[c.kind]) + '</div><p>' + esc(c.summary) + '</p><p class="muted">Por ' + esc(c.by) + '</p></li>'; }).join('') + '</ol>' : '<div class="empty-state"><div class="empty-state-icon">' + ico('clock') + '</div><h3 class="h3">Ainda não há ajustes neste treino.</h3></div>') + '<a class="btn btn-secondary" href="' + esc(G6.url('treino-aluno-editor.html', 'aluno=' + aluno + '&id=a1')) + '">Voltar ao treino</a></div>';
        return;
      }
      var vers = V === 'so-uma-versao' ? [{ version: 1, publishedAt: '2026-06-20', by: 'Carla Mendes', summary: 'Primeira versão do modelo.', status: 'CURRENT', changes: [] }] : D.versions, cmp = V === 'comparando' ? 3 : null, tab = 'v';
      var inGate = ['s01', 's02', 's03'].map(function (i) { return S5.find(i); }).filter(function (s) { return s && S5.gate(s).ok; });
      function cmpHtml(n) {
        var v = vers.filter(function (x) { return x.version === n; })[0]; if (!v) return '';
        var lab = { ADDED: ['+', 'Adicionado', 'plus', 'success'], REMOVED: ['−', 'Removido', 'x', 'danger'], CHANGED: ['~', 'Alterado', 'edit', 'warning'] };
        return '<section class="card" aria-labelledby="t-cmp" id="cmp" tabindex="-1"><div class="card-header"><h3 class="card-title" id="t-cmp">Comparação: v' + n + ' e a versão atual</h3></div><div class="card-body"><ul class="g6-diff">' + v.changes.map(function (c) { var l = lab[c.kind]; return '<li>' + badge(l[3], l[2], l[1]) + '<span><strong>' + esc(c.path) + '</strong>' + (c.before ? ': antes “' + esc(c.before) + '”' : '') + (c.after ? ', depois “' + esc(c.after) + '”' : '') + '</span></li>'; }).join('') + '</ul></div></section>';
      }
      function list() {
        return '<ol class="g6-timeline">' + vers.map(function (v) {
          return '<li><div class="row-between"><div class="row"><strong>v' + v.version + (v.status === 'CURRENT' ? ' (atual)' : '') + '</strong><time datetime="' + v.publishedAt + '">' + A.fmtDate(v.publishedAt) + '</time>' + badge(v.status === 'CURRENT' ? 'success' : 'neutral', v.status === 'CURRENT' ? 'check-circle' : 'clock', v.status === 'CURRENT' ? 'Atual' : 'Anterior') + '</div></div><p>' + esc(v.summary) + '</p><p class="muted">Publicada por ' + esc(v.by) + '</p>' +
            '<div class="g6-rowbtns">' + (v.status === 'CURRENT' ? '' : '<button type="button" class="btn btn-secondary" data-cmp="' + v.version + '">Comparar v' + v.version + ' com a versão atual</button><button type="button" class="btn btn-text" data-see="' + v.version + '">Ver v' + v.version + '</button><button type="button" class="btn btn-text" data-dup="' + v.version + '">Duplicar v' + v.version + ' como rascunho</button>') + '</div></li>';
        }).join('') + '</ol>';
      }
      function assigns() {
        return '<ul class="g6-timeline">' + inGate.map(function (s, i) { return '<li><strong>' + esc(s.name) + '</strong><span class="muted">Atribuído em ' + A.fmtDate(i ? '2026-09-0' + (i + 1) : '2026-09-01') + ', versão v3</span></li>'; }).join('') + '</ul>';
      }
      function draw() {
        el.innerHTML = '<div class="stack-lg">' + intro + '<div class="row"><h2 class="h3">Versões do modelo</h2>' + selo('M3') + '</div>' +
          (vers.length === 1 ? '<div class="empty-state"><div class="empty-state-icon">' + ico('clock') + '</div><h3 class="h3">Este modelo ainda está na v1.</h3><p>Quando você publicar mudanças, as versões anteriores aparecem aqui.</p><a class="btn btn-secondary" href="' + esc(G6.url('modelo-editor.html', 'id=' + prog.id)) + '">Abrir o modelo</a></div>' :
            '<div class="g5-tabs"><div class="tabs" role="tablist" aria-label="Histórico do modelo"><button type="button" class="tab" role="tab" id="tab-v" aria-controls="pn-v" aria-selected="' + (tab === 'v') + '" tabindex="' + (tab === 'v' ? 0 : -1) + '">Versões</button><button type="button" class="tab" role="tab" id="tab-a" aria-controls="pn-a" aria-selected="' + (tab === 'a') + '" tabindex="' + (tab === 'a' ? 0 : -1) + '">Atribuições feitas</button></div></div>' +
            '<div role="tabpanel" id="pn-v" aria-labelledby="tab-v" tabindex="0"' + (tab === 'v' ? '' : ' hidden') + '><div class="g6-split"><div>' + list() + '</div><div id="cmp-host">' + (cmp ? cmpHtml(cmp) : '<p class="muted">Escolha uma versão anterior para comparar.</p>') + '</div></div></div><div role="tabpanel" id="pn-a" aria-labelledby="tab-a" tabindex="0"' + (tab === 'a' ? '' : ' hidden') + '>' + assigns() + '</div>') +
          '<a class="btn btn-secondary" href="' + esc(G6.url('modelo-editor.html', 'id=' + prog.id)) + '">Voltar ao modelo</a></div>';
      }
      draw();
      el.addEventListener('click', function (e) {
        var t = e.target.closest('[role="tab"]'); if (t) { tab = t.id === 'tab-a' ? 'a' : 'v'; draw(); el.querySelector('#' + t.id).focus(); return; }
        var c = e.target.closest('[data-cmp]'); if (c) { cmp = +c.dataset.cmp; el.querySelector('#cmp-host').innerHTML = cmpHtml(cmp); el.querySelector('#cmp').focus(); return; }
        var s = e.target.closest('[data-see]'); if (s) { AuraUI.toast('Demonstração: aqui abriria a v' + s.dataset.see + ' em leitura.', { tone: 'info' }); return; }
        var d = e.target.closest('[data-dup]'); if (d) AuraUI.confirm({ title: 'Criar um rascunho a partir da v' + d.dataset.dup + '?', text: 'A versão atual não muda.', confirmLabel: 'Criar rascunho', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) AuraUI.toast('Rascunho criado a partir da v' + d.dataset.dup + '. Demonstração, nada foi gravado.', { tone: 'success' }); });
      });
      el.addEventListener('keydown', function (e) { var t = e.target.closest('[role="tab"]'); if (t && ['ArrowRight', 'ArrowLeft'].indexOf(e.key) !== -1) { tab = tab === 'v' ? 'a' : 'v'; draw(); el.querySelector('#tab-' + tab).focus(); e.preventDefault(); } });
    } });
  };

  window.G6T = T;
})();
