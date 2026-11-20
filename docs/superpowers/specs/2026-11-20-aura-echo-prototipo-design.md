# Aura Echo — Protótipo do hub do ecossistema (design)

2026-11-20 · status: rascunho para aprovação · branch `aura-eco`

## Intenção e porquê

A Aura está se expandindo em várias verticais, cada uma hoje um app/protótipo
independente, com seu próprio login, planos e perfis:

- **Aura Fit** — academia (é o `prototype-v2` de hoje)
- **Aura Barber** — barbearia
- **Aura Brand** — CRM + marketing
- **Aura Vagas** — aplicação/gestão de vagas

Falta uma visão unificada. O **Aura Echo** é o hub do ecossistema, com duas faces:

1. **Landing pública** — a vitrine de tudo que é Aura, com os serviços
   contratáveis (cada um por seu plano).
2. **Portal autenticado** — o cliente vê, num lugar só, todos os serviços que
   já contratou, e tem a visão global do Aura.

O ganho é de **visão**: o cliente deixa de pensar em apps soltos e passa a ver
"o meu Aura"; quem chega de fora vê o ecossistema inteiro, não uma vertical
isolada.

Esta rodada entrega um **protótipo visual com dados mockados**, no mesmo molde
das verticais, para validar a experiência do hub **antes** do desenvolvimento
real (SSO, billing, integração).

## Objetivos

- **Landing pública do ecossistema:** hero, grade dos 4 serviços, preços por
  serviço, CTA de entrar/criar conta.
- **Portal autenticado "meu Aura":** dashboard com serviços contratados +
  bloco "descobrir"; loja para contratar serviços avulsos; minha assinatura
  (por serviço); conta.
- **Tema "Aura mestre"** neutro (clima de ecossistema, não a cor de uma
  vertical).
- **Mesmo stack e padrões do Aura Fit** (`prototype-v2`), para o protótipo
  encaixar no que o repositório já faz.
- **Quebra no board `brainstrm`** (Project #2): nova Frente "Aura Echo", um
  épico e as histórias/tarefas desta rodada, no padrão documentado — parte do
  entregável, feita após a aprovação deste design.

## Não-objetivos e anti-objetivos

Não-objetivos nesta rodada:

- SSO real, billing real e qualquer integração/dado real das verticais — **tudo
  mockado**.
- **Bundles / planos de ecossistema** — decidido: planos individuais por
  serviço (avulso).
- **Admin do ecossistema** — só o perfil cliente.
- **Consumir ou migrar para o `aura-ui`** — o kit fica apartado (é o kit padrão
  de todo o Aura e dos projetos que o `aura-brand` gerará para empresas).
- **Embutir as verticais** — os serviços abrem por deep-link mockado.

Anti-objetivo (o que seria fracasso mesmo "funcionando"): acoplar o Echo ao
`aura-ui` ou às verticais a ponto de travar a evolução independente deles. O
Echo é um protótipo isolado.

## Restrições

- **Padrão de protótipo do repo:** Vite + React 19 + Tailwind 4 +
  shadcn/ui + affectUI + Lightswind, tema único, roteamento por hash
  (`#/...`), dados mockados, `npm run build` gera `dist/` estático.
- **Gestão por GitHub Projects (board `brainstrm`, Project #2):** épico →
  história → tarefa com sub-issues, nove estados, títulos `[E-NN]`/`[S-NNN]`/
  `[task-N-papel]`, rótulos do padrão. O Echo entra como uma **frente** do
  board.
- **guilda v1 instalado na branch** (governança, agentes, mod `guardrails`
  ativo no worktree) — a implementação roda sob esse padrão.

## Abordagens consideradas

- **A — App novo standalone `aura-echo/`, copiando o kit (ESCOLHIDA).**
  Espelha o `prototype-v2`: landing + portal num app só, kit copiado, mock.
  É o mais rápido, totalmente isolado e idêntico ao que as verticais já fazem;
  não trava em nada externo. Custo aceito: adiciona mais uma cópia do kit — o
  problema que o `aura-ui` resolverá depois; quando o `aura-ui` amadurecer, o
  Echo migra para ele.
- **B — Construir sobre o `aura-ui`.** Recusada: o `aura-ui` ainda é rascunho
  (Fase 1) e, por decisão do dono, deve ficar **apartado** como kit padrão;
  amarrar o protótipo a ele iria contra validar rápido.
- **C — Estender a `aura-landing`.** Recusada: o fonte não está nesta branch, os
  tokens são fora do padrão shadcn e misturaria código de landing com padrões
  de app.

## Decisões de produto (o "quê")

### Catálogo de serviços (4, mockado)

| Serviço | Vertical | Preço (mock) |
| --- | --- | --- |
| **Aura Fit** | academia | avulso mensal |
| **Aura Barber** | barbearia | avulso mensal |
| **Aura Brand** | CRM + marketing | avulso mensal |
| **Aura Vagas** | aplicação/gestão de vagas | avulso mensal |

Cada serviço tem: nome, ícone, uma linha (tagline), descrição curta, preço
avulso mensal, e um estado por usuário (contratado / não contratado). O
`aura-brand` **não** aparece como "gerador de projetos para empresas" neste
catálogo — aqui ele é o serviço de CRM + marketing.

### Planos

Individuais por serviço (avulso). Sem bundles, sem desconto de ecossistema.
Contratar = assinar um serviço; a landing e a loja listam preço por serviço.

### Perfil

Um único **tipo** de usuário: o **cliente** que contrata e usa os serviços. Sem
admin do ecossistema e sem hierarquia de permissão nesta rodada.

### Perfis de demonstração e troca (seed)

Como no Aura Fit (que troca personal/aluno/admin pelo menu do usuário), o
protótipo traz **vários perfis de demonstração** com estados de contratação
diferentes, e um **seletor no menu do usuário** para alternar entre eles em
tempo de execução — para testar e validar as telas sem recompilar. Mínimo:

| Perfil demo | Serviços contratados | Para validar |
| --- | --- | --- |
| Cliente completo | os 4 (Fit, Barber, Brand, Vagas) | dashboard cheio, "Descobrir" vazio |
| Cliente parcial | Aura Fit + Aura Brand | dashboard com contratados **e** "Descobrir" |
| Cliente novo | nenhum | zero-state / onboarding, "Descobrir" com tudo |

Trocar de perfil reconfigura o estado mock (como a troca de papel do Aura Fit).
"Entrar" e "Criar conta" caem no portal demo; a validação se faz pelo seletor.

### Acesso às verticais

Cada serviço contratado abre por **deep-link mockado** (um botão "Abrir" que
aponta para a URL mock da vertical). O Echo não embute nem carrega dados reais
das verticais.

## Telas (inventário)

**Landing pública** (`#/`):
- Hero do ecossistema ("tudo que é Aura")
- Grade de serviços (4 cards). "Saiba mais" é **na própria landing** (expandir
  o card / âncora para a seção de preços) — sem páginas públicas por serviço
  nesta rodada.
- Preços por serviço
- CTA entrar / criar conta
- Rodapé

**Autenticação (mock, padrão simplificado do Aura Fit):**
- Entrar (`#/entrar`)
- Criar conta (`#/criar-conta`)

**Portal "meu Aura"** (`#/app/...`):
- **Início / dashboard** — visão global: cards dos serviços **contratados**
  (status + "Abrir") e um bloco **Descobrir** (upsell dos não contratados).
- **Detalhe do serviço contratado** — resumo mock (plano, desde quando,
  próxima cobrança mock) + "Abrir".
- **Loja** — catálogo dos 4 serviços e fluxo mock de contratação avulsa
  (escolher serviço → confirmar → "contratado").
- **Minha assinatura** — lista por serviço (ativo/cancelado), faturamento
  mock, contratar/cancelar.
- **Conta** — dados do usuário e aparência (tema).

Menu do portal (padrão `src/lib/nav.ts` do Aura Fit): o menu lateral/barra traz
só os destinos de tarefa — **Início** e **Loja**. **Minha assinatura**, **Conta**
e **Sair** ficam no **menu do usuário** (rodapé do menu lateral), como no Aura
Fit — não na navegação principal.

## Modelo de dados mock

Em TypeScript, sob `src/lib/mock/`:

- **Service** — `id`, `nome`, `slug`, `icone`, `tagline`, `descricao`,
  `precoMensal`, `url` (deep-link mock).
- **Subscription** (do usuário) — `serviceId`, `status`
  (`ativa` | `cancelada`), `desde`, `proximaCobranca` (mock).
- **User** — `nome`, `email`, `avatar`.

Estado em memória (como no Aura Fit): trocar perfil/estado de contratação é
mock, sem backend.

## Decisões de implementação (minhas chamadas, após builder check)

Resolvido olhando o protótipo irmão (Aura Fit) e para manter o escopo enxuto:

- **Auth não bloqueia rotas.** Como no Aura Fit, "Entrar"/"Criar conta" são
  páginas cosméticas; todas as rotas do portal são alcançáveis. Estado (usuário,
  serviços contratados) em memória + `localStorage`.
- **App standalone na raiz** do worktree (`aura-echo/`), irmão do
  `prototype-v2`, não um pacote de monorepo (o `pnpm-workspace.yaml` do Aura Fit
  é só política de `minimumReleaseAge`, não conversão para monorepo).
- **Gerenciador de pacotes:** `pnpm` (direção atual do Aura Fit, que já carrega
  `pnpm-lock.yaml`). Afeta só lockfile/CI, não o código.
- **"Saiba mais" na landing** é na própria página (expandir/âncora), sem páginas
  públicas por serviço.
- **Navegação:** Início e Loja no menu; Assinatura, Conta e Sair no menu do
  usuário.

## O que fica a cargo do builder

- Escolha fina de componentes do kit por tela (shadcn/affect/lightswind).
- Copy e textos mockados (PT-BR).
- Paleta exata do tema "Aura mestre" dentro de "neutro/ecossistema" — a decidir
  visualmente na implementação (provável companion visual nessa etapa).
- Estrutura de pastas detalhada, espelhando `prototype-v2`
  (`src/pages`, `src/components`, `src/lib`, `src/hooks`).
- Onde o `aura-echo/` mora na árvore (proposta: raiz do worktree `aura-eco`).

## Follow-ups fora desta rodada (registrar no board como futuros)

- SSO/identidade única real entre verticais.
- Billing real e, se voltar à mesa, bundles de ecossistema.
- Admin do ecossistema.
- Migração do Echo para o `aura-ui` quando for o kit oficial.
