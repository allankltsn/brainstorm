/* grupo-g5.js - helpers do G5 (training: Meus alunos). Carregar depois de grupo-g4.js, data.js, data-g5.js e shell.js. Reusa G4 (url, esc, ico, barChart). */
(function () {
  var G4 = window.G4, A = window.AURA, D = window.G5DATA;
  var esc = G4.esc, ico = G4.ico;
  var Q = G4.q;

  function mount(o) {
    G4.setDefaultRole('personal');
    var r = G4.routes(); r.alunos = G4.url('meus-alunos.html');
    window.AuraShell.mount({ role: 'personal', active: 'alunos', title: o.title, routes: r });
    document.addEventListener('aura:shellready', function () { document.title = o.id + ' · ' + o.title + ' · aura-fit'; });
  }
  function url(p, extra) { return G4.url(p, extra); }
  function breadcrumb(items) {
    return '<nav aria-label="Você está em" class="mb-2"><ol class="breadcrumb">' + items.map(function (it, i) {
      return '<li>' + (i === items.length - 1 ? '<span aria-current="page">' + esc(it[0]) + '</span>' : '<a href="' + esc(it[1]) + '">' + esc(it[0]) + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
  }

  /* ---- selo "Requer API nova": sempre com texto e icone; id aponta _pendencias-api-training.md ---- */
  function selo(id) {
    return '<span class="badge badge-info g5-selo" data-pend="' + id + '" title="Esta função ainda não existe na API do aura-training">' + ico('info') + 'Requer API nova<span class="sr-only">. Esta função ainda não existe na API do aura-training. Registro ' + id + '.</span></span>';
  }

  /* ---- badges de estado (sempre texto + icone) ---- */
  function badge(tone, icon, text) { return '<span class="badge badge-' + tone + '">' + ico(icon) + esc(text) + '</span>'; }
  function consentBadge(state) {
    if (state === 'GRANTED') return badge('success', 'check-circle', 'Saúde liberada');
    if (state === 'REVOKED') return badge('danger', 'ban', 'Saúde revogada');
    return badge('neutral', 'lock', 'Saúde não liberada');
  }
  function modeBadge(m) { return '<span class="badge">' + ico(m === 'PRESENCIAL' ? 'user' : 'monitor') + (m === 'PRESENCIAL' ? 'Presencial' : 'Remoto') + '</span>'; }
  function alertBadge(n) { return n > 0 ? badge('warning', 'alert', n + (n === 1 ? ' alerta aberto' : ' alertas abertos')) : '<span class="badge">' + ico('check') + 'Nenhum</span>'; }
  function linkBadge(st) {
    var m = { ACTIVE: ['success', 'check-circle', 'Ativo'], SUSPENDED: ['warning', 'clock', 'Pausado'], ENDING: ['warning', 'clock', 'Encerrando'], ENDED: ['neutral', 'ban', 'Encerrado'] }[st.status];
    return badge(m[0], m[1], m[2]);
  }
  function avatar(name, cls) { return '<span class="avatar ' + (cls || 'avatar-sm') + ' avatar-neutral" aria-hidden="true">' + esc(A.initials(name)) + '</span>'; }
  function time(s) { return '<time datetime="' + esc(s) + '">' + A.fmtDate(s) + '</time>'; }

  /* ---- faixa de privacidade (componente g5-privacidade, TRN-02/03/04) ---- */
  function privacidade() {
    return '<details class="g5-privacy"><summary>' + ico('shield') + '<span>Este aluno sabe que você, os outros responsáveis e o gestor da conta veem os dados que ele liberou.</span><span class="g5-privacy-more">Entender</span></summary>' +
      '<div class="g5-privacy-body"><p>Cada tipo de dado só aparece para você se o aluno liberou. Quem liberou pode retirar a liberação quando quiser. Depois disso os dados ficam guardados e ocultos para você e para o gestor.</p>' +
      '<p class="muted">[LEGAL] [MOCK] texto provisório, a redação final depende de revisão jurídica.</p></div></details>';
  }
  function lock(title, text, tone) {
    return '<div class="g5-lock' + (tone ? ' is-' + tone : '') + '" role="status"><span class="g5-lock-icon">' + ico(tone === 'warning' ? 'alert' : 'lock') + '</span><div><h3 class="h3">' + esc(title) + '</h3><p>' + esc(text) + '</p></div></div>';
  }
  /* cartao "Oculto por privacidade" (PRV-A-01..04): sem contagem, sem previa, so o motivo. g = D.gate(...) */
  function privCard(g) { return lock('Oculto por privacidade', g.text, g.reason === 'idade' ? 'warning' : ''); }
  function alertBox(tone, title, text, extra) {
    var ic = { info: 'info', warning: 'alert', danger: 'alert', success: 'check-circle' }[tone];
    return '<div class="alert alert-' + tone + '" role="' + (tone === 'danger' ? 'alert' : 'status') + '">' + ico(ic) + '<div class="alert-body">' + (title ? '<div class="alert-title">' + esc(title) + '</div>' : '') + text + '</div>' + (extra || '') + '</div>';
  }
  function offlineAlert() {
    return alertBox('info', 'Conexão lenta', 'Mostrando os dados da última carga, às 14:32. Ações que alteram dados ficam desativadas até a conexão voltar.');
  }
  function soon(label, why) {
    return '<button type="button" class="btn btn-neutral" disabled aria-disabled="true" title="' + esc(why || 'Em breve') + '">' + esc(label) + '<span class="badge g5-soon">Em breve</span></button>';
  }

  /* ---- avisos curtos entre telas (toast via sessionStorage) ---- */
  function flash(msg, tone) { try { sessionStorage.setItem('g5-flash', JSON.stringify([msg, tone || 'success'])); } catch (e) {} }
  function showFlash() {
    try { var f = JSON.parse(sessionStorage.getItem('g5-flash')); if (f) { sessionStorage.removeItem('g5-flash'); window.AuraUI.toast(f[0], { tone: f[1] }); } } catch (e) {}
  }

  /* ---- TRN-03: painel de saude, usado na aba Saude de TRN-02 e em aluno-saude.html ----
     opts: { variant, backHref, mediaHref } ; variant: liberado|nunca-liberado|revogado|nao-confirmado|menor-em-espera|vazio|erro */
  function consentPanel(st, stale) {
    return '<section class="card g5-consent-panel" aria-labelledby="t-cons"><div class="card-header"><h3 class="card-title" id="t-cons">O que o aluno liberou</h3></div><div class="card-body"><ul class="g4-list">' +
      D.consentList(st).map(function (c) {
        var b = c.state === 'GRANTED' && stale ? badge('warning', 'clock', 'Não confirmado agora') : c.state === 'GRANTED' ? badge('success', 'check-circle', 'Liberado desde ' + A.fmtDate(c.grantedAt)) : c.state === 'REVOKED' ? badge('danger', 'ban', 'Revogado em ' + A.fmtDate(c.revokedAt)) : badge('neutral', 'lock', 'Nunca liberado');
        return '<li><span class="grow"><strong>' + esc(c.label) + '</strong><span>' + (c.state === 'NEVER_GIVEN' ? 'Sem termo aceito' : esc(c.textVersion) + ' aceito') + '</span></span>' + b + '</li>';
      }).join('') + '</ul><p class="muted mt-4">' + ico('lock', 'icon-sm') + ' Alterado só pelo aluno.</p></div></section>';
  }
  function intensity(n) {
    return n >= 7 ? '<span class="badge badge-danger">' + ico('alert') + n + ' de 10 · Intensidade alta</span>' : '<span class="badge">' + n + ' de 10</span>';
  }
  function healthBlocks(st, d, o) {
    var h = d.health;
    if (!h) return '<div class="empty-state"><div class="empty-state-icon">' + ico('heart') + '</div><h3 class="h3">O aluno liberou, mas ainda não registrou dados de saúde.</h3><p>Quando ele registrar, os dados aparecem aqui.</p></div>';
    var w = h.measures.filter(function (m) { return m.kind === 'WEIGHT_KG'; });
    var kindName = { WEIGHT_KG: 'Peso', BODY_FAT_PERCENT: '% de gordura' };
    var chart = G4.barChart('g5-peso', 'Evolução do peso', 'Peso em kg: ' + w.map(function (m) { return A.fmtDate(m.at) + ' ' + m.value; }).join(', ') + '.', w.map(function (m) { return [A.fmtDate(m.at).slice(0, 5), m.value]; }), function (v) { return String(v).replace('.', ','); }, ['Data', 'Peso (kg)']);
    return '<div class="g5-health-grid">' +
      '<section class="card" aria-labelledby="t-dor"><div class="card-header"><h3 class="card-title" id="t-dor">Dor e alertas</h3></div><div class="card-body"><div class="table-wrap g5-wrap" role="region" aria-label="Relatos de dor" tabindex="0"><table class="table"><caption class="sr-only">Relatos de dor</caption><thead><tr><th scope="col">Data</th><th scope="col">Região</th><th scope="col">Intensidade</th><th scope="col">Sessão</th></tr></thead><tbody>' +
        h.pain.map(function (p) { return '<tr><td data-label="Data">' + time(p.at) + '</td><td data-label="Região">' + esc(p.bodyRegion) + '</td><td data-label="Intensidade">' + intensity(p.intensity) + '</td><td data-label="Sessão">' + esc(p.sessionName) + '</td></tr>'; }).join('') + '</tbody></table></div></div></section>' +
      '<section class="card" aria-labelledby="t-med"><div class="card-header"><h3 class="card-title" id="t-med">Medidas e respostas</h3></div><div class="card-body stack">' + chart +
        '<div class="table-wrap g5-wrap" role="region" aria-label="Medidas registradas" tabindex="0"><table class="table"><caption class="sr-only">Medidas registradas</caption><thead><tr><th scope="col">Data</th><th scope="col">Medida</th><th scope="col">Valor</th><th scope="col">Registrado por</th></tr></thead><tbody>' +
        h.measures.map(function (m) { return '<tr><td data-label="Data">' + time(m.at) + '</td><td data-label="Medida">' + kindName[m.kind] + '</td><td data-label="Valor">' + String(m.value).replace('.', ',') + ' ' + m.unit + '</td><td data-label="Registrado por">' + esc(m.registeredBy) + '</td></tr>'; }).join('') + '</tbody></table></div></div></section>' +
      '<section class="card" aria-labelledby="t-obj"><div class="card-header"><h3 class="card-title" id="t-obj">Objetivos</h3></div><div class="card-body stack"><div><h4 class="h4">Objetivo do treino</h4><p>' + esc(h.programGoal) + '</p></div>' +
        '<div><h4 class="h4">Objetivos informados pelo aluno ' + selo('N2') + '</h4><ul class="g4-list-plain">' + h.studentGoals.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></div></div></section>' +
      '<section class="card" aria-labelledby="t-nut"><div class="card-header"><h3 class="card-title" id="t-nut">Nutrição</h3>' + selo('N1') + '</div><div class="card-body stack"><p class="muted">[MOCK] dado de demonstração</p><div><h4 class="h4">Refeições</h4><ul class="g4-list-plain">' +
        h.nutrition.meals.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div><p><strong>Metas:</strong> ' + esc(h.nutrition.targets) + '</p><p><strong>Observações do aluno:</strong> ' + esc(h.nutrition.notes) + '</p></div></section>' +
      '<section class="card" aria-labelledby="t-mid"><div class="card-header"><h3 class="card-title" id="t-mid">Fotos e vídeos</h3></div><div class="card-body"><p>Fotos e vídeos ficam na aba Mídia, cada um com a sua liberação.</p><a class="btn btn-secondary mt-4" href="' + esc(o.mediaHref) + '">Abrir Mídia</a></div></section></div>';
  }
  function healthPanel(st, o) {
    o = o || {};
    var V = o.variant || '', c = st.consents.SAUDE_GERAL, stale = V === 'nao-confirmado';
    var g = D.gate(st, { stale: stale }), top = '<div class="stack">' + privacidade();
    if (V === 'erro') return top + alertBox('danger', 'Não foi possível carregar os dados de saúde.', 'Seus dados estão seguros. Tente de novo em instantes.', '<button type="button" class="btn btn-secondary" data-g5-retry>' + ico('refresh') + 'Tentar de novo</button>') + '</div>';
    if (g.reason === 'idade') return top + lock('Aguardando confirmação de idade ou responsável legal', 'Conta em espera: falta confirmar a idade ou o responsável legal. Nada de saúde é exibido.', 'warning') + '</div>';
    if (g.reason === 'encerrado' || g.reason === 'vinculo') return top + privCard(g) + '</div>';
    var body, side = consentPanel(st, stale);
    if (g.reason === 'nao-confirmado') body = alertBox('warning', 'Não conseguimos confirmar a autorização do aluno agora.', 'Por segurança, os dados ficam ocultos até confirmar.', '<button type="button" class="btn btn-secondary" data-g5-retry>' + ico('refresh') + 'Tentar de novo</button>');
    else if (g.reason === 'sem-consentimento') body = lock('O aluno ainda não liberou os dados de saúde.', 'Quando o aluno liberar, os dados aparecem aqui. Você pode conversar com o aluno sobre o que ele prefere compartilhar.');
    else if (g.reason === 'revogado') body = lock('O aluno retirou a liberação em ' + A.fmtDate(D.consentList(st)[0].revokedAt) + '.', 'Os dados registrados antes ficam guardados e ocultos para você e para o gestor. [LEGAL] [MOCK] texto provisório sobre o destino do dado.');
    else body = healthBlocks(st, D.detail(st), o);
    var foot = '<div class="row"><a class="btn btn-text" href="' + esc(o.acompHref) + '">' + ico('users') + 'Ver quem mais vê estes dados</a>' + '<a class="btn btn-text" href="' + esc(G4.url('../ia/dados-ia.html', 'aluno=' + st.id)) + '">' + ico('lock') + 'Dados usados pela IA</a><a class="btn btn-text" href="' + esc(G4.url('../ia/painel-sugestoes.html', 'aluno=' + st.id)) + '">Abrir sugestões</a></div>';
    return top + '<div class="g5-health"><div>' + side + '</div><div class="stack">' + body + '</div></div>' + foot + '</div>';
  }

  /* ---- TRN-05: modal de pausar, retomar ou encerrar vinculo ----
     kind: pausar|retomar|encerrar ; o: { st, opener, error:true (simula falha), canEnd:boolean, onDone(kind) } */
  function vinculoModal(kind, o) {
    var st = o.st, id = 'vinc-' + Math.floor(Math.random() * 1e6), t = id + '-t', dsc = id + '-d';
    var wrap = document.createElement('div');
    wrap.className = 'modal-backdrop'; wrap.hidden = true; wrap.dataset.autoremove = '1'; wrap.id = id;
    var first = esc(st.name);
    var list, title, role = 'dialog', foot, bodyExtra = '', intro = '';
    if (kind === 'pausar') {
      title = 'Pausar o acompanhamento de ' + first + '?';
      list = ['O aluno deixa de receber treinos e lembretes.', 'Os treinos atuais ficam pausados e voltam como estavam.', 'Você mantém o histórico. A vaga do plano continua ocupada.', 'O aluno será avisado da pausa. [LEGAL] [MOCK] texto provisório.', 'Enquanto estiver pausado, os dados de saúde e de treino ficam ocultos para você e para o gestor.'];
      bodyExtra = '<div class="field mt-4"><label for="' + id + '-m">Motivo (opcional) ' + selo('V4') + '</label><textarea class="textarea" id="' + id + '-m" maxlength="200" aria-describedby="' + id + '-mh"></textarea><span class="field-help" id="' + id + '-mh">Não escreva dados de saúde aqui. <span id="' + id + '-c">0</span> de 200 caracteres.</span></div>';
      foot = '<button type="button" class="btn btn-neutral" data-r="0" autofocus>Manter ativo</button><button type="button" class="btn btn-primary" data-r="1">Pausar</button>';
    } else if (kind === 'retomar') {
      title = 'Retomar o acompanhamento de ' + first + '?';
      list = ['O aluno volta a receber treinos e lembretes.', 'Os treinos pausados voltam como estavam.'];
      foot = '<button type="button" class="btn btn-neutral" data-r="0" autofocus>Continuar pausado</button><button type="button" class="btn btn-primary" data-r="1">Retomar acompanhamento</button>';
    } else {
      role = 'alertdialog';
      title = 'Encerrar o vínculo com ' + first + '?';
      list = ['Você deixa de ver o aluno e de enviar treinos.', 'Os dados de saúde ficam ocultos para você e para o gestor.', 'O período do vínculo fica no Histórico. Depois do encerramento você lê só o que você mesmo disponibilizou ao aluno e os dados básicos de cadastro (LGPD); saúde e treino do aluno ficam ocultos.', 'A vaga do plano continua ocupada até o encerramento completo; só então ela volta para o seu plano.', 'Esta ação não pode ser desfeita por você. Para acompanhar de novo, é preciso um novo convite.', 'O aluno será avisado.', 'O aluno pode baixar os dados dele por um período; depois eles são apagados conforme o prazo legal. [LEGAL] [MOCK] texto provisório.'];
      intro = '<p class="muted">[LEGAL] [MOCK] textos de destino do dado provisórios.</p>';
      bodyExtra = '<div class="field mt-4"><label for="' + id + '-n">Digite o nome do aluno para confirmar: <strong>' + first + '</strong></label><input class="input" id="' + id + '-n" autocomplete="off" aria-describedby="' + id + '-nh"><span class="field-help" id="' + id + '-nh" role="status"></span></div>';
      foot = '<button type="button" class="btn btn-secondary" data-r="0" autofocus>Cancelar</button><button type="button" class="btn btn-danger" data-r="1" disabled>Encerrar vínculo</button>';
    }
    var denied = kind === 'encerrar' && o.canEnd === false;
    wrap.innerHTML = '<div class="modal" role="' + role + '" aria-modal="true" aria-labelledby="' + t + '" aria-describedby="' + dsc + '">' +
      '<div class="modal-header"><h2 class="modal-title" id="' + t + '">' + title + '</h2>' + selo('V1') + '</div>' +
      '<div class="modal-body" id="' + dsc + '"><div id="' + id + '-err" role="alert"></div>' + (denied ? alertBox('warning', '', 'Só o personal ou o administrador da conta encerram o vínculo.') : '') +
      '<ul class="g4-list-plain">' + list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' + intro + bodyExtra + '</div>' +
      '<div class="modal-footer">' + foot + '</div></div>';
    document.body.appendChild(wrap);
    var ok = wrap.querySelector('[data-r="1"]'), err = wrap.querySelector('#' + id + '-err');
    if (denied) ok.disabled = true;
    var nameIn = wrap.querySelector('#' + id + '-n'), reason = wrap.querySelector('#' + id + '-m');
    if (nameIn) nameIn.addEventListener('input', function () {
      var same = nameIn.value.trim().toLowerCase() === st.name.toLowerCase();
      ok.disabled = !same || denied;
      wrap.querySelector('#' + id + '-nh').textContent = nameIn.value && !same ? 'O nome ainda não confere.' : (same ? 'Nome confere.' : '');
    });
    if (reason) reason.addEventListener('input', function () { wrap.querySelector('#' + id + '-c').textContent = reason.value.length; });
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-r]'); if (!b) return;
      if (b.dataset.r === '0') { window.AuraUI.closeModal(wrap); return; }
      if (b.dataset.busy) return; b.dataset.busy = '1';
      if (o.error) { err.innerHTML = alertBox('danger', '', kind === 'encerrar' ? 'Não foi possível encerrar agora. Nada foi alterado.' : 'Não foi possível salvar. Nada foi alterado.'); delete b.dataset.busy; return; }
      window.AuraUI.closeModal(wrap);
      if (o.onDone) o.onDone(kind);
    });
    window.AuraUI.openModal(wrap, o.opener);
    return wrap;
  }
  function applyVinculo(st, kind) {
    if (kind === 'pausar') { st.status = 'SUSPENDED'; st.pausedAt = A.today; }
    else if (kind === 'retomar') { st.status = 'ACTIVE'; st.pausedAt = null; }
    else { st.status = 'ENDING'; st.endedAt = A.today; }
    var m = { pausar: 'Acompanhamento pausado.', retomar: 'Acompanhamento retomado.', encerrar: 'Encerramento em andamento.' }[kind];
    window.AuraUI.toast(m, { tone: kind === 'retomar' ? 'success' : 'info' });
  }


  /* ?id= informado e inexistente (ou vazio) NAO cai em outro aluno: devolve null (QA-A-03) */
  function pickStudent(defId) {
    var raw = null;
    try { var p = new URLSearchParams(location.search); if (p.has('id')) raw = p.get('id'); } catch (e) {}
    if (raw !== null) return raw ? D.find(raw) : null;
    return D.find(defId || 's01');
  }
  /* estado "aluno nao encontrado": sem nenhum dado de aluno. level = nivel do titulo (1 se a tela nao tem h1) */
  function notFound(target, level) {
    var el = typeof target === 'string' ? document.querySelector(target) : target; if (!el) return;
    var h = 'h' + (level || 2);
    el.innerHTML = '<div class="empty-state"><div class="empty-state-icon">' + ico('users') + '</div><' + h + ' class="h3">Não achamos este aluno</' + h + '><p>O endereço pode estar errado ou o vínculo não existe mais.</p><a class="btn btn-primary" href="' + esc(url('meus-alunos.html')) + '">Voltar para Meus alunos</a></div>';
  }
  /* abas rolaveis: aba ativa visivel (inclui ?aba=), indicio de rolagem nas bordas, respeita prefers-reduced-motion (QA-A-01) */
  function tabScroll(root) {
    var list = (root || document).querySelector('[role="tablist"]'); if (!list || list.dataset.g5scroll) return;
    list.dataset.g5scroll = '1';
    var wrap = list.parentElement; wrap.classList.add('g5-tabscroll');
    function reduced() { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }
    function edges() {
      var max = list.scrollWidth - list.clientWidth;
      wrap.classList.toggle('has-left', list.scrollLeft > 2);
      wrap.classList.toggle('has-right', list.scrollLeft < max - 2);
    }
    function show(tab) {
      if (!tab || list.scrollWidth <= list.clientWidth) { edges(); return; }
      try { tab.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { tab.scrollIntoView(); }
      edges();
    }
    function active() { return list.querySelector('[role="tab"][aria-selected="true"]'); }
    list.addEventListener('scroll', edges, { passive: true });
    window.addEventListener('resize', function () { show(active()); });
    list.querySelectorAll('[role="tab"]').forEach(function (t) {
      t.addEventListener('click', function () { show(t); });
      t.addEventListener('keydown', function () { setTimeout(function () { show(active()); }, 0); });
    });
    show(active());
    setTimeout(function () { show(active()); }, 60);
  }

  function accessDenied() {
    return '<div class="empty-state"><div class="empty-state-icon is-danger">' + ico('lock') + '</div><h2 class="h3">Você não é responsável por este aluno</h2><p>Se acha que deveria ter acesso, fale com o gestor da conta.</p><a class="btn btn-primary" href="' + esc(url('meus-alunos.html')) + '">Voltar para Meus alunos</a></div>';
  }

  window.G5 = {
    q: Q, variant: G4.variant, url: url, esc: esc, ico: ico, mount: mount, breadcrumb: breadcrumb, selo: selo, badge: badge, consentBadge: consentBadge, modeBadge: modeBadge,
    alertBadge: alertBadge, linkBadge: linkBadge, avatar: avatar, time: time, privacidade: privacidade, lock: lock, alertBox: alertBox, offlineAlert: offlineAlert, soon: soon,
    privCard: privCard, flash: flash, showFlash: showFlash, healthPanel: healthPanel, consentPanel: consentPanel, vinculoModal: vinculoModal, applyVinculo: applyVinculo, accessDenied: accessDenied,
    studentFor: function (defaultVariant) {
      var v = G4.variant() || defaultVariant || 'padrao';
      return pickStudent(D.byVariant[v] || D.byVariant.padrao);
    },
    pickStudent: pickStudent, notFound: notFound, tabScroll: tabScroll
  };
})();
