# Aura Echo — Protótipo do hub · Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o protótipo visual do hub do ecossistema Aura (landing pública + portal autenticado) com dados mockados, no molde do Aura Fit.

**Architecture:** App React standalone em `aura-echo/` na raiz do worktree `aura-eco`. `HashRouter` separa a landing pública (`#/`) do portal (`#/app`, dentro de um `AppShell`). Estado 100% mock em um provider com `localStorage`; a troca de perfil de demonstração reconfigura quais serviços estão contratados, espelhando a troca de papel do Aura Fit (`src/lib/role.tsx`).

**Tech Stack:** React 19, react-router-dom 7 (HashRouter), TypeScript, Tailwind 4 (`@tailwindcss/vite`), shadcn (style `radix-nova`) + affectUI (registry) + lucide-react, framer-motion, sonner, Vite 8, pnpm, oxlint. vitest só para a lógica de `src/lib/`.

**Spec:** `docs/superpowers/specs/2026-11-20-aura-echo-prototipo-design.md`

## Global Constraints

- App em `aura-echo/` (raiz do worktree `aura-eco`), standalone — não toca `aura-ui` nem as verticais.
- Stack e convenções iguais ao `prototype-v2` (Aura Fit): `HashRouter`; rotas do portal dentro de `<Route element={<AppShell/>}>`; alias `@/`; shadcn `components.json` style `radix-nova`, baseColor `neutral`, registry affectUI; ícones lucide.
- Scripts: `pnpm dev`, `pnpm build` = `tsc -b && vite build`, `pnpm lint` = `oxlint`. Gerenciador: **pnpm**.
- Dados **mockados**, sem backend; estado em memória + `localStorage` (leitura/escrita sempre em try/catch, com fallback).
- **Planos individuais por serviço**, sem bundles. Catálogo fixo de **4 serviços**: Aura Fit (academia), Aura Barber (barbearia), Aura Brand (CRM+marketing), Aura Vagas (vagas).
- Copy em **PT-BR**. Tema **"Aura mestre"** neutro (ecossistema), com modo claro/escuro via tokens em `src/index.css` (padrão shadcn + `prefers-color-scheme`).
- Auth **não bloqueia rotas** (páginas cosméticas). Navegação: **Início** e **Loja** no menu; **Minha assinatura**, **Conta**, **Sair** no menu do usuário.
- Este é um protótipo visual, como o irmão (que não tem testes automatizados): a verificação de cada tela é `pnpm lint` + `pnpm build` (tsc) verdes + checagem visual declarada. Só a lógica de domínio (Task 2) tem testes unitários (vitest).

## Review Focus

- **Perfil "cliente novo" (zero contratados):** dashboard e assinatura renderizam sem quebrar, tudo vira "Descobrir". → teste no store (Task 2) + checagem visual (Task 5/7).
- **`localStorage` ausente/ inválido ou bloqueado:** o provider cai no perfil padrão sem lançar. → teste no store (Task 2).
- **Contratar/cancelar reflete entre telas na sessão:** contratar na Loja aparece em Início e Assinatura; cancelar some. → teste no store (Task 2) + checagem visual (Task 6/7).
- **Trocar de perfil reconfigura o estado:** mudar o perfil ativo troca o conjunto contratado e persiste. → teste no store (Task 2).
- **"Abrir" (deep-link mock) e "saiba mais":** "Abrir" aponta para URL placeholder da vertical; "saiba mais" ancora na seção de preços sem sair da landing. → checagem visual (Task 3/5).

---

### Task 1: Scaffold do app + tema + esqueleto de rotas

**Files:**
- Create: `aura-echo/package.json`, `aura-echo/vite.config.ts`, `aura-echo/tsconfig*.json`, `aura-echo/components.json`, `aura-echo/index.html`, `aura-echo/.gitignore`
- Create: `aura-echo/src/main.tsx`, `aura-echo/src/App.tsx`, `aura-echo/src/index.css`, `aura-echo/src/lib/utils.ts`
- Create: `aura-echo/src/lib/theme.tsx` (ThemeProvider claro/escuro, espelho do Aura Fit)
- Create: `aura-echo/src/components/app-shell.tsx` (stub), `aura-echo/src/pages/landing.tsx` (stub), `aura-echo/src/pages/nao-encontrada.tsx`

**Interfaces:**
- Produces: `App` default export; `ThemeProvider`, `useTheme()`; `cn()` em `@/lib/utils`.

- [ ] **Step 1:** Scaffold Vite React-TS em `aura-echo/`, ajustar `package.json` (deps/versões do Global Constraints), `vite.config.ts` com `@vitejs/plugin-react`, `@tailwindcss/vite` e alias `@` → `src`. Criar `components.json` igual ao do Aura Fit (style `radix-nova`, registry affectUI).
- [ ] **Step 2:** `src/index.css`: importar Tailwind 4 e definir os tokens do tema "Aura mestre" (neutro) em `:root` e no modo escuro (`@media prefers-color-scheme` + override por `data-theme`), no vocabulário shadcn.
- [ ] **Step 3:** `src/App.tsx`: `ThemeProvider` + `HashRouter` com `#/` → `<Landing/>` (stub), `<Route element={<AppShell/>}>` com `#/app` → `Navigate` para `#/app/inicio` (placeholder), e rota curinga → `<NaoEncontrada/>`.
- [ ] **Step 4:** Rodar `pnpm install && pnpm lint && pnpm build`. Esperado: verdes, `dist/` gerado.
- [ ] **Step 5:** Checagem visual: `pnpm dev`, abrir `#/` (stub landing) e `#/app` (redireciona). Commit.

### Task 2: Domínio mock + store (serviços, perfis, assinaturas)

**Files:**
- Create: `aura-echo/src/lib/services.ts` (catálogo dos 4 serviços)
- Create: `aura-echo/src/lib/profiles.ts` (perfis de demo e conjuntos contratados)
- Create: `aura-echo/src/lib/store.tsx` (`ProfileProvider`, `useEcho`)
- Test: `aura-echo/src/lib/store.test.ts` (vitest)
- Modify: `aura-echo/package.json` (devDep `vitest`, script `test`), `aura-echo/vite.config.ts` (config de teste)

**Interfaces:**
- Produces:
  - `type Service = { id: ServiceId; nome: string; slug: string; tagline: string; descricao: string; precoMensal: number; url: string; icon: LucideIcon }`
  - `SERVICES: Service[]` (ids: `fit`, `barber`, `brand`, `vagas`)
  - `type DemoProfile = { id: string; nome: string; email: string; contratados: ServiceId[] }`
  - `PROFILES: DemoProfile[]` — `completo` (os 4), `parcial` (`fit`,`brand`), `novo` (`[]`)
  - `type Subscription = { serviceId: ServiceId; status: 'ativa' | 'cancelada'; desde: string; proximaCobranca: string }`
  - `useEcho(): { profile, setProfile(id), subscriptions: Subscription[], contratar(id), cancelar(id), isContratado(id) }`

- [ ] **Step 1: Teste que falha** — `store.test.ts`: (a) perfil padrão = `completo` quando `localStorage` vazio; (b) `setProfile('novo')` → `subscriptions` vazia e persiste a chave; (c) `contratar('barber')` no perfil `parcial` → `isContratado('barber')` true e status `ativa`; (d) `cancelar('fit')` → status `cancelada`; (e) `localStorage` que lança (mock) não quebra e cai no padrão.
- [ ] **Step 2:** Rodar `pnpm test`. Esperado: FAIL (módulos não existem).
- [ ] **Step 3:** Implementar `services.ts`, `profiles.ts` e `store.tsx` (`ProfileProvider` com `useState` + `localStorage` chave `aura-echo-profile`, derivando `subscriptions` do perfil + mutações de sessão), expondo `useEcho`. Espelhar o padrão de `prototype-v2/src/lib/role.tsx`.
- [ ] **Step 4:** Rodar `pnpm test`. Esperado: PASS. Depois `pnpm lint && pnpm build` verdes.
- [ ] **Step 5:** Commit.

### Task 3: Landing pública (`#/`)

**Files:**
- Modify: `aura-echo/src/pages/landing.tsx`
- Create: `aura-echo/src/components/landing/` (hero, grade-servicos, precos, rodape) conforme necessário
- Modify: `aura-echo/src/App.tsx` (rota já existe)

**Interfaces:**
- Consumes: `SERVICES` (Task 2). Produces: `Landing`.

- [ ] **Step 1:** Construir seções: hero do ecossistema; grade dos 4 serviços (cards com ícone, nome, tagline, "saiba mais" que ancora na seção de preços); preços por serviço (card por serviço com `precoMensal`); CTA "Entrar"/"Criar conta" (links `#/entrar`, `#/criar-conta`); rodapé. Usar componentes shadcn/affectUI.
- [ ] **Step 2:** `pnpm lint && pnpm build` verdes.
- [ ] **Step 3:** Checagem visual em `#/`: 4 serviços, "saiba mais" rola até preços, CTAs navegam. Commit.

### Task 4: Auth cosmético + AppShell do portal

**Files:**
- Create: `aura-echo/src/pages/entrar.tsx` (Entrar + Criar conta)
- Modify: `aura-echo/src/components/app-shell.tsx` (sidebar + barra mobile + menu do usuário)
- Create: `aura-echo/src/lib/nav.ts` (destinos do portal)
- Modify: `aura-echo/src/App.tsx` (rotas `#/entrar`, `#/criar-conta`, e as filhas do `AppShell`)

**Interfaces:**
- Consumes: `useEcho`, `useTheme` (Tasks 1–2). Produces: `AppShell`, `NAV`, `pageTitle(path)`.

- [ ] **Step 1:** `entrar.tsx`: páginas cosméticas (sem validação real) que levam a `#/app/inicio`.
- [ ] **Step 2:** `nav.ts`: `NAV = [Início → /app/inicio, Loja → /app/loja]`. `AppShell`: menu lateral (≤5) + barra mobile com `NAV`; **menu do usuário** (rodapé) com o nome do perfil ativo, o **seletor de perfil de demo** (`PROFILES` → `setProfile`), e os itens Minha assinatura (`/app/assinatura`), Conta (`/app/conta`) e Sair (`#/`). `<Outlet/>` para as filhas.
- [ ] **Step 3:** `App.tsx`: registrar rotas filhas (inicio, loja, loja/:slug, assinatura, conta) apontando para stubs temporários.
- [ ] **Step 4:** `pnpm lint && pnpm build` verdes.
- [ ] **Step 5:** Checagem visual: trocar de perfil no menu do usuário muda o nome e (nas próximas telas) o conteúdo. Commit.

### Task 5: Portal — Início / dashboard (`#/app/inicio`)

**Files:**
- Create: `aura-echo/src/pages/inicio.tsx`
- Create: `aura-echo/src/components/service-card.tsx` (cartão reutilizável: contratado vs descobrir)

**Interfaces:**
- Consumes: `useEcho`, `SERVICES`. Produces: `Inicio`, `ServiceCard`.

- [ ] **Step 1:** Dashboard: seção "Meus serviços" (cards dos contratados com status + botão **Abrir** → `service.url` em nova aba) e seção **Descobrir** (cards dos não contratados com preço + "Contratar" → leva à Loja). Zero-state (perfil `novo`): sem "Meus serviços", Descobrir com os 4.
- [ ] **Step 2:** `pnpm lint && pnpm build` verdes.
- [ ] **Step 3:** Checagem visual nos 3 perfis (completo/parcial/novo). Commit.

### Task 6: Portal — Loja + detalhe do serviço (`#/app/loja`, `#/app/loja/:slug`)

**Files:**
- Create: `aura-echo/src/pages/loja.tsx`, `aura-echo/src/pages/servico-detalhe.tsx`

**Interfaces:**
- Consumes: `useEcho`, `SERVICES`, `ServiceCard`. Produces: `Loja`, `ServicoDetalhe`.

- [ ] **Step 1:** `Loja`: catálogo dos 4 serviços (preço, estado contratado/não), com fluxo mock de contratação (`contratar(id)` + toast `sonner`). `ServicoDetalhe`: resumo do serviço; se contratado, mostra plano/desde/próxima cobrança e **Abrir**; se não, **Contratar**.
- [ ] **Step 2:** `pnpm lint && pnpm build` verdes.
- [ ] **Step 3:** Checagem visual: contratar na Loja atualiza o cartão e reflete no Início. Commit.

### Task 7: Portal — Minha assinatura (`#/app/assinatura`)

**Files:**
- Create: `aura-echo/src/pages/assinatura.tsx`

**Interfaces:**
- Consumes: `useEcho`, `SERVICES`. Produces: `Assinatura`.

- [ ] **Step 1:** Lista por serviço contratado (status, desde, próxima cobrança, valor), total mensal mock, ação **Cancelar** (`cancelar(id)` + toast) e, para não contratados, **Contratar**. Estado vazio para perfil `novo`.
- [ ] **Step 2:** `pnpm lint && pnpm build` verdes.
- [ ] **Step 3:** Checagem visual: cancelar some de "Meus serviços"; total recalcula. Commit.

### Task 8: Portal — Conta + aparência (`#/app/conta`)

**Files:**
- Create: `aura-echo/src/pages/conta.tsx`

**Interfaces:**
- Consumes: `useEcho`, `useTheme`. Produces: `Conta`.

- [ ] **Step 1:** Dados do usuário (nome/e-mail do perfil ativo, read-only mock) e **Aparência** (claro/escuro/sistema via `useTheme`).
- [ ] **Step 2:** `pnpm lint && pnpm build` verdes.
- [ ] **Step 3:** Checagem visual: trocar tema persiste; dados batem com o perfil ativo. Commit. Atualizar o `README.md` do `aura-echo/` com rotas e como rodar.
