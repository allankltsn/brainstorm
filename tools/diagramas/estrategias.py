"""Diagramas e imagens de terminal do documento de estratégias (v0 e v1)."""
from lib import D, terminal

F = "estrategias"


def e01():
    d = D(F, "e01-comparacao", "As duas estratégias lado a lado",
          "Mesmo objetivo e mesmos hooks de proteção; muda quem fornece a governança e como chega ao projeto",
          3, 8, cw=330, ch=58, gx=28, gy=14)
    linhas = [
        ("Aspecto", "v0: sem o guilda", "v1: com o guilda"),
        ("Forma", "Marketplace de plugins do Claude Code", "Sobreposição montada sobre o guilda 2.0.0"),
        ("Como chega ao projeto", "Você instala os plugins do perfil", "O instalador do guilda copia para o projeto"),
        ("Especialistas", "11 agentes próprios; externos só mapeados", "31 papéis: 20 preferem externo, 11 canônicos"),
        ("Fases e portões", "CLI própria, estado em .agentes/", "Workflows do guilda e GitHub Projects"),
        ("Proteção técnica", "Hooks dentro do plugin nucleo", "Mod guardrails (os mesmos hooks)"),
        ("Modelos", "modelos.json e um comando para aplicar", "Tiers do guilda, ajustáveis por projeto"),
        ("Atualização", "Atualizar o marketplace e os plugins", "Remontar e reinstalar pela v1"),
    ]
    for i, (a, b, c) in enumerate(linhas):
        d.node(f"a{i}", 0, i, a, "", "data")
        d.node(f"b{i}", 1, i, b, "", "novo" if i else "data")
        d.node(f"c{i}", 2, i, c, "", "guilda" if i else "data")
    return d.save()


def e02():
    d = D(F, "e02-v0-arquitetura", "v0: como as peças se encaixam",
          "Um marketplace com 7 plugins; cada projeto guarda o próprio estado e instala só o que o perfil pede",
          4, 3, cw=215, ch=96,
          note="Os papéis externos não são instalados pela v0: aparecem em 'agentes papeis' com os candidatos de cada um.")
    d.node("mk", 0, 0, "Marketplace agentes-v0", "v0/.claude-plugin/marketplace.json lista os 7 plugins", "novo", cs=4)
    d.node("n1", 0, 1, "nucleo", "skill orquestrar, hooks de proteção, CLI agentes", "novo")
    d.node("n2", 1, 1, "produto e design", "product-owner, usuario-leigo, skills de PRD e de história", "novo")
    d.node("n3", 2, 1, "engenharia e qualidade", "backend, cloudflare, ingress, privacidade, arquiteto de segurança", "novo")
    d.node("n4", 3, 1, "entrega e negocio", "release-manager, financeiro, marca, finops", "novo")
    d.node("pj", 0, 2, "Seu projeto", ".agentes/ (estado e limites), docs/ por fase, CLAUDE.md com as regras comuns", "data", cs=2)
    d.node("ex", 2, 2, "Papéis externos", "só mapeados em fluxo.json; instalar exige proposta, aprovação e registro", "ext", cs=2)
    for n in ("n1", "n2", "n3", "n4"):
        d.edge("mk", n, route="col")
    d.edge("n1", "pj", route="col")
    d.edge("n2", "pj", route="col")
    d.edge("pj", "ex", dash=True, route="row")
    return d.save()


def e03():
    d = D(F, "e03-v0-ciclo", "v0: o ciclo de uma fase",
          "A CLI guarda o estado; a fase só avança com os artefatos presentes e uma aprovação com nome",
          6, 2, cw=160, ch=108, gx=36,
          note="Se você rejeitar, a fase continua aberta e o motivo fica no histórico. O agente não consegue editar .agentes/estado.json: o hook bloqueia.")
    r0 = [("i", "agentes init", "cria .agentes/, pastas de docs/ e regras", "novo"),
          ("s", "status e papeis", "fase atual e quem faz cada papel", "novo"),
          ("d", "Principal despacha", "briefing curto; agente próprio ou externo", "data"),
          ("a", "Artefatos", "um arquivo por entrega, mais o handoff", "data"),
          ("g", "Gates", "revisão, segurança, privacidade e QA", "sec"),
          ("v", "portao verificar", "confere se os artefatos existem", "novo")]
    for i, (k, a, b, c) in enumerate(r0):
        d.node(k, i, 0, a, b, c)
    r1 = [("ap", 5, "Você aprova", "portao aprovar --por NOME, com confirmação", "human"),
          ("av", 4, "Fase avança", "histórico grava quem e quando", "ok"),
          ("pr", 3, "Próxima fase", "repete até a fase 8", "data"),
          ("rt", 2, "Retrospectiva", "skill retro propõe melhorias", "novo"),
          ("fi", 1, "Ciclo concluído", "todos os portões aprovados", "ok")]
    for k, col, a, b, c in r1:
        d.node(k, col, 1, a, b, c)
    for x, y in zip("isdag", "sdagv"):
        d.edge(x, y)
    d.edge("v", "ap")
    for x, y in (("ap", "av"), ("av", "pr"), ("pr", "rt"), ("rt", "fi")):
        d.edge(x, y)
    return d.save()


def e04():
    d = D(F, "e04-hooks", "Proteção técnica: o que acontece a cada ação do agente",
          "Vale para as duas versões: na v0 os hooks estão no plugin nucleo; na v1, no mod guardrails",
          5, 3, cw=190, ch=100, gx=50,
          note="Os hooks são uma barreira, não um sandbox: um comando ofuscado pode escapar. Menor privilégio e aprovação humana para produção continuam necessários.")
    d.node("a", 0, 0, "Agente pede uma ação", "Bash, Read, Write, Agent...", "data")
    d.node("h", 1, 0, "Hooks antes da ação", "guarda de comandos, guarda de arquivos e orçamento da sessão", "sec", cs=2)
    d.node("x", 3, 0, "Ação executa", "quando nada barra", "ok")
    d.node("p", 4, 0, "Hook depois da ação", "só após web ou MCP", "sec")
    d.node("m", 0, 1, "Motivo volta ao agente", "ele deve relatar, não contornar", "data")
    d.node("n", 1, 1, "Negar", "a ação não acontece", "gap")
    d.node("q", 2, 1, "Perguntar a você", "confirmação na tela", "human")
    d.node("e", 4, 1, "Sessão marcada", "alerta se houver padrão de prompt injection", "gap")
    d.node("d1", 0, 2, "O que é negado", "rm -r em alvo amplo, push em ramo protegido ou forçado, --no-verify, curl | sh, ler .env e chaves, gravar segredo, teto de chamadas, loop", "data", cs=2)
    d.node("d2", 2, 2, "O que pede confirmação", "kubectl, helm, terraform, deploy, migração, publish, merge, ssh, aprovar portão e renovar orçamento", "data", cs=2)
    d.node("d3", 4, 2, "Efeito", "comandos de produção ganham aviso reforçado", "data")
    d.edge("a", "h")
    d.edge("h", "x")
    d.edge("x", "p")
    d.edge("h", "n", route="col")
    d.edge("h", "q", route="col")
    d.edge("n", "m", route="row")
    d.edge("q", "x", "se aprovar", route="h")
    d.edge("p", "e", route="col")
    d.edge("n", "d1", dash=True, route="col")
    d.edge("q", "d2", dash=True, route="col")
    d.edge("e", "d3", dash=True, route="col")
    return d.save()


def e05():
    d = D(F, "e05-v1-montagem", "v1: como a sobreposição vira uma instalação",
          "O guilda oficial não é alterado; a v1 soma arquivos novos e usa o instalador dele",
          5, 2, cw=190, ch=104, gx=48,
          note="Se o guilda mudar de versão ou passar a ter um arquivo, papel ou ação com o mesmo nome, a montagem para com erro em vez de sobrescrever.")
    d.node("g", 0, 0, "guilda 2.0.0", "checkout oficial, não alterado", "guilda")
    d.node("o", 0, 1, "overlay/", "30 arquivos novos e as adições ao catálogo", "novo")
    d.node("m", 1, 0, "montar", "copia o guilda, soma a sobreposição e valida com o motor do guilda", "novo", rs=2)
    d.node("b", 2, 0, "build/guilda 2.0.0+v1", "um guilda completo, com 31 papéis", "guilda")
    d.node("i", 3, 0, "install.py do guilda", "grava, confere e mantém o manifesto", "guilda")
    d.node("p", 4, 0, "Seu projeto", ".engineering/, 31 agentes e 15 comandos", "data")
    d.node("j", 2, 1, "3 junções mecânicas", "catálogo, lista de payload e registro do mod", "data")
    d.node("md", 3, 1, "--mod guardrails", "o Claude Code instala o plugin; linha no registro", "novo")
    d.node("up", 4, 1, "Atualização", "só pela v1, até promover ao guilda", "gap")
    d.edge("g", "m", route="row")
    d.edge("o", "m", route="row")
    d.edge("m", "b", route="row")
    d.edge("b", "i")
    d.edge("i", "p")
    d.edge("b", "j", dash=True, route="col")
    d.edge("i", "md", dash=True, route="col")
    d.edge("p", "up", dash=True, route="col")
    return d.save()


def e06():
    d = D(F, "e06-v1-resolucao", "v1: quem faz cada papel (perfil external-first)",
          "Externo instalado e registrado primeiro; depois o papel do guilda; o que sobra vira lacuna registrada",
          4, 3, cw=215, ch=96,
          note="11 papéis ficam sempre com o guilda (privacidade, usuário leigo, marca, product-owner, ingress, finops e os criados na v1). A governança é a mesma para qualquer fonte.")
    d.node("ne", 0, 0, "Papel necessário", "ex.: backend, QA, segurança", "data")
    d.node("q1", 1, 0, "Externo instalado e registrado?", "candidatos em ordem, em resolution.json", "human")
    d.node("ex", 2, 0, "Despacha o externo", "o principal passa o contrato do guilda no briefing", "ext")
    d.node("gt", 3, 0, "Gates independentes", "ao menos um de fonte diferente da do autor", "sec")
    d.node("q2", 1, 1, "Existe papel do guilda?", "o próprio papel ou a reserva indicada", "human")
    d.node("gu", 2, 1, "Despacha o papel do guilda", "contrato canônico", "guilda")
    d.node("gap", 1, 2, "Lacuna registrada", "nunca trocar por um papel parecido", "gap")
    d.node("pr", 2, 2, "Propor instalação ou criar papel", "com revisão de segurança e sua aprovação", "human")
    d.edge("ne", "q1")
    d.edge("q1", "ex", "sim")
    d.edge("ex", "gt")
    d.edge("q1", "q2", "não")
    d.edge("q2", "gu", "sim")
    d.edge("gu", "gt", route="h")
    d.edge("q2", "gap", "não")
    d.edge("gap", "pr")
    return d.save()


def e07():
    d = D(F, "e07-v1-fases", "v1: do começo do produto até o lançamento",
          "As fases novas entram antes das histórias do guilda; cada uma termina em decisão humana",
          5, 2, cw=190, ch=104, gx=44,
          note="Com o perfil github-projects, cada fase é um épico [D-N] no mesmo quadro e a seguinte só é despachada depois do estado accepted.")
    d.node("d0", 0, 0, "[D-0] Descoberta", "visão, mercado e modelo financeiro (/finance)", "novo")
    d.node("d1", 1, 0, "[D-1] Requisitos", "PRD com requisitos numerados", "novo")
    d.node("d2", 2, 0, "[D-2] Design", "UX, protótipo e rodada com usuário leigo", "novo")
    d.node("d3", 3, 0, "[D-3] Arquitetura", "decisões e modelo de ameaças (/threat-model)", "novo")
    d.node("h", 4, 0, "Histórias", "DoR e DoD, ação /story do guilda", "guilda")
    d.node("c", 4, 1, "Construção e gates", "workflow de engenharia do guilda", "guilda")
    d.node("r", 3, 1, "Release", "/release: checklist, ordem de deploy e rollback", "novo")
    d.node("l", 2, 1, "Lançamento", "plano de lançamento", "novo")
    d.node("b", 0, 1, "Quadro no GitHub Projects", "registro único de fases, histórias e aceite", "data", cs=2)
    for x, y in (("d0", "d1"), ("d1", "d2"), ("d2", "d3"), ("d3", "h")):
        d.edge(x, y)
    d.edge("h", "c", route="col")
    d.edge("c", "r")
    d.edge("r", "l")
    d.edge("l", "b", dash=True)
    return d.save()


def e08():
    d = D(F, "e08-modelos", "Gerenciador de modelos nas duas versões",
          "A ideia é a mesma: um lugar define o tier de cada papel e uma ferramenta grava o modelo nos agentes",
          4, 2, cw=215, ch=96, gy=40,
          note="Um campo model em arquivo gerado não prova que o ambiente o honrou; confira no primeiro uso.")
    d.node("a", 0, 0, "v0: modelos.json", "papel, tier e modelo de cada tier", "novo")
    d.node("b", 1, 0, "agentes modelos aplicar", "reescreve o campo model dos agentes", "novo")
    d.node("c", 2, 0, "Agentes dos plugins", "model: opus, sonnet ou haiku", "data")
    d.node("r", 3, 0, "Regra", "gates nunca abaixo do tier médio", "sec")
    d.node("a2", 0, 1, "v1: template.json", "tier por papel: deep, standard, light", "guilda")
    d.node("b2", 1, 1, "Instalação do guilda", "--tier papel=camada por projeto", "guilda")
    d.node("c2", 2, 1, ".claude/agents", "campo model gerado no projeto", "data")
    d.node("r2", 3, 1, "Regra", "o motor recusa gate abaixo de standard", "sec")
    for x, y in (("a", "b"), ("b", "c"), ("c", "r"), ("a2", "b2"), ("b2", "c2"), ("c2", "r2")):
        d.edge(x, y)
    return d.save()


def e09():
    d = D(F, "e09-evolucao", "Como as duas versões se complementam",
          "A v0 serve para experimentar; a v1 para padronizar; o que funcionar pode ser promovido ao guilda",
          4, 2, cw=215, ch=96, gy=40)
    d.node("v0", 0, 0, "v0: experimentar", "leve e sem dependência; boa para testar hooks e agentes", "novo")
    d.node("v1", 1, 0, "v1: padronizar", "governança do guilda com externo primeiro", "guilda")
    d.node("pm", 2, 0, "Promover", "o que funcionar vira proposta ao guilda", "human")
    d.node("g3", 3, 0, "guilda v3", "um só lugar; a atualização oficial volta a valer", "ok")
    d.node("m0", 0, 1, "Medir", "tokens, retrabalho e falsos positivos dos hooks", "data")
    d.node("m1", 1, 1, "Validar", "em um projeto real, antes de promover", "data")
    d.node("m2", 2, 1, "Você decide", "nada é promovido sem a sua aprovação", "human")
    d.edge("v0", "v1")
    d.edge("v1", "pm")
    d.edge("pm", "g3")
    d.edge("v0", "m0", dash=True, route="col")
    d.edge("v1", "m1", dash=True, route="col")
    d.edge("pm", "m2", dash=True, route="col")
    return d.save()


# ---------- imagens de terminal (saídas reais, com caminhos trocados por /caminho) ----------
def t01():
    return terminal(F, "t01-v0-status", "v0: iniciar um projeto e ver o estado", [
        ("$ scripts/agentes init /caminho/projeto --perfil landing", "cmd"),
        ("Projeto inicializado em /caminho/projeto (perfil landing).", None),
        ("  - estado.json criado", "dim"),
        ("  - config.json criado", "dim"),
        ("  - registro de instalações criado", "dim"),
        ("  - CLAUDE.md atualizado", "dim"),
        ("", None),
        ("$ scripts/agentes status /caminho/projeto", "cmd"),
        ("Perfil: landing | autonomia: portoes | dados pessoais: não", None),
        ("  [>] 0 Descoberta: Vale a pena construir?", "ok"),
        ("  [ ] 1 Requisitos: PRD aceito", None),
        ("  [ ] 2 Design: Protótipo aceito", None),
        ("  [ ] 5 Construção: Histórias implementadas com handoff", None),
        ("  [ ] 6 Verificação: Gates independentes aprovados", None),
        ("  [ ] 7 Entrega: Go-live", None),
        ("  [ ] 8 Crescimento: Encerrar o ciclo", None),
        ("", None),
        ("Fase atual: 0 Descoberta", None),
        ("  falta  docs/00-descoberta/visao.md", "ask"),
        ("  falta  docs/00-descoberta/mercado.md", "ask"),
        ("  falta  docs/00-descoberta/modelo-financeiro.md", "ask"),
    ])


def t02():
    return terminal(F, "t02-v0-papeis-portao", "v0: quem faz cada papel e o portão que não abre sem artefatos", [
        ("$ scripts/agentes papeis /caminho/projeto", "cmd"),
        ("Fase 0 Descoberta", None),
        ("  externo  estrategia-de-produto: VoltAgent: project-idea-validator; wshobson: before-you-build", None),
        ("  externo  analise-de-mercado: VoltAgent: market-researcher; VoltAgent: competitive-analyst", None),
        ("  próprio  analista-financeiro: negocio:analista-financeiro + skill negocio:modelo-financeiro", "ok"),
        ("  próprio  marca: negocio:estrategista-de-marca", "ok"),
        ("", None),
        ("$ scripts/agentes portao aprovar /caminho/projeto --por Ana", "cmd"),
        ("erro: portão não pode ser aprovado; faltam artefatos: docs/00-descoberta/visao.md,", "err"),
        ("      docs/00-descoberta/mercado.md, docs/00-descoberta/modelo-financeiro.md", "err"),
    ])


def t03():
    return terminal(F, "t03-hooks", "Respostas dos hooks a ações de um agente (entrada simulada)", [
        ("agente> git push origin main", "cmd"),
        ("[nucleo] BLOQUEADO: push direto no ramo protegido 'main': abra um pull request", "err"),
        ("", None),
        ("agente> cat .env", "cmd"),
        ("[nucleo] BLOQUEADO: comando expõe ou versiona arquivo sensível ('.env'); para procurar", "err"),
        ("         segredos use só listagem ou contagem (grep -l, grep -c)", "err"),
        ("", None),
        ("agente> rm -rf ~", "cmd"),
        ("[nucleo] BLOQUEADO: rm recursivo em alvo amplo ('~')", "err"),
        ("", None),
        ("agente> helm upgrade app ./chart", "cmd"),
        ("[nucleo] pede confirmação: 'helm' altera ambiente remoto ou de produção", "ask"),
    ])


def t04():
    return terminal(F, "t04-v1-montar", "v1: montar sobre o guilda e simular a instalação", [
        ("$ python3 scripts/guilda_v1.py montar", "cmd"),
        ("montado em /caminho/brainstorm/v1/build/guilda: guilda 2.0.0+v1 (base a4ae894),", None),
        ("  3 papéis, 4 ações e 30 arquivos novos", None),
        ("", None),
        ("$ python3 scripts/guilda_v1.py instalar /caminho/projeto --dry-run", "cmd"),
        ("instalação (simulação) em /caminho/projeto", None),
        ("  perfis: base, product-team, github-projects, polyrepo, vps-k3s, external-first,", "dim"),
        ("          product-discovery, nestjs-prisma, edge-cloudflare-vercel, guardrails", "dim"),
        ("  216 arquivos seriam gravados, 0 removidos", "ok"),
        ("  rode sem --dry-run para aplicar.", None),
        ("mod guardrails 0.1.0 (project) — ATENÇÃO: este mod BLOQUEIA comandos e leituras", "ask"),
        ("  (segredos, destrutivos, push em ramo protegido) e INTERROMPE o trabalho ao atingir", "ask"),
        ("  o teto de chamadas da sessão", "ask"),
    ])


ALL = [e01, e02, e03, e04, e05, e06, e07, e08, e09, t01, t02, t03, t04]
