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

## Rastreamento
Gerido no GitHub Project **brainstrm** (público), Frente = `Aura Barber`:
https://github.com/users/allankltsn/projects/2
