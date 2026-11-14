# Decisões aplicadas na v1

Cada decisão pendente da [documentação](../../docs/09-lacunas-e-decisoes.md) foi resolvida com os critérios que você já tinha dado. A coluna "Base" cita de onde veio a decisão. O que não dava para derivar das suas instruções ficou **em aberto**, listado no fim.

## Decisões

| # | Decisão | Resolução na v1 | Base | Onde está |
|---|---|---|---|---|
| D1 | O `guilda` é o núcleo? | Sim. A v1 não reimplementa nada: é montada e instalada pelo motor do `guilda` | "Faça uma versão com a última referência usando o guilda" | `scripts/guilda_v1.py` |
| D2 | Externo primeiro, `guilda` como reserva | Sim, como perfil opcional `external-first`. Selecionar o perfil é a "decisão registrada" que o `guilda` exige para um agente de catálogo ocupar o lugar de um papel canônico | "Prefiro usar os agentes das outras ferramentas; se não existirem e no guilda sim, use ela" | `overlay/core/workflow/external-first.md`, `overlay/integrations/plugins/resolution.json` |
| D3 | Onde o trabalho acontece | Opção B: sobreposição que consome o `guilda` sem alterá-lo, para promover depois o que funcionar | Recomendação da documentação; você pediu "em outra pasta" | `overlay/` |
| D4 | Stack padrão | Perfil `nestjs-prisma` (TypeScript, Node 22+, pnpm, NestJS, Prisma, PostgreSQL, Redis, Zod, `jose`, Biome, Vitest), em conflito declarado com `nestjs-mikroorm` | "Stack com base em todos os repositórios aura" | `overlay/profiles/nestjs-prisma.json` |
| D5 | Hospedagem | Perfil `edge-cloudflare-vercel`, combinado com o `vps-k3s` do `guilda`; papel `cloudflare` novo | "Estruture para Hostinger, Cloudflare e Vercel" | `overlay/profiles/edge-cloudflare-vercel.json`, `overlay/core/roles/cloudflare.md` |
| D6 | Rastreador | GitHub Projects, com os perfis `github-projects` e `polyrepo` do `guilda` no conjunto padrão. As fases de descoberta viram épicos `[D-N]` no mesmo quadro | "GitHub Project (siga as melhores práticas)" | `PERFIS` em `scripts/guilda_v1.py`, `overlay/core/workflow/product-discovery.md` |
| D7 | Autonomia | Padrão: autonomia dentro da fase, parada em cada portão humano, produção sempre com aprovação explícita. No `guilda` isso é o contrato dos gates e do estado `accepted`, sem chave de configuração | "Padrão" | `overlay/core/workflow/product-discovery.md` |
| D8 | Ferramentas suportadas | Só Claude Code: a instalação usa `--providers claude` e não gera `.codex/` nem `AGENTS.md` | "Apenas Claude" | `instalar` em `scripts/guilda_v1.py` |

## Lacunas criadas

Seguindo "as pendentes, crie elas e me liste quais foram".

| # | Lacuna | Como foi criada | Forma no `guilda` |
|---|---|---|---|
| L1 | Analista financeiro de produto | Papel `product-finance`, ação `/finance`, template `financial-model.md` | papel, ação, template |
| L2 | Especialista Cloudflare | Papel `cloudflare`, ação `/cloudflare` | papel, ação |
| L3 | Backend específico da stack | Perfil `nestjs-prisma`. Perfil em vez de papel, para as regras valerem também para agentes externos, via briefing | perfil |
| L4 | Teto de custo e detecção de loop | Hook `orcamento.py` e script `guardrails.py` | mod `guardrails` |
| L5 | Defesa contra prompt injection | Política `untrusted-content.md` e hook `conteudo_externo.py` | política, mod |
| L6 | Release manager | Papel `release`, ação `/release`, template `release-checklist.md` | papel, ação, template |
| L7 | Enforcement técnico | Hooks `guarda_bash.py` e `guarda_arquivos.py` | mod `guardrails` |
| L8 | Fases 0 a 3 (descoberta, requisitos, design, arquitetura) | Workflow `product-discovery.md`, perfil `product-discovery`, templates `prd.md` e `launch-plan.md` | workflow, perfil, templates |
| L9 | Modelo de ameaças antes do código | Ação `/threat-model` atribuída ao papel `security` do `guilda`, com template `threat-model.md`. Não criei papel novo: o `security` já existe | ação, template |
| L10 | Vercel | Sem papel novo: o plugin oficial cobre a operação e o perfil `edge-cloudflare-vercel` traz as convenções | perfil |
| L11 | FinOps fora da AWS | Sem alterar o papel do `guilda`: o perfil `edge-cloudflare-vercel` redireciona o `finops` para VPS, Cloudflare, Vercel, CI e uso de IA | perfil |

## Em aberto (só você decide)

| # | Decisão | Por que não resolvi |
|---|---|---|
| A1 | Atualizar os projetos do produto para esta versão | Altera repositórios privados e em uso. Você ainda não autorizou. O comando está no README |
| A2 | Este repositório continua público? | Não há instrução sua sobre isso |
| A3 | Nome final do projeto | Não há instrução sua sobre isso |
| A4 | Promover a sobreposição para o `guilda` (v3) | Depende de você validar a v1 em um projeto real primeiro |
| A5 | Instalar os plugins externos da tabela de resolução | Cada um exige proposta, revisão de segurança e sua aprovação. Nada foi instalado |
| A6 | Versões exatas (React 19, Playwright no lugar de Cypress) | O perfil `nestjs-prisma` cobre o back. Para o front, os repositórios divergem e a escolha de versão é sua |
