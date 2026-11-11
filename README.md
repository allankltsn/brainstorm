# brainstorm

- `aura-landing/` — landing page (sem alterações)
- `prototype-v2/` — protótipo navegável (sem alterações)
- `aura-brand/` — protótipo do aura-brand (sem alterações; vem da branch `prototipo_crm`)
- `init/` — host React (micro-frontend): `/` abre a landing; "Começar grátis" leva a `/login` (protótipo); `/brand` abre o aura-brand

```bash
cd init && npm install && npm run build   # compila os três apps e o host em init/dist
npm run dev                               # host em desenvolvimento (rode `npm run apps` antes)
```

Deploy automático no GitHub Pages a cada push na `main` (`.github/workflows/pages.yml`).
