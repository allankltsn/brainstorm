/* data-g3.js - dados exclusivos do grupo G3 (Admin). Le window.AURA; nao altera arquivos do G0. */
(function () {
  var A = window.AURA;
  if (!A) return;

  window.G3DATA = {
    blockReasons: [
      { v: 'suspeita', label: 'Atividade suspeita na conta' },
      { v: 'cobranca', label: 'Cobrança contestada' },
      { v: 'titular', label: 'Pedido da própria pessoa' },
      { v: 'termos', label: 'Descumprimento dos Termos de uso' },
      { v: 'outro', label: 'Outro motivo (descreva abaixo)' }
    ],
    blockMeta: { u11: { by: 'Henrique Salles', at: '2026-10-15T16:40' }, u07: { by: 'Marina Duarte', at: '2026-08-31T11:00' }, u15: { by: 'Henrique Salles', at: '2026-09-03T09:30' }, u23: { by: 'Marina Duarte', at: '2026-10-16T08:12' } },
    guardianAuth: { u24: 'pendente', u20: 'pendente' },
    // agrupamento da matriz (ADM-06), conforme ia-e-fluxos 1.5
    permGroups: [
      { name: 'Conta', keys: ['profile:read', 'profile:update', 'invites:read', 'invites:create'] },
      { name: 'Usuários', keys: ['users:read', 'users:manage', 'tenants:read'] },
      { name: 'Perfis', keys: ['roles:read', 'roles:manage'] },
      { name: 'Planos', keys: ['plans:read', 'plans:manage'] },
      { name: 'Cupons', keys: ['coupons:read', 'coupons:manage'] },
      { name: 'Assinaturas', keys: ['billing:read', 'subscription:manage'] },
      { name: 'Auditoria', keys: ['audit:read'] }
    ],
    // permissoes que o Administrador nunca perde pela matriz (ia-e-fluxos 4, regra 3)
    adminLocked: ['users:read', 'users:manage', 'roles:read', 'roles:manage'],
    sensitive: ['users:read', 'users:manage', 'roles:read', 'roles:manage', 'tenants:read', 'audit:read', 'billing:read'],
    namePool: ['Ana L.', 'Paulo R.', 'Juliana K.', 'Marcos T.', 'Renata B.', 'Diego F.', 'Carla M.', 'Fábio S.', 'Luana P.', 'Otávio N.', 'Tatiana V.', 'Caio D.', 'Helena G.', 'Rodrigo A.', 'Vera C.', 'Leandro H.', 'Bianca O.', 'Sérgio Q.', 'Monique E.', 'Ícaro J.', 'Priscila W.', 'Jonas Z.', 'Elisa U.', 'Nando Y.'],
    conversion: { c1: 64, c2: 58, c3: 49, c4: 71, c5: 46, c6: 55, c7: 0, c8: 61 }
  };
})();
