/* icons.js - sprite SVG inline. Uso: <svg class="icon" aria-hidden="true"><use href="#i-home"/></svg>
   ou AuraIcons.html('home', 'icon-sm'). Traco currentColor, viewBox 24. */
(function () {
  var P = {
    'home': '<path d="m3 10.5 9-7.5 9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8"/><path d="M18 14.4c2 .8 3.5 2.6 3.5 5.6"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',
    'shield': '<path d="M12 3 4.5 6v5.5c0 4.7 3.1 8.4 7.5 9.5 4.4-1.1 7.5-4.8 7.5-9.5V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    'credit-card': '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19"/><path d="M6.5 15h3"/>',
    'tag': '<path d="M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7a1.5 1.5 0 0 1 1.06.44l7.3 7.3a1.5 1.5 0 0 1 0 2.12l-7.7 7.7a1.5 1.5 0 0 1-2.12 0l-7.3-7.3A1.5 1.5 0 0 1 3 12.2z"/><circle cx="8" cy="8" r="1.4"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    'bell': '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8.5 3 8.5H3S6 15 6 8z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4.2-4.2"/>',
    'eye': '<path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10.5 7 10.5 7a17 17 0 0 1-3 3.8"/><path d="M6.6 6.7A17 17 0 0 0 1.5 12S5.5 19 12 19a10 10 0 0 0 4.4-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m3 3 18 18"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="9.5"/><path d="m7.8 12.3 2.8 2.8 5.6-5.8"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'x-circle': '<circle cx="12" cy="12" r="9.5"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/>',
    'alert': '<path d="M10.3 3.9 1.8 18.5A2 2 0 0 0 3.5 21.5h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4.5"/><path d="M12 17.5h.01"/>',
    'info': '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5"/><path d="M12 7.6h.01"/>',
    'help': '<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9.3a2.9 2.9 0 0 1 5.6 1c0 1.9-2.8 2.4-2.8 4.2"/><path d="M12 17.6h.01"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    'chevron-left': '<path d="m15 6-6 6 6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-up': '<path d="m6 15 6-6 6 6"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    'plus': '<path d="M12 5v14"/><path d="M5 12h14"/>',
    'edit': '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    'trash': '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    'lock': '<rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    'key': '<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 9.3-9.3"/><path d="m16.5 6.5 3 3"/>',
    'mail': '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3 7 9 6.5L21 7"/>',
    'calendar': '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 10h18"/><path d="M8 2.5v4"/><path d="M16 2.5v4"/>',
    'dumbbell': '<path d="M6.5 6.5v11"/><path d="M17.5 6.5v11"/><path d="M3 9v6"/><path d="M21 9v6"/><path d="M6.5 12h11"/>',
    'chart': '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    'menu': '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
    'logout': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/>',
    'moon': '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    'monitor': '<rect x="2.5" y="3.5" width="19" height="13" rx="2.5"/><path d="M8 21h8"/><path d="M12 16.5V21"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    'upload': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    'filter': '<path d="M3 4.5h18l-7 8.5v6l-4 2v-8z"/>',
    'clock': '<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l3.5 2"/>',
    'heart': '<path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21.7l8.8-8.7a5.2 5.2 0 0 0 0-7.4z"/>',
    'star': '<path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.200l-5.8 3.100 1.1-6.400L2.600 9.300l6.500-.9z"/>',
    'more': '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
    'ban': '<circle cx="12" cy="12" r="9.5"/><path d="m5.3 5.3 13.4 13.4"/>',
    'refresh': '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12A9 9 0 0 1 18.500 5.800L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/>',
    'external': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="m10 14 11-11"/>',
    'file-text': '<path d="M14 2.500H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.500z"/><path d="M14 2.500V8.500h6"/><path d="M8 13h8"/><path d="M8 17h6"/>',
    'clipboard': '<rect x="5" y="4" width="14" height="17" rx="2.500"/><path d="M9 4V3h6v1"/><path d="M9 11h6"/><path d="M9 15h4"/>',
    'sparkles': '<path d="m12 3 1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/><path d="M19 3v4"/><path d="M17 5h4"/>'
  };
  var LABELS = Object.keys(P);

  function svg(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  }
  window.AuraIcons = { names: LABELS, html: svg };

  function inject() {
    if (document.getElementById('aura-icons')) return;
    var s = '<svg id="aura-icons" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">';
    LABELS.forEach(function (n) {
      s += '<symbol id="i-' + n + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + P[n] + '</symbol>';
    });
    s += '</svg>';
    document.body.insertAdjacentHTML('afterbegin', s);
  }
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);
})();
