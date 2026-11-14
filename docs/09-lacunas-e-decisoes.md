# 9. Lacunas e decisões

## As 7 lacunas

Funções que **nenhuma das duas fontes cobre bem** (nem as ferramentas externas, nem o `guilda`). Cada uma tem opções e uma recomendação para decidirmos juntos.

| # | Lacuna | Por que importa |
|---|---|---|
| 1 | Analista financeiro de produto | Fase 0 depende de preço, unit economics, runway e ponto de equilíbrio |
| 2 | Especialista Cloudflare | DNS, WAF e cache protegem toda a borda |
| 3 | Backend específico da stack | Sem ele, os agentes aconselham MikroORM e AWS Lambda para um projeto Prisma e Kubernetes |
| 4 | Teto de custo e detecção de loop | Sem corte automático, uma sessão errante gasta sem limite |
| 5 | Defesa contra prompt injection | Agentes lêem issues, PRs, web e arquivos que qualquer pessoa pode escrever |
| 6 | Release manager | Notas de versão e coordenação de lançamento ficam sem dono |
| 7 | Enforcement técnico | As regras do `guilda` são texto; nada impede de fato |

### 1. Analista financeiro de produto

- **O que existe:** `startup-business-analyst` e `business-analytics` (wshobson), só lidos por descrição; o plugin `finance` da Anthropic é contabilidade (lançamentos, conciliações, fechamento); o `finops` do `guilda` é custo de nuvem.
- **Opções:** (a) testar o `startup-business-analyst` e medir se cobre preço e unit economics; (b) criar um papel `financeiro-produto` no molde do `guilda`, com modelo de receita, preço, custo de aquisição e retenção, runway e sensibilidade; (c) adiar e tratar a fase 0 só com mercado.
- **Recomendação:** (a) primeiro, como teste de uma tarde. Se não cobrir, (b).

### 2. Especialista Cloudflare

- **O que existe:** plugin oficial `cloudflare`, com foco em Workers, Durable Objects e Wrangler. O `ingress` do `guilda` é genérico.
- **Opções:** (a) criar o papel `cloudflare` no molde do `hosting`, cobrindo DNS e TTL, proxy, WAF, Turnstile, regras de cache e R2; (b) só usar o plugin e aceitar a falta de conhecimento em DNS e WAF.
- **Recomendação:** (a), pois DNS e WAF são onde um erro derruba tudo.

### 3. Backend específico da stack

- **O que existe:** `backend-developer`, `node-specialist` e `typescript-pro` (VoltAgent), genéricos; `postgres-pro` para o banco. O `backend` do `guilda` instalado nos projetos cita MikroORM.
- **Opções:** (a) criar um **perfil** `nestjs-prisma` no `guilda` (o `guilda` já tem o perfil `nestjs-mikroorm` como molde) em vez de um agente novo; (b) confiar em Context7 para versões e no agente genérico.
- **Recomendação:** (a). Perfil dá regras da stack sem inflar a lista de agentes.

### 4. Teto de custo e detecção de loop

- **O que existe:** `session-report` (Anthropic) mostra uso de tokens e eficiência de cache, mas **só reporta**.
- **Opções:** (a) hook que acumula o uso e corta ao passar do limite configurado; (b) limite de subagentes simultâneos e de tentativas por tarefa nas regras e no principal; (c) acompanhar manualmente.
- **Recomendação:** (a) e (b) juntos, como parte do enforcement.

### 5. Defesa contra prompt injection

- **O que existe:** nada nos dois.
- **Opções:** (a) regra e hook: conteúdo de fontes externas é marcado como dado e nunca executado como instrução; (b) permissões que impedem que um agente que leu conteúdo externo execute ações de produção sem aprovação; (c) revisão humana de qualquer ação sugerida por conteúdo externo.
- **Recomendação:** (a) e (b), com (c) como padrão para produção.

### 6. Release manager

- **O que existe:** Changesets em um dos pacotes; `commit-commands` (Anthropic) para commit e PR; `operating-kit` (wshobson) para revisão antes do envio e verificação de deploy.
- **Opções:** (a) papel `release` no `guilda` (changelog, versão, notas, coordenação, checklist); (b) só Changesets e `operating-kit`.
- **Recomendação:** (b) primeiro; (a) se faltar coordenação entre repositórios.

### 7. Enforcement técnico

- **O que existe:** `block-no-verify` (wshobson) e `hookify` (Anthropic) como ferramentas; o `guilda` só tem texto.
- **Opções:** escrever as regras (ver [do texto ao controle](05-seguranca-e-privacidade.md#do-texto-ao-controle-técnico)) em duas ondas: **primeiro as de maior dano** (negar `.env`, `rm -rf`, push em `main`, produção sem aprovação), **depois o resto**.
- **Recomendação:** começar já, antes de ligar mais plugins.

## Decisões em aberto

Estas só você pode tomar. Cada uma tem a minha recomendação.

| # | Decisão | Recomendação |
|---|---|---|
| 1 | O `guilda` é o núcleo e este planejamento é o roteiro da v3? | Sim |
| 2 | Regra "externo primeiro, guilda como reserva", com ADR de inversão? | Sim |
| 3 | Onde o trabalho acontece: A (branch do `guilda`) ou B (projeto que o consome)? | B primeiro, promover depois |
| 4 | Aprovar a stack padrão: React 19, Playwright no lugar de Cypress, Biome no back? | Sim |
| 5 | Atualizar os projetos do produto para o `guilda` 2.0? | Sim, com `--dry-run` primeiro |
| 6 | Nível de autonomia padrão (`manual`, `portoes`, `autonomo`)? | `portoes` |
| 7 | Rodar só dentro do Claude Code ou também automatizado (CI) com o Agent SDK? | Só Claude Code por ora (sua decisão anterior) |
| 8 | Tracker: arquivos no repositório, GitHub Issues ou Linear? | GitHub Projects (sua decisão anterior) |
| 9 | Este repositório fica público? | Decidir; hoje só há tecnologias e padrões, sem dados privados |
| 10 | Nome final do projeto | A definir |

Decisões já tomadas por você: stack baseada nos seus repositórios; hospedagem em Hostinger, Cloudflare e Vercel; GitHub Projects com boas práticas; autonomia padrão; só Claude Code; preferência por ferramentas externas.

Próximo: [Roteiro](10-roteiro.md).
