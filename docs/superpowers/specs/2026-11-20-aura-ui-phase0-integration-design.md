# aura-ui — Fase 0: integração ao micro-frontend (design curto)

2026-11-20 · status: para aprovação · escopo: Fase 0 do PLANO.md, adaptada à estrutura deste repositório

## Intenção e porquê

Começar a construir o UI kit **aura-ui** (ver `PLANO.md`), mas **hospedá-lo do jeito que este
repositório já publica os apps**: um host React (`init/`) que serve cada app numa rota do GitHub
Pages. O objetivo da Fase 0 é ter o aura-ui no ar numa rota própria, com build verde, sem mexer
nos apps existentes — a base sobre a qual as fases seguintes (tokens, primitivos, blocos) entram.

## Objetivos

- `aura-ui/` como pasta de topo (app Vite + React + TypeScript + oxlint), com um site de
  documentação **mínimo** (home "aura-ui", navegação vazia).
- Publicado em `https://allankltsn.github.io/brainstorm/ui` pela workflow de Pages existente.
- Nenhuma alteração de comportamento em `aura-landing` (`/`), `prototype-v2` (`/login`) e
  `aura-brand` (`/brand`).

## Não-objetivos (Fase 0)

- Tokens, componentes, registry, DESIGN.md, agent skill — são Fases 1+ do plano.
- Monorepo pnpm autônomo / repositório separado (**substituído** por esta integração).
- CI novo: a workflow `pages.yml` já existe e roda em push na `main` e em PRs; é reutilizada.

## Restrições (da estrutura do repo)

- **Versão única:** `aura-ui/package.json` tem que ter a mesma versão de `init/package.json`
  (hoje `0.1.1`), senão `init/scripts/build-apps.mjs` falha de propósito.
- `init/` é protegido pela sync e só vive na `main`: as edições do host têm que ser commitadas
  na `main`; só a pasta `aura-ui/` é sincronizada da branch pela `scripts/sync.sh`.
- Base do Vite do app precisa resolver sob `/<repo>/ui-app/` no Pages (seguir o padrão dos
  outros apps; usar base relativa + HashRouter evita depender do caminho).

## Decisão de abordagem

**Espelhar o precedente `/brand`** (app compilado → copiado para `init/public/<out>` → servido
por iframe numa rota). É a única abordagem coerente com o repo e a de menor interferência:
edições puramente **aditivas** em 3 arquivos do `init` + 1 linha na `sync.conf` + pasta nova.

Alternativas descartadas:
- *Monorepo pnpm autônomo (PLANO §4.2):* contraria "seguir a estrutura deste repo / publicar na
  main sem interferir nos outros".
- *Repositório separado:* idem; adiado para a Fase 6 (decisão §8.2 do plano, em aberto).
- *Integrar no build dos apps existentes:* mais acoplamento; o padrão iframe/rota isola melhor.

## O "como" decidido

Rota **`/ui`**, pasta de saída **`ui-app`** (decisão do usuário). Edições:

1. `aura-ui/` — app Vite+React+TS, oxlint, `package.json` versão `0.1.1`, home de documentação
   mínima. Base relativa (`base: './'`) + HashRouter para funcionar sob qualquer caminho.
2. `init/scripts/build-apps.mjs` — acrescentar `{ dir: 'aura-ui', out: 'ui-app' }` ao array `apps`
   (detecta pnpm pelo `pnpm-lock.yaml` automaticamente).
3. `init/src/App.jsx` — `export function Ui()` com `<iframe src={`${BASE}ui-app/index.html`} />`.
4. `init/src/main.jsx` — `import { Ui }`, rota `<Route path="/ui" element={<Ui />} />`, e `'/ui'`
   no `Set KNOWN` (para o redirecionamento do `404.html`).
5. `scripts/sync.conf` — linha `aura-ui aura-ui`.

"Pronto quando": build local de `init` passa (os 4 apps compilam, versões conferem) e a rota
`/ui` sobe no Pages.

## Fluxo até a main

Desenvolver e verificar na worktree `C:/dev/brainstorm-aura-ui` (branch `aura-ui`). Depois, pela
forma atual do repo (decisão do usuário): `scripts/sync.sh` copia a pasta `aura-ui/` para a `main`
e as edições do `init` são commitadas na `main`. **Nada é empurrado para a `main` sem o aval
explícito do usuário no momento.**

## Deixado para o builder

- Conteúdo visual exato da home mínima (seguir visual sóbrio atual dos apps; tokens vêm na Fase 1).
- Config exata do `vite.config` (base, plugin react) e do `tsconfig`/oxlint, seguindo os apps do repo.
