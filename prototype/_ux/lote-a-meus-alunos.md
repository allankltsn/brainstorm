# Lote A, Meus alunos: especificação de UX (TRN-01 a TRN-06)

Data: 2026-11-10. Autor: ux-designer. Base: spec de telas (`../docs/superpowers/specs/2026-11-10-training-prototype-telas-design.md`, seções 3 a 7), spec do training (T-17, T-29 a T-31, T-48 a T-55), `schema.prisma`, telas HOME-02 (`screens/home/personal.html`), PER-01 (`convidar-aluno.html`), HOME-04 e `assets/shell.js`.
Convenções: protótipo estático, dados sempre mock, pt-BR com acentos, claro e escuro, sem HTML/CSS/JS aqui. Estados via `AuraState` (vazio, carregando, erro, sucesso) e variantes via `aura-variants`, como nas telas G4.

## 0. Decisões transversais

**Termos (uma palavra por conceito).** "Aluno" (nunca "cliente"). "Vínculo" = relação personal-aluno. "Responsável" = profissional do vínculo (T-48); "gestor" = dono ou gestor do tenant (T-30). "Consentimento" por escopo: "Saúde geral", "Fotos", "Vídeos", "Uso de IA" (SAUDE_GERAL, FOTOS, VIDEO, IA). "Oculto" = dado preservado mas não exibido (T-55). "Encerrado" para vínculo ENDED; "Encerrando" para ENDING.

**Menu.** Em `shell.js`, "Alunos" sai de "Em breve" e aponta para TRN-01. "Treinos" e "Prescrição IA" continuam "Em breve" até seus lotes. Item ativo: `alunos`. Telas de detalhe mantêm "Alunos" ativo, com breadcrumb: Início > Alunos > [Nome].

**Selo "Requer API nova"** (componente `badge badge-info` com ícone `info`, texto fixo "Requer API nova", `title` e texto oculto "Esta função ainda não existe na API do aura-training"). Sempre ao lado do título do bloco, nunca só por cor. Cada uso aponta o registro em `_pendencias-api-training.md`. Ver seção 8.

**Privacidade (regras de tela, valem para TRN-01 a TRN-06).**
1. Dado de saúde só aparece com `state = GRANTED` no escopo. NEVER_GIVEN e REVOKED nunca mostram dado nem contagem de saúde (a contagem também é dado).
2. Listas (TRN-01) nunca exibem dor, medidas, respostas de questionário ou texto de alerta com detalhe de saúde. Alerta em lista é genérico: "Novo alerta" com tipo neutro (T-51).
3. Faixa fixa em TRN-02 e TRN-03, texto: "Este aluno sabe que você, os outros responsáveis e o gestor da conta veem os dados que ele liberou." Variante do mesmo aviso aparece no convite (seção TRN-01, estado Pendentes) e na confirmação de TRN-04: "Ao convidar, você informa que responsáveis e gestor poderão ver os dados liberados." Fonte: T-55, PRV-34. Texto jurídico final é **[LEGAL]**: usar marcador "[MOCK] texto provisório" no rodapé da faixa.
4. Após revogação: dado do escopo fica oculto para personal e gestor, sem apagar (`hide_after_revoke`, padrão ocultar). A tela diz isso sem revelar o conteúdo.
5. Projeção de consentimento vencida (T-55, 10.1): tratar como NÃO liberado. Variante "consentimento não confirmado" (ver TRN-03).
6. Sem texto de saúde em títulos de página, `title`, toasts ou notificações.
7. Menor: `age_status` MINOR_NO_GUARDIAN ou UNKNOWN bloqueia dado de saúde e deixa a conta em espera (`account_on_hold`); tela mostra "Aguardando confirmação de idade ou responsável legal", sem dado. MINOR_WITH_GUARDIAN não bloqueia por idade (spec do training libera ADULT ou MINOR_WITH_GUARDIAN); a tela mostra o aviso "O consentimento deste aluno menor veio do responsável legal. [LEGAL] [MOCK]" (PRV-A-07).
8. **Portão único de conteúdo classificado como saúde (PRV-A-01, A-02, A-03, A-04; padrão conservador, [LEGAL] pendente de confirmação).** O conteúdo só é exibido quando TODAS as condições valem: SAUDE_GERAL = GRANTED; projeção de consentimento vigente; vínculo ACTIVE; sem bloqueio de idade (`account_on_hold` falso, age_status ADULT ou MINOR_WITH_GUARDIAN). "Conteúdo classificado como saúde" inclui: dor, medidas, nutrição, respostas e lista de envios de questionários, retorno (`feedback_messages`), execuções e sessões (data, status, duração), treinos atribuídos, "Treino atual", "Última sessão" e "Treinos concluídos". Fora do portão, as telas mostram somente metadado não-saúde (existência e período do vínculo ou do plano, nome do aluno, estados de consentimento) com o cartão "Oculto por privacidade" (cadeado, texto, sem contagem e sem prévia). Motivo do cartão por caso: sem consentimento, revogado, não confirmado, vínculo pausado/encerrando/encerrado, menor em espera. Mock não gera dado de saúde, questionário, retorno nem sessão para quem está fora do portão. Fonte: spec do training §6.9(h), T-50. **[LEGAL] pendente de confirmação**: se metadado de treino sem carga, RPE ou dor é dado de saúde (PRV-A-04).

**Estados comuns a todas as telas** (usar padrão `AuraState`): carregando (skeleton do formato da tela, `aria-busy`), vazio, erro (alerta danger com "Tentar de novo"), sem permissão (reusar `sistema/acesso-negado.html`; mensagem "Você não é responsável por este aluno" sem confirmar se o aluno existe), vínculo não ACTIVE (T-50: só leitura limitada, ver TRN-02), offline/lento (alerta info "Conexão lenta. Mostrando os dados da última carga" com hora; ações de escrita desabilitadas com motivo).

**Acessibilidade comum (WCAG 2.2 AA).** Um `h1` por tela. Abas com `role=tablist/tab/tabpanel`, setas esquerda/direita, Home/End, foco visível. Alvos mínimos 44 px no 390. Estado nunca só por cor: badge sempre com texto e ícone. Modais via `AuraUI.confirm`/`modal` com foco preso, Esc fecha, foco volta ao disparador. Mudanças assíncronas em `role=status`/`aria-live=polite`; erros de formulário com `AuraUI.setError` e foco no primeiro. Movimento reduzido: skeleton sem animação. Zoom 200%: sem rolagem horizontal exceto tabelas em `table-wrap` com `tabindex=0` e rótulo.

**Breakpoints comuns.** 390: uma coluna, tabelas viram lista de cartões, ações primárias em largura total, abas rolam horizontalmente (`chip-tabs`). 768: duas colunas em cartões de resumo, tabela compacta (esconde colunas secundárias). 1440: tabela completa, resumo em grade de 3 a 4 colunas, painel lateral de detalhe não usado (navegação por página).

## TRN-01 Lista "Meus alunos"

**Objetivo.** Ver, buscar e abrir alunos; saber quantos vagas restam; resolver pendências. Arquivo sugerido: `screens/alunos/meus-alunos.html`.

**Fluxo.** Entrada: menu "Alunos"; card "Alunos ativos" de HOME-02; link "Ver alunos" em PER-01. Saída: linha do aluno abre TRN-02; "Convidar aluno" abre PER-01 (existente); banner de limite abre TRN-06 (estado) ou planos; "Ver planos" abre `planos/planos.html`.

**Conteúdo.**
- Cabeçalho: h1 "Meus alunos"; subtítulo "Quem você acompanha, convites e histórico."; ação primária "Convidar aluno" (desabilitada no limite, com texto de apoio, ver TRN-06).
- Contador: `stat`/`progress` "n de limite alunos ativos" (`role=progressbar`, como HOME-02) mais texto "Restam X vagas". Tom `is-warning` a partir de 90%. O limite é só consumo do billing (selo não necessário, ver seção 8, item 7).
- Busca por nome (campo `input` com rótulo visível "Buscar aluno"; filtra no cliente só pelo nome exibido). No V6, busca por e-mail só no servidor e por correspondência exata; nunca filtrar no cliente por e-mail que a tela mostra mascarado (PRV-A-08). Filtro "Modo": Todos, Presencial, Remoto (FollowMode). Filtro "Alertas": Todos, Com alerta aberto.
- Abas (`tabs`, contadores no rótulo): **Ativos (n)**, **Pendentes (n)**, **Histórico (n)**.
- **Ativos**: tabela (390: cartões). Colunas: Aluno (avatar com iniciais, nome), Modo (badge Presencial/Remoto, ícones user/monitor como HOME-02), Treino atual (nome da atribuição ACTIVE ou "Sem treino"; fora do portão da seção 0, regra 8: "Oculto por privacidade"), Última sessão (data relativa; fora do portão: "Oculto por privacidade"), Alertas (badge "N abertos" ou "Nenhum"), Consentimento de saúde (badge "Liberado" / "Não liberado" / "Revogado"), ação "Abrir" (link com nome oculto para leitor de tela). Ordenação padrão: com alerta primeiro, depois nome. Ordenar por Aluno e Última sessão (botão no cabeçalho, `aria-sort`).
- **Pendentes** (duas listas separadas por subtítulo): (a) "Convites enviados" (reaproveita estados pendente/expirado de PER-01: Reenviar, Cancelar, com `AuraUI.confirm`), com o aviso fixo visível acima da lista: "Ao convidar, você informa que responsáveis e gestor poderão ver os dados liberados." **[LEGAL]** [MOCK] texto provisório (PRV-A-05); (b) "Aguardando liberação" (vínculo criado, mas `account_on_hold = true` ou `age_status` UNKNOWN/MINOR_NO_GUARDIAN, ou consentimento NEVER_GIVEN): badge "Aguardando idade ou responsável", "Aguardando consentimento". Linha abre TRN-02 em modo limitado (sem dados de saúde). Texto de apoio por motivo: consentimento pendente = "Aguardando consentimento. Treinos e sessões ficam ocultos até a liberação."; idade pendente (`awaiting='age'`) = "Conta em espera." sem mencionar treinos (PRV-A-03, A-04).
- **Histórico**: vínculos ENDED e ENDING: Aluno, Período (início e fim), Motivo/estado ("Encerrado", "Encerrando"), sem coluna "Treinos concluídos" (removida: número de sessões de vínculo ENDED/ENDING é conteúdo de treino, regra 8; PRV-A-04). Linha abre TRN-02 somente leitura (ver TRN-02). Aviso: "Dados de saúde e de treino de vínculos encerrados ficam ocultos para você." (decisão conservadora; prazo e destino são **[LEGAL]**).
- Paginação: 20 por página, "Carregar mais" (botão) em 390.

**Componentes.** page-header, `tabs`, `table`/`table-wrap`, `badge` (success/warning/danger/info), `avatar`, `progress`, `alert`, `empty-state`, `skeleton`, `chip-tabs` no 390, `AuraState`, `AuraUI.confirm`/`toast`, breadcrumb não (é raiz).

**Estados e variantes** (`aura-variants`: `primeiro-acesso, limite-proximo, limite-atingido, so-pendentes, historico-vazio, erro, filtro-sem-resultado`).
- Carregando: skeleton de 6 linhas, contador em skeleton.
- Vazio total (`primeiro-acesso`): empty-state "Você ainda não tem alunos" / "Convide a primeira pessoa por e-mail ou WhatsApp. Ela só entra pelo seu convite." / ação "Convidar aluno". Abas Pendentes e Histórico visíveis com contador 0.
- Vazio por aba: Ativos "Nenhum aluno ativo agora." Pendentes "Nenhum convite pendente." Histórico "Nenhum vínculo encerrado."
- Filtro sem resultado: "Nenhum aluno encontrado para 'xxx'. Limpar busca." (`role=status`).
- `limite-proximo` (>=90%): alerta info "Você está perto do limite do plano" (texto de HOME-02) com "Ver planos".
- `limite-atingido`: ver TRN-06; botão Convidar desabilitado; lista continua totalmente utilizável.
- Erro: alerta danger "Não foi possível carregar seus alunos." + "Tentar de novo". Dados do cache, se houver, ficam visíveis com aviso.
- Sem consentimento / revogado / oculto: representado só pelo badge da coluna Consentimento; nenhuma contagem de saúde na linha.
- Pendente / encerrado: abas próprias, acima.
- Sem permissão: se o usuário é gestor sem ser responsável, vê todos do tenant (T-30) com coluna extra "Responsável"; um personal comum vê só os seus. Sem papel de personal: acesso negado.

**Textos-chave.** Botão "Convidar aluno". Badge consentimento: "Saúde liberada", "Saúde não liberada", "Saúde revogada". Alerta aberto: "1 alerta aberto". Tooltips não são a única fonte da informação.

**Acessibilidade específica.** Tabela com `caption` oculta "Alunos ativos"; cabeçalhos `scope=col`; contador de resultados anunciado em `aria-live` ao filtrar ("12 alunos encontrados"). Linha inteira não é link; só o botão "Abrir" e o nome (link) para evitar alvo ambíguo.

**Layout.** 390 cartões empilhados (nome, modo, badges, "Abrir"); 768 tabela com colunas Aluno, Modo, Treino atual, Alertas, Ação; 1440 todas as colunas.

**Dados mock (campos).** `link`: id, studentUserId, name, emailMasked, avatarInitials, status (ACTIVE|SUSPENDED|ENDING|ENDED), followMode, ageStatus, accountOnHold, startedAt, endedAt, linkGeneration, activeAssignmentName|null, lastSessionAt|null, openAlerts (int), consents {SAUDE_GERAL, FOTOS, VIDEO, IA: GRANTED|REVOKED|NEVER_GIVEN}, responsibleName (gestor). `invite`: emailMasked, sentAt, expiresAt, status. Contador: activeStudents, studentLimit. Mínimo 12 alunos: 2 com alerta, 1 SUSPENDED, 1 sem treino, 1 revogado, 1 sem consentimento, 1 menor sem responsável, 3 histórico, 3 convites.

## TRN-02 Detalhe do aluno

**Objetivo.** Visão única do aluno com abas. Arquivo: `screens/alunos/aluno-detalhe.html` (`?id=`).

**Fluxo.** Entrada: TRN-01, alerta (futuro TRN-30), HOME-02. Saída: TRN-03 (aba Saúde), TRN-04 (botão "Acompanhamento"), TRN-05 (menu "Mais ações"), voltar para TRN-01. Atalhos para lotes C e E marcados "Em breve" quando a tela de destino ainda não existir (link desabilitado com `aria-disabled`).

**Cabeçalho do aluno.** Avatar, nome, badges: status do vínculo (Ativo, Pausado, Encerrando, Encerrado), modo (Presencial/Remoto), "Desde dd/mm/aaaa". Ações: "Acompanhamento" (TRN-04), "Mais ações" (menu: Pausar vínculo, Encerrar vínculo; TRN-05). Faixa de privacidade da seção 0 abaixo do cabeçalho (compacta, expansível "Entender").

**Abas** (`tabs`; 390 vira `chip-tabs` rolável; aba ativa em `?aba=`): Resumo, Treinos, Execuções, Saúde, Questionários, Retorno, Mídia.

- **Resumo**: cartões: "Treino atual" (nome, período, dias da semana, progresso da semana n/m sessões), "Última sessão" (data, status COMPLETED/SKIPPED/ABANDONED), "Alertas abertos" (lista genérica: "Dor reportada", "Falta", "Questionário atrasado" com data; botões "Marcar como visto" e "Resolver", cada um com confirmação leve; sem região do corpo nem intensidade aqui, isso só na aba Saúde se houver consentimento), "Responsáveis" (nomes, principal marcado; abre TRN-04). Se o alerta for PAIN e a saúde não estiver liberada: texto "Alerta de dor. Os detalhes só aparecem com o consentimento de saúde do aluno." (o fato do alerta existe, o conteúdo não).
- **Portão (regra 8 da seção 0)**: as abas Resumo (cartões Treino atual, Última sessão, nota do alerta PAIN), Treinos, Execuções, Saúde, Questionários, Retorno e Mídia só mostram conteúdo dentro do portão. Fora dele, cada aba mostra o cartão "Oculto por privacidade" com o motivo (sem consentimento; revogado; não confirmado; "Oculto enquanto o vínculo não está ativo" para SUSPENDED e ENDING; "Oculto após o encerramento" para ENDED; conta em espera). Resumo mostra só metadado não-saúde: vínculo, modo, período do plano ("Plano de dd/mm a dd/mm", sem nome de treino nem sessões) e alerta genérico.
- **Treinos**: tabela de atribuições (nome, período, dias, status ACTIVE/PAUSED/ENDED, origem "Modelo X v2" ou "Personalizado"). Dentro do portão. Ações "Editar treino" e "Atribuir treino" levam a TRN-22/23 (lote C): no lote A são botões desabilitados com "Em breve".
- **Execuções**: lista de sessões recentes (data, treino, status, duração; carga e RPE detalhados ficam no TRN-31, lote E, "Em breve"). Dor por série NÃO aparece aqui (é saúde).
- **Saúde**: conteúdo vem de TRN-03 (mesma tela embutida ou aba que carrega o mesmo componente). Ver TRN-03.
- **Questionários**: lista de envios (modelo, enviado em, prazo, status PENDING/SUBMITTED/atrasado). Respostas são saúde: só abrem com SAUDE_GERAL GRANTED. Sem consentimento: linha mostra "Respostas ocultas". Enviar questionário: "Em breve" (TRN-32).
- **Retorno**: conversa curta por sessão/série (T-35): lista de mensagens com autor, data, reação. O texto livre do aluno é saúde (`feedback_messages.body`): mesmo portão da Saúde (regra 8), com cartão de bloqueio fora dele; revogado oculta o retorno derivado; menor em espera nega (PRV-A-02). Só leitura no lote A; "Responder" desabilitado "Em breve" (TRN-31). Não é o chat geral (selo no TRN-33).
- **Mídia**: fotos e vídeos privados do aluno. Fotos exigem FOTOS GRANTED; vídeos exigem VIDEO GRANTED. Por escopo: cartão "Fotos não liberadas"/"Vídeos não liberados"/"Revogado, mídia oculta". Miniaturas só com consentimento; clique abre visualizador em modal (foco preso, descrição alternativa informada pelo aluno ou "Foto sem descrição").

**Estados e variantes** (`aura-variants`: `padrao, sem-consentimento, revogado, pendente, menor-em-espera, pausado, encerrado, erro, sem-permissao`).
- Carregando: skeleton do cabeçalho e de um cartão por aba; abas não carregadas buscam sob demanda.
- Vazio por aba: Treinos "Sem treino atribuído. Atribua um modelo ou monte um personalizado." Execuções "Nenhuma sessão registrada ainda." Questionários "Nenhum questionário enviado." Retorno "Sem mensagens por enquanto." Mídia "Nenhuma mídia compartilhada."
- Pendente (vínculo criado, consentimento NEVER_GIVEN): cabeçalho com badge "Aguardando consentimento"; abas Saúde, Questionários (respostas), Mídia mostram o bloqueio explicativo; Treinos funcional.
- Menor em espera: alerta warning "Conta em espera: falta confirmar a idade ou o responsável legal. Nada de saúde é exibido." Bloqueadas com o mesmo cartão de espera: Saúde, Questionários, Retorno, Execuções, Mídia e Treinos (PRV-A-03). Mock sem questionários nem retorno para essa conta.
- Menor com responsável (`menor-com-responsavel`, nova, PRV-A-07): funciona como adulto dentro do portão, com o aviso "O consentimento veio do responsável legal." **[LEGAL-REVIEW]** (LGPD art. 14) [MOCK].
- Pausado (SUSPENDED): alerta info "Vínculo pausado desde dd/mm. O aluno não recebe novos treinos. Conteúdo de saúde e de treino fica oculto enquanto o vínculo não está ativo." Abas fora do portão mostram o cartão "Oculto enquanto o vínculo não está ativo" (PRV-A-01). Ações de escrita desabilitadas exceto "Retomar" e "Encerrar".
- Encerrando: alerta warning "Encerramento em andamento. Dados de saúde e de treino já estão ocultos." Mesmo cartão do pausado em todas as abas de conteúdo (PRV-A-01). Vale também logo após confirmar o encerramento.
- Sem consentimento / revogado (padrão conservador, PRV-A-04): Treinos, Execuções, Questionários e Retorno também ficam sob "Oculto por privacidade"; antes diziam que o personal continuava acompanhando os treinos, o que foi retirado. Resumo mostra só existência e período do plano. **[LEGAL] pendente de confirmação.**
- Encerrado: somente leitura limitada, só metadado não-saúde: Resumo (período do vínculo). Treinos, Execuções, Saúde, Questionários, Retorno e Mídia com "Oculto após o encerramento." (T-50: requisições de personal exigem vínculo ACTIVE; padrão conservador, **[LEGAL] pendente de confirmação**, ver seção 9).
- Erro: alerta danger por aba, sem derrubar o cabeçalho. Sem permissão: acesso negado.
- Variante "modo presencial": avisos no Resumo "Registro presencial: você registra a sessão pelo aluno; ele vê que foi você" (T-53, T-17); modo só muda comportamento de tela.

**Acessibilidade.** Abas com roteiro de teclado padrão; título de cada painel é o rótulo da aba (`h2`); estado "bloqueado por consentimento" usa ícone cadeado e texto, não só cinza; modais de mídia com Esc e retorno de foco.

**Layout.** 390: cabeçalho empilhado, ações em menu único "Ações"; abas rolam. 768: cartões de Resumo em 2 colunas. 1440: Resumo em 3 colunas (Treino atual, Última sessão e Responsáveis na linha 1; Alertas em largura total).

**Dados mock (campos).** Tudo de TRN-01 mais: `assignments[]` (id, name, startDate, endDate, status, weekdays[], sourceName, sourceVersion, customizedAt); `sessions[]` (id, date, workoutName, status, durationMin, origin STUDENT_APP|PERSONAL_APP, registeredBy); `alerts[]` (id, kind PAIN|ABSENCE|CHECKIN_OVERDUE, status OPEN|ACKNOWLEDGED|RESOLVED, severity, createdAt, referenceDate, recipientIsMe); `questionnaires[]` (id, name, sentAt, dueAt, status); `feedback[]` (id, author, text, reaction, at); `media[]` (id, kind foto|video, takenAt, alt, scope). Mock de saúde só no aluno com consentimento (nunca dado real).

## TRN-03 Saúde, objetivos e nutrição

**Objetivo.** Mostrar o que o aluno liberou, e só isso. Aba "Saúde" de TRN-02 (e rota própria `aluno-saude.html?id=` para link direto). Entrada: aba Saúde; alerta de dor. Saída: aba Resumo; TRN-04 para ver quem mais vê; TRN-42 (lote D) "Em breve" para uso por IA.

**Cabeçalho da seção.** Faixa de privacidade (seção 0). Painel "O que o aluno liberou" com 4 linhas de escopo (Saúde geral, Fotos, Vídeos, Uso de IA): cada uma com badge (Liberado desde dd/mm, Revogado em dd/mm, Nunca liberado), `textVersion` do termo aceito ("Termo v1"), e nota "Alterado só pelo aluno".

**Blocos (cada um com seu estado).**
1. **Dor e alertas** (escopo SAUDE_GERAL): histórico de relatos (data, região do corpo, intensidade 0 a 10 com texto "7 de 10", sessão associada). Alta (>= limiar) com ícone e texto "Intensidade alta". Spec cobre.
2. **Medidas e respostas** (SAUDE_GERAL): peso, % gordura e respostas de questionário (tipos WEIGHT_KG, BODY_FAT_PERCENT existentes no schema), em tabela com data e "registrado por Aluno/Você/Outro responsável" (T-53). Gráfico simples de evolução (barra/linha com tabela alternativa `sr-only`, como `G4.barChart`). Spec cobre.
3. **Objetivos**: objetivo do programa (campo `goal` do programa) é spec; objetivo declarado pelo próprio aluno não está claro no schema. Exibir "Objetivo do treino" (spec) e um bloco "Objetivos informados pelo aluno" com selo "Requer API nova".
4. **Nutrição**: bloco inteiro com selo "Requer API nova" (registro N1 em seção 8): refeições, metas, observações do aluno. Só aparece com SAUDE_GERAL liberado; o texto no protótipo é "[MOCK] dado de demonstração".
5. **Fotos e vídeos**: referência à aba Mídia (contagem não é exibida sem consentimento).

**Estados e variantes** (`aura-variants`: `liberado, nunca-liberado, revogado, nao-confirmado, menor-em-espera, vazio, erro`).
- Liberado: todos os blocos.
- Escopo "Liberado" só vale com vínculo ACTIVE e sem bloqueio de idade (regra 8). Com vínculo SUSPENDED ou ENDING: cartão único "Oculto enquanto o vínculo não está ativo" em Saúde, Questionários (respostas), Retorno, Mídia e na nota do alerta PAIN (PRV-A-01).
- Nunca liberado: nenhum bloco de dado. Cartão único: ícone cadeado, "O aluno ainda não liberou os dados de saúde." / "Quando o aluno liberar, os dados aparecem aqui." (retirado "Você continua acompanhando os treinos", PRV-A-04). Ação "Lembrar o aluno" NÃO existe (evitar pressão; ver microcopy).
- Revogado: cartão "O aluno retirou a liberação em dd/mm/aaaa." / "Os dados registrados antes ficam guardados e ocultos para você e para o gestor." Sem exibir contagem, datas de registros ou prévia. Texto jurídico de destino do dado: **[LEGAL]** [MOCK].
- Painel "O que o aluno liberou": enquanto a projeção estiver vencida, o badge do escopo mostra "Não confirmado agora" no lugar de "Liberado desde dd/mm" (PRV-A-06).
- Não confirmado (projeção de consentimento vencida, T-55): alerta warning "Não conseguimos confirmar a autorização do aluno agora. Por segurança, os dados ficam ocultos até confirmar." + "Tentar de novo".
- Menor em espera: bloqueio de TRN-02.
- Vazio (liberado, sem dado): "O aluno liberou, mas ainda não registrou dados de saúde."
- Carregando: skeleton por bloco. Erro: alerta por bloco.
- Aviso de dor alta (T-52) é do aplicativo do aluno; aqui o personal só vê o registro e o alerta.

**Microcopy proibida (evitar dark pattern).** Sem "peça ao aluno para liberar", sem contagem regressiva, sem culpa. Se quiser sugerir, só texto neutro: "Você pode conversar com o aluno sobre o que ele prefere compartilhar."

**Acessibilidade.** Blocos como `section` com `aria-labelledby`; badges com texto; gráficos com tabela equivalente; variação de intensidade nunca só por cor (ícone e texto "alta"); datas em formato pt-BR com `time datetime`.

**Layout.** 390 uma coluna, tabelas viram lista; 768 duas colunas (Dor e Medidas); 1440 painel de consentimento fixo à esquerda (largura 320) e blocos à direita.

**Dados mock.** `consents[4]` (scope, state, textVersion, grantedAt, revokedAt); `pain[]` (id, at, bodyRegion, intensity, sessionName, origin); `measures[]` (at, kind WEIGHT_KG|BODY_FAT_PERCENT, value, unit, registeredBy); `programGoal`; `studentGoals[]` [selo]; `nutrition` {meals[], targets, notes} [selo]. Dois alunos mock com dado e um com cada estado de bloqueio.

## TRN-04 Modo de acompanhamento e responsáveis

**Objetivo.** Alterar o modo (presencial/remoto, T-17, T-44) e ver quem são os responsáveis do vínculo (T-48). Painel lateral (modal grande no 390) aberto a partir de TRN-02. Arquivo: `screens/alunos/aluno-acompanhamento.html` ou modal `modal-lg`.

**Fluxo.** Entrada: botão "Acompanhamento" em TRN-02 e cartão "Responsáveis". Saída: salvar volta a TRN-02 com toast; Cancelar volta sem mudar.

**Conteúdo.**
- **Modo de acompanhamento** (`segmented`, 2 opções: "Presencial", "Remoto"). Ajuda: "Muda só como as telas se comportam, por exemplo quem registra a sessão. Não muda o que o aluno vê dos seus dados." Mostra "Alterado por [nome] em dd/mm/aaaa" (`follow_mode_changed_*`). Botão "Salvar modo" desabilitado até haver mudança.
- **Responsáveis** (lista, somente leitura no lote A): nome, papel ("Principal", "Responsável"), "Desde dd/mm". Gestor aparece como "Gestor da conta (vê este aluno)" em linha separada, sem botão remover. Texto: "Os alertas vão ao responsável principal. Sem responsável, vão à fila do gestor." (T-49).
- **Quem vê os dados do aluno** (resumo de privacidade): "Responsáveis do vínculo e gestor da conta. Outros profissionais não veem este aluno." (T-30, T-31). O aviso ao aluno aparece aqui também.
- **Incluir ou remover responsável / trocar principal**: spec tem a tabela (T-48), mas não define endpoint para o personal alterar. Botões "Adicionar responsável", "Tornar principal", "Remover" com selo "Requer API nova" e abertos apenas se o usuário for gestor (variante). No protótipo, `AuraUI.confirm` com consequência: "Remover Fulano: os alertas abertos dele passam para a fila do gestor." (T-49) e "O aluno será avisado de que o responsável mudou." (assumido, validar).

**Estados e variantes** (`aura-variants`: `padrao, mudanca-pendente, gestor, unico-responsavel, sem-responsavel, erro-salvar, sem-permissao`).
- Carregando: skeleton de 2 linhas. Erro ao salvar: alerta danger no topo do painel, foco nele, modo volta ao valor anterior, texto "Não foi possível salvar. Nada foi alterado."
- Sucesso: toast "Modo alterado para Remoto." (`role=status`).
- Sem responsável: alerta info "Este aluno está sem responsável. Os alertas vão para a fila do gestor."
- Sem permissão (não é responsável nem gestor): acesso negado. Responsável não principal: pode mudar modo? Assunção: sim, qualquer responsável ACTIVE (spec diz "alterável pelo personal"). Marcar em seção 9.
- Vínculo não ACTIVE: tudo desabilitado com motivo.
- Offline: modo desabilitado com "Sem conexão. Tente quando estiver online." (escrita crítica não enfileira).

**Acessibilidade.** `segmented` como `radiogroup` com rótulo; foco inicial no grupo; Esc fecha (com aviso se houver mudança não salva); mudança de modo anunciada em `aria-live`.

**Layout.** 390 modal em tela cheia, botões empilhados; 768 modal `modal-lg`; 1440 painel lateral à direita (largura 480) sobre TRN-02.

**Dados mock.** `followMode`, `followModeChangedByName`, `followModeChangedAt`, `responsibles[]` (userId, name, isPrimary, since, endedAt), `managerName`, `viewer` {isManager, isResponsible, isPrimary}.

## TRN-05 Pausar ou encerrar vínculo

**Objetivo.** Interromper ou terminar o acompanhamento com consequências claras. Dois fluxos em modal (`AuraUI.confirm` estendido com campo opcional), disparados por "Mais ações" em TRN-02.

**Base na spec.** `LinkStatus` tem ACTIVE, SUSPENDED, ENDING, ENDED; `AssignmentStatus` tem ACTIVE, PAUSED, ENDED. O vínculo nasce e muda por evento/reconciliação do identity (T-50), então a ação do personal sobre o vínculo não está especificada. Decisão de design: "Pausar treinos" (pausa as atribuições, spec cobre) e "Encerrar vínculo" (pedido ao identity). A ação "Pausar vínculo" (SUSPENDED) e "Encerrar vínculo" disparados pelo personal recebem selo "Requer API nova" no registro (seção 8, item V1).

**Fluxo.** Entrada: TRN-02 > Mais ações. Saída: confirmação volta a TRN-02 com o novo estado; "Encerrar" ao terminar manda a TRN-01 aba Histórico.

**Pausar.**
- Título: "Pausar o acompanhamento de [Nome]?"
- Consequências em lista: "O aluno deixa de receber treinos e lembretes." "Os treinos atuais ficam pausados e voltam como estavam." "Você mantém o histórico. A vaga do plano continua ocupada." (ASSUMIDO: pausado ocupa vaga; validar com billing, seção 9.) "O aluno será avisado da pausa." **[LEGAL]** [MOCK] (PRV-A-09). "Enquanto estiver pausado, os dados de saúde e de treino ficam ocultos para você e para o gestor." (PRV-A-01).
- Campos: "Motivo (opcional)" `textarea` 200 caracteres, aviso "Não escreva dados de saúde aqui." O texto "só você vê" foi retirado: visibilidade (gestor?) e retenção do motivo são texto livre e ficam definidas no V4 (PRV-A-09, P-13). Retomar: "Retomar acompanhamento" (mesmo modal invertido).
- Botões: "Pausar" (primário neutro), "Manter ativo".
- Sucesso: toast "Acompanhamento pausado." Erro: alerta no modal, nada alterado.

**Encerrar.**
- Título: "Encerrar o vínculo com [Nome]?" Ação destrutiva (`btn-danger`), segundo passo obrigatório.
- Consequências: "Você deixa de ver o aluno e de enviar treinos." "Os dados de saúde ficam ocultos para você e para o gestor." "O histórico de treinos continua na aba Histórico." "A vaga volta para o seu plano." "Esta ação não pode ser desfeita por você. Para acompanhar de novo, é preciso um novo convite." "O aluno será avisado." "O aluno pode baixar os dados dele por um período; depois eles são apagados conforme o prazo legal." (PRV-A-10; textos de destino do dado e janela de download: **[LEGAL]** [MOCK]).
- Confirmação por digitação do nome do aluno (`input` rotulado "Digite o nome do aluno para confirmar"; botão "Encerrar vínculo" só habilita com igualdade, sem diferenciar maiúsculas). Alternativa acessível: o nome vem no rótulo; colar permitido.
- Sem "desfazer" depois de confirmado. Antes, "Cancelar" tem o mesmo peso visual do confirmar (sem assimetria de esforço).
- Estados: ENDING (processando): modal fecha, TRN-02 mostra "Encerrando…". Erro: "Não foi possível encerrar agora. Nada foi alterado."
- Menor/gestor: se o usuário não é responsável principal, ação desabilitada com "Só o responsável principal ou o gestor encerram o vínculo." (assunção, seção 9).

**Variantes** (`aura-variants`: `pausar, retomar, encerrar, encerrar-erro, encerrando, sem-permissao`).

**Acessibilidade.** Modal com `role=alertdialog` no encerrar; foco inicial no botão Cancelar (ação segura); lista de consequências como `ul`; erro de digitação em `aria-live`; foco volta ao "Mais ações".

**Layout.** 390 modal como bottom sheet com botões empilhados (Cancelar acima do destrutivo? mantém ordem visual Cancelar primeiro no DOM); 768/1440 modal centrado de 480 px.

**Dados mock.** `studentName`, `status`, `pausedAt`, `consequences` (lista), `reasonMax=200`, `viewer.canEnd`.

## TRN-06 Limite de alunos atingido (estado e convite)

**Objetivo.** Explicar o limite do plano e o que fazer, sem bloquear o uso. Não é página própria: é estado de TRN-01 e de PER-01 (existente), mais modal "Aumentar o limite".

**Fluxo.** Entrada: botão "Convidar aluno" desabilitado/ativado em TRN-01 (ao atingir) ou tentativa de aceitar um convite pendente quando n = limite. Saída: "Ver planos" (`planos/planos.html?variant=limite-atingido`); "Gerenciar alunos" rola para a lista; "Fechar".

**Conteúdo.**
- Alerta warning (padrão PER-01): título "Você chegou ao limite de alunos do seu plano"; texto "Seu plano [Pro] permite [30] alunos e todos já estão em uso. Os alunos atuais continuam funcionando normalmente. Os convites já enviados continuam valendo, mas só entram quando houver vaga." Ações "Ver planos" (primária) e "Ver quem posso encerrar" (secundária, link para aba Histórico/lista, texto neutro, sem sugerir quem).
- Contador `progress` 100% com `is-warning`; texto "30 de 30".
- Convidar desabilitado: botão com `disabled` e `aria-describedby` apontando o texto "Sem vagas. Veja os planos ou libere uma vaga."
- Aluno aceita convite quando lotado: em Pendentes, convite aceito sem vaga mostra badge "Aguardando vaga" e botão "Ver planos". Observação: o aceite do aluno é decisão do identity/billing, não do training; no protótipo a variante `aceite-sem-vaga` só ilustra.
- Plano sem limite (ilimitado): contador "18 alunos ativos" sem barra, sem alerta.
- Inadimplente/billing fora do ar (entitlements, T-41): o limite pode estar desatualizado: alerta info "Não conseguimos confirmar o limite agora. Usando o último valor conhecido ([30], de dd/mm)." Convidar permanece habilitado só se houver cópia vigente; senão desabilitado com motivo.
- Não pressionar: sem "Última chance", sem cronômetro, sem upgrade pré-selecionado; "Manter meu plano atual" é uma ação visível de mesmo peso no modal.

**Estados e variantes** (`aura-variants`: `limite-atingido, limite-proximo, ilimitado, limite-desatualizado, aceite-sem-vaga, erro`).
- Carregando: contador em skeleton, botão desabilitado com `aria-busy`. Erro: contador oculto, alerta danger "Não foi possível verificar o limite do plano." e "Tentar de novo".
- Sem permissão: personal sem direito de convidar: botão ausente e nota "Convites são feitos pelo gestor." (variante do gestor, assunção).

**Acessibilidade.** Alerta `role=status`; botão desabilitado com explicação textual visível (não só `title`); barra de progresso com `aria-valuenow`.

**Layout.** 390 alerta empilhado, botões em largura total; 768/1440 alerta em linha com ação à direita (padrão `.alert` + `btn`).

**Dados mock.** `studentLimit`, `activeStudents`, `planName`, `limitSource` {receivedAt, stale boolean}, `pendingInvites`. Selo: nenhum para o consumo do número (item 7 da spec); "aceite-sem-vaga" e "Aguardando vaga" recebem selo "Requer API nova" (ver V3).

## 8. Itens com selo "Requer API nova" neste lote (para `_pendencias-api-training.md`)

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| N1 | Dados de nutrição do aluno (refeições, metas, observações) | TRN-03 | Nutrição fora da v1 (spec seção 4, item 4) |
| N2 | Objetivos declarados pelo aluno (distintos do `goal` do programa) | TRN-03 | Sem campo no schema para o aluno |
| V1 | Personal pausar/encerrar vínculo (SUSPENDED/ENDING/ENDED) e retomar | TRN-02, TRN-05 | Vínculo vem do identity (T-50); ação do personal não especificada |
| V2 | Adicionar, remover, trocar principal de responsáveis pelo personal/gestor; aviso ao aluno da mudança | TRN-04 | Tabela existe (T-48), endpoint e aviso não |
| V3 | Estado "aguardando vaga" para convite aceito com limite cheio | TRN-01, TRN-06 | Depende de billing/identity, fora do training |
| V4 | Motivo de pausa/encerramento (nota privada do personal) | TRN-05 | Sem campo no schema |
| V5 | Lista "Pendentes" unificando convites (identity) e vínculos aguardando consentimento (training) | TRN-01 | Composição entre serviços, não prevista |
| V6 | Busca por nome/e-mail, ordenação e paginação da lista de alunos | TRN-01 | Dados de nome e e-mail vêm do identity; sem listagem unificada prevista |
Sem selo (spec cobre): vínculos, consentimentos, atribuições, sessões, dor, alertas (PAIN, ABSENCE, CHECKIN_OVERDUE), questionários, retorno, mídia privada, modo de acompanhamento, número do limite (consumo).
Atenção: nome/e-mail do aluno não estão no training (só `student_user_id`); a tela depende de dado do identity: tratar como V6 até confirmação.

## 9. Pressupostos e lacunas (para decisão do principal/humano)
1. Quem pode mudar modo/encerrar: assumido responsável do vínculo ou gestor. Validar.
2. Vaga ocupada durante pausa: assumido que SIM. Validar com billing.
3. Leitura de vínculo ENCERRADO e de conteúdo de treino sem consentimento/revogado/menor em espera (T-50 exige ACTIVE; spec classifica sessões, atribuições e questionários como saúde): decisão do principal, padrão CONSERVADOR (oculta tudo exceto metadado não-saúde). **[LEGAL] pendente de confirmação** se o metadado de treino sem carga, RPE ou dor é dado de saúde (PRV-A-04). Se o jurídico liberar, reabrir só as telas de treino.
4. Textos de consentimento, aviso ao aluno e destino do dado pós-revogação são **[LEGAL]**; no protótipo vão marcados "[MOCK] texto provisório".
5. Faixas "Em breve" para itens de lotes C e E, com links desabilitados.
6. Numeração: mantida TRN-01 a TRN-06; sem alterações. Sugestão: tratar o aviso de privacidade como componente compartilhado `g5-privacidade` para reuso em lotes D e E.
7. Evidência de usabilidade ausente: nenhuma sessão com personais reais. Recomenda-se teste rápido (5 personais) em TRN-01 (busca e pendentes), TRN-03 (compreensão de "oculto") e TRN-05 (confirmação por digitação) após implementação. Privacy-compliance deve revisar TRN-03, TRN-04 e TRN-05 antes de congelar o texto.
8. Sem verificação de contraste feita aqui (depende dos tokens existentes); QA do lote confirma 4.5:1 em claro e escuro, incluindo badges e selo.

## Correção 1 (2026-11-10, achados do gate de privacidade)

| Achado | Mudança feita | Seção alterada |
|--------|---------------|----------------|
| PRV-A-01 | Portão único exige vínculo ACTIVE; SUSPENDED/ENDING mostram "Oculto enquanto o vínculo não está ativo" em Saúde, Questionários, Retorno, Mídia e alerta PAIN; vale após confirmar encerramento | 0 (regra 8); TRN-02 (portão, Pausado, Encerrando); TRN-03 (variantes); TRN-05 (Pausar) |
| PRV-A-02 | Retorno sob o mesmo portão da Saúde; revogado oculta; menor em espera nega; mock sem mensagens fora do portão | 0 (regra 8); TRN-02 (aba Retorno) |
| PRV-A-03 | Menor em espera bloqueia Questionários, Retorno, Execuções, Mídia e Treinos; mock sem questionário/retorno; Pendentes usa "Conta em espera" para idade | TRN-02 (Menor em espera); TRN-01 (Pendentes b) |
| PRV-A-04 [LEGAL] pendente | Padrão conservador: fora do portão (sem consentimento, revogado, menor em espera, pausado, encerrando, encerrado) só metadado não-saúde, estado "Oculto por privacidade"; removidos Treino atual/Última sessão, coluna "Treinos concluídos" e a frase "continua acompanhando os treinos" | 0 (regra 8); TRN-01 (Ativos, Histórico); TRN-02 (Sem consentimento/Encerrado); TRN-03 (Nunca liberado); 9 (item 3) |
| PRV-A-05 | Aviso de convite acrescentado em "Convites enviados" com [LEGAL] [MOCK] | TRN-01 (Pendentes a) |
| PRV-A-06 (Baixo) | Badge "Não confirmado agora" no painel de escopos | TRN-03 (variantes) |
| PRV-A-07 (Baixo) | Bloqueio por idade só UNKNOWN/MINOR_NO_GUARDIAN; nova variante `menor-com-responsavel` com aviso [LEGAL-REVIEW] | 0 (regra 7); TRN-02 (variantes) |
| PRV-A-08 (Baixo) | Busca só por nome no cliente; e-mail só no servidor e exato (V6) | TRN-01 (Conteúdo) |
| PRV-A-09 (Baixo) | "O aluno será avisado da pausa." [LEGAL] [MOCK]; "só você vê" retirado, visibilidade e retenção no V4 | TRN-05 (Pausar) |
| PRV-A-10 (Baixo) | Linha de janela de download antes da purga ao encerrar [LEGAL] [MOCK] | TRN-05 (Encerrar) |

Pendente para o frontend: refletir estas mudanças no protótipo; confirmação independente do gate de privacidade.
