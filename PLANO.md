# aura-ui — Planejamento

20/11/2026 · status: rascunho para decisão

## 1. Objetivo

Criar um UI kit próprio, o **aura-ui**, para usar em todos os projetos (Aura Fit, Aura Brand, landing e os próximos), com:

- **uma fonte única de tokens** (cor, tipografia, raio, sombra, movimento), com temas de marca trocáveis;
- **componentes próprios**, instalados com o CLI do shadcn a partir de um registry nosso (`npx shadcn add @aura/button`), no mesmo modelo do shadcn/ui, do shadcndesign e do affectUI;
- **blocos e telas** prontos (seções de landing, padrões de app, padrões de IA);
- **um site de documentação** com preview, código e playground de tema.

Fora do escopo da v1: kit no Figma, pacote npm de componentes compilados, suporte a Vue/Svelte.

## 2. De onde partimos

Hoje o kit está **copiado três vezes** dentro do `brainstorm` (branch `main`):

| App | Tokens | Componentes | Observação |
| --- | --- | --- | --- |
| `prototype-v2` (Aura Fit) | shadcn, primária vermelha `#b1111b`, Geist | 21 `ui/` (shadcn radix-nova) + 25 `affect/` + Lightswind + 8 `charts/` | base do kit |
| `aura-brand` | os mesmos tokens, primária roxa `#6a0dad`, Geist | mesmas pastas, cópia de `prototype-v2` | já tem página `design-system.tsx` |
| `aura-landing` | nomes próprios (`--color-bg`, `--color-ink`...), tema escuro, Inter | magicui (14), Lightswind (2), `ui.tsx` | tokens fora do padrão shadcn |

O que já está bom e vamos manter:

- tokens semânticos do shadcn + extensões próprias (`brand-soft`, `brand-text`, `success/warning/info` e `-soft`);
- escala de raio derivada de `--radius`;
- a "ponte" `--aui-*` que faz o affectUI ler as mesmas cores;
- stack: React 19, Tailwind 4, `radix-ui`, `lucide-react`, `motion`, `recharts`, `sonner`, Vite 8, TypeScript, oxlint.

Problemas que o aura-ui resolve:

1. Corrigir um componente exige corrigir 2 ou 3 cópias.
2. A troca de marca é feita editando hex à mão em vários lugares (inclusive overrides do botão do affectUI, `.ui-button`, `.ui-glw`).
3. A landing usa outro vocabulário de tokens.
4. Componentes de terceiros (affectUI, magicui, Lightswind) entram sem padrão de API, nomes e acessibilidade comuns.
5. Não há documentação nem testes do kit.

## 3. Referências e o que tirar de cada uma

| Referência | O que adotar |
| --- | --- |
| **shadcn/ui** | Código copiado para o projeto (o dono é o app), `cva` para variantes, `data-slot`, Radix por baixo, `components.json` e registry. |
| **shadcndesign** | Separação entre *componentes*, *blocos* (seções inteiras) e *templates*; tokens pensados para espelhar no Figma depois. *Obs.: o site não abriu desta sessão (bloqueio de rede); vale reler a doc para conferir tokens e categorias de blocos.* |
| **affectUI** | Um arquivo `.tsx` por item, instalável pelo CLI do shadcn ou copiando; categorias Components / Screens / Blocks / Motion; foco em produto de IA (Approval Card, Thinking State, Tool Call Card); teclado, foco e `prefers-reduced-motion` documentados; servidor MCP para agentes. |
| **Modelos do Aura** (`prototype-v2`, `aura-brand`, `aura-landing`) | Tokens, tema claro/escuro, a assistente "Aura" (glow cloud, thinking loader), padrões de app (shell com sidebar, command palette, fila "Precisa de você", estados vazios, charts) e seções de landing. |

## 4. Arquitetura proposta

### 4.1 Distribuição: registry do shadcn (recomendado)

O app instala o código do componente, como no shadcn/ui e no affectUI:

```bash
npx shadcn add @aura/button @aura/approval-card
```

```jsonc
// components.json do app
"registries": { "@aura": "https://<usuario>.github.io/aura-ui/r/{name}.json" }
```

Por quê: é o modelo que já usamos (`@affectui` está no `components.json` do aura-brand), cada app pode ajustar o código localmente, não precisa publicar no npm nem versionar binários, e o CLI resolve dependências entre itens (`registryDependencies`).

Alternativa (fase posterior, se fizer falta): publicar só `@aura/tokens` no npm para apps que não usam o CLI.

### 4.2 Estrutura do repositório (monorepo pnpm)

```
aura-ui/
├─ packages/
│  ├─ tokens/            # fonte única: tokens.json -> CSS (tema), TS e, no futuro, Figma
│  │  ├─ src/tokens.json
│  │  ├─ src/themes/     # aura-fit (vermelho), aura-brand (roxo), neutral ...
│  │  └─ build.ts        # gera theme.css por tema + tokens.ts
│  └─ registry/          # o código-fonte dos itens instaláveis
│     ├─ ui/             # primitivos (button, input, dialog...)
│     ├─ ai/             # padrões de IA (approval-card, thinking-state...)
│     ├─ charts/
│     ├─ motion/
│     ├─ blocks/         # seções (hero, pricing, kpi-board...)
│     ├─ screens/        # telas inteiras (inbox, settings, login)
│     ├─ hooks/  lib/
│     └─ registry.json   # manifesto lido por `shadcn build`
├─ apps/
│  └─ docs/              # site de documentação (Vite + React), publica /r/*.json
├─ .github/workflows/    # CI (lint, typecheck, testes, build) e deploy no Pages
└─ PLANO.md
```

### 4.3 Tokens em três camadas

1. **Primitivos** — escalas brutas: `zinc-50…950`, `purple-50…950`, `red-50…950`, espaçamento, raios, sombras, durações e curvas.
2. **Semânticos** — o contrato que os componentes usam (padrão shadcn + extensões do Aura): `background`, `foreground`, `card`, `primary`, `muted`, `border`, `ring`, `destructive`, `brand-soft`, `brand-text`, `success|warning|info` (+ `-soft`), `chart-1…5`, `sidebar-*`, `radius`, `font-sans`, `font-heading`.
3. **Temas de marca** — cada marca define só a família de cor primária, fonte e raio; o build gera claro e escuro:

```css
@import "@aura/tokens/themes/aura-brand.css";  /* ou aura-fit.css */
```

Regras:
- componente nunca usa hex nem cor primitiva, só token semântico;
- trocar de marca = trocar um import;
- a ponte `--aui-*` vira parte do tema, para componentes vindos do affectUI continuarem funcionando durante a migração;
- todo par texto/fundo do tema é verificado em WCAG AA no build (falha o CI se cair).

### 4.4 Convenções de componente

- Um arquivo por componente, `cva` para variantes, `cn()` para classes, `data-slot` em cada parte.
- Primitivos interativos em cima de `radix-ui`; ícones `lucide-react`; animação `motion` sempre respeitando `prefers-reduced-motion`.
- Props e nomes em inglês (código); textos de exemplo e documentação em português.
- Tamanhos `sm | md | lg`; variantes `default | secondary | outline | ghost | destructive | brand`.
- Cada item tem: exemplo, estados (hover, foco, desabilitado, erro, carregando), teste de acessibilidade e entrada no `registry.json`.

## 5. Inventário inicial (v1)

Prioridade a partir do que os apps do Aura já usam.

**Fundação**
- Tokens + 2 temas (aura-fit, aura-brand), claro e escuro, Geist e Inter.
- `cn`, `use-mobile`, `theme-provider` (claro/escuro/sistema).

**Primitivos (`ui/`)** — já existem nos apps, precisam ser consolidados:
alert, avatar, badge, breadcrumb, button, card, chart, checkbox, dialog, dropdown-menu, input, label, otp-input, progress, scroll-area, segmented-control, select, separator, sheet, sidebar, skeleton, switch, table, tabs, tag-input, textarea, toast (sonner), tooltip.

Faltando para um kit completo: accordion, combobox, command, date-picker, popover, radio-group, slider, pagination, empty-state, spinner, kbd, number-input.

**IA (`ai/`)** — diferencial do Aura:
assistant-cloud (glow), thinking-loader, shimmer-loader, ai-prompt, smart-recommendation, decision-inbox ("Precisa de você"), change-summary, message-actions, comment-thread, tips-panel.

**Charts** — trend-chart, bars-chart, h-bars, mini-bars, sparkline, chart-card, stat-card.

**Motion** — number-ticker, text-reveal, shiny-text, blur-fade, marquee, border-beam, magic-card, dot-pattern, particles.

**Blocos**
- App: app-shell (sidebar + topbar), command-palette, page-header, filter-bar, kpi-row, notification-stack, profile-menu, progress-tracker, empty-calendar.
- Landing: hero, logo-marquee, features (bento), demo, roi/metrics, testimonials, pricing, faq, closing-cta, footer.
- Auth: login, cadastro, código por e-mail (OTP), recuperar senha.

**Telas (exemplos completos)** — dashboard, inbox/conversas, kanban (funil), configurações, onboarding.

## 6. Roteiro

| Fase | Entrega | Pronto quando |
| --- | --- | --- |
| **0. Base** (1 semana) | Monorepo pnpm, TypeScript, oxlint, CI, `apps/docs` vazio publicado no Pages | CI verde e site no ar |
| **1. Tokens** (1 semana) | `packages/tokens` com tokens.json, build para CSS, temas aura-fit e aura-brand, checagem de contraste, página "Cores/Tipografia/Raio" na doc | trocar o import troca a marca em toda a doc |
| **2. Primitivos** (2–3 semanas) | Os ~28 primitivos consolidados de `prototype-v2`/`aura-brand`, com exemplos e testes | `npx shadcn add @aura/<item>` funciona num app novo |
| **3. IA + charts + motion** (2 semanas) | Itens das seções 5 IA/Charts/Motion; reescrever os do affectUI/magicui que usamos no padrão aura-ui (ou manter com a ponte `--aui-*` onde a licença permitir) | nenhum app precisa mais do registry `@affectui` para o que está na v1 |
| **4. Blocos e telas** (2–3 semanas) | Blocos de app, landing e auth; 3 telas de exemplo | landing e um app montados só com blocos do kit |
| **5. Migração** (contínua) | `aura-brand`, `prototype-v2` e `aura-landing` passam a instalar do registry; remover as cópias | cada app sem pastas `affect/`, `magicui/`, `lightswind/` próprias |
| **6. Extras** (depois da v1) | Servidor MCP / "agent skill" do kit, `@aura/tokens` no npm, export de tokens para Figma (Tokens Studio), novos temas | — |

## 7. Qualidade

- **Acessibilidade:** teclado e foco em todo interativo; `axe` nos testes; contraste AA verificado nos temas; `prefers-reduced-motion`.
- **Testes:** Vitest + Testing Library por componente; Playwright para screenshots da doc em 390, 768 e 1440 px, claro e escuro.
- **Versão:** semver no registry (changelog por item); `shadcn diff` para os apps verem o que mudou.
- **Licenças:** shadcn/ui, Radix, magicui e Lightswind são MIT; affectUI tem itens grátis (MIT) e Pro (pagos). **Itens Pro do affectUI não podem ser redistribuídos no nosso registry** — ou reescrevemos, ou ficam fora do aura-ui.

## 8. Decisões em aberto

1. **Nome do escopo do registry:** `@aura` (sugerido) ou outro.
2. **Repositório:** manter na branch `aura-ui` do `brainstorm` (sugerido para começar) ou mover para um repositório próprio quando estabilizar.
3. **Hospedagem do registry e da doc:** GitHub Pages (sugerido) ou Vercel.
4. **Fonte padrão:** Geist (apps) e Inter (landing) — unificar em uma ou deixar por tema?
5. **Nível de dependência do affectUI:** reescrever tudo (independência e licença limpa) ou manter os itens grátis através da ponte `--aui-*`.
6. **Figma:** entra no escopo (como o shadcndesign) ou fica para depois?

## 9. Próximos passos

1. Responder as decisões da seção 8.
2. Fase 0: criar o monorepo nesta branch e publicar a doc vazia.
3. Fase 1: extrair os tokens de `aura-brand/src/index.css` e `prototype-v2/src/index.css` para `packages/tokens`.
