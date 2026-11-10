/* g7-chat.js - TRN-33 Chat privado (selo C1). Depende de g7-core.js. Tudo [MOCK]. Texto de mensagem NUNCA vai para o navegador (sem storage); previa omitida na lista. */
(function () {
  var G7 = window.G7, G5 = window.G5, A = window.AURA, D = window.G5DATA, E = D.E;
  var esc = G7.esc, ico = G7.ico, badge = G7.badge, alertBox = G7.alertBox, url = G7.url, selo = G7.selo;
  /* [MOCK] verificacao PARCIAL por palavras: sem acento/caixa, letras repetidas e 0/1/3/4 trocados por letras; nao detecta tudo. */
  var EXACT = ['dor', 'dores', 'dolorido', 'dolorida', 'doi', 'doendo', 'dodoi', 'asma', 'febre', 'gripe', 'covid', 'pressao', 'remedio', 'remedios', 'exame', 'exames', 'laudo', 'dieta'];
  var STEMS = ['lesa', 'lesoe', 'lesion', 'doenc', 'doent', 'medicament', 'medicac', 'diabet', 'hipertens', 'cardiac', 'coracao', 'cirurgi', 'joelho', 'ombro', 'tornozelo', 'lombar', 'coluna', 'tendin', 'fratur', 'entorse', 'torcao', 'hernia', 'artrose', 'artrite', 'gravid', 'gestan', 'sintoma', 'diagnost', 'saude', 'alergi', 'ansiedad', 'depress', 'tontur', 'dormenc', 'inchac', 'machuc', 'colesterol', 'insulina', 'fisioterap', 'cansac', 'sangr'];
  function norm(w) { return w.replace(/(.)\1+/g, '$1'); }
  var EXACTN = EXACT.map(norm), STEMSN = STEMS.map(norm);
  function looksHealth(t) {
    var s = String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return s.split(/[^a-z0-9@$]+/).some(function (w) {
      if (!/[a-z]/.test(w)) return false;
      w = norm(w.replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4|@/g, 'a').replace(/\$/g, 's'));
      return EXACTN.indexOf(w) !== -1 || STEMSN.some(function (p) { return w.indexOf(p) === 0; });
    });
  }

  function mensagens() {
    var V = G7.variant() || 'lista', gg = G7.gv(V), offline = V === 'offline';
    var cid = { conversa: 'c1', 'nao-lidas': 'c1', enviando: 'c1', 'falhou-envio': 'c1', 'com-anexo-liberado': 'c1', 'limite-caracteres': 'c1', conflito: 'c1', offline: 'c1', 'conversa-vazia': 'c1', 'sem-anexo': 'c2', 'saude-detectada': 'c4', 'mensagem-geral-sem-consentimento': 'c4', 'nao-confirmado': 'c1' }[V] || null;
    var sidParam = G7.param('aluno'); if (sidParam) { var pc = E.convs.filter(function (c) { return c.sid === sidParam; })[0]; cid = pc ? pc.id : 'v-' + sidParam; }
    if (gg) { var ex = E.convs.filter(function (c) { return c.sid === gg.sid; })[0]; cid = ex ? ex.id : 'v-' + gg.sid; }
    var convs = V === 'sem-conversas' ? [] : E.convs.map(function (c) { return Object.assign({}, c); });
    if (cid && cid.indexOf('v-') === 0) convs.push({ id: cid, sid: cid.slice(2), unread: 0, last: '2026-10-10T10:00', lastText: '10/10', virtual: true });
    if (sidParam && !G7.stu(sidParam)) { G7.boot(V, { rows: 6, skel: 'list', errText: 'Não foi possível carregar as mensagens.', render: function (el) { el.innerHTML = window.G6.denied(); } }); return; }
    G7.boot(V, { rows: 6, skel: 'list', errText: 'Não foi possível carregar as mensagens.', render: function (el) {
      var st = { cid: cid, q: '' }, sent = {}, draft = {}, dropped = false;
      function cur() { return convs.filter(function (c) { return c.id === st.cid; })[0]; }
      function opts() { return V === 'nao-confirmado' ? { stale: true } : {}; }
      function listHtml() {
        var l = convs.filter(function (c) { return !st.q || G7.stu(c.sid).name.toLowerCase().indexOf(st.q.toLowerCase()) !== -1; });
        if (!convs.length) return G7.empty('mail', 'Nenhuma conversa ainda.', 'Quando você ou um aluno enviar uma mensagem, ela aparece aqui.', '<p>' + selo('C1') + '</p>');
        return '<ul class="g7-convs">' + l.map(function (c) {
          var s = G7.stu(c.sid), g = D.gate(s, c.id === st.cid ? opts() : {}), hold = g.reason === 'idade', nm = hold ? 'Aluno' : s.name;
          var lk = s.status === 'SUSPENDED' ? badge('warning', 'clock', 'Vínculo pausado') : s.status === 'ENDING' ? badge('warning', 'clock', 'Vínculo encerrando') : s.status === 'ENDED' ? badge('neutral', 'ban', 'Vínculo encerrado') : '';
          return '<li><button type="button" class="g7-conv-btn' + (c.id === st.cid ? ' is-current' : '') + '" data-conv="' + c.id + '"' + (c.id === st.cid ? ' aria-current="true"' : '') + '><span class="avatar avatar-sm avatar-neutral" aria-hidden="true">' + esc(A.initials(nm)) + '</span><span class="grow"><strong>' + esc(nm) + '</strong><br><span class="muted">' + (c.unread ? 'Nova mensagem · ' : 'Última mensagem · ') + esc(c.lastText) + '</span></span>' + (c.unread ? '<span class="badge badge-primary">' + c.unread + ' ' + (c.unread === 1 ? 'não lida' : 'não lidas') + '</span>' : '') + lk + '</button></li>'; }).join('') + '</ul>';
      }
      function bubble(m, last) {
        var mine = m.role === 'PERSONAL';
        return '<li class="g7-msg ' + (mine ? 'is-mine' : '') + '"><div class="card"><div class="card-body stack-sm"><p class="h4">' + (mine ? 'Você' : esc(G7.first(G7.stu(cur().sid).name))) + ' <span class="muted">· ' + G7.when(m.at) + '</span></p><p>' + esc(m.body) + '</p>' + (m.state ? '<p class="muted">' + ico(m.state === 'FAILED' ? 'alert' : 'clock') + ' ' + (m.state === 'FAILED' ? 'Não enviada' : 'Enviando…') + '</p>' + (m.state === 'FAILED' ? '<div class="row"><button type="button" class="btn btn-secondary" data-retry>Tentar de novo</button><button type="button" class="btn btn-secondary" data-drop>Apagar este rascunho</button></div>' : '') : '') + '</div></div></li>';
      }
      function convHtml() {
        var c = cur(); if (!c) return '<div class="g7-nosel"><p class="muted">Escolha uma conversa.</p></div>';
        var s = G7.stu(c.sid), g = D.gate(s, opts()), hold = g.reason === 'idade', nm = hold ? 'Aluno' : s.name;
        var head = '<div class="row-between g7-chead"><button type="button" class="btn btn-text g7-cback" data-cback>' + ico('arrow-left') + 'Voltar para as conversas</button><h2 class="h3" id="g7-ch" tabindex="-1">' + esc(nm) + '</h2><a class="btn btn-secondary" href="' + esc(url('../alunos/aluno-detalhe.html', 'id=' + s.id)) + '">Abrir aluno</a></div>';
        if (hold) return head + G7.gateCard(g);
        if (s.status === 'ENDED') return head + '<p class="h4">Conversa encerrada.</p>' + G7.gateCard(g);
        if (s.status === 'SUSPENDED' || s.status === 'ENDING') return head + G7.gateCard(g) + alertBox('warning', '', s.status === 'SUSPENDED' ? 'Vínculo pausado. Você não pode enviar mensagens agora.' : 'Vínculo em encerramento. Não é possível enviar mensagens.') + composer(s, g, true);
        var msgs = g.ok ? E.messages(c.id, opts()) : [];
        if (V === 'conversa-vazia') msgs = [];
        var all = msgs.concat(sent[c.id] || []);
        if (dropped) all = all.filter(function (m) { return m.state !== 'FAILED'; });
        if (V === 'enviando') all = all.concat([{ role: 'PERSONAL', at: E.today + 'T10:30', body: '[MOCK] Combinado, até sexta.', state: 'SENDING' }]);
        if (V === 'falhou-envio') all = all.concat([{ role: 'PERSONAL', at: E.today + 'T10:30', body: '[MOCK] Combinado, até sexta.', state: 'FAILED' }]);
        var body;
        if (!g.ok) body = G7.gateCard(g) + '<p class="g5-hint">Mensagens ocultas por privacidade. Depois da revogação o histórico fica oculto.</p>' + ((sent[c.id] || []).length ? '<p class="h4">Enviadas nesta sessão</p><ol class="g7-log" aria-label="Mensagens enviadas nesta sessão para ' + esc(nm) + '">' + sent[c.id].map(bubble).join('') + '</ol>' : '');
        else if (!all.length) body = '<p class="muted">Comece a conversa com ' + esc(G7.first(s.name)) + '.</p>';
        else body = '<ol class="g7-log" aria-label="Conversa com ' + esc(nm) + '">' + all.map(bubble).join('') + '</ol>';
        return head + '<p class="g5-hint">Para comentar uma sessão ou série, use o retorno na tela de Execuções.</p>' + (V === 'conflito' ? alertBox('warning', '', 'A conversa mudou. <button type="button" class="btn btn-secondary" data-reload>Recarregar</button>') : '') + body + composer(s, g, false);
      }
      function composer(s, g, off) {
        var general = !g.ok && !off, attach = g.ok && (s.consents.FOTOS === 'GRANTED' || s.consents.VIDEO === 'GRANTED') && V !== 'sem-anexo';
        var pre = draft[st.cid] != null ? draft[st.cid] : V === 'saude-detectada' ? '[MOCK] Como está a dor?' : V === 'limite-caracteres' ? new Array(1002).join('a') : '';
        var disabled = off || offline;
        return '<section class="g7-comp" aria-labelledby="t-comp"><h3 class="sr-only" id="t-comp">Escrever mensagem</h3>' +
          (general ? '<p class="g7-legal" id="c-av">' + ico('lock') + 'Mensagem geral: o aluno não liberou dados de saúde. Escreva só sobre assuntos gerais, como horários e avisos. <span class="muted">[LEGAL] [MOCK] texto provisório.</span></p>' : g.ok ? '<p class="g7-legal" id="c-av">' + ico('info') + 'Mensagens podem tratar de saúde porque o aluno liberou esse acesso. Só você, os outros responsáveis e o gestor veem esta conversa. <span class="muted">[LEGAL] [MOCK] texto provisório.</span></p>' : '<p class="g5-hint" id="c-av">Envio desativado.</p>') +
          (offline ? alertBox('info', '', 'Sem conexão. A mensagem não foi enviada.') : '') +
          '<div id="c-warn"></div><div class="field"><label for="c-tx">Escreva uma mensagem</label><textarea class="textarea" id="c-tx" rows="3" aria-describedby="c-av c-n"' + (disabled ? ' disabled' : '') + '>' + pre + '</textarea><span class="field-help" id="c-n"><span id="c-cnt">' + pre.length + '</span> de 1000 caracteres<span id="c-over" class="field-error"></span></span></div>' +
          (attach ? '<div class="row"><button type="button" class="btn btn-secondary"' + (disabled ? ' disabled' : '') + '>' + ico('upload') + 'Anexar</button><span class="g5-hint">Anexo permitido porque o aluno liberou fotos ou vídeos. ' + selo('C1') + '</span></div>' : '<p class="g5-hint">Anexos ficam disponíveis quando o aluno liberar fotos ou vídeos.</p>') +
          '<div class="row"><button type="button" class="btn btn-primary" id="c-send"' + (disabled || pre.length > 1000 ? ' disabled' : '') + '>Enviar</button><span class="g5-hint">Ctrl+Enter também envia; Enter quebra a linha.</span></div><div data-g7-live class="sr-only" role="status" aria-live="polite"></div>' +
          (g.ok ? G7.iaBlock('Sugestão de resposta', 'A IA só sugere. Você escreve e envia.') : '') + '</section>';
      }
      function draw() {
        el.innerHTML = (offline ? G7.offlineBox() : '') + '<div class="g7-chatgrid' + (st.cid ? ' has-conv' : '') + '"><section class="g7-list card" aria-labelledby="t-lc"><div class="card-body stack"><h2 class="h4" id="t-lc">Conversas</h2><div class="field"><label for="c-q">Buscar por nome</label><input class="input" id="c-q" type="search" autocomplete="off" value="' + esc(st.q) + '"></div>' + listHtml() + '</div></section><section class="g7-conv-pane card" aria-label="Conversa"><div class="card-body stack">' + convHtml() + '</div></section></div>';
        var tx = el.querySelector('#c-tx'); if (tx && V === 'limite-caracteres') updCount(tx);
      }
      function updCount(tx) { var n = tx.value.length, o = el.querySelector('#c-over'), b = el.querySelector('#c-send'); el.querySelector('#c-cnt').textContent = n; if (o) o.textContent = n > 1000 ? ' A mensagem passou do limite.' : ''; if (b && !offline) b.disabled = n > 1000; }
      function doSend() {
        var tx = el.querySelector('#c-tx'), c = cur(), g = D.gate(G7.stu(c.sid), opts()), w = el.querySelector('#c-warn'); if (!tx.value.trim() || tx.value.length > 1000) return;
        if (!g.ok && looksHealth(tx.value)) { w.innerHTML = alertBox('warning', '', 'Esta mensagem parece tratar de saúde, e o aluno não liberou esse tipo de informação. O envio está bloqueado: edite o texto para tratar só de assuntos gerais. <span class="muted">[MOCK] verificação provisória e parcial, por palavras: ela não detecta todos os casos, então revise o texto também. [LEGAL].</span> <div class="row mt-2"><button type="button" class="btn btn-primary" data-edit>Editar</button></div>'); w.querySelector('[data-edit]').focus(); return; }
        (sent[c.id] = sent[c.id] || []).push({ role: 'PERSONAL', at: E.today + 'T10:40', body: tx.value }); window.AuraUI.toast('Mensagem enviada.', { tone: 'success' }); st.q = ''; delete draft[c.id]; draw(); G7.live(el, 'Mensagem enviada.'); var t2 = el.querySelector('#c-tx'); if (t2) t2.focus();
      }
      draw();
      el.addEventListener('click', function (e) {
        var b;
        if ((b = e.target.closest('[data-conv]'))) { st.cid = b.dataset.conv; draw(); var h = el.querySelector('#g7-ch'); if (h) h.focus(); return; }
        if (e.target.closest('[data-cback]')) { st.cid = null; draw(); return; }
        if (e.target.closest('[data-reload]')) { location.reload(); return; }
        if (e.target.closest('#c-send')) { doSend(); return; }
        if (e.target.closest('[data-edit]')) { el.querySelector('#c-warn').innerHTML = ''; el.querySelector('#c-tx').focus(); return; }
        if (e.target.closest('[data-drop]')) { dropped = true; draw(); window.AuraUI.toast('Rascunho apagado.', { tone: 'info' }); var t4 = el.querySelector('#c-tx'); if (t4) t4.focus(); return; }
        if (e.target.closest('[data-retry]')) { window.AuraUI.toast('Mensagem enviada.', { tone: 'success' }); }
      });
      el.addEventListener('input', function (e) {
        if (e.target.id === 'c-tx') { draft[st.cid] = e.target.value; updCount(e.target); return; }
        if (e.target.id === 'c-q') { st.q = e.target.value; var pos = e.target.selectionStart; draw(); var q = el.querySelector('#c-q'); q.focus(); q.setSelectionRange(pos, pos); }
      });
      el.addEventListener('keydown', function (e) { if (e.target.id === 'c-tx' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); doSend(); } });
    } });
  }
  window.G7C = { mensagens: mensagens };
})();
