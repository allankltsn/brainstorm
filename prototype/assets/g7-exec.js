/* g7-exec.js - TRN-31 Execucoes recentes e retorno com reacoes (lista e detalhe). Depende de g7-core.js. Tudo [MOCK]; retorno nunca vai para o navegador; a IA so sugere. */
(function () {
  var G7 = window.G7, G5 = window.G5, G6 = window.G6, G4 = window.G4, A = window.AURA, D = window.G5DATA, E = D.E;
  var esc = G7.esc, ico = G7.ico, badge = G7.badge, alertBox = G7.alertBox, url = G7.url;
  var STAT = { COMPLETED: ['success', 'check-circle', 'Concluída'], IN_PROGRESS: ['info', 'clock', 'Em andamento'], INTERRUPTED: ['warning', 'alert', 'Interrompida'] };
  var REACT = [['Curti', 'heart'], ['Forte', 'dumbbell'], ['Parabéns', 'star'], ['Atenção', 'alert']];
  var AUTH = { aluno: 'Registrado pelo aluno', voce: 'Registrado por você' };
  function aluno() { return G7.param('aluno'); }
  function hasDor(s) { return s.pain && s.pain.length; }
  function noReply(s) { return !s.feedback.some(function (f) { return f.role === 'Você'; }); }

  /* ---------- lista ---------- */
  function lista() {
    var V = G7.variant() || 'padrao', gg = G7.gv(V), sid = aluno() || (gg && gg.sid) || null, filt = { dor: V === 'com-dor', sr: V === 'sem-retorno', st: V === 'em-andamento' ? 'IN_PROGRESS' : V === 'interrompida' ? 'INTERRUPTED' : '', q: V === 'filtro-sem-resultado' };
    var offline = V === 'offline', st = {};
    G7.boot(V, { rows: 5, skel: 'cards', errText: 'Não foi possível carregar as execuções.', render: function (el) {
      var sd = sid ? G7.stu(sid) : null;
      if (sd) { var g = gg ? gg.g : D.gate(sd, {}); if (!g.ok) { el.innerHTML = '<div class="g5-panel stack">' + G7.gateCard(g) + '<p class="g5-hint">Nenhuma execução, carga, esforço ou dor aparece aqui, e nenhuma contagem.</p><a class="btn btn-secondary" href="' + esc(url('../alunos/aluno-detalhe.html', 'id=' + sd.id)) + '">Abrir aluno</a></div>'; return; } }
      function rows() {
        var l = E.sessions({}); if (sid) l = l.filter(function (x) { return x.sid === sid; });
        if (V === 'sem-execucoes') return [];
        return l.filter(function (s) { return (!filt.dor || hasDor(s)) && (!filt.sr || (noReply(s) && s.status === 'COMPLETED')) && (!filt.st || s.status === filt.st) && !filt.q; });
      }
      function draw() {
        var l = rows(), h = (offline ? G7.offlineBox() : '') + G7.liveBox() +
          '<p class="g5-hint g7-hidden-note" role="status">' + ico('lock') + '<span>Execuções de alunos sem saúde liberada ficam ocultas.</span></p>' +
          '<details class="g7-filters card" open><summary>Filtros</summary><div class="card-body g7-fgrid"><div class="field"><label for="f-per">Período</label><div class="select-wrap"><select class="select" id="f-per"><option>7 dias</option><option>30 dias</option><option>Personalizado</option></select></div></div>' +
          '<div class="field"><label for="f-st">Status</label><div class="select-wrap"><select class="select" id="f-st"><option value="">Todos</option><option value="COMPLETED"' + (filt.st === 'COMPLETED' ? ' selected' : '') + '>Concluída</option><option value="IN_PROGRESS"' + (filt.st === 'IN_PROGRESS' ? ' selected' : '') + '>Em andamento</option><option value="INTERRUPTED"' + (filt.st === 'INTERRUPTED' ? ' selected' : '') + '>Interrompida</option></select></div></div>' +
          '<label class="check"><input type="checkbox" id="f-dor"' + (filt.dor ? ' checked' : '') + '><span class="check-text">Só com dor</span></label><label class="check"><input type="checkbox" id="f-sr"' + (filt.sr ? ' checked' : '') + '><span class="check-text">Só sem retorno</span></label></div></details>' +
          '<p class="g7-count" role="status" aria-live="polite">' + G7.plural(l.length, 'execução', 'execuções') + '</p>';
        if (!l.length) h += (V === 'sem-execucoes' ? G7.empty('dumbbell', sid ? 'Este aluno ainda não fez nenhuma sessão.' : 'Nenhuma execução neste período.', 'Quando seus alunos fizerem os treinos, aparecem aqui.') : '<div class="empty-state" role="status"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Nenhuma execução encontrada para esses filtros.</h2><button type="button" class="btn btn-secondary" data-clear>Limpar filtros</button></div>');
        else h += '<div class="stack">' + l.map(function (s) {
          var t = STAT[s.status], n = G7.stu(s.sid).name;
          return '<article class="card g7-row" aria-labelledby="x-' + s.id + '"><div class="card-body g7-rowbody"><div class="grow stack-sm"><h2 class="h4" id="x-' + s.id + '">' + esc(n) + ': ' + esc(s.label) + '</h2><p class="muted">' + G7.when(s.date) + ' · ' + s.min + ' min · ' + s.done + ' de ' + s.total + ' séries' + (s.rpe ? ' · esforço ' + s.rpe + ' de 10' : '') + '</p>' +
            '<div class="row">' + badge(t[0], t[1], t[2]) + (hasDor(s) ? badge('warning', 'alert', 'Dor registrada') : '') + (noReply(s) && s.status === 'COMPLETED' ? badge('neutral', 'clock', 'Sem retorno') : '') + '<span class="badge">' + ico('user') + AUTH[s.origin] + '</span></div></div>' +
            '<a class="btn btn-secondary" href="' + esc(url('execucao-detalhe.html', 'sessao=' + s.id)) + '">Abrir sessão<span class="sr-only">: ' + esc(n) + ', ' + esc(s.label) + '</span></a></div></article>';
        }).join('') + '</div>';
        el.innerHTML = h;
      }
      draw();
      el.addEventListener('change', function (e) { if (e.target.id === 'f-dor') filt.dor = e.target.checked; else if (e.target.id === 'f-sr') filt.sr = e.target.checked; else if (e.target.id === 'f-st') filt.st = e.target.value; else return; var id = e.target.id; draw(); el.querySelector('#' + id).focus(); });
      el.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) { filt = { dor: false, sr: false, st: '', q: false }; draw(); } });
    } });
  }

  /* ---------- detalhe ---------- */
  var VID = { 'video-pronto': 'READY', 'video-processando': 'PENDING', 'video-falhou': 'FAILED', 'video-expirado': 'EXPIRED', 'video-nao-liberado': 'NOCONSENT' };
  function detalhe() {
    var V = G7.variant() || 'padrao', gg = G7.gv(V), offline = V === 'offline' || V === 'retorno-offline';
    var sid0 = { 'video-nao-liberado': 'x07', 'troca-exercicio': 'x04', 'serie-extra': 'x03', 'retorno-respondido': 'x02', 'sem-retorno': 'x01', 'em-andamento': 'x06', interrompida: 'x05', 'com-dor': 'x01' }[V] || 'x01';
    var id = G7.param('sessao') || sid0, raw = E.sessions({}).filter(function (x) { return x.id === id; })[0] || null;
    var all = null; /* a sessao so existe se o aluno estiver no portao */
    G7.boot(V, { rows: 4, skel: 'cards', errText: 'Não foi possível carregar a sessão.', render: function (el) {
      var title = document.getElementById('titulo'), sub = document.getElementById('sub');
      if (gg) { var gs = G7.stu(gg.sid); title.textContent = 'Sessão'; sub.textContent = ''; el.innerHTML = '<div class="g5-panel stack">' + G7.gateCard(gg.g) + '<a class="btn btn-secondary" href="' + esc(url('execucoes.html')) + '">Voltar às execuções</a></div>'; return; }
      var s = raw; if (!s) { title.textContent = 'Sessão'; el.innerHTML = window.G6.denied(); return; }
      var sd = G7.stu(s.sid), t = STAT[s.status], mine = true, fb = s.feedback.map(function (f) { return Object.assign({}, f); });
      if (V === 'retorno-respondido' && !fb.some(function (f) { return f.role === 'Você'; })) fb.push({ role: 'Você', name: 'Carla Mendes', body: '[MOCK] Boa sessão.', at: s.date, reactions: ['Curti'] });
      if (V === 'sem-retorno') fb = [];
      title.textContent = 'Sessão de ' + A.fmtDate(s.date); sub.textContent = sd.name + ' · ' + s.label;
      var pain = V === 'com-dor' ? s.pain : s.pain;
      function setsTbl(ex) {
        return '<div class="g6-sets" tabindex="0" role="region" aria-label="Séries de ' + esc(ex.name) + '"><table class="g6-tbl"><caption class="sr-only">Séries de ' + esc(ex.name) + ', previsto e realizado</caption><thead><tr><th scope="col">Série</th><th scope="col">Previsto</th><th scope="col">Repetições</th><th scope="col">Carga (kg)</th><th scope="col">RPE</th><th scope="col">Observação</th></tr></thead><tbody>' +
          ex.sets.map(function (x, i) { return '<tr><td data-label="Série">' + (i + 1) + (x.extra ? ' <span class="badge">Extra</span>' : '') + '</td><td data-label="Previsto">' + esc(x.planned) + '</td><td data-label="Repetições">' + x.reps + '</td><td data-label="Carga (kg)">' + String(x.load).replace('.', ',') + '</td><td data-label="RPE">' + (x.rpe || '-') + '</td><td data-label="Observação">' + esc(x.comment || '-') + '</td></tr>'; }).join('') + '</tbody></table></div>';
      }
      var mine2 = E.sessions({}).filter(function (x) { return x.sid === s.sid; }).slice().reverse();
      var chartItems = mine2.map(function (x) { var mx = 0; x.ex.forEach(function (e) { e.sets.forEach(function (z) { if (z.load > mx) mx = z.load; }); }); return [A.fmtDate(x.date).slice(0, 5), mx]; });
      var sum = 'Carga máxima por sessão em kg: ' + chartItems.map(function (c) { return c[0] + ' ' + String(c[1]).replace('.', ','); }).join(', ') + '. Descrição dos números, sem interpretação.';
      var chart = chartItems.length > 1 ? G4.barChart('g7-carga', 'Carga e RPE por sessão', sum, chartItems, function (v) { return String(v).replace('.', ','); }, ['Sessão', 'Carga máxima (kg)']) : '';
      var vs = VID[V] || (s.video ? s.video : null), vhtml = '';
      var vconsent = sd.consents.VIDEO === 'GRANTED' && V !== 'video-nao-liberado';
      if (V === 'video-nao-liberado' || (s.video && !vconsent)) vhtml = '<p class="g7-hidden-note" role="status">' + ico('lock') + '<span>Vídeo não liberado pelo aluno.</span></p>';
      else if (vs) {
        var map = { READY: '<div class="g7-video" role="group" aria-label="Vídeo enviado pelo aluno"><video controls preload="none" aria-describedby="vd-d" width="320"></video><p id="vd-d" class="muted">Descrição: execução da série de supino [MOCK]. Sem reprodução automática. Link de prazo curto.</p></div>', PENDING: alertBox('info', '', 'Processando o arquivo…'), FAILED: alertBox('danger', '', 'Não foi possível processar o vídeo.'), EXPIRED: alertBox('warning', '', 'O link expirou. <button type="button" class="btn btn-secondary" data-vrefresh>Atualizar</button>'), PURGED: alertBox('info', '', 'Mídia removida') };
        vhtml = map[vs];
      }
      var fmsg = V === 'enviando-retorno' ? 'sending' : V === 'erro-enviar-retorno' ? 'err' : V === 'conflito' ? 'conf' : '';
      var canReply = s.status !== 'IN_PROGRESS' || true;
      var conv = fb.length ? '<ol class="g7-conv">' + fb.map(function (f) { return '<li class="card"><div class="card-body stack-sm"><p class="h4">' + esc(f.role === 'Você' ? 'Você' : f.role === 'Aluno' ? f.name + ' (aluno)' : f.name) + ' <span class="muted">· ' + G7.when(f.at) + '</span></p><p>' + esc(f.body) + '</p><p class="muted">' + (f.role === 'Aluno' ? 'Registrado pelo aluno' : 'Registrado por você') + (f.reactions.length ? ' · Reação: ' + f.reactions.join(', ') : '') + '</p></div></li>'; }).join('') + '</ol>' : '<p class="muted">Nenhum retorno ainda.</p>';
      var opts = '<option>Sessão inteira</option>' + s.ex.map(function (ex) { return ex.sets.map(function (_, i) { return '<option>' + esc(ex.name) + ', série ' + (i + 1) + '</option>'; }).join(''); }).join('');
      var comp = '<section class="card" aria-labelledby="t-ret"><div class="card-header"><h2 class="card-title" id="t-ret">Retorno</h2></div><div class="card-body stack"><div id="conv">' + conv + '</div>' +
        '<p class="g7-legal">' + ico('info') + 'O aluno lê este retorno. Seja claro e respeitoso. Não use para diagnóstico. <span class="muted">[LEGAL] [MOCK] texto provisório.</span></p>' +
        (fmsg === 'err' ? alertBox('danger', '', 'Não foi possível enviar. Nada foi enviado ao aluno. <button type="button" class="btn btn-secondary" data-retry>Tentar de novo</button>') : '') +
        (fmsg === 'conf' ? alertBox('warning', '', 'Esta conversa mudou. <button type="button" class="btn btn-secondary" data-reload>Recarregar</button>') : '') +
        (V === 'retorno-offline' ? alertBox('info', '', 'Sem conexão. O retorno não foi enviado. O texto continua na caixa, mas não é guardado no navegador.') : '') +
        '<div class="field"><label for="r-to">Responder a</label><div class="select-wrap"><select class="select" id="r-to">' + opts + '</select></div></div>' +
        '<div class="field"><label for="r-tx">Escreva o retorno</label><textarea class="textarea" id="r-tx" maxlength="500" rows="3" aria-describedby="r-c"' + (offline || fmsg === 'sending' ? '' : '') + '>' + (V === 'retorno-offline' || fmsg === 'err' || fmsg === 'sending' ? '[MOCK] Bom trabalho na sessão.' : '') + '</textarea><span class="field-help" id="r-c"><span id="r-n">' + ((V === 'retorno-offline' || fmsg === 'err' || fmsg === 'sending') ? 30 : 0) + '</span> de 500 caracteres</span></div>' +
        '<div class="g7-react" role="group" aria-label="Reações rápidas">' + REACT.map(function (r) { return '<button type="button" class="btn btn-secondary" aria-pressed="' + (fb.some(function (f) { return f.role === 'Você' && f.reactions.indexOf(r[0]) !== -1; })) + '" data-react="' + r[0] + '" aria-label="Reagir com ' + r[0] + '"' + (offline ? ' disabled' : '') + '>' + ico(r[1]) + r[0] + '</button>'; }).join('') + '</div>' +
        '<div class="row"><button type="button" class="btn btn-primary" id="b-ret"' + (offline || fmsg === 'sending' || fmsg === 'conf' ? ' disabled' : '') + (fmsg === 'sending' ? ' aria-busy="true"' : '') + '>' + (fmsg === 'sending' ? 'Enviando…' : 'Enviar retorno') + '</button></div>' +
        (offline ? '<p class="g5-hint" role="status">Sem conexão: enviar e reagir ficam desativados.</p>' : '') +
        G7.iaBlock('Sugestão de retorno', 'A IA só sugere. Você escreve e envia.') + '</div></section>';
      el.innerHTML = (V === 'offline' ? G7.offlineBox() : '') + G7.liveBox() + '<div class="row"><a class="btn btn-text" href="' + esc(url('execucoes.html')) + '">' + ico('arrow-left') + 'Voltar às execuções</a><a class="btn btn-text" href="' + esc(url('../alunos/aluno-detalhe.html', 'id=' + sd.id)) + '">Abrir aluno</a></div>' +
        '<div class="g7-xgrid"><div class="stack-lg"><section class="card" aria-labelledby="t-cab"><div class="card-header"><h2 class="card-title" id="t-cab">Resumo da sessão</h2></div><div class="card-body"><dl class="g7-dl"><div><dt>Treino</dt><dd>' + esc(s.label) + '</dd></div><div><dt>Duração</dt><dd>' + s.min + ' min</dd></div><div><dt>Status</dt><dd>' + badge(t[0], t[1], t[2]) + '</dd></div><div><dt>Séries</dt><dd>' + s.done + ' de ' + s.total + '</dd></div><div><dt>Esforço da sessão</dt><dd>' + (s.rpe ? s.rpe + ' de 10' : 'Ainda não informado') + '</dd></div><div><dt>Como chegou</dt><dd>' + esc(s.ready || 'Não informado') + '</dd></div><div><dt>Registro</dt><dd>' + AUTH[s.origin] + '</dd></div></dl></div></section>' +
        s.ex.map(function (ex, i) { return '<section class="card" aria-labelledby="ex' + i + '"><div class="card-header"><h2 class="card-title" id="ex' + i + '">' + esc(ex.name) + '</h2></div><div class="card-body stack">' + (ex.subst ? '<p>' + badge('info', 'refresh', 'Trocado por ' + ex.subst) + ' <span class="muted">Motivo: ' + esc(ex.reason) + '</span></p>' : '') + setsTbl(ex) + '</div></section>'; }).join('') +
        (chart ? '<section class="card" aria-labelledby="t-gr"><div class="card-header"><h2 class="card-title" id="t-gr">Carga e RPE por sessão</h2></div><div class="card-body stack">' + chart + '<p class="muted">Somente descrição dos números: sem interpretação clínica e sem sugestão de carga.</p></div></section>' : '') +
        (pain.length ? '<section class="card" aria-labelledby="t-dor"><div class="card-header"><h2 class="card-title" id="t-dor">Dor relatada</h2></div><div class="card-body stack">' + pain.map(function (p) { return '<p><strong>' + esc(p.region) + '</strong>, intensidade ' + p.intensity + ' de 10, ' + esc(p.setRef) + '. ' + esc(p.note) + '<br><span class="muted">Registrado pelo aluno.</span> <a href="' + esc(url('alertas.html', 'alerta=' + p.alertId)) + '">Ver alerta</a></p>'; }).join('') + '</div></section>' : '') +
        (vhtml ? '<section class="card" aria-labelledby="t-vd"><div class="card-header"><h2 class="card-title" id="t-vd">Vídeo enviado pelo aluno</h2></div><div class="card-body">' + vhtml + '</div></section>' : '') + '</div><div>' + comp + '</div></div>';
      var tx = el.querySelector('#r-tx'), nEl = el.querySelector('#r-n');
      tx.addEventListener('input', function () { nEl.textContent = tx.value.length; if (tx.value.length === 450 || tx.value.length === 500) G7.live(el, tx.value.length + ' de 500 caracteres.'); });
      el.addEventListener('click', function (e) {
        var b;
        if ((b = e.target.closest('[data-react]'))) { var on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', on ? 'false' : 'true'); G7.live(el, on ? 'Reação removida.' : 'Reação enviada.'); return; }
        if (e.target.closest('#b-ret') || e.target.closest('[data-retry]')) { if (!tx.value.trim()) { G7.live(el, 'Escreva o retorno antes de enviar.'); tx.focus(); return; } var c = el.querySelector('#conv'); var ol = c.querySelector('ol') || (c.innerHTML = '<ol class="g7-conv"></ol>', c.querySelector('ol')); var li = document.createElement('li'); li.className = 'card'; li.innerHTML = '<div class="card-body stack-sm"><p class="h4">Você <span class="muted">· agora</span></p><p>' + esc(tx.value) + '</p><p class="muted">Registrado por você</p></div>'; ol.appendChild(li); tx.value = ''; nEl.textContent = '0'; window.AuraUI.toast('Retorno enviado.', { tone: 'success' }); G7.live(el, 'Retorno enviado.'); return; }
        if (e.target.closest('[data-reload]')) location.reload();
        if (e.target.closest('[data-vrefresh]')) window.AuraUI.toast('Link atualizado.', { tone: 'info' });
      });
    } });
  }
  window.G7X = { lista: lista, detalhe: detalhe };
})();
