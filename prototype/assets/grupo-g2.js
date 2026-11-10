/* grupo-g2.js - utilitarios do G2 (planos e assinatura): preco, cupom (CONTRACT 9), resumo do pedido, cartao de plano, boot.
   Depende de data.js, data-g2.js, icons.js e shell.js. Exporta window.G2 (G3 pode reutilizar G2.summaryHtml e G2.planCardHtml).
   Data da proxima cobranca: SEMPRE de AURA.renewalFor / AURA.subscription.nextChargeAt (fonte unica, data.js). */
(function () {
  'use strict';
  var A = window.AURA, D = window.AURA_G2 || {};
  var NB = String.fromCharCode(160);
  function parseQ() {
    var o = {};
    location.search.replace(/^\?/, '').split('&').forEach(function (p) {
      if (!p) return; var kv = p.split('=');
      try { o[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } catch (e) {}
    });
    return o;
  }
  var Q = parseQ();
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ico(n, c) { return '<svg class="icon' + (c ? ' ' + c : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; }
  function nb(s) { return String(s).split(' ').join(NB); }
  function money(v) { return nb(A.fmtBRL(v)); }
  function moneyS(v) { return Math.round(v) === v ? nb('R$ ' + v) : money(v); } // R$ 499 (sem centavos quando inteiro)
  function r2(v) { return Math.round(v * 100) / 100; }
  function dm(iso) { return A.fmtDate(iso).slice(0, 5); }
  function dmy(iso) { return A.fmtDate(iso); }
  function addMonths(iso, n) { return A.addMonths(iso, n); }
  function planById(id) { return A.byId(A.plans, id); }
  function catalog() { return A.plans.filter(function (p) { return p.status === 'ativo'; }).sort(function (a, b) { return a.order - b.order; }); }
  function price(plan, cycle) { return cycle === 'anual' ? plan.prices.yearly : plan.prices.monthly; }
  function perMonthYear(plan) { return r2(plan.prices.yearly / 12); }
  function savings(plan) { return r2(plan.prices.monthly * 12 - plan.prices.yearly); }
  function monthsEq(plan) { return Math.round(plan.prices.yearly / plan.prices.monthly * 10) / 10; }
  function joinE(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1]; }

  /* ---------- assinatura atual (fonte unica: AURA.subscription) ---------- */
  var LIVE = ['ativa', 'vencendo', 'inadimplente', 'cancelamento_agendado'];
  function liveSub() { var s = A.subscription; return s && LIVE.indexOf(s.status) !== -1 && s.planId !== 'starter' ? s : null; }
  // troca de plano = ja tem plano pago (e o plano pedido e outro)
  function isChange(planId) { var s = liveSub(); return !!s && s.planId !== planId; }

  /* ---------- rotas: caminho relativo a pasta da tela que chama ---------- */
  var role = null;
  function url(path, params) {
    var p = [], all = {}, k;
    var base = { role: Q.role || role, theme: Q.theme, sub: Q.sub };
    for (k in base) if (base[k]) all[k] = base[k];
    for (k in (params || {})) if (params[k] != null && params[k] !== '') all[k] = params[k];
    for (k in all) p.push(encodeURIComponent(k) + '=' + encodeURIComponent(all[k]));
    var hash = '', i = path.indexOf('#'); if (i > -1) { hash = path.slice(i); path = path.slice(0, i); }
    return path + (p.length ? '?' + p.join('&') : '') + hash;
  }
  var inCfg = /\/screens\/config\//.test(location.pathname.replace(/\\/g, '/'));
  var PL = inCfg ? '../planos/' : '', CF = inCfg ? '' : '../config/';
  var PATH = {
    planos: PL + 'planos.html', resumo: PL + 'resumo-pedido.html', stripe: PL + 'checkout-stripe.html', ok: PL + 'pagamento-confirmado.html', nao: PL + 'pagamento-nao-concluido.html',
    cancelar: PL + 'cancelar-assinatura.html', admPlanos: PL + 'admin-planos.html', admEditar: PL + 'admin-plano-editar.html',
    assinatura: CF + 'assinatura.html', config: CF + 'configuracoes.html', home: '../home/personal.html', homeAdmin: '../home/admin.html',
    termosCobranca: '../legal/termos.html#cobranca', login: '../auth/login.html'
  };

  /* ---------- cupom ---------- */
  function allCoupons() { return A.coupons.concat(D.extraCoupons || []); }
  function findCoupon(code) {
    code = String(code || '').trim().toUpperCase();
    return allCoupons().filter(function (c) { return c.code === code; })[0] || null;
  }
  function planNames(ids) { return joinE(ids.map(function (i) { var p = planById(i); return p ? p.name : i; })); }
  // ctx: { hadPrior }. Retorna { ok, reason, message, coupon, action? }
  function validateCoupon(code, planId, cycle, ctx) {
    ctx = ctx || {};
    code = String(code || '').trim().toUpperCase();
    var plan = planById(planId), base = plan ? price(plan, cycle) : 0, keep = ' Seu total continua ' + money(base) + '.';
    if (!code) return { ok: false, reason: 'vazio', message: 'Digite o código do cupom.' };
    var c = findCoupon(code);
    if (!c) return { ok: false, reason: 'invalido', message: 'Não encontramos o cupom ' + code + '. Confira o código e tente de novo.' + keep };
    if (c.status === 'expirado' || (c.validUntil && c.validUntil < A.today)) return { ok: false, reason: 'expirado', coupon: c, message: 'O cupom ' + c.code + ' expirou em ' + dmy(c.validUntil) + '.' + keep };
    if (c.status === 'esgotado' || c.uses >= c.maxUses) return { ok: false, reason: 'esgotado', coupon: c, message: 'O cupom ' + c.code + ' atingiu o limite de usos e não está mais disponível.' + keep };
    if (c.status === 'pausado') return { ok: false, reason: 'pausado', coupon: c, message: 'O cupom ' + c.code + ' está pausado no momento.' + keep };
    if (c.validFrom && c.validFrom > A.today) return { ok: false, reason: 'nao-comecou', coupon: c, message: 'O cupom ' + c.code + ' só vale a partir de ' + dmy(c.validFrom) + '.' + keep };
    if (c.planIds.indexOf(planId) === -1) return { ok: false, reason: 'outro-plano', coupon: c, message: 'O cupom ' + c.code + ' vale para o plano ' + planNames(c.planIds) + '. Você escolheu o ' + plan.name + '.' + keep, action: { planId: c.planIds[0], label: 'Ver com o ' + planById(c.planIds[0]).name } };
    if (c.firstSubscriptionOnly && ctx.hadPrior) return { ok: false, reason: 'so-primeira', coupon: c, message: 'O cupom ' + c.code + ' vale só na primeira assinatura. Sua conta já teve uma assinatura paga.' + keep };
    return { ok: true, coupon: c };
  }

  /* ---------- cotacao ---------- */
  // o.change: troca de plano (ja tem plano pago): paga so a diferenca proporcional ate a proxima cobranca e mantem a data.
  function quote(planId, cycle, coupon, o) {
    o = o || {};
    var plan = planById(planId), base = price(plan, cycle), per = cycle === 'anual' ? 'ano' : 'mês';
    var q = { plan: plan, cycle: cycle, per: per, base: base, coupon: coupon || null, discount: 0, today: base, nextAmount: base, descr: '', headline: '', after: '', every: cycle === 'anual' ? 'todo ano' : 'todo mês', change: false };
    if (o.change && liveSub()) {
      var s = liveSub(), cur = planById(s.planId), cyc = s.cycle;
      var curBase = price(cur, cyc), days = Math.max(0, A.daysBetween(A.today, s.nextChargeAt || A.today)), span = cyc === 'anual' ? 365 : 30;
      q.change = true; q.cycle = cyc; q.per = cyc === 'anual' ? 'ano' : 'mês'; q.every = cyc === 'anual' ? 'todo ano' : 'todo mês';
      q.base = price(plan, cyc); q.fromPlan = cur; q.today = Math.max(0, r2((q.base - curBase) * days / span)); q.nextAmount = q.base;
      q.renewAt = s.nextChargeAt;
      q.after = 'Depois: ' + money(q.base) + ' a cada ' + q.per + '. Renovação automática em ' + dmy(q.renewAt) + '. A data da cobrança não muda.';
      q.lineLabel = 'Diferença do ' + cur.name + ' para o ' + plan.name + ' até ' + dm(q.renewAt);
      return q;
    }
    q.renewAt = A.renewalFor(planId, cycle);
    if (!coupon) { q.after = 'Depois: ' + money(base) + ' a cada ' + per + '. Renovação automática em ' + dm(q.renewAt) + '.'; return q; }
    q.discount = coupon.type === 'percentual' ? r2(base * coupon.value / 100) : Math.min(coupon.value, base);
    q.today = r2(base - q.discount);
    var what = coupon.type === 'percentual' ? coupon.value + '% de desconto' : money(coupon.value) + ' de desconto';
    var multi = cycle === 'mensal' && coupon.duration === 'n_meses' && coupon.months > 1;
    if (multi) {
      var n = coupon.months - 1, dates = [], i;
      for (i = 1; i <= n; i++) dates.push(addMonths(A.today, i));
      var full = addMonths(A.today, coupon.months);
      q.nextAmount = q.today;
      q.descr = what + ' por mês, durante ' + coupon.months + ' meses';
      q.headline = money(q.today) + ' por mês durante ' + coupon.months + ' meses, depois ' + money(base) + ' por mês';
      q.after = n <= 2
        ? 'Depois: ' + money(q.today) + ' em ' + joinE(dates.map(dm)) + '; a partir de ' + dm(full) + ', ' + money(base) + ' a cada mês. Renovação automática.'
        : 'Depois: ' + money(q.today) + ' por mês até ' + dmy(dates[n - 1]) + '; a partir de ' + dmy(full) + ', ' + money(base) + ' a cada mês. Renovação automática.';
    } else if (cycle === 'anual') {
      q.descr = what + ' na primeira cobrança anual';
      q.headline = money(q.today) + ' no primeiro ano, depois ' + money(base) + ' por ano';
      q.after = 'Depois: ' + money(base) + ' a cada ano. Renovação automática em ' + dm(q.renewAt) + ' do ano que vem.';
    } else {
      q.descr = what + ' na primeira cobrança';
      q.headline = money(q.today) + ' na primeira cobrança, depois ' + money(base) + ' por mês';
      q.after = 'Depois: ' + money(base) + ' a cada mês. Renovação automática em ' + dm(q.renewAt) + '.';
    }
    return q;
  }

  /* ---------- resumo do pedido (PLN-02, PLN-03 e previa do ADM-09) ---------- */
  function summaryHtml(q) {
    var first = q.change ? '<div class="g2-line"><dt>' + esc(q.lineLabel) + '<small>Valor proporcional aos dias que faltam. O plano novo vale a partir de hoje.</small></dt><dd>' + money(q.today) + '</dd></div>'
      : '<div class="g2-line"><dt>Plano ' + esc(q.plan.name) + ', cobrança ' + (q.cycle === 'anual' ? 'anual' : 'mensal') + (q.cycle === 'anual' ? '<small>Uma cobrança só por ano. Equivale a ' + monthsEq(q.plan) + ' meses de ' + money(q.plan.prices.monthly) + '.</small>' : '') + '</dt><dd>' + (q.cycle === 'anual' ? moneyS(q.base) : money(q.base)) + '</dd></div>';
    var h = '<dl class="g2-lines">' + first;
    if (q.coupon) {
      h += '<div class="g2-line g2-line-discount"><dt>' + ico('tag', 'icon-sm') + ' Cupom ' + esc(q.coupon.code) + '<small>' + esc(q.descr) + '</small></dt><dd><span aria-hidden="true">−</span><span class="sr-only">menos </span>' + money(q.discount) + '</dd></div>';
    }
    h += '<div class="g2-line g2-total"><dt>Total hoje</dt><dd>' + money(q.today) + '</dd></div></dl>';
    h += '<div class="g2-after"><p class="body-medium">' + ico('refresh', 'icon-sm') + ' ' + esc(q.after) + '</p>' +
      '<p class="muted">Cobramos ' + q.every + ' no mesmo cartão, até você cancelar.</p></div>';
    return h;
  }

  /* ---------- cartao de plano (PLN-01 e previa do PLN-08) ---------- */
  // o: { current, note, support, cta:{label, href, disabled}, id }
  function planCardHtml(p, cycle, o) {
    o = o || {};
    var id = 'pl-' + (o.id || p.id), pending = p.prices.monthly == null, free = p.prices.monthly === 0;
    var main, per = '', sub = '';
    if (pending) main = 'A definir';
    else if (free) { main = 'Grátis'; per = 'sem prazo'; }
    else if (cycle === 'anual') {
      main = moneyS(p.prices.yearly); per = 'por ano, uma cobrança só';
      sub = 'Equivale a ' + monthsEq(p) + ' meses de ' + money(p.prices.monthly) + ' e <strong>economiza ' + money(savings(p)) + '</strong>.';
    } else { main = money(p.prices.monthly); per = 'por mês'; sub = 'Cobrança mensal. Sem fidelidade.'; }
    var feats = (p.features || []).map(function (f) {
      var no = /^Sem /.test(f);
      return '<li class="' + (no ? 'is-no' : '') + '">' + ico(no ? 'x' : 'check', 'icon-sm') + '<span>' + (no ? '<span class="sr-only">Não inclui: </span>' : '') + esc(f) + '</span></li>';
    }).join('');
    var cta = '';
    if (o.cta) {
      if (o.cta.disabled) cta = '<button type="button" class="btn btn-neutral btn-block" aria-disabled="true">' + ico('check-circle') + esc(o.cta.label) + '</button>';
      else cta = '<a class="btn ' + (o.cta.kind || (p.popular ? 'btn-primary' : 'btn-secondary')) + ' btn-block" href="' + esc(o.cta.href) + '" aria-describedby="' + id + '-p">' + esc(o.cta.label) + '</a>';
      if (o.note) cta += '<p class="g2-help muted mt-2">' + o.note + '</p>';
    }
    return '<article class="card g2-plan' + (p.popular ? ' g2-plan--popular' : '') + (o.current ? ' g2-plan--current' : '') + '" aria-labelledby="' + id + '-t">' +
      '<div class="g2-plan-head"><h3 id="' + id + '-t">' + esc(p.name || 'Novo plano') + '</h3>' +
      (p.popular ? '<span class="badge badge-primary">' + ico('star') + 'Mais popular</span>' : '') +
      (o.current ? '<span class="badge badge-success">' + ico('check-circle') + 'Plano atual</span>' : '') + '</div>' +
      '<p class="muted">' + esc(p.tagline || '') + '</p>' +
      '<div class="g2-price" id="' + id + '-p"><span class="g2-price-main">' + main + '</span> <span class="g2-price-per">' + per + '</span>' + (sub ? '<p class="g2-price-sub">' + sub + '</p>' : '') + '</div>' +
      '<ul class="g2-feat">' + feats + '</ul>' + (cta ? '<div class="g2-plan-cta">' + cta + '</div>' : '') + '</article>';
  }

  /* ---------- boot ---------- */
  var listeners = [];
  function variant() { return Q.variant || ''; }
  function setVariant(v) {
    Q.variant = v || '';
    try { var u = new URL(location.href); if (v) u.searchParams.set('variant', v); else u.searchParams.delete('variant'); history.replaceState(null, '', u.toString()); } catch (e) {}
    document.dispatchEvent(new CustomEvent('g2:variantchange'));
    listeners.forEach(function (fn) { fn(); });
  }
  function setParam(k, v) { Q[k] = v; try { var u = new URL(location.href); u.searchParams.set(k, v); history.replaceState(null, '', u.toString()); } catch (e) {} }
  function stateName() { return window.AuraState ? window.AuraState.get() : 'default'; }
  function guard(r, allowed) {
    if (allowed.indexOf(r) === -1) { location.replace(url('../sistema/acesso-negado.html', { role: r })); return false; }
    return true;
  }
  // opts: { id, name, role, allowed, active, shell (padrao true), render, subscriptionBanner }
  function boot(o) {
    var r = Q.role && /^(admin|personal|aluno)$/.test(Q.role) ? Q.role : o.role;
    role = r;
    var title = o.id + ' · ' + o.name + ' · aura-fit';
    if (o.allowed && !guard(r, o.allowed)) return;
    var run = function () { document.title = title; if (o.render) o.render(); };
    if (o.render) listeners.push(function () { o.render(); });
    document.addEventListener('aura:statechange', function () { if (o.render) o.render(); });
    if (o.shell === false) {
      var m = document.getElementById('conteudo');
      var st = Q.state && /^(empty|loading|error|success)$/.test(Q.state) ? Q.state : 'default';
      m.setAttribute('data-state', st);
      document.documentElement.lang = 'pt-BR';
      run();
      return;
    }
    document.addEventListener('aura:shellready', run);
    window.AuraShell.mount({ role: r, active: o.active, title: o.name, subscriptionBanner: o.subscriptionBanner });
    document.title = title;
  }
  function renderArea(target, opts) { return window.AuraState.render(target, opts); }

  window.G2 = {
    Q: Q, esc: esc, ico: ico, money: money, moneyS: moneyS, dm: dm, dmy: dmy, addMonths: addMonths, planById: planById, catalog: catalog, price: price,
    perMonthYear: perMonthYear, savings: savings, monthsEq: monthsEq, url: url, PATH: PATH, findCoupon: findCoupon, validateCoupon: validateCoupon,
    quote: quote, summaryHtml: summaryHtml, planCardHtml: planCardHtml, variant: variant, setVariant: setVariant, setParam: setParam, state: stateName,
    boot: boot, render: renderArea, joinE: joinE, liveSub: liveSub, isChange: isChange, role: function () { return role; }
  };
})();
