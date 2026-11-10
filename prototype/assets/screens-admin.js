/* screens-admin.js - telas do G3 (Admin) na galeria. Variantes: ?variant=<slug> (veja <meta name="aura-variants"> de cada tela). */
window.SCREENS = window.SCREENS || [];
(function () {
  var L = [
    ['ADM-01 · Usuários', 'usuarios', 'Busca, filtros e lista sem dado de saúde. Variantes: busca-sem-resultado, filtro-bloqueados, convites-pendentes.'],
    ['ADM-02 · Detalhe do usuário', 'usuario-detalhe', 'Variantes: bloqueado, convidado, nao-verificado, ultimo-admin, somente-leitura, menor.'],
    ['ADM-03 · Convidar usuário', 'convidar-usuario', 'Variantes: email-ja-cadastrado, enviado, revogar-confirmar.'],
    ['ADM-04 · Bloquear usuário (diálogo)', 'bloquear-usuario', 'Variantes: reativar, ultimo-admin, a-si-mesmo.'],
    ['ADM-05 · Papéis e permissões', 'perfis', 'Variantes: so-papeis-do-sistema, com-papel-novo.'],
    ['ADM-06 · Quem pode o quê', 'matriz-permissoes', 'Variantes: alteracoes-pendentes, papel-sistema-travado, conflito.'],
    ['ADM-07 · Atribuir papel', 'atribuir-papel', 'Variantes: ultimo-admin, adicionar-admin, usuario-bloqueado.'],
    ['ADM-08 · Cupons', 'cupons', 'Variantes: com-esgotado, com-expirado, com-pausado.'],
    ['ADM-09 · Criar ou editar cupom', 'cupom-editar', 'Variantes: novo, codigo-duplicado, desconto-maior-que-preco, com-usos, pausar.'],
    ['ADM-10 · Relatório do cupom', 'cupom-relatorio', 'Variantes: sem-usos, periodo-customizado.']
  ];
  L.forEach(function (s) { window.SCREENS.push({ group: 'Admin (G3)', title: s[0], path: 'screens/admin/' + s[1] + '.html', role: 'admin', note: s[2] }); });
})();
