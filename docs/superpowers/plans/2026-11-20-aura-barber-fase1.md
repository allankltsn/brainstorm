# Aura Barber — Fase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protótipo navegável do núcleo "gerenciável" do Aura Barber — Serviços, Profissionais, Agenda dinâmica e Novo agendamento — com dados mock, na worktree `aura-barber`.

**Architecture:** App React (Vite + TS, HashRouter) numa pasta `aura-barber/` da worktree, reusando o kit de UI e o tema Aura do `prototype-v2`. A lógica de agenda (slots a partir de duração × disponibilidade e detecção de conflito) fica isolada em `src/lib/schedule.ts`, testada com Vitest; as telas montam essa lógica.

**Tech Stack:** React 19, react-router-dom 7 (HashRouter), Vite 8, TypeScript 7, Tailwind 4, lucide-react, radix-ui; kit shadcn/affect/lightswind reusado; Vitest para testes de unidade.

**Spec:** `docs/superpowers/specs/2026-11-20-aura-barber-design.md`

## Global Constraints
- Idioma pt-BR em toda a UI (rótulos, rotas em português).
- Sem backend: todo estado vem de mock em `src/lib/data.ts` (em memória; não precisa persistir).
- Papéis: `dono`, `barbeiro`, `cliente`; troca de perfil no menu; persistir papel em `localStorage` chave `aura-barber-role`.
- Menu por papel com no máximo 5 destinos (padrão do `nav.ts` do v2).
- `npm run build` (= `tsc -b && vite build`) deve passar ao fim de cada task que toca build.
- Fonte do kit a copiar: `C:\dev\brainstorm\prototype-v2` (a worktree `aura-barber` não contém o v2).
- Versões das libs: copiar verbatim do `prototype-v2/package.json`; adicionar apenas `vitest@^3` em devDependencies.

## Review Focus
- **Agendamentos sobrepostos:** dois serviços no mesmo profissional cujos intervalos [início, fim) se cruzam → `hasConflict` verdadeiro; a Agenda não deve oferecer esse slot. (Task 3)
- **Serviço não cabe na disponibilidade:** serviço de 60 min quando faltam 30 min até o fim do expediente → esse horário de início não entra em `availableSlots`. (Task 3)
- **Profissional sem o serviço:** profissional que não executa o serviço escolhido → não aparece como opção no Novo agendamento. (Task 3/Task 7)
- **Dia vazio / sem disponibilidade:** profissional de folga no dia → Agenda mostra estado vazio, `availableSlots` retorna lista vazia (sem quebrar). (Task 3/Task 6)
- **Duração não múltipla da grade:** serviço de 45 min numa grade de 30 min → fim calculado corretamente e slot ocupa as faixas certas. (Task 3)

---

### Task 1: Scaffold do app reusando o kit do v2

**Files:**
- Create: `aura-barber/package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `components.json`, `.oxlintrc.json`, `index.html`, `public/favicon.svg`
- Create (copiar de `../prototype-v2`): `aura-barber/src/components/{ui,affect,lightswind}/**`, `aura-barber/src/lib/{theme.tsx,utils.ts,use-tab.ts}`, `aura-barber/src/hooks/**`, `aura-barber/src/index.css`
- Create: `aura-barber/src/main.tsx`, `aura-barber/src/App.tsx`
- Test: n/a (verificação por build + dev)

**Interfaces:**
- Produces: alias `@/` → `aura-barber/src`; `ThemeProvider` (de `@/lib/theme`) disponível; app monta em `#root`.

- [ ] **Step 1:** Copiar os arquivos de kit/tema/config listados de `C:\dev\brainstorm\prototype-v2` para `aura-barber/`, ajustando `package.json` (`name: "aura-barber"`) e `index.html` (`<title>Aura Barber</title>`, `lang="pt-BR"`, script de tema pré-paint com chave `aura-theme`).
- [ ] **Step 2:** Escrever `src/main.tsx` (idêntico ao v2) e um `src/App.tsx` mínimo: `ThemeProvider` + um `<div>` "Aura Barber" (placeholder, substituído na Task 8).
- [ ] **Step 3:** `cd aura-barber && npm install` e `npm run build`.
  Expected: build passa, gera `dist/`.
- [ ] **Step 4:** `npm run dev` abre sem erro no console (verificação manual rápida).
- [ ] **Step 5:** Commit — `git add aura-barber && git commit -m "aura-barber: scaffold com kit de UI e tema Aura"`.

---

### Task 2: Modelo de domínio e dados mock

**Files:**
- Create: `aura-barber/src/lib/data.ts`
- Test: `aura-barber/src/lib/data.test.ts`
- Modify: `aura-barber/package.json` (script `"test": "vitest run"`, dep `vitest`), `vite.config.ts` (bloco `test` do Vitest se necessário)

**Interfaces:**
- Produces:
  - `type Role = 'dono' | 'barbeiro' | 'cliente'`
  - `type Servico = { id: string; nome: string; duracaoMin: number; precoBRL: number; categoria: string; executores: string[] }` (executores = ids de profissionais)
  - `type Disponibilidade = { dia: number; inicio: string; fim: string }` (dia 0–6; horas `"HH:MM"`)
  - `type Profissional = { id: string; nome: string; servicos: string[]; disponibilidade: Disponibilidade[]; comissaoPct: number }`
  - `type Cliente = { id: string; nome: string; telefone: string }`
  - `type Agendamento = { id: string; clienteId: string; servicoId: string; profissionalId: string; inicio: string; status: 'marcado' | 'concluido' | 'cancelado' }` (`inicio` ISO)
  - `const db`: store mutável em memória com arrays `empresa`, `servicos`, `profissionais`, `clientes`, `agendamentos` e helpers `byId`.
  - Mock: 1 barbearia, ~3 profissionais, ~6 serviços, ~4 clientes, alguns agendamentos no dia corrente.

- [ ] **Step 1: Write the failing test** — `data.test.ts`: `test('mock tem 3 profissionais e serviços com executores válidos')` assertando `db.profissionais.length === 3` e que todo `servico.executores` referencia ids existentes.
- [ ] **Step 2:** `npx vitest run src/lib/data.test.ts` → FAIL (módulo não existe).
- [ ] **Step 3:** Implementar `data.ts` com os tipos e o mock coerente.
- [ ] **Step 4:** `npx vitest run src/lib/data.test.ts` → PASS.
- [ ] **Step 5:** Commit — `"aura-barber: modelo de domínio e dados mock"`.

---

### Task 3: Lógica de agenda (núcleo) — slots e conflito

**Files:**
- Create: `aura-barber/src/lib/schedule.ts`
- Test: `aura-barber/src/lib/schedule.test.ts`

**Interfaces:**
- Consumes: tipos de `@/lib/data` (`Profissional`, `Servico`, `Agendamento`).
- Produces:
  - `fimDoAgendamento(inicioISO: string, duracaoMin: number): string` (ISO)
  - `hasConflict(prof: Profissional, novoInicioISO: string, duracaoMin: number, agendamentos: Agendamento[]): boolean`
  - `availableSlots(prof: Profissional, servico: Servico, diaISO: string, agendamentos: Agendamento[], gradeMin?: number): string[]` (lista de inícios ISO; `gradeMin` default 30)

- [ ] **Step 1: Write the failing tests** (`schedule.test.ts`), um `test` por item do Review Focus:
```ts
test('availableSlots exclui horário que sobrepõe agendamento existente', () => { /* prof c/ 1 agend. 09:00-09:30; slot 09:00 ausente */ })
test('availableSlots exclui início cujo serviço ultrapassa o fim do expediente', () => { /* exp. até 18:00, serviço 60min: 17:30 ausente, 17:00 presente */ })
test('availableSlots vazio quando profissional está de folga no dia', () => { /* sem disponibilidade no dia → [] */ })
test('fimDoAgendamento soma duração não múltipla da grade', () => { expect(fimDoAgendamento('2026-11-20T09:00:00',45)).toContain('09:45') })
test('hasConflict detecta interseção de intervalos', () => { /* 09:15 dentro de 09:00-09:30 → true */ })
```
- [ ] **Step 2:** `npx vitest run src/lib/schedule.test.ts` → FAIL.
- [ ] **Step 3:** Implementar `schedule.ts`. Abordagem: trabalhar em minutos desde a meia-noite local; `availableSlots` varre a disponibilidade do dia em passos de `gradeMin`, descarta início se `início+duração > fim` ou se `hasConflict`.
- [ ] **Step 4:** `npx vitest run src/lib/schedule.test.ts` → PASS.
- [ ] **Step 5:** Commit — `"aura-barber: lógica de slots e conflito da agenda"`.

---

### Task 4: Página Serviços (CRUD dinâmico)

**Files:** Create `aura-barber/src/pages/servicos.tsx` · Consumes `db` de `@/lib/data`, kit de `@/components`.
**Interfaces:** Produces `export function Servicos()`.

- [ ] **Step 1:** Implementar lista de serviços (nome, duração, preço, categoria, executores) com criar/editar/excluir sobre `db.servicos` (estado local via `useState`, sem persistência). Reusar `Table`, `Dialog`, `TextField`, `Select` do kit.
- [ ] **Step 2:** `npm run build` → passa.
- [ ] **Step 3:** Verificação manual: criar/editar/excluir reflete na tela.
- [ ] **Step 4:** Commit — `"aura-barber: página Serviços"`.

---

### Task 5: Página Profissionais (CRUD + disponibilidade + comissão)

**Files:** Create `aura-barber/src/pages/profissionais.tsx`.
**Interfaces:** Produces `export function Profissionais()`.

- [ ] **Step 1:** Lista de profissionais; editar nome, serviços que executa (multi-select sobre `db.servicos`), disponibilidade semanal e `comissaoPct`.
- [ ] **Step 2:** `npm run build` → passa.
- [ ] **Step 3:** Verificação manual.
- [ ] **Step 4:** Commit — `"aura-barber: página Profissionais"`.

---

### Task 6: Página Agenda (colunas por profissional)

**Files:** Create `aura-barber/src/pages/agenda.tsx` · Consumes `availableSlots`/`fimDoAgendamento` de `@/lib/schedule`.
**Interfaces:** Produces `export function Agenda()`.

- [ ] **Step 1:** Grade do dia: colunas = profissionais, linhas = faixas de `gradeMin`; renderiza `db.agendamentos` do dia como blocos ocupando da faixa de início até o fim; dia de folga mostra estado vazio. Seletor de dia. Botão "Novo" → `#/agendar`.
- [ ] **Step 2:** `npm run build` → passa.
- [ ] **Step 3:** Verificação manual: blocos nas faixas corretas; dia vazio não quebra.
- [ ] **Step 4:** Commit — `"aura-barber: página Agenda"`.

---

### Task 7: Fluxo Novo agendamento

**Files:** Create `aura-barber/src/pages/agendar.tsx` · Consumes `availableSlots` de `@/lib/schedule`, `db` de `@/lib/data`.
**Interfaces:** Produces `export function Agendar()`.

- [ ] **Step 1:** Passos: escolher cliente → serviço (mostra duração/preço) → profissional (só quem executa o serviço) → horário (de `availableSlots`). Confirmar cria `Agendamento` em `db` e volta para a Agenda.
- [ ] **Step 2:** `npm run build` → passa.
- [ ] **Step 3:** Verificação manual: profissional sem o serviço não aparece; só horários livres são oferecidos.
- [ ] **Step 4:** Commit — `"aura-barber: fluxo Novo agendamento"`.

---

### Task 8: Shell, papéis, navegação e rotas

**Files:**
- Create: `aura-barber/src/lib/role.tsx`, `aura-barber/src/lib/nav.ts`, `aura-barber/src/components/app-shell.tsx` (adaptar do v2), `aura-barber/src/pages/home.tsx`, `aura-barber/src/pages/nao-encontrada.tsx`
- Modify: `aura-barber/src/App.tsx` (rotas reais)

**Interfaces:**
- Consumes: todas as páginas (Tasks 4–7), `theme`.
- Produces: `RoleProvider`/`useRole` (papéis `dono`/`barbeiro`/`cliente`), `NAV` por papel, rotas `#/agenda`, `#/agendar`, `#/servicos`, `#/profissionais`, `#/inicio`.

- [ ] **Step 1:** `role.tsx` (modelo do v2, chave `aura-barber-role`, default `dono`). `nav.ts` com NAV por papel: dono → Início/Agenda/Serviços/Profissionais; barbeiro → Início/Agenda; cliente → Início/Agendar. `app-shell.tsx` adaptado (menu lateral + barra mobile + troca de perfil + marca "Aura Barber").
- [ ] **Step 2:** `App.tsx`: `ThemeProvider`→`RoleProvider`→`HashRouter` com as rotas sob `AppShell`; `home.tsx` simples por papel; `*` → `NaoEncontrada`.
- [ ] **Step 3:** `npm run build` → passa; `npm run dev`: navegar as 4 telas e trocar de papel.
- [ ] **Step 4:** Commit — `"aura-barber: shell, papéis, navegação e rotas"`.
