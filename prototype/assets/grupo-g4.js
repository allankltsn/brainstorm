/* grupo-g4.js - helpers exclusivos do G4. Carregar no <head> depois de theme.js (aplica o tamanho do texto sem piscar). */
(function () {
  var root = document.documentElement;
  try { if (localStorage.getItem('aura-text-size') === 'grande') root.classList.add('g4-text-large'); } catch (e) {}

  function qs() {
    var o = {};
    location.search.replace(/^\?/, '').split('&').forEach(function (p) { if (p) { var kv = p.split('='); o[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); } });
    return o;
  }
  var Q = qs();
  var ROLES = ['admin', 'personal', 'aluno'];
  var defaultRole = 'aluno';

  function role() { return ROLES.indexOf(Q.role) !== -1 ? Q.role : defaultRole; }
  // mantem ?role e ?theme ao navegar
  function url(path, extra) {
    var p = ['role=' + role()];
    if (Q.theme) p.push('theme=' + encodeURIComponent(Q.theme));
    if (Q.sub) p.push('sub=' + encodeURIComponent(Q.sub));
    if (extra) p.push(extra);
    return path + (path.indexOf('?') === -1 ? '?' : '&') + p.join('&');
  }
  function routes() {
    return {
      login: '../auth/login.html',
      inicio: url('../home/' + role() + '.html'),
      treino: url('../home/aluno-treino-do-dia.html'),
      perfil: url('../config/configuracoes.html'),
      configuracoes: url('../config/configuracoes.html'),
      'minha-assinatura': url('../config/assinatura.html'),
      usuarios: url('../admin/usuarios.html'),
      'perfis-permissoes': url('../admin/perfis.html'),
      planos: url('../planos/admin-planos.html'),
      cupons: url('../admin/cupons.html')
    };
  }
  // selo "Modelo": so em KPIs de modulos fora da Fase 1 (personal/admin); nunca nas telas do aluno
  function example(tip) {
    var A = window.AURA;
    return A && A.modelBadge ? A.modelBadge(tip || 'Dados de demonstração') : '';
  }
  function ico(n, c) { return '<svg class="icon' + (c ? ' ' + c : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + n + '"/></svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* mount: abre o shell com rotas certas e restaura o <title> no formato "ID · Nome · aura-fit" */
  function mount(o) {
    var activeByRole = o.activeByRole || {};
    window.AuraShell.mount({ role: o.role || defaultRole, active: activeByRole[role()] || o.active || 'inicio', title: o.title, routes: routes() });
    document.addEventListener('aura:shellready', function () { document.title = o.id + ' · ' + o.title + ' · aura-fit'; });
  }

  var SETTINGS = [
    ['aparencia', 'Aparência', 'sun', 'aparencia.html'],
    ['meus-dados', 'Meus dados', 'user', 'meus-dados.html'],
    ['notificacoes', 'Notificações', 'bell', 'notificacoes.html'],
    ['assinatura', 'Assinatura', 'credit-card', 'assinatura.html', 'personal'],
    ['privacidade', 'Privacidade e meus direitos', 'shield', 'privacidade.html'],
    ['excluir', 'Excluir conta', 'trash', 'excluir-conta.html']
  ];
  // subnavegacao (web) ou link de volta (aluno)
  function settingsNav(active) {
    var r = role();
    if (r === 'aluno') {
      return '<a class="g4-back" href="' + esc(url('configuracoes.html')) + '">' + ico('arrow-left') + 'Voltar a Meu perfil</a>';
    }
    return '<nav class="g4-subnav" aria-label="Configurações"><ul>' +
      '<li><a href="' + esc(url('configuracoes.html')) + '"' + (active === 'indice' ? ' aria-current="page"' : '') + '>' + ico('settings') + '<span>Visão geral</span></a></li>' +
      SETTINGS.filter(function (s) { return !s[4] || s[4] === r; }).map(function (s) {
        return '<li><a href="' + esc(url(s[3])) + '"' + (s[0] === active ? ' aria-current="page"' : '') + '>' + ico(s[2]) + '<span>' + s[1] + '</span></a></li>';
      }).join('') + '</ul></nav>';
  }
  /* layout das telas de configuracao: monta subnav + coluna e devolve a coluna */
  function settingsLayout(active, holder) {
    var el = document.getElementById(holder);
    el.insertAdjacentHTML('beforebegin', '<div class="g4-nav-slot">' + settingsNav(active) + '</div>');
    return el;
  }

  function money(v) { return window.AURA.fmtBRL(v); }
  function firstName(n) { return String(n).split(' ')[0]; }

  /* grafico de barras em SVG: valores escritos em cima de cada barra + tabela equivalente (nunca so cor) */
  function barChart(id, title, summary, items, fmt, colLabels) {
    fmt = fmt || String;
    var W = 360, H = 190, top = 28, base = 160, n = items.length, gap = 10, bw = (W - gap * (n + 1)) / n;
    var max = Math.max.apply(null, items.map(function (i) { return i[1]; })) || 1;
    var bars = items.map(function (it, i) {
      var h = Math.max(3, (it[1] / max) * (base - top)), x = gap + i * (bw + gap);
      return '<rect class="g4-bar" x="' + x.toFixed(1) + '" y="' + (base - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"/>' +
        '<text class="g4-t-val" x="' + (x + bw / 2).toFixed(1) + '" y="' + (base - h - 6).toFixed(1) + '" text-anchor="middle">' + esc(fmt(it[1])) + '</text>' +
        '<text class="g4-t-muted" x="' + (x + bw / 2).toFixed(1) + '" y="' + (base + 20) + '" text-anchor="middle">' + esc(it[0]) + '</text>';
    }).join('');
    colLabels = colLabels || ['Período', 'Valor'];
    return '<figure class="stack-sm" style="margin:0"><figcaption class="body-medium" id="' + id + '-t">' + esc(title) + '</figcaption>' +
      '<svg class="g4-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="' + id + '-t ' + id + '-d"><desc id="' + id + '-d">' + esc(summary) + '</desc>' +
      '<line class="g4-axis" x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '"/>' + bars + '</svg>' +
      '<details class="g4-details"><summary>' + ico('chevron-down', 'icon-sm') + 'Ver os números em tabela</summary><table><caption class="sr-only">' + esc(title) + '</caption><thead><tr><th scope="col">' + colLabels[0] + '</th><th scope="col">' + colLabels[1] + '</th></tr></thead><tbody>' +
      items.map(function (it) { return '<tr><th scope="row">' + esc(it[0]) + '</th><td>' + esc(fmt(it[1])) + '</td></tr>'; }).join('') + '</tbody></table></details></figure>';
  }
  function today() { var t = window.AURA.today.split('-'); return new Date(+t[0], +t[1] - 1, +t[2]); }
  var DOW = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var MON = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function longDate() { var d = today(); return DOW[d.getDay()] + ', ' + d.getDate() + ' de ' + MON[d.getMonth()]; }
  function greeting() { return 'Olá'; }

  // executa depois que o shell montou (o estado ?state= ja esta no <main>)
  function ready(fn) { document.addEventListener('aura:shellready', function () { fn(); }); }

  window.G4 = {
    ready: ready,
    barChart: barChart, longDate: longDate, greeting: greeting,
    q: Q, role: role, variant: function () { return Q.variant || ''; }, url: url, routes: routes,
    setDefaultRole: function (r) { defaultRole = r; }, example: example, ico: ico, esc: esc,
    mount: mount, settingsNav: settingsNav, settingsLayout: settingsLayout, money: money, firstName: firstName
  };
})();
