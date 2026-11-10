/* grupo-g3-detalhe.js - detalhe do usuario (ADM-02) e dialogo de bloqueio/reativacao (ADM-04). Depende de grupo-g3.js. */
(function () {
  'use strict';
  var A = window.AURA, G = window.G3, D = G.data;
  var ESC = G.esc, ico = G.ico;

  function pick(page) {
    var q = G.q, v = G.variant;
    if (q.id) return q.id;
    var map = page === 'bloquear'
      ? { reativar: 'u11', 'ultimo-admin': 'u02', 'a-si-mesmo': 'u01' }
      : { bloqueado: 'u11', convidado: 'u17', 'nao-verificado': 'u08', 'ultimo-admin': 'u02', 'somente-leitura': 'u04', menor: 'u24' };
    return map[v] || (page === 'bloquear' ? 'u13' : 'u03');
  }

  function init(opts) {
    var page = opts.page, id = pick(page), revealed = false, curTab = 'resumo';
    var head = document.getElementById('topo'), area = document.getElementById('area');
    var mode = G.variant === 'reativar' ? 'reativar' : 'bloquear';

    function blockReason(u) {
      if (u.id === G.me.id) return { code: 'self', text: 'Você não pode bloquear a si mesmo(a). Peça a outro administrador.' };
      if (G.isLastAdmin(u)) return { code: 'last', text: 'Esta é a única pessoa com o papel Administrador. Para bloquear ou mudar o papel, dê o papel Administrador a outra pessoa antes.' };
      return null;
    }

    function emailRow(u) {
      return revealed
        ? '<span class="body-medium">' + ESC(u.email) + '</span> <span class="g3-help-inline">· visível por 60 segundos; o acesso ficou registrado no histórico</span>'
        : '<span class="body-medium">' + ESC(u.emailMasked) + '</span> <button type="button" class="btn btn-text" id="btn-email" aria-describedby="email-nota">' + ico('eye', 'icon-sm') + 'Ver e-mail completo</button><span class="sr-only" id="email-nota">Você vai informar um motivo. O acesso fica registrado no histórico de ações.</span>';
    }

    function guardianHtml(u) {
      if (!u.isMinor) return '';
      var st = G.q.autorizacao === 'ok' ? 'ok' : (D.guardianAuth[u.id] || 'pendente');
      return '<div class="alert alert-info mb-4"><svg class="icon" aria-hidden="true"><use href="#i-info"/></svg><div class="alert-body"><div class="alert-title">Menor de idade</div>Autorização do responsável: <strong>' +
        (st === 'ok' ? 'confirmada' : 'pendente') + '</strong>. ' + (st === 'ok' ? '' : 'Até a confirmação, a pessoa não tem acesso pleno. ') + 'Esta tela não mostra outros dados.</div></div>';
    }

    function renderHead(u) {
      var reason = blockReason(u), canManage = G.can('users:manage'), acts = '';
      var blocked = u.status === 'bloqueado';
      if (canManage) {
        if (blocked) acts += '<button type="button" class="btn btn-primary" id="btn-principal" data-act="reativar">' + ico('refresh') + 'Reativar acesso</button>';
        else acts += '<button type="button" class="btn btn-danger" id="btn-principal" data-act="bloquear"' + (reason ? ' aria-disabled="true" aria-describedby="acao-motivo"' : '') + '>' + ico('ban') + 'Bloquear acesso</button>';
        if (u.status === 'convidado') acts += '<button type="button" class="btn btn-neutral" data-act="convite">' + ico('mail') + 'Reenviar convite</button>';
        if (!u.emailVerified && u.status !== 'convidado') acts += '<button type="button" class="btn btn-neutral" data-act="verificacao">' + ico('mail') + 'Reenviar verificação</button>';
        acts += '<a class="btn btn-neutral" href="' + G.href('atribuir-papel.html', { papel: u.roles[0], usuario: u.id }) + '"' + (G.isLastAdmin(u) ? ' aria-disabled="true" aria-describedby="acao-motivo" tabindex="-1"' : '') + '>' + ico('shield') + 'Alterar papel</a>';
      }
      head.innerHTML = G.breadcrumb([['Início', G.href('../home/admin.html')], ['Usuários', G.href('usuarios.html')], [u.name]]) +
        '<div class="g3-userhead mb-4"><span class="avatar avatar-lg" aria-hidden="true">' + u.initials + '</span><div class="grow"><h1>' + ESC(u.name) + '</h1>' +
        '<div class="row"><span>' + A.badge(u.status) + '</span>' + u.roles.map(function (r) { return '<span class="badge">' + ico('user', 'icon-sm') + G.roleName(r) + '</span>'; }).join('') + '</div>' +
        '<p class="mt-2">' + emailRow(u) + '</p></div></div>' +
        (canManage ? '<div class="row mb-4" role="group" aria-label="Ações para ' + ESC(u.name) + '">' + acts + '</div>' + (reason ? '<p class="alert alert-warning mb-4" id="acao-motivo">' + ico('lock') + '<span class="alert-body">' + reason.text + '</span></p>' : '') :
          '<div class="alert alert-info mb-4"><svg class="icon" aria-hidden="true"><use href="#i-info"/></svg><div class="alert-body"><div class="alert-title">Você está no modo leitura</div>Com o papel Suporte você consulta esta pessoa, mas não bloqueia nem altera nada. Para isso, peça a um administrador.</div></div>');
    }

    function sub(u) {
      var s = A.subscriptions.filter(function (x) { return x.userId === u.id; })[0];
      if (!s) return '<dt>Assinatura</dt><dd>Sem assinatura ativa (plano Starter)</dd>';
      return '<dt>Assinatura</dt><dd>' + G.planName(s.planId) + ' ' + (s.cycle === 'monthly' ? 'mensal' : 'anual') + ' · ' + A.badge(s.status) + (s.renewsAt ? '<br><span class="muted">Renova ou vence em ' + A.fmtDate(s.renewsAt) + '</span>' : '') + (s.coupon ? '<br><span class="muted">Cupom usado: ' + ESC(s.coupon) + '</span>' : '') + '</dd>';
    }
    function links(u) {
      if (u.roles.indexOf('aluno') !== -1) { var p = u.personalId && A.byId(A.users, u.personalId); return p ? 'Aluno de ' + ESC(p.name) : 'Sem personal vinculado'; }
      if (u.roles.indexOf('personal') !== -1) { var n = A.users.filter(function (x) { return x.personalId === u.id; }).length; return n + (n === 1 ? ' aluno vinculado' : ' alunos vinculados'); }
      return 'Sem vínculos com personais';
    }
    function verif(u) { return u.emailVerified ? '<span class="badge badge-success">' + ico('check-circle') + 'Verificado</span>' : '<span class="badge badge-warning">' + ico('clock') + 'Não verificado</span>'; }

    function renderBody(u) {
      var bi = G.blockInfo(u), blocked = u.status === 'bloqueado';
      var alerts = '';
      if (window.AuraState.get() === 'success') alerts += '<div class="alert alert-success mb-4" role="status">' + ico('check-circle') + '<div class="alert-body"><div class="alert-title">Tudo certo</div>A ação foi feita e ficou registrada no histórico.</div></div>';
      if (blocked) alerts += '<div class="alert alert-warning mb-4" role="status">' + ico('ban') + '<div class="alert-body"><div class="alert-title">Acesso bloqueado' + (bi.at ? ' desde ' + A.fmtDate(bi.at) : '') + ' por ' + ESC(bi.by) + '</div><span class="g3-reason" style="display:block">Motivo: ' + ESC(bi.reason || 'não informado') + '</span><span class="muted" style="display:block">Ao tentar entrar, a pessoa vê: "Sua conta está suspensa. Fale com o suporte." Nada foi apagado e dá para reativar.</span></div></div>';
      if (u.status === 'convidado') alerts += '<div class="alert alert-info mb-4">' + ico('mail') + '<div class="alert-body"><div class="alert-title">Convite enviado, ainda sem resposta</div>A pessoa só tem conta depois de aceitar o convite e criar uma senha.</div></div>';
      if (!u.emailVerified && u.status === 'pendente_verificacao') alerts += '<div class="alert alert-warning mb-4">' + ico('clock') + '<div class="alert-body"><div class="alert-title">E-mail ainda não verificado</div>Até clicar no link que enviamos, a pessoa não tem acesso pleno.</div></div>';
      alerts += guardianHtml(u);

      var hist = G.audit().filter(function (a) { return a.targetName === u.name || a.actorName === u.name; });
      var resumo = '<dl class="kv">' +
        '<dt>Situação</dt><dd>' + A.badge(u.status) + '</dd>' +
        '<dt>Cadastro em</dt><dd>' + A.fmtDate(u.createdAt) + '</dd>' +
        '<dt>Último acesso</dt><dd>' + (u.lastLoginAt ? A.fmtDateTime(u.lastLoginAt) + ' <span class="muted">(' + A.relDate(u.lastLoginAt) + ')</span>' : 'A pessoa ainda não entrou') + '</dd>' +
        '<dt>E-mail verificado</dt><dd>' + verif(u) + '</dd>' +
        '<dt>Vínculos</dt><dd>' + links(u) + '</dd>' +
        (u.roles.indexOf('personal') !== -1 ? sub(u) : '') +
        '</dl><p class="g3-help-inline mt-4">Por segurança e privacidade, esta tela não mostra dados de saúde, medidas, fotos ou treinos.</p>';
      var papéis = u.roles.map(function (r) {
        var role = A.byId(A.roles, 'role-' + r);
        return '<div class="list-row"><span class="badge badge-primary">' + ico('shield') + G.roleName(r) + '</span><span class="grow muted">' + ESC(role ? role.description : '') + '</span></div>';
      }).join('') + (G.can('users:manage') ? '<p class="mt-4"><a class="btn btn-secondary" href="' + G.href('atribuir-papel.html', { papel: u.roles[0], usuario: u.id }) + '"' + (G.isLastAdmin(u) ? ' aria-disabled="true" tabindex="-1"' : '') + '>Alterar papel</a></p>' + (G.isLastAdmin(u) ? '<p class="g3-lockline mt-2">' + ico('lock', 'icon-sm') + 'Não dá para rebaixar a única pessoa com o papel Administrador.</p>' : '') : '');
      var hh = hist.length ? '<ul class="g3-timeline">' + hist.map(function (a) {
        var ic = /Bloque/.test(a.action) ? 'ban' : /Reativ/.test(a.action) ? 'refresh' : /convite/i.test(a.action) ? 'mail' : /e-mail|cadastro|Consult/i.test(a.action) ? 'eye' : 'clipboard';
        return '<li><span class="g3-tl-ico">' + ico(ic, 'icon-sm') + '</span><div><div><strong>' + ESC(a.actorName) + '</strong> · ' + ESC(a.action) + (a.targetName !== u.name ? ' (' + ESC(a.targetName) + ')' : '') + '</div>' + (a.detail ? '<div class="muted">' + ESC(a.detail) + '</div>' : '') + '<div class="caption muted">' + A.fmtDateTime(a.at) + '</div></div></li>';
      }).join('') + '</ul>' : '<p class="muted">Nenhuma ação registrada para esta pessoa.</p>';

      area.innerHTML = alerts +
        '<div class="card"><div class="tabs" role="tablist" aria-label="Seções do usuário" style="padding:0 var(--space-4)">' +
        ['resumo|Resumo', 'papéis|Papéis', 'historico|Histórico'].map(function (t) { var k = t.split('|'); return '<button type="button" class="tab" role="tab" id="tab-' + k[0] + '" aria-controls="p-' + k[0] + '" aria-selected="' + (curTab === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div>' +
        '<div class="card-body"><div role="tabpanel" id="p-resumo" aria-labelledby="tab-resumo"' + (curTab === 'resumo' ? '' : ' hidden') + ' tabindex="0">' + resumo + '</div>' +
        '<div role="tabpanel" id="p-papéis" aria-labelledby="tab-papéis"' + (curTab === 'papéis' ? '' : ' hidden') + ' tabindex="0">' + papéis + '</div>' +
        '<div role="tabpanel" id="p-historico" aria-labelledby="tab-historico"' + (curTab === 'historico' ? '' : ' hidden') + ' tabindex="0">' + hh + '</div></div></div>';
      window.AuraUI.initTabs(area);
      Array.prototype.forEach.call(area.querySelectorAll('[role=tab]'), function (t) { t.addEventListener('click', function () { curTab = t.id.replace('tab-', ''); }); });
    }

    function render() {
      var u = G.user(id), st = window.AuraState.get();
      if (!u) {
        head.innerHTML = G.breadcrumb([['Início', G.href('../home/admin.html')], ['Usuários', G.href('usuarios.html')], ['Usuário não encontrado']]) + '<h1 class="mb-4">Usuário não encontrado</h1>';
        window.AuraState.render(area, 'empty', { icon: 'users', title: 'Não achamos essa pessoa', text: 'O endereço pode estar errado ou a pessoa não existe mais.', action: { label: 'Voltar para Usuários', href: G.href('usuarios.html') } });
        return;
      }
      if (st === 'loading' || st === 'error' || st === 'empty') {
        head.innerHTML = G.breadcrumb([['Início', G.href('../home/admin.html')], ['Usuários', G.href('usuarios.html')], [u.name]]) + '<h1 class="mb-4">' + ESC(u.name) + '</h1>';
        window.AuraState.render(area, st, { rows: 5, icon: 'users', title: 'Sem informações desta pessoa', text: 'Quando houver cadastro, os dados aparecem aqui.', onRetry: function () { window.AuraState.set('loading'); setTimeout(function () { window.AuraState.set('default'); }, 800); } });
        return;
      }
      renderHead(u); renderBody(u);
    }

    /* ---------- dialogos ---------- */
    function dialog(kind, opener) {
      var u = G.user(id), wrap = document.createElement('div'), did = 'dlg-' + Date.now();
      wrap.className = 'modal-backdrop'; wrap.hidden = true; wrap.id = did; wrap.dataset.autoremove = '1';
      var blockedBy = kind === 'bloquear' ? blockReason(u) : null, html;
      if (blockedBy) {
        html = '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="' + did + '-t" aria-describedby="' + did + '-d"><div class="modal-header"><h2 class="modal-title" id="' + did + '-t">Não é possível bloquear ' + ESC(u.name) + '</h2></div>' +
          '<div class="modal-body"><p id="' + did + '-d" class="alert alert-warning">' + ico('lock') + '<span class="alert-body">' + blockedBy.text + '</span></p></div>' +
          '<div class="modal-footer"><button type="button" class="btn btn-primary" data-modal-close autofocus>Entendi</button></div></div>';
      } else if (kind === 'bloquear') {
        html = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="' + did + '-t"><form class="g3-contents" novalidate id="' + did + '-f">' +
          '<div class="modal-header"><h2 class="modal-title" id="' + did + '-t">Bloquear o acesso de ' + ESC(u.name) + '?</h2></div>' +
          '<div class="modal-body stack"><div><p class="body-medium mb-2">O que acontece</p><ul class="stack-sm g3-checks"><li>' + ico('check', 'icon-sm') + ' Encerra as sessões abertas agora.</li><li>' + ico('check', 'icon-sm') + ' Não apaga nenhum dado.</li><li>' + ico('check', 'icon-sm') + ' Dá para reativar quando quiser. A ação fica registrada no histórico.</li></ul></div>' +
          '<div class="field"><label for="' + did + '-m">Motivo <span class="field-required" aria-hidden="true">*</span></label><div class="select-wrap"><select class="select" id="' + did + '-m" name="motivo" required><option value="">Escolha um motivo</option>' + D.blockReasons.map(function (r) { return '<option value="' + r.v + '">' + ESC(r.label) + '</option>'; }).join('') + '</select></div></div>' +
          '<div class="field"><label for="' + did + '-d">Detalhes <span class="muted">(obrigatório se o motivo for "Outro")</span></label><textarea class="textarea" id="' + did + '-d" name="detalhe" maxlength="300" aria-describedby="' + did + '-dh"></textarea><span class="field-help" id="' + did + '-dh">Não escreva dados de saúde nem senhas. Quem tiver acesso ao histórico vai ler.</span></div></div>' +
          '<div class="modal-footer"><button type="button" class="btn btn-neutral" data-modal-close autofocus>Cancelar</button><button type="submit" class="btn btn-danger">Bloquear acesso</button></div></form></div>';
      } else {
        html = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="' + did + '-t"><form class="g3-contents" novalidate id="' + did + '-f">' +
          '<div class="modal-header"><h2 class="modal-title" id="' + did + '-t">Reativar o acesso de ' + ESC(u.name) + '?</h2></div>' +
          '<div class="modal-body stack"><p>A pessoa volta a entrar com o mesmo e-mail e a mesma senha. Nada foi apagado. A ação fica registrada no histórico.</p>' +
          '<div class="field"><label for="' + did + '-d">Observação <span class="muted">(opcional)</span></label><textarea class="textarea" id="' + did + '-d" name="detalhe" maxlength="300"></textarea></div></div>' +
          '<div class="modal-footer"><button type="button" class="btn btn-neutral" data-modal-close autofocus>Cancelar</button><button type="submit" class="btn btn-primary">Reativar acesso</button></div></form></div>';
      }
      wrap.innerHTML = html; document.body.appendChild(wrap);
      var form = wrap.querySelector('form');
      if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        var m = form.elements.motivo, d = form.elements.detalhe;
        if (m) {
          window.AuraUI.clearError(m); window.AuraUI.clearError(d);
          if (!m.value) window.AuraUI.setError(m, 'Escolha o motivo do bloqueio.');
          if (m.value === 'outro' && !d.value.trim()) window.AuraUI.setError(d, 'Descreva o motivo para o histórico.');
          if (window.AuraUI.focusFirstError(form)) return;
          var label = D.blockReasons.filter(function (r) { return r.v === m.value; })[0].label;
          var text = m.value === 'outro' ? d.value.trim() : label + (d.value.trim() ? '. ' + d.value.trim() : '.');
          G.setUser(id, { status: 'bloqueado', blockedReason: text, blockedBy: G.me.name, blockedAt: G.nowIso() });
          G.addAudit('Bloqueou o acesso', u.name, 'Motivo: ' + text);
          window.AuraUI.closeModal(wrap);
          render();
          window.AuraUI.toast('Acesso de ' + u.name + ' bloqueado. Você pode reativar quando quiser.', { tone: 'warning' });
        } else {
          G.setUser(id, { status: u.emailVerified ? 'ativo' : 'pendente_verificacao', blockedReason: null, blockedBy: null, blockedAt: null });
          G.addAudit('Reativou o acesso', u.name, d.value.trim() || 'Sem observação.');
          window.AuraUI.closeModal(wrap);
          render();
          window.AuraUI.toast('Acesso de ' + u.name + ' reativado.', { tone: 'success' });
        }
        var b = document.getElementById('btn-principal'); if (b) b.focus();
      });
      window.AuraUI.openModal(wrap, opener);
    }

    var REASONS = ['A própria pessoa pediu ajuda', 'Problema de acesso ou de cadastro', 'Dúvida de cobrança', 'Outro motivo (descreva abaixo)'], revealTimer = null;
    function emailDialog(opener) {
      var u = G.user(id), wrap = document.createElement('div'), did = 'dlg-em-' + Date.now();
      wrap.className = 'modal-backdrop'; wrap.hidden = true; wrap.id = did; wrap.dataset.autoremove = '1';
      wrap.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="' + did + '-t"><form class="g3-contents" novalidate>' +
        '<div class="modal-header"><h2 class="modal-title" id="' + did + '-t">Ver o e-mail completo de ' + ESC(u.name) + '?</h2></div>' +
        '<div class="modal-body stack"><p>O e-mail volta a ficar escondido depois de 60 segundos. Quem fez o acesso, o motivo, o dia e a hora ficam registrados no histórico de ações.</p>' +
        '<div class="field"><label for="' + did + '-m">Motivo <span class="field-required" aria-hidden="true">*</span></label><div class="select-wrap"><select class="select" id="' + did + '-m" name="motivo" required><option value="">Escolha um motivo</option>' + REASONS.map(function (x, i) { return '<option value="' + i + '">' + ESC(x) + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="field"><label for="' + did + '-d">Detalhes <span class="muted">(obrigatório se o motivo for "Outro")</span></label><textarea class="textarea" id="' + did + '-d" name="detalhe" maxlength="300"></textarea><span class="field-help">Não escreva dados de saúde.</span></div></div>' +
        '<div class="modal-footer"><button type="button" class="btn btn-neutral" data-modal-close autofocus>Cancelar</button><button type="submit" class="btn btn-primary">Ver e-mail completo</button></div></form></div>';
      document.body.appendChild(wrap);
      wrap.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, m = f.elements.motivo, d = f.elements.detalhe;
        window.AuraUI.clearError(m); window.AuraUI.clearError(d);
        if (!m.value) window.AuraUI.setError(m, 'Escolha o motivo para ver o e-mail.');
        if (m.value === '3' && !d.value.trim()) window.AuraUI.setError(d, 'Descreva o motivo para o histórico.');
        if (window.AuraUI.focusFirstError(f)) return;
        var why = m.value === '3' ? d.value.trim() : REASONS[+m.value] + (d.value.trim() ? '. ' + d.value.trim() : '');
        G.addAudit('Consultou o e-mail completo', u.name, 'Motivo: ' + why);
        revealed = true; window.AuraUI.closeModal(wrap); renderHead(u); renderBody(u);
        clearTimeout(revealTimer); revealTimer = setTimeout(function () { revealed = false; var uu = G.user(id); if (uu && window.AuraState.get() === 'default') { renderHead(uu); renderBody(uu); } }, 60000);
        window.AuraUI.toast('E-mail completo visível por 60 segundos. O acesso foi registrado no histórico.', { tone: 'info' });
        var hb = document.getElementById('btn-principal'); if (hb) hb.focus();
      });
      window.AuraUI.openModal(wrap, opener);
    }
    document.addEventListener('click', function (e) {
      var u = G.user(id);
      var em = e.target.closest('#btn-email');
      if (em && u) { emailDialog(em); return; }
      var b = e.target.closest('[data-act]'); if (!b || !u) return;
      var act = b.dataset.act;
      if (act === 'bloquear' || act === 'reativar') { dialog(act, b); }
      else if (act === 'convite') { G.addAudit('Reenviou o convite', u.name, 'Novo prazo de 7 dias.'); window.AuraUI.toast('Convite reenviado. Ele vale por mais 7 dias.', { tone: 'success' }); renderBody(u); }
      else if (act === 'verificacao') { G.addAudit('Reenviou a verificação de e-mail', u.name, ''); window.AuraUI.toast('Enviamos o e-mail de verificação de novo.', { tone: 'success' }); renderBody(u); }
    });
    document.addEventListener('click', function (e) { var l = e.target.closest('a[aria-disabled="true"]'); if (l) e.preventDefault(); });
    document.addEventListener('aura:statechange', render);

    render();
    if (page === 'bloquear') {
      var btn = document.getElementById('btn-principal');
      var u0 = G.user(id);
      if (u0) dialog(u0.status === 'bloqueado' ? 'reativar' : 'bloquear', btn);
    }
  }
  window.G3Detail = { init: init };
})();
