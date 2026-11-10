/* data-g2.js - dados exclusivos do G2 (planos e assinatura). Fictícios. Lê window.AURA; não altera data.js.
   Cupons BEMVINDA20 e VERAO10 vêm do data.js (decisão 002). Aqui só os extras de teste do G2. */
window.AURA_G2 = {
  extraCoupons: [
    { id: 'g2-c3', code: 'PREMIUM20', type: 'percentual', value: 20, duration: 'n_meses', months: 3, validFrom: '2026-09-01', validUntil: '2026-12-31', maxUses: 80, uses: 14, planIds: ['premium'], status: 'ativo' },
    { id: 'g2-c4', code: 'PRIMEIRA25', type: 'percentual', value: 25, duration: 'primeira', validFrom: '2026-09-01', validUntil: '2026-12-31', maxUses: 100, uses: 22, planIds: ['pro', 'premium'], status: 'ativo', firstSubscriptionOnly: true }
  ],
  compare: [
    { label: 'Preço por mês', key: 'monthly' },
    { label: 'Preço por ano (uma cobrança só)', key: 'yearly' },
    { label: 'Alunos ativos', key: 'students' },
    { label: 'Inteligência artificial', key: 'ai' },
    { label: 'Usos de IA por mês', key: 'aiMonthly' },
    { label: 'Suporte', key: 'support' }
  ],
  support: { starter: 'Central de ajuda', pro: 'Por e-mail', premium: 'Prioritário' },
  faq: [
    { q: 'Posso cancelar quando quiser?', a: 'Sim. Em Minha assinatura você cancela em 2 passos, sem multa e sem falar com ninguém. Você continua com o plano até o fim do período que já pagou.' },
    { q: 'A cobrança renova sozinha?', a: 'Sim. Seu plano renova automaticamente, todo mês ou todo ano, no cartão que você cadastrou. Antes de pagar você vê o valor total e a data da próxima cobrança. Mandamos um e-mail 7 dias antes de cada renovação anual.' },
    { q: 'Posso desistir da compra?', a: 'Pode. Até 7 dias depois de contratar, você desiste e recebe o valor de volta, inteiro, no mesmo cartão.' },
    { q: 'O que acontece se eu cancelar o plano pago?', a: 'Você usa o plano até o dia da próxima cobrança e depois fica no Starter (grátis), com até 3 alunos ativos e sem IA. Nada é apagado. Você escolhe quais 3 alunos continuam ativos.' },
    { q: 'Posso trocar de plano depois?', a: 'Pode. Na troca, você paga só a diferença dos dias que faltam até a próxima cobrança, e a data da cobrança não muda.' },
    { q: 'Onde fica o número do meu cartão?', a: 'Só com a empresa de pagamentos que processa a cobrança. O aura-fit nunca vê nem guarda o número do seu cartão.' }
  ],
  cancelReasons: ['Está caro para mim agora', 'Tenho poucos alunos', 'Faltam recursos de que preciso', 'Vou usar outra ferramenta', 'Outro motivo'],
  /* dados fictícios do checkout de teste */
  fakeCard: { name: 'CARLA MENDES', ok: '4242 4242 4242 4242', declined: '4000 0000 0000 0002', exp: '12 / 29', cvc: '123' }
};
