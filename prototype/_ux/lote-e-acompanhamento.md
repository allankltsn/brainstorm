# Lote E, Acompanhamento: especificação de UX (TRN-30 a TRN-34)

Data: 2026-11-10. Autor: ux-designer. Base: spec de telas (`../docs/superpowers/specs/2026-11-10-training-prototype-telas-design.md`, seções 3 a 7; inventário E), spec do training (`../docs/superpowers/specs/2026-10-24-aura-training-design.md`: T-16 a T-23, T-28, T-33, T-35, T-43 a T-55), `schema.prisma` (alerts, AlertStatus OPEN/ACKNOWLEDGED/RESOLVED, workout_sessions, set_logs, pain_reports, feedback_messages, feedback_reactions, questionnaire_*, SubmissionStatus PENDING/SUBMITTED/CANCELED), `lote-a-meus-alunos.md` e `lote-bc-exercicios-treinos.md` (a seção 0 do lote A vale aqui por referência: termos, selo, regras de privacidade 1 a 8, estados comuns, acessibilidade comum, breakpoints, **regra 8 portão único de saúde**).
Convenções: protótipo estático, dados sempre mock `[MOCK]`, pt-BR com acentos, claro e escuro, sem HTML/CSS/JS aqui. Estados via `AuraState`, variantes via `aura-variants`. Textos jurídicos são **[LEGAL]** "[MOCK] texto provisório".

## 0. Decisões transversais do lote E

**Menu.** Em `shell.js`, novo grupo "Acompanhamento" com "Alertas" (TRN-30, contador de abertos), "Execuções" (TRN-31), "Questionários" (TRN-32), "Mensagens" (TRN-33). TRN-34 abre pelo sino do cabeçalho (painel) e por página própria. Telas de detalhe do aluno (TRN-02) ganham atalhos para as mesmas telas filtradas pelo aluno. "Prescrição IA" continua "Em breve".

**Termos (uma palavra por conceito).** "Alerta" (nunca "notificação" para o registro `alerts`); "Notificação" = aviso do centro (TRN-34). Tipos de alerta: "Dor" (PAIN), "Falta" (ABSENCE), "Check-in atrasado" (CHECKIN_OVERDUE). Estados: "Aberto", "Visto" (ACKNOWLEDGED), "Resolvido". "Execução" = sessão realizada pelo aluno. "Retorno" = conversa curta do personal por sessão ou série (T-35); "Mensagem" = chat privado geral (TRN-33, selo C1). "Questionário" (modelo, envio, resposta). "Reação": Curti, Forte, Parabéns, Atenção (LIKE, STRONG, CELEBRATE, ATTENTION; conjunto é palpite do autor, T-46).

**Selo "Requer API nova"** como no lote A (seção 0). IDs novos, a acrescentar em `_pendencias-api-training.md`: **C1** (chat privado geral personal-aluno) e **C2** (centro de notificações do personal). Demais itens de E têm cobertura na spec e não levam selo.

**Quem opera.** Modo de acompanhamento (presencial/remoto) e encerrar ou pausar vínculo são do personal responsável ou admin/gestor (lote A, TRN-04/05). Pausa ocupa vaga do limite. Vínculo encerrado: o personal só lê o que ele próprio disponibilizou e que ficou visível por regra (padrão conservador: nada de saúde; ver 0.3). Gestor sem ser responsável: leitura; não responde, não resolve alerta de outro, não envia questionário (pressuposto 1).

**0.1 Regras de produto (valem para TRN-30 a TRN-34).**
1. **IA só sugere, nunca grava.** Em E a IA aparece no máximo como "Sugestão de resposta (Em breve, lote D)" com selo I1, sem botão que envie ou altere dado. Nenhum "enviar automaticamente", nenhum alerta resolvido por IA. Toda ação (resolver alerta, enviar questionário, enviar mensagem, reagir) é clique humano; as com efeito sobre o aluno declaram a consequência.
2. **Dados de saúde só dentro do escopo de consentimento.** Dor, carga, RPE, comentários, respostas de questionário, retorno e mensagens com conteúdo de saúde passam pelo portão único (regra 8 do lote A). Fora dele: cartão "Oculto por privacidade" com o motivo, sem contagem, sem prévia, sem nome de exercício.
3. **Alerta em lista e em notificação é genérico** (T-51, regra 2 do lote A): "Novo alerta de um aluno", tipo neutro. O detalhe (região da dor, intensidade) só aparece no detalhe do alerta, autenticado, dentro do portão. Nunca em título de página, `title`, toast, push ou e-mail.
4. **Chat sem anexo de dado de saúde fora do escopo.** O compositor de TRN-33 não permite anexo (foto, vídeo, arquivo) quando FOTOS/VIDEO não estão GRANTED; e texto de saúde só é escrito com SAUDE_GERAL GRANTED (T-33, escrita do personal em coluna HEALTH_* exige consentimento; projeção vencida nega, falha fechada). Fora do escopo, o campo de texto vira "Mensagem geral" com aviso fixo e o envio é bloqueado se houver saúde, ver TRN-33.
5. **Padrão conservador.** Ação irreversível ou que notifica o aluno pede confirmação com consequência; Cancelar tem o mesmo peso. Estado nunca só por cor.
6. **Autoria visível ao aluno** (T-53): o aluno vê quem registrou o dado; o personal vê "Registrado pelo aluno", "Registrado por você", "Registrado por [colega]", "Registro do sistema" (origens STUDENT_APP, PERSONAL_APP, SYSTEM).

**0.2 Motivos de "Oculto por privacidade" (cartão único, lote A regra 8, reuso).** Texto-base: "Oculto por privacidade." + motivo + "O dado continua guardado e voltará a aparecer se o aluno liberar de novo." (esta última frase só em "Revogado" e "Não confirmado"; nos demais não se promete retorno). Motivos: "Saúde não liberada pelo aluno", "Saúde revogada pelo aluno", "Consentimento não confirmado agora", "Vínculo pausado", "Vínculo encerrando", "Vínculo encerrado", "Aguardando confirmação de idade ou responsável legal". Cadeado + texto, nunca só cor. Sem contagem, sem prévia.

**0.3 Comportamento por situação do vínculo (tabela única do lote E).**

| Situação | Alertas (TRN-30) | Execuções (TRN-31) | Questionários (TRN-32) | Chat (TRN-33) | Notificações (TRN-34) |
|----------|------------------|--------------------|------------------------|---------------|------------------------|
| ACTIVE, saúde GRANTED e vigente | completo | completo | completo | completo | completo |
| ACTIVE, saúde NEVER_GIVEN / REVOKED / não confirmado | linha genérica "Novo alerta" sem detalhe; resolver permitido (metadado) | oculto por privacidade | modelos sim; envio e respostas ocultos | só mensagem geral sem saúde (aviso), sem anexo | genérica |
| SUSPENDED (pausado; ocupa vaga) | só leitura, detalhe oculto | oculto | envio desabilitado, motivo; respostas ocultas | leitura da conversa oculta, envio desabilitado | genérica |
| ENDING | só leitura, detalhe oculto | oculto | desabilitado | desabilitado; aviso de encerramento | genérica |
| ENDED | alerta some da fila ativa; consulta só em Histórico (metadado) | oculto | oculto | "Conversa encerrada" (só leitura de mensagens que o personal enviou, [LEGAL] pendente; padrão: oculta) | genérica, sem link para detalhe |
| Menor em espera (`account_on_hold`) | bloqueado | oculto | oculto | oculto | genérica |

**Estados comuns (padrão `AuraState`).** Carregando (skeleton do formato, `aria-busy`), vazio, erro (alerta danger + "Tentar de novo", cache visível com aviso e hora), sem permissão (`sistema/acesso-negado.html`, "Você não é responsável por este aluno", sem confirmar existência), offline/lento (info "Sem conexão. Mostrando a última carga de hh:mm"; escrita desabilitada com motivo, não enfileira), conflito ("Este item mudou desde que você abriu. Recarregar"), salvando (`aria-busy`, "Salvando…"), sucesso (toast `role=status`, sem texto de saúde), limite (ver cada tela; limite do plano aparece como info no envio de questionário se o recurso exigir entitlement, T-40).

**Acessibilidade comum a E (além da seção 0 do lote A).** Um `h1` por tela. Contadores e novos itens anunciados em `aria-live=polite` (sem repetir a cada polling; marcos agrupados). Tipo, estado e severidade de alerta com ícone e texto. Alvos mínimos 44 px no 390. Gráficos (carga/RPE) sempre com tabela equivalente e resumo textual. Mídia de execução (vídeo do aluno): sem autoplay, controles nativos, `prefers-reduced-motion`, transcrição/descrição se houver. Timestamps em `<time datetime>` com texto relativo e absoluto. Reordenar/ordenar com botão e `aria-sort`. Zoom 200% sem rolagem horizontal, exceto `table-wrap` com `tabindex=0` e rótulo. Contraste 4.5:1 a verificar no QA (claro e escuro).

**Breakpoints.** 390: uma coluna, tabelas viram lista de cartões, ações primárias em largura total, filtros em modal. 768: duas colunas, tabela compacta. 1440: tabela completa e painel de detalhe à direita (lista | detalhe) nas telas de fila (TRN-30, TRN-33).

---

## TRN-30 Central de alertas

**Objetivo.** Ver, priorizar e tratar alertas de todos os alunos em um lugar. Arquivo: `screens/acompanhamento/alertas.html` (`?aluno=` filtra). Fonte: T-18, T-43, T-45, T-49, T-51; tabela `alerts`.

**Fluxo.** Entrada: menu "Alertas"; badge "N abertos" de TRN-01; atalho em TRN-02; link da notificação (TRN-34). Saída: "Abrir aluno" (TRN-02), "Ver execução" (TRN-31 na sessão do alerta de dor, dentro do portão), "Enviar mensagem" (TRN-33), "Enviar questionário" (TRN-32, para Check-in atrasado). Ações no alerta: "Marcar como visto" (OPEN para ACKNOWLEDGED), "Resolver" (para RESOLVED, com nota opcional), "Reabrir" (RESOLVED para OPEN, só no mesmo dia [MOCK]; sem selo, pressuposto 3).

**Conteúdo.**
- h1 "Alertas"; subtítulo "O que precisa da sua atenção nos seus alunos."; contador "N abertos" (`aria-live`).
- Abas (contadores): **Abertos (n)** (OPEN e ACKNOWLEDGED), **Resolvidos (n)**. Filtros: Tipo (Dor, Falta, Check-in atrasado), Aluno (busca por nome), Estado (Aberto, Visto), Período. Ordenação padrão: Dor primeiro, depois mais recentes (ordem por tipo só como apoio; a ordem é explicada em texto, não por cor).
- Fila do gestor: alertas realocados (T-49) aparecem para o gestor com selo de texto "Sem responsável" (sem selo de API: spec cobre).
- Linha/cartão (nível lista, **sempre genérico**): ícone + tipo ("Dor", "Falta", "Check-in atrasado"), nome do aluno (dado básico), "há 2 h" (`time`), estado (badge). **Detalhe de saúde NÃO aparece na linha** (nem região, nem intensidade, nem "dor forte"). **Fora do portão** (tabela 0.3; decisão do principal, PRV-E-01): tipo neutro "Alerta", linha "Novo alerta", sem "Dor" em título, texto de leitor de tela ou detalhe, e o aluno fica fora do filtro por tipo e da ordem "Dor primeiro"; metadado e ações Marcar como visto/Resolver permanecem. **Dentro do portão** a Dor diz "Novo alerta de dor" sem detalhe; Falta: "Falta no dia previsto" (metadado de agenda; dentro do portão, ver variantes); Check-in: "Questionário atrasado desde dd/mm".
- **Detalhe do alerta** (painel lateral 1440; página/sheet 390 e 768; título `h2` "Alerta de [tipo]", sem texto de saúde em `title`). Dentro do portão: Dor mostra região e intensidade (0 a 10), nota do aluno, sessão e série de origem, "Registrado pelo aluno em dd/mm hh:mm"; Falta mostra dia previsto e sessão prevista (nome do treino); Check-in mostra questionário, data de envio e `due_at`. Fora do portão: cartão "Oculto por privacidade" com o motivo; ações "Marcar como visto" e "Resolver" continuam (metadado) com texto "Você pode registrar que tratou o alerta mesmo sem ver o detalhe."
- Ações sugeridas (**só links, nada grava sozinho**): "Falar com o aluno" (TRN-33), "Ver execução" (TRN-31), "Enviar questionário" (TRN-32). Para Dor, bloco informativo estático "Se houver sinal de gravidade, oriente o aluno a procurar atendimento de saúde." ([LEGAL] [MOCK] texto provisório; sem recomendação clínica gerada). **IA**: bloco "Sugestões da IA (Em breve, lote D)" com selo I1, recolhido, sem controles; texto "Quando existir, a IA só sugere. Você decide."
- **Resolver**: `AuraUI.confirm` "Resolver este alerta?" consequências: "O alerta sai da fila de abertos e fica em Resolvidos." "O aluno não é avisado." "Você pode reabrir hoje." Nota de resolução (opcional, 300 caracteres) com aviso "Não escreva informação de saúde aqui, a menos que o aluno já tenha liberado." (campo desabilitado fora do portão). Botões "Resolver" e "Cancelar" de mesmo peso. "Marcar como visto": sem confirmação, desfaz com "Desfazer" no toast.
- Ação em lote: "Marcar selecionados como vistos" (caixa de seleção por linha, contador anunciado); **sem lote de "Resolver"** (evita fechar alerta de dor sem olhar).

**Componentes.** page-header, `tabs`, `table`/`table-wrap`, `badge` (danger/warning/info/neutral), `avatar`, `chip`, painel de detalhe (`card`), `alert`, `empty-state`, `skeleton`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `padrao, so-vistos, sem-alertas, so-resolvidos, filtro-sem-resultado, fila-gestor, detalhe-dor, detalhe-falta, detalhe-checkin, detalhe-oculto-sem-consentimento, detalhe-oculto-revogado, detalhe-oculto-nao-confirmado, detalhe-oculto-pausado, detalhe-oculto-encerrando, detalhe-menor-em-espera, vinculo-encerrado, resolvendo, resolvido, erro-resolver, conflito, carregando, erro, offline, sem-permissao`).
- Vazio: "Nenhum alerta aberto." / "Quando algo precisar da sua atenção, aparece aqui." (sem tom de culpa; sem "tudo certo" que sugira ausência de risco). Resolvidos vazio: "Nenhum alerta resolvido ainda."
- Filtro sem resultado: "Nenhum alerta encontrado para esses filtros. Limpar filtros." (`role=status`).
- Aluno com vínculo ENDED: alertas abertos somem da fila (T-49/relação com purga); em Resolvidos aparecem só como metadado "Aluno com vínculo encerrado" sem detalhe. SUSPENDED/ENDING: linha com badge "Vínculo pausado/encerrando", detalhe oculto.
- Conflito (outro responsável tratou): "Este alerta já foi [visto/resolvido] por [nome]. Recarregar." nada é sobrescrito.
- Erro ao resolver: "Não foi possível resolver. O alerta continua aberto." + "Tentar de novo". Offline: ações desabilitadas com motivo.
- Sem permissão: gestor sem ser responsável lê tudo do tenant, mas **não** muda estado de alerta de outro responsável (ações ausentes com nota "Só o responsável pelo aluno trata este alerta." ; pressuposto 1). Sem papel de personal/gestor: acesso negado.
- Limite: não se aplica (sem consumo de plano).
- Offline/lento: leitura do cache com hora.

**Textos-chave.** "Novo alerta" (fora do portão), "Novo alerta de dor" (dentro do portão), "Falta no dia previsto", "Check-in atrasado", "Marcar como visto", "Resolver", "Falar com o aluno". Contador: "12 alertas abertos" em `aria-live`.

**Acessibilidade específica.** Fila como lista com `article` por alerta e `h2` com o tipo; estado em texto e ícone; seleção em lote com `aria-checked` e contador; painel de detalhe com foco no `h2` ao abrir e retorno ao item ao fechar; ordem por tipo explicada em texto; tecla Esc fecha o painel.

**Layout.** 390: lista de cartões, detalhe em tela cheia (sheet); 768: lista com detalhe em página; 1440: duas colunas (lista 420 px | detalhe), filtros em barra superior.

**Dados mock.** `alert`: id, kind (PAIN|ABSENCE|CHECKIN_OVERDUE), status (OPEN|ACKNOWLEDGED|RESOLVED), createdAt, recipientUserId|null, studentName, linkStatus, gate {eligible, reasonCode}, origin (SYSTEM), detail (só se eligible: region, intensity, note, sessionName, setLabel | expectedDay, sessionLabel | questionnaireName, sentAt, dueAt), resolvedAt, resolvedByName, resolutionNote. Mínimo 14: 4 dor, 3 falta, 3 check-in, 1 vista, 3 resolvidos; 2 de alunos fora do portão (1 revogado, 1 pausado), 1 sem responsável, 1 de vínculo encerrado. [MOCK] sem dado real; textos de dor genéricos ("região [MOCK]").

---

## TRN-31 Execuções recentes e retorno com reações

**Objetivo.** Ver o que os alunos fizeram (sessões, carga, RPE, dor) e responder com retorno curto e reação rápida. Arquivo: `screens/acompanhamento/execucoes.html` (`?aluno=`), detalhe `execucao-detalhe.html?sessao=`. Fonte: T-16, T-18, T-20 a T-23, T-28, T-35, T-46, T-47, T-53.

**Fluxo.** Entrada: menu "Execuções"; aba Execuções de TRN-02; link do alerta de Dor (TRN-30). Saída: "Abrir sessão" (detalhe); "Responder" abre o retorno; "Abrir aluno"; "Ver alerta".

**Conteúdo.**
- h1 "Execuções"; subtítulo "O que seus alunos fizeram, com carga, esforço e retorno."; filtros: Aluno, Período (7 dias, 30 dias, personalizado), Status (Concluída, Em andamento, Interrompida), "Só com dor", "Só sem retorno". Contador `aria-live`.
- **Lista** (dentro do portão): aluno, treino/sessão (A, B…), data/hora, duração, séries feitas/previstas ("12 de 14"), esforço da sessão (RPE de 1 a 10), badge "Dor registrada" (ícone + texto; só indica existência, detalhe no detalhe), badge "Sem retorno", "Registrado pelo aluno/por você" (autoria). **Alunos fora do portão não aparecem na lista de execuções**; aparece uma única nota "Execuções de alunos sem saúde liberada ficam ocultas." sem contagem nem nomes (regra 8; padrão conservador).
- **Detalhe da sessão** (`h1` "Sessão de [data]", nome do aluno em subtítulo; sem texto de saúde em `title`): cabeçalho (treino, data, duração, "Como chegou": sono, energia, humor, opcional T-21; esforço da sessão); lista de exercícios na ordem prescrita; para cada exercício: nome, tabela de séries (prevista vs. realizada: repetições, carga kg, RPE, tempo, tipo de série; série extra marcada "Extra"; troca de exercício marcada "Trocado por [nome]" com motivo; comentário do aluno por série/sessão). Gráfico "Carga e RPE por sessão" (linha ou barras) com **tabela equivalente** e resumo textual ("A carga subiu de 40 para 45 kg nas últimas 4 sessões" [MOCK], descritivo, **sem interpretação clínica nem sugestão de carga**). Dor: lista de relatos (região, intensidade 0 a 10, nota, serie) com "Registrado pelo aluno" e atalho "Ver alerta" (TRN-30). Mídia de execução (vídeo do aluno, T-28): bloco "Vídeo enviado pelo aluno" exige VIDEO (e/ou FOTOS) GRANTED além de SAUDE_GERAL; estados por `ref_state`: PENDING "Processando o arquivo…", READY (reproduz, URL assinada de prazo curto, ao expirar: "O link expirou. Atualizar"), FAILED "Não foi possível processar o vídeo.", PURGED "Mídia removida". Sem VIDEO GRANTED: "Vídeo não liberado pelo aluno." (sem prévia, sem poster, sem duração).
- **Retorno** (T-35): conversa curta por sessão ou por série (seletor "Responder a: Sessão inteira | [Exercício, série n]"). Mensagens com autor e papel ("Você", "Aluno", "[Colega]"), hora, "Registrado pelo aluno/por você". Compositor: caixa de texto (500 caracteres, contador), botão "Enviar retorno", **reações rápidas** (Curti, Forte, Parabéns, Atenção) como grupo de botões `aria-pressed` com texto e ícone; reagir é toggle e remove só a própria reação (T-46 e matriz RLS). Aviso fixo acima do compositor: "O aluno lê este retorno. Seja claro e respeitoso. Não use para diagnóstico." ([LEGAL] [MOCK] texto provisório). Envio exige SAUDE_GERAL GRANTED, projeção vigente e vínculo ACTIVE (T-33; falha fechada, "Não foi possível enviar agora. Tente de novo em instantes." sem expor motivo técnico). Sem esses pré-requisitos, o compositor não existe (substituído por cartão com o motivo).
- **Sugestão da IA**: bloco "Sugestão de retorno (Em breve, lote D)" com selo I1, sem botão "usar"/"enviar"; "A IA só sugere. Você escreve e envia."

**Componentes.** page-header, `table`/cartões, `badge`, `chip`, gráfico simples com tabela, `progress`, player de mídia nativo, `textarea`, `btn-group` de reações, `alert`, `empty-state`, `skeleton`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `padrao, com-dor, sem-retorno, retorno-respondido, em-andamento, interrompida, troca-exercicio, serie-extra, video-pronto, video-processando, video-falhou, video-expirado, video-nao-liberado, sem-execucoes, filtro-sem-resultado, aluno-fora-do-portao, sem-consentimento, revogado, nao-confirmado, vinculo-pausado, vinculo-encerrando, vinculo-encerrado, menor-em-espera, enviando-retorno, erro-enviar-retorno, retorno-offline, conflito, carregando, erro, offline, sem-permissao`).
- Vazio: "Nenhuma execução neste período." / "Quando seus alunos fizerem os treinos, aparecem aqui." (Aluno sem execuções no detalhe: "Este aluno ainda não fez nenhuma sessão.").
- Sem consentimento / revogado / não confirmado / pausado / encerrando / encerrado / menor em espera: na lista geral, o aluno some e a nota única aparece; em `?aluno=` (ou TRN-02), tela inteira vira o cartão "Oculto por privacidade" com o motivo (seção 0.2), nenhum exercício, carga, RPE, dor ou contagem. Ações de escrita ausentes. Mock não gera execução para esses alunos.
- Vínculo pausado: sessões anteriores permanecem ocultas e o retorno é desabilitado (tabela 0.3). Encerrado: padrão conservador, nada de execução.
- Retorno offline: "Sem conexão. O retorno não foi enviado." texto mantido na caixa; **sem** rascunho persistido no navegador (pode ser saúde; regra do lote BC). Erro ao enviar: "Não foi possível enviar. Nada foi enviado ao aluno." + "Tentar de novo". Conflito: "Esta conversa mudou. Recarregar."
- Limite: não há.
- Sem permissão: gestor sem ser responsável lê, não responde (compositor ausente, nota "Só o responsável responde ao aluno."). Sem papel: acesso negado.

**Textos-chave.** "Responder", "Enviar retorno", reações "Curti", "Forte", "Parabéns", "Atenção"; "Registrado pelo aluno". Toast sem saúde: "Retorno enviado." (sem trecho da mensagem).

**Acessibilidade específica.** Tabela de séries com `caption` oculta e `scope`; no 390 vira cartões por série com rótulos visíveis; reações com `aria-pressed` e nome completo ("Reagir com Parabéns"); conversa como lista com `time`; foco no compositor após "Responder"; gráfico com texto alternativo e tabela; vídeo com descrição; contador de caracteres anunciado em marcos.

**Layout.** 390: lista de cartões, detalhe empilhado (cabeçalho, exercícios, retorno), compositor fixo no rodapé; 768: duas colunas (exercícios | retorno); 1440: lista | detalhe | retorno em painel lateral (360 px) fixo.

**Dados mock.** `session`: id, studentName, gate, assignmentName, sessionLabel, startedAt, endedAt, durationMin, status, sessionRpe, readiness {sleep, energy, mood}, origin, registeredByName, performances[{exerciseName, substituted, substitutionReason, sets[{plannedReps, plannedLoad, doneReps, doneLoadKg, rpe, durationSec, setType, isExtra, comment}]}], pain[{region, intensity, note, setRef}], media[{refState, title, alt, durationSec, requiresConsent: VIDEO}], feedback[{authorRole, authorName, body, createdAt, reactions[{kind, byName}]}]. Só alunos elegíveis têm sessões: 3 alunos, ≥8 sessões ([MOCK] cargas e textos genéricos, sem recomendação clínica); 1 sessão com dor, 1 com vídeo pronto, 1 com troca, 1 com série extra.

---

## TRN-32 Questionários (modelos, envio, respostas)

**Objetivo.** Gerir modelos de questionário, enviar a alunos e ver respostas. Arquivo: `screens/acompanhamento/questionarios.html` (`?aluno=`), `questionario-modelo.html?id=`, `questionario-enviar.html?modelo=`, `questionario-resposta.html?id=`. Fonte: T-24 a T-27, T-45, T-53; `questionnaire_*`.

**Fluxo.** Entrada: menu "Questionários"; aba Questionários de TRN-02; "Enviar questionário" no alerta Check-in atrasado (TRN-30). Saída: "Enviar" volta à lista de envios com toast; "Ver resposta"; "Abrir aluno".

**Conteúdo (três áreas, abas).** h1 "Questionários"; subtítulo "Modelos, envios e respostas dos seus alunos."
1. **Modelos** (spec cobre): lista com tipo (Check-in, Anamnese, Avaliação), origem ("Do sistema" = global, "Seu" = cópia do tenant, `origin_template_id`), versão ("v2"), status da versão (rascunho, publicada), nº de perguntas. Modelo global só leitura, ação "Personalizar uma cópia" (cria cópia sua; "O original não muda."). **Editor da cópia (v1 limitada, T-25)**: perguntas padrão com chave "Incluir" (`enabled`), perguntas de texto livre adicionáveis, **sem construtor completo** (nota "Construtor completo: não faz parte desta versão", sem selo, é decisão de escopo da spec). Tipos de pergunta: Texto, Número, Escala, Sim/Não, Escolha, Foto. Campos padrão tipados (peso, fotos, medidas, gordura corporal %; T-26). "Publicar versão" com confirmação "Publicar a v3? Versões publicadas não podem ser alteradas. Questionários já enviados continuam na versão que o aluno recebeu." (T-27). Aviso fixo no editor: "Escreva perguntas gerais. Não inclua dado de saúde de nenhuma pessoa no texto da pergunta." Perguntas de **foto** e medidas corporais mostram selo textual "Sensível: exige consentimento de fotos" (FOTOS) e ficam desabilitadas no envio a aluno sem FOTOS GRANTED.
2. **Envios** (submissões): tabela/cartões: aluno, modelo e versão, enviado em, prazo (`due_at`), estado (Pendente, Respondido, Cancelado, **Atrasado** = pendente após `due_at`, que gera alerta Check-in atrasado), "Registrado pelo aluno/por você" (T-53). Lista de envios é conteúdo de saúde (regra 8): **só alunos dentro do portão**; os demais não aparecem na lista, com nota única "Envios de alunos sem saúde liberada ficam ocultos." sem contagem.
3. **Respostas**: abrir envio respondido mostra pergunta e resposta por tipo (texto, número com unidade, escala com valor e extremos em texto, sim/não, escolha, foto com estados `ref_state` e consentimento FOTOS), data de resposta, versão respondida. Peso e medidas alimentam gráfico "Evolução" com tabela equivalente (somente descrição numérica, sem interpretação nem meta sugerida). Sem edição de resposta pelo personal.
- **Enviar questionário** (`questionario-enviar`): passo 1 escolher modelo (versão publicada mais recente); passo 2 escolher aluno(s) (combobox só com alunos **dentro do portão**; os demais desabilitados com motivo neutro "Aguardando liberação de saúde", "Vínculo pausado", "Vínculo encerrando", "Conta em espera"; nome apenas, sem contagem); passo 3 prazo (padrão sem prazo; "Definir prazo" opcional, mínimo amanhã; "Sem recorrência automática nesta versão", T-45) e mensagem opcional (aviso "Não escreva informação de saúde, a menos que o aluno já tenha liberado"; campo desabilitado fora do portão); passo 4 resumo com consequência: "O aluno recebe o questionário no app e é avisado." "Ele escolhe o que responder; você só vê as respostas enviadas." "Se passar do prazo, você recebe um alerta de check-in atrasado." Botões "Enviar" e "Cancelar" de mesmo peso. Cancelar envio pendente: confirmação "Cancelar este envio? O aluno deixa de poder responder."
- **IA**: "Sugestões de perguntas (Em breve, lote D)" com selo I1, sem controle de aplicar.

**Componentes.** page-header, `tabs`, `table`/cartões, `badge`, `combobox`, `input type=date`, `textarea`, `chip`, `modal`, `alert`, `empty-state`, `skeleton`, gráfico + tabela, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `modelos, envios, respostas, resposta-detalhe, modelo-sistema-leitura, modelo-copia-rascunho, modelo-publicado, sem-modelos-proprios, envio-passo-1, envio-passo-2, envio-passo-3, envio-resumo, envio-sem-alunos-elegiveis, envio-aluno-fora-do-portao, envio-foto-sem-consentimento, envio-pendente, envio-atrasado, envio-cancelado, sem-envios, sem-respostas, filtro-sem-resultado, enviando, erro-enviar, erro-validacao, conflito, sem-consentimento, revogado, nao-confirmado, vinculo-pausado, vinculo-encerrando, vinculo-encerrado, menor-em-espera, limite-recurso, carregando, erro, offline, sem-permissao`).
- Vazio Envios: "Nenhum questionário enviado." / "Envie um check-in para acompanhar como seus alunos estão." (neutro). Vazio Modelos próprios: "Você ainda não tem modelos próprios." / "Use um modelo do sistema ou personalize uma cópia." Vazio Respostas: "Nenhuma resposta recebida ainda."
- Sem consentimento / revogado / não confirmado: aba Envios e Respostas do aluno viram "Oculto por privacidade" com o motivo; **modelos continuam acessíveis** (não são dado de aluno). Envio a esse aluno desabilitado com o motivo. Respostas antigas ocultas, sem contagem.
- Vínculo pausado: envio desabilitado, respostas ocultas. Encerrando: desabilitado. Encerrado: oculto. Menor em espera: oculto e bloqueado.
- Limite (`limite-recurso`): se o plano não inclui questionário personalizado (entitlement, T-40): alerta info "O seu plano não inclui modelos personalizados." com "Ver planos"; modelos do sistema continuam. Sem pressão ("Você pode continuar usando os modelos do sistema").
- Erro validação: "Escolha um modelo.", "Escolha ao menos um aluno.", "O prazo deve ser depois de hoje." Foco no primeiro erro. Erro ao enviar: "Não foi possível enviar. Nada foi enviado ao aluno." Conflito de versão: "Há uma versão mais nova do modelo. Revisar antes de enviar." Offline: envio e publicação desabilitados com motivo.
- Sem permissão: não é responsável pelo aluno: acesso negado sem confirmar existência; gestor lê respostas dos alunos do tenant mas não envia (pressuposto 1).

**Textos-chave.** "Enviar questionário", "Personalizar uma cópia", "Pendente", "Respondido", "Atrasado", "Cancelar envio". Toast: "Questionário enviado a [Nome]." (sem nome do questionário se ele sugerir saúde, ex. "Anamnese": usar "Questionário enviado").

**Acessibilidade específica.** Editor de perguntas com reordenar Subir/Descer (anúncio de posição) e chave "Incluir" como `switch` com rótulo; combobox de aluno com motivo de desabilitado em `aria-describedby`; escala renderizada em texto (valor e extremos), não só visual; respostas como lista de definição `dl`; gráfico com tabela; estados de envio com texto e ícone.

**Layout.** 390: abas roláveis, cartões, envio em etapas de tela cheia; 768: tabela compacta, envio em página única; 1440: lista | detalhe da resposta, envio com "Resumo" fixo à direita.

**Dados mock.** `template`: id, kind (CHECKIN|ANAMNESIS|ASSESSMENT), name, scope (GLOBAL|TENANT), version, versionStatus, questions[{key, type, label, enabled, standardField|null}]. `submission`: id, studentName, gate, templateName, version, status (PENDING|SUBMITTED|CANCELED), sentAt, dueAt, overdue, submittedAt, origin, registeredByName, answers[{questionKey, value, unit, refState}] (só se eligible). 3 modelos do sistema, 2 cópias próprias; 8 envios (3 pendentes, 1 atrasado, 3 respondidos, 1 cancelado) só de alunos elegíveis; para os demais, nada ([MOCK] valores genéricos).

---

## TRN-33 Chat privado

**Objetivo.** Conversar em particular com um aluno. Arquivo: `screens/acompanhamento/mensagens.html` (`?aluno=`). **Selo "Requer API nova" C1**: a spec só cobre retorno por sessão/série (T-35), não conversa geral personal-aluno.

**Fluxo.** Entrada: menu "Mensagens"; "Enviar mensagem" em TRN-02/TRN-30; notificação (TRN-34). Saída: "Abrir aluno"; "Ver execução" (quando a mensagem referencia sessão, dentro do portão).

**Conteúdo.**
- h1 "Mensagens" com selo "Requer API nova" ao lado; subtítulo "Converse em particular com cada aluno." Nota fixa: "Para comentar uma sessão ou série, use o retorno na tela de Execuções."
- **Lista de conversas** (esquerda): aluno (avatar, nome), prévia da última mensagem (**a prévia é omitida por padrão**: mostra só "Nova mensagem" e hora, pois texto pode conter saúde; regra 8 e T-51), contador de não lidas (texto "2 não lidas"), badge "Vínculo pausado/encerrando" quando aplicável. Busca por nome.
- **Conversa** (direita): mensagens com autor ("Você", "[Nome do aluno]"), hora (`time`), estado do envio (Enviando, Enviada, Falhou). Agrupadas por dia. "Registrado pelo aluno/por você" implícito pela autoria do balão.
- **Compositor**: `textarea` rotulado "Escreva uma mensagem" (1000 caracteres, contador), "Enviar" (Ctrl+Enter também; Enter quebra linha), **sem anexo** quando FOTOS/VIDEO não estão GRANTED (botão "Anexar" ausente, não só desabilitado; nota "Anexos ficam disponíveis quando o aluno liberar fotos ou vídeos."). Com consentimento, anexo permitido apenas como mídia privada de aluno do aura-media (selo C1; dado de saúde-mídia exige FOTOS/VIDEO GRANTED e SAUDE_GERAL).
- **Aviso fixo acima do compositor** (conservador): dentro do portão: "Mensagens podem tratar de saúde porque o aluno liberou esse acesso. Só você, os outros responsáveis e o gestor veem esta conversa." ([LEGAL] [MOCK] texto provisório). **Fora do portão (sem consentimento/revogado/não confirmado)**: modo "Mensagem geral": "O aluno não liberou dados de saúde. Escreva só sobre assuntos gerais, como horários e avisos." O envio continua permitido (não é conteúdo de saúde), mas **sem anexo**, e com verificação de texto simples (aviso suave, não bloqueio): se a mensagem tiver palavras de lista [MOCK] (dor, lesão, remédio, doença), mostra "Esta mensagem parece tratar de saúde. Sem a liberação do aluno, não envie esse tipo de informação." com "Editar" (primário) e "Enviar mesmo assim" (secundário com confirmação). Padrão do protótipo; a regra jurídica é **[LEGAL]** pendente.
- Mensagens recebidas do aluno com conteúdo de saúde em vínculo revogado: ocultas ("Mensagens ocultas por privacidade") conforme destino pós-revogação (lote A, regra 4); em "Mensagem geral" o personal vê só o que o aluno enviou antes da revogação se sem saúde — **padrão conservador: histórico oculto após revogação** ([LEGAL]).
- **IA**: "Sugestão de resposta (Em breve, lote D)" com selo I1, sem botão de inserir.
- Ações da conversa (menu "Mais"): "Silenciar conversa", "Ver aluno". Sem apagar mensagem na v1 do protótipo (nota; pressuposto 6).
- Pausa de vínculo: lista e conversa legíveis só como metadado; envio desabilitado: "Vínculo pausado. Você não pode enviar mensagens agora." Retomar o vínculo reabilita. Encerrando: "Vínculo em encerramento. Não é possível enviar mensagens." Encerrado: "Conversa encerrada." sem conteúdo (ver tabela 0.3).

**Componentes.** page-header, lista de conversas (`list`), balões de mensagem (`card`), `textarea`, `btn`, `badge`, `alert`, `empty-state`, `skeleton`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `lista, conversa, sem-conversas, conversa-vazia, nao-lidas, enviando, falhou-envio, saude-detectada, mensagem-geral-sem-consentimento, revogado, nao-confirmado, vinculo-pausado, vinculo-encerrando, vinculo-encerrado, menor-em-espera, com-anexo-liberado, sem-anexo, limite-caracteres, carregando, erro, offline, conflito, sem-permissao`).
- Vazio Lista: "Nenhuma conversa ainda." / "Quando você ou um aluno enviar uma mensagem, ela aparece aqui." (selo C1 visível). Conversa vazia: "Comece a conversa com [Nome]." Fora do portão em conversa vazia: mesma frase com o aviso de mensagem geral.
- Carregando: skeleton de 6 conversas e 5 balões. Erro: "Não foi possível carregar as mensagens." + "Tentar de novo".
- Falha de envio: balão com "Não enviada" (ícone + texto) e botões "Tentar de novo" e "Apagar este rascunho"; **texto não é persistido no navegador** (pode ser saúde). Offline: "Sem conexão. A mensagem não foi enviada." compositor desabilitado com motivo.
- Limite de caracteres: contador "1000 de 1000" e bloqueio de envio com texto "A mensagem passou do limite." Limite de plano: não se aplica.
- Sem consentimento/revogado/não confirmado/pausado/encerrando/encerrado/menor em espera: conforme tabela 0.3 e as regras acima.
- Sem permissão: não é responsável pelo aluno: acesso negado sem confirmar existência; gestor sem ser responsável: lê metadado, sem enviar (pressuposto 1).
- Conflito: "A conversa mudou. Recarregar." (sem perder o texto digitado enquanto permanecer na tela).

**Textos-chave.** "Mensagens", "Escreva uma mensagem", "Enviar", "Mensagem geral", "Anexos ficam disponíveis quando o aluno liberar fotos ou vídeos." Toast: "Mensagem enviada." (sem trecho). Notificação ao aluno: genérica "Você tem uma nova mensagem do seu personal" ([MOCK]).

**Acessibilidade específica.** Conversa como `role=log` com `aria-live=polite` para mensagens novas (anunciar "Nova mensagem de [Nome]" sem ler o conteúdo se ele puder ser sensível; leitor lê só ao focar); lista de conversas navegável por setas; compositor com `aria-describedby` do aviso e do contador; alvos 44 px; estados "Enviando/Enviada/Falhou" por texto e ícone; foco no compositor ao abrir a conversa; Esc não apaga rascunho.

**Layout.** 390: lista e conversa em telas separadas (voltar), compositor fixo no rodapé acima do teclado; 768: lista em gaveta e conversa em coluna única; 1440: lista (320 px) | conversa | painel "Sobre o aluno" opcional (só metadado: nome, modo, vínculo, estados de consentimento; sem dado de saúde).

**Dados mock.** `conversation`: id, studentName, gate, linkStatus, unread, lastAt. `message`: id, conversationId, authorRole (PERSONAL|STUDENT), authorName, body, createdAt, state (SENDING|SENT|FAILED), attachment|null (só se consent FOTOS/VIDEO), refersToSessionId|null. 5 conversas: 3 elegíveis, 1 revogado (mensagem geral), 1 pausado; ≥12 mensagens ([MOCK] texto genérico, ex. "Treino de quinta movido para sexta [MOCK]"; nenhum conteúdo de saúde nas conversas fora do portão).

---

## TRN-34 Notificações

**Objetivo.** Central de avisos do personal (alertas, respostas de alunos, mensagens, questionários respondidos, vínculos). Arquivo: painel do sino no cabeçalho e página `screens/acompanhamento/notificacoes.html`. **Selo "Requer API nova" C2**: a spec cobre `alerts`, mas não um centro unificado de notificações do personal. Texto externo genérico (T-51).

**Fluxo.** Entrada: sino do cabeçalho (contador); menu. Saída: item abre o destino (TRN-30, TRN-31, TRN-32, TRN-33, TRN-02); "Marcar todas como lidas".

**Conteúdo.**
- h1 "Notificações" com selo "Requer API nova"; subtítulo "Avisos sobre seus alunos e sua conta." Abas: **Não lidas (n)** e **Todas**. Filtro por tipo: Alertas, Mensagens, Questionários, Vínculos e convites, Sistema. Agrupado por dia.
- Item: ícone + tipo (texto), **texto sempre genérico** ("Novo alerta de um aluno", "Nova mensagem", "Questionário respondido", "Convite aceito", "Vínculo pausado") + nome do aluno quando for dado básico e não revelar saúde ("Novo alerta de Ana" é permitido; **nunca** "Ana relatou dor no joelho"), hora, marca "Não lida" (texto, não só ponto). Fora do portão ou vínculo não ACTIVE: o texto é o mesmo genérico e o destino abre o cartão "Oculto por privacidade".
- Ações: "Marcar como lida" (por item), "Marcar todas como lidas" (confirmação leve com consequência "Os avisos continuam na lista"), "Silenciar tipo" (preferências: Alertas sempre ligado e **não pode ser silenciado por completo** nesta versão, padrão conservador, com texto "Alertas não podem ser desligados."; Mensagens e Questionários podem; sem pré-marcado que reduza proteção). Nenhuma notificação de IA.
- Preferências por canal (no app, e-mail, push): padrão **no app**; e-mail e push com **conteúdo genérico**, nunca com saúde (T-51); texto "E-mails e avisos no celular mostram só 'Novo alerta de um aluno'. Os detalhes ficam no app." Opções não pré-marcadas além do padrão do sistema; sem dark pattern, sem "perder alertas se desligar" como pressão (texto neutro).
- Retenção: itens com mais de 90 dias somem [MOCK, a definir; [LEGAL]/produto].

**Componentes.** `popover`/painel, `tabs`, lista (`list`), `badge`, `chip`, `switch`, `alert`, `empty-state`, `skeleton`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `painel, pagina, so-nao-lidas, vazio, filtro-sem-resultado, tudo-lido, alerta-oculto-por-privacidade, vinculo-pausado, vinculo-encerrado, menor-em-espera, preferencias, preferencias-salvando, erro-preferencias, carregando, erro, offline, sem-permissao, limite-itens`).
- Vazio: "Nenhuma notificação." / "Avisos sobre seus alunos aparecem aqui." (selo C2 visível). Sem não lidas: "Você leu tudo." (neutro, sem celebração).
- Carregando: skeleton de 8 itens. Erro: "Não foi possível carregar as notificações." + "Tentar de novo". Offline: cache com hora; "Marcar como lida" desabilitado com motivo.
- Limite (`limite-itens`): lista paginada, "Carregar mais"; aviso "Mostrando os últimos 90 dias." Sem limite de plano.
- Sem consentimento/revogado/vínculo pausado ou encerrado/menor em espera: o item permanece genérico; ao abrir, vai ao destino com cartão "Oculto por privacidade" (seção 0.2). Notificação de vínculo encerrado leva a "Histórico" de TRN-01, sem dado de saúde.
- Sem permissão: o personal só vê notificações dos alunos pelos quais é responsável; o gestor vê as da fila do gestor (T-49). Sem papel: acesso negado. Erro ao salvar preferências: "Não foi possível salvar. Suas preferências continuam as mesmas."

**Textos-chave.** "Notificações", "Marcar como lida", "Marcar todas como lidas", "Novo alerta de um aluno", "Alertas não podem ser desligados." Contador do sino: "3 notificações não lidas" (`aria-label`, `aria-live`).

**Acessibilidade específica.** Sino como botão com `aria-expanded` e contador em texto; painel `dialog` não modal com foco preso, Esc fecha e devolve foco ao sino; lista com `<time>`; "Não lida" em texto; atualização de contador em `aria-live=polite` agrupada (sem anunciar a cada item); `switch` com rótulo e estado em texto.

**Layout.** 390: sino abre tela cheia; 768: painel suspenso 420 px; 1440: painel suspenso 420 px e página própria com filtros em barra lateral (280).

**Dados mock.** `notification`: id, kind (ALERT|MESSAGE|QUESTIONNAIRE|LINK|SYSTEM), genericText, studentName|null, createdAt, readAt|null, targetHref, gateReason|null. 12 itens (4 alertas, 3 mensagens, 2 questionários respondidos, 2 vínculos/convites, 1 sistema); 2 de alunos fora do portão; `preferences` {channels{inApp, email, push}, mutedKinds[]}. [MOCK] sem dado real.

---

## 8. Itens com selo "Requer API nova" (para `_pendencias-api-training.md`)

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| C1 | Chat privado geral personal-aluno (conversa, não lidas, anexo com consentimento FOTOS/VIDEO, silenciar) | TRN-33 (`mensagens.html`), atalhos em TRN-02/TRN-30 | Spec: só retorno por sessão ou série (T-35); conversa geral não existe |
| C2 | Centro de notificações do personal (lista unificada, lida/não lida, preferências por canal e tipo) | TRN-34 (`notificacoes.html`, sino do cabeçalho) | Spec: só `alerts` e notificação externa genérica (T-51); centro unificado não existe |
| I1 (reuso) | Sugestões da IA (alertas, retorno, mensagem, perguntas) só como encaixe "Em breve" | TRN-30, TRN-31, TRN-32, TRN-33 | IA fora da v1 (T-38); a IA só sugere |

Sem selo (spec cobre): alertas PAIN, ABSENCE, CHECKIN_OVERDUE e seus estados OPEN, ACKNOWLEDGED, RESOLVED (T-18, T-43, T-45, T-49, T-51); execuções, séries, RPE, dor, mídia de execução (T-16 a T-23, T-28); retorno e reações (T-35, T-46); questionários, versões, envio e respostas (T-24 a T-27, T-53); consentimentos e portão (T-33, T-55); modo de acompanhamento (T-17, T-44).

## 9. Pendências Low a absorver na implementação (lista de referência, sem decidir)

Fonte: fim de `docs/operations/pendencias-aura-2026-10-26.md` (linhas 725 a 735). Itens do lote B+C abertos; o frontend-senior do lote E decide se os absorve ou os devolve ao principal.

| ID | Descrição (resumo fiel) | Onde |
|----|--------------------------|------|
| QA-BC-04 | Alvos de toque abaixo de 44 px em 390 px: títulos de cartão em catálogo e biblioteca, links de cópia em exercicio-form, "Ver histórico de ajustes" em treino-aluno-editor, radios de modo em aluno-acompanhamento (lote A). Ver `handoffs/proto-training-lote-bc-gate-qa-2026-11-10.md`. | Catálogo, biblioteca, exercicio-form, treino-aluno-editor, aluno-acompanhamento |
| QA-BC-05 | Breadcrumb em 390 px deixa ">" órfão no início da 2ª linha. | exercicio-visibilidade |
| QA-BC-06 | TRN-14: após "Manter privado" o radio segue em Público e "Salvar" fica habilitado; reverter para Privado ou rotular "Voltar e editar". Ver `handoffs/proto-training-lote-bc-gate3-qa-2026-11-10.md`. | TRN-14 |
| PRV-BC-A | `g6-treinos.js:132` (variante erro-salvar) diz "O rascunho continua neste navegador.", agora falso; trocar por "Suas alterações continuam nesta tela; tente novamente." e remover o banner morto em `g6-exercicios.js:215`. Confirmar no browser que `g6-draft-ex`/`g6-draft-model` somem (QA). | g6-treinos.js, g6-exercicios.js |

Observação de coerência: QA-BC-04 e QA-BC-05 são padrões que as telas de E também devem respeitar (alvos 44 px no 390, breadcrumb sem ">" órfão); PRV-BC-A reforça que E **não** persiste texto de saúde no navegador (retorno, mensagem, nota de resolução).

## 10. Pressupostos e lacunas (para decisão do principal/humano)

1. Gestor que não é responsável: lê (alertas, execuções, respostas, conversas só metadado), mas não trata alerta de outro, não responde retorno, não envia mensagem nem questionário. Coerente com lote A e BC.
2. Alerta de Dor em lista é genérico; o detalhe só no detalhe autenticado e dentro do portão. A ordem "Dor primeiro" é decisão de UX, a confirmar (risco: sensação de priorização clínica). **[LEGAL]**/produto.
3. "Reabrir" alerta resolvido no mesmo dia e a nota de resolução são pressupostos do autor; spec define estados mas não a transição de volta.
4. Verificação de palavras de saúde no chat sem consentimento (lista [MOCK]) é heurística de protótipo, não proteção real; regra definitiva e destino do histórico após revogação são **[LEGAL]**.
5. Prévia de mensagem omitida na lista de conversas (conservador); trade-off de usabilidade a testar.
6. Apagar mensagem, editar mensagem, indicador de "digitando" e confirmação de leitura ficaram fora (não há contrato; decidir com C1).
7. Pausa do vínculo desabilita chat, questionário e leitura de execuções; "pausa ocupa vaga" (lote A, V1) é regra de limite, sem efeito aqui.
8. Retenção de notificações (90 dias) e de alertas resolvidos: [MOCK], a definir. Silenciar alertas por completo proibido nesta versão (padrão conservador).
9. Acesso ao detalhe do alerta de Dor após vínculo encerrado: oculto (conservador), `alerts` morrem com a fonte (CASCADE) na purga.
10. Numeração TRN-30 a TRN-34 mantida; sem alterações. Sugestão de reuso: lista|detalhe (TRN-30 e TRN-33), compositor com aviso de portão (TRN-31 e TRN-33) e tabela de séries (TRN-31 e TRN-23) como componentes `g7-*`.
11. Evidência de usabilidade ausente: nenhuma sessão com personais. Recomenda-se teste rápido (5 personais) na fila de alertas (priorização e tratamento), no retorno com reações e no envio de questionário. Privacy-compliance deve revisar TRN-30 (detalhe de dor), TRN-31 (mídia, retorno), TRN-33 (modo mensagem geral e anexos) e TRN-34 (texto externo) antes de congelar.
12. Contraste e alvos de toque não verificados aqui (dependem dos tokens); QA do lote confirma 4.5:1 em claro e escuro e 44 px no 390.
