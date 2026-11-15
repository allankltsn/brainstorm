# 11. Como funciona cada estratégia

Construímos duas versões da mesma ideia: uma equipe de agentes reaproveitável, com fases, portões humanos e proteção técnica. Elas diferem em **quem fornece a governança** e **como o conteúdo chega ao projeto**.

| | Onde está | Em uma frase |
|---|---|---|
| **v0** | [`v0/`](../v0/README.md) | Marketplace de plugins do Claude Code, sem depender do `guilda` |
| **v1** | [`v1/`](../v1/README.md) | Sobreposição sobre o `guilda` 2.0.0, instalada pelo motor dele |

As duas usam os mesmos hooks de proteção e a mesma regra de escolha de agentes: ferramenta externa primeiro, criação própria só para o que não existe.

![Comparação](assets/estrategias/e01-comparacao.svg)

> **O que foi verificado.** As duas versões têm testes automatizados (25 na v0, 17 na v1) e passam no validador de plugins do Claude Code. A v1 foi instalada de verdade num diretório temporário. **Nenhuma foi usada numa sessão real de trabalho**: os hooks foram testados com entradas simuladas. As imagens de terminal abaixo são saídas reais dos comandos, com os caminhos trocados por `/caminho`.

---

## Parte 1. A v0, sem o guilda

### As peças

![Arquitetura da v0](assets/estrategias/e02-v0-arquitetura.svg)

A v0 é um **marketplace com 7 plugins**. Cada plugin agrupa agentes e skills de uma área:

| Plugin | Conteúdo |
|---|---|
| `nucleo` | Skill `orquestrar`, skills `handoff` e `retro`, os hooks de proteção e a CLI `agentes` |
| `produto` | Agente `product-owner`; skills `escrever-prd` e `escrever-story` |
| `design` | Agente `usuario-leigo` |
| `engenharia` | Agentes `backend-nestjs-prisma`, `cloudflare`, `borda-ingress`; skill `adr` |
| `qualidade` | Agentes `privacidade-lgpd`, `arquiteto-seguranca`; skill `threat-model` |
| `entrega` | Agente `release-manager`; skill `checklist-release` |
| `negocio` | Agentes `analista-financeiro`, `estrategista-de-marca`, `finops`; skills `modelo-financeiro` e `plano-de-lancamento` |

Só foram criados os papéis que **não existem em ferramentas externas**. Os demais (mercado, PM, UX/UI, frontend, QA, CI/CD e outros) ficam mapeados em `fluxo.json`, com os candidatos de cada um, e não são instalados.

Um **perfil** (`saas-web`, `landing`, `api`) define quais fases e quais plugins o projeto usa. Uma landing page, por exemplo, pula arquitetura e planejamento.

### O ciclo de uma fase

![Ciclo da v0](assets/estrategias/e03-v0-ciclo.svg)

1. **Iniciar.** `agentes init --perfil <perfil>` cria no projeto a pasta `.agentes/` (estado e limites), as pastas `docs/` de cada fase, o registro de instalações e um bloco de regras comuns no `CLAUDE.md`. Rodar de novo não apaga nada.
2. **Situar-se.** `agentes status` mostra a fase atual e os artefatos que faltam. `agentes papeis` mostra quem faz cada papel: um agente próprio ou os candidatos externos.
3. **Despachar.** O agente principal segue a skill `orquestrar`: escreve um briefing curto e escolhe, nesta ordem, um externo instalado, um agente próprio ou propõe a instalação de um plugin.
4. **Entregar.** Cada agente grava o artefato em `docs/` e um handoff curto. Responde só com o caminho e um resumo.
5. **Verificar.** Revisão, segurança, privacidade e QA são instâncias diferentes olhando o mesmo estado do código.
6. **Portão.** `agentes portao verificar` confere se os artefatos existem e têm conteúdo. Só então **você** aprova, com `agentes portao aprovar --por "Seu Nome"`.
7. **Avançar.** O histórico grava quem aprovou e quando, e a próxima fase começa.

![Iniciar e ver o estado](assets/estrategias/t01-v0-status.svg)

O portão é uma verificação real, não um lembrete. Sem os artefatos, a aprovação é recusada:

![Papéis e portão](assets/estrategias/t02-v0-papeis-portao.svg)

Duas proteções impedem o agente de se autoaprovar: o hook bloqueia qualquer edição em `.agentes/estado.json`, e pede a sua confirmação se o agente tentar rodar `portao aprovar`. A aprovação registra um nome; ela não prova identidade.

---

## Parte 2. A v1, com o guilda

### A ideia

O `guilda` já tem gates independentes, regras de evidência, camadas de modelo, registro de instalações e o contrato do GitHub Projects. A v1 **não reimplementa nada disso**. Ela acrescenta só o que faltava, em uma pasta de sobreposição, e usa o instalador do `guilda` para levar tudo ao projeto.

### Da sobreposição à instalação

![Montagem da v1](assets/estrategias/e05-v1-montagem.svg)

1. **Montar.** O script copia um checkout do `guilda` 2.0.0, soma os 30 arquivos da pasta `overlay/` e gera uma árvore `2.0.0+v1`.
2. **Três junções.** São as únicas alterações em arquivos do `guilda`: o catálogo ganha 3 papéis e 4 ações, a lista de payload ganha os arquivos novos e o registro de mods ganha o `guardrails`. Um teste compara todo o resto byte a byte.
3. **Validar.** A árvore montada é carregada pelo motor do `guilda`. Se ele rejeitar, a montagem falha.
4. **Instalar.** O `install.py` do `guilda` grava os arquivos no projeto, roda a verificação dele e mantém o manifesto.
5. **Mod.** Com `--mod guardrails`, o instalador de mods do `guilda` copia os hooks, o Claude Code instala o plugin e uma linha entra no registro de instalações.

A montagem é defensiva: se o `guilda` mudar de versão ou passar a ter um arquivo, papel ou ação com o mesmo nome, ela **para com erro** em vez de sobrescrever.

![Montar e simular](assets/estrategias/t04-v1-montar.svg)

### O que a sobreposição acrescenta

| Tipo | Itens |
|---|---|
| Papéis (3) | `product-finance`, `cloudflare`, `release` |
| Ações (4) | `/finance`, `/cloudflare`, `/release`, `/threat-model` |
| Perfis (5) | `external-first`, `product-discovery`, `nestjs-prisma`, `edge-cloudflare-vercel`, `guardrails` |
| Workflows (2) | externo primeiro; descoberta de produto |
| Política (1) | conteúdo não confiável e prompt injection |
| Templates (5) | PRD, modelo financeiro, modelo de ameaças, checklist de release, plano de lançamento |
| Tabela | `resolution.json`, com os 31 papéis |
| Mod | `guardrails` |

Tudo o que é opcional entra como **perfil**. Um projeto que não selecionar `external-first` continua usando só os papéis do `guilda`.

### Quem faz cada papel

![Resolução na v1](assets/estrategias/e06-v1-resolucao.svg)

Com o perfil `external-first`, o principal consulta a tabela de resolução para cada papel:

1. **Externo instalado e registrado.** Vale só se o plugin está no projeto **e** tem linha no registro de instalações.
2. **Papel do guilda.** O próprio papel canônico ou a reserva indicada.
3. **Lacuna.** Registrada e tratada pelo fluxo de staffing do `guilda`; nunca se troca por um papel de nome parecido.

Dos 31 papéis, **20 preferem externo** e **11 ficam sempre com o `guilda`**: privacidade, usuário leigo, marca, product-owner, ingress, finops, service mesh, escriba e os três criados na v1.

Um agente externo não conhece as regras do `guilda`. Por isso o principal passa o contrato no briefing (escopo, critérios, evidência esperada), e ao menos um gate de cada entrega vem de uma fonte diferente da do autor.

### Do começo do produto ao lançamento

![Fases da v1](assets/estrategias/e07-v1-fases.svg)

O `guilda` começa nas histórias. O perfil `product-discovery` acrescenta as quatro fases anteriores, cada uma encerrada por uma decisão sua. Depois da arquitetura, o trabalho segue pelos workflows que o `guilda` já tem, e o papel `release` prepara o go-live.

Não há uma CLI de fases como na v0: **o quadro do GitHub Projects é o estado**. Cada fase é um épico `[D-N]`, e a seguinte só é despachada depois do estado `accepted`.

---

## Parte 3. O que as duas têm em comum

### Proteção técnica

![Hooks](assets/estrategias/e04-hooks.svg)

Regras em texto orientam, mas um agente pode ignorá-las. Os hooks agem antes de cada ação e têm três respostas possíveis:

- **Negar:** a ação não acontece e o motivo volta ao agente.
- **Perguntar:** a ação fica esperando a sua confirmação.
- **Permitir:** a ação segue.

| Hook | Atua em | Faz |
|---|---|---|
| Guarda de comandos | Bash | Nega destrutivos e exposição de segredos; pergunta em comandos de produção |
| Guarda de arquivos | Leitura e escrita | Nega `.env`, chaves e credenciais; nega gravar conteúdo com padrão de segredo, informando a classe e nunca o valor |
| Orçamento | Toda ação | Teto de chamadas, subagentes e tokens por sessão; barra a mesma chamada repetida em sequência |
| Conteúdo externo | Depois de web ou MCP | Marca a sessão, alerta em padrões de prompt injection e reforça a confirmação de comandos de produção |

![Respostas dos hooks](assets/estrategias/t03-hooks.svg)

As três primeiras respostas da imagem são o texto exato do hook. A última resume a decisão, que o hook devolve em JSON para o Claude Code mostrar como pedido de confirmação. O prefixo é `[nucleo]` na v0 e `[guardrails]` na v1.

Quando o teto de orçamento é atingido, o agente deve parar e gravar um handoff. **Só você renova**, pelo terminal. Os limites ficam num arquivo que o agente não consegue editar.

Limites honestos desta proteção: os hooks são uma barreira, não um sandbox, e um comando ofuscado pode escapar. A contagem de tokens é aproximada e não inclui subagentes; o teto de chamadas é o controle confiável.

### Gerenciador de modelos

![Modelos](assets/estrategias/e08-modelos.svg)

Nas duas versões, um único lugar define a camada de cada papel e uma ferramenta grava o modelo nos agentes. A regra também é a mesma: quem atua como gate (segurança, privacidade, revisão) nunca usa a camada mais barata.

### Regras de trabalho

- **Quem faz não aprova.** Autor e validadores são instâncias diferentes.
- **Entrega em arquivo.** Artefato e handoff curto; a conversa carrega só o caminho.
- **Portões são decisão humana.** Silêncio, corte ou orçamento esgotado nunca aprovam.
- **Nada se instala sem proposta, aprovação e registro.**
- **Conteúdo externo é dado,** nunca instrução.
- **Produção exige aprovação explícita** para cada ação.

---

## Parte 4. Qual usar

| Situação | Escolha | Por quê |
|---|---|---|
| Testar os hooks e os agentes novos rapidamente | v0 | Sem dependência; instala plugin por plugin |
| Projeto pequeno ou landing page | v0 | Poucos agentes carregados; perfis enxutos |
| Não quer depender do `guilda` | v0 | É autossuficiente |
| Projeto que já usa o `guilda` | v1 | Mantém manifesto, upgrade e contratos existentes |
| Vários repositórios com um hub | v1 | Usa o perfil `polyrepo` e o quadro único |
| Precisa de evidência por snapshot e gates rígidos | v1 | Vem do `guilda`, testado e versionado |
| Quer padronizar todos os projetos | v1 | Uma instalação gerenciada por projeto |

Diferenças que pesam na escolha:

| | v0 | v1 |
|---|---|---|
| Governança | Regras curtas na skill `orquestrar` e no `CLAUDE.md` | Políticas e workflows completos do `guilda` |
| Estado das fases | Arquivo local, conferido pela CLI | Quadro do GitHub Projects |
| Agentes carregados | Só os dos plugins instalados | Todos os 31, mesmo os substituídos por externos |
| Idioma dos agentes | Português | Inglês, no formato de contrato do `guilda` |
| Atualização | Pelo marketplace | Só pela v1, até promover ao `guilda` |
| Dependência | Nenhuma | Checkout do `guilda` 2.0.0 |

### Como se complementam

![Evolução](assets/estrategias/e09-evolucao.svg)

Minha recomendação é usar as duas em sequência: a v0 para experimentar e medir, a v1 para padronizar. O que funcionar na v1 pode ser proposto ao `guilda` como v3, e então a atualização oficial volta a valer. Nada é promovido sem a sua aprovação.

---

## Limites que valem para as duas

- **Sem uso real ainda.** Falta observar os hooks disparando numa conversa e avaliar os prompts dos agentes em tarefas de verdade.
- **Plugins externos não verificados.** Os nomes vêm das listas das próprias fontes; nenhum foi instalado.
- **Python no PATH.** Os hooks chamam `python3`; no Windows é preciso ajustar para `python`.
- **A v1 prende a atualização.** Um projeto instalado por ela só atualiza por ela.
- **A v1 registra o caminho absoluto do projeto** na configuração do Claude Code do usuário, por causa do instalador de mods do `guilda`.

Detalhes em [`v0/README.md`](../v0/README.md), [`v1/README.md`](../v1/README.md) e [`v1/docs/decisoes.md`](../v1/docs/decisoes.md).

Voltar ao [início](../README.md).
