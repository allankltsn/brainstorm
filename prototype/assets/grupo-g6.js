/* grupo-g6.js - helpers do G6 (training: Exercicios e Treinos, lotes B e C). Carregar depois de grupo-g4.js, grupo-g5.js, data.js, data-g5.js, data-g6.js e shell.js.
   Reusa G5 (selo, badge, alertBox, breadcrumb, flash). Tudo [MOCK]; nenhuma gravacao real; a IA nunca grava. */
(function () {
  var G4 = window.G4, G5 = window.G5, A = window.AURA, D = window.G6DATA;
  var esc = G4.esc, ico = G4.ico, selo = G5.selo, badge = G5.badge, alertBox = G5.alertBox;

  function mount(o) {
    G4.setDefaultRole('personal');
    var r = G4.routes(); r.alunos = G4.url('../alunos/meus-alunos.html');
    r.exercicios = G4.url('../exercicios/catalogo.html'); r.treinos = G4.url('../treinos/biblioteca.html');
    window.AuraShell.mount({ role: 'personal', active: o.active, title: o.title, routes: r });
    document.addEventListener('aura:shellready', function () { document.title = o.id + ' · ' + o.title + ' · aura-fit'; });
  }
  function url(p, extra) { return G4.url(p, extra); }
  function home() { return url('../home/personal.html'); }
  function param(k) { try { return new URLSearchParams(location.search).get(k); } catch (e) { return null; } }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  /* ---- estados comuns: sem-permissao, carregando, erro; o resto fica com a tela ---- */
  function denied() {
    return '<div class="empty-state"><div class="empty-state-icon is-danger">' + ico('lock') + '</div><h2 class="h3">Você não tem acesso a esta tela</h2><p>Se acha que deveria ter acesso, fale com o gestor da conta.</p><a class="btn btn-primary" href="' + esc(home()) + '">Voltar ao início</a></div>';
  }
  function errorBox(text) {
    return '<div class="empty-state" role="alert"><div class="empty-state-icon is-danger">' + ico('alert') + '</div><h2 class="h3">' + esc(text) + '</h2><p>Nada foi alterado. Tente de novo em instantes.</p><button type="button" class="btn btn-secondary" data-g6-retry>' + ico('refresh') + 'Tentar de novo</button></div>';
  }
  function boot(V, o) {
    G4.ready(function () {
      var el = document.querySelector(o.area || '#area');
      if (V === 'sem-permissao') { el.innerHTML = denied(); return; }
      if (V === 'carregando') { el.innerHTML = AuraState.skeleton({ rows: o.rows || 6, variant: o.skel || 'cards' }); return; }
      if (V === 'erro' && !o.errorInside) {
        el.innerHTML = errorBox(o.errText || 'Não foi possível carregar.');
        el.querySelector('[data-g6-retry]').addEventListener('click', function () { location.href = location.pathname + '?' + location.search.replace(/^\?/, '').split('&').filter(function (p) { return p && p.indexOf('variant=') !== 0; }).join('&'); });
        return;
      }
      o.render(el);
      G5.showFlash();
    });
  }
  function offline() { return alertBox('info', 'Sem conexão', 'Mostrando a última carga, às 14:32. Ações que gravam dados ficam desativadas até a conexão voltar.'); }
  function live(el, msg) { var l = el.querySelector('[data-g6-live]'); if (l) l.textContent = msg; }
  function liveBox() { return '<div class="sr-only" role="status" aria-live="polite" data-g6-live></div>'; }

  /* ---- badges de origem, visibilidade, status e nivel (sempre texto + icone) ---- */
  function originBadge(e) {
    if (e.origin === 'SYSTEM') return badge('neutral', 'external', 'Do sistema');
    if (e.originId) return badge('neutral', 'clipboard', 'Personalizado');
    if (e.origin === 'OWN') return badge('primary', 'user', 'Seu');
    return badge('neutral', 'users', 'De ' + e.owner);
  }
  function visBadge(e) {
    if (e.origin === 'SYSTEM') return '';
    var v = e.visibility;
    return badge(v === 'PRIVATE' ? 'neutral' : 'info', v === 'PRIVATE' ? 'lock' : v === 'SHARED' ? 'users' : 'external', D.VIS[v]);
  }
  function statusBadge(s) {
    var m = { DRAFT: ['warning', 'edit', 'Rascunho'], ACTIVE: ['success', 'check-circle', 'Ativo'], ARCHIVED: ['neutral', 'ban', 'Arquivado'] }[s];
    return badge(m[0], m[1], m[2]);
  }
  function levelText(l) { return D.LEVEL[l] || 'Sem nível'; }
  function names(list, id) { return list.map(function (x) { return D.lab(id, x); }).join(', '); }

  /* ---- cartao de exercicio (TRN-10). opts.pick: modo escolher ---- */
  function exCard(e, o) {
    o = o || {}; var thumb = e.posterRefState === 'READY' ? '<div class="g6-thumb" role="img" aria-label="Imagem de demonstração (exemplo) de ' + esc(e.name) + '">' + ico('dumbbell') + '</div>' : '<div class="g6-thumb is-none">' + ico('dumbbell') + '<span>Sem imagem</span></div>';
    var arch = e.archivedAt ? badge('neutral', 'ban', 'Arquivado') : '';
    var act = o.pick ? '<button type="button" class="btn ' + (o.added ? 'btn-neutral' : 'btn-secondary') + '" data-pick="' + e.id + '" aria-pressed="' + (o.selected ? 'true' : 'false') + '"' + (o.added ? ' disabled' : '') + '>' + (o.added ? 'Adicionado ✓' : o.selected ? 'Selecionado ✓' : 'Adicionar') + '<span class="sr-only">: ' + esc(e.name) + '</span></button>'
      : '<button type="button" class="btn btn-text btn-icon" aria-haspopup="menu" aria-expanded="false" data-more="' + e.id + '" aria-label="Mais ações: ' + esc(e.name) + '">' + ico('more') + '</button>';
    return '<article class="card g6-card' + (o.selected ? ' card-selected' : '') + '">' + thumb + '<div class="card-body stack-sm"><div class="row-between" style="flex-wrap:nowrap"><h2 class="h4 g6-card-title"><a href="' + esc(url('exercicio-detalhe.html', 'id=' + e.id)) + '">' + esc(e.name) + '</a></h2>' + act + '</div>' +
      '<p class="muted">' + esc(names(e.primary, D.MUS)) + ' · ' + esc(names(e.equipment, D.EQ) || 'Sem equipamento') + '</p>' +
      '<div class="row">' + '<span class="badge">' + esc(levelText(e.level)) + '</span>' + originBadge(e) + visBadge(e) + arch + (e.reviewState === 'IN_REVIEW' ? badge('warning', 'clock', 'Em revisão') : '') + '</div></div></article>';
  }

  /* ---- seletor de exercicios em modal (usado por TRN-21 e TRN-23). o: {multi, exclude[], opener, onDone(ids)} ---- */
  function openPicker(o) {
    var id = 'pick-' + Math.floor(Math.random() * 1e6), t = id + '-t', sel = [];
    var list = D.exercises.filter(function (e) { return !e.archivedAt && e.origin !== 'SHARED_WITH_ME'; });
    var wrap = document.createElement('div'); wrap.className = 'modal-backdrop'; wrap.hidden = true; wrap.dataset.autoremove = '1'; wrap.id = id;
    wrap.innerHTML = '<div class="modal modal-lg" role="dialog" aria-modal="true" aria-labelledby="' + t + '"><div class="modal-header"><h2 class="modal-title" id="' + t + '">Escolher exercício</h2></div>' +
      '<div class="modal-body stack"><div class="g6-pick-filters"><div class="field"><label for="' + id + '-q">Buscar exercício</label><input class="input" id="' + id + '-q" type="search" autocomplete="off"></div>' +
      '<div class="field"><label for="' + id + '-m">Músculo</label><div class="select-wrap"><select class="select" id="' + id + '-m"><option value="">Todos</option>' + D.MUS.map(function (m) { return '<option value="' + m[0] + '">' + m[1] + '</option>'; }).join('') + '</select></div></div></div>' +
      '<p role="status" aria-live="polite" id="' + id + '-c" class="muted"></p><ul class="g6-pick-list" id="' + id + '-l"></ul></div>' +
      '<div class="modal-footer"><button type="button" class="btn btn-secondary" data-r="0">Cancelar</button><button type="button" class="btn btn-primary" data-r="1" disabled>Adicionar</button></div></div>';
    document.body.appendChild(wrap);
    var ul = wrap.querySelector('#' + id + '-l'), q = wrap.querySelector('#' + id + '-q'), m = wrap.querySelector('#' + id + '-m'), ok = wrap.querySelector('[data-r="1"]'), cnt = wrap.querySelector('#' + id + '-c');
    function norm(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function draw() {
      var rows = list.filter(function (e) { return (!q.value || norm(e.name).indexOf(norm(q.value)) !== -1) && (!m.value || e.primary.indexOf(m.value) !== -1); });
      cnt.textContent = rows.length ? plural(rows.length, 'exercício encontrado', 'exercícios encontrados') + '. ' + (sel.length ? plural(sel.length, 'selecionado', 'selecionados') + '.' : '') : 'Nenhum exercício encontrado. Limpe a busca ou o filtro.';
      ul.innerHTML = rows.map(function (e) {
        var added = (o.exclude || []).indexOf(e.id) !== -1;
        return '<li><label class="check"><input type="' + (o.multi ? 'checkbox' : 'radio') + '" name="pk" value="' + e.id + '"' + (sel.indexOf(e.id) !== -1 ? ' checked' : '') + (added ? ' disabled' : '') + '><span class="check-text">' + esc(e.name) + '<small>' + esc(names(e.primary, D.MUS)) + ' · ' + (e.origin === 'SYSTEM' ? 'Do sistema' : e.originId ? 'Personalizado' : e.origin === 'OWN' ? 'Seu' : 'De ' + esc(e.owner)) + (added ? ' · já está na sessão' : '') + '</small></span></label></li>';
      }).join('');
      ok.textContent = sel.length > 1 ? 'Adicionar ' + sel.length : 'Adicionar'; ok.disabled = !sel.length;
    }
    ul.addEventListener('change', function (e) { var v = e.target.value; if (o.multi) { var i = sel.indexOf(v); if (e.target.checked && i === -1) sel.push(v); else if (!e.target.checked && i !== -1) sel.splice(i, 1); } else sel = [v]; draw(); var again = ul.querySelector('input[value="' + v + '"]'); if (again) again.focus(); });
    q.addEventListener('input', draw); m.addEventListener('change', draw);
    wrap.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-r]'); if (!b) return; var go = b.dataset.r === '1'; window.AuraUI.closeModal(wrap); if (go && o.onDone) o.onDone(sel.slice()); });
    draw(); window.AuraUI.openModal(wrap, o.opener); return wrap;
  }

  /* ---------------- editor de modelo/treino (TRN-21 e TRN-23) ---------------- */
  var SET_TYPES = [['WARMUP', 'Aquecimento'], ['NORMAL', 'Normal'], ['DROP', 'Drop'], ['FAILURE', 'Falha']];
  var GROUPS = { BISET: ['Bi-set', 2, 2], SUPERSET: ['Super-set', 2, 4], CIRCUIT: ['Circuito', 3, 99] };
  var seq = 1000; function nid(p) { seq += 1; return p + seq; }
  function newSet() { return { type: 'NORMAL', repsMin: 10, repsMax: 12, load: null, rpe: null, rest: 60, tempo: '', notes: '' }; }
  function newItem(exId) { var e = D.exFind(exId); return { uid: nid('i'), exerciseId: exId, name: e ? e.name : 'Exercício', origin: e ? e.origin : 'OWN', archived: !!(e && e.archivedAt), unavailable: false, notes: '', sets: [newSet()], done: null }; }
  function allItems(s) { var r = []; s.blocks.forEach(function (b) { if (b.type === 'item') r.push(b.item); else b.items.forEach(function (i) { r.push(i); }); }); return r; }
  function findItem(M, u) { for (var i = 0; i < M.sessions.length; i++) { var s = M.sessions[i]; for (var j = 0; j < s.blocks.length; j++) { var b = s.blocks[j]; if (b.type === 'item' && b.item.uid === u) return { s: s, b: b, j: j, item: b.item }; if (b.type === 'group') for (var k = 0; k < b.items.length; k++) if (b.items[k].uid === u) return { s: s, b: b, j: j, k: k, item: b.items[k] }; } } return null; }
  function findBlock(M, u) { for (var i = 0; i < M.sessions.length; i++) for (var j = 0; j < M.sessions[i].blocks.length; j++) if (M.sessions[i].blocks[j].uid === u) return { s: M.sessions[i], j: j, b: M.sessions[i].blocks[j] }; return null; }
  function move(arr, i, d) { var n = i + d; if (n < 0 || n >= arr.length) return false; var x = arr.splice(i, 1)[0]; arr.splice(n, 0, x); return true; }

  /* validacao ao publicar: devolve [{msg, target}] */
  function validate(M) {
    var p = [];
    if (!String(M.name || '').trim()) p.push({ msg: 'Informe o nome do modelo.', target: 'ed-name' });
    var withItem = M.sessions.filter(function (s) { return allItems(s).length; }).length;
    if (!withItem) p.push({ msg: 'Adicione ao menos 1 sessão com 1 exercício.', target: null });
    M.sessions.forEach(function (s) {
      var sn = 'Sessão ' + s.label;
      s.blocks.forEach(function (b, bi) {
        if (b.type === 'group') { var g = GROUPS[b.gtype], n = b.items.length; if (n < g[1] || n > g[2]) p.push({ msg: sn + ', grupo ' + (bi + 1) + ': ' + (b.gtype === 'BISET' ? 'um bi-set tem 2 exercícios.' : b.gtype === 'SUPERSET' ? 'um super-set tem de 2 a 4 exercícios.' : 'um circuito tem 3 ou mais exercícios.'), target: 'g-' + b.uid }); }
        (b.type === 'item' ? [b.item] : b.items).forEach(function (it) {
          if (it.unavailable) p.push({ msg: sn + ', ' + it.name + ': exercício indisponível, troque o exercício.', target: 'sw-' + it.uid });
          if (!it.sets.length) p.push({ msg: sn + ', ' + it.name + ': informe ao menos uma série.', target: 'as-' + it.uid });
          it.sets.forEach(function (st, si) {
            if (st.repsMin != null && st.repsMax != null && st.repsMax < st.repsMin) p.push({ msg: sn + ', ' + it.name + ', série ' + (si + 1) + ': repetições máximas devem ser maiores ou iguais às mínimas.', target: 'rx-' + it.uid + '-' + si });
            if (st.rpe != null && (st.rpe < 1 || st.rpe > 10)) p.push({ msg: sn + ', ' + it.name + ', série ' + (si + 1) + ': o esforço (RPE) vai de 1 a 10.', target: 'rp-' + it.uid + '-' + si });
          });
        });
      });
    });
    return p;
  }
  function estimate(M) { var sec = 0, n = 0, ex = 0; M.sessions.forEach(function (s) { var it = allItems(s); ex += it.length; it.forEach(function (i) { i.sets.forEach(function (st) { n += 1; sec += 40 + (st.rest || 0); }); }); }); return { ex: ex, sets: n, min: Math.round(sec / 60 / Math.max(1, M.sessions.length)) }; }

  /* o: {readonly, health:boolean (TRN-23: notas so dentro do portao), onChange, opener} */
  function editor(host, M, o) {
    o = o || {}; var cur = 0, focusKey = null, ro = !!o.readonly;
    function dis() { return ro ? ' disabled' : ''; }
    function numIn(label, val, bind, extra) { return '<input class="input" type="number" inputmode="decimal" aria-label="' + esc(label) + '" value="' + (val == null ? '' : val) + '" data-bind="' + bind + '"' + (extra || '') + dis() + '>'; }
    function setRows(it) {
      var rows = it.sets.map(function (st, i) {
        var bad = st.repsMax != null && st.repsMin != null && st.repsMax < st.repsMin, badR = st.rpe != null && (st.rpe < 1 || st.rpe > 10), ref = 'id="rx-' + it.uid + '-' + i + '"';
        return '<tr><td data-label="Tipo"><div class="select-wrap"><select class="select" aria-label="Tipo da série ' + (i + 1) + '" data-bind="set:' + it.uid + ':' + i + ':type"' + dis() + '>' + SET_TYPES.map(function (t) { return '<option value="' + t[0] + '"' + (st.type === t[0] ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select></div></td>' +
          '<td data-label="Reps mín.">' + numIn('Repetições mínimas, série ' + (i + 1), st.repsMin, 'set:' + it.uid + ':' + i + ':repsMin', ' min="1" ' + ref + (bad ? ' aria-invalid="true"' : '')) + '</td>' +
          '<td data-label="Reps máx.">' + numIn('Repetições máximas, série ' + (i + 1), st.repsMax, 'set:' + it.uid + ':' + i + ':repsMax', ' min="1"' + (bad ? ' aria-invalid="true"' : '')) + (bad ? '<div class="field-error">' + ico('alert', 'icon-sm') + '<span>Máximo menor que o mínimo.</span></div>' : '') + '</td>' +
          '<td data-label="Carga (kg)">' + numIn('Carga em kg, série ' + (i + 1), st.load, 'set:' + it.uid + ':' + i + ':load', ' min="0" step="0.5"') + '</td>' +
          '<td data-label="RPE">' + numIn('Esforço alvo RPE de 1 a 10, série ' + (i + 1), st.rpe, 'set:' + it.uid + ':' + i + ':rpe', ' min="1" max="10" step="0.5" id="rp-' + it.uid + '-' + i + '"' + (badR ? ' aria-invalid="true"' : '')) + '</td>' +
          '<td data-label="Descanso (s)">' + numIn('Descanso em segundos, série ' + (i + 1), st.rest, 'set:' + it.uid + ':' + i + ':rest', ' min="0" step="15" list="g6-rest"') + '</td>' +
          '<td data-label="Cadência"><input class="input" maxlength="16" aria-label="Cadência, série ' + (i + 1) + '" value="' + esc(st.tempo) + '" data-bind="set:' + it.uid + ':' + i + ':tempo" placeholder="3-1-1-0"' + dis() + '></td>' +
          '<td data-label="Notas">' + (o.health === false ? '<span class="muted">Indisponível</span>' : '<input class="input" aria-label="Notas, série ' + (i + 1) + '" value="' + esc(st.notes) + '" data-bind="set:' + it.uid + ':' + i + ':notes"' + (o.health ? ' data-health="1" autocomplete="off"' : '') + dis() + '>') + '</td>' +
          '<td class="col-actions">' + (ro ? '' : '<div class="g6-rowbtns"><button type="button" class="btn btn-text" data-act="set-up" data-u="' + it.uid + '" data-i="' + i + '"' + (i === 0 ? ' disabled' : '') + '>Subir<span class="sr-only"> série ' + (i + 1) + '</span></button><button type="button" class="btn btn-text" data-act="set-down" data-u="' + it.uid + '" data-i="' + i + '"' + (i === it.sets.length - 1 ? ' disabled' : '') + '>Descer<span class="sr-only"> série ' + (i + 1) + '</span></button><button type="button" class="btn btn-text" data-act="set-dup" data-u="' + it.uid + '" data-i="' + i + '">Duplicar<span class="sr-only"> série ' + (i + 1) + '</span></button><button type="button" class="btn btn-text" data-act="set-del" data-u="' + it.uid + '" data-i="' + i + '">Remover<span class="sr-only"> série ' + (i + 1) + '</span></button></div>') + '</td></tr>';
      }).join('');
      var noLoad = it.sets.length && it.sets.every(function (s) { return s.load == null && s.rpe == null; });
      return '<div class="g6-sets" role="region" aria-label="Séries de '+esc(it.name)+'" tabindex="0"><table class="g6-tbl"><caption class="sr-only">Séries de ' + esc(it.name) + '</caption><thead><tr><th scope="col">Tipo</th><th scope="col">Reps mín.</th><th scope="col">Reps máx.</th><th scope="col">Carga (kg)</th><th scope="col">RPE</th><th scope="col">Descanso (s)</th><th scope="col">Cadência</th><th scope="col">Notas</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead><tbody>' + (rows || '<tr><td colspan="9" id="as-' + it.uid + '" tabindex="-1">Este exercício ainda não tem séries.</td></tr>') + '</tbody></table></div>' +
        (noLoad ? '<p class="g5-hint" role="status">Sem carga nem esforço alvo. Isso não bloqueia.</p>' : '');
    }
    function itemHtml(it, b, pos, total, inGroup) {
      var e = D.exFind(it.exerciseId), orig = it.origin === 'SYSTEM' ? 'Do sistema' : it.origin === 'OWN' ? 'Seu' : 'De colega';
      var warn = it.unavailable ? alertBox('danger', 'Exercício indisponível', 'O compartilhamento foi retirado. Troque o exercício para publicar. ' + selo('X4')) : it.archived ? alertBox('warning', '', 'Este exercício foi arquivado. Continua funcionando aqui; considere trocar.') : '';
      var groups = []; var S0 = M.sessions[cur]; S0.blocks.forEach(function (bb, bi) { if (bb.type === 'group') groups.push([bb.uid, GROUPS[bb.gtype][0] + ' ' + (bi + 1)]); });
      return '<div class="g6-item" id="it-' + it.uid + '"><div class="row-between"><h3 class="h4">' + esc(it.name) + '</h3><div class="row">' + badge('neutral', 'dumbbell', orig) + (it.archived ? badge('neutral', 'ban', 'Arquivado') : '') + (it.done ? badge('success', 'check', 'Já feito em ' + A.fmtDate(it.done)) : '') + '</div></div>' +
        warn +
        (ro ? '' : '<div class="g6-rowbtns"><button type="button" class="btn btn-text" data-act="up" data-u="' + it.uid + '"' + (pos === 0 ? ' disabled' : '') + '>Subir<span class="sr-only">: ' + esc(it.name) + '</span></button><button type="button" class="btn btn-text" data-act="down" data-u="' + it.uid + '"' + (pos === total - 1 ? ' disabled' : '') + '>Descer<span class="sr-only">: ' + esc(it.name) + '</span></button>' +
          '<button type="button" class="btn btn-secondary" id="sw-' + it.uid + '" data-act="swap" data-u="' + it.uid + '">Trocar exercício<span class="sr-only">: ' + esc(it.name) + '</span></button><button type="button" class="btn btn-text" data-act="rm-item" data-u="' + it.uid + '">Remover do treino<span class="sr-only">: ' + esc(it.name) + '</span></button>' +
          '<label class="g6-move"><span class="sr-only">Mover ' + esc(it.name) + ' para</span><span class="select-wrap"><select class="select" data-act="move" data-u="' + it.uid + '"><option value="">Mover para…</option>' + (inGroup ? '<option value="out">Fora de grupo</option>' : '') + groups.filter(function (g) { return !b || g[0] !== b.uid; }).map(function (g) { return '<option value="' + g[0] + '">' + esc(g[1]) + '</option>'; }).join('') + '</select></span></label></div>') +
        '<div class="field"><label for="n-' + it.uid + '">Notas do exercício</label>' + (o.health === false ? '<p class="muted">Indisponível</p>' : '<input class="input" id="n-' + it.uid + '" value="' + esc(it.notes) + '" data-bind="item:' + it.uid + ':notes"' + (o.health ? ' data-health="1" autocomplete="off"' : '') + dis() + '>') + '</div>' +
        setRows(it) + (ro ? '' : '<div class="row"><button type="button" class="btn btn-secondary" data-act="set-add" data-u="' + it.uid + '">Adicionar série<span class="sr-only">: ' + esc(it.name) + '</span></button></div>') + '</div>';
    }
    function blockHtml(b, bi, total) {
      var mv = ro ? '' : '<button type="button" class="btn btn-text" data-act="b-up" data-u="' + b.uid + '"' + (bi === 0 ? ' disabled' : '') + '>Subir<span class="sr-only"> bloco ' + (bi + 1) + '</span></button><button type="button" class="btn btn-text" data-act="b-down" data-u="' + b.uid + '"' + (bi === total - 1 ? ' disabled' : '') + '>Descer<span class="sr-only"> bloco ' + (bi + 1) + '</span></button>';
      if (b.type === 'item') return '<li class="g6-block card"><div class="card-body stack">' + (ro ? '' : '<div class="g6-rowbtns">' + mv + '</div>') + itemHtml(b.item, null, 0, 1, false) + '</div></li>';
      var g = GROUPS[b.gtype], n = b.items.length, okSize = n >= g[1] && n <= g[2];
      return '<li class="g6-block card g6-group"><div class="card-body stack" id="g-' + b.uid + '" tabindex="-1"><div class="row-between"><h3 class="h3">' + g[0] + ' (' + plural(n, 'exercício', 'exercícios') + ')</h3><div class="g6-rowbtns">' + mv + (ro ? '' : '<button type="button" class="btn btn-secondary" data-act="ungroup" data-u="' + b.uid + '">Desagrupar<span class="sr-only"> bloco ' + (bi + 1) + '</span></button>') + '</div></div>' +
        (okSize ? '' : '<div class="field-error" role="alert">' + ico('alert', 'icon-sm') + '<span>' + (b.gtype === 'BISET' ? 'Um bi-set tem 2 exercícios.' : b.gtype === 'SUPERSET' ? 'Um super-set tem de 2 a 4 exercícios.' : 'Um circuito tem 3 ou mais exercícios.') + '</span></div>') +
        '<div class="g6-gridfields"><div class="field"><label for="r-' + b.uid + '">Rodadas</label><input class="input" id="r-' + b.uid + '" type="number" min="1" value="' + b.rounds + '" data-bind="grp:' + b.uid + ':rounds"' + dis() + '></div><div class="field"><label for="d-' + b.uid + '">Descanso após o grupo (s)</label><input class="input" id="d-' + b.uid + '" type="number" min="0" step="15" value="' + b.rest + '" data-bind="grp:' + b.uid + ':rest"' + dis() + '></div></div>' +
        b.items.map(function (it, k) { return itemHtml(it, b, k, n, true); }).join('') + (ro ? '' : '<div class="row"><button type="button" class="btn btn-secondary" data-act="g-add" data-u="' + b.uid + '">Adicionar exercício ao grupo</button></div>') + '</div></li>';
    }
    function render() {
      var s = M.sessions[cur];
      if (!s) { cur = 0; s = M.sessions[0]; }
      var h = '<datalist id="g6-rest"><option value="30"><option value="60"><option value="90"><option value="120"></datalist>' + liveBox() +
        '<div class="g5-tabs"><div class="tabs g6-sessions" role="tablist" aria-label="Sessões do treino">' + M.sessions.map(function (x, i) { return '<button type="button" class="tab" role="tab" id="st-' + i + '" aria-selected="' + (i === cur) + '" tabindex="' + (i === cur ? 0 : -1) + '" data-sess="' + i + '">Sessão ' + esc(x.label) + (x.name ? ' · ' + esc(x.name) : '') + '</button>'; }).join('') + '</div></div>' +
        '<section class="stack" role="tabpanel" aria-labelledby="st-' + cur + '" tabindex="0"><h2 class="h3">Sessão ' + esc(s.label) + '</h2>' +
        (ro ? '' : '<div class="g6-gridfields"><div class="field"><label for="sl">Rótulo (até 8 caracteres)</label><input class="input" id="sl" maxlength="8" value="' + esc(s.label) + '" data-bind="sess:label"></div><div class="field"><label for="sn">Nome da sessão (opcional)</label><input class="input" id="sn" value="' + esc(s.name) + '" data-bind="sess:name"></div></div>' +
          '<div class="g6-rowbtns"><button type="button" class="btn btn-text" data-act="s-left"' + (cur === 0 ? ' disabled' : '') + '>Subir sessão</button><button type="button" class="btn btn-text" data-act="s-right"' + (cur === M.sessions.length - 1 ? ' disabled' : '') + '>Descer sessão</button><button type="button" class="btn btn-secondary" data-act="s-dup">Duplicar sessão</button><button type="button" class="btn btn-secondary" data-act="s-add">Adicionar sessão</button><button type="button" class="btn btn-text" data-act="s-del"' + (M.sessions.length < 2 ? ' disabled' : '') + '>Remover sessão</button></div>') +
        (s.blocks.length ? '<ol class="g6-blocks">' + s.blocks.map(function (b, i) { return blockHtml(b, i, s.blocks.length); }).join('') + '</ol>' :
          '<div class="empty-state"><div class="empty-state-icon">' + ico('dumbbell') + '</div><h3 class="h3">Esta sessão ainda não tem exercícios.</h3>' + (ro ? '' : '<p>Escolha exercícios do catálogo para começar.</p>') + '</div>') +
        (ro ? '' : '<div class="row"><button type="button" class="btn btn-primary" data-act="add-ex">' + ico('plus') + 'Adicionar exercício</button><div class="field g6-addgrp"><label class="sr-only" for="gt">Tipo de grupo</label><span class="select-wrap"><select class="select" id="gt">' + Object.keys(GROUPS).map(function (k) { return '<option value="' + k + '">' + GROUPS[k][0] + '</option>'; }).join('') + '</select></span></div><button type="button" class="btn btn-secondary" data-act="add-grp">Adicionar grupo</button></div>') + '</section>';
      host.innerHTML = h;
      if (focusKey) { var f = host.querySelector(focusKey); if (f) f.focus(); focusKey = null; }
    }
    function changed(msg) { if (o.onChange) o.onChange(); if (msg) live(host, msg); }
    function pos(it) { var f = findItem(M, it); return f; }
    function bindVal(el) { var v = el.value; return el.type === 'number' ? (v === '' ? null : parseFloat(v)) : v; }
    host.addEventListener('input', function (e) {
      var d = e.target.dataset && e.target.dataset.bind; if (!d || ro) return; var p = d.split(':'), v = bindVal(e.target);
      if (p[0] === 'set') { var f = findItem(M, p[1]); if (f) f.item.sets[+p[2]][p[3]] = v; }
      else if (p[0] === 'item') { var f2 = findItem(M, p[1]); if (f2) f2.item[p[2]] = v; }
      else if (p[0] === 'grp') { var fb = findBlock(M, p[1]); if (fb) fb.b[p[2]] = v; }
      else if (p[0] === 'sess') M.sessions[cur][p[1]] = v;
      changed();
    });
    host.addEventListener('change', function (e) {
      var t = e.target;
      if (t.dataset.act === 'move' && t.value) { moveTo(t.dataset.u, t.value); return; }
      if (t.dataset.bind && /^(set:.*:(rpe|repsMin|repsMax)|sess:label)/.test(t.dataset.bind)) { var k = document.activeElement && document.activeElement.id; render(); if (k) { var again = host.querySelector('#' + k); if (again) again.focus(); } }
    });
    function moveTo(u, target) {
      var f = findItem(M, u); if (!f) return; var it = f.item;
      if (f.b.type === 'group') { f.b.items.splice(f.k, 1); if (!f.b.items.length) f.s.blocks.splice(f.j, 1); } else f.s.blocks.splice(f.j, 1);
      if (target === 'out') f.s.blocks.splice(Math.min(f.j + 1, f.s.blocks.length), 0, { uid: nid('b'), type: 'item', item: it });
      else { var g = findBlock(M, target); if (g) g.b.items.push(it); }
      focusKey = '#it-' + u; render(); changed(it.name + ' movido.');
    }
    function addItems(ids, group) {
      var s = M.sessions[cur];
      ids.forEach(function (id) { var it = newItem(id); if (group) group.items.push(it); else s.blocks.push({ uid: nid('b'), type: 'item', item: it }); });
      render(); changed(plural(ids.length, 'exercício adicionado', 'exercícios adicionados') + '.');
    }
    host.addEventListener('click', function (e) {
      var tab = e.target.closest('[data-sess]'); if (tab) { cur = +tab.dataset.sess; focusKey = '#st-' + cur; render(); return; }
      var b = e.target.closest('[data-act]'); if (!b || b.tagName === 'SELECT' || ro) return;
      var act = b.dataset.act, u = b.dataset.u, s = M.sessions[cur], i = +b.dataset.i, f;
      if (act === 'add-ex') openPicker({ multi: true, opener: b, exclude: allItems(s).map(function (x) { return x.exerciseId; }), onDone: function (ids) { addItems(ids); } });
      else if (act === 'g-add') { var g = findBlock(M, u); openPicker({ multi: true, opener: b, exclude: [], onDone: function (ids) { addItems(ids, g.b); } }); }
      else if (act === 'add-grp') { var gt = host.querySelector('#gt').value; s.blocks.push({ uid: nid('b'), type: 'group', gtype: gt, rounds: 3, rest: 60, notes: '', items: [] }); render(); changed(GROUPS[gt][0] + ' criado. Adicione os exercícios.'); }
      else if (act === 'swap') { f = findItem(M, u); openPicker({ multi: false, opener: b, exclude: [], onDone: function (ids) { var n = newItem(ids[0]); f.item.exerciseId = n.exerciseId; f.item.name = n.name; f.item.origin = n.origin; f.item.archived = n.archived; f.item.unavailable = false; render(); changed('Exercício trocado por ' + n.name + '.'); } }); }
      else if (act === 'rm-item') { f = findItem(M, u); AuraUI.confirm({ title: 'Remover ' + f.item.name + ' do treino?', text: 'O exercício sai desta sessão e as séries dele são descartadas. O exercício continua no catálogo.', confirmLabel: 'Remover', cancelLabel: 'Manter', danger: true }).then(function (ok) { if (!ok) return; if (f.b.type === 'group') { f.b.items.splice(f.k, 1); } else f.s.blocks.splice(f.j, 1); render(); changed(f.item.name + ' removido.'); }); }
      else if (act === 'up' || act === 'down') { f = findItem(M, u); var arr = f.b.type === 'group' ? f.b.items : null, idx = f.b.type === 'group' ? f.k : f.j, list = arr || f.s.blocks; if (move(list, idx, act === 'up' ? -1 : 1)) { focusKey = '[data-act="' + act + '"][data-u="' + u + '"]'; var np = idx + (act === 'up' ? -1 : 1) + 1; render(); changed(f.item.name + ' movido para a posição ' + np + ' de ' + list.length + '.'); } }
      else if (act === 'b-up' || act === 'b-down') { f = findBlock(M, u); if (move(f.s.blocks, f.j, act === 'b-up' ? -1 : 1)) { focusKey = '[data-act="' + act + '"][data-u="' + u + '"]'; render(); changed('Bloco movido para a posição ' + (f.j + (act === 'b-up' ? 0 : 2)) + ' de ' + f.s.blocks.length + '.'); } }
      else if (act === 'ungroup') { f = findBlock(M, u); var its = f.b.items.map(function (it) { return { uid: nid('b'), type: 'item', item: it }; }); Array.prototype.splice.apply(f.s.blocks, [f.j, 1].concat(its)); render(); changed('Grupo desfeito. Os exercícios foram mantidos.'); }
      else if (act === 'set-add') { f = findItem(M, u); f.item.sets.push(newSet()); render(); changed('Série adicionada.'); }
      else if (act === 'set-dup') { f = findItem(M, u); f.item.sets.splice(i + 1, 0, Object.assign({}, f.item.sets[i])); render(); changed('Série duplicada.'); }
      else if (act === 'set-del') { f = findItem(M, u); f.item.sets.splice(i, 1); render(); changed('Série removida.'); }
      else if (act === 'set-up' || act === 'set-down') { f = findItem(M, u); if (move(f.item.sets, i, act === 'set-up' ? -1 : 1)) { render(); changed('Série ' + (i + 1) + ' movida para a posição ' + (i + (act === 'set-up' ? 0 : 2)) + ' de ' + f.item.sets.length + '.'); } }
      else if (act === 's-add') { M.sessions.push({ uid: nid('s'), label: String.fromCharCode(65 + M.sessions.length), name: '', notes: '', blocks: [] }); cur = M.sessions.length - 1; focusKey = '#st-' + cur; render(); changed('Sessão adicionada.'); }
      else if (act === 's-dup') { var cp = JSON.parse(JSON.stringify(s)); cp.uid = nid('s'); cp.label = String.fromCharCode(65 + M.sessions.length); cp.blocks.forEach(function (bb) { bb.uid = nid('b'); (bb.type === 'item' ? [bb.item] : bb.items).forEach(function (it) { it.uid = nid('i'); it.done = null; }); }); M.sessions.splice(cur + 1, 0, cp); cur += 1; render(); changed('Sessão duplicada.'); }
      else if (act === 's-del') { AuraUI.confirm({ title: 'Remover a sessão ' + s.label + ' e seus ' + allItems(s).length + ' exercícios?', text: 'Isso só vale neste ' + (o.health === undefined ? 'modelo' : 'treino') + '. Você pode adicionar outra sessão depois.', confirmLabel: 'Remover sessão', cancelLabel: 'Manter', danger: true }).then(function (ok) { if (!ok) return; M.sessions.splice(cur, 1); cur = Math.max(0, cur - 1); render(); changed('Sessão removida.'); }); }
      else if (act === 's-left' || act === 's-right') { if (move(M.sessions, cur, act === 's-left' ? -1 : 1)) { cur += act === 's-left' ? -1 : 1; focusKey = '[data-act="' + act + '"]'; render(); changed('Sessão movida para a posição ' + (cur + 1) + ' de ' + M.sessions.length + '.'); } }
    });
    host.addEventListener('keydown', function (e) {
      var t = e.target.closest && e.target.closest('[role="tab"]'); if (!t || ['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(e.key) === -1) return;
      e.preventDefault(); var n = M.sessions.length; cur = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (cur + (e.key === 'ArrowRight' ? 1 : -1) + n) % n; focusKey = '#st-' + cur; render();
    });
    render();
    return { render: render, goto: function (i) { cur = i; render(); }, current: function () { return cur; } };
  }

  /* resumo (rodape no 390, coluna a direita no 1440) */
  function summary(M, problems) {
    var e = estimate(M);
    return '<section class="card g6-summary" aria-labelledby="g6-sum-t"><div class="card-header"><h2 class="card-title" id="g6-sum-t">Resumo</h2></div><div class="card-body stack-sm"><p><strong>' + e.ex + '</strong> ' + (e.ex === 1 ? 'exercício' : 'exercícios') + ', <strong>' + e.sets + '</strong> séries.</p><p>Tempo estimado: cerca de ' + e.min + ' min por sessão <span class="muted">(estimativa)</span>.</p>' +
      (problems && problems.length ? '<p class="field-error">' + ico('alert', 'icon-sm') + '<span>' + plural(problems.length, 'problema', 'problemas') + ' para publicar.</span></p>' : '<p class="muted">Sem problemas encontrados.</p>') + '</div></section>';
  }
  function problemList(problems) {
    if (!problems.length) return '';
    return '<div class="alert alert-danger" role="alert" tabindex="-1" id="g6-problems">' + ico('alert') + '<div class="alert-body"><div class="alert-title">Corrija antes de publicar (' + problems.length + ')</div><ul class="g4-list-plain">' + problems.map(function (p) { return '<li>' + (p.target ? '<a href="#' + p.target + '" data-goto="' + p.target + '">' + esc(p.msg) + '</a>' : esc(p.msg)) + '</li>'; }).join('') + '</ul></div></div>';
  }
  /* aviso ao sair com mudancas nao salvas, de mesmo peso nas duas opcoes */
  function guard(getDirty, href) {
    return function () { if (!getDirty()) { location.href = href; return; } AuraUI.confirm({ title: 'Você tem mudanças não salvas', text: 'Se sair agora, as mudanças feitas nesta tela serão descartadas.', confirmLabel: 'Descartar mudanças', cancelLabel: 'Continuar editando' }).then(function (ok) { if (ok) location.href = href; }); };
  }
  function iaSlot() {
    return '<details class="g6-ia"><summary>' + ico('sparkles') + 'Sugestões da IA ' + selo('I1') + '</summary><p>A IA só sugere. Você decide e confirma cada mudança. Nada é salvo pela IA.</p><div class="row"><a class="btn btn-secondary" href="' + esc(url('../ia/painel-sugestoes.html', 'origem=modelo')) + '">Sugerir com IA</a><a class="btn btn-secondary" href="' + esc(url('../ia/importar.html')) + '">Importar planilha ou texto</a></div></details>';
  }

  window.G6 = {
    mount: mount, url: url, home: home, param: param, plural: plural, boot: boot, denied: denied, errorBox: errorBox, offline: offline, live: live, liveBox: liveBox,
    originBadge: originBadge, visBadge: visBadge, statusBadge: statusBadge, levelText: levelText, names: names, exCard: exCard, openPicker: openPicker,
    editor: editor, validate: validate, summary: summary, problemList: problemList, guard: guard, iaSlot: iaSlot, allItems: allItems, GROUPS: GROUPS,
    crumbs: G5.breadcrumb, selo: selo, badge: badge, alertBox: alertBox, esc: esc, ico: ico, variant: G4.variant
  };
})();
