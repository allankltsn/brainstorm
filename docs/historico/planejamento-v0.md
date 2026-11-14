> **Documento histórico.** Este foi o primeiro rascunho, escrito antes de analisarmos o repositório `guilda` (que já existe na v2.0.0) e os projetos do produto. Foi substituído pela documentação em [`../README.md`](../../README.md). Mantido só como registro da evolução das decisões.

# Guilda — plataforma reutilizável de agentes para todo o ciclo de um produto

> Rascunho de planejamento. Status: **proposta para revisão**, nada instalado ainda.
> Números de estrelas, instalações e economia de tokens vêm das páginas dos próprios projetos ou de blogs de terceiros. Valide cada ferramenta antes de adotar (seção 10).

## 1. Objetivo e princípios

Um repositório único que vira um **marketplace de plugins do Claude Code**. Em qualquer projeto novo você instala o "perfil" que precisa e ganha uma equipe de agentes orquestrados, do conceito ao deploy.

Princípios:

1. **Compor, não reinventar.** Reusar frameworks maduros (BMAD, Superpowers, wshobson/agents, marketingskills) e escrever só a cola e as lacunas.
2. **Artefatos em arquivo, não em chat.** Cada agente lê e escreve documentos (`PRD.md`, `architecture.md`, `stories/*.md`). Isso dá handoff limpo, auditável e barato em tokens.
3. **Portões humanos.** Entre as fases há aprovação sua. Dentro de uma fase, autonomia.
4. **Perfis por projeto.** Carregar 100+ agentes custa contexto. Cada projeto habilita só o que usa.
5. **Medir antes de otimizar.** Linha de base de tokens/custo antes de ligar as ferramentas de economia.

## 2. Fluxo de trabalho (fases e portões)

```
0 Descoberta ─▶ 1 Requisitos ─▶ 2 Design ─▶ 3 Arquitetura ─▶ 4 Planejamento
                                                                   │
8 Crescimento ◀─ 7 Entrega ◀─ 6 Verificação ◀─ 5 Construção ◀──────┘
        └──────────── retrospectiva alimenta melhorias nos agentes ────────────┘
```

| Fase | Agentes | Artefato de saída | Portão (você aprova) |
|---|---|---|---|
| 0 Descoberta | Estrategista de Produto, Analista de Mercado, Analista Financeiro, Growth/Marketing | `docs/00-visao.md`, `mercado.md`, `modelo-financeiro.md` | Vale a pena construir? |
| 1 Requisitos | Analista de Negócio, PM, UX Researcher | `docs/01-prd.md` (RF/RNF, personas, métricas) | PRD aceito |
| 2 Design | UX/UI Designer, Prototipador, Design System | `docs/02-ux.md`, protótipo navegável, tokens | Protótipo aceito |
| 3 Arquitetura | Arquiteto, Arquiteto de Segurança (threat model), Arquiteto Cloud/Infra, Dados | `docs/03-arquitetura.md`, ADRs, `threat-model.md` | Arquitetura aceita |
| 4 Planejamento | Scrum Master, Product Owner | épicos, `stories/*.md` com critérios de aceite, tasks, ordem | Backlog priorizado |
| 5 Construção | Backend, Frontend, Mobile (opcional), Dados, DevOps | código + testes, um PR por story | por story: revisão |
| 6 Verificação | Code Reviewer, Security Reviewer, QA, Acessibilidade, Performance | relatórios, bugs, PRs aprovados | gate de qualidade |
| 7 Entrega | CI/CD, Release Manager, Cloud/Deploy, SRE/Observabilidade | pipeline, IaC, runbook, release notes | go-live |
| 8 Crescimento | Marketing/SEO, Suporte/Docs, Retrospectiva | campanhas, docs, `retro.md` | — |

**Orquestrador (Chief of Staff):** agente principal da sessão. Lê o estado em `.guilda/estado.json`, decide a próxima fase, delega a subagentes com contexto mínimo (só os artefatos necessários) e para nos portões.

**Paralelismo:** na fase 5, cada story roda em um `git worktree` próprio com um subagente. O Agent Teams do Claude Code é experimental e vem desligado por padrão ([comparativo](https://reinvently.co.uk/blog/multi-agent-orchestration-frameworks-compared/)); começar com subagentes e reavaliar.

**Autonomia configurável** em `guilda.yaml`: `manual` (aprova tudo), `portoes` (padrão), `autonomo` (só para em erro ou segurança).

## 3. Catálogo de agentes

Cada agente é um arquivo `.md` com frontmatter (`name`, `description`, `tools`, `model`) e um prompt curto. Regra: **ferramentas mínimas por agente** (o Revisor não escreve código; o Analista Financeiro não executa shell).

| Grupo | Agente | Origem sugerida | Tier de modelo |
|---|---|---|---|
| Estratégia | Estrategista de Produto | BMAD (Analyst) + própria | alto |
| | Analista de Mercado | própria + WebSearch | médio |
| | Analista Financeiro | **lacuna**: própria (unit economics, preço, runway) | médio |
| | Growth/Marketing | marketingskills | médio |
| Produto | Analista de Negócio | BMAD | médio |
| | PM | BMAD | alto |
| | Product Owner / Scrum Master | BMAD (PO, SM) | médio |
| Design | UX Researcher | **lacuna**: própria | médio |
| | UX/UI Designer, Prototipador | BMAD (UX) + 21st Magic MCP + Figma MCP | médio |
| Engenharia | Arquiteto | BMAD (Architect) | alto |
| | Backend, Frontend, Dados, Mobile | wshobson/agents (cherry-pick) | médio |
| | DevOps/Infra/Cloud, SRE | wshobson/agents + Terraform/cloud MCP | médio |
| Qualidade | Code Reviewer | Superpowers (review em 2 etapas) + plugin oficial | alto |
| | Security Reviewer | plugin Semgrep + `security-guidance` | alto |
| | QA | BMAD (QA) + Playwright MCP | médio |
| Suporte | Explorador de código, triagem de logs, escritor de docs | própria | baixo |
| Meta | Retrospectiva / Task Observer | Task Observer | médio |

## 4. Reuso: o que adotar do ecossistema

| Peça | O que cobre | Observação |
|---|---|---|
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | Fases 1 a 4: Analyst, PM, Architect, SM, PO, Dev, QA, UX; PRD, arquitetura e stories | Também tem módulos para negócio e outras áreas. Reaproveitar a *estrutura de artefatos*, adaptar os prompts |
| [Superpowers](https://claude.com/plugins/superpowers) | Fase 5 e 6: brainstorming, TDD, subagente por task, review em 2 etapas | Esqueleto do loop de desenvolvimento |
| [wshobson/agents](https://github.com/wshobson/agents) | Especialistas de engenharia, cloud, segurança, CI/CD | Vem com ~90 plugins; instalar só os necessários por perfil |
| [marketingskills](https://github.com/coreyhaines31/marketingskills) | SEO, copy, CRO, analytics, growth | Cobre Marketing |
| [Marketplace oficial da Anthropic](https://github.com/anthropics/claude-plugins-official) | Plugins curados | Conferir no `/plugin` quais existem hoje (revisão de código, segurança, setup) |
| [Semgrep plugin](https://app.semgrep.dev/docs/mcp) | Scan de segurança após cada edição (MCP + hooks + skills) | Conta Semgrep necessária; o modo hospedado envia código ao serviço |
| [Task Observer](https://tessl.io/registry/rebelytics/task-observer) | Meta-skill que sugere melhorias nas suas skills | Comunitário, não oficial; ativar via `CLAUDE.md` |

**Lacunas sem plugin maduro encontrado (escrever do zero):** Analista Financeiro, UX Researcher, Arquiteto de Segurança (threat model), Release Manager, orquestrador com portões. A busca não achou projeto bem estabelecido para finanças de produto; vale uma segunda busca antes de escrever.

## 5. Economia de tokens (pilha em camadas)

| Camada | Ferramenta | Ataca | Observação |
|---|---|---|---|
| Saída de shell | [RTK](https://github.com/rtk-ai/rtk) | `git`, `npm`, `ls`, testes... | Hook `PreToolUse` em Bash (`rtk init -g`). Alega 60 a 90% de redução. **Não** cobre Read/Grep/Glob. Cuidado: existe outro pacote "rtk" no crates.io, não relacionado |
| Leitura de código | [Serena](https://github.com/oraios/serena) | Ler arquivos inteiros | MCP com busca e edição por símbolo via LSP. Ganho maior em bases grandes. Complementa o RTK |
| Contexto geral | [Headroom](https://github.com/chopratejas/headroom) | Contexto enviado ao modelo | Proxy/MCP/biblioteca; alega 60 a 95% com recuperação do original. Confira o repositório canônico (há muitos forks) |
| Memória | [claude-mem](https://github.com/thedotmack/claude-mem) | Reexplicar o projeto a cada sessão | Injeta contexto, então também **gasta** tokens; medir o saldo |
| Estrutura | Próprios | Handoff por arquivo, subagentes para leituras pesadas, `CLAUDE.md` enxuto, skills com carga sob demanda | Maior ganho barato |
| Modelo | Gerenciador (seção 6) | Usar modelo caro só onde precisa | |

**Ordem de adoção:** (1) medir linha de base com `/cost` num projeto-piloto; (2) RTK; (3) Serena; (4) claude-mem; (5) Headroom por último, porque é proxy e interage com o roteador de modelos. Ligar uma por vez e comparar.

Aviso sobre números: as reduções acima são alegações dos projetos, medidas em cenários deles. Os resultados dependem do seu código.

## 6. Gerenciador de modelos

Três camadas, da mais simples para a mais complexa:

1. **Nativo (usar já).** Campo `model:` no frontmatter de cada agente, mais as variáveis `ANTHROPIC_DEFAULT_*_MODEL` e `CLAUDE_CODE_SUBAGENT_MODEL` ([guia do OpenRouter](https://openrouter.ai/docs/guides/guides/claude-code-integration)).
2. **`modelos.yaml` próprio.** Mapeia *papel → tier* (alto/médio/baixo) e *tier → modelo*. Um script (`guilda modelos aplicar`) reescreve o frontmatter de todos os agentes. Trocar de modelo no projeto inteiro vira editar uma linha.
   ```yaml
   tiers: { alto: opus, medio: sonnet, baixo: haiku }
   papeis: { arquiteto: alto, security-reviewer: alto, backend: medio, explorador: baixo }
   ```
3. **Gateway (opcional, só se precisar de outros provedores ou fallback).** [claude-code-router](https://www.morphllm.com/claude-code-router) roteia por tipo de requisição (background, raciocínio, contexto longo). Existe um fork com modelo por agente, não verificado.

**Sobre o OmniRoute do post** (uso "quase ilimitado" via 200+ provedores gratuitos): conceitualmente é a camada 3. Antes de usar:
- Seu código e prompts passam a trafegar por provedores terceiros, incluindo gratuitos. Para código de cliente ou segredos, é um risco real.
- "Gratuito" tem limites de taxa e qualidade variável; a sessão "nunca para" à custa de trocar de modelo no meio da tarefa.
- Rotear uma assinatura por um proxy pode ferir os termos do provedor. Confira.
- Os números de provedores variam entre fontes (231 a 352), e o projeto depende de Redis. Há muitos forks.
- Minha recomendação: **começar nas camadas 1 e 2** e só adicionar gateway se houver um problema concreto de custo ou limite.

O post também é de divulgação ("comente CLAUDE"). Trate as promessas como ponto de partida, não como fato.

## 7. Skills, hooks e MCPs

**Skills** (carregadas sob demanda, baratas): `escrever-prd`, `escrever-story`, `adr`, `threat-model`, `modelo-financeiro`, `plano-de-lancamento`, `checklist-release`, `retro`, mais as de SEO/copy do marketingskills e as de TDD/review do Superpowers.

**Hooks:**

| Evento | Uso |
|---|---|
| `SessionStart` | Carregar `.guilda/estado.json` e mostrar fase atual |
| `PreToolUse` (Bash) | RTK; bloquear comandos destrutivos, push em `main`, leitura de `.env` |
| `PostToolUse` (Edit/Write) | Formatar, lint, scan Semgrep |
| `SubagentStop` | Verificar que o artefato esperado existe e tem as seções obrigatórias |
| `Stop` | Rodar testes, atualizar estado, registrar observações (Task Observer) |
| `PreCompact` | Salvar estado antes de compactar contexto |

**MCPs** (por perfil):

| Função | MCP |
|---|---|
| Código/PRs/Actions | GitHub oficial |
| Navegar código | Serena |
| Docs de bibliotecas | Context7 |
| Testes e UI | Playwright (Microsoft) |
| UI | 21st Magic, Figma |
| Infra | Terraform (HashiCorp) e o do seu provedor cloud |
| Observabilidade | Sentry ou equivalente |
| Gestão | Linear/Jira ou só GitHub Issues |
| Finanças/analytics | Stripe, Google Sheets/Analytics (conforme o projeto) |

Segurança dos MCPs: houve dezenas de CVEs em servidores populares no começo de 2026. Preferir servidores oficiais do fornecedor, dar permissão mínima, e restringir por agente.

## 8. Estrutura proposta do repositório

```
guilda/
├── .claude-plugin/marketplace.json   # lista os plugins/perfis
├── plugins/
│   ├── nucleo/        # orquestrador, hooks, estado, gerenciador de modelos
│   ├── produto/       # estratégia, requisitos, PM, SM
│   ├── design/        # UX/UI, protótipo
│   ├── engenharia/    # arquiteto, back, front, infra
│   ├── qualidade/     # review, segurança, QA
│   ├── entrega/       # CI/CD, release, SRE
│   └── negocio/       # financeiro, marketing, suporte
├── perfis/            # saas-web.yaml, landing.yaml, api.yaml ...
├── modelos.yaml
├── scripts/guilda     # init, modelos aplicar, status
└── docs/              # este planejamento, ADRs, avaliações
```

Em um projeto novo: `/plugin marketplace add <este-repo>`, `guilda init --perfil saas-web` gera `CLAUDE.md`, `guilda.yaml`, `.guilda/` e habilita só os plugins do perfil.

## 9. Roteiro de construção

| Marco | Entrega | Critério de pronto |
|---|---|---|
| M0 | Esqueleto, `marketplace.json`, `nucleo` vazio | instala em projeto de teste |
| M1 | Orquestrador + estado + portões + agentes das fases 0 a 4 | de uma ideia a `stories/*.md` sem intervenção além dos portões |
| M2 | Fases 5 a 7 (build, verificação, entrega) com worktrees | uma story vira PR revisado e com CI verde |
| M3 | Gerenciador de modelos + RTK + Serena | custo por fase medido, comparado à linha de base |
| M4 | Agentes de negócio (financeiro, marketing) | `modelo-financeiro.md` e plano de lançamento gerados e revisáveis |
| M5 | Avaliações e retrospectiva (Task Observer) | suíte de projetos-piloto com métricas |
| M6 | `guilda init` e perfis | projeto novo configurado em 1 comando |

**Piloto sugerido:** refazer um dos apps antigos (`aura-landing` ou `prototype-v2`, ainda no histórico do git) usando a Guilda, e comparar tokens, tempo e retrabalho.

**Métricas:** tokens e custo por fase, taxa de aprovação nos portões, retrabalho por story, tempo da ideia ao primeiro deploy.

## 10. Riscos e pontos a validar

- **Contagens e versões variam** entre fontes (agentes do BMAD, plugins do wshobson, estrelas). Conferir nos repositórios.
- **Fork versus original:** há muitos espelhos de RTK, OmniRoute, Headroom e Serena. Instalar do repositório canônico.
- **Cadeia de suprimentos:** plugins, hooks e MCPs executam código na sua máquina. Ler antes de instalar e fixar versões.
- **Sobreposição:** Headroom, RTK e Serena atuam em camadas próximas; testar em conjunto antes de confiar.
- **Privacidade:** Semgrep hospedado e gateways de terceiros recebem seu código.
- **Custo de contexto:** muitos agentes e MCPs ligados ao mesmo tempo pioram o resultado e o custo. Perfis resolvem.

## 11. Decisões em aberto

1. Stack padrão dos projetos (vi React + Vite + TypeScript no repositório anterior)?
2. Provedor cloud padrão (AWS, GCP, Cloudflare, Vercel)?
3. Rastreador de tarefas: arquivos no repo, GitHub Issues ou Linear?
4. Idioma: prompts dos agentes em inglês e saída em português?
5. Autonomia padrão: `portoes`?
6. Rodar só dentro do Claude Code, ou também de forma automatizada (CI) via Agent SDK?
7. Orçamento mensal de tokens, para calibrar os tiers de modelo.
8. Nome final do projeto (usei "Guilda" a partir do nome da branch).

## Fontes

[Serena](https://mcpservers.org/en/servers/oraios/serena) · [RTK](https://github.com/rtk-ai/rtk) · [claude-mem](https://docs.claude-mem.ai/) · [Headroom](https://github.com/chopratejas/headroom) · [OmniRoute](https://github.com/diegosouzapw/OmniRoute) · [BMAD](https://codemyspec.com/blog/bmad-method-explained) · [wshobson/agents](https://github.com/wshobson/agents) · [Superpowers](https://claude.com/plugins/superpowers) · [Semgrep](https://semgrep.dev/docs/mcp) · [Plugins oficiais](https://code.claude.com/docs/en/discover-plugins) · [marketingskills](https://github.com/coreyhaines31/marketingskills) · [Task Observer](https://tessl.io/registry/rebelytics/task-observer) · [Roteamento de modelos](https://openrouter.ai/docs/guides/guides/claude-code-integration) · [MCPs 2026](https://scrimba.com/articles/best-mcp-servers-for-developers-2026/)
