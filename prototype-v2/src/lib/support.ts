/* Dados 100% fictícios da central de ajuda: perguntas frequentes e pedidos de suporte. */
import type { Role } from './data'

export type Faq = { id: string; q: string; a: string; roles: Role[] }

export const faqs: Faq[] = [
  { id: 'f1', q: 'Como convido um aluno?', a: 'No botão Novo, escolha Convidar aluno e informe o e-mail. A pessoa recebe um link, cria a senha e já aparece na sua lista.', roles: ['personal'] },
  { id: 'f2', q: 'O aluno paga para usar o aura-fit?', a: 'Não. Só o personal tem assinatura. O aluno usa o app sem custo enquanto estiver acompanhado por um personal.', roles: ['personal', 'aluno'] },
  { id: 'f3', q: 'Como registro um treino feito?', a: 'Abra Meu treino, toque em Começar treino e conclua as séries. No fim, conte como foi o esforço e se sentiu dor.', roles: ['aluno'] },
  { id: 'f4', q: 'Quem vê meus dados de saúde?', a: 'Só o seu personal, e só o que você liberar. Você pode retirar a liberação quando quiser em Configurações, na aba Privacidade.', roles: ['aluno'] },
  { id: 'f5', q: 'Como funcionam os créditos de IA?', a: 'Cada plano traz créditos que renovam todo mês. Sugerir um treino gasta mais do que um rascunho de mensagem. O saldo fica em Créditos de IA.', roles: ['personal'] },
  { id: 'f6', q: 'Posso pausar um aluno sem perder o histórico?', a: 'Sim. Abra o aluno, toque em Pausar ou encerrar e escolha Pausar. O histórico continua guardado e você retoma quando quiser.', roles: ['personal'] },
  { id: 'f7', q: 'Como troco o e-mail da conta?', a: 'Por segurança, a troca de e-mail é feita pelo suporte. Abra um pedido aqui embaixo e confirme pelo e-mail atual.', roles: ['personal', 'aluno', 'admin'] },
  { id: 'f8', q: 'Como cancelo a assinatura?', a: 'Em Configurações, na aba Assinatura, toque em Cancelar assinatura. Você mantém o acesso até o fim do período pago.', roles: ['personal'] },
]

export const SUPPORT_TOPICS = [
  { value: 'conta', label: 'Conta e acesso' },
  { value: 'treinos', label: 'Treinos e exercícios' },
  { value: 'pagamento', label: 'Pagamento e assinatura' },
  { value: 'privacidade', label: 'Privacidade e dados' },
  { value: 'erro', label: 'Algo não funciona' },
  { value: 'outro', label: 'Outro assunto' },
]

export type Ticket = { id: string; subject: string; topic: string; status: 'aberto' | 'respondido' | 'resolvido'; updated: string; last: string }

export const tickets: Ticket[] = [
  { id: '1042', subject: 'Não recebi o e-mail de confirmação', topic: 'Conta e acesso', status: 'respondido', updated: '2026-10-15', last: 'Reenviamos o e-mail. Confira também a caixa de spam.' },
  { id: '1017', subject: 'Cobrança em duplicidade em setembro', topic: 'Pagamento e assinatura', status: 'resolvido', updated: '2026-09-22', last: 'O valor foi estornado no mesmo cartão.' },
]

export const SUPPORT_HOURS = 'Segunda a sexta, das 9h às 18h. Respondemos em até 1 dia útil.'
