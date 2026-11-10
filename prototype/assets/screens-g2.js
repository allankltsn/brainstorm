/* screens-g2.js - telas do G2 (planos e assinatura) na galeria. */
window.SCREENS = window.SCREENS || [];
window.SCREENS.push(
  { group: 'G2 Planos e assinatura', title: 'PLN-01 Planos', path: 'screens/planos/planos.html', role: 'personal', note: 'Variantes: plano-atual-pro, limite-atingido, downgrade.' },
  { group: 'G2 Planos e assinatura', title: 'PLN-02 Resumo do pedido', path: 'screens/planos/resumo-pedido.html', role: 'personal', note: 'Variantes de cupom: cupom-aplicado, cupom-invalido, cupom-expirado, cupom-esgotado, cupom-outro-plano, cupom-so-primeira, cupom-substituir.' },
  { group: 'G2 Planos e assinatura', title: 'PLN-03 Checkout Stripe (simulação)', path: 'screens/planos/checkout-stripe.html', role: 'personal', note: 'Variantes: cartao-recusado, autenticacao-banco, processando.' },
  { group: 'G2 Planos e assinatura', title: 'PLN-04 Pagamento confirmado', path: 'screens/planos/pagamento-confirmado.html', role: 'personal', note: 'Variante: confirmando.' },
  { group: 'G2 Planos e assinatura', title: 'PLN-05 Pagamento não concluído', path: 'screens/planos/pagamento-nao-concluido.html', role: 'personal' },
  { group: 'G2 Planos e assinatura', title: 'PLN-06 Cancelar assinatura', path: 'screens/planos/cancelar-assinatura.html', role: 'personal', note: 'Variantes: com-cupom-ativo, anual.' },
  { group: 'G2 Planos e assinatura', title: 'PLN-07 Planos (admin)', path: 'screens/planos/admin-planos.html', role: 'admin', note: 'Variantes: com-rascunho, com-arquivado.' },
  { group: 'G2 Planos e assinatura', title: 'PLN-08 Editar plano (admin)', path: 'screens/planos/admin-plano-editar.html', role: 'admin', note: 'Variantes: novo, com-assinantes, arquivar-com-assinantes.' },
  { group: 'G2 Planos e assinatura', title: 'CFG-04 Assinatura', path: 'screens/config/assinatura.html', role: 'personal', note: 'Variantes: ativa, ativa-com-cupom, vencendo, inadimplente, cancelamento-agendado, cancelada, starter.' }
);
