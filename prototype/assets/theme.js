/* theme.js - carregar no <head>, sem defer: aplica .dark em <html> e o tamanho do texto antes da primeira pintura.
   Tema: 'light' | 'dark' | 'system' (localStorage 'aura-theme'). ?theme=... forca o modo na sessao (nao persiste).
   Tamanho do texto: 'padrao' | 'grande' (localStorage 'aura-text-size'); classes text-large e g4-text-large em <html>.
   Tambem grava data-role em <html> a partir de ?role= (base.css usa para o texto de ajuda do aluno).
   Sincronizacao: qualquer controle (popover do topo, tela de Aparencia) chama AuraTheme.set/setSize e escuta AuraTheme.onChange. */
(function () {
  var KEY = 'aura-theme', SKEY = 'aura-text-size';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var override = null, saved = null, size = 'padrao';

  function valid(v) { return v === 'light' || v === 'dark' || v === 'system'; }
  try {
    var m = /[?&]theme=(light|dark|system)\b/.exec(location.search);
    if (m) override = m[1];
    var r = /[?&]role=(admin|personal|aluno)\b/.exec(location.search);
    if (r) root.setAttribute('data-role', r[1]);
  } catch (e) {}
  try { saved = window.localStorage.getItem(KEY); } catch (e) {}
  if (!valid(saved)) saved = 'system';
  try { if (window.localStorage.getItem(SKEY) === 'grande') size = 'grande'; } catch (e) {}

  function mode() { return override || saved; }
  function resolved() {
    var md = mode();
    if (md === 'system') return mq && mq.matches ? 'dark' : 'light';
    return md;
  }
  function emit(explicit) {
    try { document.dispatchEvent(new CustomEvent('aura:themechange', { detail: { mode: mode(), resolved: resolved(), size: size, explicit: !!explicit } })); } catch (e) {}
  }
  function apply(explicit) {
    var rs = resolved();
    root.classList.toggle('dark', rs === 'dark');
    root.setAttribute('data-theme', rs);
    root.style.colorScheme = rs;
    root.classList.toggle('text-large', size === 'grande');
    root.classList.toggle('g4-text-large', size === 'grande');
    emit(explicit);
  }
  // depois de uma escolha explicita, o ?theme= da URL deixa de valer (evita voltar ao tema antigo ao navegar)
  function dropThemeParam() {
    try {
      if (/[?&]theme=/.test(location.search) && window.history && history.replaceState) {
        var u = new URL(location.href); u.searchParams.delete('theme'); history.replaceState(null, '', u.toString());
      }
    } catch (e) {}
  }

  window.AuraTheme = {
    get: function () { return mode(); },
    resolved: resolved,
    set: function (v) {
      if (!valid(v)) return;
      saved = v; override = null;
      try { window.localStorage.setItem(KEY, v); } catch (e) {}
      dropThemeParam();
      apply(true);
    },
    getSize: function () { return size; },
    setSize: function (v) {
      size = v === 'grande' ? 'grande' : 'padrao';
      try { window.localStorage.setItem(SKEY, size); } catch (e) {}
      apply(true);
    },
    // fn({mode, resolved, size}) a cada mudanca (neste arquivo ou em outra aba)
    onChange: function (fn) { document.addEventListener('aura:themechange', function (e) { fn(e.detail); }); }
  };
  if (mq) {
    var onChange = function () { if (mode() === 'system') apply(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }
  // outra aba/janela mudou o tema ou o tamanho
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { saved = valid(e.newValue) ? e.newValue : 'system'; apply(false); }
    else if (e.key === SKEY) { size = e.newValue === 'grande' ? 'grande' : 'padrao'; apply(false); }
  });
  apply(false);
})();
