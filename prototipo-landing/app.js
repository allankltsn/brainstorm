/* aura-fit landing (prototipo). JS puro, sem dependencias.
   Modulos: tema, menu, tamanho do topo, revelacoes, periodo/precos, disclosures/FAQ, efeitos de mouse e
   efeitos de rolagem (progresso, parallax, texto revelado, secao pinned, contadores), todos no mesmo laco
   requestAnimationFrame compartilhado. Sem JS ou com movimento reduzido o conteudo completo continua legivel. */
(function () {
  'use strict';

  var root = document.documentElement;
  var mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  var mqDark = matchMedia('(prefers-color-scheme: dark)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ---------- Formatacao pt-BR ---------- */
  var nfInt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  var nfBRL0 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  var nfBRL2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var nfH1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  function fmtInt(v) { return nfInt.format(v); }
  function fmtBRL(v) { return nfBRL0.format(v).replace(/\u00a0/g, ' '); }
  function fmtBRL2(v) { return nfBRL2.format(v).replace(/\u00a0/g, ' '); }
  function fmtH(v) { return nfH1.format(v).replace(/\u00a0/g, ' '); }

  /* ---------- Tema (claro/escuro) ---------- */
  var themeBtn = $('#theme-btn');
  function isDark() {
    if (root.classList.contains('dark')) return true;
    if (root.classList.contains('light')) return false;
    return mqDark.matches;
  }
  function syncThemeBtn() { if (themeBtn) themeBtn.setAttribute('aria-pressed', String(isDark())); }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.classList.remove('light', 'dark');
      root.classList.add(next);
      try { localStorage.setItem('aura-landing-theme', next); } catch (e) { /* preferencia nao e essencial */ }
      themeBtn.setAttribute('data-spin', themeBtn.getAttribute('data-spin') === '1' ? '0' : '1');
      syncThemeBtn();
    });
    mqDark.addEventListener('change', syncThemeBtn);
    syncThemeBtn();
  }

  /* ---------- Movimento permitido (acompanha a preferencia em tempo real) ---------- */
  function syncMotionClass() { root.classList.toggle('js-motion', !mqReduce.matches); }
  mqReduce.addEventListener('change', syncMotionClass);
  syncMotionClass();

  /* ---------- Altura do topo (faixa + menu) para scroll-padding e cabecalho sticky ---------- */
  var top = $('#top');
  function setTopH() { root.style.setProperty('--top-h', top.offsetHeight + 'px'); }
  if (top) {
    setTopH();
    if (window.ResizeObserver) new ResizeObserver(setTopH).observe(top); else addEventListener('resize', setTopH);
  }

  /* ---------- Menu mobile ---------- */
  var menuBtn = $('#menu-btn'), panel = $('#nav-panel');
  function setMenu(open, refocus) {
    panel.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (!open && refocus) menuBtn.focus();
  }
  if (menuBtn && panel) {
    menuBtn.addEventListener('click', function () { setMenu(!panel.classList.contains('is-open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false, true); }
    });
    document.addEventListener('click', function (e) {
      if (panel.classList.contains('is-open') && !e.target.closest('.nav')) setMenu(false);
    });
  }

  /* ---------- Revelacoes: IntersectionObserver, uma vez ---------- */
  var rvEls = $$('.rv, .split');
  function cleanupRv(el) {
    var done = false, tm = 0;
    function finish() {
      if (done) return;
      done = true;
      clearTimeout(tm);
      el.removeEventListener('transitionend', h);
      el.classList.remove('rv');
      el.style.removeProperty('--d');
      dirty = true; /* botoes magneticos releem a posicao depois do reveal (REV-LP-03) */
    }
    function h(e) { if (e.target === el && e.propertyName === 'translate') finish(); }
    el.addEventListener('transitionend', h);
    /* Rede de seguranca (REV-LP-10): transitionend pode nao disparar (reduced alternado, aba oculta). */
    tm = setTimeout(finish, (parseInt(el.style.getPropertyValue('--d'), 10) || 0) + 900);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        if (en.target.classList.contains('rv')) cleanupRv(en.target);
        else { var sp = en.target; setTimeout(function () { sp.classList.add('is-done'); }, 1900); }
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Periodo e precos ---------- */
  var plansSec = $('#planos'), seg = $('#seg'), live = $('#price-live');
  var names = { m: 'Mensal', t: 'Trimestral', a: 'Anual' };
  var unit = { m: 'por mês', t: 'por trimestre', a: 'por ano' };
  if (plansSec && seg) {
    var opts = $$('[role="radio"]', seg);
    var pill = $('.seg-pill', seg);
    var current = 'm';
    var setPeriod = function (p, focus, silent) {
      if (p === current && !silent) return;
      var prev = current;
      current = p;
      if (!mqReduce.matches && prev !== p) {
        $$('.pv-' + prev, plansSec).forEach(function (el) {
          el.classList.add('out');
          setTimeout(function () { el.classList.remove('out'); }, 360);
        });
      }
      plansSec.setAttribute('data-period', p);
      opts.forEach(function (o, i) {
        var on = o.getAttribute('data-p') === p;
        o.setAttribute('aria-checked', String(on));
        o.tabIndex = on ? 0 : -1;
        if (on) { pill.style.setProperty('--i', i); if (focus) o.focus(); }
      });
      var parts = $$('.price[data-plan]', plansSec).map(function (pr) {
        var amt = $('.pv-' + p + ' .amt', pr).textContent;
        return pr.getAttribute('data-plan') + ': ' + amt + ' ' + unit[p];
      });
      if (!silent) live.textContent = names[p] + ': ' + parts.join('; ') + ' [MOCK]';
    };
    opts.forEach(function (o) { o.addEventListener('click', function () { setPeriod(o.getAttribute('data-p')); }); });
    seg.addEventListener('keydown', function (e) {
      var idx = opts.findIndex(function (o) { return o.getAttribute('aria-checked') === 'true'; });
      var n = idx;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (idx + 1) % opts.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (idx - 1 + opts.length) % opts.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = opts.length - 1;
      else return;
      e.preventDefault();
      setPeriod(opts[n].getAttribute('data-p'), true);
    });
    setPeriod('m', false, true);
  }

  /* ---------- Disclosures: FAQ e pros/contras (aria-expanded + grid-template-rows) ---------- */
  var discs = $$('[data-disc]');
  discs.forEach(function (d) {
    var btn = $('button[aria-controls]', d);
    if (!btn) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (open) d.setAttribute('data-open', 'true'); else d.removeAttribute('data-open');
    });
  });
  var faqBtns = $$('.faq-btn');
  faqBtns.forEach(function (b, i) {
    b.addEventListener('keydown', function (e) {
      var n = -1;
      if (e.key === 'ArrowDown') n = (i + 1) % faqBtns.length;
      else if (e.key === 'ArrowUp') n = (i - 1 + faqBtns.length) % faqBtns.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = faqBtns.length - 1;
      if (n < 0) return;
      e.preventDefault();
      faqBtns[n].focus();
    });
  });

  /* ---------- Efeitos de mouse: um unico modulo, um unico laco rAF ---------- */
  var MAX_TILT = 6, MAG_RADIUS = 80, MAG_MAX = 8, MAG_PULL = 0.25;
  var PX_ILL = 10, PX_A = 16, PX_B = 24;
  var listeners = [], items = [], mags = [], hero = null;
  var ptr = { x: 0, y: 0, has: false };
  var raf = 0, dirty = true, active = false, vw = innerWidth;

  function on(t, type, fn, opt) { t.addEventListener(type, fn, opt); listeners.push([t, type, fn, opt]); }

  /* Posicao-base do botao magnetico = rect menos o deslocamento que o proprio efeito aplica (REV-LP-03). */
  function measureMag(m) {
    var r = m.el.getBoundingClientRect();
    m.bl = r.left - m.x; m.bt = r.top - m.y; m.w = r.width; m.h = r.height;
  }

  function readRects() {
    items.forEach(function (it) { if (it.over) it.rect = it.el.getBoundingClientRect(); });
    mags.forEach(measureMag);
    if (hero) hero.rect = hero.el.getBoundingClientRect();
    vw = innerWidth;
    dirty = false;
  }

  function onMove(e) {
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.has = true;
    if (dirty) readRects();
    start();
  }

  function start() { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); }

  function writeTilt(it) {
    it.el.style.transform = 'perspective(900px) rotateX(' + clamp(it.rx, -MAX_TILT, MAX_TILT).toFixed(3) + 'deg) rotateY(' + clamp(it.ry, -MAX_TILT, MAX_TILT).toFixed(3) + 'deg) translateZ(0)';
    it.wx = it.rx; it.wy = it.ry; it.dirtyT = true;
  }
  function writeMag(m) {
    m.el.style.willChange = 'transform';
    m.el.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,' + m.y.toFixed(2) + 'px,0)';
    m.lab.style.transform = 'translate3d(' + (m.x * 0.5).toFixed(2) + 'px,' + (m.y * 0.5).toFixed(2) + 'px,0)';
    m.wx = m.x; m.wy = m.y; m.dirtyT = true;
  }
  function writeHero() {
    hero.layers.forEach(function (l) {
      l[0].style.willChange = 'transform';
      l[0].style.transform = 'translate3d(' + (hero.x * l[1]).toFixed(2) + 'px,' + (hero.y * l[1]).toFixed(2) + 'px,0)';
    });
    hero.wx = hero.x; hero.wy = hero.y; hero.dirtyT = true;
  }

  /* Regra comum (REV-LP-02): so escreve estilo quando o valor muda e so pede novo quadro enquanto ainda ha convergencia. */
  function tick(now) {
    raf = 0;
    var busy = false, i, it, m, nx, ny, tx, ty, gx, gy;

    if (sOn) scrollFrame();
    if (counters.length && counterFrame(now || performance.now())) busy = true;
    if (roiRun && roiFrame(now || performance.now())) busy = true;

    for (i = 0; i < items.length; i++) {
      it = items[i];
      tx = 0; ty = 0;
      if (it.over) {
        nx = clamp((ptr.x - it.rect.left) / it.rect.width * 2 - 1, -1, 1);
        ny = clamp((ptr.y - it.rect.top) / it.rect.height * 2 - 1, -1, 1);
        if (it.spot && (ptr.x !== it.sx || ptr.y !== it.sy)) {
          it.el.style.setProperty('--mx', (ptr.x - it.rect.left).toFixed(1) + 'px');
          it.el.style.setProperty('--my', (ptr.y - it.rect.top).toFixed(1) + 'px');
          it.sx = ptr.x; it.sy = ptr.y;
        }
        if (it.tilt && !it.el.matches(':focus-within')) { tx = nx; ty = ny; }
      }
      if (it.tilt) {
        gy = tx * MAX_TILT; gx = -ty * MAX_TILT;
        if (Math.abs(gy - it.ry) < 0.02 && Math.abs(gx - it.rx) < 0.02) {
          it.ry = gy; it.rx = gx;
          if (gx === 0 && gy === 0) {
            if (it.dirtyT) { it.el.style.transform = ''; it.wx = it.wy = 0; it.dirtyT = false; }
            if (!it.over) it.el.style.willChange = '';
          } else if (it.wx !== gx || it.wy !== gy) {
            writeTilt(it);
          }
        } else {
          it.ry += (gy - it.ry) * 0.15;
          it.rx += (gx - it.rx) * 0.15;
          writeTilt(it);
          busy = true;
        }
      }
    }

    for (i = 0; i < mags.length; i++) {
      m = mags[i];
      tx = 0; ty = 0;
      if (ptr.has && !m.el.matches(':focus-visible')) {
        var dx = Math.max(m.bl - ptr.x, 0, ptr.x - (m.bl + m.w));
        var dy = Math.max(m.bt - ptr.y, 0, ptr.y - (m.bt + m.h));
        if (Math.hypot(dx, dy) <= MAG_RADIUS) {
          tx = clamp((ptr.x - (m.bl + m.w / 2)) * MAG_PULL, -MAG_MAX, MAG_MAX);
          ty = clamp((ptr.y - (m.bt + m.h / 2)) * MAG_PULL, -MAG_MAX, MAG_MAX);
        }
      }
      if (Math.abs(tx - m.x) < 0.05 && Math.abs(ty - m.y) < 0.05) {
        m.x = tx; m.y = ty;
        if (tx === 0 && ty === 0) {
          if (m.dirtyT) { m.el.style.transform = ''; m.lab.style.transform = ''; m.el.style.willChange = ''; m.wx = m.wy = 0; m.dirtyT = false; }
        } else if (m.wx !== tx || m.wy !== ty) {
          writeMag(m);
        }
      } else {
        m.x += (tx - m.x) * 0.18; m.y += (ty - m.y) * 0.18;
        writeMag(m);
        busy = true;
      }
    }

    if (hero) {
      var amp = hero.rect && vw >= 960 ? 1 : 0;
      tx = 0; ty = 0;
      if (hero.over && amp) {
        tx = clamp((ptr.x - hero.rect.left) / hero.rect.width * 2 - 1, -1, 1);
        ty = clamp((ptr.y - hero.rect.top) / hero.rect.height * 2 - 1, -1, 1);
      }
      if (Math.abs(tx - hero.x) < 0.002 && Math.abs(ty - hero.y) < 0.002) {
        hero.x = tx; hero.y = ty;
        if (tx === 0 && ty === 0) {
          if (hero.dirtyT) { hero.layers.forEach(function (l) { l[0].style.transform = ''; l[0].style.willChange = ''; }); hero.wx = hero.wy = 0; hero.dirtyT = false; }
        } else if (hero.wx !== tx || hero.wy !== ty) {
          writeHero();
        }
      } else {
        hero.x += (tx - hero.x) * 0.08; hero.y += (ty - hero.y) * 0.08;
        writeHero();
        busy = true;
      }
    }

    if (busy) start();
  }

  function enter(it) {
    return function () {
      it.over = true;
      it.sx = it.sy = null;
      it.rect = it.el.getBoundingClientRect();
      if (it.spot) it.el.classList.add('spot-on');
      if (it.tilt) it.el.style.willChange = 'transform';
      start();
    };
  }
  function leave(it) {
    return function () {
      it.over = false;
      if (it.spot) it.el.classList.remove('spot-on');
      start();
    };
  }

  function enable() {
    if (active) return;
    active = true;
    $$('.fx-spot, .fx-tilt').forEach(function (el) {
      var it = { el: el, spot: el.classList.contains('fx-spot'), tilt: el.classList.contains('fx-tilt'), over: false, rect: null, rx: 0, ry: 0, wx: 0, wy: 0, sx: null, sy: null, dirtyT: false };
      items.push(it);
      on(el, 'pointerenter', enter(it), { passive: true });
      on(el, 'pointerleave', leave(it), { passive: true });
    });
    $$('.fx-mag').forEach(function (el) {
      var mg = { el: el, lab: $('.lab', el) || el, bl: 0, bt: 0, w: 0, h: 0, x: 0, y: 0, wx: 0, wy: 0, dirtyT: false };
      measureMag(mg);
      mags.push(mg);
    });
    var h = $('[data-hero]');
    if (h) {
      hero = { el: h, over: false, rect: h.getBoundingClientRect(), x: 0, y: 0, wx: 0, wy: 0, dirtyT: false, layers: [] };
      var a = $('.px-a', h), b = $('.px-b', h), ill = $('.px-ill', h);
      if (ill) hero.layers.push([ill, PX_ILL]);
      if (a) hero.layers.push([a, PX_A]);
      if (b) hero.layers.push([b, PX_B]);
      on(h, 'pointerenter', function () { hero.over = true; hero.rect = h.getBoundingClientRect(); start(); }, { passive: true });
      on(h, 'pointerleave', function () { hero.over = false; start(); }, { passive: true });
    }
    on(document, 'pointermove', onMove, { passive: true });
    on(document.documentElement, 'pointerleave', function () { ptr.has = false; start(); }, { passive: true });
    on(window, 'scroll', function () { dirty = true; }, { passive: true });
    on(window, 'resize', function () { dirty = true; }, { passive: true });
    dirty = true;
  }

  function disable() {
    if (!active) return;
    active = false;
    listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
    listeners = [];
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    items.forEach(function (it) { it.el.style.transform = ''; it.el.style.willChange = ''; it.el.classList.remove('spot-on'); });
    mags.forEach(function (m) { m.el.style.transform = ''; m.el.style.willChange = ''; m.lab.style.transform = ''; });
    if (hero) hero.layers.forEach(function (l) { l[0].style.transform = ''; l[0].style.willChange = ''; });
    items = []; mags = []; hero = null; ptr.has = false;
  }

  function syncFx() {
    if (mqFine.matches && !mqReduce.matches) enable(); else disable();
  }
  mqFine.addEventListener('change', syncFx);
  mqReduce.addEventListener('change', syncFx);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
  });
  syncFx();

  /* ---------- Rolagem: progresso, parallax, texto revelado, secao pinned e contadores ----------
     Leituras de layout so em medidas (carga, resize, mudanca de altura); por quadro le-se apenas scrollY e escreve-se transform.
     Tudo desligado com prefers-reduced-motion (conteudo estatico e completo). */
  var sOn = false, sMeasure = true, sro = null;
  var vh = innerHeight, docH = 0, topH = 0, progLast = -1;
  var progEl = $('.prog span');
  var pars = [], scrubs = [], pins = [], counters = [];
  var cio = null;
  var mqPin = matchMedia('(min-width: 960px) and (min-height: 560px)');

  function absTop(el) { return el.getBoundingClientRect().top + window.pageYOffset; }

  function buildScroll() {
    pars = $$('[data-par]').map(function (el) {
      var box = el.closest('[data-par-box]');
      if (!box) return null;
      return { el: el, box: box, speed: parseFloat(el.getAttribute('data-par')) || 0, minw: parseInt(el.getAttribute('data-par-min'), 10) || 0, top: 0, h: 0, last: null };
    }).filter(Boolean);
    scrubs = $$('[data-scrub]').map(function (el) {
      var head = $('h2', el) || el;
      return { el: el, head: head, words: $$('.sw', el), top: 0, n: -1 };
    });
    pins = $$('[data-pin]').map(function (el) {
      var box = $('[data-pin-box]', el), track = $('.pin-track', el);
      var slides = $$('.slide', el);
      return { el: el, box: box, track: track, slides: slides, bar: $('.pin-bar span', el), n: slides.length, top: 0, h: 0, last: null, act: -1, barLast: -1 };
    }).filter(function (p) { return p.box && p.track && p.n > 1; });
  }

  function measureScroll() {
    vh = innerHeight;
    docH = root.scrollHeight;
    topH = top ? top.offsetHeight : 0;
    pars.forEach(function (p) { var r = p.box.getBoundingClientRect(); p.top = r.top + window.pageYOffset; p.h = r.height; });
    scrubs.forEach(function (s) { s.top = absTop(s.head); });
    pins.forEach(function (p) { var r = p.box.getBoundingClientRect(); p.top = r.top + window.pageYOffset; p.h = r.height; });
  }

  function scrollFrame() {
    if (sMeasure) { measureScroll(); sMeasure = false; }
    var y = window.pageYOffset, i, v, k;

    if (progEl) {
      var mx = docH - vh;
      v = mx > 0 ? Math.round(clamp(y / mx, 0, 1) * 1000) / 1000 : 0;
      if (v !== progLast) { progEl.style.transform = 'scaleX(' + v + ')'; progLast = v; }
    }

    for (i = 0; i < pars.length; i++) {
      var p = pars[i];
      if (p.minw && innerWidth < p.minw) {
        if (p.last !== 0) { p.el.style.transform = ''; p.last = 0; }
        continue;
      }
      k = clamp((y + vh / 2 - (p.top + p.h / 2)) / (vh / 2 + p.h / 2), -1, 1);
      v = Math.round(k * p.speed * 10) / 10;
      if (v !== p.last) { p.el.style.transform = 'translate3d(0,' + v + 'px,0)'; p.last = v; }
    }

    for (i = 0; i < scrubs.length; i++) {
      var s = scrubs[i];
      k = clamp((vh * 0.9 - (s.top - y)) / (vh * 0.5), 0, 1);
      var n = Math.round(k * s.words.length);
      if (n !== s.n) {
        for (var w = 0; w < s.words.length; w++) s.words[w].classList.toggle('on', w < n);
        s.n = n;
      }
    }

    var pinned = mqPin.matches;
    for (i = 0; i < pins.length; i++) {
      var pn = pins[i];
      if (!pinned) {
        if (pn.last !== 0) { pn.track.style.transform = ''; pn.last = 0; pn.act = -1; }
        continue;
      }
      var range = pn.h - (vh - topH);
      k = range > 0 ? clamp((y - (pn.top - topH)) / range, 0, 1) : 0;
      /* Cada tela "segura" um trecho da rolagem e so entao desliza para a proxima (suavizado) */
      var xp = k * (pn.n - 1), ip = Math.min(Math.floor(xp), pn.n - 2), tp = clamp(((xp - ip) - 0.2) / 0.6, 0, 1);
      var pos = ip + tp * tp * (3 - 2 * tp);
      var sh = Math.round(pos * 100 / pn.n * 100) / 100;
      if (sh !== pn.last) { pn.track.style.transform = 'translate3d(' + (-sh) + '%,0,0)'; pn.last = sh; }
      var act = Math.round(pos);
      if (act !== pn.act) {
        pn.slides.forEach(function (sl, j) { sl.classList.toggle('is-active', j === act); });
        pn.act = act;
      }
      if (pn.bar) {
        var bv = Math.round(k * 1000) / 1000;
        if (bv !== pn.barLast) { pn.bar.style.transform = 'scaleX(' + bv + ')'; pn.barLast = bv; }
      }
    }
  }

  /* Contadores: 0 -> valor final quando entram na tela (texto final ja esta no HTML; sem JS/reduced fica estatico) */
  function counterFrame(now) {
    var running = false;
    counters.forEach(function (c) {
      if (!c.started || c.done) return;
      var t = clamp((now - c.t0) / 1400, 0, 1);
      c.el.textContent = fmtInt(Math.round(c.end * (1 - Math.pow(1 - t, 3))));
      if (t >= 1) c.done = true; else running = true;
    });
    return running;
  }
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        counters.forEach(function (c) { if (c.el === en.target && !c.started) { c.started = true; c.t0 = performance.now(); } });
        cio.unobserve(en.target);
        start();
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(end)) return;
      el.style.minWidth = fmtInt(end).length + 'ch'; /* largura fixa: sem salto de layout durante a contagem */
      el.textContent = '0';
      counters.push({ el: el, end: end, t0: 0, started: false, done: false });
      cio.observe(el);
    });
  }
  function finishCounters() {
    if (cio) { cio.disconnect(); cio = null; }
    counters.forEach(function (c) { c.el.textContent = fmtInt(c.end); c.done = true; });
  }

  function onScrollFx() { start(); }
  function onResizeFx() { sMeasure = true; start(); }
  function enableScroll() {
    if (sOn) return;
    sOn = true;
    buildScroll();
    sMeasure = true;
    addEventListener('scroll', onScrollFx, { passive: true });
    addEventListener('resize', onResizeFx, { passive: true });
    addEventListener('load', onResizeFx);
    mqPin.addEventListener('change', onResizeFx);
    if (window.ResizeObserver) { sro = new ResizeObserver(onResizeFx); sro.observe(document.body); }
    if (!counters.length) initCounters();
    scrollFrame();
  }
  function disableScroll() {
    if (!sOn) return;
    sOn = false;
    removeEventListener('scroll', onScrollFx);
    removeEventListener('resize', onResizeFx);
    removeEventListener('load', onResizeFx);
    mqPin.removeEventListener('change', onResizeFx);
    if (sro) { sro.disconnect(); sro = null; }
    pars.forEach(function (p) { p.el.style.transform = ''; });
    pins.forEach(function (p) { p.track.style.transform = ''; if (p.bar) p.bar.style.transform = ''; });
    scrubs.forEach(function (s) { s.words.forEach(function (w) { w.classList.remove('on'); }); });
    if (progEl) progEl.style.transform = '';
    progLast = -1;
    finishCounters();
  }
  function syncScroll() { if (mqReduce.matches) disableScroll(); else enableScroll(); }
  mqReduce.addEventListener('change', syncScroll);
  syncScroll();

  /* ---------- Calculadora de ROI ----------
     Premissas ilustrativas [MOCK], so aqui no codigo. Resultado em aria-live (resumo unico, com atraso), numeros animados
     no mesmo laco rAF (so texto; sem movimento = valor direto). Vazio ou invalido vira o padrao; fora do limite e travado. */
  var SEMANAS_MES = 4.33;
  var MODOS = {
    cons: { nome: 'conservador', red: 0.20, rec: 0.25 },
    pad: { nome: 'padrão', red: 0.35, rec: 0.40 }
  };
  function planoPara(alunos) {
    if (alunos <= 5) return { nome: 'Starter', preco: 0 };
    if (alunos <= 30) return { nome: 'Pro', preco: 49.90 };
    return { nome: 'Premium', preco: 99.90 };
  }
  function calcular(alunos, ticket, horas, inad, valorHora, modo) {
    var m = MODOS[modo] || MODOS.cons;
    var receita = alunos * ticket;
    var perdaInad = receita * (inad / 100);
    var recuperado = perdaInad * m.rec;
    var horasMes = horas * SEMANAS_MES;
    var horasEcon = horasMes * m.red;
    var valorTempo = horasEcon * valorHora;
    var plano = planoPara(alunos);
    var ganhoBruto = recuperado + valorTempo;
    var ganhoLiquido = ganhoBruto - plano.preco;
    var roi = plano.preco > 0 ? ganhoLiquido / plano.preco : null;
    var paybackDias = plano.preco > 0 && ganhoBruto > 0 ? (plano.preco / ganhoBruto) * 30 : 0;
    return {
      receita: receita, perdaInad: perdaInad, recuperado: recuperado, horasMes: horasMes, horasEcon: horasEcon,
      valorTempo: valorTempo, plano: plano, ganhoBruto: ganhoBruto, ganhoLiquido: ganhoLiquido, roi: roi, paybackDias: paybackDias,
      custoPlanilha: horasMes * valorHora + perdaInad,
      custoAura: (horasMes - horasEcon) * valorHora + (perdaInad - recuperado) + plano.preco,
      modo: m
    };
  }

  var roiRun = false, roiOuts = {}, roiInit = false, roiTimer = 0;
  var roiBox = $('#roi-result');
  function roiEl(k) { return $('[data-o="' + k + '"]'); }
  function setOut(k, val, fmt, animate) {
    var o = roiOuts[k];
    if (!o) return;
    if (animate && !mqReduce.matches && isFinite(o.cur) && o.cur !== val) {
      o.from = o.cur; o.to = val; o.t0 = performance.now(); o.run = true; roiRun = true; start();
    } else {
      o.run = false; o.cur = val; o.to = val; o.el.textContent = fmt(val);
    }
    o.fmt = fmt;
  }
  function roiFrame(now) {
    var running = false;
    Object.keys(roiOuts).forEach(function (k) {
      var o = roiOuts[k];
      if (!o.run) return;
      var t = clamp((now - o.t0) / 450, 0, 1);
      o.cur = o.from + (o.to - o.from) * (1 - Math.pow(1 - t, 3));
      o.el.textContent = o.fmt(t >= 1 ? o.to : o.cur);
      if (t >= 1) { o.cur = o.to; o.run = false; } else running = true;
    });
    roiRun = running;
    return running;
  }

  var ROI_FIELDS = [
    { id: 'r-alunos', min: 1, max: 200, def: 20, s: 'r-alunos-s' },
    { id: 'r-ticket', min: 50, max: 2000, def: 250 },
    { id: 'r-horas', min: 1, max: 40, def: 10, s: 'r-horas-s' },
    { id: 'r-inad', min: 0, max: 40, def: 12, s: 'r-inad-s' },
    { id: 'r-vh', min: 10, max: 500, def: 60 }
  ];
  function roiRead(f) {
    var raw = String(f.num.value).replace(',', '.').trim();
    var v = raw === '' ? NaN : parseFloat(raw);
    if (!isFinite(v)) v = f.def;
    return clamp(Math.round(v), f.min, f.max);
  }
  function roiMode() {
    var r = $('input[name="r-modo"]:checked');
    return r ? r.value : 'cons';
  }
  function pbText(d) {
    if (d <= 0) return '';
    var n = Math.ceil(d);
    return n <= 1 ? 'no primeiro dia' : 'menos de ' + n + ' dias';
  }
  function setText(k, txt) { var e = roiEl(k); if (e) e.textContent = txt; }

  function roiRender(animate) {
    var v = ROI_FIELDS.map(roiRead);
    var modo = roiMode();
    var r = calcular(v[0], v[1], v[2], v[3], v[4], modo);
    setOut('he', r.horasEcon, function (x) { return fmtH(x) + ' h'; }, animate);
    setOut('vt', r.valorTempo, fmtBRL, animate);
    setOut('rec', r.recuperado, fmtBRL, animate);
    setOut('gl', r.ganhoLiquido, fmtBRL, animate);
    var free = r.plano.preco === 0;
    if (!free) setOut('roi', r.roi, function (x) { return nfH1.format(x); }, animate);
    setText('modo', r.modo.nome);
    setText('pn', r.plano.nome); setText('pn2', r.plano.nome);
    setText('pp', free ? 'grátis' : fmtBRL2(r.plano.preco));
    var rb = roiEl('roi-box'), fr = roiEl('free');
    if (rb) rb.hidden = free;
    if (fr) fr.hidden = !free;
    setText('pb', pbText(r.paybackDias));
    setText('frase', 'Com ' + v[0] + ' alunos, você pode estar perdendo cerca de ' + fmtBRL(r.perdaInad) + ' por mês com inadimplência e gasta cerca de ' + fmtH(r.horasMes) + ' h por mês em tarefas manuais [MOCK].');
    setText('prem', 'cenário ' + r.modo.nome + ': redução de ' + Math.round(r.modo.red * 100) + '% do tempo manual e recuperação de ' + Math.round(r.modo.rec * 100) + '% da inadimplência');

    /* Tabela planilha x aura-fit */
    var cells = {
      pp: free ? 'R$ 0' : fmtBRL2(r.plano.preco),
      st: fmtBRL(r.horasMes * v[4]) + ' (' + fmtH(r.horasMes) + ' h)',
      at: fmtBRL((r.horasMes - r.horasEcon) * v[4]) + ' (' + fmtH(r.horasMes - r.horasEcon) + ' h)',
      si: fmtBRL(r.perdaInad), ai: fmtBRL(r.perdaInad - r.recuperado),
      sT: fmtBRL(r.custoPlanilha), aT: fmtBRL(r.custoAura),
      diff: r.custoPlanilha - r.custoAura > 0 ? 'cerca de ' + fmtBRL(r.custoPlanilha - r.custoAura) + ' a menos' : 'sem diferença estimada'
    };
    Object.keys(cells).forEach(function (k) { var e = $('[data-c="' + k + '"]'); if (e) e.textContent = cells[k]; });

    /* Cartoes de cenario (mesmas premissas do modo escolhido) */
    $$('.sc').forEach(function (card) {
      var b = $('.sc-btn', card);
      if (!b) return;
      var a = b.getAttribute('data-sc').split(',').map(Number);
      var c = calcular(a[0], a[1], a[2], a[3], a[4], modo);
      var he = $('[data-sc="he"]', card), gl = $('[data-sc="gl"]', card);
      if (he) he.textContent = fmtH(c.horasEcon) + ' h';
      if (gl) gl.textContent = fmtBRL(c.ganhoLiquido);
    });

    /* Resumo unico para leitor de tela (aria-live), so apos a pessoa mexer */
    if (roiInit) {
      clearTimeout(roiTimer);
      roiTimer = setTimeout(function () {
        var lv = $('#roi-live');
        if (!lv) return;
        lv.textContent = 'Com ' + v[0] + ' alunos, no cenário ' + r.modo.nome + ': tempo liberado de cerca de ' + fmtH(r.horasEcon) + ' horas por mês, equivalente a ' + fmtBRL(r.valorTempo) + ' em custo de oportunidade; inadimplência recuperada de cerca de ' + fmtBRL(r.recuperado) + ' por mês; plano indicado ' + r.plano.nome + (free ? ', gratuito' : ', ' + fmtBRL2(r.plano.preco)) + '; ganho líquido estimado de ' + fmtBRL(r.ganhoLiquido) + ' por mês' + (free ? '' : ', retorno de cerca de ' + nfH1.format(r.roi) + ' vezes o valor do plano') + '. Estimativa com dados ilustrativos.';
      }, 500);
    }
  }

  if (roiBox) {
    ROI_FIELDS.forEach(function (f) {
      f.num = document.getElementById(f.id);
      f.rng = f.s ? document.getElementById(f.s) : null;
    });
    ['he', 'vt', 'rec', 'gl', 'roi'].forEach(function (k) {
      var el = roiEl(k);
      if (el) roiOuts[k] = { el: el, cur: NaN, from: 0, to: 0, t0: 0, run: false, fmt: String };
    });
    var scBtns = $$('.sc-btn');
    var clearSc = function () { scBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); }); };
    ROI_FIELDS.forEach(function (f) {
      f.num.addEventListener('input', function () {
        if (f.rng) f.rng.value = roiRead(f);
        clearSc();
        roiRender(true);
      });
      f.num.addEventListener('change', function () { f.num.value = roiRead(f); if (f.rng) f.rng.value = f.num.value; roiRender(true); });
      if (f.rng) f.rng.addEventListener('input', function () { f.num.value = f.rng.value; clearSc(); roiRender(true); });
    });
    $$('input[name="r-modo"]').forEach(function (r) { r.addEventListener('change', function () { roiRender(true); }); });
    scBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var a = b.getAttribute('data-sc').split(',').map(Number);
        ROI_FIELDS.forEach(function (f, i) { f.num.value = a[i]; if (f.rng) f.rng.value = a[i]; });
        clearSc();
        b.setAttribute('aria-pressed', 'true');
        roiRender(true);
        roiBox.scrollIntoView({ block: 'nearest', behavior: mqReduce.matches ? 'auto' : 'smooth' });
      });
    });
    roiRender(false); /* recalcula com a mesma funcao: o HTML estatico e so o fallback sem JS */
    roiInit = true;
  }

  /* ---------- Depoimentos: carrossel contido (setas, teclado, arraste com mouse; toque usa rolagem nativa) ---------- */
  var tmTrack = $('#tm-track'), tmPrev = $('#tm-prev'), tmNext = $('#tm-next');
  if (tmTrack) {
    var tmStep = function () {
      var c = tmTrack.children;
      return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : tmTrack.clientWidth * 0.8;
    };
    var tmGo = function (dir) {
      tmTrack.scrollBy({ left: dir * tmStep(), behavior: mqReduce.matches ? 'auto' : 'smooth' });
    };
    var tmSync = function () {
      var mx = tmTrack.scrollWidth - tmTrack.clientWidth;
      if (tmPrev) tmPrev.setAttribute('aria-disabled', String(tmTrack.scrollLeft <= 1));
      if (tmNext) tmNext.setAttribute('aria-disabled', String(tmTrack.scrollLeft >= mx - 1));
    };
    if (tmPrev) tmPrev.addEventListener('click', function () { if (tmPrev.getAttribute('aria-disabled') !== 'true') tmGo(-1); });
    if (tmNext) tmNext.addEventListener('click', function () { if (tmNext.getAttribute('aria-disabled') !== 'true') tmGo(1); });
    tmTrack.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); tmGo(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); tmGo(-1); }
      else if (e.key === 'Home') { e.preventDefault(); tmTrack.scrollTo({ left: 0, behavior: 'auto' }); }
      else if (e.key === 'End') { e.preventDefault(); tmTrack.scrollTo({ left: tmTrack.scrollWidth, behavior: 'auto' }); }
    });
    tmTrack.addEventListener('scroll', tmSync, { passive: true });
    addEventListener('resize', tmSync, { passive: true });
    var drag = null;
    tmTrack.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: tmTrack.scrollLeft, id: e.pointerId };
      tmTrack.classList.add('is-drag');
      try { tmTrack.setPointerCapture(e.pointerId); } catch (err) { /* captura e opcional */ }
    });
    tmTrack.addEventListener('pointermove', function (e) {
      if (drag) tmTrack.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    var tmEnd = function () {
      if (!drag) return;
      drag = null;
      tmTrack.classList.remove('is-drag');
    };
    tmTrack.addEventListener('pointerup', tmEnd);
    tmTrack.addEventListener('pointercancel', tmEnd);
    tmSync();
  }

  /* ---------- Pausar animacoes decorativas (faixa rolando e telas flutuantes) ---------- */
  var pauseBtn = $('#pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      var paused = root.classList.toggle('anim-off');
      pauseBtn.setAttribute('aria-pressed', String(paused));
    });
  }

  root.setAttribute('data-ready', '1'); /* sinaliza ao bootstrap do head que o script chegou ao fim (REV-LP-01) */
})();
