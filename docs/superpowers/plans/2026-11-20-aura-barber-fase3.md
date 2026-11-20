# Aura Barber — Fase 3 (Config padrão AuraFit) — Plano

> **Para workers:** executar com superpowers:executing-plans (inline) + TDD, tarefa a tarefa.

**Goal:** Telas de configuração (usuário, empresa, profissionais, clientes) sobre uma camada de identidade que espelha o `identity` do AuraFit, pronta para plugar no BFF global depois.

**Architecture:** Abordagem A (aditiva). Novos tipos/mock de identidade em `data.ts` (`User`, `UserSettings`, `Membership`, `Invite`; `Empresa` estendida ao shape `Tenant`), ligando `Profissional`/`Cliente` a `User` via `userId`, sem reescrever Fase 1/2. Toda leitura/escrita das telas passa por uma camada fina `src/lib/api.ts` no formato dos endpoints do BFF AuraFit.

**Tech Stack:** React 19 + Vite + TS, HashRouter, kit Aura, vitest.

**Spec:** docs/superpowers/specs/2026-11-20-aura-barber-design.md (addendum "Fase 3"). Referência de modelo: `C:\dev\aura\internal\aura-projects\docs\database\identity.dbml`.

## Global Constraints
- Versão = init (0.1.1); não bumpar sem alinhar init. Nunca editar `init/`. Publicar via `scripts/sync.sh`.
- pt-BR; kit/tema Aura; dados mock em memória (repo público, sem dado pessoal real).
- `npm test` e `npm run build` verdes antes de publicar.
- Papéis = `dono|barbeiro|cliente`. Fonte única serviço⇄profissional continua `Profissional.servicos`.
- Nomes de modelo espelham o AuraFit (User/UserSettings/Membership/Invite/Empresa≈Tenant).

## Review Focus
- `updateEmpresa` com dados inválidos (abertura ≥ fechamento, grade fora de {15,30,60}, slug vazio) → rejeita com erro, não grava. (Task 1)
- `getMySettings` de usuário sem settings seeded → devolve defaults, não quebra. (Task 1)
- `userIdDaIdentidade` quando o profissional/cliente logado não existe → undefined tratado nas telas (sem crash). (Task 1/2)
- Alterar `gradeMin` na Empresa reflete imediatamente na Agenda e nos slots de Agendar. (Task 2)
- `setMembershipStatus(SUSPENDED)` de um cliente/profissional → sai da lista de ativos; convite gera código único. (Task 3)

---

### Task 1: Camada de identidade (modelo + mock + api.ts)

**Files:**
- Modify: `src/lib/data.ts`, `src/lib/data.test.ts`
- Create: `src/lib/api.ts`, `src/lib/api.test.ts`

**Interfaces:**
- Produces (data.ts): tipos `UserStatus='PENDING'|'ACTIVE'|'SUSPENDED'`, `MembershipStatus='ACTIVE'|'SUSPENDED'`, `User{id,email,name,phone?,avatarUrl?,status,emailVerified,criadoEm}`, `UserSettings{userId,theme:'light'|'dark'|'system',locale,notifyEmail,notifyPush,notifyWhatsapp}`, `Membership{id,userId,empresaId,role:Role,status:MembershipStatus,invitedByMembershipId?,criadoEm}`, `Invite{id,codigo,empresaId,role:Role,expiraEm,usadoEm?,usadoPorUserId?}`. `Empresa` ganha `id,ownerUserId,slug,status:'ACTIVE'|'SUSPENDED',gradeMin:number`. `Profissional` e `Cliente` ganham `userId:string`. `db` ganha arrays `users,userSettings,memberships,invites` + `userById`, `atualizarEmpresa(parcial)`, `pushInvite`, e setters existentes.
- Produces (api.ts): `getMe(userId):User|undefined`; `updateUser(userId,parcial):void`; `getMySettings(userId):UserSettings`; `updateMySettings(userId,parcial):void`; `getEmpresa():Empresa`; `horarioValido(a,b):boolean`; `gradeValida(n):boolean`; `updateEmpresa(parcial):{ok:boolean;erro?:string}`; `type MembershipView=Membership&{user:User}`; `listMemberships(role):MembershipView[]` (só ACTIVE+SUSPENDED do papel, join user); `createInvite(role):Invite`; `setMembershipStatus(id,status):void`; `userIdDaIdentidade(role,profId,clienteId):string|undefined`.

- [ ] **Step 1 — teste (RED) data.ts:** em `data.test.ts`, seed tem 1 dono + 3 barbeiros + 4 clientes como `users`; cada `Profissional`/`Cliente` tem `userId` apontando p/ um user existente; `db.empresa.ownerUserId` é um user; `db.atualizarEmpresa({nome:'X'})` reflete em `db.empresa.nome`.
- [ ] **Step 2 — ver falhar:** `npm test -- data` → FAIL.
- [ ] **Step 3 — implementar em data.ts:** tipos acima; estender Empresa (id `e-aura`, ownerUserId `u-dono`, slug `aura-barber`, status ACTIVE, gradeMin 30); seed users (`u-dono`,`u-rafa`,`u-joao`,`u-bruna`,`u-ana`,`u-bruno`,`u-carla`,`u-diego`) + userSettings default p/ cada + memberships (role conforme) + invites `[]`; `userId` nos profissionais/clientes; `db.userById`, `db.atualizarEmpresa`, `db.pushInvite`.
- [ ] **Step 4 — ver passar:** `npm test` → PASS.
- [ ] **Step 5 — teste (RED) api.ts:** `api.test.ts`: `gradeValida(30)` true / `gradeValida(20)` false; `horarioValido('09:00','18:00')` true / `('18:00','09:00')` false; `updateEmpresa({abertura:'18:00',fechamento:'09:00'})`→`{ok:false}` e não grava; `updateEmpresa({gradeMin:15})`→`{ok:true}` e `getEmpresa().gradeMin===15`; `getMySettings('sem-settings')` devolve defaults; `listMemberships('cliente')` só clientes e inclui `user`; `createInvite('barbeiro')` gera `codigo` e entra em `db.invites`; `setMembershipStatus(id,'SUSPENDED')` muda status; `userIdDaIdentidade('dono','','')===db.empresa.ownerUserId` e `('barbeiro','p-rafa','')===` userId de p-rafa.
- [ ] **Step 6 — ver falhar / implementar / ver passar:** `npm test` RED→implementa `api.ts`→PASS.
- [ ] **Step 7 — build + commit.** `npm run build` ✓.

### Task 2: Telas Meu usuário + Empresa (grade com efeito live)

**Files:**
- Create: `src/pages/meu-usuario.tsx`, `src/pages/empresa.tsx`, `src/pages/config.tsx` (hub)
- Modify: `src/App.tsx`, `src/components/app-shell.tsx`, `src/pages/agenda.tsx`, `src/pages/agendar.tsx`

**Interfaces:**
- Consumes: Task 1 (`api.*`, `useRole()`), `useTheme()`.
- Produces: rotas `#/config`, `#/meu-usuario`, `#/empresa`.

- [ ] **Step 1 — grade live (test-light):** confirmar que `agenda.tsx` e `agendar.tsx` passam a usar `db.empresa.gradeMin` (não a constante 30). (Pino de regressão coberto pelos testes de `availableSlots`/`janelaDoDia` que recebem a grade por parâmetro.)
- [ ] **Step 2 — `meu-usuario.tsx`:** resolve `userId` via `api.userIdDaIdentidade(role,profId,clienteId)`; form de perfil (name, phone, avatarUrl) → `api.updateUser`; preferências (theme/locale/notify*) → `api.updateMySettings`; ao mudar theme, também chamar `useTheme().setTheme` para aplicar de verdade. Trata `userId` undefined com aviso.
- [ ] **Step 3 — `empresa.tsx`:** (dono) form nome/slug/status/abertura/fechamento/gradeMin (radio 15/30/60); `api.updateEmpresa` mostra erro de validação inline (toast/mensagem). Mudança de gradeMin/horário reflete na Agenda.
- [ ] **Step 4 — `config.tsx` (hub):** cards/links: "Meu usuário" (todos) e "Empresa" (só dono).
- [ ] **Step 5 — shell + rotas:** botão engrenagem no topbar → `/config`; rotas em `App.tsx`. `agenda.tsx`: `GRADE` passa a vir de `db.empresa.gradeMin`; `agendar.tsx`: `availableSlots(...,db.empresa.gradeMin,agoraISO())`.
- [ ] **Step 6 — build + commit.**

### Task 3: Telas Clientes + Profissionais (memberships) + convites

**Files:**
- Create: `src/pages/clientes.tsx`
- Modify: `src/pages/profissionais.tsx`, `src/lib/nav.ts`, `src/App.tsx`

**Interfaces:**
- Consumes: Task 1 (`api.listMemberships`, `api.createInvite`, `api.setMembershipStatus`).
- Produces: rota `#/clientes`; item "Clientes" no nav do dono.

- [ ] **Step 1 — `clientes.tsx`:** lista `api.listMemberships('cliente')` (nome/telefone/status do user); botão **Convidar cliente** → `api.createInvite('cliente')` exibindo o código (mock, toast/modal); **Suspender/Reativar** → `api.setMembershipStatus`. Estado vazio tratado.
- [ ] **Step 2 — `profissionais.tsx`:** acrescenta, sem quebrar o CRUD de perfil existente, um bloco de membership: badge de status do profissional (via membership) e **Convidar profissional** → `api.createInvite('barbeiro')`.
- [ ] **Step 3 — nav + rotas:** `nav.ts` dono ganha `{to:'/clientes',label:'Clientes',icon:Users}` (Profissionais passa a usar outro ícone p/ distinguir); rota `/clientes` em `App.tsx`.
- [ ] **Step 4 — build + commit.**

## Final
Suíte verde + `npm run build` ✓ → revisão fresca de toda a branch (reviewer independente, Opus) com o Review Focus acima → corrigir Crítico/Importante (cada um RED→GREEN) → publicar via `sync.sh aura-barber` e verificar no Pages.
