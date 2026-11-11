# aura-brand

Plataforma para empresas construírem a marca e se venderem ao público: brand kit, conteúdo, captação, CRM e atendimento em um fio só.

**Público:** empresas que vendem ao público (o dono ou o time cuida da própria marca). O seletor multi-marca fica como recurso secundário, para uma fase posterior.

## Decisões de frontend (resolvem os `[DECIDIR]` do padrão aura-fit)

| Item | Decisão |
|---|---|
| Tema | Claro, fundo `#ffffff`, com variáveis para dark mode via classe `.dark` |
| Fonte | Geist (`@fontsource-variable/geist`) |
| Kits | shadcn/ui (radix-nova), affectUI e lightswind, nessa ordem |
| Animação | `framer-motion` (imports de `framer-motion`, não de `motion/react`) |
| Cor principal | Roxo `#6A0DAD` (token `primary` em `src/index.css`) |
| Stack, rotas, ícones, gráficos | Iguais ao padrão aura-fit (Vite, React 19, TS strict, Tailwind v4, HashRouter, lucide-react, recharts, sonner) |

### Tokens de cor
O roxo substitui o vermelho do aura-fit como `primary`.
- `primary`: `#6A0DAD` (definido; contraste de cerca de 9:1 sobre `#ffffff`, acima do AA)
- hover e variante do dark mode: tons derivados do `#6A0DAD`, a definir na montagem do app (mais escuro para hover, mais claro para o dark mode)

Os valores hex ficam só no `index.css`; os componentes usam apenas tokens.

## Módulos do MVP (ordem)
1. **Brand kit com IA:** logo, paleta, tipografia, tom de voz e briefing guiado.
2. **Gerador de conteúdo:** posts, carrosséis e imagens a partir do brand kit, com fila de aprovação ("a IA só sugere, nunca publica sem aprovação").
3. **Agendamento e publicação** nas redes.
4. **Captação:** formulários e landing pages, com a origem do lead registrada.
5. **CRM e funil:** pipeline, automações por etapa e propostas.
6. **Caixa de entrada unificada:** WhatsApp, Instagram e e-mail.
7. **Campanhas** de e-mail e WhatsApp.
8. **Painel da marca**, com créditos de IA e relatórios.

## Reaproveitado do aura-fit
Planos e assinatura (Stripe), cupons, fila "Precisa de você", chat e notificações, portão de consentimento (LGPD), limites por plano, importação de planilha.

## Fora do escopo
Treino, alunos, exercícios, recrutamento e "Pensamento do dia".

## Estado do protótipo
O app em `aura-brand/` tem todas as telas do MVP, com dados fictícios e sem servidor. Para rodar: `npm ci && npm run dev`.

| Tela | O que tem |
|---|---|
| Início | KPIs, fila "Precisa de você", leads dos últimos 7 dias, progresso do brand kit, créditos |
| Marca | Brand kit: identidade, paleta, tipografia, logo e tom de voz |
| Conteúdo | Gerador (simulado), fila de aprovação, ajustes e agendamento |
| Leads | Funil por etapa, formulários de captação, consentimento por lead |
| Mensagens | Caixa de entrada unificada e campanhas (salvas como rascunho) |
| Configurações | Conta, avisos, plano, cupom e privacidade (LGPD) |

## Próximo passo
Ligar um backend: login, gravação dos dados, IA real no gerador e nas respostas, publicação nas redes, envio de campanhas e cobrança (Stripe).
