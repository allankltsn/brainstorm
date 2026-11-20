# aura-ui

UI kit próprio do Aura. Planejamento completo em [`../PLANO.md`](../PLANO.md).

Esta pasta é um app Vite + React + TypeScript (site de documentação do kit). Segue a estrutura
micro-frontend deste repositório: é compilada pelo host `init/` e publicada no GitHub Pages na
rota **`/ui`** (`https://allankltsn.github.io/brainstorm/ui`).

## Desenvolvimento

```bash
cd aura-ui
npm ci        # (ou npm install na primeira vez)
npm run dev   # servidor local
npm run build # tsc -b && vite build -> dist/
npm run lint  # oxlint
```

## Integração (host init)

O host `init/` compila cada app e copia o `dist/` para `init/public/<out>`. O aura-ui usa
`out: ui-app` e é servido por iframe na rota `/ui`. Ver
[`docs/superpowers/specs/2026-11-20-aura-ui-phase0-integration-design.md`](../docs/superpowers/specs/2026-11-20-aura-ui-phase0-integration-design.md).

## Versão única

A versão (`0.1.1`) tem que bater com `init/package.json`; o build de `init` falha de propósito se
divergir. Ao mudar a versão, alinhe todos os `package.json` juntos (ver README da raiz).

## Estado

Fase 0 — shell mínimo. Tokens (Fase 1), primitivos (Fase 2) e demais fases entram depois.
