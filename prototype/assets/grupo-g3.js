/* grupo-g3.js - nucleo do grupo G3 (Admin): estado da sessao simulada, guardas de acesso, ajudantes.
   Depende de data.js, data-g3.js, icons.js e shell.js. Nada aqui grava fora da sessao do navegador (sessionStorage). */
(function () {
  'use strict';
  var A = window.AURA, D = window.G3DATA || {};
  var q = {};
  try {
    location.search.replace(/^\?/, '').split('&').forEach(function (p) {
      if (!p) return;
      var kv = p.split('=');
      q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    });
  } catch (e) {}

  /* ---------- armazenamento da sessao ---------- */
  var mem = {};
  function load() {
    try { var s = window.sessionStorage.getItem('aura-g3'); if (s) return JSON.parse(s); } catch (e) {}
    return mem.data || {};
  }
  var data = load();
  if (q.reset === '1') { data = {}; }
  function save() {
    mem.data = data;
    try { window.sessionStorage.setItem('aura-g3', JSON.stringify(data)); } catch (e) {}
  }
  data.userOv = data.userOv || {}; data.audit = data.audit || []; data.coupons = data.coupons || []; data.couponOv = data.couponOv || {};
  data.invites = data.invites || []; data.inviteOv = data.inviteOv || {}; data.perms = data.perms || null;
  if (q.reset === '1') save();

  /* ---------- utilidades ---------- */
  var ESC = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function ico(n, c) { return '<svg class="icon' + (c ? ' ' + c : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function nowIso() { var d = new Date(); return A.today + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function dayShift(iso, n) { var p = iso.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2] + n); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  var suporte = q.as === 'suporte' || q.variant === 'somente-leitura';
  var variant = q.variant || '';

  /* ---------- links ---------- */
  function href(file, extra) {
    var p = ['role=admin'];
    if (q.theme) p.push('theme=' + encodeURIComponent(q.theme));
    if (q.as === 'suporte') p.push('as=suporte');
    if (extra) Object.keys(extra).forEach(function (k) { if (extra[k] !== '' && extra[k] != null) p.push(k + '=' + encodeURIComponent(extra[k])); });
    return file + (file.indexOf('?') === -1 ? '?' : '&') + p.join('&');
  }

  /* ---------- permissoes ---------- */
  function rolePerms(key) {
    if (data.perms && data.perms[key]) return data.perms[key].slice();
    return (A.rolePerms[key] || []).slice();
  }
  function can(perm) { return rolePerms(suporte ? 'suporte' : 'admin').indexOf(perm) !== -1; }

  /* ---------- usuarios ---------- */
  function users() {
    return A.users.map(function (u) {
      var o = data.userOv[u.id];
      if (!o) return u;
      var c = {}; for (var k in u) c[k] = u[k];
      for (var j in o) c[j] = o[j];
      return c;
    });
  }
  function user(id) { return users().filter(function (u) { return u.id === id; })[0] || null; }
  function setUser(id, patch) { data.userOv[id] = Object.assign(data.userOv[id] || {}, patch); save(); }
  function activeAdmins() { return users().filter(function (u) { return u.roles.indexOf('admin') !== -1 && u.status === 'ativo'; }); }
  function isLastAdmin(u) {
    if (!u || u.roles.indexOf('admin') === -1) return false;
    if (variant === 'ultimo-admin') return true;
    var a = activeAdmins();
    return a.length <= 1 && a.some(function (x) { return x.id === u.id; });
  }
  function roleName(k) { return A.roleLabel[k] || k; }
  function blockInfo(u) {
    var m = (D.blockMeta || {})[u.id] || {};
    var ov = data.userOv[u.id] || {};
    return { by: ov.blockedBy || m.by || 'Equipe de administração', at: ov.blockedAt || m.at || null, reason: u.blockedReason || '' };
  }

  /* ---------- auditoria ---------- */
  function addAudit(action, target, detail) {
    data.audit.unshift({ at: nowIso(), actorName: A.me.admin.name, action: action, targetName: target, detail: detail || '' });
    save();
  }
  function audit() {
    return data.audit.concat(A.audit).sort(function (a, b) { return a.at < b.at ? 1 : -1; });
  }

  /* ---------- cupons ---------- */
  function coupons() {
    var base = A.coupons.map(function (c) {
      var o = data.couponOv[c.id]; if (!o) return c;
      var x = {}; for (var k in c) x[k] = c[k]; for (var j in o) x[j] = o[j]; return x;
    });
    return data.coupons.concat(base);
  }
  function coupon(id) { return coupons().filter(function (c) { return c.id === id; })[0] || null; }
  function couponStatus(c) {
    if (c.status === 'pausado') return 'pausado';
    if (c.uses >= c.maxUses) return 'esgotado';
    if (c.validUntil < A.today) return 'expirado';
    if (c.validFrom > A.today) return 'agendado';
    return c.status;
  }
  function saveCoupon(c, isNew) {
    if (isNew) data.coupons.unshift(c); else data.couponOv[c.id] = Object.assign(data.couponOv[c.id] || {}, c);
    save();
  }
  function planName(id) { var p = A.byId(A.plans, id); return p ? p.name : id; }
  function discountText(c) { return c.type === 'percentual' ? c.value + '%' : A.fmtBRL(c.value); }
  function durationText(c) { return c.duration === 'primeira' ? 'Primeira cobrança' : "Primeiras " + c.months + " mensalidades"; }

  /* ---------- convites ---------- */
  function invites() {
    return data.invites.concat(A.invites).map(function (i) { return data.inviteOv[i.id] ? Object.assign({}, i, data.inviteOv[i.id]) : i; });
  }
  function addInvite(i) { data.invites.unshift(i); save(); }
  function setInvite(id, patch) { data.inviteOv[id] = Object.assign(data.inviteOv[id] || {}, patch); save(); }

  /* ---------- matriz ---------- */
  function setPerms(key, list) { data.perms = data.perms || {}; data.perms[key] = list.slice(); save(); }

  /* ---------- tela ---------- */
  function breadcrumb(items) {
    return '<nav aria-label="Você está em" class="mb-2"><ol class="breadcrumb">' + items.map(function (it, i) {
      return '<li>' + (i === items.length - 1 ? '<span aria-current="page">' + ESC(it[0]) + '</span>' : '<a href="' + ESC(it[1]) + '">' + ESC(it[0]) + '</a>') + '</li>';
    }).join('') + '</ol></nav>';
  }
  function pager(total, page, size, label) {
    var pages = Math.max(1, Math.ceil(total / size)), h = '';
    if (pages < 2) return '';
    h += '<li><button type="button" class="page-link" data-page="' + (page - 1) + '"' + (page <= 1 ? ' aria-disabled="true"' : '') + '>' + ico('chevron-left', 'icon-sm') + '<span class="sr-only">Página anterior</span></button></li>';
    for (var i = 1; i <= pages; i++) h += '<li><button type="button" class="page-link" data-page="' + i + '"' + (i === page ? ' aria-current="page"' : '') + '><span class="sr-only">Página </span>' + i + '</button></li>';
    h += '<li><button type="button" class="page-link" data-page="' + (page + 1) + '"' + (page >= pages ? ' aria-disabled="true"' : '') + '>' + ico('chevron-right', 'icon-sm') + '<span class="sr-only">Próxima página</span></button></li>';
    return '<nav aria-label="' + ESC(label || 'Paginação') + '"><ul class="pagination">' + h + '</ul></nav>';
  }

  function boot(o, fn) {
    o = o || {};
    var role = q.role || 'admin';
    if (role !== 'admin' || (o.manage && suporte)) {
      location.replace('../sistema/acesso-negado.html?role=' + encodeURIComponent(role) + (q.theme ? '&theme=' + q.theme : ''));
      return false;
    }
    var routes = {
      inicio: href('../home/admin.html'), usuarios: href('usuarios.html'), 'perfis-permissoes': href('perfis.html'),
      planos: href('../planos/admin-planos.html'), cupons: href('cupons.html'), configuracoes: href('../config/configuracoes.html'),
      login: '../auth/login.html'
    };
    function after() {
      document.title = o.id + ' · ' + o.title + ' · aura-fit';
      if (suporte) {
        var l = document.querySelector('.sidebar .nav-link[href*="perfis.html"]');
        var li = l && l.closest('li'); if (li) li.parentNode.removeChild(li);
      }
      if (fn) fn();
    }
    var h1 = document.querySelector('main h1');
    if (h1 && A.isExample) { var hp = h1.parentNode.querySelector('p'); var bd = ' ' + (A.modelBadge ? A.modelBadge('Dados de demonstração') : ''); if (hp) hp.insertAdjacentHTML('beforeend', bd); else h1.insertAdjacentHTML('afterend', bd); }
    document.addEventListener('aura:shellready', after, { once: true });
    window.AuraShell.mount({ role: 'admin', active: o.active, title: o.shortTitle || o.title, routes: routes });
    return true;
  }

  // AuraState.render com textos de admin
  function region(target, o) { return window.AuraState.render(target, o); }

  function csvDownload(name, rows) {
    var text = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(';'); }).join('\r\n');
    try {
      var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (e) {}
  }

  window.G3 = {
    q: q, variant: variant, suporte: suporte, data: D, today: A.today, me: A.me.admin,
    esc: ESC, ico: ico, norm: norm, nowIso: nowIso, dayShift: dayShift, href: href, can: can,
    rolePerms: rolePerms, setPerms: setPerms, users: users, user: user, setUser: setUser, activeAdmins: activeAdmins, isLastAdmin: isLastAdmin,
    roleName: roleName, blockInfo: blockInfo, addAudit: addAudit, audit: audit,
    coupons: coupons, coupon: coupon, couponStatus: couponStatus, saveCoupon: saveCoupon, planName: planName, discountText: discountText, durationText: durationText,
    invites: invites, addInvite: addInvite, setInvite: setInvite,
    confirm: function (o) { return window.AuraUI.confirm(o); }, breadcrumb: breadcrumb, pager: pager, boot: boot, region: region, csvDownload: csvDownload, reset: function () { data = { userOv: {}, audit: [], coupons: [], couponOv: {}, invites: [], inviteOv: {}, perms: null }; save(); }
  };
})();
