# aura-apply

Protótipo navegável do **Aura Apply** (mock de candidatura a vagas com IA).

- `aura-apply/` — app Vite + React + TS + Tailwind (shadcn/affect), `base: './'` e `HashRouter`
  (abre de qualquer pasta; servido pelo host `init/` em `/<repo>/apply-app/` no GitHub Pages).

Branch órfã, no padrão das demais telas (`aura-ui`, `aura-barber`): só a pasta do app.
A sincronização para a `main` é feita por `scripts/sync.sh aura-apply aura-apply`, e a rota
`/apply` é ligada no host `init/` diretamente na `main`.

> Dados do protótipo são **fictícios** (placeholder). Nenhum dado pessoal real é versionado
> aqui, porque o repositório `brainstorm` é público e publica no GitHub Pages.

```bash
cd aura-apply && npm ci && npm run build   # valida o protótipo
npm run dev                                # desenvolvimento
```
