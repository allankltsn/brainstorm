# Aura Barber — Fase 4 (Multiunidade / Filiais) — Plano

> **Para workers:** executar com superpowers:executing-plans (inline) + TDD, tarefa a tarefa.

**Goal:** Empresa (marca) passa a ter várias Filiais; profissionais, agenda e horário/grade são por filial; serviços e clientes seguem compartilhados.

**Architecture:** Novo `Filial` (≈ Tenant do AuraFit); horário/grade migram de `Empresa` → `Filial`; `Profissional`/`Agendamento` ganham `filialId`. Filial ativa no contexto (como a identidade). Telas operam na filial ativa; `api.ts` ganha o CRUD/escopo de filial.

**Tech Stack:** React 19 + Vite + TS, HashRouter, kit Aura, vitest.

**Spec:** docs/superpowers/specs/2026-11-20-aura-barber-design.md (addendum "Fase 4").

## Global Constraints
- Versão = init (0.1.1); nunca editar `init/`; publicar via `scripts/sync.sh`.
- pt-BR; dados mock em memória (repo público). `npm test` + `npm run build` verdes antes de publicar.
- Papéis dono/barbeiro/cliente; serviços e clientes continuam da marca (não por filial).

## Review Focus
- `updateFilial` inválido (horário invertido, grade fora de 15/30/60, nome vazio) → rejeita, não grava. (T1)
- Filial ativa por papel: barbeiro vê a própria; dono alterna; default = primeira. Id de filial inexistente → cai numa válida. (T2)
- Agenda/Agendar mostram só profissionais e agendamentos da filial ativa; novo agendamento recebe `filialId` da filial escolhida. (T2)
- Dashboards (dono/barbeiro) escopados à filial ativa; faturamento/ocupação não vazam entre filiais. (T3)
- Empresa não edita mais horário/grade (foram p/ Filial); Agenda usa janela/grade da filial. (T1/T2)

---

### Task 1: Modelo de filial + escopo na api

**Files:** Modify `src/lib/data.ts`(+test), `src/lib/schedule.ts`(+test), `src/lib/api.ts`(+test)

**Interfaces:**
- Produces: `Filial{id,empresaId,nome,abertura,fechamento,gradeMin,status:'ACTIVE'|'SUSPENDED'}`; `Empresa` perde `abertura/fechamento/gradeMin`; `Profissional`+`filialId`; `Agendamento`+`filialId`; `Membership`+`filialId?`. `db`: `filiais`, `filialById`, `atualizarFilial(id,parcial)`, `pushFilial`. api: `listFiliais()`, `getFilial(id)`, `updateFilial(id,parcial):{ok,erro?}`, `criarFilial(dados):Filial`, `profissionaisDaFilial(filialId):Profissional[]`, `agendamentosDaFilial(filialId):Agendamento[]`, `filialPadrao(role,profId):string`. `janelaDoDia` muda o 3º arg de `Empresa` para `{abertura:string;fechamento:string}`.
- Consumes: Fase 3 (`horarioValido`, `gradeValida`).

- [ ] **Step 1 — teste (RED):** `data.test.ts`: `db.filiais.length===2`; cada profissional tem `filialId` de uma filial existente; `db.empresa` não tem mais `gradeMin`. `api.test.ts`: `updateFilial` rejeita horário invertido/grade inválida sem gravar e grava quando válido; `profissionaisDaFilial(f)` só os da filial; `agendamentosDaFilial(f)` idem; `filialPadrao('barbeiro','p-rafa')` = filial do p-rafa; `filialPadrao('dono','')` = primeira. `schedule.test.ts`: `janelaDoDia` segue funcionando recebendo `{abertura,fechamento}`.
- [ ] **Step 2 — ver falhar.**
- [ ] **Step 3 — implementar:** em data.ts (tipos, seed 2 filiais `f-centro`/`f-zonasul`, `filialId` em profissionais/agendamentos/memberships barbeiro, remover horário/grade de Empresa, helpers no db); schedule.ts (`janelaDoDia` aceita `{abertura,fechamento}`); api.ts (funcs acima; `updateEmpresa` deixa de aceitar horário/grade). Ajustar testes/telas que liam `empresa.abertura/gradeMin`.
- [ ] **Step 4 — ver passar** (`npm test`).
- [ ] **Step 5 — build** (`npm run build`) — resolver ripples de tipo (Empresa sem horário/grade) em agenda/agendar/empresa. Commit.

### Task 2: Filial ativa no contexto + seletor + escopo de Agenda/Agendar

**Files:** Modify `src/lib/role.tsx`, `src/components/app-shell.tsx`, `src/pages/agenda.tsx`, `src/pages/agendar.tsx`

**Interfaces:**
- Produces: `useRole()` += `filialId` + `setFilialId`; `FilialSwitch` no shell.
- Consumes: Task 1 (api de filial, `janelaDoDia`).

- [ ] **Step 1:** `role.tsx` guarda `filialId` (default `filialPadrao(role,profId)`, persistido em `localStorage` `aura-barber-filial`); barbeiro segue a própria filial.
- [ ] **Step 2:** `FilialSwitch` no shell (dono: Select de filiais; barbeiro: rótulo fixo; cliente: oculto). Resolve id inválido via resolverId-like.
- [ ] **Step 3:** `agenda.tsx` usa a filial ativa: janela/grade da filial (`janelaDoDia(weekday, profissionaisDaFilial, filial)`, `GRADE=filial.gradeMin`), colunas = `profissionaisDaFilial(filialAtiva)`, agendamentos idem.
- [ ] **Step 4:** `agendar.tsx`: seletor de **Filial** (cliente escolhe; dono/barbeiro usam a ativa), profissionais filtrados por filial ∩ executores, grade = filial.gradeMin, novo agendamento recebe `filialId`.
- [ ] **Step 5 — build + commit.**

### Task 3: Dashboards por filial + tela Filiais + Empresa ajustada

**Files:** Create `src/pages/filiais.tsx`; Modify `src/pages/home.tsx`, `src/pages/empresa.tsx`, `src/lib/nav.ts`, `src/App.tsx`, `src/pages/config.tsx`

**Interfaces:** Consumes Task 1/2 (api de filial, filial ativa).

- [ ] **Step 1:** `home.tsx` escopa dono/barbeiro à filial ativa (faturamento/ocupação/agenda via `agendamentosDaFilial`/`profissionaisDaFilial`). Cliente inalterado.
- [ ] **Step 2:** `filiais.tsx` (dono): lista filiais, criar/editar (nome, horário, grade) via `api.criarFilial`/`updateFilial` com validação inline.
- [ ] **Step 3:** `empresa.tsx` perde horário/grade (ficam só marca: nome/slug/status); aponta que horário/grade são por filial.
- [ ] **Step 4:** `nav.ts` dono += Filiais; rota `/filiais` em `App.tsx`; card Filiais no hub `config.tsx` (ou nav).
- [ ] **Step 5 — build + commit.**

## Final
Suíte verde + `npm run build` ✓ → revisão fresca (Opus) com o Review Focus → corrigir Crítico/Importante → publicar via `sync.sh aura-barber` e verificar no Pages.
