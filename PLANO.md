# aura-ui — Planejamento

20/11/2026 · status: rascunho para decisão · v2 (com leitura completa das referências)

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

Docs lidas em 20/11/2026: shadcndesign.com/docs (DS Manager, Figma kit, registry), affectui.com/docs (instalação, theming, agent skills) e aura.build (DESIGN.md e learn).

### 3.1 shadcn/ui (base de tudo)

Código copiado para o projeto (o dono é o app), `cva` para variantes, `data-slot`, Radix por baixo, `components.json` e registry. Os 8 *styles* oficiais (Nova, Vega, Mira, Luma, Sera, Maia, Rhea, Lyra) mudam estrutura e densidade; nossos apps usam `radix-nova`.

### 3.2 shadcndesign (DS Manager + Figma kit + Pro Blocks)

| O que eles fazem | O que adotamos |
| --- | --- |
| **Três eixos independentes:** *style* (estrutura/densidade) × *theme* (cores, fontes, raio) × *mode* (claro/escuro). O modo não guarda cor: só escolhe entre `light/*` e `dark/*` do tema. | Mesmo modelo nos nossos tokens (seção 4.3). |
| **Cor em cadeia:** componente → token de componente (`component/input/bg`) → token semântico shadcn → par `color/light|dark/*` → paleta Tailwind. Tons derivados (`primary-muted` = primary a 5%, `primary-hover`, `selected-wash`) são *alias com opacidade*, não cores salvas. | Derivar `brand-soft`, `brand-text`, hover etc. com `color-mix()` a partir de `--primary`: trocar a marca passa a ser trocar **uma** cor. |
| **Base color** (Neutral, Stone, Zinc, Mauve, Olive, Mist, Taupe) semeia todos os neutros; overrides ficam marcados. | Tema = rampa neutra + cor primária + overrides explícitos. |
| **Fontes em 3 slots:** `--font-sans` (corpo), `--font-heading` (pode ser "igual ao corpo"), `--font-mono`. | Adotar os 3 slots (hoje só temos sans/heading). |
| **Raio:** `--radius` base com passos `sm…4xl` multiplicados (×0.6, ×0.8, ×1, ×1.4, ×1.8, ×2.2, ×2.6); presets None 0 / Small 0.45 / Medium 0.625 / Large 0.875rem. | Já usamos a mesma escala; adicionar os presets. |
| **Espaçamento:** `--spacing` (padrão 0.25rem) controla toda a densidade no Tailwind 4. **Sombra:** semente (cor/opacidade) gera a rampa de elevação. | Expor `--spacing` e uma rampa de sombra própria no tema. |
| **Variantes** viram chaves reais do `cva` (`variant="brand"`), com estados hover, foco, pressionado, desabilitado. | Variante `brand` e estados documentados por componente. |
| **Marca:** slots de SVG logo, *mark* e favicon, com versão escura (ou fallback em `currentColor`), publicados com um componente `<Logo>`. | Item `@aura/logo` + assets por tema. |
| **Publicação:** registry versionado (v1, v2…), instalação com `shadcn init --preset <registry> --force --no-reinstall` (tokens + todos os componentes) e blocos por nome (`shadcn add @acme/hero-section-1`). Só tokens: comando "Install style" que escreve o `globals.css`. | Mesmo fluxo: um item `@aura/theme-<marca>` (só tokens), um preset completo e itens avulsos. |
| **Pro Blocks (437):** Landing (226: hero, features, bento, pricing, FAQ, CTA, logos, stats, testimonials, footer, navbar, 404…), Application UI (117: app shells, page headers, settings, sign in/up, tables, dialogs, empty…), E-commerce (65) e **AI (29: agents, chats, composers, generation, workspace)**. | Usar como checklist de categorias dos nossos blocos (seção 5). |
| **Figma kit** com variáveis espelhando o CSS (coleções Tailwind / Style / Mode) e plugin Figma → código. | Fica para a fase 6; nossos tokens já nascem com nomes compatíveis. |
| **MCP server, Agent Skills e "lint locks"** para agentes gerarem código no padrão. | Ver 4.5. |

### 3.3 affectUI

| O que eles fazem | O que adotamos |
| --- | --- |
| Um arquivo `.tsx` por item, **sem Tailwind e sem dependências**, estilos dentro do componente. | **Não** seguimos isso (somos Tailwind + Radix), mas copiamos a ideia de cada item ser autossuficiente. |
| **36 tokens `--aui-*`** com papéis claros: `font`, `font-mono`, `radius`/`-sm`/`-lg`, `ink`, `muted`, `placeholder`, `surface`, `subtle`, `overlay`, `border`/`-strong`, `primary`/`on-primary`, `focus` (mín. 3:1), `danger/warning/success/info` + `-soft`, cores de categoria (blue, green, amber, orange, red, pink, purple, teal, cyan), `shadow-card`, `shadow-popover`, `ease`. | Acrescentar ao nosso contrato o que falta: `placeholder`, `overlay`, `danger-soft`, cores de categoria, `shadow-card/popover`, `ease`. A ponte `--aui-*` passa a ser gerada pelo tema. |
| Variáveis próprias por componente com prefixo curto (`--ui-cc-*` no Chat Composer) para ajuste fino sem clash. | Componentes complexos expõem `--aura-<sigla>-*`. |
| Um "theme file" com todos os tokens comentados, instalável pelo CLI (`affectui-theme.json`). | Item `@aura/theme` com o mesmo formato. |
| Registry público + **itens Pro com token** no header (`Authorization: Bearer ${TOKEN}` no `components.json`). | Útil se um dia o kit tiver itens privados. |
| **Agent skill** instalável pelo CLI em `.claude/skills` (SKILL.md, checklist, INSTRUCTIONS.md para AGENTS.md/CLAUDE.md, exemplos, catálogo gerado do registry) com comandos `reveal`, `review`, `apply`, `theme`. | Ver 4.5 — é o que mais combina com o nosso jeito de trabalhar. |
| Catálogo forte de **IA/agentes** (Approval Card, Thinking State, Tool Call Card, Trace Waterfall, Context Window, Model Picker, Decision Inbox…), teclado, foco e `reduced-motion` documentados. | Nossa categoria `ai/`. |

### 3.4 Aura (aura.build) — modelos de design (DESIGN.md)

O aura.build é um gerador de landing pages por IA. Os "modelos de design" dele são **arquivos DESIGN.md** (725 públicos hoje), cada um com:

- **frontmatter de tokens:** `colors` (primary, secondary, accent, background, surface, text-primary, text-secondary, border), `typography` (`display-lg`, `body-md`, `label-md` com fonte/tamanho/peso), `spacing` (base 8px, gap 16, card-padding 24, section-padding 80), `rounded` (card, control, pill) e `components` (card, button);
- **regras em texto** por seção: Composition, Colors, Typography, Layout, Components, Motion, WebGL & Effects e **Guardrails** ("não achatar em grade genérica de cards", "manter botões, cards e badges no mesmo raio e borda");
- um **HTML de referência** (Tailwind) que é a "fonte da verdade" visual.

Visual típico dos modelos: tema escuro, Inter + mono (JetBrains Mono) para rótulos técnicos, display grande (64px), muito respiro (seções de 80px), efeitos de fundo (WebGL, partículas, gradientes, *dither*) sempre atrás do conteúdo, movimento contido (reveal com máscara, entrada escalonada, hover lift).

O que adotamos:

- **Cada tema do aura-ui gera um `DESIGN.md`** a partir dos tokens, no mesmo formato. Assim o tema serve ao mesmo tempo como CSS (para o código) e como contexto de prompt (para Claude, v0, o próprio aura.build).
- Os **guardrails** viram regras da nossa agent skill.
- A linguagem visual dos modelos inspira os **blocos de landing e os efeitos** (`motion/`, `effects/`). Os modelos são de autores terceiros: usamos como referência, sem copiar HTML.

### 3.5 Apps do Aura neste repositório (`prototype-v2`, `aura-brand`, `aura-landing`)

Tokens, tema claro/escuro, a assistente "Aura" (glow cloud, thinking loader), padrões de app (shell com sidebar, command palette, fila "Precisa de você", estados vazios, charts) e seções de landing. São a base de código que vamos consolidar.

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

Três formas de instalar, como no shadcndesign:

| Comando | Instala |
| --- | --- |
| `npx shadcn add @aura/theme-aura-brand` | só os tokens daquele tema no `globals.css` |
| `npx shadcn init --preset <url>/r/aura-brand.json --force --no-reinstall` | tema + todos os primitivos (projeto novo ou existente) |
| `npx shadcn add @aura/hero-01 @aura/approval-card` | itens avulsos e blocos |

Alternativa (fase posterior, se fizer falta): publicar só `@aura/tokens` no npm para apps que não usam o CLI.

### 4.2 Estrutura do repositório (monorepo pnpm)

```
aura-ui/
├─ packages/
│  ├─ tokens/            # fonte única: tokens.json -> CSS, TS, DESIGN.md e, no futuro, Figma
│  │  ├─ src/tokens.json
│  │  ├─ src/themes/     # aura-fit (vermelho), aura-brand (roxo), neutral ...
│  │  └─ build.ts        # gera por tema: theme.css, tokens.ts, DESIGN.md, ponte --aui-*
│  ├─ skill/             # agent skill: SKILL.md, checklist, INSTRUCTIONS.md, catálogo gerado
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

### 4.3 Tokens: três eixos e quatro camadas

Três eixos independentes (modelo do shadcndesign):

- **Style** — estrutura e densidade (`radix-nova` hoje; `--spacing`, alturas de controle).
- **Tema** — cores, fontes, raio, sombra, movimento. Um por marca.
- **Modo** — claro/escuro. Não guarda cor: só escolhe o lado `light` ou `dark` do tema.

Quatro camadas, cada uma só aponta para a de baixo:

1. **Primitivos** — paleta Tailwind + rampas da marca (`purple-50…950`, `red-50…950`), espaçamento, sombras, durações e curvas.
2. **Tema** — pares `light/dark` de cada token semântico apontando para primitivos; rampa neutra escolhida (zinc hoje).
3. **Semânticos** (o contrato, padrão shadcn + extensões do Aura e do affectUI):
   - cores: `background`, `foreground`, `card`, `popover`, `overlay`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, `placeholder`, `destructive`, `success|warning|info` (+ `-soft`), `brand-soft`, `brand-text`, `chart-1…5`, `sidebar-*`, cores de categoria;
   - fontes: `--font-sans`, `--font-heading`, `--font-mono`; escala `display-lg`, `heading-*`, `body-md`, `label-md`;
   - forma: `--radius` (+ `sm…4xl`), `--spacing`, `--shadow-card`, `--shadow-popover`;
   - movimento: `--ease-out`, `--duration-fast|base|slow`.
4. **Tokens de componente** (só quando precisar): `--aura-<sigla>-*` na raiz do componente.

Tons derivados não são salvos, são calculados: `brand-soft = color-mix(in oklch, var(--primary) 8%, var(--background))`, hover, `selected-wash` etc. Trocar a primária recolore tudo.

Uso no app:

```css
@import "@aura/tokens/themes/aura-brand.css";  /* ou aura-fit.css */
```

O build de cada tema gera:

- `theme.css` — `:root`, `.dark` e `@theme inline` para o Tailwind 4;
- `aui-bridge.css` — os `--aui-*` apontando para os nossos tokens (affectUI continua funcionando);
- `tokens.ts` — valores para gráficos (Recharts) e canvas;
- `DESIGN.md` — no formato do aura.build (frontmatter + regras + guardrails), para usar como contexto de prompt.

Regras:
- componente nunca usa hex nem cor primitiva, só token semântico;
- trocar de marca = trocar um import;
- todo par texto/fundo é verificado em WCAG AA no build e o anel de foco em 3:1 (falha o CI se cair).

### 4.4 Convenções de componente

- Um arquivo por componente, `cva` para variantes, `cn()` para classes, `data-slot` em cada parte.
- Primitivos interativos em cima de `radix-ui`; ícones `lucide-react`; animação `motion` sempre respeitando `prefers-reduced-motion`.
- Props e nomes em inglês (código); textos de exemplo e documentação em português.
- Tamanhos `sm | md | lg`; variantes `default | secondary | outline | ghost | destructive | brand`.
- Cada item tem: exemplo, estados (hover, foco, pressionado, desabilitado, erro, carregando), teste de acessibilidade e entrada no `registry.json`.
- Logo: item `@aura/logo` com slots logo / mark / favicon, versão escura ou fallback em `currentColor`.

### 4.5 Feito para agentes

O kit vai ser usado sobretudo com Claude Code, então ele já nasce com:

- **Agent skill** `@aura/skill`, instalada pelo CLI em `.claude/skills/aura-ui/` (modelo do affectUI): `SKILL.md` (qual item usar onde, como ligar a dados, como aplicar tema), `checklist.md` (revisão antes de concluir), `INSTRUCTIONS.md` (regras curtas para `CLAUDE.md`/`AGENTS.md`) e `catalog.md` **gerado do registry** (props nunca desatualizadas). Comandos: `review`, `apply`, `theme`.
- **DESIGN.md por tema** (formato aura.build), com os guardrails do kit: nada de hex solto, mesmo raio e borda em botões/cards/badges, efeitos sempre atrás do conteúdo, `reduced-motion` respeitado.
- **Lint** (oxlint + regra própria) que bloqueia cor fixa e classe de cor primitiva fora de `packages/tokens`.
- (Fase 6) servidor MCP com busca no catálogo.

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

**IA — a completar com o catálogo do affectUI** (reescritos no nosso padrão): approval-card, thinking-state, tool-call-card, chat-composer, ai-answer (com citações), model-picker, context-window, permission-request, agent-trail.

**Efeitos (`effects/`)** — inspirados nos modelos do aura.build: gradient mesh, grid/dot pattern, partículas, *dither*, glow; sempre como camada de fundo, com fallback estático em `reduced-motion`.

**Blocos** (categorias tiradas dos Pro Blocks do shadcndesign, só as que usamos)
- App: app-shell (sidebar + topbar), command-palette, page-header, section-header, filter-bar, kpi-row, settings, table-header, empty-section, dialog, notification-stack, profile-menu, progress-tracker, empty-calendar.
- Landing: navbar, hero, logo-marquee, features, bento, demo, stats/roi, testimonials, pricing, comparison, faq, cta, footer, 404, coming-soon.
- Auth: sign-in, sign-up, código por e-mail (OTP), recuperar senha.
- IA: agents, chats, composers, workspace.

**Telas (exemplos completos)** — dashboard, inbox/conversas, kanban (funil), configurações, onboarding.

## 6. Roteiro

| Fase | Entrega | Pronto quando |
| --- | --- | --- |
| **0. Base** (1 semana) | Monorepo pnpm, TypeScript, oxlint, CI, `apps/docs` vazio publicado no Pages | CI verde e site no ar |
| **1. Tokens** (1 semana) | `packages/tokens` com tokens.json, build para CSS + ponte `--aui-*` + `tokens.ts` + `DESIGN.md`, temas aura-fit e aura-brand, checagem de contraste, página "Cores/Tipografia/Raio" e seletor de tema na doc | trocar o import troca a marca em toda a doc |
| **1b. Skill** (2 dias) | `packages/skill` com SKILL.md, INSTRUCTIONS.md, checklist e catálogo gerado | `npx shadcn add @aura/skill` instala em `.claude/skills` |
| **2. Primitivos** ✅ | Os primitivos shadcn consolidados de `prototype-v2`/`aura-brand`, com exemplos e testes | `npx shadcn add @aura/<item>` funciona num app novo |
| **3. IA + charts + motion** ✅ | Itens de IA/Charts/Motion + affectUI reescrito no padrão aura-ui | nenhum app precisa mais do registry `@affectui` para o que está na v1 |
| **3.5 Paridade affectUI** (fase atual) | Implementar no padrão aura-ui (shadcn/Tailwind) TODOS os ~90 componentes do catálogo affectUI (affectui.com/components, 134 itens) que ainda faltam no kit — inclusive os Pro (reescritos, não redistribuídos; ver §8.5). Em levas: primitivos padrão → IA/chat → orquestração de agentes. | o kit tem paridade com o catálogo affectUI (134 itens cobertos), todos instaláveis e testados |
| **4. Blocos e telas** (2–3 semanas) | Blocos de app, landing e auth; 3 telas de exemplo | landing e um app montados só com blocos do kit |
| **5. Migração** (contínua) | `aura-brand`, `prototype-v2` e `aura-landing` passam a instalar do registry; remover as cópias | cada app sem pastas `affect/`, `magicui/`, `lightswind/` próprias |
| **6. Extras** (depois da v1) | Servidor MCP do kit, `@aura/tokens` no npm, variáveis no Figma espelhando os tokens (coleções Primitivos / Tema / Modo, como o kit do shadcndesign), editor visual de tema na doc, novos temas | — |

## 7. Qualidade

- **Acessibilidade:** teclado e foco em todo interativo; `axe` nos testes; contraste AA verificado nos temas; `prefers-reduced-motion`.
- **Testes:** Vitest + Testing Library por componente; Playwright para screenshots da doc em 390, 768 e 1440 px, claro e escuro.
- **Versão:** semver no registry (changelog por item); `shadcn diff` para os apps verem o que mudou.
- **Licenças:** shadcn/ui, Radix, magicui e Lightswind são MIT; affectUI tem itens grátis (MIT) e Pro (pagos). **Itens Pro do affectUI não podem ser redistribuídos no nosso registry** — ou reescrevemos, ou ficam fora do aura-ui. Pro Blocks do shadcndesign e modelos do aura.build também são de terceiros: servem de referência de categorias e estilo, sem copiar código ou HTML.

## 8. Decisões (fechadas em 20/11/2026)

1. **Nome do escopo do registry:** **`@aura`**. Mesmo modelo do `@affectui` já usado no `components.json` do aura-brand.
2. **Repositório:** **manter na branch `aura-ui` do `brainstorm`** por ora; reavaliar mover para repo próprio só na Fase 5, quando os apps passarem a consumir o registry. (A Fase 0 já publica assim, sem interferir nos outros apps — ver §4.2 revisada e `docs/superpowers/specs/2026-11-20-aura-ui-phase0-integration-design.md`.)
3. **Hospedagem do registry e da doc:** **GitHub Pages**, no mesmo site do micro-frontend, na rota `/ui` (registry em `/r/*.json`). Vercel descartado.
4. **Fontes:** **por tema, não unificar.** Adotar os 3 slots do shadcndesign (`--font-sans`, `--font-heading`, `--font-mono`); aura-fit/aura-brand com Geist, landing com Inter. Mono padrão do kit = **JetBrains Mono** (Geist Mono permitido por tema onde Geist já está carregado).
5. **Nível de dependência do affectUI:** **reescrever** os itens grátis que usamos no padrão aura-ui; a ponte `--aui-*` fica só como camada de compatibilidade temporária (removida na Fase 5). Itens Pro: fora do registry.
6. **Figma:** **depois (Fase 6).** Os tokens já nascem com nomes compatíveis; sem custo em adiar.
7. **Linguagem visual padrão:** **dupla.** Primitivos/apps no visual sóbrio, cor só em ações; blocos de landing no estilo aura.build (display grande, efeitos de fundo). **Modo base = ESCURO** (decisão de 20/11/2026): a doc abre no dark (`index.html` com `data-mode="dark"`, default do app em `dark`); claro continua disponível pelo seletor e os tokens cobrem os dois.

## 9. Próximos passos

1. ✅ Decisões da seção 8 fechadas (20/11/2026).
2. ✅ Fase 0: estrutura integrada ao micro-frontend e doc publicada em `/ui` (substitui o monorepo autônomo — ver §4.2 e design doc).
3. ▶ Fase 1 (em andamento): extrair os tokens de `aura-brand/src/index.css` e `prototype-v2/src/index.css` para a pasta de tokens do `aura-ui/`, gerar `theme.css` + ponte `--aui-*` + `tokens.ts` + `DESIGN.md` por tema (aura-fit, aura-brand), com checagem de contraste, e a página "Cores/Tipografia/Raio" com seletor de tema na doc.

> Nota de estrutura (Fase 1): como a §4.2 foi revisada para **não** usar monorepo autônomo, os tokens vivem numa subpasta do app (`aura-ui/tokens/`, fonte única) com um script de build Node que gera o CSS consumido pela doc. Sem workspaces pnpm; o app segue em npm (o host `init` roda `npm ci`).
