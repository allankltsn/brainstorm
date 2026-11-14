# Versão inicial (v0), sem o guilda

Marketplace de plugins do Claude Code com o fluxo por fases e portões do [plano inicial](../docs/historico/planejamento-v0.md). Não depende do repositório `guilda`.

Segue a regra "externo primeiro": o que já existe em ferramentas externas fica **só mapeado** em [`fluxo.json`](plugins/nucleo/skills/orquestrar/fluxo.json); o que estava pendente foi **criado aqui**.

## Estrutura

```
v0/
├── .claude-plugin/marketplace.json   lista os 7 plugins
├── plugins/
│   ├── nucleo/        orquestração, hooks de proteção, CLI, handoff, retrospectiva
│   ├── produto/       product-owner; skills de PRD e de história
│   ├── design/        usuario-leigo
│   ├── engenharia/    backend-nestjs-prisma, cloudflare, borda-ingress; skill de ADR
│   ├── qualidade/     privacidade-lgpd, arquiteto-seguranca; skill de threat model
│   ├── entrega/       release-manager; skill de checklist de release
│   └── negocio/       analista-financeiro, estrategista-de-marca, finops; skills financeira e de lançamento
├── perfis/            saas-web, landing, api
├── modelos.json       gerenciador de modelos (papel -> tier -> modelo)
├── scripts/agentes    atalho para a CLI
└── tests/             25 testes dos hooks e da CLI
```

## O que foi criado (os pendentes)

**Agentes (11)**

| Agente | Plugin | Origem da pendência |
|---|---|---|
| `analista-financeiro` | negocio | Não existia em lugar nenhum |
| `cloudflare` | engenharia | Não existia (o plugin oficial foca em Workers) |
| `backend-nestjs-prisma` | engenharia | Não existia (os externos são genéricos) |
| `release-manager` | entrega | Não existia |
| `arquiteto-seguranca` | qualidade | Não existia (modelo de ameaças antes do código) |
| `privacidade-lgpd` | qualidade | Só existia no guilda |
| `estrategista-de-marca` | negocio | Só existia no guilda |
| `usuario-leigo` | design | Só existia no guilda |
| `product-owner` | produto | Só existia no guilda |
| `borda-ingress` | engenharia | Só existia no guilda |
| `finops` | negocio | Só existia no guilda (lá, centrado em AWS; aqui, VPS, Cloudflare e Vercel) |

**Skills (10):** `orquestrar`, `handoff`, `retro`, `escrever-prd`, `escrever-story`, `adr`, `threat-model`, `checklist-release`, `modelo-financeiro`, `plano-de-lancamento`.

**Mecanismos**

| Mecanismo | Onde | O que faz |
|---|---|---|
| Orquestrador com portões | skill `orquestrar` + CLI | 9 fases; a fase só avança com os artefatos presentes e aprovação registrada com nome |
| Enforcement técnico | `hooks/guarda_bash.py`, `guarda_arquivos.py` | Bloqueia `rm -rf` amplo, push em ramo protegido, `--no-verify`, `curl \| sh`, leitura de `.env` e chaves, gravação de segredos; pede confirmação para produção |
| Teto de custo e loop | `hooks/orcamento.py` | Limite de chamadas, subagentes e tokens por sessão; barra a mesma chamada repetida; só humano renova |
| Defesa contra prompt injection | `hooks/conteudo_externo.py` | Marca a sessão que leu web ou MCP, alerta em padrões de injeção e endurece comandos de produção |
| Gerenciador de modelos | `modelos.json` + `agentes modelos` | Troca o modelo de todos os agentes editando uma linha |
| Registro de instalações | `agentes registrar-instalacao` | Linha por plugin, MCP ou ferramenta instalada |
| Perfis | `perfis/*.json` | Fases e plugins por tipo de projeto |

## O que continua externo (não criado nem instalado)

Estratégia e mercado, análise de negócio, gerente de produto, pesquisa UX, UX/UI, arquiteto, Scrum Master, frontend, banco, infra, revisão técnica, segurança de código, QA, CI/CD, hospedagem, SRE, marketing e documentação. Os candidatos de cada papel estão em `fluxo.json` e aparecem com:

```sh
scripts/agentes papeis --todas
```

Os nomes dos plugins externos precisam ser confirmados na instalação.

## Como usar

```sh
# 1. Inicializar um projeto
scripts/agentes init /caminho/do/projeto --perfil saas-web

# 2. No Claude Code, dentro do projeto (o init imprime estes comandos)
/plugin marketplace add /caminho/para/brainstorm/v0
/plugin install nucleo@agentes-v0

# 3. Acompanhar
scripts/agentes status /caminho/do/projeto
scripts/agentes portao verificar /caminho/do/projeto
scripts/agentes portao aprovar /caminho/do/projeto --por "Seu Nome"
```

Outros comandos: `papeis`, `orcamento status|renovar`, `registrar-instalacao`, `modelos aplicar|verificar`, `validar`.

O `init` cria `.agentes/` (estado e limites), as pastas `docs/` das fases, o registro de instalações e um bloco de regras no `CLAUDE.md`. Rodar de novo não apaga nada.

### Limites configuráveis

Em `.agentes/config.json` do projeto: `ramos_protegidos`, `orcamento` (`max_chamadas` 400, `max_subagentes` 30, `max_repeticoes` 5, `max_tokens` 0 = desligado), `producao_apos_conteudo_externo` (`perguntar` ou `negar`), `bash_negar` e `bash_perguntar` (expressões regulares próprias).

## Verificação

```sh
python3 -m unittest discover -s tests   # 25 testes
scripts/agentes validar                 # consistência do marketplace
claude plugin validate .                # validador do Claude Code
```

## Limites conhecidos

- **Não foi exercitado numa sessão real do Claude Code.** Os hooks foram testados com entradas simuladas, e o marketplace e os plugins passam no `claude plugin validate`. O primeiro uso real deve conferir se os hooks disparam e se o pedido de confirmação aparece.
- **Os hooks são barreira, não sandbox.** Um comando ofuscado pode escapar. Mantenha permissões restritas e credenciais de curta duração.
- **A contagem de tokens é aproximada:** lê a transcrição principal e não inclui subagentes. O limite de chamadas é o controle confiável.
- **A aprovação de portão registra um nome, não prova identidade.** O hook pede confirmação humana quando o agente tenta aprovar.
- **Os prompts dos agentes não foram avaliados em tarefas reais.** Ajuste com a skill `retro` depois do primeiro ciclo.
- **Arquivos de configuração em JSON,** não YAML como no plano, para não depender de biblioteca externa.
- **Sem licença nem ícone.** Só são exigidos para publicar no diretório público de plugins.
