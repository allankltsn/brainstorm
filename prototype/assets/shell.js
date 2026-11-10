/* shell.js - AuraShell (menu lateral + topbar por perfil), AuraState (estados) e AuraUI (modal, toast, tabs...).
   Uso na tela: <main id="conteudo">...</main> e, no fim do body: AuraShell.mount({ role:'admin', active:'usuarios', title:'Usuários' });
   O ?role= da URL tem prioridade sobre opts.role. Depende de data.js, icons.js e theme.js (nessa ordem, theme no head). */
(function () {
  'use strict';

  /* ---------------- utilidades ---------------- */
  function qs() {
    var out = {};
    try {
      location.search.replace(/^\?/, '').split('&').forEach(function (p) {
        if (!p) return;
        var kv = p.split('=');
        out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      });
    } catch (e) {}
    return out;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ico(name, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>'; }
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function focusables(root) {
    return Array.prototype.filter.call(root.querySelectorAll(FOCUSABLE), function (el) {
      return !el.hidden && el.offsetParent !== null || el === document.activeElement;
    });
  }
  function trapTab(e, root) {
    if (e.key !== 'Tab') return;
    var f = focusables(root);
    if (!f.length) { e.preventDefault(); root.focus(); return; }
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  var uid = 0;
  function nextId(p) { uid += 1; return (p || 'aura') + '-' + uid; }

  /* ---------------- AuraUI ---------------- */
  var modalStack = [];
  function openModal(target, opener) {
    var m = typeof target === 'string' ? document.getElementById(target) : target;
    if (!m) return;
    var dialog = m.querySelector('[role="dialog"], [role="alertdialog"]') || m;
    modalStack.push({ el: m, opener: opener || document.activeElement });
    m.hidden = false;
    document.body.classList.add('has-modal');
    var app = document.querySelector('.app'); if (app) app.inert = true;
    dialog.setAttribute('tabindex', '-1');
    var f = dialog.querySelector('[autofocus]') || focusables(dialog)[0] || dialog;
    f.focus();
  }
  function closeModal(target) {
    var top = modalStack[modalStack.length - 1];
    if (!top) return;
    var m = typeof target === 'string' ? document.getElementById(target) : target;
    if (m && m !== top.el) return;
    modalStack.pop();
    top.el.hidden = true;
    top.el.dispatchEvent(new CustomEvent('aura:modalclose'));
    if (!modalStack.length) {
      document.body.classList.remove('has-modal');
      var app = document.querySelector('.app'); if (app) app.inert = false;
    }
    if (top.opener && document.contains(top.opener) && top.opener.focus) top.opener.focus();
    if (top.el.dataset.autoremove) top.el.parentNode.removeChild(top.el);
  }
  // Confirmacao pronta (acoes destrutivas/reversiveis). Retorna Promise<boolean>.
  function confirmDialog(o) {
    o = o || {};
    return new Promise(function (resolve) {
      var id = nextId('confirm');
      var wrap = document.createElement('div');
      wrap.className = 'modal-backdrop'; wrap.hidden = true; wrap.dataset.autoremove = '1'; wrap.id = id;
      wrap.innerHTML = '<div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="' + id + '-t" aria-describedby="' + id + '-d">' +
        '<div class="modal-header"><h2 class="modal-title" id="' + id + '-t">' + esc(o.title || 'Confirmar ação') + '</h2></div>' +
        '<div class="modal-body"><p id="' + id + '-d">' + esc(o.text || '') + '</p></div>' +
        '<div class="modal-footer"><button type="button" class="btn btn-neutral" data-r="0" autofocus>' + esc(o.cancelLabel || 'Cancelar') + '</button>' +
        '<button type="button" class="btn ' + (o.danger ? 'btn-danger' : 'btn-primary') + '" data-r="1">' + esc(o.confirmLabel || 'Confirmar') + '</button></div></div>';
      document.body.appendChild(wrap);
      var result = false;
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-r]');
        if (b) { result = b.dataset.r === '1'; closeModal(wrap); }
      });
      // resolve so ao fechar (botao, Esc ou clique fora): Esc e clique fora = false
      wrap.addEventListener('aura:modalclose', function () { resolve(result); });
      openModal(wrap);
    });
  }

  var toastRegion = null;
  function ensureToastRegion() {
    if (toastRegion && document.body.contains(toastRegion)) return toastRegion;
    toastRegion = document.createElement('div');
    toastRegion.className = 'toast-region';
    toastRegion.setAttribute('aria-live', 'polite');
    toastRegion.setAttribute('aria-atomic', 'false');
    document.body.appendChild(toastRegion);
    return toastRegion;
  }
  var TONE_ICON = { info: 'info', success: 'check-circle', warning: 'alert', danger: 'x-circle' };
  function toast(message, o) {
    o = o || {};
    var tone = o.tone || 'info';
    var el = document.createElement('div');
    el.className = 'toast toast-' + tone;
    if (tone === 'danger') el.setAttribute('role', 'alert'); else el.setAttribute('role', 'status');
    el.innerHTML = ico(TONE_ICON[tone] || 'info') +
      '<div class="toast-body">' + (o.title ? '<div class="toast-title">' + esc(o.title) + '</div>' : '') + '<div>' + esc(message) + '</div></div>' +
      '<button type="button" class="btn btn-text btn-icon" aria-label="Fechar aviso">' + ico('x') + '</button>';
    ensureToastRegion().appendChild(el);
    var timer;
    function remove() { clearTimeout(timer); if (el.parentNode) el.parentNode.removeChild(el); }
    function arm() { clearTimeout(timer); if (o.timeout !== 0) timer = setTimeout(remove, o.timeout || 8000); }
    el.querySelector('button').addEventListener('click', remove);
    el.addEventListener('mouseenter', function () { clearTimeout(timer); });
    el.addEventListener('focusin', function () { clearTimeout(timer); });
    el.addEventListener('mouseleave', arm);
    el.addEventListener('focusout', arm);
    arm();
    return remove;
  }

  // Erro de campo: texto especifico + aria-describedby + aria-invalid
  function setError(input, message) {
    var field = input.closest('.field') || input.parentNode;
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
    var id = (input.id || (input.id = nextId('campo'))) + '-erro';
    var err = document.getElementById(id);
    if (!err) {
      err = document.createElement('div');
      err.id = id; err.className = 'field-error';
      field.appendChild(err);
    }
    err.innerHTML = ico('alert', 'icon-sm') + '<span>' + esc(message) + '</span>';
    var d = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
    if (d.indexOf(id) === -1) d.push(id);
    input.setAttribute('aria-describedby', d.join(' '));
  }
  function clearError(input) {
    var field = input.closest('.field') || input.parentNode;
    field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
    var id = input.id + '-erro', err = document.getElementById(id);
    if (err) err.parentNode.removeChild(err);
    var d = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (x) { return x && x !== id; });
    if (d.length) input.setAttribute('aria-describedby', d.join(' ')); else input.removeAttribute('aria-describedby');
  }
  function focusFirstError(scope) {
    var el = (scope || document).querySelector('[aria-invalid="true"]');
    if (el) el.focus();
    return !!el;
  }

  function initTabs(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('[role="tablist"]'), function (list) {
      if (list.dataset.init) return; list.dataset.init = '1';
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
          var p = document.getElementById(t.getAttribute('aria-controls'));
          if (p) p.hidden = !on;
        });
        if (focus) tab.focus();
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { select(t); });
        t.addEventListener('keydown', function (e) {
          var n = null;
          if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
          else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (e.key === 'Home') n = tabs[0];
          else if (e.key === 'End') n = tabs[tabs.length - 1];
          if (n) { e.preventDefault(); select(n, true); }
        });
      });
      select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]);
    });
  }

  function initDelegates() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-modal-open],[data-modal-close],[data-toggle-password],[data-toast]') : null;
      if (!t) return;
      if (t.hasAttribute('data-modal-open')) { e.preventDefault(); openModal(t.getAttribute('data-modal-open'), t); }
      else if (t.hasAttribute('data-modal-close')) { e.preventDefault(); closeModal(); }
      else if (t.hasAttribute('data-toggle-password')) {
        var input = document.getElementById(t.getAttribute('aria-controls'));
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        t.setAttribute('aria-pressed', show ? 'true' : 'false');
        t.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
        var use = t.querySelector('use'); if (use) use.setAttribute('href', show ? '#i-eye-off' : '#i-eye');
      } else if (t.hasAttribute('data-toast')) {
        toast(t.getAttribute('data-toast'), { tone: t.getAttribute('data-tone') || 'success', title: t.getAttribute('data-toast-title') || undefined });
      }
    });
    document.addEventListener('mousedown', function (e) {
      var top = modalStack[modalStack.length - 1];
      if (top && e.target === top.el && !top.el.hasAttribute('data-static')) { closeModal(); }
    });
    document.addEventListener('keydown', function (e) {
      var top = modalStack[modalStack.length - 1];
      if (top) {
        if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
        trapTab(e, top.el.querySelector('[role="dialog"], [role="alertdialog"]') || top.el);
      }
      if (e.key === 'Escape') {
        Array.prototype.forEach.call(document.querySelectorAll('.tooltip-host'), function (h) {
          if (h.matches(':hover, :focus-within')) {
            h.classList.add('is-dismissed');
            var undo = function () { h.classList.remove('is-dismissed'); h.removeEventListener('mouseleave', undo); h.removeEventListener('focusout', undo); };
            h.addEventListener('mouseleave', undo); h.addEventListener('focusout', undo);
          }
        });
      }
    });
  }

  window.AuraUI = {
    openModal: openModal, closeModal: closeModal, confirm: confirmDialog, toast: toast,
    setError: setError, clearError: clearError, focusFirstError: focusFirstError, initTabs: initTabs,
    icon: ico, esc: esc, modelBadge: function (tip) { return window.AURA && window.AURA.modelBadge ? window.AURA.modelBadge(tip) : ''; }, trapTab: trapTab, focusables: focusables
  };

  /* ---------------- AuraState ---------------- */
  var STATES = ['default', 'empty', 'loading', 'error', 'success'];
  function mainEl() { return document.getElementById('conteudo'); }
  function currentState() {
    var m = mainEl(), s = m && m.getAttribute('data-state');
    return STATES.indexOf(s) !== -1 ? s : 'default';
  }
  var stateListeners = [];
  function skeleton(o) {
    o = o || {};
    var rows = o.rows || 4, v = o.variant || 'list', h = '<div role="status" aria-live="polite" aria-busy="true"><span class="sr-only">Carregando…</span>';
    var i;
    if (v === 'cards') {
      h += '<div class="grid-3" aria-hidden="true">';
      for (i = 0; i < rows; i++) h += '<div class="card"><div class="card-body"><span class="skeleton skeleton-text" style="width:40%"></span><span class="skeleton skeleton-title"></span><span class="skeleton skeleton-text"></span></div></div>';
      h += '</div>';
    } else {
      h += '<div class="stack" aria-hidden="true">';
      for (i = 0; i < rows; i++) h += '<div class="row" style="flex-wrap:nowrap"><span class="skeleton skeleton-circle"></span><div class="grow"><span class="skeleton skeleton-text" style="width:' + (60 - (i % 3) * 10) + '%"></span><span class="skeleton skeleton-text" style="width:35%"></span></div></div>';
      h += '</div>';
    }
    return h + '</div>';
  }
  function emptyHtml(o) {
    o = o || {};
    var a = o.action ? (o.action.href ? '<a class="btn btn-primary" href="' + esc(o.action.href) + '">' : '<button type="button" class="btn btn-primary" data-aura-action>') + (o.action.icon ? ico(o.action.icon) : '') + esc(o.action.label) + (o.action.href ? '</a>' : '</button>') : '';
    return '<div class="empty-state"><div class="empty-state-icon">' + ico(o.icon || 'search') + '</div><h2 class="h3">' + esc(o.title || 'Nada por aqui ainda') + '</h2><p>' + esc(o.text || 'Quando houver itens, eles aparecem aqui.') + '</p>' + a + '</div>';
  }
  function errorHtml(o) {
    o = o || {};
    return '<div class="empty-state" role="alert"><div class="empty-state-icon is-danger">' + ico('alert') + '</div><h2 class="h3">' + esc(o.title || 'Não conseguimos carregar') + '</h2><p>' + esc(o.text || 'Algo deu errado do nosso lado. Seus dados estão seguros. Tente de novo em instantes.') + '</p><button type="button" class="btn btn-secondary" data-aura-retry>' + ico('refresh') + 'Tentar de novo</button></div>';
  }
  // render(target, state?, opts?): preenche target conforme o estado. state omitido = estado da URL.
  // opts: { title, text, icon, action:{label,href,onClick,icon}, rows, variant, onRetry, renderDefault(target) }
  function render(target, state, o) {
    if (state && typeof state === 'object') { o = state; state = null; }
    o = o || {}; state = state || currentState();
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return state;
    if (state === 'loading') el.innerHTML = skeleton(o);
    else if (state === 'empty') el.innerHTML = emptyHtml(o);
    else if (state === 'error') el.innerHTML = errorHtml(o);
    else if (o.renderDefault) o.renderDefault(el);
    var act = el.querySelector('[data-aura-action]'); if (act && o.action && o.action.onClick) act.addEventListener('click', o.action.onClick);
    var rt = el.querySelector('[data-aura-retry]'); if (rt) rt.addEventListener('click', function () { if (o.onRetry) o.onRetry(); else { setState('loading'); setTimeout(function () { setState('default'); }, 900); } });
    return state;
  }
  function setState(s) {
    var m = mainEl(); if (!m || STATES.indexOf(s) === -1) return;
    m.setAttribute('data-state', s);
    stateListeners.forEach(function (fn) { try { fn(s); } catch (e) {} });
    document.dispatchEvent(new CustomEvent('aura:statechange', { detail: { state: s } }));
  }
  window.AuraState = {
    states: STATES, get: currentState, set: setState, render: render, skeleton: skeleton, empty: emptyHtml, error: errorHtml,
    on: function (fn) { stateListeners.push(fn); fn(currentState()); }
  };

  /* ---------------- AuraShell ---------------- */
  var MENUS = {
    admin: [
      { key: 'inicio', label: 'Início', icon: 'home' },
      { key: 'usuarios', label: 'Usuários', icon: 'users', perm: 'users:read' },
      { key: 'perfis-permissoes', label: 'Papéis e permissões', icon: 'shield', perm: 'roles:read' },
      { key: 'planos', label: 'Planos', icon: 'credit-card' },
      { key: 'cupons', label: 'Cupons', icon: 'tag' },
      { key: 'configuracoes', label: 'Configurações', icon: 'settings' }
    ],
    personal: [
      { key: 'inicio', label: 'Início', icon: 'home' },
      { key: 'alunos', label: 'Alunos', icon: 'users' },
      { key: 'exercicios', label: 'Exercícios', icon: 'clipboard' },
      { key: 'treinos', label: 'Treinos', icon: 'dumbbell' },
      { key: 'minha-assinatura', label: 'Minha assinatura', icon: 'credit-card' },
      { key: 'configuracoes', label: 'Configurações', icon: 'settings' }
    ],
    aluno: [
      { key: 'inicio', label: 'Início', icon: 'home' },
      { key: 'treino', label: 'Treino', icon: 'dumbbell' },
      { key: 'perfil', label: 'Meu perfil', icon: 'user' }
    ]
  };
  /* lote E: grupo Acompanhamento do personal (TRN-30 a TRN-33); contador de alertas abertos so quando G5DATA existe */
  var ACOMP = { personal: [
    { key: 'alertas', label: 'Alertas', icon: 'alert' }, { key: 'execucoes', label: 'Execuções', icon: 'dumbbell' },
    { key: 'questionarios', label: 'Questionários', icon: 'clipboard' }, { key: 'mensagens', label: 'Mensagens', icon: 'mail' }
  ] };
  /* lote D: grupo Prescricao IA do personal (TRN-40 a TRN-42) */
  var IAMENU = { personal: [
    { key: 'ia', label: 'Prescrição IA', icon: 'sparkles' }, { key: 'importar-ia', label: 'Importar planilha', icon: 'file-text' }, { key: 'dados-ia', label: 'Dados usados pela IA', icon: 'lock' }
  ] };
  var SOON = {
    personal: [
      { label: 'Financeiro', icon: 'chart' }, { label: 'Relatórios', icon: 'file-text' }
    ]
  };
  var SEARCH_PLACEHOLDER = { admin: 'Buscar usuários, planos ou cupons…', personal: 'Buscar alunos ou treinos…', aluno: 'Buscar treino…' };
  // Rotas padrao relativas a screens/<grupo>/<tela>.html. Sobrescreva com mount({ routes:{ chave:'url' } }).
  var ROUTES = {
    inicio: function (role) { return '../home/' + role + '.html'; },
    treino: '../home/aluno-treino-do-dia.html', perfil: '../config/configuracoes.html', configuracoes: '../config/configuracoes.html',
    alunos: '../alunos/meus-alunos.html', exercicios: '../exercicios/catalogo.html', treinos: '../treinos/biblioteca.html', 'minha-assinatura': '../config/assinatura.html', usuarios: '../admin/usuarios.html', 'perfis-permissoes': '../admin/perfis.html',
    planos: '../planos/admin-planos.html', cupons: '../admin/cupons.html',
    alertas: '../acompanhamento/alertas.html', execucoes: '../acompanhamento/execucoes.html', questionarios: '../acompanhamento/questionarios.html', mensagens: '../acompanhamento/mensagens.html',
    ia: '../ia/painel-sugestoes.html', 'importar-ia': '../ia/importar.html', 'dados-ia': '../ia/dados-ia.html'
  };
  var themeDropped = false;
  var SWITCH_PROFILE = '../auth/selecionar-perfil.html';
  var LOGIN = '../auth/login.html';

  function popover(btn, panel, wrapper) {
    function close(ret) {
      if (panel.hidden) return;
      panel.hidden = true; btn.setAttribute('aria-expanded', 'false');
      if (ret) btn.focus();
    }
    function open() {
      document.dispatchEvent(new CustomEvent('aura:popover-open', { detail: panel }));
      panel.hidden = false; btn.setAttribute('aria-expanded', 'true');
      var f = focusables(panel)[0]; if (f) f.focus();
    }
    btn.addEventListener('click', function () { if (panel.hidden) open(); else close(true); });
    wrapper.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); close(true); } });
    wrapper.addEventListener('focusout', function (e) { if (!panel.hidden && e.relatedTarget && !wrapper.contains(e.relatedTarget)) close(false); });
    document.addEventListener('click', function (e) { if (!wrapper.contains(e.target)) close(false); });
    document.addEventListener('aura:popover-open', function (e) { if (e.detail !== panel) close(false); });
    return { close: close };
  }

  // Faixa global de assinatura do personal: LIGADA por padrao (desligue com mount({subscriptionBanner:false})).
  // Estado vem de AURA.subscription (conta pendente@exemplo.com.br ou ?sub=inadimplente|vencendo). Prazo e data reais.
  function subBanner(opts, role, q, A, href) {
    if (opts.subscriptionBanner === false || role !== 'personal' || !A.subscription) return '';
    var v = A.subscription, st = v.status;
    if (st !== 'inadimplente' && st !== 'vencendo') return '';
    var late = st === 'inadimplente';
    var days = late && v.graceUntil ? A.daysBetween(A.today, v.graceUntil) : 0;
    return '<div class="shell-banner ' + (late ? 'alert-danger' : 'alert-warning') + '" role="status" id="faixa-assinatura">' + ico(late ? 'alert' : 'clock') +
      '<p>' + (late ? '<strong>Pagamento pendente.</strong> Não conseguimos cobrar seu cartão. Você tem ' + days + ' dias, até ' + A.fmtDate(v.graceUntil) + ', para atualizar o pagamento. Depois disso o plano fica só para leitura e nada é apagado.'
        : '<strong>Renovação chegando.</strong> Sua assinatura renova em ' + A.fmtDate(v.nextChargeAt) + ' e o cartão vence antes. Confira o cartão para evitar falha.') + '</p>' +
      '<a class="btn btn-secondary" href="' + esc(href('minha-assinatura')) + '">' + (late ? 'Atualizar pagamento' : 'Ver assinatura') + '</a></div>';
  }

  function mount(opts) {
    opts = opts || {};
    var q = qs();
    var role = MENUS[q.role] ? q.role : (MENUS[opts.role] ? opts.role : 'admin');
    var isAluno = role === 'aluno';
    var A = window.AURA || { sessions: {}, notifications: [], can: function () { return true; }, initials: function (n) { return n.charAt(0); } };
    var session = A.sessions[role] || { name: 'Usuário', title: '' };
    var routes = opts.routes || {};
    var main = mainEl();
    if (!main) { main = document.createElement('main'); main.id = 'conteudo'; document.body.appendChild(main); }

    // acesso: permissao exigida pela tela
    if (opts.requires && !A.can(role, opts.requires)) {
      location.replace('../sistema/acesso-negado.html?role=' + encodeURIComponent(role));
      return;
    }

    document.documentElement.lang = 'pt-BR';
    var title = opts.title || document.title || 'aura-fit';
    // preserva "ID · Nome · aura-fit" ja definido pela tela; opts.documentTitle sobrescreve
    if (opts.documentTitle) document.title = opts.documentTitle;
    else if (!/·.*aura-fit\s*$/.test(document.title)) document.title = title + ' | aura-fit';

    function href(key) {
      if (routes[key]) return routes[key];
      var r = ROUTES[key], u = typeof r === 'function' ? r(role) : (r || '#');
      if (u === '#') return u;
      var params = ['role=' + role];
      if (q.theme && !themeDropped) params.push('theme=' + encodeURIComponent(q.theme));
      if (q.sub) params.push('sub=' + encodeURIComponent(q.sub));
      return u + '?' + params.join('&');
    }
    var loginHref = routes.login || LOGIN;

    var items = MENUS[role].filter(function (it) { return !it.perm || A.can(role, it.perm); });
    function navLink(it, cls) {
      var cur = it.key === opts.active ? ' aria-current="page"' : '';
      return '<a class="' + cls + '" href="' + esc(href(it.key)) + '"' + cur + '>' + ico(it.icon) + '<span>' + esc(it.label) + '</span></a>';
    }

    var unread = A.notifications.filter(function (n) { return n.role === role && n.unread; }).length;
    var notifs = A.notifications.filter(function (n) { return n.role === role; });
    var initials = A.initials(session.name);
    var memberships = (A.me && A.me[role] && A.me[role].memberships) || [];

    var app = document.createElement('div');
    app.className = 'app' + (isAluno ? ' is-aluno' : '');
    app.setAttribute('data-role', role);

    var html = '<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>';
    if (!isAluno) {
      html += '<aside class="sidebar" id="menu-lateral" aria-label="Menu lateral">' +
        '<div class="sidebar-head"><a class="brand" href="' + esc(href('inicio')) + '" aria-label="aura-fit, ir para o início">aura-<span>fit</span></a>' +
        '<button type="button" class="sidebar-close" aria-label="Fechar menu">' + ico('x') + '</button></div>' +
        '<nav class="sidebar-nav" aria-label="Principal"><ul>' +
        items.map(function (it) { return '<li>' + navLink(it, 'nav-link') + '</li>'; }).join('') + '</ul>' +
        (ACOMP[role] ? '<p class="nav-group-label" id="acomp-label">Acompanhamento</p><ul aria-labelledby="acomp-label">' +
          ACOMP[role].map(function (it) { var n = (it.key === 'alertas' && window.G5DATA && window.G5DATA.E) ? window.G5DATA.E.alerts.filter(function (x) { var d = window.G5DATA, st = d.find(x.sid); return x.status !== 'RESOLVED' && !(st && st.status === 'ENDED') && !x.noOwner; }).length : 0; return '<li>' + navLink(it, 'nav-link').replace('</a>', (n ? '<span class="badge badge-warning">' + n + '<span class="sr-only"> abertos</span></span>' : '') + '</a>') + '</li>'; }).join('') + '</ul>' : '') +
        (IAMENU[role] ? '<p class="nav-group-label" id="ia-label">Prescrição com IA</p><ul aria-labelledby="ia-label">' + IAMENU[role].map(function (it) { return '<li>' + navLink(it, 'nav-link') + '</li>'; }).join('') + '</ul>' : '') +
        (SOON[role] ? '<p class="nav-group-label" id="soon-label">Em breve</p><ul aria-labelledby="soon-label">' +
          SOON[role].map(function (it) { return '<li><span class="nav-link is-soon" aria-disabled="true">' + ico(it.icon) + '<span>' + esc(it.label) + '</span><span class="nav-soon">Em breve</span></span></li>'; }).join('') + '</ul>' : '') +
        '</nav>' +
        '<div class="sidebar-foot"><span class="avatar avatar-sm" aria-hidden="true">' + esc(initials) + '</span><div class="sidebar-user"><strong>' + esc(session.name) + '</strong><span>' + esc(session.title) + '</span></div></div>' +
        '</aside><div class="scrim" hidden></div>';
    }
    html += '<div class="app-body"><header class="topbar">';
    if (!isAluno) html += '<button type="button" class="topbar-btn menu-btn" aria-label="Abrir menu" aria-controls="menu-lateral" aria-expanded="false">' + ico('menu') + '</button>';
    else html += '<a class="brand brand-top" href="' + esc(href('inicio')) + '" aria-label="aura-fit, ir para o início">aura-<span>fit</span></a>';
    html += '<p class="topbar-title">' + esc(title) + '</p>';
    if (!isAluno) {
      html += '<form class="topbar-search" role="search" onsubmit="return false"><label class="sr-only" for="busca-global">Buscar</label>' + ico('search') +
        '<input class="input" id="busca-global" type="search" autocomplete="off" placeholder="' + esc(SEARCH_PLACEHOLDER[role]) + '"></form>';
    }
    html += '<div class="topbar-actions">';
    if (!isAluno) html += '<button type="button" class="topbar-btn search-toggle" aria-label="Abrir busca" aria-expanded="false" aria-controls="busca-global">' + ico('search') + '</button>';
    html += '<div class="pop-wrap" data-pop="theme"><button type="button" class="topbar-btn" aria-haspopup="true" aria-expanded="false" aria-controls="pop-tema" id="btn-tema"><span class="theme-ico"></span></button>' +
      '<div class="popover" id="pop-tema" role="group" aria-label="Aparência" hidden><p class="label mb-2">Aparência</p>' +
      '<div class="segmented" role="radiogroup" aria-label="Tema">' +
      [['light', 'Claro', 'sun'], ['dark', 'Escuro', 'moon'], ['system', 'Sistema', 'monitor']].map(function (t) {
        return '<label><input type="radio" name="tema-shell" value="' + t[0] + '"><span>' + ico(t[2], 'icon-sm') + t[1] + '</span></label>';
      }).join('') + '</div>' +
      '<p class="label mt-4 mb-2">Tamanho do texto</p><div class="segmented" role="radiogroup" aria-label="Tamanho do texto">' +
      [['padrao', 'Padrão'], ['grande', 'Grande']].map(function (t) { return '<label><input type="radio" name="tam-shell" value="' + t[0] + '"><span>' + t[1] + '</span></label>'; }).join('') +
      '</div></div></div>';
    html += '<div class="pop-wrap" data-pop="notif"><button type="button" class="topbar-btn" aria-haspopup="true" aria-expanded="false" aria-controls="pop-notif" aria-label="Notificações' + (unread ? ', ' + unread + ' não lidas' : '') + '">' + ico('bell') + (unread ? '<span class="dot-count" aria-hidden="true">' + unread + '</span>' : '') + '</button>' +
      '<div class="popover popover-wide" id="pop-notif" role="region" aria-label="Notificações" hidden><div class="row-between mb-2"><h2 class="h4">Notificações</h2></div>' +
      (notifs.length ? '<ul>' + notifs.map(function (n) {
        return '<li class="notif' + (n.unread ? ' is-unread' : '') + '"><span class="notif-ico">' + ico(n.icon || 'info', 'icon-sm') + '</span><div><strong>' + esc(n.title) + (n.unread ? '<span class="sr-only"> (não lida)</span>' : '') + '</strong><p class="muted">' + esc(n.text) + '</p><p class="caption faint">' + esc(A.relDate ? A.relDate(n.at) : '') + '</p></div></li>';
      }).join('') + '</ul>' : '<p class="muted">Você não tem notificações.</p>') + '</div></div>';
    html += '<div class="pop-wrap" data-pop="user"><button type="button" class="topbar-btn avatar-btn" aria-haspopup="true" aria-expanded="false" aria-controls="pop-user" aria-label="Menu da conta de ' + esc(session.name) + '"><span class="avatar avatar-sm" aria-hidden="true">' + esc(initials) + '</span></button>' +
      '<div class="popover" id="pop-user" role="group" aria-label="Conta" hidden><p class="body-medium">' + esc(session.name) + '</p><p class="muted caption mb-2">' + esc(session.title) + '</p>' +
      '<ul class="pop-menu"><li><a href="' + esc(href(isAluno ? 'perfil' : 'configuracoes')) + '">' + ico('settings') + (isAluno ? 'Meu perfil' : 'Configurações') + '</a></li>' +
      (memberships.length > 1 ? '<li><a href="' + esc(routes.switchProfile || SWITCH_PROFILE) + '">' + ico('users') + 'Trocar conta</a></li>' : '') +
      '<li><a href="' + esc(loginHref) + '">' + ico('logout') + 'Sair</a></li></ul></div></div>';
    html += '</div></header>' + subBanner(opts, role, q, A, href) + '<div class="mount-point"></div></div>';
    if (isAluno) {
      html += '<nav class="bottom-nav" aria-label="Principal"><ul>' + items.map(function (it) { return '<li>' + navLink(it, 'bottom-link') + '</li>'; }).join('') + '</ul></nav>';
    }
    app.innerHTML = html;

    main.parentNode.insertBefore(app, main);
    app.querySelector('.mount-point').replaceWith(main);
    main.classList.add('content');
    main.setAttribute('tabindex', '-1');
    if (!main.hasAttribute('data-state') || STATES.indexOf(main.getAttribute('data-state')) === -1) main.setAttribute('data-state', 'default');
    if (STATES.indexOf(q.state) !== -1) main.setAttribute('data-state', q.state);
    document.documentElement.setAttribute('data-role', role);

    // tema
    var themeBtn = app.querySelector('#btn-tema'), themeIco = themeBtn.querySelector('.theme-ico');
    var radios = app.querySelectorAll('input[name="tema-shell"]');
    var sizeRadios = app.querySelectorAll('input[name="tam-shell"]');
    var LBL = { light: 'Claro', dark: 'Escuro', system: 'Sistema' };
    function syncTheme() {
      var T = window.AuraTheme; if (!T) return;
      var m = T.get(), r = T.resolved();
      themeIco.innerHTML = ico(r === 'dark' ? 'moon' : 'sun');
      themeBtn.setAttribute('aria-label', 'Aparência: ' + LBL[m] + '. Alterar tema');
      Array.prototype.forEach.call(radios, function (x) { x.checked = x.value === m; });
      Array.prototype.forEach.call(sizeRadios, function (x) { x.checked = x.value === T.getSize(); });
    }
    Array.prototype.forEach.call(radios, function (x) { x.addEventListener('change', function () { if (window.AuraTheme) window.AuraTheme.set(x.value); syncTheme(); }); });
    Array.prototype.forEach.call(sizeRadios, function (x) { x.addEventListener('change', function () { if (window.AuraTheme) window.AuraTheme.setSize(x.value); }); });
    // escolha explicita de tema: tira ?theme= dos links do shell para a escolha valer nas proximas telas
    document.addEventListener('aura:themechange', function (e) {
      syncTheme();
      if (e.detail && e.detail.explicit && !themeDropped) {
        themeDropped = true;
        Array.prototype.forEach.call(app.querySelectorAll('a[href]'), function (a) { a.setAttribute('href', a.getAttribute('href').replace(/([?&])theme=[a-z]+&?/, '$1').replace(/[?&]$/, '')); });
      }
    });
    syncTheme();

    // popovers
    Array.prototype.forEach.call(app.querySelectorAll('.pop-wrap'), function (w) { popover(w.querySelector('button'), w.querySelector('.popover'), w); });

    // busca (mobile)
    var searchToggle = app.querySelector('.search-toggle'), topbar = app.querySelector('.topbar');
    if (searchToggle) searchToggle.addEventListener('click', function () {
      var on = topbar.classList.toggle('search-open');
      searchToggle.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) app.querySelector('#busca-global').focus();
    });
    var sform = app.querySelector('.topbar-search');
    if (sform) sform.addEventListener('submit', function () { toast('A busca é só demonstração neste protótipo.', { tone: 'info' }); });

    // drawer
    if (!isAluno) {
      var side = app.querySelector('.sidebar'), scrim = app.querySelector('.scrim'), menuBtn = app.querySelector('.menu-btn'), body = app.querySelector('.app-body');
      var mqDesk = window.matchMedia('(min-width: 768px)');
      var openD = false;
      var setDrawer = function (on, restore) {
        openD = on;
        app.classList.toggle('drawer-open', on);
        scrim.hidden = !on;
        menuBtn.setAttribute('aria-expanded', on ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', on ? 'Fechar menu' : 'Abrir menu');
        body.inert = on && !mqDesk.matches;
        document.body.classList.toggle('has-drawer', on);
        if (on) { var cur = side.querySelector('[aria-current="page"]') || focusables(side)[0]; if (cur) cur.focus(); }
        else if (restore) menuBtn.focus();
      };
      menuBtn.addEventListener('click', function () { setDrawer(!openD, true); });
      side.querySelector('.sidebar-close').addEventListener('click', function () { setDrawer(false, true); });
      scrim.addEventListener('click', function () { setDrawer(false, true); });
      side.addEventListener('keydown', function (e) {
        if (!openD || mqDesk.matches) return;
        if (e.key === 'Escape') { e.preventDefault(); setDrawer(false, true); }
        else trapTab(e, side);
      });
      var onMq = function () { if (mqDesk.matches && openD) setDrawer(false, false); };
      if (mqDesk.addEventListener) mqDesk.addEventListener('change', onMq); else mqDesk.addListener(onMq);
    }

    // estado: mensagem de sucesso opcional
    if (currentState() === 'success' && main.getAttribute('data-success-message')) {
      toast(main.getAttribute('data-success-message'), { tone: 'success' });
    }
    initTabs(document);
    document.dispatchEvent(new CustomEvent('aura:shellready', { detail: { role: role } }));
    return { role: role, state: currentState() };
  }

  window.AuraShell = {
    menus: MENUS,
    mount: function (opts) {
      if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', function () { mount(opts); }); return; }
      return mount(opts);
    }
  };
  initDelegates();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initTabs(document); });
})();
