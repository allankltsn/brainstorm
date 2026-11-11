# brainstorm

- `aura-landing/` — landing page (sem alterações)
- `prototype-v2/` — protótipo navegável (sem alterações)
- `init/` — host React (micro-frontend): `/` abre a landing; "Começar grátis" leva a `/login` (protótipo)

```bash
cd init && npm install && npm run build   # compila os dois apps e o host em init/dist
npm run dev                               # host em desenvolvimento (rode `npm run apps` antes)
```

Deploy automático no GitHub Pages a cada push na `main` (`.github/workflows/pages.yml`).
