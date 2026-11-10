/* g6-exercicios.js - telas TRN-10 a TRN-14 (lote B, Exercicios). Tudo [MOCK], sem gravacao real. Cada tela chama G6X.<nome>(). */
(function () {
  var G4 = window.G4, G5 = window.G5, G6 = window.G6, D = window.G6DATA, A = window.AURA, esc = G6.esc, ico = G6.ico, selo = G6.selo, badge = G6.badge, alertBox = G6.alertBox, V = G6.variant();
  var X = {};
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function crumbs(extra) { return G6.crumbs([['Início', G6.home()], ['Exercícios', G6.url('catalogo.html')]].concat((extra || []).map(function (x) { return typeof x === 'string' ? [x] : x; }))); }
  function opt(list, sel, all) { return (all ? '<option value="">' + all + '</option>' : '') + list.map(function (x) { return '<option value="' + x[0] + '"' + (sel === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join(''); }

  /* =============== TRN-10 catalogo =============== */
  X.catalogo = function () {
    var pick = V === 'modo-escolher', soSys = V === 'so-do-sistema', roOnly = V === 'so-leitura';
    var st = { tab: V === 'meus-vazio' ? 'meus' : V === 'compartilhados-vazio' ? 'compartilhados' : 'publicos', q: V === 'filtro-sem-resultado' ? 'zzxx' : '', mus: '', eq: '', pat: '', lvl: '', tag: '', vis: '', arch: false, sort: 'name', limit: 24 };
    var selected = [], ADDED = ['e01', 'e08'];
    function data() {
      return D.exercises.filter(function (e) {
        if (V === 'meus-vazio' || soSys || V === 'compartilhados-vazio') { if (e.origin === 'OWN' || e.origin === 'SHARED_WITH_ME') return false; }
        if (soSys && e.origin === 'PUBLIC_OTHER') return false;
        return true;
      });
    }
    function inTab(e, tab) { return tab === 'publicos' ? (e.origin === 'SYSTEM' || e.origin === 'PUBLIC_OTHER') : tab === 'meus' ? e.origin === 'OWN' : e.origin === 'SHARED_WITH_ME'; }
    function filtered(tab) {
      return data().filter(function (e) {
        if (!inTab(e, tab)) return false;
        if (st.q && norm(e.name).indexOf(norm(st.q)) === -1) return false;
        if (st.mus && e.primary.indexOf(st.mus) === -1 && e.secondary.indexOf(st.mus) === -1) return false;
        if (st.eq && e.equipment.indexOf(st.eq) === -1) return false;
        if (st.pat && e.pattern !== st.pat) return false;
        if (st.lvl && e.level !== st.lvl) return false;
        if (st.tag && e.tags.indexOf(st.tag) === -1) return false;
        if (tab === 'meus') { if (st.vis && e.visibility !== st.vis) return false; if (!st.arch && e.archivedAt) return false; }
        return true;
      }).sort(function (a, b) { return st.sort === 'name' ? a.name.localeCompare(b.name, 'pt-BR') : (b.createdAt || '').localeCompare(a.createdAt || ''); });
    }
    function tabCount(tab) { return data().filter(function (e) { return inTab(e, tab) && !(tab === 'meus' && e.archivedAt); }).length; }
    function activeFilters() { var a = []; if (st.mus) a.push(['mus', 'Músculo: ' + D.lab(D.MUS, st.mus)]); if (st.eq) a.push(['eq', 'Equipamento: ' + D.lab(D.EQ, st.eq)]); if (st.pat) a.push(['pat', 'Padrão: ' + D.lab(D.PAT, st.pat)]); if (st.lvl) a.push(['lvl', 'Nível: ' + D.LEVEL[st.lvl]]); if (st.tag) a.push(['tag', 'Tag: ' + st.tag]); if (st.vis) a.push(['vis', 'Visibilidade: ' + D.VIS[st.vis]]); if (st.q) a.push(['q', 'Busca: ' + st.q]); return a; }
    function filtersForm() {
      return '<form class="g6-filters" id="fil" role="search" aria-label="Filtros de exercícios" onsubmit="return false"><div class="field"><label for="f-q">Buscar exercício</label><input class="input" id="f-q" type="search" autocomplete="off" value="' + esc(st.q) + '"></div>' +
        '<div class="field"><label for="f-mus">Músculo</label><div class="select-wrap"><select class="select" id="f-mus">' + opt(D.MUS, st.mus, 'Todos') + '</select></div></div>' +
        '<div class="field"><label for="f-eq">Equipamento</label><div class="select-wrap"><select class="select" id="f-eq">' + opt(D.EQ, st.eq, 'Todos') + '</select></div></div>' +
        '<div class="field"><label for="f-pat">Padrão de movimento</label><div class="select-wrap"><select class="select" id="f-pat">' + opt(D.PAT, st.pat, 'Todos') + '</select></div></div>' +
        '<div class="field"><label for="f-lvl">Nível</label><div class="select-wrap"><select class="select" id="f-lvl">' + opt([['BEGINNER', 'Iniciante'], ['INTERMEDIATE', 'Intermediário'], ['ADVANCED', 'Avançado']], st.lvl, 'Todos') + '</select></div></div>' +
        '<div class="field"><label for="f-tag">Tag</label><div class="select-wrap"><select class="select" id="f-tag"><option value="">Todas</option>' + D.TAGS.map(function (t) { return '<option' + (st.tag === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></div></div>' +
        (st.tab === 'meus' ? '<div class="field"><label for="f-vis">Visibilidade</label><div class="select-wrap"><select class="select" id="f-vis">' + opt([['PRIVATE', 'Privado'], ['SHARED', 'Compartilhado'], ['PUBLIC', 'Público']], st.vis, 'Todos') + '</select></div></div><label class="check"><input type="checkbox" id="f-arch"' + (st.arch ? ' checked' : '') + '><span class="check-text">Mostrar arquivados</span></label>' : '') + '</form>';
    }
    function results() {
      var list = filtered(st.tab), tot = list.length, shown = list.slice(0, st.limit), fl = activeFilters(), h = '';
      if (fl.length) h += '<div class="g6-chips" aria-label="Filtros ativos">' + fl.map(function (f) { return '<button type="button" class="chip" data-clear="' + f[0] + '">' + esc(f[1]) + ' ' + ico('x', 'icon-sm') + '<span class="sr-only">Remover filtro</span></button>'; }).join('') + '<button type="button" class="btn btn-text" data-clear="all">Limpar filtros</button></div>';
      h += '<div class="row-between"><p class="muted" role="status" aria-live="polite" id="cnt">' + G6.plural(tot, 'exercício encontrado', 'exercícios encontrados') + '</p><div class="field" style="flex-direction:row;align-items:center"><label for="f-sort">Ordenar por</label><div class="select-wrap"><select class="select" id="f-sort"><option value="name"' + (st.sort === 'name' ? ' selected' : '') + '>Nome</option><option value="new"' + (st.sort === 'new' ? ' selected' : '') + '>Mais recentes</option></select></div></div></div>';
      if (!tot) {
        if (st.q || fl.length) h += '<div class="empty-state" role="status"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Nenhum exercício encontrado' + (st.q ? ' para “' + esc(st.q) + '”' : '') + '.</h2><p>Tente outra palavra ou remova filtros.</p><button type="button" class="btn btn-secondary" data-clear="all">Limpar busca e filtros</button></div>';
        else if (st.tab === 'meus') h += '<div class="empty-state"><div class="empty-state-icon">' + ico('clipboard') + '</div><h2 class="h3">Você ainda não criou exercícios.</h2><p>Crie o seu, ou personalize um exercício do sistema.</p><div class="row"><a class="btn btn-primary" href="' + esc(G6.url('exercicio-form.html')) + '">Novo exercício</a><button type="button" class="btn btn-secondary" data-tab="publicos">Ver exercícios do sistema</button></div></div>';
        else h += '<div class="empty-state"><div class="empty-state-icon">' + ico('users') + '</div><h2 class="h3">Nenhum colega compartilhou exercícios com você.</h2><p>Quando alguém compartilhar, aparece aqui. ' + selo('X2') + '</p></div>';
      } else {
        h += '<div class="g6-grid is-side is-wide' + '">' + shown.map(function (e) { return G6.exCard(e, { pick: pick, added: ADDED.indexOf(e.id) !== -1, selected: selected.indexOf(e.id) !== -1 }); }).join('') + '</div>';
        if (tot > st.limit) h += '<div class="g5-more"><button type="button" class="btn btn-secondary" data-more-results>Carregar mais</button></div>';
      }
      if (pick) h += '<div class="g6-pickbar" role="region" aria-label="Seleção de exercícios"><span role="status" aria-live="polite">' + (selected.length ? G6.plural(selected.length, 'selecionado', 'selecionados') : 'Nenhum selecionado') + '</span><button type="button" class="btn btn-primary" data-pick-done' + (selected.length ? '' : ' disabled') + '>' + (selected.length > 1 ? 'Adicionar ' + selected.length : 'Adicionar') + '</button></div>';
      return h;
    }
    function page(el) {
      var tabs = [['publicos', 'Públicos'], ['meus', 'Meus'], ['compartilhados', 'Compartilhados comigo']];
      el.innerHTML = (V === 'offline' ? G6.offline() : '') + (pick ? G6.alertBox('info', 'Modo escolher', 'Você está escolhendo exercícios para uma sessão. Os que já estão nela aparecem como adicionados.') : '') + (roOnly ? '<p class="g5-hint">Seu perfil só consulta exercícios.</p>' : '') +
        '<div class="g5-tabs"><div class="tabs" role="tablist" aria-label="Origem dos exercícios">' + tabs.map(function (t) { return '<button type="button" class="tab" role="tab" id="tab-' + t[0] + '" aria-controls="pn" aria-selected="' + (st.tab === t[0]) + '" tabindex="' + (st.tab === t[0] ? 0 : -1) + '">' + t[1] + ' (' + tabCount(t[0]) + ')' + (t[0] === 'compartilhados' ? ' ' + selo('X2') : '') + '</button>'; }).join('') + '</div></div>' +
        '<div class="g6-layout mt-4"><aside id="fil-slot" aria-label="Filtros"></aside><div id="pn" role="tabpanel" aria-labelledby="tab-' + st.tab + '" tabindex="0" class="stack"><div class="row"><button type="button" class="btn btn-secondary g6-filters-btn" id="b-fil" aria-haspopup="dialog">' + ico('filter') + 'Filtros (' + activeFilters().length + ')</button>' + (st.tab === 'publicos' && !soSys ? '<span class="g5-hint">Exercícios públicos de outros personais ' + selo('X1') + '</span>' : '') + '</div><div id="res" class="stack"></div></div></div>' +
        '<div class="modal-backdrop" id="mod-fil" hidden data-static><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mod-fil-t"><div class="modal-header"><h2 class="modal-title" id="mod-fil-t">Filtros</h2></div><div class="modal-body" id="mod-fil-b"></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-modal-close>Ver resultados</button></div></div></div>';
      wire(el);
    }
    function wire(el) {
      var mq = window.matchMedia('(min-width: 1280px)');
      function redraw(keepFocus) { var form = document.getElementById('fil'); el.querySelector('#res').innerHTML = results(); var b = el.querySelector('#b-fil'); if (b) b.lastChild.textContent = 'Filtros (' + activeFilters().length + ')'; if (!keepFocus) return; }
      function place() {
        var old = document.getElementById('fil'); var wrap = document.createElement('div'); wrap.innerHTML = filtersForm(); var f = wrap.firstChild;
        if (old && old.parentNode) old.parentNode.removeChild(old);
        (mq.matches ? el.querySelector('#fil-slot') : el.querySelector('#mod-fil-b')).appendChild(f);
        el.querySelector('#fil-slot').hidden = !mq.matches;
      }
      place(); redraw();
      if (mq.addEventListener) mq.addEventListener('change', place);
      el.addEventListener('input', function (e) { if (e.target.id === 'f-q') { st.q = e.target.value; redraw(); var b = el.querySelector('#b-fil'); } });
      el.addEventListener('change', function (e) {
        var id = e.target.id, m = { 'f-mus': 'mus', 'f-eq': 'eq', 'f-pat': 'pat', 'f-lvl': 'lvl', 'f-tag': 'tag', 'f-vis': 'vis', 'f-sort': 'sort' };
        if (m[id]) { st[m[id]] = e.target.value; if (id !== 'f-sort') { st.limit = 24; } redraw(); }
        else if (id === 'f-arch') { st.arch = e.target.checked; redraw(); }
      });
      el.addEventListener('click', function (e) {
        var t = e.target.closest('[role="tab"]');
        if (t) { st.tab = t.id.replace('tab-', ''); st.vis = ''; st.arch = false; st.limit = 24; page(el); el.querySelector('#' + t.id).focus(); return; }
        var c = e.target.closest('[data-clear]');
        if (c) { var k = c.dataset.clear; if (k === 'all') { st.q = st.mus = st.eq = st.pat = st.lvl = st.tag = st.vis = ''; } else st[k] = ''; place(); redraw(); var q = el.querySelector('#f-q'); if (q) q.value = st.q; return; }
        var tb = e.target.closest('[data-tab]'); if (tb) { st.tab = tb.dataset.tab; page(el); el.querySelector('#tab-' + st.tab).focus(); return; }
        if (e.target.closest('[data-more-results]')) { st.limit += 24; redraw(); return; }
        if (e.target.closest('#b-fil')) { AuraUI.openModal('mod-fil', e.target.closest('#b-fil')); return; }
        var p = e.target.closest('[data-pick]');
        if (p) { var id = p.dataset.pick, i = selected.indexOf(id); if (i === -1) selected.push(id); else selected.splice(i, 1); redraw(); var again = el.querySelector('[data-pick="' + id + '"]'); if (again) again.focus(); return; }
        if (e.target.closest('[data-pick-done]')) { AuraUI.toast('Demonstração: ' + G6.plural(selected.length, 'exercício seria adicionado', 'exercícios seriam adicionados') + ' à sessão. Nada foi gravado.', { tone: 'info' }); return; }
        var mb = e.target.closest('[data-more]'); if (mb) { openMenu(mb); }
      });
      el.addEventListener('keydown', function (e) {
        var t = e.target.closest('[role="tab"]'); if (!t || ['ArrowRight', 'ArrowLeft'].indexOf(e.key) === -1) return;
        var ids = ['publicos', 'meus', 'compartilhados'], i = ids.indexOf(st.tab); st.tab = ids[(i + (e.key === 'ArrowRight' ? 1 : 2)) % 3]; page(el); el.querySelector('#tab-' + st.tab).focus(); e.preventDefault();
      });
      function openMenu(btn) {
        var old = document.getElementById('g6-pop'); if (old) { old.remove(); if (old.dataset.for === btn.dataset.more) { btn.setAttribute('aria-expanded', 'false'); return; } }
        var e = D.exFind(btn.dataset.more), own = e.origin === 'OWN', items = [['Abrir', G6.url('exercicio-detalhe.html', 'id=' + e.id)]];
        if (own && !e.archivedAt) { items.push(['Editar', G6.url('exercicio-form.html', 'id=' + e.id)], ['Visibilidade', G6.url('exercicio-visibilidade.html', 'id=' + e.id)]); } else if (!own) items.push(['Personalizar uma cópia', G6.url('exercicio-personalizar.html', 'id=' + e.id)]);
        var pop = document.createElement('div'); pop.id = 'g6-pop'; pop.dataset.for = e.id; pop.className = 'g6-menu-pop'; pop.setAttribute('role', 'menu');
        pop.innerHTML = items.map(function (i) { return '<a role="menuitem" href="' + esc(i[1]) + '">' + i[0] + '</a>'; }).join('') + (own && !e.archivedAt ? '<button type="button" role="menuitem" data-arch="' + e.id + '">Arquivar</button>' : '');
        var r = btn.getBoundingClientRect(); document.body.appendChild(pop); pop.style.top = (window.scrollY + r.bottom + 4) + 'px'; pop.style.left = Math.max(8, Math.min(window.scrollX + r.right - 220, window.innerWidth - 232)) + 'px';
        btn.setAttribute('aria-expanded', 'true'); pop.querySelector('a,button').focus();
        function close() { pop.remove(); btn.setAttribute('aria-expanded', 'false'); document.removeEventListener('keydown', onk); document.removeEventListener('mousedown', onm); }
        function onk(ev) { if (ev.key === 'Escape') { close(); btn.focus(); } }
        function onm(ev) { if (!pop.contains(ev.target) && ev.target !== btn) close(); }
        document.addEventListener('keydown', onk); document.addEventListener('mousedown', onm);
        var ar = pop.querySelector('[data-arch]');
        if (ar) ar.addEventListener('click', function () { close(); AuraUI.confirm({ title: 'Arquivar ' + e.name + '?', text: 'Ele deixa de aparecer nas buscas. Modelos e treinos que já o usam continuam funcionando. Você pode restaurar depois.', confirmLabel: 'Arquivar', cancelLabel: 'Manter' }).then(function (ok) { if (ok) { e.archivedAt = A.today; redraw(); AuraUI.toast('Exercício arquivado.', { tone: 'info' }); } }); });
      }
    }
    G6.boot(V, { rows: 12, render: page, errText: 'Não foi possível carregar os exercícios.' });
    if (V === 'erro') { /* cache visivel com aviso: tratado pelo boot (tela de erro com tentar de novo) */ }
  };

  /* =============== TRN-11 detalhe =============== */
  var DET_MAP = { 'do-sistema': 'e01', 'meu-privado': 'm01', 'meu-compartilhado': 'm03', 'meu-publico': 'm04', 'copia-de-global': 'm05', 'de-colega': 'c01', arquivado: 'm06', 'midia-processando': 'm01', 'midia-falhou': 'm01', 'sem-midia': 'm02', 'sem-permissao': 'm01' };
  X.detalhe = function () {
    var id = G6.param('id') || DET_MAP[V] || 'e01', raw = D.exFind(id);
    G6.boot(V === 'nao-encontrado' || !raw ? '' : V, {
      rows: 5, skel: 'list', errText: 'Não foi possível carregar o exercício.',
      render: function (el) {
        if (V === 'nao-encontrado' || !raw) { document.getElementById('bc').innerHTML = crumbs(['Exercício']); el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Exercício não encontrado ou sem acesso.</h2><p>Confira o endereço ou volte ao catálogo.</p><a class="btn btn-primary" href="' + esc(G6.url('catalogo.html')) + '">Voltar para Exercícios</a></div>'; return; }
        var e = D.exDetail(raw), own = e.origin === 'OWN', sys = e.origin === 'SYSTEM', arch = !!e.archivedAt;
        if (V === 'midia-processando') e.media[0].refState = 'PENDING'; if (V === 'midia-falhou') e.media[0].refState = 'FAILED'; if (V === 'sem-midia') e.media = [];
        if (V === 'meu-publico') e.reviewState = 'NONE';
        document.getElementById('bc').innerHTML = crumbs([e.name]); document.getElementById('titulo').textContent = e.name;
        var acts = '';
        if (own && !arch) acts += '<a class="btn btn-primary" href="' + esc(G6.url('exercicio-form.html', 'id=' + e.id)) + '">' + ico('edit') + 'Editar</a><a class="btn btn-secondary" href="' + esc(G6.url('exercicio-visibilidade.html', 'id=' + e.id)) + '">Visibilidade</a>';
        if (!own) acts += '<a class="btn btn-primary" href="' + esc(G6.url('exercicio-personalizar.html', 'id=' + e.id)) + '">Personalizar uma cópia</a>';
        if (!arch) acts += '<a class="btn btn-secondary" href="' + esc(G6.url('../treinos/biblioteca.html')) + '">Adicionar a um modelo</a>';
        if (own && !arch) acts += '<button type="button" class="btn btn-secondary" id="b-arq">Arquivar</button>';
        if (own && arch) acts += '<button type="button" class="btn btn-primary" id="b-rest">Restaurar</button>';
        var notes = '';
        if (sys) notes += alertBox('info', '', 'Este exercício é mantido pelo aura e não pode ser alterado por você.');
        if (e.origin === 'SHARED_WITH_ME') notes += alertBox('info', '', 'Compartilhado por ' + esc(e.owner) + '. Pode deixar de estar disponível se ele retirar o compartilhamento. ' + selo('X2'));
        if (e.origin === 'PUBLIC_OTHER') notes += alertBox('info', '', 'Exercício público de ' + esc(e.owner) + '. ' + selo('X1'));
        if (arch) notes += alertBox('info', '', 'Arquivado em ' + A.fmtDate(e.archivedAt) + '. Continua nos modelos e no histórico dos alunos, mas não aparece para novas escolhas.');
        var origin = e.originId ? '<p>Cópia de <a href="' + esc(G6.url('exercicio-detalhe.html', 'id=' + e.originId)) + '">' + esc(e.originName) + '</a> (do sistema).</p>' : (V === 'origem-indisponivel' ? '<p class="muted">Original indisponível.</p>' : '');
        function mediaRow(m) {
          var s = { PENDING: ['info', 'clock', 'Processando o arquivo…'], READY: ['success', 'check-circle', 'Pronto'], FAILED: ['danger', 'alert', 'Não foi possível processar. Envie outro arquivo.'], PURGED: ['neutral', 'ban', 'Mídia removida'] }[m.refState];
          return '<li class="g6-media-row"><div class="grow"><strong>' + esc(m.title) + '</strong> <span class="muted">(' + (m.role === 'DEMO_VIDEO' ? 'vídeo, ' + m.durationSec + ' s' : 'imagem') + ')</span><p class="muted">' + esc(m.alt) + '</p></div>' + badge(s[0], s[1], s[2]) + (m.refState === 'FAILED' && own ? '<a class="btn btn-secondary" href="' + esc(G6.url('exercicio-form.html', 'id=' + e.id)) + '">Enviar outro arquivo</a>' : '') + '</li>';
        }
        var video = e.media.filter(function (m) { return m.role === 'DEMO_VIDEO'; })[0];
        var vbox = video ? '<div class="g6-video" role="img" aria-label="Pré-visualização do vídeo de demonstração (exemplo, sem arquivo real)">' + ico(video.refState === 'READY' ? 'dumbbell' : video.refState === 'FAILED' ? 'alert' : 'clock') + '<strong>' + (video.refState === 'READY' ? 'Vídeo de demonstração (exemplo)' : video.refState === 'PENDING' ? 'Processando o arquivo…' : 'Mídia indisponível') + '</strong><span class="muted">Controles nativos, sem reprodução automática. [MOCK] sem arquivo real.</span></div>' : '';
        var media = e.media.length ? vbox + '<ul class="g6-vlist mt-4">' + e.media.map(mediaRow).join('') + '</ul>' : '<div class="empty-state"><div class="empty-state-icon">' + ico('upload') + '</div><h3 class="h3">Este exercício ainda não tem vídeo ou imagem.</h3>' + (own ? '<a class="btn btn-secondary" href="' + esc(G6.url('exercicio-form.html', 'id=' + e.id)) + '">Adicionar mídia</a>' : '') + '</div>';
        el.innerHTML = (V === 'offline' ? G6.offline() : '') + '<div class="stack-lg">' + notes + '<div class="g6-chips">' + G6.originBadge(e) + G6.visBadge(e) + '<span class="badge">' + esc(G6.levelText(e.level)) + '</span>' + (arch ? badge('neutral', 'ban', 'Arquivado') : '') + '</div><div class="row g6-actions">' + acts + '</div>' +
          '<div class="g6-detail"><section aria-labelledby="t-med"><h2 class="h3" id="t-med">Mídia</h2>' + media + '</section><div class="stack">' +
          '<section class="card" aria-labelledby="t-fic"><div class="card-header"><h2 class="card-title" id="t-fic">Ficha</h2></div><div class="card-body stack-sm"><p><strong>Músculos principais:</strong> ' + esc(G6.names(e.primary, D.MUS)) + '</p><p><strong>Secundários:</strong> ' + esc(G6.names(e.secondary, D.MUS) || 'Nenhum') + '</p><p><strong>Equipamentos:</strong> ' + esc(G6.names(e.equipment, D.EQ) || 'Nenhum') + '</p><p><strong>Padrão de movimento:</strong> ' + esc(D.lab(D.PAT, e.pattern)) + '</p><div class="g6-chips">' + e.tags.map(function (t) { return '<span class="badge">' + esc(t) + '</span>'; }).join('') + '</div>' + origin + '<p class="muted">Criado por ' + esc(e.createdByName) + ' em ' + A.fmtDate(e.createdAt) + '.</p></div></section></div>' +
          '<section class="g6-full stack" aria-labelledby="t-ins"><h2 class="h3" id="t-ins">Instruções</h2><ol>' + e.instructions.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol><h2 class="h3">Erros comuns</h2><ul class="g4-list-plain">' + e.commonMistakes.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>' +
          '<section class="g6-full stack" aria-labelledby="t-var"><h2 class="h3" id="t-var">Variações e substituições</h2>' + (e.relations.length ? '<ul class="g4-list-plain">' + e.relations.map(function (r) { return '<li>' + (r.kind === 'VARIATION' ? 'Variação' : 'Substituto') + ': <a href="' + esc(G6.url('exercicio-detalhe.html', 'id=' + r.relatedId)) + '">' + esc(r.relatedName) + '</a></li>'; }).join('') + '</ul>' : '<p class="muted">Nenhuma variação cadastrada.</p>') + '</section>' +
          (e.origin !== 'SHARED_WITH_ME' && e.origin !== 'PUBLIC_OTHER' ? '<section class="g6-full stack" aria-labelledby="t-uso"><h2 class="h3" id="t-uso">Onde é usado</h2><p>Usado em ' + e.usedInModels.length + ' dos seus modelos.</p><ul class="g4-list-plain">' + e.usedInModels.map(function (m) { return '<li><a href="' + esc(G6.url('../treinos/modelo-editor.html', 'id=' + m.id)) + '">' + esc(m.name) + '</a></li>'; }).join('') + '</ul></section>' : '') + '</div></div>';
        var ab = el.querySelector('#b-arq');
        if (ab) ab.addEventListener('click', function () { AuraUI.confirm({ title: 'Arquivar ' + e.name + '?', text: 'Ele deixa de aparecer nas buscas. Modelos e treinos que já o usam continuam funcionando. Você pode restaurar depois.', confirmLabel: 'Arquivar', cancelLabel: 'Manter' }).then(function (ok) { if (ok) AuraUI.toast('Exercício arquivado. Demonstração, nada foi gravado.', { tone: 'info' }); }); });
        var rb = el.querySelector('#b-rest');
        if (rb) rb.addEventListener('click', function () { AuraUI.confirm({ title: 'Restaurar ' + e.name + '?', text: 'Ele volta a aparecer nas buscas.', confirmLabel: 'Restaurar', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) AuraUI.toast('Exercício restaurado. Demonstração, nada foi gravado.', { tone: 'success' }); }); });
      }
    });
  };

  /* =============== TRN-12 formulario (tambem usado por TRN-13 etapa 2) =============== */
  X.renderForm = function (el, o) {
    o = o || {}; var Vv = o.variant || V, src = o.source || null, editing = !!(o.id || src), ex = o.id ? D.exFind(o.id) : src;
    var F = {
      name: ex ? ex.name : '', level: ex ? ex.level : '', pattern: ex ? ex.pattern : '', primary: ex ? ex.primary.slice() : [], secondary: ex ? ex.secondary.slice() : [], equipment: ex ? ex.equipment.slice() : [], tags: ex ? ex.tags.slice() : [],
      instructions: ex ? '[MOCK] Descreva só a execução.' : '', mistakes: '', rel: [], media: [], vis: 'PRIVATE'
    };
    if (Vv === 'erro-validacao') { F.name = ''; F.primary = []; }
    if (Vv === 'novo') { F.name = ''; }
    function M(state, extra) { var m = { id: 'm' + Math.floor(Math.random() * 1e5), kind: 'IMAGE', title: 'Posição inicial', alt: '[MOCK] Ilustração da posição inicial.', state: state, confirmed: false, pct: 0, msg: '' }; for (var k in extra) m[k] = extra[k]; return m; }
    if (Vv === 'upload-enviando') F.media.push(M('uploading', { kind: 'DEMO_VIDEO', title: 'Demonstração', alt: '[MOCK] Vídeo de demonstração.', confirmed: true, pct: 42 }));
    if (Vv === 'upload-processando') F.media.push(M('processing', { kind: 'DEMO_VIDEO', title: 'Demonstração', alt: '[MOCK] Vídeo de demonstração.', confirmed: true }));
    if (Vv === 'upload-falhou') F.media.push(M('failed', { kind: 'DEMO_VIDEO', title: 'Demonstração', alt: '[MOCK] Vídeo de demonstração.', confirmed: true }));
    if (Vv === 'upload-arquivo-invalido') F.media.push(M('invalid', { title: '', alt: '', msg: 'Formato não aceito. Use MP4 ou WebM para vídeo; JPG, PNG ou WebP para imagem.' }));
    if (Vv === 'upload-grande') F.media.push(M('invalid', { kind: 'DEMO_VIDEO', title: '', alt: '', msg: 'Este arquivo é grande demais (máx. [MOCK] 100 MB).' }));
    if (Vv === 'sem-confirmacao-pessoal') F.media.push(M('waiting', { title: 'Posição inicial', alt: '[MOCK] Ilustração.', confirmed: false }));
    if (ex && ex.mediaCount && editing && !F.media.length) F.media.push(M('ready', { kind: 'IMAGE', confirmed: true }));
    var draft = null, dirty = false, saving = Vv === 'salvando', errors = [], mq = 0;
    var back = o.id ? G6.url('exercicio-detalhe.html', 'id=' + o.id) : G6.url('catalogo.html');
    var offl = Vv === 'offline', used = ex && (ex.origin === 'OWN') ? 3 : 0;
    function chk(name, list, sel) { return '<div class="g6-checks">' + list.map(function (x) { return '<label class="check"><input type="checkbox" name="' + name + '" value="' + x[0] + '"' + (sel.indexOf(x[0]) !== -1 ? ' checked' : '') + '><span class="check-text">' + x[1] + '</span></label>'; }).join('') + '</div>'; }
    function mediaCard(m, i) {
      var st = { waiting: 'Aguardando', uploading: 'Enviando', processing: 'Processando', ready: 'Pronto', failed: 'Falhou', invalid: 'Arquivo recusado' }[m.state];
      var canSave = m.state === 'waiting', can = m.confirmed && m.alt.trim() && m.title.trim();
      var body = '<div class="row-between"><strong>' + esc(m.title || 'Nova mídia') + '</strong>' + badge(m.state === 'ready' ? 'success' : m.state === 'failed' || m.state === 'invalid' ? 'danger' : 'info', m.state === 'ready' ? 'check-circle' : m.state === 'failed' || m.state === 'invalid' ? 'alert' : 'clock', st) + '</div>';
      if (m.state === 'invalid') body += '<div class="field-error" role="alert">' + ico('alert', 'icon-sm') + '<span>' + esc(m.msg) + '</span></div><div class="g6-rowbtns"><button type="button" class="btn btn-secondary" data-m="rm" data-i="' + i + '">Remover</button></div>';
      else if (m.state === 'uploading') body += '<div class="progress" role="progressbar" aria-label="Envio do arquivo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + m.pct + '"><div class="progress-bar" style="--value:' + m.pct + '%"></div></div><p>Enviando ' + m.pct + '%</p><button type="button" class="btn btn-secondary" data-m="cancel" data-i="' + i + '">Cancelar envio</button>';
      else if (m.state === 'processing') body += '<p role="status">Processando o arquivo…</p>';
      else if (m.state === 'failed') body += '<p>Não foi possível processar. Envie outro arquivo.</p><div class="g6-rowbtns"><button type="button" class="btn btn-secondary" data-m="retry" data-i="' + i + '">Tentar de novo</button><button type="button" class="btn btn-secondary" data-m="rm" data-i="' + i + '">Remover</button></div>';
      else {
        var dd = canSave ? '' : ' disabled';
        body += '<div class="field"><label for="mt-' + i + '">Título da mídia</label><input class="input" id="mt-' + i + '" value="' + esc(m.title) + '" data-mf="title" data-i="' + i + '"' + dd + '></div>' +
          '<div class="field"><label for="ma-' + i + '">Descrição da mídia (para quem não vê o vídeo) <span class="field-required">*</span></label><textarea class="textarea" id="ma-' + i + '" data-mf="alt" data-i="' + i + '"' + dd + '>' + esc(m.alt) + '</textarea></div>';
        if (canSave) body += '<label class="check"><input type="checkbox" data-mf="confirmed" data-i="' + i + '"' + (m.confirmed ? ' checked' : '') + '><span class="check-text">Confirmo que o arquivo não mostra rosto ou pessoa identificável, nome, documento, local reconhecível nem dado de saúde de alguém.</span></label><p class="g5-hint">Removemos dados de localização e câmera do arquivo. [MOCK] a confirmar com o aura-media.</p>' +
          '<div class="g6-rowbtns"><button type="button" class="btn btn-primary" data-m="save" data-i="' + i + '"' + (can ? '' : ' disabled aria-describedby="mw-' + i + '"') + '>Salvar mídia</button><button type="button" class="btn btn-secondary" data-m="rm" data-i="' + i + '">Remover</button></div>' + (can ? '' : '<p class="g5-hint" id="mw-' + i + '">Para salvar, marque a confirmação e preencha o título e a descrição.</p>');
        else body += '<div class="g6-rowbtns"><button type="button" class="btn btn-secondary" data-m="rm" data-i="' + i + '">Remover</button></div>';
      }
      return '<li class="g6-media-row" style="flex-direction:column;align-items:stretch">' + body + '</li>';
    }
    function html() {
      var pre = (Vv === 'sem-permissao') ? '' : '';
      var h = '<form class="g6-form" id="frm" novalidate onsubmit="return false">' + G6.liveBox() +
        (offl ? G6.offline() + alertBox('warning', '', 'Sem conexão. Não dá para salvar agora. Suas alterações continuam nesta tela enquanto ela estiver aberta.') : '') +
        (Vv === 'conflito' ? alertBox('warning', 'Conflito de edição', 'Este exercício foi alterado em outro lugar. Recarregue para ver a versão atual. Nada foi sobrescrito.') : '') +
        (Vv === 'erro-salvar' && o.failed ? alertBox('danger', '', 'Não foi possível salvar. Nada foi alterado.') : '') +
        (used ? alertBox('info', '', 'Este exercício é usado em ' + used + ' modelos seus. As mudanças valem para eles e para novos treinos; treinos já atribuídos não mudam.') : '') +
        (Vv === 'editar-copia-de-global' || o.copy ? alertBox('info', '', 'Esta é uma cópia sua de um exercício do sistema. O original não muda.') : '') +
        '<div id="errsum" class="g6-err-sum" tabindex="-1"></div>' +
        '<fieldset><legend>Dados básicos</legend><div class="field"><label for="f-name">Nome <span class="field-required">*</span></label><input class="input" id="f-name" maxlength="80" value="' + esc(F.name) + '" aria-describedby="f-name-h"><span class="field-help" id="f-name-h"><span id="cn">' + F.name.length + '</span> de 80 caracteres (mínimo 3).</span></div>' +
        '<div class="g6-gridfields"><div class="field"><label for="f-lvl">Nível</label><div class="select-wrap"><select class="select" id="f-lvl">' + opt([['BEGINNER', 'Iniciante'], ['INTERMEDIATE', 'Intermediário'], ['ADVANCED', 'Avançado']], F.level, 'Sem nível') + '</select></div></div>' +
        '<div class="field"><label for="f-pat">Padrão de movimento</label><div class="select-wrap"><select class="select" id="f-pat">' + opt(D.PAT, F.pattern, 'Escolher') + '</select></div></div></div>' +
        '<div class="field"><span class="field-label" id="tg-l">Tags</span><div role="group" aria-labelledby="tg-l">' + chk('tag', D.TAGS.map(function (t) { return [t, t]; }), F.tags) + '</div><span class="field-help">Tags novas: em breve. Use as tags existentes.</span></div></fieldset>' +
        '<fieldset id="fs-mus"><legend>Músculos e equipamentos</legend><div class="field"><span class="field-label" id="pm-l">Músculos principais <span class="field-required">*</span></span><div role="group" aria-labelledby="pm-l" id="g-pm">' + chk('primary', D.MUS, F.primary) + '</div></div><div class="field"><span class="field-label" id="sm-l">Músculos secundários</span><div role="group" aria-labelledby="sm-l">' + chk('secondary', D.MUS, F.secondary) + '</div></div><div class="field"><span class="field-label" id="eq-l">Equipamentos</span><div role="group" aria-labelledby="eq-l">' + chk('equipment', D.EQ, F.equipment) + '</div></div></fieldset>' +
        '<fieldset><legend>Instruções e erros comuns</legend><p class="g5-hint">Descreva só a execução do exercício. Não escreva informação de saúde de ninguém.</p><div class="field"><label for="f-ins">Instruções</label><textarea class="textarea" id="f-ins" maxlength="2000">' + esc(F.instructions) + '</textarea><span class="field-help"><span id="ci">' + F.instructions.length + '</span> de 2000 caracteres.</span></div><div class="field"><label for="f-mis">Erros comuns</label><textarea class="textarea" id="f-mis" maxlength="2000">' + esc(F.mistakes) + '</textarea></div></fieldset>' +
        '<fieldset><legend>Variações e substituições</legend><div class="g6-gridfields"><div class="field"><label for="f-rel">Buscar exercício do catálogo</label><input class="input" id="f-rel" type="search" autocomplete="off"></div><div class="field"><label for="f-rk">Tipo</label><div class="select-wrap"><select class="select" id="f-rk"><option>Variação</option><option>Substituto</option></select></div></div></div><p class="g5-hint">Nenhuma relação adicionada.</p></fieldset>' +
        '<fieldset><legend>Mídia</legend><p class="g5-hint">Até 1 vídeo de demonstração, 6 imagens e 1 poster. Vídeo: MP4 ou WebM, máx. [MOCK] 100 MB. Imagem: JPG, PNG ou WebP, máx. [MOCK] 10 MB. Não use mídia de aluno aqui.</p><ul class="g6-vlist" id="media-list">' + F.media.map(mediaCard).join('') + '</ul>' +
        '<div class="g6-gridfields"><div class="field"><label for="f-mk">Tipo da mídia</label><div class="select-wrap"><select class="select" id="f-mk"><option value="DEMO_VIDEO">Vídeo de demonstração</option><option value="IMAGE">Imagem</option><option value="POSTER">Poster</option></select></div></div><div class="field"><label for="f-file">Arquivo</label><input class="input" id="f-file" type="file" accept="video/mp4,video/webm,image/jpeg,image/png,image/webp"' + (offl ? ' disabled' : '') + '></div></div><div class="row"><button type="button" class="btn btn-neutral" disabled aria-disabled="true">Usar um quadro do vídeo<span class="badge g5-soon">Em breve</span></button></div></fieldset>' +
        '<fieldset><legend>Visibilidade inicial</legend><p><strong>Privado.</strong> Só você vê e usa. Para mudar quem vê, use “Visibilidade” depois de salvar.</p></fieldset>' +
        '<div class="g6-savebar is-fixed"><button type="button" class="btn btn-primary" id="b-save"' + (offl || Vv === 'conflito' ? ' disabled aria-describedby="why-save"' : '') + (saving ? ' aria-busy="true" disabled' : '') + '>' + (saving ? 'Salvando…' : o.saveLabel || 'Salvar exercício') + '</button><button type="button" class="btn btn-neutral" id="b-cancel">Cancelar</button>' + (offl ? '<span class="g5-hint" id="why-save">Sem conexão: salvar fica desativado.</span>' : Vv === 'conflito' ? '<span class="g5-hint" id="why-save">Recarregue para continuar.</span><button type="button" class="btn btn-secondary" id="b-reload">Recarregar</button>' : '') + '</div></form>';
      return h;
    }
    function collect() {
      F.name = el.querySelector('#f-name').value; F.level = el.querySelector('#f-lvl').value; F.pattern = el.querySelector('#f-pat').value; F.instructions = el.querySelector('#f-ins').value; F.mistakes = el.querySelector('#f-mis').value;
      ['tag:tags', 'primary:primary', 'secondary:secondary', 'equipment:equipment'].forEach(function (p) { var s = p.split(':'); F[s[1]] = Array.prototype.map.call(el.querySelectorAll('input[name="' + s[0] + '"]:checked'), function (i) { return i.value; }); });
    }
    function show() { el.innerHTML = html(); wire(); }
    function validate() {
      collect(); errors = [];
      var n = el.querySelector('#f-name'); AuraUI.clearError(n);
      if (F.name.trim().length < 3) { errors.push(['f-name', 'Informe o nome do exercício.']); AuraUI.setError(n, 'Informe o nome do exercício.'); }
      if (!F.primary.length) errors.push(['g-pm', 'Escolha ao menos um músculo principal.']);
      F.media.forEach(function (m, i) { if (m.state === 'waiting' && !m.alt.trim()) { errors.push(['ma-' + i, 'A descrição da mídia é obrigatória.']); } });
      var box = el.querySelector('#errsum');
      box.innerHTML = errors.length ? '<div class="alert alert-danger" role="alert">' + ico('alert') + '<div class="alert-body"><div class="alert-title">Corrija ' + G6.plural(errors.length, 'campo', 'campos') + ' antes de salvar</div><ul class="g4-list-plain">' + errors.map(function (e) { return '<li><a href="#' + e[0] + '" data-goto="' + e[0] + '">' + esc(e[1]) + '</a></li>'; }).join('') + '</ul></div></div>' : '';
      if (errors.length) { var t = el.querySelector('#' + errors[0][0]); if (t) { (t.focus ? t.focus() : 0); if (t.id === 'g-pm') { var c = t.querySelector('input'); if (c) c.focus(); } } }
      return !errors.length;
    }
    function simulate(i) {
      var m = F.media[i]; m.state = 'uploading'; m.pct = 0; show();
      (function tick() {
        var mm = F.media[i]; if (!mm || mm.state !== 'uploading') return; mm.pct = Math.min(100, mm.pct + 25);
        var bar = el.querySelectorAll('.progress')[0];
        if (mm.pct < 100) { show(); G6.live(el, 'Enviando ' + mm.pct + '%'); setTimeout(tick, 500); }
        else { mm.state = 'processing'; show(); G6.live(el, 'Envio concluído. Processando o arquivo.'); setTimeout(function () { if (F.media[i] && F.media[i].state === 'processing') { F.media[i].state = 'ready'; show(); G6.live(el, 'Mídia pronta.'); } }, 900); }
      })();
    }
    function wire() {
      el.querySelector('#f-name').addEventListener('input', function (e) { el.querySelector('#cn').textContent = e.target.value.length; dirty = true; saveDraft(); });
      el.querySelector('#f-ins').addEventListener('input', function (e) { el.querySelector('#ci').textContent = e.target.value.length; dirty = true; saveDraft(); });
      el.addEventListener('change', function (e) { dirty = true; });
      el.querySelector('#b-cancel').addEventListener('click', G6.guard(function () { return dirty; }, back));
      var rl = el.querySelector('#b-reload'); if (rl) rl.addEventListener('click', function () { location.href = location.pathname + '?' + location.search.replace(/^\?/, '').split('&').filter(function (p) { return p.indexOf('variant=') !== 0; }).join('&'); });
      el.querySelector('#b-save').addEventListener('click', function () {
        if (!validate()) return;
        var same = !o.id && D.exercises.some(function (x) { return x.origin === 'OWN' && norm(x.name) === norm(F.name); });
        function go() {
          if (Vv === 'erro-salvar' && !o.failed) { o.failed = true; show(); el.querySelector('#frm').scrollIntoView(); el.querySelector('#b-save').focus(); return; }
          el.querySelector('#b-save').setAttribute('aria-busy', 'true'); el.querySelector('#b-save').disabled = true; el.querySelector('#b-save').textContent = 'Salvando…';
          try { localStorage.removeItem('g6-draft-ex'); } catch (x) {}
          G5.flash(o.doneMsg || 'Exercício salvo. Demonstração, nada foi gravado.', 'success'); location.href = o.doneHref || back;
        }
        if (same) AuraUI.confirm({ title: 'Nome já usado', text: 'Você já tem um exercício com este nome. Quer continuar?', confirmLabel: 'Continuar', cancelLabel: 'Revisar o nome' }).then(function (ok) { if (ok) go(); }); else go();
      });
      el.addEventListener('click', function (e) {
        var g = e.target.closest('[data-goto]'); if (g) { e.preventDefault(); var t = el.querySelector('#' + g.dataset.goto); if (t) { var f = t.querySelector && t.matches('div') ? t.querySelector('input') : t; f.focus(); } return; }
        var b = e.target.closest('[data-m]'); if (!b) return; var i = +b.dataset.i, m = F.media[i], act = b.dataset.m;
        if (act === 'save') simulate(i);
        else if (act === 'cancel') { m.state = 'waiting'; m.confirmed = false; show(); G6.live(el, 'Envio cancelado.'); }
        else if (act === 'retry') { m.state = 'waiting'; show(); }
        else if (act === 'rm') AuraUI.confirm({ title: 'Remover esta mídia?', text: 'Ela some do exercício.', confirmLabel: 'Remover', cancelLabel: 'Manter', danger: true }).then(function (ok) { if (ok) { F.media.splice(i, 1); show(); } });
      });
      el.addEventListener('input', function (e) { var d = e.target.dataset; if (d.mf && d.mf !== 'confirmed') { F.media[+d.i][d.mf] = e.target.value; var sb = el.querySelector('[data-m="save"][data-i="' + d.i + '"]'); refreshSave(+d.i); } });
      el.addEventListener('change', function (e) { var d = e.target.dataset; if (d.mf === 'confirmed') { F.media[+d.i].confirmed = e.target.checked; refreshSave(+d.i); } });
      var file = el.querySelector('#f-file');
      file.addEventListener('change', function () {
        var f = file.files[0]; if (!f) return; var kind = el.querySelector('#f-mk').value, vid = /^video\/(mp4|webm)$/.test(f.type), img = /^image\/(jpeg|png|webp)$/.test(f.type), big = f.size > (kind === 'DEMO_VIDEO' ? 100 : 10) * 1048576;
        var okType = kind === 'DEMO_VIDEO' ? vid : img;
        /* o nome original do arquivo nunca e exibido nem usado como titulo */
        F.media.push(!okType ? M('invalid', { kind: kind, title: '', alt: '', msg: 'Formato não aceito. Use MP4 ou WebM para vídeo; JPG, PNG ou WebP para imagem.' }) : big ? M('invalid', { kind: kind, title: '', alt: '', msg: 'Este arquivo é grande demais (máx. [MOCK] ' + (kind === 'DEMO_VIDEO' ? '100' : '10') + ' MB).' }) : M('waiting', { kind: kind, title: '', alt: '', confirmed: false }));
        file.value = ''; show(); dirty = true;
      });
      if (Vv === 'erro-validacao' && !o.shown) { o.shown = true; validate(); }
    }
    function refreshSave(i) { var m = F.media[i], b = el.querySelector('[data-m="save"][data-i="' + i + '"]'); if (!b) return; var can = m.confirmed && m.alt.trim() && m.title.trim(); b.disabled = !can; var w = el.querySelector('#mw-' + i); if (w) w.hidden = !!can; if (!can) b.setAttribute('aria-describedby', 'mw-' + i); else b.removeAttribute('aria-describedby'); }
    function saveDraft() { /* sem rascunho local: texto livre pode conter dado de saude */ }
    try { localStorage.removeItem('g6-draft-ex'); localStorage.removeItem('g6-draft-model'); } catch (x) {}
    show();
  };
  X.form = function () {
    var id = G6.param('id'), e = id ? D.exFind(id) : null, Vv = V;
    if (Vv === 'editar' && !id) id = 'm01';
    if (Vv === 'editar-copia-de-global' && !id) id = 'm05';
    var ex = id ? D.exFind(id) : null, editing = !!ex && (V !== 'novo');
    document.getElementById('bc').innerHTML = crumbs([editing ? ex.name : 'Novo exercício']);
    document.getElementById('titulo').textContent = editing ? 'Editar exercício' : 'Novo exercício';
    G6.boot(V === 'sem-permissao' || (ex && ex.origin !== 'OWN') ? 'sem-permissao' : '', { render: function () {} });
    if (V === 'sem-permissao' || (ex && ex.origin !== 'OWN')) return;
    G4.ready(function () {
      var el = document.getElementById('area');
      el.innerHTML = '<div class="g6-layout is-form"><div id="frm-host"></div><aside class="g6-preview-wrap" aria-label="Pré-visualização do cartão"><div class="g6-sticky"><h2 class="h4 mb-2">Pré-visualização do cartão</h2><div id="prev" class="g6-preview"></div></div></aside></div>';
      X.renderForm(el.querySelector('#frm-host'), { id: editing ? id : null, variant: V });
      var prev = D.exFind(editing ? id : 'm01') || D.exercises[0];
      el.querySelector('#prev').innerHTML = G6.exCard(prev, {});
    });
  };

  /* =============== TRN-13 personalizar =============== */
  X.personalizar = function () {
    var id = G6.param('id') || 'e01', src = D.exFind(id);
    document.getElementById('bc').innerHTML = crumbs([src ? src.name : 'Personalizar', 'Personalizar']);
    var step = V === 'etapa-2' || V === 'salvando' ? 2 : 1;
    G6.boot(V, {
      rows: 6, skel: 'list', errorInside: true,
      render: function (el) {
        function s1() {
          document.getElementById('titulo').textContent = 'Personalizar ' + src.name;
          var gone = V === 'origem-indisponivel', has = V === 'ja-tem-copia';
          el.innerHTML = '<div class="g5-panel stack-lg" style="max-width:640px"><span class="g6-steps">Passo 1 de 2</span>' +
            (gone ? alertBox('warning', '', 'Este exercício não está mais disponível para copiar.') + '<a class="btn btn-primary" href="' + esc(G6.url('catalogo.html')) + '">Voltar para Exercícios</a>' :
            (V === 'erro' ? alertBox('danger', '', 'Não foi possível criar a cópia. Nada foi alterado.') : '') +
            (has ? alertBox('info', '', 'Você já tem uma cópia deste exercício: <strong>Supino reto (cópia) [MOCK]</strong>.') + '<div class="row"><a class="btn btn-primary" href="' + esc(G6.url('exercicio-detalhe.html', 'id=m05')) + '">Abrir minha cópia</a><button type="button" class="btn btn-secondary" id="b-outra">Criar outra cópia</button></div>' : '') +
            '<section class="card"><div class="card-body stack"><h2 class="h3">O que vai acontecer</h2><ul class="g4-list-plain"><li>Criamos uma cópia só sua. O exercício original não muda.</li><li>O histórico dos seus alunos nesse exercício continua ligado, mesmo na cópia.</li><li>A cópia começa como Privada.</li><li>Você pode apagar a cópia depois; o original continua disponível.</li><li>A mídia do original é reaproveitada; você pode trocar por outra.</li></ul>' + (src.origin !== 'SYSTEM' ? '<p class="g5-hint">' + (src.origin === 'PUBLIC_OTHER' ? selo('X1') : selo('X2')) + '</p>' : '') + '</div></section>' +
            '<div class="row"><button type="button" class="btn btn-primary" id="b-cont"' + (V === 'erro' ? '' : '') + '>Continuar</button><button type="button" class="btn btn-secondary" id="b-canc">Cancelar</button></div>') + '</div>';
          var c = el.querySelector('#b-cont'), k = el.querySelector('#b-canc'), o2 = el.querySelector('#b-outra');
          if (c) c.addEventListener('click', function () { if (V === 'erro') { AuraUI.toast('Não foi possível criar a cópia. Nada foi alterado.', { tone: 'danger' }); return; } s2(); });
          if (k) k.addEventListener('click', function () { location.href = G6.url('exercicio-detalhe.html', 'id=' + id); });
          if (o2) o2.addEventListener('click', function () { AuraUI.confirm({ title: 'Criar outra cópia?', text: 'Você ficará com duas cópias deste exercício.', confirmLabel: 'Criar outra cópia', cancelLabel: 'Cancelar' }).then(function (ok) { if (ok) s2(); }); });
        }
        function s2() {
          document.getElementById('titulo').textContent = 'Personalizar ' + src.name; el.innerHTML = '<span class="g6-steps">Passo 2 de 2</span><div id="f2"></div>';
          el.querySelector('.g6-steps').setAttribute('tabindex', '-1'); document.getElementById('titulo').setAttribute('tabindex', '-1'); document.getElementById('titulo').focus();
          X.renderForm(el.querySelector('#f2'), { source: src, copy: true, saveLabel: 'Criar minha cópia', variant: V === 'salvando' ? 'salvando' : 'novo', doneMsg: 'Cópia criada. O original não mudou.', doneHref: G6.url('exercicio-detalhe.html', 'id=m05') });
        }
        if (!src) { el.innerHTML = '<div class="empty-state"><h2 class="h3">Exercício não encontrado ou sem acesso.</h2><a class="btn btn-primary" href="' + esc(G6.url('catalogo.html')) + '">Voltar para Exercícios</a></div>'; return; }
        if (step === 2) s2(); else s1();
      }
    });
  };

  /* =============== TRN-14 visibilidade =============== */
  X.visibilidade = function () {
    var VMAP = { privado: 'PRIVATE', compartilhado: 'SHARED', publico: 'PUBLIC', 'mudando-para-aberto': 'PRIVATE', 'mudando-para-fechado': 'SHARED', 'em-revisao': 'PRIVATE', recusado: 'PRIVATE' };
    var id = G6.param('id') || (V === 'compartilhado' || V === 'mudando-para-fechado' ? 'm03' : V === 'publico' ? 'm04' : 'm01'), ex = D.exFind(id);
    document.getElementById('bc').innerHTML = crumbs([ex ? ex.name : 'Visibilidade', 'Visibilidade']);
    document.getElementById('titulo').textContent = 'Visibilidade' + (ex ? ': ' + ex.name : '');
    G6.boot(V === 'sem-permissao' ? '' : V === 'carregando' ? 'carregando' : '', {
      rows: 4, skel: 'list',
      render: function (el) {
        if (!ex) { el.innerHTML = '<div class="empty-state"><h2 class="h3">Exercício não encontrado ou sem acesso.</h2><a class="btn btn-primary" href="' + esc(G6.url('catalogo.html')) + '">Voltar para Exercícios</a></div>'; return; }
        if (V === 'sem-permissao' || ex.origin !== 'OWN') { el.innerHTML = '<div class="g5-panel" style="max-width:560px">' + alertBox('info', '', ex.origin === 'SYSTEM' ? 'Exercícios do sistema não têm visibilidade alterável.' : 'Só quem criou o exercício altera quem pode vê-lo.') + '<a class="btn btn-secondary" href="' + esc(G6.url('exercicio-detalhe.html', 'id=' + id)) + '">Voltar ao exercício</a></div>'; return; }
        var cur = VMAP[V] || ex.visibility, pend = V === 'mudando-para-aberto' ? 'SHARED' : V === 'mudando-para-fechado' ? 'PRIVATE' : cur, offl = V === 'offline', noP = V === 'sem-personais-no-tenant', review = V === 'em-revisao', hasMedia = ex.mediaCount > 0;
        var RK = { PRIVATE: 0, SHARED: 1, PUBLIC: 2 }, personals = ['Rafael Antunes', 'Helena Duarte', 'Marcos Valle'], chosen = [], confirmed = false, saving = V === 'salvando';
        var opts = [['PRIVATE', 'Privado', 'Só você vê e usa.', selo('X3') + ' <span class="g5-hint">Restringe ao seu usuário, não ao tenant inteiro.</span>'], ['SHARED', 'Compartilhado', 'Outros personais que você escolher podem ver e usar. Eles não podem alterar o original.', selo('X2')], ['PUBLIC', 'Público', 'Todos os personais do aura podem ver e usar. Passa por revisão antes de aparecer para todos.', selo('X1')]];
        function why() { var open = RK[pend] > RK[cur]; return offl ? 'Sem conexão: as opções ficam desativadas.' : review ? '' : pend === cur ? 'Escolha uma opção diferente da atual para salvar.' : (pend === 'SHARED' && !chosen.length) ? 'Escolha pelo menos um personal para compartilhar.' : (open && hasMedia && !confirmed) ? 'Marque a confirmação sobre a mídia para salvar.' : ''; }
        function sync() { var b = el.querySelector('#b-save'); if (!b) return; var w = why(); b.disabled = !!(w || review || saving); el.querySelector('#why').textContent = w; }
        function html() {
          var open = RK[pend] > RK[cur];
          return '<div class="g5-panel stack-lg" style="max-width:560px;margin-inline:auto">' + G6.liveBox() + (offl ? G6.offline() : '') +
            (V === 'erro' ? alertBox('danger', '', 'Não foi possível alterar. A visibilidade continua ' + D.VIS[cur] + '.') : '') +
            (review ? alertBox('info', 'Em revisão', 'Enquanto está em revisão, só você vê. <button type="button" class="btn btn-secondary" id="b-cancpub">Cancelar publicação</button>') : '') +
            (V === 'recusado' ? alertBox('warning', 'Este exercício não foi publicado.', 'Motivo: [MOCK] conteúdo com informação pessoal. Ele continua Privado.') : '') +
            '<fieldset class="field" style="border:0;padding:0;margin:0"><legend class="field-label">Quem pode usar este exercício</legend>' + opts.map(function (r) {
              var dsb = offl || (r[0] === 'SHARED' && noP) || review; return '<label class="check" style="align-items:flex-start;padding-block:var(--space-2)"><input type="radio" name="vis" value="' + r[0] + '"' + (pend === r[0] ? ' checked' : '') + (dsb ? ' disabled' : '') + ' aria-describedby="vd-' + r[0] + '"><span class="check-text"><strong>' + r[1] + '</strong>' + (cur === r[0] ? ' ' + badge('success', 'check', 'Atual') : '') + '<small id="vd-' + r[0] + '">' + r[2] + (r[0] === 'SHARED' && noP ? ' Você é o único personal desta conta.' : '') + '</small>' + r[3] + '</span></label>';
            }).join('') + '</fieldset>' +
            (pend === 'SHARED' && !noP ? '<fieldset class="field" style="border:0;padding:0;margin:0"><legend class="field-label">Escolher personais</legend><div class="g6-checks">' + personals.map(function (p) { return '<label class="check"><input type="checkbox" name="pp" value="' + p + '"' + (chosen.indexOf(p) !== -1 ? ' checked' : '') + '><span class="check-text">' + p + '</span></label>'; }).join('') + '</div></fieldset>' : '') +
            (open && hasMedia ? '<div class="field"><label class="check"><input type="checkbox" id="c-med"' + (confirmed ? ' checked' : '') + '><span class="check-text">Confirmo que a mídia deste exercício não mostra pessoa identificável.<small>Se este exercício tem mídia, ela passa a ser vista por quem tiver acesso.</small></span></label></div>' : '') +
            (open && pend === 'PUBLIC' ? '<p class="g5-hint">Seu nome aparece como autor para todos os personais do aura.</p>' : '') +
            (open ? '<p class="g5-hint">Você é responsável pelo conteúdo que compartilha. [LEGAL] [MOCK] texto provisório.</p>' : '') +
            '<div class="row"><button type="button" class="btn btn-primary" id="b-save"' + (why() || saving ? ' disabled' : '') + (saving ? ' aria-busy="true"' : '') + ' aria-describedby="why">' + (saving ? 'Salvando…' : 'Salvar visibilidade') + '</button><a class="btn btn-neutral" href="' + esc(G6.url('exercicio-detalhe.html', 'id=' + id)) + '">Cancelar</a></div><p class="g5-hint" id="why">' + why() + '</p></div>';
        }
        function show() { el.innerHTML = html(); var ck = el.querySelector('input[name="vis"]:checked'); }
        function askClose() {
          var toOpen = RK[pend] > RK[cur], toPub = pend === 'PUBLIC';
          AuraUI.confirm(toOpen ? { title: 'Tornar ' + D.VIS[pend].toLowerCase() + ' este exercício?', text: 'Outros personais poderão ver o exercício, a mídia e suas instruções. Não inclua informação pessoal.' + (toPub ? ' Seu nome aparece como autor para todos os personais do aura.' : ''), confirmLabel: 'Tornar ' + D.VIS[pend].toLowerCase(), cancelLabel: 'Manter ' + D.VIS[cur].toLowerCase() }
            : { title: 'Restringir a visibilidade?', text: 'Quem já copiou o exercício continua com a cópia. Modelos de outros personais que o usam mantêm o exercício, mas ele deixa de aparecer em novas buscas deles. ' + 'Efeito em modelos de terceiros: requer API nova (X4).', confirmLabel: 'Restringir', cancelLabel: 'Manter ' + D.VIS[cur].toLowerCase() }).then(function (ok) {
            if (ok) { G5.flash('Visibilidade alterada para ' + D.VIS[pend] + '. Demonstração, nada foi gravado.', 'success'); location.href = G6.url('exercicio-detalhe.html', 'id=' + id); } else { pend = cur; confirmed = false; show(); var rb = el.querySelector('input[name="vis"][value="' + cur + '"]'); if (rb) rb.focus(); G6.live(el, 'Mantido: ' + D.VIS[cur] + '. Nada foi alterado.'); }
          });
        }
        show();
        el.addEventListener('change', function (e) {
          if (e.target.name === 'vis') { pend = e.target.value; confirmed = false; show(); var n = el.querySelector('input[name="vis"][value="' + pend + '"]'); if (n) n.focus(); G6.live(el, 'Selecionado: ' + D.VIS[pend] + '.'); }
          else if (e.target.id === 'c-med') { confirmed = e.target.checked; sync(); }
          else if (e.target.name === 'pp') { var i = chosen.indexOf(e.target.value); if (e.target.checked && i === -1) chosen.push(e.target.value); else if (i !== -1) chosen.splice(i, 1); sync(); }
        });
        el.addEventListener('click', function (e) { if (e.target.closest('#b-save')) askClose(); else if (e.target.closest('#b-cancpub')) AuraUI.confirm({ title: 'Cancelar a publicação?', text: 'O exercício continua Privado.', confirmLabel: 'Cancelar publicação', cancelLabel: 'Manter em revisão' }).then(function (ok) { if (ok) AuraUI.toast('Publicação cancelada. Demonstração.', { tone: 'info' }); }); });
        if (V === 'mudando-para-aberto' || V === 'mudando-para-fechado') { show(); if (!(RK[pend] > RK[cur] && hasMedia) && !why()) setTimeout(function () { askClose(); }, 50); }
      }
    });
  };

  window.G6X = X;
})();
