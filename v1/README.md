# Versão com o guilda (v1)

Sobreposição aditiva sobre o [`guilda`](https://github.com/allankltsn/guilda) 2.0.0. O `guilda` continua sendo o núcleo (gates, evidência, tiers de modelo, registro de instalação, GitHub Projects). Esta pasta acrescenta o que faltava e é **montada e instalada pelo motor do próprio `guilda`**.

Compare com a [`v0`](../v0/README.md), que faz o mesmo sem o `guilda`. As decisões aplicadas estão em [`docs/decisoes.md`](docs/decisoes.md).

## Como funciona

```
guilda 2.0.0 (checkout)  +  overlay/ (só arquivos novos)  ->  build/guilda (2.0.0+v1)  ->  projeto
```

A montagem **não altera nenhum arquivo do `guilda`**, exceto três junções mecânicas: o catálogo (`template.json` ganha papéis e ações), a lista de payload e o registro do mod em `mods.py`. Se o `guilda` passar a ter um arquivo, papel ou ação com o mesmo nome, ou mudar de versão, a montagem para com erro em vez de sobrescrever.

## O que a sobreposição acrescenta

| Tipo | Itens |
|---|---|
| Papéis (3) | `product-finance`, `cloudflare`, `release` |
| Ações (4) | `/finance`, `/cloudflare`, `/release`, `/threat-model` (esta no papel `security` do `guilda`) |
| Perfis (5) | `external-first`, `product-discovery`, `nestjs-prisma`, `edge-cloudflare-vercel`, `guardrails` |
| Workflows (2) | `external-first.md`, `product-discovery.md` |
| Política (1) | `untrusted-content.md` |
| Templates (5) | `prd`, `financial-model`, `threat-model`, `release-checklist`, `launch-plan` |
| Tabela de resolução | `integrations/plugins/resolution.json`: os 31 papéis, com candidatos externos e reserva |
| Mod | `guardrails`: hooks de proteção, teto de custo e alerta de prompt injection |

Os papéis, ações, workflows e templates estão em inglês e no formato de contrato do `guilda`, para poderem ser promovidos a ele sem reescrita.

### Externo primeiro

Com o perfil `external-first`, o principal resolve cada papel nesta ordem: agente externo **instalado e registrado**; senão o papel canônico do `guilda`; senão uma lacuna registrada.

- **20 papéis** preferem externo (backend, frontend, QA, segurança, revisão, Kubernetes, SRE, marketing e outros).
- **11 ficam canônicos:** `privacy-compliance`, `lay-user`, `brand-strategist`, `product-owner`, `ingress`, `finops`, `orchestration`, `scribe` e os três criados aqui.
- **11 necessidades sem papel canônico próprio** (pesquisa de mercado, Scrum, banco, documentação e outras) apontam para um externo e para um papel de reserva.

A governança não muda: o principal passa o contrato no briefing, autor e gates são instâncias diferentes no mesmo snapshot, e ao menos um gate por entrega vem de uma fonte diferente da do autor.

## Como usar

Requer Python 3.11+ e um checkout do `guilda` 2.0.0.

```sh
# 1. Montar (procura o guilda em GUILDA_SRC, ../../guilda ou ../../allankltsn/guilda)
python3 scripts/guilda_v1.py montar                    # ou: --guilda CAMINHO | --clonar
python3 scripts/guilda_v1.py montar --python python    # no Windows

# 2. Conferir sem gravar nada
python3 scripts/guilda_v1.py instalar /caminho/do/projeto --dry-run

# 3. Instalar (template + mod guardrails)
python3 scripts/guilda_v1.py instalar /caminho/do/projeto
python3 scripts/guilda_v1.py instalar /caminho/do/projeto --sem-mod   # só o template
```

Perfis padrão: `base`, `product-team`, `github-projects`, `polyrepo`, `vps-k3s`, `external-first`, `product-discovery`, `nestjs-prisma`, `edge-cloudflare-vercel`, `guardrails`. Use `--perfis a,b,c` para outro conjunto. Rodar de novo num projeto já instalado atualiza, mantendo os perfis escolhidos.

Depois de instalado, a árvore montada é um `guilda` completo: `python build/guilda/install.py`, `python -m guilda upgrade` e os demais comandos funcionam a partir de `build/guilda`.

O mod é documentado em [`overlay/integrations/mod/guardrails/README.md`](overlay/integrations/mod/guardrails/README.md).

## Verificação

```sh
python3 -m unittest discover -s tests     # 17 testes
python3 scripts/guilda_v1.py verificar    # monta e instala num diretório temporário
```

O que foi verificado aqui:

- A árvore montada é aceita pelo `load_source` do `guilda` e instala 31 agentes e 15 comandos, com `check` do `guilda` aprovado.
- Reinstalar não muda nenhum arquivo.
- Nenhum arquivo do `guilda` muda além das três junções (teste compara byte a byte).
- Numa instalação real em diretório temporário, o instalador do `guilda` copiou o mod, o Claude Code o instalou e habilitou, e a linha entrou no registro de instalações.
- Os hooks do mod respondem certo a entradas simuladas (comandos destrutivos, segredos, orçamento, loop, conteúdo externo).

## Limites conhecidos

- **Não foi usado numa sessão real de trabalho.** A instalação do mod foi real, mas o disparo dos hooks dentro de uma conversa não foi observado. Confira no primeiro uso.
- **Projeto instalado pela v1 só atualiza pela v1.** O manifesto registra arquivos que o `guilda` oficial não conhece, e o `guilda upgrade` oficial os recusa. Isso vale até a sobreposição ser promovida ao `guilda`.
- **O mod registra o caminho absoluto do projeto** na configuração do Claude Code do usuário, mesmo em escopo de projeto. É o comportamento do instalador de mods do `guilda`. Em outra máquina, rode o instalador de novo.
- **Todos os 31 agentes são instalados**, inclusive os que o `external-first` substitui. O motor do `guilda` não permite escolher papéis; isso custa um pouco de contexto.
- **Os nomes da tabela de resolução não foram verificados como instaláveis.** Vieram das listas das próprias fontes em 2026-11-14.
- **Prompts dos papéis novos não foram avaliados em tarefas reais.**
- **Os hooks são barreira, não sandbox,** e a contagem de tokens é aproximada.
- **A pasta `build/` não é versionada:** contém uma cópia do `guilda` (Apache-2.0) e é regenerada pelo `montar`.

## Atualizar os projetos existentes

Não foi feito: depende da sua autorização ([decisão A1](docs/decisoes.md)). Quando quiser, por projeto:

```sh
python3 scripts/guilda_v1.py montar
python3 build/guilda/install.py /caminho/do/projeto --dry-run   # se o projeto já está no guilda 2.0
python3 -m guilda upgrade /caminho/do/projeto --dry-run          # a partir de build/guilda, se está em versão antiga
```
