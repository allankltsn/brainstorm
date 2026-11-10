/* grupo-g1.js - ajudantes das telas do G1 (AUTH, SIS, LEG). Depende de theme.js, icons.js, data.js, data-g1.js e shell.js. */
(function () {
  'use strict';
  var A = window.AURA || {}, D = window.AURA_G1 || {};
  var STATES = ['default', 'empty', 'loading', 'error', 'success'];

  function qs() {
    var out = {};
    location.search.replace(/^\?/, '').split('&').forEach(function (p) {
      if (!p) return;
      var kv = p.split('=');
      try { out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } catch (e) {}
    });
    return out;
  }
  var q = qs();
  function main() { return document.getElementById('conteudo'); }
  function ico(n, c) { return window.AuraUI ? window.AuraUI.icon(n, c) : ''; }
  function esc(s) { return window.AuraUI ? window.AuraUI.esc(s) : String(s); }

  /* ---------- variantes: [data-v="a b"] aparece so nessas; [data-vnot="a b"] some nelas ---------- */
  var current = q.variant || '';
  function applyVariant() {
    var m = main(); if (m) m.setAttribute('data-variant', current);
    Array.prototype.forEach.call(document.querySelectorAll('[data-v]'), function (el) {
      el.hidden = (' ' + el.getAttribute('data-v') + ' ').indexOf(' ' + current + ' ') === -1;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-vnot]'), function (el) {
      el.hidden = (' ' + el.getAttribute('data-vnot') + ' ').indexOf(' ' + current + ' ') !== -1;
    });
    document.dispatchEvent(new CustomEvent('g1:variant', { detail: current }));
  }
  function setVariant(v) { current = v || ''; applyVariant(); }

  /* ---------- estados (loading / error) ---------- */
  function skeletonForm() {
    return '<div role="status" aria-live="polite" aria-busy="true"><span class="sr-only">Carregando…</span><div class="stack" aria-hidden="true">' +
      '<span class="skeleton skeleton-title g1-skel-title"></span><span class="skeleton skeleton-text g1-skel-sub"></span>' +
      '<span class="skeleton skeleton-block g1-skel-input"></span><span class="skeleton skeleton-block g1-skel-input"></span>' +
      '<span class="skeleton skeleton-block g1-skel-btn"></span></div></div>';
  }
  function renderStates() {
    var el = document.getElementById('g1-state'); if (!el) return;
    var s = window.AuraState ? window.AuraState.get() : 'default';
    if (s === 'loading') el.innerHTML = skeletonForm();
    else if (s === 'error') {
      el.innerHTML = '<div class="empty-state" role="alert"><div class="empty-state-icon is-danger">' + ico('alert') + '</div><h2 class="h3">Não conseguimos carregar esta tela</h2><p>Algo deu errado do nosso lado. Nada foi perdido. Tente de novo em instantes.</p><button type="button" class="btn btn-secondary" data-g1-retry>' + ico('refresh') + 'Tentar de novo</button></div>';
      el.querySelector('[data-g1-retry]').addEventListener('click', function () { window.AuraState.set('loading'); setTimeout(function () { window.AuraState.set('default'); }, 900); });
    } else el.innerHTML = '';
  }

  /* ---------- tema ---------- */
  var NEXT = { light: 'dark', dark: 'system', system: 'light' };
  var LBL = { light: 'Claro', dark: 'Escuro', system: 'Igual ao aparelho' };
  function syncThemeBtns() {
    var T = window.AuraTheme; if (!T) return;
    var m = T.get(), r = T.resolved();
    Array.prototype.forEach.call(document.querySelectorAll('[data-g1-theme]'), function (b) {
      b.innerHTML = ico(r === 'dark' ? 'moon' : 'sun');
      b.setAttribute('aria-label', 'Tema: ' + LBL[m] + '. Tocar para trocar para ' + LBL[NEXT[m]].toLowerCase());
    });
  }
  function bindTheme() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-g1-theme]'), function (b) {
      b.addEventListener('click', function () { window.AuraTheme.set(NEXT[window.AuraTheme.get()]); syncThemeBtns(); });
    });
    document.addEventListener('aura:themechange', syncThemeBtns);
    syncThemeBtns();
  }

  /* ---------- navegacao ---------- */
  function withTheme(url) {
    if (!q.theme || /[?&]theme=/.test(url)) return url;
    var h = url.indexOf('#'), hash = h > -1 ? url.slice(h) : '', base = h > -1 ? url.slice(0, h) : url;
    return base + (base.indexOf('?') > -1 ? '&' : '?') + 'theme=' + encodeURIComponent(q.theme) + hash;
  }
  function go(url) { location.href = withTheme(url); }
  function keepThemeOnLinks() {
    if (!q.theme) return;
    Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
      var h = a.getAttribute('href');
      if (/^(\.\.?\/|[a-z0-9-]+\.html)/i.test(h)) a.setAttribute('href', withTheme(h));
    });
  }
  // so aceita caminhos relativos internos (evita redirecionamento aberto)
  function safeNext(n) { return n && /^\.\.\/[a-z0-9\/_.-]+\.html(\?[a-z0-9=&_.%-]*)?$/i.test(n) ? n : ''; }

  /* ---------- validacao ---------- */
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  var PW_RULE = 'Use pelo menos 8 caracteres, com letras e números.';
  function pwError(v) {
    if (!v) return 'Crie uma senha para continuar.';
    if (v.length < 8 || !/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return 'A senha ainda não atende à regra: pelo menos 8 caracteres, com letras e números.';
    return '';
  }
  function parseDate(v) {
    var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v || ''); if (!m) return null;
    var d = +m[1], mo = +m[2], y = +m[3], dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d || y < 1900 || dt > new Date(2026, 9, 16)) return null;
    return dt;
  }
  function age(dt) { var t = new Date(2026, 9, 16), a = t.getFullYear() - dt.getFullYear(); if (t < new Date(t.getFullYear(), dt.getMonth(), dt.getDate())) a--; return a; }
  function maskDate(input) {
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '').slice(0, 8), o = d;
      if (d.length > 4) o = d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4); else if (d.length > 2) o = d.slice(0, 2) + '/' + d.slice(2);
      input.value = o;
    });
  }
  function busy(btn, on, label) {
    if (on) { btn.dataset.label = btn.textContent; btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); btn.disabled = true; if (label) btn.textContent = label; }
    else { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); btn.disabled = false; if (btn.dataset.label) btn.textContent = btn.dataset.label; }
  }
  function val(f, name) { var e = f.elements[name]; return e ? e.value.trim() : ''; }
  function mailParam() { var e = q.email || ''; return e.indexOf('***') > -1 ? e : (e && A.maskEmail ? A.maskEmail(e) : ''); }

  /* ---------- textos vindos de dados ---------- */
  function fillData() {
    var L = A.legal || {};
    var map = {
      termsVersion: L.termsVersion, privacyVersion: L.privacyVersion,
      updatedAt: A.fmtDate ? A.fmtDate(L.updatedAt) : L.updatedAt, dpoEmail: L.dpoEmail
    };
    Array.prototype.forEach.call(document.querySelectorAll('[data-g1]'), function (el) {
      var k = el.getAttribute('data-g1');
      if (map[k] != null) el.textContent = map[k];
      if (k === 'dpoLink') { el.setAttribute('href', 'mailto:' + L.dpoEmail); el.textContent = L.dpoEmail; }
    });
  }

  function init() {
    var m = main();
    if (m && STATES.indexOf(q.state) !== -1) m.setAttribute('data-state', q.state);
    else if (m && !m.getAttribute('data-state')) m.setAttribute('data-state', 'default');
    document.documentElement.lang = 'pt-BR';
    fillData(); applyVariant(); renderStates(); bindTheme(); keepThemeOnLinks();
    if (window.AuraState) window.AuraState.on(function () { renderStates(); });
    if (window.AuraUI) window.AuraUI.initTabs(document);
    var toc = document.querySelector('.g1-toc');
    if (toc && window.matchMedia && !window.matchMedia('(min-width: 900px)').matches) toc.removeAttribute('open');
  }

  // limpa o erro do campo assim que a pessoa volta a digitar ou marcar
  function autoClear(form) {
    ['input', 'change'].forEach(function (ev) {
      form.addEventListener(ev, function (e) { if (e.target.getAttribute && e.target.getAttribute('aria-invalid') && window.AuraUI) window.AuraUI.clearError(e.target); });
    });
  }
  function firstErrorFocus(form) { return window.AuraUI.focusFirstError(form); }

  window.G1 = {
    autoClear: autoClear, firstErrorFocus: firstErrorFocus,
    q: q, v: function () { return current; }, setVariant: setVariant, go: go, safeNext: safeNext, withTheme: withTheme,
    emailOk: emailOk, pwError: pwError, PW_RULE: PW_RULE, parseDate: parseDate, age: age, maskDate: maskDate, busy: busy, val: val,
    mailParam: mailParam, esc: esc, ico: ico, home: function (role) { return (D.home || {})[role] || (D.home || {}).aluno; },
    init: init
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
