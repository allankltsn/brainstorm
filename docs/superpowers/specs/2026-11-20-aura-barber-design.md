# Aura Barber — Design (protótipo)

_Data: 2026-11-20 · Branch: `aura-barber` · Autor: dono + agente brainstorm-5c_

## Intenção e porquê
Aura Barber é o membro "barbearia" da família **Aura**. A dor principal, nas palavras do dono:
**facilidade e foco em experiência do usuário na gestão da empresa**, com **gerenciamento dinâmico**
de serviços, profissionais, empresa e **tempo necessário** (duração), de forma que operar a barbearia
seja leve e os serviços fiquem realmente "gerenciáveis".

O protótipo existe para **validar essa experiência** antes de qualquer desenvolvimento de produto —
telas navegáveis com dados fictícios, não um sistema com backend.

## Quem usa
Todos os papéis, com troca de perfil no menu (como no aura-fit):
- **Dono/Gestor** — configura o negócio, vê ocupação e faturamento.
- **Barbeiro/Profissional** — vê a própria agenda, seus serviços e comissão.
- **Cliente** — agenda, acompanha seus horários e histórico.

## Objetivos
- Uma **Agenda dinâmica** que é o coração do app: horários reais calculados a partir de
  (duração do serviço) + (disponibilidade do profissional).
- **CRUD dinâmico** de Serviços e Profissionais com baixo atrito.
- Fluxo de **Novo agendamento** fluido: cliente → serviço (puxa duração/preço) → profissional → horário livre.
- Consistência visual total com a família Aura (mesmo tema e kit de UI).

## Não-objetivos
- Backend, banco, autenticação real, pagamentos reais.
- App mobile nativo (é web responsivo).
- Multiunidade/franquia na Fase 1 (fica para a Fase 3).
- Integrações externas (WhatsApp, gateways) neste protótipo.

## Anti-objetivos (o que seria fracasso mesmo "funcionando")
- Reaproveitar o domínio do aura-fit à força (treino/aluno onde deveria ser serviço/cliente).
- Uma agenda "burra" (grade estática) que não reflita duração × disponibilidade — isso mataria o propósito.
- Telas poluídas/complexas que contrariem o foco em UX.

## Restrições
- Rodar na worktree isolada `C:\dev\brainstorm-aura-barber` (branch `aura-barber`), sem afetar outros agentes.
- Seguir as regras de publicação do `prototype-v2` quando for publicar (sync → main → GitHub Pages) — só quando pronto.
- Dados mock; `npm run build` deve passar antes de publicar.

## Abordagens consideradas
- **A — Reaproveitar a base técnica do `prototype-v2` (ESCOLHIDA).** Mesma stack (Vite + React + TS,
  HashRouter) e o kit de UI + tema Aura já prontos, com **domínio de barbearia modelado do zero**.
  Trade-off: carrega a estrutura/scaffold do v2, mas é o caminho mais rápido e mais consistente com a família Aura,
  concentrando o esforço na experiência. Escolhida porque o dono passou o "como" e prioriza UX + velocidade.
- B — App React do zero usando só os componentes. Mais limpo, bem mais lento de montar. Descartada por custo.
- C — HTML puro (como `prototype/`). Descartada: a gestão dinâmica/agenda exige interatividade real.

## Como será construído (decisões assumidas pelo agente, já que o dono delegou o "como")
- **Stack:** Vite + React + TypeScript, HashRouter, reusando o kit de UI (shadcn/affect/lightswind) e o tema Aura do `prototype-v2`.
- **Domínio (mock em `data.ts`):** Empresa, Profissional, Serviço (nome, duração, preço, categoria, executores),
  Cliente, Agendamento (cliente, serviço(s), profissional, início, duração→fim, status).
- **Agenda:** colunas por profissional, linhas por faixa de horário; slots livres derivados de
  disponibilidade do profissional menos agendamentos existentes, respeitando a duração do serviço.
- **Papéis:** troca de perfil no menu; cada papel vê seu Início e navegação adequada.
- **Localização:** português (pt-BR), como o resto da família Aura.

## Faseamento
- **Fase 1 (núcleo "gerenciável"):** Serviços · Profissionais · Agenda · Novo agendamento.
- **Fase 2:** App do Cliente · Dashboards por papel (Início).
- **Fase 3:** Empresa/Config · multiunidade · extras.

## O que fica a cargo do builder (detalhes menores)
- Estrutura de pastas do app e nomes de rotas (`#/agenda`, `#/servicos`, `#/profissionais`, `#/agendar`, ...).
- Formato exato dos dados mock e volume de exemplos (barbearia fictícia com ~3 profissionais, ~6 serviços).
- Granularidade da grade de horário (ex.: 15/30 min) e janela do dia.
- Componentes reaproveitados vs. novos específicos da agenda.

## Fase 2 — detalhamento (addendum, aprovado 2026-11-20)
Escopo aprovado pelo dono: **App do Cliente** + **Dashboards por papel (Início)**, dobrando a
correção dos rótulos possessivos. Protótipo, dados mock, sem backend (igual à Fase 1).

**Identidade (base de tudo).** O protótipo passa a saber *quem* é o usuário, além do papel.
Decisão do dono: **seletor de identidade junto do seletor de papel** (sem tela de login).
- `RoleProvider` passa a guardar, além de `role`: `profissionalId` (quando barbeiro) e `clienteId`
  (quando cliente), cada um em sua chave no `localStorage`. Dono é único, sem sub-identidade.
- No `app-shell`, ao lado do `RoleSwitch`, um 2º seletor aparece **só** para barbeiro/cliente
  ("Sou: Rafa ▾" / "Sou: Ana ▾"). Padrões: `p-rafa` (barbeiro) e `c-ana` (cliente); id inválido
  no storage cai no padrão.

**Dashboards por papel (Início), leves e sem poluição.**
- **Dono:** agendamentos de hoje, faturamento previsto do dia, nº de profissionais, e ocupação
  por profissional (barra discreta; Recharts já é dependência).
- **Barbeiro (= o profissional logado):** minha agenda de hoje, minha comissão estimada
  (Σ preço × comissão dos meus do dia), meus serviços.
- **Cliente:** meus próximos horários + histórico + botão Agendar.

**App do Cliente (papel cliente).**
- Página **"Meus horários"**: próximos (com **cancelar** → status `cancelado`) e passados.
- `/agendar` já logado como eu: quando o papel é cliente, o cliente vem pré-selecionado da
  identidade e a etapa de escolher cliente some.
- Nav do cliente: Início · Meus horários · Agendar.

**Correção #3 (rótulos possessivos) dobrada aqui:** o Início passa a filtrar por
`profissionalId`/`clienteId` reais em vez de rótulos genéricos.

**Decisões assumidas (o dono pode corrigir):** faturamento e comissão são *estimativas* sobre os
mocks; cancelar é só mudança de status (sem desfazer); dono não tem sub-identidade.

## Fase 3 — Config padrão AuraFit (addendum, aprovado 2026-11-20)
Escopo aprovado: telas de **configuração de usuário, empresa, profissionais e clientes**,
**padronizadas pela estrutura do AuraFit** (banco `identity`), para mais à frente plugar no
**BFF global** da Aura. Protótipo mock/estático (repo público, sem dado real).

**Abordagem A (aditiva), escolhida.** Adiciona uma camada de identidade espelhando o `identity`
do AuraFit (ver `C:\dev\aura\internal\aura-projects\docs\database\identity.dbml`), **sem reescrever
Fase 1/2**: `User`, `UserSettings`, `Empresa`(≈`Tenant`: id, ownerUserId, name, slug, status +
campos barber abertura/fechamento/gradeMin), `Membership`(userId, empresaId, role, status,
invitedBy), `Invite`. Papéis = `dono|barbeiro|cliente` (no AuraFit: admin|personal|aluno).
`Profissional`/`Cliente` ganham `userId` ligando ao `User`. Fora desta rodada: `legal_*`,
catálogo de permissões detalhado, multiunidade (filiais — fase própria depois).

Mapa: profissional = `User` + `Membership(role=barbeiro)` + perfil barber; cliente = `User` +
`Membership(role=cliente)` — mesmo padrão tenant→membership do AuraFit.

**Telas:** (1) Meu usuário (todos; via engrenagem/avatar no topo) — perfil + preferências
(theme/locale/notify*); (2) Empresa (dono) — nome/slug/status + horário + grade (15/30/60, novo
`gradeMin`, com efeito imediato em Agenda/Agendar); (3) Clientes (dono) — memberships `cliente` +
convidar + suspender/reativar; (4) Profissionais (dono) — memberships `barbeiro` + convidar +
status (além do CRUD de perfil que já existe).

**Pronto para o BFF global:** toda leitura/escrita passa por uma camada fina `src/lib/api.ts` com
funções no formato dos endpoints do BFF AuraFit (`getMe`, `getMySettings`/`updateMySettings`,
`getEmpresa`/`updateEmpresa`, `listMemberships(role)`, `createInvite`, `setMembershipStatus`).
Hoje opera sobre o mock; depois troca-se a implementação por `fetch` sem tocar nas telas.

**Decisões assumidas:** mock em memória; enums de status iguais (ACTIVE/SUSPENDED/PENDING);
`Membership.role` guarda o nome do papel (no AuraFit é `roleId`→tabela `roles` — simplificação de
protótipo); convite é mock (gera código, sem e-mail); "Meu usuário" no topo (engrenagem), Clientes
entra no menu do dono.

## Rastreamento
Gerido no GitHub Project **brainstrm** (público), Frente = `Aura Barber`:
https://github.com/users/allankltsn/projects/2
