# Aura Barber — Fase 2 — Plano de implementação

> **Para workers:** executar com superpowers:executing-plans (inline) + TDD, tarefa a tarefa.

**Goal:** Dar identidade por papel ao protótipo, dashboards de Início por papel e o App do Cliente (meus horários + cancelar + agendar como eu), dobrando a correção dos rótulos possessivos.

**Architecture:** Lógica pura e testável em `src/lib` (`identidade.ts`, `metrics.ts`); estado de identidade estende o `RoleProvider`; telas consomem os helpers. Sem backend, dados mock, como a Fase 1.

**Tech Stack:** React 19 + Vite + TS, HashRouter, kit Aura (affect/shadcn), vitest.

**Spec:** docs/superpowers/specs/2026-11-20-aura-barber-design.md (addendum "Fase 2").

## Global Constraints
- Versão do app = init (0.1.1); não bumpar sem alinhar init.
- Nunca editar `init/` (CLAUDE.md); publicar só via `scripts/sync.sh`.
- pt-BR; reusar kit e tema Aura; dados mock em memória.
- `npm test` e `npm run build` verdes antes de publicar.
- Relação serviço⇄profissional tem fonte única em `Profissional.servicos`; usar `db.executoresDe`.

## Review Focus
- Identidade inválida no `localStorage` (id que não existe) → cai no padrão, não quebra. (Task 1)
- Cliente sem agendamentos / barbeiro sem agenda hoje → estado vazio claro, sem erro. (Task 2/3)
- Cancelar → some dos "próximos", entra no histórico, some da Agenda (cancelado já é filtrado). (Task 3)
- Ocupação/comissão com profissional que não trabalha no dia (janela 0) → sem divisão por zero. (Task 2)
- `/agendar` como cliente logado → cliente fixado na identidade; dono/barbeiro mantêm o seletor. (Task 3)

---

### Task 1: Identidade por papel

**Files:**
- Create: `src/lib/identidade.ts`, `src/lib/identidade.test.ts`
- Modify: `src/lib/role.tsx`, `src/components/app-shell.tsx`, `src/lib/nav.ts`

**Interfaces:**
- Produces: `PROF_PADRAO='p-rafa'`, `CLIENTE_PADRAO='c-ana'`; `idValido(valor: string | null, validos: string[], padrao: string): string`; `lerProfId(ls): string`; `lerClienteId(ls): string`; `salvarId(ls, key: string, valor: string): void`. Contexto `useRole()` passa a expor `{ role, setRole, profId, setProfId, clienteId, setClienteId }`.
- Consumes: `db.profissionais`, `db.clientes` (ids válidos).

- [ ] **Step 1 — teste (RED):** em `identidade.test.ts`, `idValido(null, ['a'], 'a')==='a'`; `idValido('x', ['a'], 'a')==='a'`; `idValido('a', ['a','b'], 'b')==='a'`. E `lerProfId` com storage vazio → `'p-rafa'`; com `'p-joao'` → `'p-joao'`; com `'zzz'` → `'p-rafa'`.
- [ ] **Step 2 — rodar e ver falhar:** `npm test -- identidade` → FAIL (módulo não existe).
- [ ] **Step 3 — implementar `identidade.ts`:** `idValido` puro; `lerProfId/lerClienteId` leem as chaves `aura-barber-prof`/`aura-barber-cliente` via `idValido` contra os ids do `db`; `salvarId` grava com try/catch.
- [ ] **Step 4 — ver passar:** `npm test` → PASS.
- [ ] **Step 5 — wiring:** `role.tsx` estende o contexto com `profId/clienteId` + setters (lendo/gravando via `identidade.ts`). `app-shell.tsx` ganha `IdentidadeSwitch` (um `Select` de profissionais quando `barbeiro`, de clientes quando `cliente`; nada para `dono`) ao lado do `RoleSwitch`. `nav.ts`: cliente = Início · Meus horários (`/meus-horarios`) · Agendar.
- [ ] **Step 6 — build:** `npm run build` → ✓. Commit.

### Task 2: Dashboards por papel (metrics + Início)

**Files:**
- Create: `src/lib/metrics.ts`, `src/lib/metrics.test.ts`
- Modify: `src/pages/home.tsx`

**Interfaces:**
- Produces: `faturamentoDoDia(ags, diaISO): number`; `comissaoDoDia(profId, ags, diaISO): number`; `ocupacaoPorProfissional(diaISO, ags, profs): {profissionalId,nome,ocupadoMin,janelaMin,pct}[]`; `agendaDoProfissional(profId, ags, diaISO): Agendamento[]`; `proximosDoCliente(clienteId, ags, agoraISO): Agendamento[]`; `historicoDoCliente(clienteId, ags, agoraISO): Agendamento[]`. (Leem `db.servicoById`/`db.profissionalById` para preço/duração/comissão/disponibilidade.)
- Consumes: Task 1 (`useRole().profId/clienteId`).

- [ ] **Step 1 — teste (RED):** `metrics.test.ts` com ags construídos: faturamento soma só ativos do dia (ignora `cancelado` e outros dias); comissão = Σ preço×pct/100 do prof no dia; ocupação pct correta e `0` quando janela 0 (prof não trabalha); próximos = `marcado` com início ≥ agora (ordenado), histórico = resto (início < agora ou `concluido`/`cancelado`), ordenado desc; `agendaDoProfissional` filtra por prof e dia.
- [ ] **Step 2 — ver falhar:** `npm test -- metrics` → FAIL.
- [ ] **Step 3 — implementar `metrics.ts`** (puro, com guardas de divisão por zero).
- [ ] **Step 4 — ver passar:** `npm test` → PASS.
- [ ] **Step 5 — `home.tsx`:** dono = trio de Stats (agendamentos, faturamento, profissionais) + barras de ocupação por profissional (CSS simples, discreto); barbeiro = minha agenda de hoje (via `agendaDoProfissional(profId)`) + Stat comissão + meus serviços; cliente = próximos + histórico + botão Agendar. Rótulos usam `profId`/`clienteId` reais (correção #3).
- [ ] **Step 6 — build + commit.**

### Task 3: App do Cliente (Meus horários + cancelar + agendar como eu)

**Files:**
- Create: `src/pages/meus-horarios.tsx`
- Modify: `src/lib/data.ts`, `src/lib/data.test.ts`, `src/pages/agendar.tsx`, `src/App.tsx`

**Interfaces:**
- Produces: `db.cancelarAgendamento(id: string): void` (muta status→`cancelado`; id inexistente é no-op). Rota `#/meus-horarios`.
- Consumes: Task 2 (`proximosDoCliente`/`historicoDoCliente`), Task 1 (`clienteId`).

- [ ] **Step 1 — teste (RED):** em `data.test.ts`, `db.cancelarAgendamento('a-1')` deixa `a-1` com status `cancelado`; `db.cancelarAgendamento('nao-existe')` não lança e não altera a lista.
- [ ] **Step 2 — ver falhar:** `npm test` → FAIL (`cancelarAgendamento` não existe).
- [ ] **Step 3 — implementar `db.cancelarAgendamento`** em `data.ts`.
- [ ] **Step 4 — ver passar:** `npm test` → PASS.
- [ ] **Step 5 — telas:** `meus-horarios.tsx` lista próximos (com botão Cancelar → `db.cancelarAgendamento` + refresh local) e passados, do `clienteId` logado. `agendar.tsx`: quando `role==='cliente'`, inicia `clienteId` da identidade e oculta o `Select` de cliente (dono/barbeiro inalterados). `App.tsx`: adiciona a rota `meus-horarios`.
- [ ] **Step 6 — build + commit.**

## Final
Suíte verde + `npm run build` ✓ → revisão fresca de toda a branch → corrigir Crítico/Importante → publicar via `sync.sh aura-barber` (regra do protótipo: publicar na main ao concluir) e verificar no Pages.
