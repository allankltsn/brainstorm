/* g7-quest.js - TRN-32 Questionarios: lista (modelos, envios, respostas), modelo, enviar e resposta. Depende de g7-core.js. Tudo [MOCK]; nada de saude no navegador; a IA so sugere. */
(function () {
  var G7 = window.G7, G6 = window.G6, G4 = window.G4, A = window.AURA, D = window.G5DATA, E = D.E;
  var esc = G7.esc, ico = G7.ico, badge = G7.badge, alertBox = G7.alertBox, url = G7.url, selo = G7.selo;
  var ST = { PENDING: ['info', 'clock', 'Pendente'], SUBMITTED: ['success', 'check-circle', 'Respondido'], CANCELED: ['neutral', 'ban', 'Cancelado'], OVERDUE: ['danger', 'alert', 'Atrasado'] };
  function stOf(s) { return s.overdue ? ST.OVERDUE : ST[s.status]; }
  function eligible0(sid) { var s = G7.stu(sid); return !!s && D.gate(s, {}).ok; }
  function plano(el) { return alertBox('info', '', 'O seu plano não inclui modelos personalizados. Você pode continuar usando os modelos do sistema. <a class="btn btn-secondary" href="' + esc(url('../planos/planos.html')) + '">Ver planos</a>'); }
  var AUTH = { aluno: 'Registrado pelo aluno', voce: 'Registrado por você' };

  /* ---------- lista com abas ---------- */
  function lista() {
    var V = G7.variant() || 'modelos', gg = G7.gv(V), sid = G7.param('aluno') || (gg && gg.sid) || null;
    var tab = { envios: 'env', 'envio-pendente': 'env', 'envio-atrasado': 'env', 'envio-cancelado': 'env', 'sem-envios': 'env', respostas: 'res', 'sem-respostas': 'res' }[V] || ((gg || V === 'filtro-sem-resultado') && gg ? 'env' : 'mod');
    var st = { tab: tab, q: V === 'filtro-sem-resultado' ? 'zzz' : '' }, offline = V === 'offline';
    G7.boot(V, { rows: 5, skel: 'cards', errText: 'Não foi possível carregar os questionários.', render: function (el) {
      function tplRows() {
        var l = V === 'sem-modelos-proprios' ? E.templates.filter(function (t) { return t.scope === 'GLOBAL'; }) : E.templates;
        return (V === 'sem-modelos-proprios' ? '<p class="muted" role="status">Você ainda não tem modelos próprios. Use um modelo do sistema ou personalize uma cópia.</p>' : '') + '<div class="stack">' + l.map(function (t) {
          return '<article class="card g7-row" aria-labelledby="t-' + t.id + '"><div class="card-body g7-rowbody"><div class="grow stack-sm"><h2 class="h4" id="t-' + t.id + '">' + esc(t.name) + '</h2><div class="row"><span class="badge">' + esc(t.kind) + '</span>' + badge('neutral', t.scope === 'GLOBAL' ? 'external' : 'user', t.scope === 'GLOBAL' ? 'Do sistema' : 'Seu') + '<span class="badge">v' + t.version + '</span>' + badge(t.vstatus === 'Rascunho' ? 'warning' : 'success', t.vstatus === 'Rascunho' ? 'edit' : 'check-circle', t.vstatus) + '<span class="muted">' + G7.plural(t.n, 'pergunta', 'perguntas') + '</span></div></div>' +
            '<a class="btn btn-secondary" href="' + esc(url('questionario-modelo.html', 'id=' + t.id)) + '">' + (t.scope === 'GLOBAL' ? 'Abrir' : 'Editar') + '<span class="sr-only">: ' + esc(t.name) + '</span></a><a class="btn btn-primary" href="' + esc(url('questionario-enviar.html', 'modelo=' + t.id)) + '">Enviar<span class="sr-only">: ' + esc(t.name) + '</span></a></div></article>'; }).join('') + '</div>';
      }
      function subs() {
        var l = E.submissions({}).filter(function (s) { return !sid || s.sid === sid; });
        if (V === 'sem-envios' || V === 'sem-respostas') return [];
        if (st.tab === 'res') l = l.filter(function (s) { return s.status === 'SUBMITTED'; });
        if (V === 'envio-pendente') l = l.filter(function (s) { return s.status === 'PENDING' && !s.overdue; });
        if (V === 'envio-atrasado') l = l.filter(function (s) { return s.overdue; });
        if (V === 'envio-cancelado') l = l.filter(function (s) { return s.status === 'CANCELED'; });
        return l;
      }
      function body() {
        if (st.tab === 'mod') return (V === 'limite-recurso' ? plano() : '') + tplRows();
        if (sid && !G7.stu(sid)) return G6.denied();
        var sg = gg ? gg.g : sid ? D.gate(G7.stu(sid), {}) : null;
        if (sg && !sg.ok) return G7.gateCard(sg) + '<p class="g5-hint">Respostas antigas ficam ocultas, sem contagem. Os modelos continuam acessíveis.</p>';
        var l = subs();
        if (!l.length || st.q) return (st.q ? '<div class="empty-state" role="status"><div class="empty-state-icon">' + ico('search') + '</div><h2 class="h3">Nenhum questionário encontrado para esses filtros.</h2><button type="button" class="btn btn-secondary" data-clear>Limpar filtros</button></div>' : G7.empty('clipboard', st.tab === 'res' ? 'Nenhuma resposta recebida ainda.' : 'Nenhum questionário enviado.', st.tab === 'res' ? '' : 'Envie um check-in para acompanhar como seus alunos estão.'));
        return '<p class="g7-hidden-note" role="status">' + ico('lock') + '<span>Envios de alunos sem saúde liberada ficam ocultos.</span></p><div class="stack">' + l.map(function (s) {
          var t = stOf(s), n = G7.stu(s.sid).name;
          return '<article class="card g7-row" aria-labelledby="s-' + s.id + '"><div class="card-body g7-rowbody"><div class="grow stack-sm"><h2 class="h4" id="s-' + s.id + '">' + esc(n) + ': ' + esc(s.tpl) + ' v' + s.ver + '</h2><p class="muted">Enviado em ' + A.fmtDate(s.sent) + ' · prazo ' + (s.due ? A.fmtDate(s.due) : 'sem prazo') + '</p><div class="row">' + badge(t[0], t[1], t[2]) + '<span class="badge">' + ico('user') + AUTH[s.origin] + '</span></div></div>' +
            '<a class="btn btn-secondary" href="' + esc(url('questionario-resposta.html', 'id=' + s.id)) + '">' + (s.status === 'SUBMITTED' ? 'Ver resposta' : 'Abrir envio') + '<span class="sr-only">: ' + esc(n) + '</span></a></div></article>'; }).join('') + '</div>';
      }
      function draw() {
        el.innerHTML = (offline ? G7.offlineBox() : '') + G7.liveBox() + '<div class="row"><a class="btn btn-primary" href="' + esc(url('questionario-enviar.html')) + (offline ? '" aria-disabled="true" tabindex="-1" style="pointer-events:none;opacity:.5' : '') + '">Enviar questionário</a>' + (offline ? '<span class="g5-hint">Sem conexão: enviar fica desativado.</span>' : '') + '</div>' +
          G7.tabs('Questionários', [['mod', 'Modelos'], ['env', 'Envios'], ['res', 'Respostas']], st.tab, 'qs-') + '<div id="qs-pn" role="tabpanel" aria-labelledby="qs-' + st.tab + '" tabindex="0" class="stack mt-4">' + body() + '</div>' + (st.tab === 'mod' ? G7.iaBlock('Sugestões de perguntas', 'Quando existir, a IA só sugere. Você decide.') : '');
        G7.tabKeys(el, function (k) { st.tab = k; st.q = ''; draw(); el.querySelector('#qs-' + k).focus(); });
      }
      draw();
      el.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) { st.q = ''; draw(); } });
    } });
  }

  /* ---------- modelo (leitura do sistema ou editor limitado da copia) ---------- */
  function modelo() {
    var V = G7.variant() || 'modelo-sistema-leitura', id = G7.param('id') || { 'modelo-sistema-leitura': 't1', 'modelo-copia-rascunho': 't4', 'modelo-publicado': 't5', conflito: 't4', 'erro-validacao': 't4' }[V] || 't1';
    var t = E.templates.filter(function (x) { return x.id === id; })[0] || E.templates[0], ro = t.scope === 'GLOBAL' || t.vstatus === 'Publicada', offline = V === 'offline';
    var qs = E.questions.map(function (q) { return Object.assign({}, q); });
    G7.boot(V, { rows: 5, skel: 'cards', errText: 'Não foi possível carregar o modelo.', render: function (el) {
      document.getElementById('titulo').textContent = t.name; document.getElementById('sub').textContent = (t.scope === 'GLOBAL' ? 'Modelo do sistema, somente leitura.' : ro ? 'Modelo seu, versão publicada.' : 'Sua cópia em rascunho.') + ' v' + t.version;
      function draw() {
        el.innerHTML = (offline ? G7.offlineBox() : '') + G7.liveBox() + (V === 'conflito' ? alertBox('warning', '', 'Há uma versão mais nova do modelo. <button type="button" class="btn btn-secondary" data-reload>Revisar antes de publicar</button>') : '') +
          (V === 'erro-validacao' ? '<div role="alert" class="alert alert-danger">' + ico('alert') + '<div class="alert-body">Escolha ao menos uma pergunta para incluir. <a class="g7-alink" href="#q-' + qs[0].key + '">Ir para a primeira pergunta</a></div></div>' : '') +
          (t.scope === 'GLOBAL' ? alertBox('info', '', 'Este modelo é do sistema. Para mudar, crie uma cópia sua. O original não muda.') : '') +
          (!ro ? alertBox('info', '', 'Escreva perguntas gerais. Não inclua dado de saúde de nenhuma pessoa no texto da pergunta.') : '') +
          '<section class="card" aria-labelledby="t-q"><div class="card-header"><h2 class="card-title" id="t-q">Perguntas</h2></div><div class="card-body stack"><ol class="g7-qs">' + qs.map(function (q, i) {
            return '<li class="g7-q" id="q-' + q.key + '"><div class="grow"><p class="h4">' + esc(q.label) + '</p><p class="muted">' + q.type + (q.std ? ' · campo padrão' : '') + '</p>' + (q.sensitive ? '<p>' + badge('warning', 'lock', 'Sensível: exige consentimento de fotos') + '</p>' : '') + '</div>' +
              (ro ? '<span class="badge">' + (q.on ? 'Incluída' : 'Não incluída') + '</span>' : '<label class="switch"><input type="checkbox" role="switch" data-inc="' + i + '"' + (q.on ? ' checked' : '') + (offline ? ' disabled' : '') + '><span class="switch-text">Incluir<span class="sr-only"> ' + esc(q.label) + '</span> <span data-st="' + i + '">' + (q.on ? '(ligado)' : '(desligado)') + '</span></span></label><button type="button" class="btn btn-text" data-mv="' + i + ':-1"' + (i === 0 || offline ? ' disabled' : '') + '>Subir<span class="sr-only">: ' + esc(q.label) + '</span></button><button type="button" class="btn btn-text" data-mv="' + i + ':1"' + (i === qs.length - 1 || offline ? ' disabled' : '') + '>Descer<span class="sr-only">: ' + esc(q.label) + '</span></button>') + '</li>'; }).join('') + '</ol>' +
          (!ro ? '<div class="row"><button type="button" class="btn btn-secondary"' + (offline ? ' disabled' : '') + '>Adicionar pergunta de texto livre</button></div><p class="g5-hint">Construtor completo: não faz parte desta versão.</p>' : '') + '</div></section>' +
          '<div class="row">' + (t.scope === 'GLOBAL' ? '<button type="button" class="btn btn-primary" data-copy' + (offline ? ' disabled' : '') + '>Personalizar uma cópia</button>' : !ro ? '<button type="button" class="btn btn-primary" data-pub' + (offline ? ' disabled' : '') + '>Publicar versão</button>' : '') + '<a class="btn btn-secondary" href="' + esc(url('questionarios.html')) + '">Voltar</a></div>' + G7.iaBlock('Sugestões de perguntas', 'Quando existir, a IA só sugere. Você decide.');
      }
      draw();
      el.addEventListener('change', function (e) { var i = e.target.dataset && e.target.dataset.inc; if (i == null) return; qs[i].on = e.target.checked; el.querySelector('[data-st="' + i + '"]').textContent = e.target.checked ? '(ligado)' : '(desligado)'; });
      el.addEventListener('click', function (e) {
        var b;
        if ((b = e.target.closest('[data-mv]'))) { var p = b.dataset.mv.split(':'), i = +p[0], n = i + +p[1]; var x = qs.splice(i, 1)[0]; qs.splice(n, 0, x); draw(); G7.live(el, x.label + ' agora na posição ' + (n + 1) + ' de ' + qs.length + '.'); var nb = el.querySelector('[data-mv="' + n + ':' + p[1] + '"]') || el.querySelector('[data-mv="' + n + ':' + (-p[1]) + '"]'); if (nb && !nb.disabled) nb.focus(); return; }
        if (e.target.closest('[data-reload]')) { location.reload(); return; }
        if ((b = e.target.closest('[data-copy]'))) { window.AuraUI.toast('Cópia criada. O original não mudou. Demonstração, nada foi gravado.', { tone: 'success' }); return; }
        if ((b = e.target.closest('[data-pub]'))) G7.modal({ title: 'Publicar a v' + (t.version) + '?', opener: b, okLabel: 'Publicar', body: '<p>Versões publicadas não podem ser alteradas. Questionários já enviados continuam na versão que o aluno recebeu.</p>', onOk: function () { setTimeout(function () { window.AuraUI.toast('Versão publicada. Demonstração, nada foi gravado.', { tone: 'success' }); }, 0); return true; } });
      });
    } });
  }

  /* ---------- enviar (4 passos) ---------- */
  var ROSTER = [['s01', ''], ['s02', ''], ['s03', ''], ['s04', 'Aguardando liberação de saúde'], ['s06', 'Aguardando liberação de saúde'], ['s05', 'Vínculo pausado'], ['s23', 'Vínculo encerrando'], ['s20', 'Conta em espera']];
  function enviar() {
    var V = G7.variant() || 'envio-passo-1', offline = V === 'offline';
    var step = { 'envio-passo-1': 1, 'envio-passo-2': 2, 'envio-passo-3': 3, 'envio-resumo': 4, 'envio-foto-sem-consentimento': 2, 'envio-sem-alunos-elegiveis': 2, enviando: 4, 'erro-enviar': 4, 'erro-validacao': 1, conflito: 4, 'limite-recurso': 1 }[V] || 1;
    var sel = { model: V === 'erro-validacao' ? '' : (G7.param('modelo') || 't1'), alunos: V === 'envio-foto-sem-consentimento' ? ['s02'] : (V === 'envio-passo-1' || V === 'erro-validacao' || V === 'envio-sem-alunos-elegiveis' || V === 'limite-recurso' ? (G7.param('aluno') && eligible0(G7.param('aluno')) ? [G7.param('aluno')] : []) : ['s01']), due: false, msg: '' };
    var err = V === 'erro-validacao' ? 'Escolha um modelo.' : '';
    G7.boot(V, { rows: 4, skel: 'cards', errText: 'Não foi possível carregar o envio.', render: function (el) {
      var pubs = E.templates.filter(function (t) { return t.vstatus === 'Publicada'; });
      function tpl() { return E.templates.filter(function (t) { return t.id === sel.model; })[0]; }
      function eligible(sid) { return D.gate(G7.stu(sid), {}).ok; }
      function stepper() { return '<ol class="stepper" aria-label="Passos do envio">' + ['Modelo', 'Aluno', 'Prazo e mensagem', 'Resumo'].map(function (l, i) { return '<li' + (i + 1 === step ? ' aria-current="step"' : '') + '><span class="stepper-label">' + (i + 1) + '. ' + l + '</span></li>'; }).join('') + '</ol>'; }
      function main() {
        if (step === 1) return '<fieldset class="field g7-fs"><legend class="h3">Escolher o modelo</legend>' + (err ? '<p class="field-error" role="alert" id="e-m">' + err + '</p>' : '') + (V === 'limite-recurso' ? plano() : '') + pubs.map(function (t) { return '<label class="check g7-opt"><input type="radio" name="m" value="' + t.id + '"' + (sel.model === t.id ? ' checked' : '') + '><span class="check-text">' + esc(t.name) + ' · v' + t.version + '<small>' + t.kind + ' · ' + (t.scope === 'GLOBAL' ? 'Do sistema' : 'Seu') + '</small></span></label>'; }).join('') + '</fieldset>';
        if (step === 2) {
          var noElig = V === 'envio-sem-alunos-elegiveis';
          return '<fieldset class="field g7-fs"><legend class="h3">Escolher aluno(s)</legend>' + (err ? '<p class="field-error" role="alert" id="e-a">' + err + '</p>' : '') + (noElig ? alertBox('info', '', 'Nenhum aluno pode receber agora. Os alunos aparecem aqui quando liberarem a saúde.') : '') +
            ROSTER.map(function (r) { var dis = noElig || !eligible(r[0]) || !!r[1], nm = G7.stu(r[0]).name, why = r[1] || (noElig ? 'Aguardando liberação de saúde' : '');
              var photo = tpl() && tpl().id === 't3' || V === 'envio-foto-sem-consentimento'; var noPhoto = photo && !dis && G7.stu(r[0]).consents.FOTOS !== 'GRANTED';
              return '<label class="check g7-opt"><input type="checkbox" name="al" value="' + r[0] + '"' + (sel.alunos.indexOf(r[0]) !== -1 ? ' checked' : '') + (dis ? ' disabled aria-describedby="w-' + r[0] + '"' : '') + '><span class="check-text">' + esc(r[0] === 's20' ? 'Aluno' : nm) + (dis ? '<small id="w-' + r[0] + '">' + esc(why || 'Aguardando liberação de saúde') + '</small>' : noPhoto ? '<small>Pergunta de foto desabilitada: exige consentimento de fotos. Sensível.</small>' : '') + '</span></label>'; }).join('') + '</fieldset>';
        }
        if (step === 3) return '<div class="stack"><h2 class="h3">Prazo e mensagem</h2><label class="check"><input type="checkbox" id="due"' + (sel.due ? ' checked' : '') + '><span class="check-text">Definir prazo<small>Mínimo: amanhã. Sem recorrência automática nesta versão.</small></span></label><div class="field" id="due-f"' + (sel.due ? '' : ' hidden') + '><label for="due-d">Data do prazo</label><input class="input" type="date" id="due-d" min="2026-10-17"></div>' +
          '<div class="field"><label for="msg">Mensagem opcional</label><textarea class="textarea" id="msg" rows="3" maxlength="300" aria-describedby="msg-h"></textarea><span class="field-help" id="msg-h">Não escreva informação de saúde, a menos que o aluno já tenha liberado. A mensagem não é guardada no navegador.</span></div></div>';
        var t = tpl() || {}, names = sel.alunos.map(function (s) { return G7.stu(s).name; });
        return '<div class="stack"><h2 class="h3">Resumo</h2><dl class="g7-dl"><div><dt>Modelo</dt><dd>' + esc(t.name || '') + ' v' + (t.version || '') + '</dd></div><div><dt>Alunos</dt><dd>' + esc(names.join(', ') || 'Nenhum') + '</dd></div><div><dt>Prazo</dt><dd>' + (sel.due ? 'Definido' : 'Sem prazo') + '</dd></div></dl>' +
          '<ul class="g4-list-plain"><li>O aluno recebe o questionário no app e é avisado.</li><li>Ele escolhe o que responder; você só vê as respostas enviadas.</li><li>Se passar do prazo, você recebe um alerta de check-in atrasado.</li></ul>' +
          (V === 'erro-enviar' ? alertBox('danger', '', 'Não foi possível enviar. Nada foi enviado ao aluno. <button type="button" class="btn btn-secondary" data-send>Tentar de novo</button>') : '') + (V === 'conflito' ? alertBox('warning', '', 'Há uma versão mais nova do modelo. <button type="button" class="btn btn-secondary" data-reload>Revisar antes de enviar</button>') : '') + '</div>';
      }
      function draw() {
        var noEl = step === 2 && (V === 'envio-sem-alunos-elegiveis');
        el.innerHTML = (offline ? G7.offlineBox() : '') + G7.liveBox() + '<div class="g7-enviar"><div class="stack-lg">' + stepper() + '<div class="card"><div class="card-body stack">' + main() + '</div></div>' +
          '<div class="row">' + (step > 1 ? '<button type="button" class="btn btn-secondary" data-prev>Voltar</button>' : '') + (step < 4 ? '<button type="button" class="btn btn-primary" data-next' + (noEl ? ' disabled' : '') + '>Continuar</button>' : '<button type="button" class="btn btn-secondary" data-send' + (offline || V === 'enviando' || V === 'conflito' ? ' disabled' : '') + (V === 'enviando' ? ' aria-busy="true"' : '') + '>' + (V === 'enviando' ? 'Enviando…' : 'Enviar') + '</button>') + '<a class="btn btn-secondary" href="' + esc(url('questionarios.html')) + '">Cancelar</a></div>' + (offline ? '<p class="g5-hint">Sem conexão: enviar fica desativado.</p>' : '') + '</div>' +
          '<aside class="card g7-side" aria-labelledby="t-res"><div class="card-body stack-sm"><h2 class="h4" id="t-res">Resumo</h2><p class="muted">Modelo: ' + esc((tpl() || {}).name || 'não escolhido') + '</p><p class="muted">Alunos: ' + sel.alunos.length + '</p></div></aside></div>';
        var f = el.querySelector('.field-error'); if (f && err) { var inp = el.querySelector('input'); if (inp) inp.setAttribute('aria-describedby', f.id); }
      }
      draw();
      el.addEventListener('change', function (e) {
        if (e.target.name === 'm') sel.model = e.target.value;
        else if (e.target.name === 'al') { var i = sel.alunos.indexOf(e.target.value); if (e.target.checked && i === -1) sel.alunos.push(e.target.value); else if (i !== -1) sel.alunos.splice(i, 1); }
        else if (e.target.id === 'due') { sel.due = e.target.checked; el.querySelector('#due-f').hidden = !sel.due; }
      });
      el.addEventListener('click', function (e) {
        if (e.target.closest('[data-next]')) { err = step === 1 && !sel.model ? 'Escolha um modelo.' : step === 2 && !sel.alunos.length ? 'Escolha ao menos um aluno.' : ''; if (!err) { step += 1; draw(); el.querySelector('h2').focus && el.querySelector('h2').setAttribute('tabindex', '-1'); el.querySelector('h2').focus(); } else { draw(); var er = el.querySelector('.field-error'); if (er) { er.setAttribute('tabindex', '-1'); er.focus(); } } return; }
        if (e.target.closest('[data-prev]')) { step -= 1; err = ''; draw(); return; }
        if (e.target.closest('[data-reload]')) { location.reload(); return; }
        var sb = e.target.closest('[data-send]'); if (sb) G7.modal({ title: 'Enviar este questionário?', opener: sb, okLabel: 'Enviar', body: '<ul class="g4-list-plain"><li>O aluno recebe o questionário no app e é avisado.</li><li>Ele escolhe o que responder.</li></ul>', onOk: function () { G5.flash('Questionário enviado.', 'success'); setTimeout(function () { location.href = url('questionarios.html', 'variant=envios'); }, 0); return true; } });
      });
    } });
  }
  var G5 = window.G5;

  /* ---------- resposta ---------- */
  function resposta() {
    var V = G7.variant() || 'resposta-detalhe', gg = G7.gv(V);
    var id = G7.param('id') || { 'envio-pendente': 'q01', 'envio-atrasado': 'q04', 'envio-cancelado': 'q08' }[V] || 'q06';
    G7.boot(V, { rows: 4, skel: 'cards', errText: 'Não foi possível carregar a resposta.', render: function (el) {
      var s = gg ? null : E.submission(id, {}), tl = document.getElementById('titulo');
      if (!gg && !s) { tl.textContent = 'Questionário'; el.innerHTML = G6.denied(); return; }
      if (gg) { tl.textContent = 'Questionário'; el.innerHTML = '<div class="g5-panel stack">' + G7.gateCard(gg.g) + '<a class="btn btn-secondary" href="' + esc(url('questionarios.html')) + '">Voltar</a></div>'; return; }
      var t = stOf(s), ans = E.answers(id, {}), n = G7.stu(s.sid).name;
      tl.textContent = s.tpl; document.getElementById('sub').textContent = n + ' · versão ' + s.ver;
      var ch = G4.barChart('g7-peso', 'Evolução do peso', 'Peso em kg: ' + E.weights.map(function (w) { return w[0] + ' ' + String(w[1]).replace('.', ','); }).join(', ') + '. Somente descrição numérica.', E.weights, function (v) { return String(v).replace('.', ','); }, ['Data', 'Peso (kg)']);
      el.innerHTML = '<div class="g5-panel stack-lg"><div class="row">' + badge(t[0], t[1], t[2]) + '<span class="badge">' + ico('user') + AUTH[s.origin] + '</span></div><p class="muted">Enviado em ' + A.fmtDate(s.sent) + ' · prazo ' + (s.due ? A.fmtDate(s.due) : 'sem prazo') + (s.at ? ' · respondido em ' + A.fmtDate(s.at) : '') + '</p>' +
        (s.overdue ? alertBox('warning', '', 'Passou do prazo. Um alerta de check-in atrasado foi gerado. <a class="btn btn-secondary" href="' + esc(url('mensagens.html', 'aluno=' + s.sid)) + '">Falar com o aluno</a>') : '') +
        (s.status === 'CANCELED' ? alertBox('info', '', 'Envio cancelado. O aluno não pode mais responder.') : '') +
        (s.status === 'PENDING' ? '<button type="button" class="btn btn-secondary" data-cancel>Cancelar envio</button>' : '') +
        (ans ? '<section class="card" aria-labelledby="t-r"><div class="card-header"><h2 class="card-title" id="t-r">Respostas</h2></div><div class="card-body"><dl class="g7-dl">' + ans.map(function (a) { return '<div><dt>' + esc(a[0]) + '</dt><dd>' + esc(a[1]) + '</dd></div>'; }).join('') + '</dl><p class="muted">Sem edição de resposta pelo personal.</p></div></section><section class="card" aria-labelledby="t-e"><div class="card-header"><h2 class="card-title" id="t-e">Evolução</h2></div><div class="card-body">' + ch + '</div></section>' : (s.status === 'PENDING' ? '<p class="muted">Ainda sem resposta.</p>' : '')) +
        '<a class="btn btn-secondary" href="' + esc(url('questionarios.html', 'variant=envios')) + '">Voltar aos envios</a></div>';
      var cb = el.querySelector('[data-cancel]'); if (cb) cb.addEventListener('click', function () { G7.modal({ title: 'Cancelar este envio?', opener: cb, okLabel: 'Cancelar envio', cancelLabel: 'Manter envio', body: '<p>O aluno deixa de poder responder.</p>', onOk: function () { setTimeout(function () { window.AuraUI.toast('Envio cancelado. Demonstração, nada foi gravado.', { tone: 'info' }); }, 0); return true; } }); });
    } });
  }
  window.G7Q = { lista: lista, modelo: modelo, enviar: enviar, resposta: resposta };
})();
