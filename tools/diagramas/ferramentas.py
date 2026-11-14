"""Um diagrama por ferramenta: cinco passos em linha e duas notas (ganho e cuidado)."""
from lib import D

F = "ferramentas"


def tool(name, title, sub, steps, gain, care, care_kind="gap", badge=None, note=None, badge_at=1):
    d = D(F, name, title, sub, 5, 2, cw=192, ch=102, gx=46, gy=40, note=note)
    for i, (label, s, kind) in enumerate(steps):
        d.node(f"s{i}", i, 0, label, s, kind, badge=badge if i == badge_at else None)
        if i:
            d.edge(f"s{i - 1}", f"s{i}")
    d.node("g", 0, 1, "Ganho", gain, "ok", cs=2)
    d.node("c", 2, 1, "Cuidado", care, care_kind, cs=3)
    return d.save()


def t01():
    return tool("t01-rtk", "RTK: comprime a saída dos comandos de shell",
                "Um hook reescreve o comando de Bash; só o essencial da saída chega ao modelo",
                [("Claude Code", "chama a ferramenta Bash", "guilda"),
                 ("Hook PreToolUse", "instalado com rtk init -g em settings.json", "sec"),
                 ("Comando roda", "git, npm, ls, cargo, testes", "data"),
                 ("RTK filtra", "remove ruído e repetição da saída", "ext"),
                 ("Modelo recebe", "versão compacta da saída", "ok")],
                "Reduz tokens de saída de mais de 100 comandos comuns. O projeto alega de 60% a 90%, medido em cenários próprios.",
                "Read, Grep e Glob nativos não passam pelo hook de Bash, então não são comprimidos. Existe outro pacote chamado rtk no crates.io, sem relação: instale pelo repositório rtk-ai.")


def t02():
    return tool("t02-serena", "Serena: leitura e edição de código por símbolo",
                "Servidor MCP com servidor de linguagem (LSP): devolve o trecho certo, não o arquivo inteiro",
                [("Claude Code", "pergunta onde está a função X", "guilda"),
                 ("MCP Serena", "processo local via stdio (uvx)", "ext"),
                 ("Language server", "LSP do TypeScript do projeto", "ext"),
                 ("Índice de símbolos", "definições e referências", "data"),
                 ("Resposta mínima", "só o trecho e quem o usa", "ok")],
                "Evita ler arquivos inteiros e permite editar por símbolo. O efeito é maior em código grande.",
                "Servidor de linguagem vazio não prova que funciona. Ativar exige confiar no projeto. Não copiar memórias, caches nem configurações globais pessoais.",
                note="Complementa o RTK: o RTK cuida da saída do shell, o Serena da leitura de código.")


def t03():
    return tool("t03-headroom", "Headroom: compressão de contexto antes do modelo",
                "Camada local entre o agente e o modelo; guarda o original para recuperar sob demanda",
                [("Claude Code", "envia mensagens e resultados de ferramentas", "guilda"),
                 ("Proxy local", "porta escolhida, exemplo 8787", "ext"),
                 ("Compressão", "tira redundância e ruído", "ext"),
                 ("Cache do original", "recuperável pelo modelo", "data"),
                 ("API do modelo", "recebe menos tokens", "ok")],
                "Alega de 60% a 95% menos tokens em cenários próprios, com prefixo estável para o cache do provedor.",
                "É um proxy e interage com roteadores de modelo. Há muitos forks: confirmar o repositório canônico. Compatibilidade com a API da Anthropic a confirmar. Entra por último na ordem de adoção.",
                badge="a confirmar")


def t04():
    return tool("t04-claude-mem", "claude-mem: memória persistente entre sessões",
                "Observa o que o agente faz, comprime e injeta o que importa na próxima sessão",
                [("Hooks de ciclo de vida", "observam a sessão", "sec"),
                 ("Compressão", "resume as observações", "ext"),
                 ("Banco local", "pesquisável", "data"),
                 ("Nova sessão", "busca o contexto relevante", "ext"),
                 ("Contexto injetado", "sem reexplicar o projeto", "ok")],
                "Não é preciso reexplicar o projeto a cada sessão e a busca é pesquisável.",
                "Guarda trechos das sessões, que podem conter segredos e dados pessoais. A injeção também consome tokens. Não está no marketplace oficial: revisar o código, definir retenção e medir o saldo antes de adotar.",
                badge="revisar privacidade")


def t05():
    return tool("t05-superpowers", "Superpowers: motor de fases de desenvolvimento",
                "Habilidades encadeadas do pedido até a verificação; o guilda já o prefere como motor",
                [("brainstorming", "especificação aprovada", "ext"),
                 ("writing-plans", "plano em tarefas pequenas", "ext"),
                 ("subagent-driven", "um subagente por tarefa", "ext"),
                 ("Revisão em 2 etapas", "conformidade e qualidade", "sec"),
                 ("verification", "evidência antes de concluir", "ok")],
                "TDD vermelho-verde-refatora, tarefas isoladas e verificação obrigatória. Já está no marketplace oficial.",
                "O guilda define responsabilidades e artefatos e não reimplementa o motor. Estado privado (.superpowers) não deve ser copiado sem inspecionar o produtor.",
                care_kind="data")


def t06():
    return tool("t06-bmad", "BMAD-METHOD: fases de produto até as histórias",
                "Método de desenvolvimento ágil com agentes, cobrindo planejamento e entrega",
                [("Clarificar", "ideia ainda vaga", "ext"),
                 ("Planejar", "PRD e arquitetura", "ext"),
                 ("Histórias", "Scrum Master detalha o trabalho", "ext"),
                 ("Construir e verificar", "implementação e testes", "ext"),
                 ("Aprender e ajustar", "volta ao planejamento", "ok")],
                "Cobriria as fases 1 a 4 do fluxo. Há módulos opcionais: Founder, Test Architect e Loop (épico sem supervisão).",
                "O README consultado não lista os papéis nem confirma suporte ao Claude Code. Verificar antes de adotar. Instala com npx bmad-method install (Node 20.12+, Python 3.10+, uv).",
                badge="a verificar")


def t07():
    return tool("t07-voltagent", "VoltAgent: catálogo de subagentes por categoria",
                "Dez categorias de agentes prontos, instalados como plugins por categoria",
                [("Marketplace", "VoltAgent/awesome-claude-code-subagents", "ext"),
                 ("Escolher categoria", "dev, infra, qualidade, negócio...", "human"),
                 ("Proposta", "critérios e revisão de segurança", "sec"),
                 ("Agentes no projeto", "definições .md em .claude", "data"),
                 ("Principal despacha", "por papel e tier", "guilda")],
                "Cerca de 170 nomes em dez categorias, incluindo backend, frontend, docker, kubernetes, SRE, segurança, QA, PM e Scrum Master.",
                "Não tem agente de marca. Agentes de catálogo complementam, não substituem papéis canônicos do guilda sem um ADR. Revisar prompts e dependências MCP, como o gerador de imagens.")


def t08():
    return tool("t08-wshobson", "wshobson/agents: marketplace de plugins de engenharia",
                "Cerca de 94 plugins, 202 agentes e 185 skills; instalar só o necessário",
                [("Adicionar marketplace", "/plugin marketplace add", "ext"),
                 ("Escolher plugins", "poucos por perfil", "human"),
                 ("Revisar", "manifesto, hooks e scripts", "sec"),
                 ("Instalar", "agentes, skills e comandos", "ext"),
                 ("Perfil do projeto", "habilitado só onde usa", "guilda")],
                "Plugins úteis: deployment-strategies, observability-monitoring, security-compliance, conductor e block-no-verify.",
                "Adicionar o marketplace não carrega nada, mas instalar tudo custa contexto e atenção. As contagens mudam a cada versão.",
                care_kind="data")


def t09():
    d = D(F, "t09-marketplace-oficial", "Marketplace oficial da Anthropic",
          "Catálogo curado; a Anthropic não controla o conteúdo dos plugins, então a revisão continua obrigatória",
          4, 2, cw=215, ch=116, gx=46, gy=46,
          note="Plugins confirmados na leitura do catálogo. frontend-design e claude-mem não foram confirmados no trecho lido; claude-mem tem marketplace próprio.")
    d.node("m", 0, 0, "claude-plugins-official", "claude plugin marketplace add anthropics/claude-plugins-official", "ext", cs=4)
    d.node("a", 0, 1, "Fluxo e revisão", "superpowers, code-review, pr-review-toolkit, security-guidance, hookify, claude-code-setup", "ext")
    d.node("b", 1, 1, "Segurança", "semgrep, aikido, claude-security, sonarqube", "sec")
    d.node("c", 2, 1, "Entrega e operação", "github, vercel, cloudflare, hostinger, sentry, stripe, supabase", "ext")
    d.node("e", 3, 1, "Qualidade e design", "playwright, figma, serena, session-report, context7", "ext")
    for k in "abce":
        d.edge("m", k)
    return d.save()


def t10():
    return tool("t10-semgrep", "Semgrep: varredura de segurança a cada edição",
                "Plugin que reúne servidor MCP, hooks e skills e escaneia o que o agente gera",
                [("Agente edita", "arquivo novo ou alterado", "ext"),
                 ("Hook PostToolUse", "dispara a varredura", "sec"),
                 ("MCP Semgrep", "remoto por padrão", "ext"),
                 ("Findings", "regras do Guardian", "gap"),
                 ("Agente age", "corrige ou reporta", "ok")],
                "Pega problemas antes do revisor e do gate de segurança, no próprio ciclo de edição.",
                "No modo hospedado o código é enviado ao serviço do Semgrep e é preciso conta. O conjunto de regras padrão não é configurável. Os comandos de instalação diferem entre as páginas: conferir a documentação atual.",
                badge="envia código", badge_at=2)


def t11():
    return tool("t11-playwright", "Playwright MCP: o QA usa um navegador de verdade",
                "Verificação ponta a ponta dirigida pelo agente, sem depender de um segundo framework",
                [("QA define cenários", "a partir dos critérios", "sec"),
                 ("MCP Playwright", "controla o navegador", "ext"),
                 ("Navegador real", "viewports e temas", "ext"),
                 ("App em preview", "nunca produção com dados reais", "data"),
                 ("Evidência", "capturas, asserts e logs", "ok")],
                "Padroniza o e2e em uma ferramenta e dá evidência visual para o gate de QA.",
                "Evidência pesada (capturas, comparações) só no QA final, com amostra declarada. Dados de teste devem ser sintéticos.",
                care_kind="data")


def t12():
    return tool("t12-github-projects", "GitHub e Projects: o quadro como registro durável",
                "Toda tarefa é uma issue no repositório certo, agrupada em um Project; sub-issues ligam história e tarefas",
                [("Principal cria issues", "história, sub-issues e checkpoints", "guilda"),
                 ("gh CLI ou GitHub MCP", "escopos mínimos", "ext"),
                 ("Project", "Status, Priority, Type, Agent, Sprint", "data"),
                 ("Agentes leem a issue", "escopo, critérios e próximo dono", "ext"),
                 ("Principal move o status", "só com evidência", "ok")],
                "Um quadro só para vários repositórios, com sub-issues nativas e histórico auditável.",
                "Token com escopo mínimo e nunca em issue ou log. Automações de Status do próprio GitHub ficam desligadas. O GitHub não impede quem move o cartão: o principal audita o histórico.")


def t13():
    return tool("t13-hostinger", "Hostinger: domínios, DNS, VPS e deploy",
                "Plugin oficial para operar a hospedagem; o papel hosting do guilda traz as convenções",
                [("Principal propõe", "mudança concreta e revisável", "guilda"),
                 ("Você aprova", "obrigatório para o destrutivo", "human"),
                 ("Plugin Hostinger", "domínios, DNS, VPS e apps", "ext"),
                 ("Recurso muda", "DNS, servidor ou aplicação", "data"),
                 ("Verificação", "HTTPS, saúde e rollback prontos", "ok")],
                "Opera DNS, VPS e deploy dentro do fluxo e com o guilda registrando o que foi feito.",
                "Apagar domínio, banco ou e-mail exige aprovação explícita. Propagação de DNS pode levar até 48 horas: reduzir o TTL antes de migrar. Confirmar o plano real antes de assumir privilégios de VPS.")


def t14():
    return tool("t14-cloudflare", "Cloudflare: borda, segurança e edge",
                "O plugin oficial cobre Workers; DNS, WAF e Turnstile precisam de um papel novo",
                [("Principal propõe", "regra de DNS, WAF ou Worker", "guilda"),
                 ("Você aprova", "mudanças de DNS e WAF", "human"),
                 ("Plugin Cloudflare", "Workers, Durable Objects, Wrangler", "ext"),
                 ("Borda", "DNS, CDN, WAF, R2", "data"),
                 ("Verificação", "teste de rota, cache e regra", "ok")],
                "Skills de Workers e Wrangler já prontas e DNS, CDN e WAF na frente de Vercel e VPS.",
                "O plugin é descrito com foco em Workers. Não confirmei cobertura de DNS, WAF, Turnstile e regras de cache. O ingress do guilda é genérico: criar o papel cloudflare no molde do hosting.",
                badge="lacuna parcial", badge_at=2)


def t15():
    return tool("t15-vercel", "Vercel: previews por pull request e produção do front",
                "Plugin oficial com status de build, logs e configuração de domínio",
                [("Pull request", "front alterado", "data"),
                 ("Preview", "URL por PR gerada pela Vercel", "ext"),
                 ("Plugin Vercel", "status de build e logs", "ext"),
                 ("Revisão do preview", "QA e você", "sec"),
                 ("Merge e produção", "promoção controlada", "ok")],
                "Preview por PR e logs no próprio fluxo, ótimo para validar o front antes do merge.",
                "Variáveis de ambiente ficam fora do repositório. Domínio e DNS passam pela Cloudflare. Backend com estado não vai para a Vercel: fica no VPS.",
                care_kind="data")


def t16():
    return tool("t16-task-observer", "Task Observer: retrospectiva contínua das skills",
                "Meta-skill comunitária que observa suas correções e sugere melhorias",
                [("Você trabalha", "corrige e expressa preferências", "human"),
                 ("Task Observer", "anota o que se repete", "ext"),
                 ("Log em arquivo", "persiste entre sessões", "data"),
                 ("Sugestão", "ajuste em skills existentes", "ext"),
                 ("Você aprova", "nada muda sozinho", "human")],
                "Fecha o ciclo de aprendizado: a retrospectiva vira melhoria concreta.",
                "É comunitário, não oficial. A ativação confiável pede uma linha no CLAUDE.md. Revisar o que o log guarda, pois pode conter trechos de trabalho.",
                badge="comunitário")


def t17():
    return tool("t17-gateway", "Roteador ou gateway de modelos (opcional)",
                "claude-code-router ou OmniRoute: troca de modelo e fallback entre provedores",
                [("Claude Code", "ANTHROPIC_BASE_URL aponta para o gateway", "guilda"),
                 ("Gateway local", "regras por tipo de requisição", "ext"),
                 ("Escolha do modelo", "background, raciocínio, contexto longo", "data"),
                 ("Provedor", "próprio, pago ou gratuito", "gap"),
                 ("Resposta", "volta pelo gateway", "ok")],
                "Continua trabalhando quando o limite acaba e permite usar modelo barato para tarefas simples.",
                "Código e prompts passam por provedores de terceiros, inclusive gratuitos. Pode ferir termos de uso. Qualidade varia no meio da tarefa. Comece pelo campo model: dos agentes e pelo modelos.yaml.",
                badge="evitar agora")


def t18():
    return tool("t18-prototipo", "Protótipo: do requisito à tela navegável",
                "Figma e geradores de UI alimentam o design system; o portão é você aceitar o protótipo",
                [("Requisito aprovado", "PRD e personas", "data"),
                 ("Figma", "tokens, componentes e telas", "ext"),
                 ("superdesign / 21st Magic", "componentes e templates", "ext"),
                 ("Protótipo", "navegável com dados fictícios", "guilda"),
                 ("Você aceita", "portão da fase 2", "human")],
                "O design vira código com os tokens do design system e o protótipo serve de critério de aceite.",
                "O 21st Magic MCP veio do post que você enviou e não foi confirmado no marketplace oficial. Revisar antes de instalar.",
                badge="parcial", badge_at=2)


def t19():
    return tool("t19-context7", "Context7: documentação atual das bibliotecas",
                "MCP que entrega trechos da documentação na versão certa, em vez de depender da memória do modelo",
                [("Agente precisa da API", "ex.: Prisma, NestJS, React", "ext"),
                 ("MCP Context7", "busca por biblioteca e versão", "ext"),
                 ("Documentação", "trecho da versão usada", "data"),
                 ("Agente implementa", "sem inventar assinatura", "guilda"),
                 ("Revisor confere", "no gate técnico", "sec")],
                "Reduz erros de API desatualizada, comuns entre versões diferentes do mesmo pacote (Nest 10 e 11, Prisma 5 e 7).",
                "É um serviço externo: consultas saem da máquina. Não enviar trechos do código do projeto nas consultas.",
                care_kind="data")


ALL = [t01, t02, t03, t04, t05, t06, t07, t08, t09, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19]
