"""Diagramas de fluxo e arquitetura."""
from lib import D, KINDS, TEXT, MUTED, BG, CARD, LINE, esc, tw

F = "fluxos"


def f01():
    d = D(F, "f01-arquitetura", "Arquitetura em camadas",
          "O guilda é o núcleo de governança; os especialistas vêm de plugins externos; você decide nos portões",
          4, 4, cw=215, ch=86,
          note="Texto de política não é controle técnico: a camada de enforcement (hooks e permissões) precisa ser verificada à parte.")
    d.node("eu", 0, 0, "Você", "decisões, aprovações e aceite final", "human", cs=4)
    d.node("pr", 0, 1, "Agente principal (gestor)", "entende o pedido, escreve histórias, escolhe especialistas e modelo; nunca implementa nem aprova o próprio trabalho", "guilda", cs=4)
    d.node("n", 0, 2, "Núcleo guilda", "gates, evidência, tiers de modelo, registro de instalação", "guilda")
    d.node("e", 1, 2, "Especialistas externos", "plugins: VoltAgent, wshobson, Anthropic, BMAD", "ext")
    d.node("m", 2, 2, "MCPs e hooks", "GitHub, Playwright, Semgrep, Serena, RTK", "ext")
    d.node("h", 3, 2, "Memória em arquivo", "handoffs, diário, estado vivo", "data")
    d.node("mo", 0, 3, "Modelos deep / standard / light", "um tier por papel, registrado no briefing", "data", cs=2)
    d.node("pj", 2, 3, "Projeto", "código, GitHub Projects, hospedagem", "data", cs=2)
    d.edge("eu", "pr", "pede / aprova", bidir=True)
    for i in ("n", "e", "m", "h"):
        d.edge("pr", i, route="col")
    d.edge("n", "mo")
    d.edge("e", "mo", dash=True)
    d.edge("m", "pj")
    d.edge("h", "pj")
    return d.save()


def f02():
    d = D(F, "f02-fases", "Fluxo em 9 fases com portões",
          "Cada fase termina em um artefato em arquivo e em uma aprovação sua antes de seguir",
          5, 2, cw=190, ch=104, gx=44)
    ph = [
        ("p0", "0 Descoberta", "estratégia, mercado, financeiro\nPortão: vale construir?"),
        ("p1", "1 Requisitos", "negócio, PM, pesquisa UX\nPortão: PRD aceito"),
        ("p2", "2 Design", "UX/UI, protótipo\nPortão: protótipo aceito"),
        ("p3", "3 Arquitetura", "arquitetura, segurança, nuvem\nPortão: ADRs aceitos"),
        ("p4", "4 Planejamento", "histórias com DoR, tasks\nPortão: backlog priorizado"),
    ]
    for i, (k, a, b) in enumerate(ph):
        d.node(k, i, 0, a, b, "human" if i == 0 else "guilda")
    back = [
        ("p5", "5 Construção", "backend, frontend, dados, infra\nPortão: revisão por story", 4),
        ("p6", "6 Verificação", "revisão, segurança, privacidade, QA\nPortão: gates", 3),
        ("p7", "7 Entrega", "CI/CD, release, deploy\nPortão: go-live", 2),
        ("p8", "8 Crescimento", "marketing, suporte, docs\nretrospectiva", 1),
    ]
    for k, a, b, c in back:
        d.node(k, c, 1, a, b, "guilda")
    d.node("rt", 0, 1, "Retrospectiva", "observações viram melhorias nos agentes e skills", "ext")
    for x, y in zip(["p0", "p1", "p2", "p3"], ["p1", "p2", "p3", "p4"]):
        d.edge(x, y)
    d.edge("p4", "p5")
    for x, y in (("p5", "p6"), ("p6", "p7"), ("p7", "p8")):
        d.edge(x, y)
    d.edge("p8", "rt", "aprende", dash=True)
    return d.save()


def f03():
    d = D(F, "f03-orquestracao", "Orquestração: o principal coordena, os especialistas executam",
          "Trabalho paralelo só com escopos de escrita separados; resultados voltam por arquivo, não por conversa",
          6, 3, cw=172, ch=92, gx=40,
          note="Resumo do contrato: um autor por vez por padrão; revisão técnica, segurança e privacidade podem rodar em paralelo (só leitura); QA roda por último.")
    d.node("pr", 0, 1, "Agente principal", "briefing de até 15 linhas, só com caminhos", "guilda")
    d.node("a", 1, 0, "Autor A", "worktree 1, escopo de escrita próprio", "ext")
    d.node("b", 1, 2, "Autor B", "worktree 2, só se o escopo for disjunto", "ext")
    d.node("h", 2, 1, "Handoff em arquivo", "até 40 linhas: arquivos, IDs, comandos", "data")
    d.node("r", 3, 0, "Revisão técnica", "só leitura", "sec")
    d.node("s", 3, 1, "Segurança", "só leitura", "sec")
    d.node("pv", 3, 2, "Privacidade", "só leitura", "sec")
    d.node("qa", 4, 1, "QA", "por último, no snapshot final", "sec")
    d.node("eu", 5, 1, "Você", "aceite final", "human")
    d.edge("pr", "a", route="v")
    d.edge("pr", "b", route="v")
    d.edge("a", "h")
    d.edge("b", "h")
    d.edge("h", "pr", "caminho + 5 a 10 linhas", dash=True, route="row")
    for g in ("r", "s", "pv"):
        d.edge("h", g)
        d.edge(g, "qa")
    d.edge("qa", "eu")
    return d.save()


def f04():
    d = D(F, "f04-gates", "Gates independentes e snapshot",
          "Quem faz não aprova; cada gate valida o mesmo snapshot e a correção volta ao autor",
          5, 3, cw=190, ch=86, gx=50,
          note="Um SHA antigo nunca aprova a árvore nova: depois de uma correção, só os gates afetados são revalidados, com novo snapshot.")
    d.node("au", 0, 0, "Autor implementa", "especialista designado", "ext")
    d.node("sn", 1, 0, "Snapshot", "SHA, base de comparação e arquivos não rastreados com hashes", "data")
    d.node("r", 2, 0, "Revisão técnica", "instância independente", "sec")
    d.node("s", 3, 0, "Segurança", "IDOR, injeção, segredos, IAM", "sec")
    d.node("pv", 4, 0, "Privacidade", "LGPD, menores, dark patterns", "sec")
    d.node("fi", 2, 1, "Findings com ID estável", "severidade, local, evidência, autor do achado", "gap")
    d.node("qa", 4, 1, "QA adversarial", "tenta quebrar a entrega", "sec")
    d.node("fx", 0, 2, "Correção pelo autor", "nunca pelo revisor", "ext")
    d.node("rv", 2, 2, "Revalidação parcial", "só gates afetados, novo snapshot", "guilda")
    d.node("pc", 4, 2, "Principal consolida", "confere cobertura e IDs em aberto", "guilda")
    d.edge("au", "sn")
    d.edge("sn", "r")
    d.edge("r", "s", dash=True)
    d.edge("s", "pv", dash=True)
    d.edge("r", "fi", route="col")
    d.edge("pv", "qa", route="col")
    d.edge("qa", "fi", "achados", route="row")
    d.edge("fi", "fx", route="h")
    d.edge("fx", "rv")
    d.edge("rv", "pc")
    return d.save()


def f05():
    d = D(F, "f05-resolucao-agentes", "Como escolher quem faz cada papel",
          "Regra definida por você: ferramenta externa primeiro, guilda como reserva, o resto vai para decisão conjunta",
          4, 3, cw=215, ch=86,
          note="Mudar a regra do guilda (agentes de catálogo nunca substituem papel canônico) exige um ADR registrando a decisão.")
    d.node("ne", 0, 0, "Papel necessário", "ex.: segurança de aplicação", "data")
    d.node("q1", 1, 0, "Existe em ferramenta externa?", "VoltAgent, wshobson, Anthropic, BMAD", "human")
    d.node("ext", 2, 0, "Usar o externo", "proposta, aprovação e registro de instalação", "ext")
    d.node("ok", 3, 0, "Papel atendido", "registrado no staffing do projeto", "ok")
    d.node("q2", 1, 1, "Existe no guilda?", "28 papéis, 11 ações, 3 skills", "human")
    d.node("gu", 2, 1, "Usar o guilda", "e listar na tabela de usados do guilda", "guilda")
    d.node("gap", 1, 2, "Lacuna", "nenhum dos dois cobre", "gap")
    d.node("ju", 2, 2, "Pensar juntos", "criar papel, comprar, adiar ou aceitar o risco", "human")
    d.edge("ne", "q1")
    d.edge("q1", "ext", "sim")
    d.edge("ext", "ok")
    d.edge("q1", "q2", "não")
    d.edge("q2", "gu", "sim")
    d.edge("gu", "ok", route="h")
    d.edge("q2", "gap", "não")
    d.edge("gap", "ju")
    return d.save()


def f06():
    d = D(F, "f06-aprovacao-instalacao", "Como um plugin, skill ou MCP entra no projeto",
          "Nada é instalado, ativado ou concedido sem proposta, revisão de segurança, aprovação sua e registro",
          5, 2, cw=190, ch=102, gx=48,
          note="Seis critérios na proposta: necessidade, procedência, adoção, revisão de segurança, escopo mínimo e reversibilidade. Popularidade sozinha não prova segurança.")
    d.node("n", 0, 0, "1 Necessidade", "lacuna documentada no staffing", "data")
    d.node("p", 1, 0, "2 Proposta", "candidato, 6 critérios, comando, escopo e rollback", "guilda")
    d.node("s", 2, 0, "3 Revisão de segurança", "manifesto, prompts, hooks, MCP e scripts, por instância independente", "sec")
    d.node("a", 3, 0, "4 Você aprova", "explícito; silêncio não vale", "human")
    d.node("rj", 4, 0, "Rejeitado", "registra a tentativa e o motivo", "gap")
    d.node("i", 3, 1, "5 Instala", "escopo de projeto, versão ou commit fixado", "ext")
    d.node("v", 2, 1, "6 Verifica", "sonda limitada confirma a descoberta", "sec")
    d.node("r", 1, 1, "7 Registra", "registro-instalacoes.md: fonte, versão, data, aprovador e remoção", "ok")
    d.edge("n", "p")
    d.edge("p", "s")
    d.edge("s", "a")
    d.edge("a", "rj", "não", dash=True)
    d.edge("a", "i", "sim")
    d.edge("i", "v")
    d.edge("v", "r")
    return d.save()


def f07():
    d = D(F, "f07-economia-tokens", "Economia de tokens: problema, remédio e cuidado",
          "Cada camada ataca um ponto de desperdício; meça com /cost antes e depois de ligar cada uma",
          3, 6, cw=300, ch=70, gx=70, gy=26,
          note="Percentuais de economia citados pelos projetos (RTK, Headroom) são alegações deles, medidas em cenários próprios.")
    rows = [
        ("Saída longa de comandos de shell", "RTK (hook PreToolUse em Bash)", "Não cobre Read, Grep e Glob", "ext"),
        ("Ler arquivos inteiros para achar um símbolo", "Serena (busca e edição por símbolo via LSP)", "Ganho maior em código grande", "ext"),
        ("Contexto longo reenviado a cada turno", "Headroom (proxy ou MCP) por último", "Confirmar compatibilidade e canônico", "ext"),
        ("Reexplicar o projeto a cada sessão", "Handoffs em arquivo; claude-mem opcional", "Memória automática também gasta tokens", "ext"),
        ("Agentes pesados retomados e briefings enormes", "Briefing por referência; novo agente em vez de retomar", "Regra do guilda: não retomar acima de ~150 mil", "guilda"),
        ("Modelo caro em tarefa mecânica", "Tiers deep / standard / light por papel", "Gate nunca abaixo de standard", "guilda"),
    ]
    for i, (a, b, c, k) in enumerate(rows):
        d.node(f"a{i}", 0, i, a, "", "gap")
        d.node(f"b{i}", 1, i, b, "", k)
        d.node(f"c{i}", 2, i, c, "", "data")
        d.edge(f"a{i}", f"b{i}")
        d.edge(f"b{i}", f"c{i}")
    return d.save()


def f08():
    d = D(F, "f08-tiers-modelos", "Camadas de modelo e quando subir ou descer",
          "O principal escolhe o tier mais barato que resolve e registra \"Model: tier, motivo\" no briefing",
          3, 4, cw=290, ch=104, gx=70, gy=34,
          note="Hoje no guilda: deep = Opus, standard = Sonnet, light = Haiku. Um campo no arquivo gerado não prova que o runtime honrou o modelo.")
    d.node("top", 0, 0, "Sinais para escolher, em ordem", "raio de impacto, novidade e ambiguidade, tamanho do contexto, falha anterior, custo do erro versus custo do tier", "guilda", cs=3)
    d.node("l", 0, 1, "light", "formatar LOG e changelog, índices, resumos de status, renomear, testes com usuário leigo simulado", "ok")
    d.node("s", 1, 1, "standard (padrão)", "implementação, design, copy, QA, revisão técnica, planejamento dentro de um design aprovado", "ext")
    d.node("p", 2, 1, "deep", "arquitetura com trade-offs, julgamento de segurança e privacidade, decisões irreversíveis, desempate", "gap")
    d.node("u1", 0, 2, "Sobe para standard", "duas falhas, ambiguidade que o briefing não resolve ou qualquer necessidade de julgar", "data")
    d.node("u2", 1, 2, "Sobe para deep", "gate em caminho crítico, decisão irreversível ou veredictos em conflito", "data")
    d.node("u3", 2, 2, "Desce para standard", "depois que a decisão difícil virou ADR ou especificação escrita", "data")
    d.node("bot", 0, 3, "Regra de ouro", "nenhum gate (segurança, privacidade, revisor de alto risco) roda abaixo de standard, mesmo para economizar", "sec", cs=3)
    d.edge("l", "s")
    d.edge("s", "p")
    d.edge("l", "u1", dash=True)
    d.edge("s", "u2", dash=True)
    d.edge("p", "u3", dash=True)
    return d.save()


def f09():
    d = D(F, "f09-fronteiras-dados", "Para onde o dado pode ir",
          "Cada seta que cruza uma fronteira precisa de aprovação, retenção definida e nenhum segredo",
          3, 6, cw=250, ch=64, gx=110, gy=28,
          note="Repositório público (como este) nunca recebe domínio, IP ou nome interno de projeto privado. Varredura de segredos reporta onde, nunca o quê.")
    d.group(0, 0, 1, 6, "Sua máquina ou container", "guilda")
    d.group(1, 0, 1, 2, "Confiança contratual", "ext")
    d.group(2, 2, 1, 3, "Terceiros (só com aprovação)", "gap")
    d.node("cc", 0, 0, "Claude Code", "sessão, subagentes, hooks", "guilda")
    d.node("an", 1, 0, "API do modelo", "recebe prompts e código", "ext")
    d.node("rp", 0, 1, "Repositório local", ".env protegido por regra deny", "gap")
    d.node("gh", 1, 1, "GitHub", "repositório público ou privado", "ext")
    d.node("lo", 0, 2, "Ferramentas locais", "hooks, RTK, Serena", "ext")
    d.node("sg", 2, 2, "Semgrep hospedado", "recebe código para análise", "gap", badge="envia código")
    d.node("cf", 0, 3, "Configuração do cliente", "ANTHROPIC_BASE_URL", "ext")
    d.node("gw", 2, 3, "Gateways de modelo", "OmniRoute e roteadores gratuitos", "gap", badge="evitar")
    d.node("ms", 0, 4, "Servidores MCP", "permissão mínima por agente", "ext")
    d.node("mt", 2, 4, "MCPs de terceiros", "remotos, fora do seu controle", "gap")
    d.node("me", 0, 5, "Memória local", "claude-mem guarda trechos das sessões", "gap", badge="revisar retenção")
    d.node("mn", 1, 5, "Fica na máquina", "definir retenção e revisar o que é guardado", "data", cs=2)
    d.edge("cc", "an", "prompts e código")
    d.edge("rp", "gh", "push")
    d.edge("lo", "sg", "código para análise", dash=True, color="#f87171")
    d.edge("cf", "gw", "prompts e código", dash=True, color="#f87171")
    d.edge("ms", "mt", "conforme permissão", dash=True, color="#f87171")
    d.edge("me", "mn", dash=True)
    return d.save()


def f10():
    d = D(F, "f10-stack-hospedagem", "Stack padrão e hospedagem em três provedores",
          "Cloudflare na borda, Vercel para o front, Hostinger (VPS com Kubernetes, a confirmar) para back e dados",
          5, 3, cw=190, ch=86, gx=50,
          note="A infraestrutura em VPS com Kubernetes foi inferida da estrutura de pastas dos repositórios de infra, não confirmada em produção.")
    d.node("u", 0, 1, "Usuário", "navegador ou app", "data")
    d.node("cf", 1, 1, "Cloudflare", "DNS, CDN, WAF, Turnstile (R2 e Workers se precisar)", "ext")
    d.node("vc", 2, 0, "Vercel", "front React com previews por PR", "ext")
    d.node("tr", 2, 2, "Hostinger VPS", "Traefik de entrada, k3s, OpenTelemetry", "ext")
    d.node("bff", 3, 2, "BFF NestJS", "agrega e protege a API", "guilda")
    d.node("sv", 4, 2, "Serviços NestJS", "identidade, cobrança, treino", "guilda")
    d.node("db", 4, 1, "Postgres e Redis", "Prisma, ioredis", "data")
    d.node("pk", 3, 0, "Pacotes @escopo", "contratos, schemas, authz (GitHub Packages)", "data")
    d.node("st", 4, 0, "Stripe", "cobrança", "ext")
    d.edge("u", "cf")
    d.edge("cf", "vc", "front", route="v")
    d.edge("cf", "tr", "API", route="v")
    d.edge("tr", "bff")
    d.edge("bff", "sv")
    d.edge("sv", "db", route="col")
    d.edge("sv", "st", dash=True, route="v")
    d.edge("vc", "pk", dash=True, route="row")
    return d.save()


def f11():
    d = D(F, "f11-cicd", "Pipeline CI/CD padrão",
          "Pull request testa; merge em main publica a imagem e pede o deploy ao repositório de infra",
          4, 3, cw=215, ch=86,
          note="Boas práticas a aplicar: ações fixadas por SHA, permissions mínimas, varredura de segredos, Trivy e Checkov, ambiente de produção com aprovação obrigatória.")
    d.node("pr", 0, 0, "Pull request", "branch protegida, revisão obrigatória", "data")
    d.node("t", 1, 0, "Testes", "lint, typecheck, testes, build, bundle", "sec")
    d.node("sc", 2, 0, "Varreduras", "segredos, dependências, imagem, IaC", "sec")
    d.node("m", 3, 0, "Merge em main", "histórico linear, commits assinados", "guilda")
    d.node("im", 3, 1, "Imagem no registry", "GHCR, tag por SHA", "ext")
    d.node("dp", 2, 1, "Pedido de deploy", "repository_dispatch para o repositório de infra", "ext")
    d.node("hv", 1, 1, "Atualiza versões", "arquivo de versões por ambiente e helm upgrade", "ext")
    d.node("ap", 0, 1, "Aprovação humana", "obrigatória em produção", "human")
    d.node("sr", 1, 2, "Observabilidade", "traces, métricas e logs sem segredo", "ok")
    d.node("rb", 2, 2, "Rollback", "tag anterior pronta e testada", "gap")
    d.edge("pr", "t")
    d.edge("t", "sc")
    d.edge("sc", "m")
    d.edge("m", "im", route="col")
    d.edge("im", "dp")
    d.edge("dp", "hv")
    d.edge("hv", "ap", dash=True)
    d.edge("hv", "sr", route="col")
    d.edge("sr", "rb", dash=True)
    return d.save()


def f12():
    d = D(F, "f12-github-projects-estados", "GitHub Projects: nove estados e quem move cada um",
          "O Status segue a autoridade, não eventos do repositório; as automações nativas de Status ficam desligadas",
          5, 3, cw=190, ch=86, gx=50,
          note="Cores: verde-água = principal; azul = quem executa; roxo = validadores independentes; âmbar = você. Nunca existe estado Done.")
    d.node("o", 0, 0, "open", "planejado, não agendado (principal)", "guilda")
    d.node("pe", 1, 0, "pending", "briefing pronto (principal)", "guilda")
    d.node("ip", 2, 0, "in-progress", "trabalho ativo (instância designada)", "ext")
    d.node("ir", 3, 0, "in-review", "entregue para validação (autor envia)", "sec")
    d.node("c", 4, 0, "completed", "verificado com evidência (principal)", "guilda")
    d.node("b", 2, 1, "blocked", "impedimento ou decisão pendente", "gap")
    d.node("rj", 3, 1, "rejected", "defeito devolvido ao autor (validador)", "gap")
    d.node("ac", 4, 1, "accepted", "aceito explicitamente por você", "human")
    d.node("cl", 4, 2, "closed", "fechamento de sprint ou abandono", "guilda")
    d.edge("o", "pe")
    d.edge("pe", "ip")
    d.edge("ip", "ir")
    d.edge("ir", "c")
    d.edge("ip", "b", dash=True, route="col")
    d.edge("ir", "rj", dash=True, route="col")
    d.edge("c", "ac", route="col")
    d.edge("ac", "cl", route="col")
    return d.save()


def f13():
    d = D(F, "f13-guilda-vs-plano", "Guilda versus planejamento: o que cada um tem",
          "O planejamento vira o roteiro da v3 do guilda, não um projeto paralelo",
          3, 6, cw=300, ch=62, gx=40, gy=18)
    d.group(0, 0, 1, 5, "Só no guilda (existe e é testado)", "guilda")
    d.group(1, 0, 1, 5, "Nos dois", "data")
    d.group(2, 0, 1, 5, "Só no planejamento (ainda não existe)", "ext")
    g = ["Gates independentes e evidência por snapshot", "CLI, upgrade com manifesto, 10 perfis", "Registro de instalação e LGPD como gate", "20 templates de handoff, brief e findings", "Contrato do GitHub Projects com scripts"]
    b = ["Camadas de modelo por papel", "Economia de tokens e RTK/Serena", "Superpowers como motor de fases", "Hostinger como alvo", "Perfis e catálogo de plugins"]
    p = ["Fases 0 a 3: descoberta, requisitos, design", "Mapa BMAD, wshobson, Semgrep, marketing", "Hooks de enforcement e teto de custo", "Cloudflare e Vercel como alvos", "Medição de tokens e projeto piloto"]
    for i in range(5):
        d.node(f"g{i}", 0, i, g[i], "", "guilda")
        d.node(f"b{i}", 1, i, b[i], "", "data")
        d.node(f"p{i}", 2, i, p[i], "", "ext")
    d.node("res", 0, 5, "Resultado: guilda como núcleo, ecossistema como equipe, módulos do plano como v3", "", "ok", cs=3)
    return d.save()


def f14():
    d = D(F, "f14-roadmap", "Roteiro em 7 marcos",
          "Cada marco termina com algo verificável; os marcos 4 e 5 só avançam com as lacunas decididas",
          7, 1, cw=150, ch=150, gx=28,
          note="Datas ficam em aberto até você priorizar. A ordem proposta reduz risco: primeiro decisões e atualização, depois plugins, papéis, enforcement, medição e orquestração completa.")
    ms = [
        ("M0 Decisões", "ADRs: guilda é o núcleo, externo primeiro, stack padrão, GitHub público ou privado", "human"),
        ("M1 Atualizar", "aura-* para o guilda 2.0, CLAUDE.md corrigido, stack alinhada", "guilda"),
        ("M2 Plugins", "pacote único de proposta: oficiais, VoltAgent, wshobson, BMAD", "ext"),
        ("M3 Papéis novos", "financeiro, Cloudflare, Vercel, release, fases 0 a 3, NestJS+Prisma", "guilda"),
        ("M4 Enforcement", "hooks, deny rules, teto de custo, defesa contra prompt injection", "sec"),
        ("M5 Medição", "linha de base com /cost, RTK, Serena, depois Headroom; piloto", "ok"),
        ("M6 Orquestração", "ciclo ponta a ponta com retrospectiva e Task Observer", "ext"),
    ]
    for i, (a, b, k) in enumerate(ms):
        d.node(f"m{i}", i, 0, a, b, k)
        if i:
            d.edge(f"m{i - 1}", f"m{i}")
    return d.save()


def f16():
    d = D(F, "f16-enforcement", "Do texto ao controle técnico",
          "Cada camada protege contra algo diferente; só as três últimas são enforcement de verdade",
          5, 2, cw=190, ch=118, gx=44,
          note="Exemplos de regras a escrever: negar leitura de .env, negar rm -rf e push em main, exigir aprovação para comandos de produção, bloquear commit com segredo e uso de --no-verify.")
    d.node("t", 0, 0, "1 Texto", "regras em markdown. Orienta, não impede. Um agente pode ignorar", "gap", badge="não é controle")
    d.node("p", 1, 0, "2 Permissões", "allow, ask e deny do Claude Code por ferramenta e caminho", "sec")
    d.node("h", 2, 0, "3 Hooks", "PreToolUse bloqueia ou reescreve; PostToolUse escaneia", "sec")
    d.node("a", 3, 0, "4 Ambiente", "worktree isolada, rede restrita, credenciais de curta duração", "sec")
    d.node("hu", 4, 0, "5 Humano", "aprovação explícita para produção, IAM, migração, destrutivo", "human")
    d.node("ex", 0, 1, "Já existe no guilda", "o texto (políticas safety, installations, evidence)", "guilda", cs=2)
    d.node("fa", 2, 1, "Falta escrever", "deny rules, hooks de bloqueio, teto de custo", "gap", cs=3)
    for x, y in zip("tpha", ["p", "h", "a", "hu"]):
        d.edge(x, y)
    return d.save()


def f17():
    d = D(F, "f17-historia", "Ciclo de uma história",
          "Da ideia ao aceite: nada avança sem Definition of Ready e nada fecha sem Definition of Done",
          6, 2, cw=160, ch=104, gx=36)
    steps = [
        ("i", "Ideia", "pedido ou requisito", "data"),
        ("sp", "Spec", "brainstorm aprovado", "ext"),
        ("hi", "História", "Given/When/Then, regras, DoR", "guilda"),
        ("pl", "Plano", "tasks pequenas, donos e modelos", "ext"),
        ("im", "Implementação", "TDD em worktree, um PR por story", "ext"),
        ("rv", "Revisão", "técnica e independente", "sec"),
    ]
    for i, (k, a, b, c) in enumerate(steps):
        d.node(k, i, 0, a, b, c)
    back = [
        ("ac", "accepted", "você aceita", "human", 0),
        ("co", "completed", "evidência reexecutada", "ok", 1),
        ("dd", "DoD", "critérios provados", "guilda", 2),
        ("qa", "QA", "adversarial", "sec", 3),
        ("pv", "Privacidade", "se há dado pessoal", "sec", 4),
        ("se", "Segurança", "gate obrigatório", "sec", 5),
    ]
    for k, a, b, c, col in back:
        d.node(k, col, 1, a, b, c)
    for x, y in zip(["i", "sp", "hi", "pl", "im"], ["sp", "hi", "pl", "im", "rv"]):
        d.edge(x, y)
    d.edge("rv", "se")
    d.edge("se", "pv")
    d.edge("pv", "qa")
    d.edge("qa", "dd")
    d.edge("dd", "co")
    d.edge("co", "ac")
    return d.save()


def f15():
    # matriz de cobertura em coordenadas absolutas
    rows = [
        ("Ideia e mercado", "VoltAgent project-idea-validator, market-researcher; wshobson before-you-build", "", "ext"),
        ("Requisitos e PM", "VoltAgent business-analyst, product-manager; Anthropic product-management", "", "ext"),
        ("Financeiro de produto", "wshobson startup-business-analyst (parcial)", "", "gap"),
        ("Marketing e SEO", "Anthropic marketing; VoltAgent content-marketer, seo-specialist", "", "ext"),
        ("Marca", "", "brand-strategist", "guilda"),
        ("Protótipo e design", "Anthropic figma, superdesign; VoltAgent ui-designer", "", "ext"),
        ("UX leigo e usabilidade", "", "lay-user, ação usability", "guilda"),
        ("Scrum Master", "VoltAgent scrum-master, backlog-grooming", "", "ext"),
        ("Histórias DoR/DoD", "", "ação story, product-owner", "guilda"),
        ("Backend e frontend", "VoltAgent backend-developer, typescript-pro, react-specialist", "", "ext"),
        ("NestJS + Prisma específico", "", "backend (versão antiga cita MikroORM)", "gap"),
        ("Docker, k8s, infra", "VoltAgent docker-expert, kubernetes-specialist, devops-engineer", "", "ext"),
        ("Ingress, TLS, WAF", "", "ingress", "guilda"),
        ("Cloud", "VoltAgent cloud-architect; Anthropic aws-core", "", "ext"),
        ("Hostinger, Vercel", "Anthropic hostinger, vercel", "hosting (conhecimento)", "ext"),
        ("Cloudflare", "Anthropic cloudflare (foco em Workers)", "", "gap"),
        ("Segurança app e infra", "Anthropic semgrep, security-guidance, aikido; VoltAgent security-auditor", "", "ext"),
        ("Privacidade LGPD", "", "privacy-compliance", "guilda"),
        ("Revisão e QA", "Anthropic code-review, playwright; VoltAgent qa-expert", "", "ext"),
        ("CI/CD, deploy, SRE", "wshobson cicd-automation, deployment-strategies; VoltAgent sre-engineer", "", "ext"),
        ("FinOps", "", "finops (centrado em AWS)", "guilda"),
        ("Release manager", "", "", "gap"),
        ("Teto de custo e prompt injection", "", "", "gap"),
    ]
    W, rh, top = 1180, 30, 124
    H = top + len(rows) * rh + 70
    d = D(F, "f15-cobertura-agentes", "Mapa de cobertura dos papéis",
          "Externo primeiro; guilda quando só ele existe; vermelho é lacuna para decidirmos juntos",
          1, 1, width=W, height=H)
    x0 = 36
    c1, c2, c3 = x0, x0 + 230, x0 + 760
    d.text(c1, top - 12, "Função", 12, TEXT, bold=True)
    d.text(c2, top - 12, "Ferramenta externa escolhida", 12, TEXT, bold=True)
    d.text(c3, top - 12, "Do guilda", 12, TEXT, bold=True)
    for i, (fn, ex, gu, k) in enumerate(rows):
        y = top + i * rh
        stroke, fill = KINDS[k]
        d.raw.append(f'<rect x="{x0 - 8}" y="{y}" width="{W - 2 * x0 + 16}" height="{rh - 4}" rx="6" fill="{fill}" stroke="{stroke}" stroke-width="1"/>')
        d.raw.append(f'<rect x="{x0 - 8}" y="{y}" width="5" height="{rh - 4}" rx="2" fill="{stroke}"/>')
        d.text(c1, y + 18, fn, 12, TEXT, bold=True)
        d.text(c2, y + 18, ex if ex else "—", 11, MUTED)
        d.text(c3, y + 18, gu if gu else "—", 11, MUTED)
    d.used.update({"ext", "guilda", "gap"})
    return d.save()


def f18():
    cols = [
        ("open", "guilda"), ("pending", "guilda"), ("in-progress", "ext"), ("in-review", "sec"),
        ("rejected", "gap"), ("blocked", "gap"), ("completed", "guilda"), ("accepted", "human"), ("closed", "data"),
    ]
    cards = {
        0: [("[S-014] Cadastro com e-mail", "story · medium")],
        1: [("[task-3] Contrato da API", "task · high · backend")],
        2: [("[task-4] Tela de login", "task · high · frontend"), ("[task-5] Testes e2e", "task · medium · qa")],
        3: [("[task-2] Rate limit", "task · high · security")],
        4: [("[bug-7] Foco perdido no modal", "bug · low")],
        5: [("[S-009] Pagamento", "story · aguarda decisão")],
        6: [("[S-006] Recuperar senha", "story · evidência anexada")],
        7: [("[S-003] Perfil do aluno", "story · aceito")],
        8: [("[E-01] Fundação", "epic · fechado")],
    }
    cw, gap, top = 152, 10, 136
    W = 36 * 2 + 9 * cw + 8 * gap
    H = top + 262
    d = D(F, "f18-kanban-exemplo", "Exemplo do quadro no GitHub Project",
          "Ilustração: cartões fictícios para mostrar os nove estados, não dados reais",
          1, 1, width=W, height=H)
    for i, (name, k) in enumerate(cols):
        x = 36 + i * (cw + gap)
        stroke, fill = KINDS[k]
        d.raw.append(f'<rect x="{x}" y="{top - 28}" width="{cw}" height="236" rx="10" fill="{CARD}" stroke="{stroke}" stroke-width="1.2"/>')
        d.raw.append(f'<text x="{x + cw / 2}" y="{top - 9}" font-size="12" font-weight="700" fill="{stroke}" text-anchor="middle">{name}</text>')
        for j, (t, s) in enumerate(cards.get(i, [])):
            y = top + j * 92
            d.raw.append(f'<rect x="{x + 7}" y="{y}" width="{cw - 14}" height="82" rx="8" fill="{BG}" stroke="{stroke}" stroke-width="1"/>')
            from lib import wrap
            for n, ln in enumerate(wrap(t, 10.5, cw - 28, True)[:3]):
                d.raw.append(f'<text x="{x + 14}" y="{y + 17 + n * 13}" font-size="10.5" font-weight="700" fill="{TEXT}">{esc(ln)}</text>')
            for n, ln in enumerate(wrap(s, 9.5, cw - 28)[:2]):
                d.raw.append(f'<text x="{x + 14}" y="{y + 62 + n * 12}" font-size="9.5" fill="{MUTED}">{esc(ln)}</text>')
    d.used.update({"guilda", "ext", "sec", "gap", "human"})
    return d.save()


ALL = [f01, f02, f03, f04, f05, f06, f07, f08, f09, f10, f11, f12, f13, f14, f15, f16, f17, f18]
