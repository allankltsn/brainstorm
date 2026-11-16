"""Diagramas e imagens de terminal do documento de gestão por quadro Kanban."""
from lib import D, terminal

F = "kanban"


def k01():
    d = D(F, "k01-card-duas-camadas", "Um card, dois leitores",
          "A capa é o que você vê no quadro; a ficha é o contrato de trabalho do agente, na mesma issue",
          4, 4, cw=215, ch=84, gy=30,
          note="A capa é reescrita a cada mudança de status. A ficha só cresce: nada que foi provado é apagado.")
    d.group(0, 0, 2, 3, "Capa: para você (português, leitura em segundos)", "human")
    d.group(2, 0, 2, 3, "Ficha: para os agentes (inglês, recolhida na issue)", "guilda")
    d.node("t", 0, 0, "[S-014] Cadastro com e-mail", "título curto, com o ID da história", "human", cs=2)
    d.node("c", 0, 1, "Campos na face do card", "Etapa, Prioridade, Agente, Gates, Precisa de você", "human", cs=2)
    d.node("r", 0, 2, "Resumo em cinco linhas", "O quê, Por quê, Agora, Falta, Precisa de você", "human", cs=2)
    d.node("f1", 2, 0, "Entrada", "Context, Business rules, Acceptance criteria, Scope, Definition of Ready", "guilda")
    d.node("f2", 3, 0, "Execução", "Staffing, Evidence", "guilda")
    d.node("f3", 2, 1, "Validação", "Gates (veredito e SHA), Findings", "guilda")
    d.node("f4", 3, 1, "Saída", "Definition of Done, Human acceptance", "guilda")
    d.node("f5", 2, 2, "Exceção", "Blocked: motivo, quem destrava e status anterior", "guilda", cs=2)
    d.node("log", 0, 3, "Diário nos comentários", "uma linha por mudança: LOG STATUS | data | quem | id | de -> para | evidência", "data", cs=4)
    return d.save()


def k02():
    d = D(F, "k02-etapas-e-estados", "Cinco etapas para você, nove estados para os agentes",
          "O campo Etapa é derivado do Status: o script mantém os dois em sincronia",
          5, 3, cw=190, ch=84, gx=40, gy=40,
          note="A coluna 'Aguardando você' reúne os dois casos em que o trabalho depende de uma ação sua: destravar ou aceitar.")
    etapas = ["A fazer", "Em andamento", "Em validação", "Aguardando você", "Concluído"]
    for i, e in enumerate(etapas):
        d.node(f"e{i}", i, 0, e, "", "human")
    estados = [(0, 1, "open", "planejado"), (0, 2, "pending", "briefing pronto"),
               (1, 1, "in-progress", "trabalho ativo"),
               (2, 1, "in-review", "entregue para validação"), (2, 2, "rejected", "defeito devolvido"),
               (3, 1, "completed", "verificado; falta o seu aceite"), (3, 2, "blocked", "impedimento ou decisão"),
               (4, 1, "accepted", "aceito por você"), (4, 2, "closed", "encerrado")]
    for col, row, nome, sub in estados:
        d.node(nome, col, row, nome, sub, "gap" if nome in ("rejected", "blocked") else "guilda")
    for i, nome in enumerate(["open", "in-progress", "in-review", "completed", "accepted"]):
        d.edge(f"e{i}", nome, dash=True, route="col")
    return d.save()


def k03():
    d = D(F, "k03-quem-garante", "Quem garante o quê em cada passagem",
          "Cada passagem tem um dono e uma condição que o auditor confere antes de o card andar",
          5, 3, cw=190, ch=104, gx=44, gy=40,
          note="O GitHub não impede ninguém de mover um card. O que garante a ordem é a auditoria antes de cada passagem e a cobrança do responsável.")
    d.node("a", 0, 0, "A fazer", "open, pending", "human")
    d.node("b", 1, 0, "Em andamento", "in-progress", "human")
    d.node("c", 2, 0, "Em validação", "in-review, rejected", "human")
    d.node("e", 3, 0, "Aguardando você", "completed, blocked", "human")
    d.node("f", 4, 0, "Concluído", "accepted, closed", "human")
    d.node("pa", 0, 1, "Product Owner", "título, resumo, critérios, escopo e Definition of Ready", "guilda")
    d.node("pb", 1, 1, "Principal e executor", "campo Agent, Staffing e o LOG STATUS de início", "ext")
    d.node("pc", 2, 1, "Executor", "evidência, handoff e resumo reescrito", "ext")
    d.node("pe", 3, 1, "Validadores e principal", "gates no mesmo SHA, Definition of Done; só o principal move", "sec")
    d.node("pf", 4, 1, "Você", "aceite registrado: quem, data e escopo", "human")
    d.node("sm", 0, 2, "Scrum Master: guardião do fluxo", "roda o auditor antes de cada passagem, lista o que falta por responsável e corrige só os campos derivados", "novo", cs=5)
    for x, y in zip("abce", "bcef"):
        d.edge(x, y)
    for x, y in (("a", "pa"), ("b", "pb"), ("c", "pc"), ("e", "pe"), ("f", "pf")):
        d.edge(x, y, dash=True, route="col")
    return d.save()


def k04():
    d = D(F, "k04-ciclo-de-cobranca", "O ciclo de cobrança",
          "Os agentes não conversam entre si: tudo passa pelo principal, e o auditor decide o que está pendente",
          5, 2, cw=190, ch=104, gx=44, gy=44,
          note="Mecânico é o que decorre de outro dado do card (Etapa, Precisa de você, Gates). Conteúdo é prova ou decisão: o Scrum Master nunca preenche, para não inventar evidência.")
    d.node("s", 0, 0, "Scrum Master", "roda o auditor do quadro", "novo")
    d.node("r", 1, 0, "Relatório", "pendências por responsável, com o ID da regra", "data")
    d.node("p", 2, 0, "Principal", "devolve cada pendência ao dono", "guilda")
    d.node("d", 3, 0, "Responsável corrige", "product-owner, executor ou validador", "ext")
    d.node("n", 4, 0, "Nova auditoria", "a pendência só fecha quando o script para de apontar", "sec")
    d.node("m", 1, 1, "Correção mecânica", "o script ajusta os campos derivados", "ok")
    d.node("b", 3, 1, "Card parado", "com erro aberto, o card não muda de status", "gap")
    d.node("q", 4, 1, "Passagem liberada", "o card pode andar", "ok")
    d.edge("s", "r")
    d.edge("r", "p")
    d.edge("p", "d")
    d.edge("d", "n")
    d.edge("r", "m", dash=True, route="col")
    d.edge("d", "b", dash=True, route="col")
    d.edge("n", "q", route="col")
    return d.save()


def k05():
    d = D(F, "k05-quando-auditar", "Quando o quadro é auditado",
          "Cinco momentos fixos; em cada um fica registrada uma linha com cards conferidos, erros, avisos e parados",
          5, 2, cw=190, ch=96, gx=44, gy=40)
    momentos = [("Antes de cada passagem", "o card já deve cumprir as condições do estado de destino"),
                ("Início ou retomada da sessão", "nada começa com o quadro desatualizado"),
                ("Fim de cada onda", "depois de um conjunto de entregas"),
                ("Ao gravar um handoff", "o registro e o quadro precisam concordar"),
                ("Antes de um portão seu", "você decide olhando um quadro verdadeiro")]
    for i, (a, b) in enumerate(momentos):
        d.node(f"m{i}", i, 0, a, b, "sec")
    d.node("a", 0, 1, "Auditor do quadro", "25 regras fixas, sem IA: mesmo resultado para o mesmo quadro", "novo", cs=3)
    d.node("h", 3, 1, "Despacho exige card", "hook nega chamar um agente sem a linha Card: dono/repo#N", "novo", cs=2)
    for i in range(3):
        d.edge(f"m{i}", "a", dash=True, route="col")
    return d.save()


def k06():
    d = D(F, "k06-regras", "O que o auditor confere, por momento da vida do card",
          "Erros impedem a passagem; avisos são listados",
          3, 5, cw=330, ch=64, gx=28, gy=16)
    linhas = [
        ("Sempre", "Status válido, título no formato, campos derivados em sincronia", "K-01 a K-05"),
        ("Capa", "Resumo com as cinco linhas, curto e coerente com o status", "K-06, K-07"),
        ("Antes de começar", "Definition of Ready completa, critérios em lista, escopo preenchido", "K-08 a K-10"),
        ("Durante", "agente e staffing definidos, evidência ao entregar, motivo ao bloquear ou rejeitar", "K-11 a K-15"),
        ("Antes de concluir", "gates aprovados no mesmo SHA por outra instância, Definition of Done, aceite, diário e transições válidas", "K-16 a K-23"),
    ]
    for i, (a, b, c) in enumerate(linhas):
        d.node(f"a{i}", 0, i, a, "", "human")
        d.node(f"b{i}", 1, i, b, "", "data")
        d.node(f"c{i}", 2, i, c, "", "sec")
    return d.save()


def t01():
    return terminal(F, "t01-auditoria", "Auditoria de um quadro de exemplo (cards fictícios; trecho da saída real)", [
        ("$ python audit_board.py --arquivo example-board.json --agora 2026-11-16T00:00:00Z", "cmd"),
        ("Quadro auditado: 7 cards, 12 erro(s), 3 aviso(s), 2 correção(ões) mecânica(s) possível(is).", None),
        ("", None),
        ("Cobrar de: frontend-senior", "ask"),
        ("  [erro] K-13 exemplo/hub#16 [S-016] Perfil do aluno", "err"),
        ("          in-review sem evidência registrada", None),
        ("", None),
        ("Cobrar de: principal", "ask"),
        ("  [erro] K-16 exemplo/hub#18 [S-018] Pagamento da mensalidade", "err"),
        ("          completed sem gate aprovado: security, privacy", None),
        ("  [erro] K-23 exemplo/hub#18 [S-018] Pagamento da mensalidade", "err"),
        ("          completed movido por 'be-2': só o principal move para completed", None),
        ("", None),
        ("Cobrar de: product-owner", "ask"),
        ("  [erro] K-08 exemplo/hub#17 [S-017] Agendar treino", "err"),
        ("          saiu de open com Definition of Ready incompleta (2/5)", None),
        ("  [erro] K-02 exemplo/hub#20 melhorar o login", "err"),
        ("          título fora do formato '[S-014] Título curto'", None),
        ("", None),
        ("Cobrar de: scrum-master", "ask"),
        ("  [aviso] K-03 exemplo/hub#16 [S-016] Perfil do aluno", "dim"),
        ("          campo Etapa é 'Em andamento', deveria ser 'Em validação' (correção mecânica)", None),
        ("  ... (trecho; o relatório completo lista as 15 pendências)", "dim"),
    ])


def t02():
    return terminal(F, "t02-despacho-sem-card", "Hook de despacho: sem card, o agente não é chamado (entrada simulada)", [
        ("principal> Agent(backend): \"Implemente o login.\"", "cmd"),
        ("[guardrails] BLOQUEADO: despacho de 'backend' sem card. Inclua no briefing uma linha", "err"),
        ("  'Card: dono/repo#N' com a issue desta tarefa. Se o card não existe, crie-o primeiro", "err"),
        ("  (product-owner) e passe pela auditoria do quadro", "err"),
        ("", None),
        ("principal> Agent(backend): \"Card: exemplo/hub#15 ... Implemente o login.\"", "cmd"),
        ("(permitido)", "ok"),
    ])


ALL = [k01, k02, k03, k04, k05, k06, t01, t02]
