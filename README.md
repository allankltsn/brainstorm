# brainstorm

- `aura-landing/` — landing page (sem alterações)
- `prototype-v2/` — protótipo navegável (sem alterações)
- `aura-brand/` — protótipo do aura-brand (sem alterações; vem da branch `prototipo_crm`)
- `init/` — host React (micro-frontend): `/` abre a landing; "Começar grátis" e a seção Entrar da landing levam a `/login` (protótipo, único login); `/brand` abre o aura-brand
- `scripts/sync.sh` + `scripts/sync.conf` — copiam pastas de outras branches para a `main` (`<pasta> <branch>` por linha; `PUSH=0` só faz o commit local; `init/` é protegido)

```bash
cd init && npm ci && npm run build        # compila os três apps e o host em init/dist
npm run dev                               # host em desenvolvimento (rode `npm run apps` antes)
```

Notas de build:

- `npm run apps` instala as dependências de cada app a partir do lockfile (sempre, sem reaproveitar `node_modules`) e compila. A `aura-landing` usa **pnpm**, chamado por `npx --yes pnpm@10.34.9` (versão fixa em `init/scripts/build-apps.mjs`): precisa de rede na primeira vez. `prototype-v2` e `aura-brand` usam npm.
- O app do aura-brand é copiado para `init/public/brand-app`; o host gera `dist/login/index.html` e `dist/brand/index.html` (cópias do `index.html`) para `/login` e `/brand` responderem HTTP 200. O `404.html` segue como fallback para outros caminhos.
- `VITE_DEMO=true` liga os atalhos de demonstração do protótipo ("Preencher com a conta de teste", link simulado do e-mail, nota "Use 000000") e a checagem da conta de teste no login. O workflow do Pages liga a flag porque o site publicado é a demonstração; sem ela (build local padrão) esses atalhos não aparecem.

Deploy automático no GitHub Pages a cada push na `main` (`.github/workflows/pages.yml`).
