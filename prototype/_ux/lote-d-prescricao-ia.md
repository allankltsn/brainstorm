# Lote D, Prescrição com IA: especificação de UX (TRN-40 a TRN-42)

Data: 2026-11-10. Autor: ux-designer. Base: spec de telas (`../docs/superpowers/specs/2026-11-10-training-prototype-telas-design.md`, seções 3 a 7; inventário D), spec do training (`../docs/superpowers/specs/2026-10-24-aura-training-design.md`: T-38 IA fora da v1 e só o encaixe, P-09 IA exige consentimento IA e leitura autorizada e sem envio automático, 10.1 portão de consentimento, T-40 entitlements, T-51 e T-53 a T-55), `lote-a-meus-alunos.md` (seção 0 vale por referência: termos, selo, regras de privacidade 1 a 8, **regra 8 portão único de saúde**, estados e acessibilidade comuns), `lote-bc-exercicios-treinos.md` (TRN-21, TRN-23: destino do que a IA sugere) e `lote-e-acompanhamento.md` (seção 0.2 motivos de "Oculto por privacidade", 0.3 tabela por vínculo).
Convenções: protótipo estático, dados sempre `[MOCK]`, pt-BR com acentos, claro e escuro, sem HTML/CSS/JS aqui. Estados via `AuraState`, variantes via `aura-variants`. Textos jurídicos são **[LEGAL]** "[MOCK] texto provisório". Nenhum conteúdo de IA real: o protótipo mostra respostas fixas de demonstração.

## 0. Decisões transversais do lote D

**Menu e entradas.** Em `shell.js`, "Prescrição IA" sai de "Em breve" e abre TRN-40. Entradas contextuais (trocam os blocos "Em breve, lote D" do lote E e o selo I1 de TRN-21): botão "Sugerir com IA" no editor de modelo (TRN-21) e no treino do aluno (TRN-23); "Importar planilha ou texto" em TRN-20 (biblioteca); "Dados usados pela IA" em TRN-02 (aba Saúde, link) e em TRN-40. Telas: `screens/ia/painel-sugestoes.html` (`?aluno=`, `?origem=modelo|treino`), `screens/ia/importar.html`, `screens/ia/dados-ia.html` (`?aluno=`).

**Termos (uma palavra por conceito).** "Sugestão" (nunca "recomendação", "prescrição automática" ou "plano gerado"); "Aceitar" (leva ao rascunho) e "Dispensar"; "Ponto de atenção" (aviso de saúde da IA; nunca "alerta", que é o registro `alerts` do lote E, nem "contraindicação"); "Evidência" (fonte citada); "Dados usados" (o que foi lido para sugerir); "Uso de IA" = escopo de consentimento IA (lote A). "Rascunho" = conteúdo no editor ainda não salvo.

**Selo "Requer API nova"** como no lote A (seção 0). IDs novos, a acrescentar em `_pendencias-api-training.md` (acrescentado nesta entrega): **I2** (alertas de saúde e evidência científica citada), **I3** (importação de planilha/arquivo de texto com revisão), **I4** (escolha dos dados usados e registro de uso da IA), **I5** (pedido de liberação do uso de IA do personal ao aluno). **I1** (sugestões da IA de prescrição, reuso do lote B+C/E) cobre o painel TRN-40. Sem selo (spec cobre ou é só consumo): estados do consentimento IA (escopo IA existe, 10.1), cota e limite (entitlement, T-40; telas só consomem o número), vínculo, portão.

**0.1 Regras de produto (valem para TRN-40 a TRN-42).**
1. **A IA só sugere, nunca grava.** Nenhuma tela do lote tem "aplicar automaticamente", "salvar tudo", "enviar ao aluno" nem modo automático. Cadeia de duas ações humanas explícitas: (1) "Aceitar" a sugestão leva o conteúdo ao **rascunho** do editor (TRN-21/TRN-23), com confirmação que mostra o que muda; (2) o personal revisa e usa o "Salvar" do próprio editor (que mantém suas confirmações). Atribuir a aluno, publicar e notificar o aluno continuam nas telas de origem, nunca no painel de IA. Texto fixo visível no painel: "A IA só sugere. Você decide e salva." Conteúdo aceito entra marcado "Sugerido pela IA, revisado por você" apenas no rascunho; ao salvar, a autoria é do personal (T-53: origem PERSONAL_APP).
2. **Sem diagnóstico.** Pontos de atenção descrevem o que observar no treino, nunca uma condição, causa, tratamento ou probabilidade. Proibido: "você tem", "provável lesão", "contraindicado", "seguro", "sem risco". Aviso fixo em todo ponto de atenção: "Isto não é diagnóstico nem orientação de saúde. Em caso de dúvida, o aluno deve procurar um profissional de saúde." ([LEGAL] [MOCK] texto provisório). Ausência de ponto de atenção nunca é mostrada como "tudo certo": "A IA não apontou pontos de atenção. Isso não garante que não existam."
3. **Evidência citada, nunca inventada.** Cada sugestão ou ponto de atenção mostra 0 a 3 fontes `[MOCK]` com autor/entidade, ano, tipo (revisão sistemática, ensaio, diretriz, consenso, opinião de especialista), título e link externo (rótulo "Abrir fonte", abre em nova aba com aviso "Você vai sair do Aura"). Sem fonte: "Sem fonte citada. Trate como ideia a conferir." (selo textual, nunca esconder). Aviso: "O resumo foi escrito pela IA e pode conter erros. Confira a fonte." Nunca mostrar "nível de confiança" numérico nem "comprovado cientificamente".
4. **Dados de saúde só dentro do escopo de consentimento.** A IA só lê dado de saúde do aluno com **todas** as condições: Uso de IA (IA) = GRANTED **e** o portão único de saúde (lote A, regra 8: SAUDE_GERAL GRANTED, projeção vigente, vínculo ACTIVE, sem `account_on_hold`). Falha de qualquer uma: os dados de saúde **não são lidos nem listados**; a IA continua disponível apenas em **modo sem dados do aluno** (usa só o que o personal digita: objetivo, nível, dias, equipamento, restrições em texto livre digitadas por ele, com aviso para não colar dado de saúde de pessoa identificável). Fotos e vídeos do aluno **nunca** vão para a IA nesta versão (padrão conservador, [LEGAL]).
5. **Minimização por execução.** Cada geração mostra, antes do botão "Gerar sugestões", a lista "Dados que a IA vai ler" com caixas por categoria; categorias de saúde vêm **desmarcadas** por padrão (sem pré-marcado que amplie o uso; sem dark pattern, sem "recomendado" em verde). O personal marca o que quiser, dentro do que o escopo permite. Registro de uso (TRN-42) guarda categorias, não conteúdo.
6. **Padrão conservador.** Ação que consome cota ou envia dado ao serviço de IA pede clareza ("Isto usa 1 das suas 30 sugestões do mês"). Dispensar, cancelar e fechar têm o mesmo peso de Aceitar/Gerar. Estado nunca só por cor. Sem urgência falsa, sem culpa ("Você está perdendo..."), sem escassez para vender plano.
7. **Sem texto de saúde** em título de página, `title`, toast, notificação, URL (query só com id opaco) ou registro de uso. Sem persistência de resultado, entrada ou rascunho de IA no navegador (`localStorage`, `sessionStorage`, caches): ao sair da tela, o painel recomeça. Aviso de saída: "Sugestões não aceitas serão descartadas. O treino salvo não muda."
8. **Quem opera.** Personal responsável gera, aceita, importa e pede liberação. Gestor sem ser responsável: lê TRN-42 (matriz e registro de uso do tenant, sem conteúdo) e não gera para aluno de outro (pressuposto 1 do lote E). Aluno nunca vê esta área (ele vê o que foi liberado em ALU-06).

**0.2 Matriz de situação (tabela única do lote D).** "IA" = consentimento Uso de IA. "Portão" = lote A regra 8.

| Situação do aluno | IA com dados do aluno (TRN-40) | Modo sem dados do aluno | Importação (TRN-41) | TRN-42 (dados usados) |
|-------------------|--------------------------------|-------------------------|---------------------|-----------------------|
| ACTIVE, IA GRANTED e portão ok | sim, categorias à escolha | sim | sim | completo, "Usar nesta sugestão" |
| ACTIVE, IA NEVER_GIVEN | não; cartão "Uso de IA não liberado" + "Pedir liberação" (I5) | sim | sim | só estado + pedir liberação |
| ACTIVE, IA REVOKED | não; "Uso de IA revogado pelo aluno" | sim | sim | estado; sugestões e registro do aluno ocultos |
| ACTIVE, IA GRANTED e saúde NEVER_GIVEN/REVOKED/não confirmado | só categorias não-saúde (objetivo do treino); saúde "Oculto por privacidade" | sim | sim | categorias de saúde bloqueadas com motivo |
| SUSPENDED (pausado, ocupa vaga) | não; "Vínculo pausado" | sim (sem aluno) | sim | estado legível, sem registro de conteúdo |
| ENDING | não; "Vínculo em encerramento" | sim | sim | estado, somente leitura |
| ENDED | não; "Vínculo encerrado" | sim | sim | oculto, só metadado |
| Menor em espera (`account_on_hold`) | não; "Aguardando confirmação de idade ou responsável legal" | sim | sim | bloqueado |

Modo sem dados do aluno, importação e criação de modelo genérico **não dependem de aluno** (não há dado de pessoa); ficam disponíveis desde que o plano inclua IA.

**Estados comuns (padrão `AuraState`).** Carregando (skeleton do formato; geração: barra indeterminada com texto "Gerando sugestões. Isto pode levar até 30 segundos." e botão "Cancelar"; `aria-busy`), vazio, erro ("Não foi possível gerar sugestões agora. Nada foi alterado." + "Tentar de novo"), sem permissão (`sistema/acesso-negado.html`, "Você não é responsável por este aluno", sem confirmar existência), offline/lento (info "Sem conexão. Gerar, aceitar e importar ficam desabilitados." escrita desabilitada com motivo, não enfileira), conflito ("Este treino mudou desde que você abriu. Recarregar antes de aceitar."), **IA indisponível** ("O serviço de IA está fora do ar. Você pode continuar montando o treino sem IA." com link ao editor), **resposta bloqueada ou vazia** ("A IA não conseguiu sugerir nada para este pedido. Ajuste o pedido ou monte o treino sem IA."), **limite** (ver cada tela), sucesso (toast `role=status` sem texto de saúde: "Sugestão levada ao rascunho.").

**Acessibilidade comum a D.** Um `h1` por tela. Resultado gerado anunciado uma vez em `aria-live=polite` ("5 sugestões prontas e 2 pontos de atenção"), **sem ler o conteúdo**. Cada sugestão é `article` com `h3`; ações com nome completo ("Aceitar sugestão: [título]"). Selo "Gerado por IA" em texto e ícone em cada bloco (nunca só cor ou só ícone). Fontes como lista de links com texto descritivo. Tabelas com `caption`, `scope` e rótulos; 390 vira cartões. Alvos 44 px no 390 (absorver QA-BC-04 aqui: títulos de cartão e links). Breadcrumb sem ">" órfão no 390 (QA-BC-05). Foco no `h2` do resultado após gerar e de volta ao botão ao fechar modal. `prefers-reduced-motion`: sem animação de "digitando"; resultado aparece de uma vez. Zoom 200% sem rolagem horizontal exceto `table-wrap` com `tabindex=0` e rótulo. Contraste 4.5:1 a verificar no QA (claro e escuro). Timestamps em `<time datetime>`.

**Breakpoints.** 390: uma coluna, pedido em etapas de tela cheia, ações primárias em largura total, resultado empilhado (sugestões, pontos de atenção, evidência em acordeão `details`). 768: duas colunas (pedido | resultado) com resultado rolável. 1440: três áreas, "Pedido e dados usados" (360 px) | "Sugestões" | "Pontos de atenção e evidência" (360 px), cabeçalho fixo com cota.

---

## TRN-40 Painel de sugestões

**Objetivo.** Pedir e revisar sugestões da IA para montar ou ajustar um treino, com pontos de atenção de saúde, evidência citada e a justificativa do que foi usado, sem que a IA grave nada. Arquivo: `screens/ia/painel-sugestoes.html`. Selos I1 (sugestões), I2 (pontos de atenção e evidência), I4 (escolha de dados).

**Fluxo.** Entrada: menu "Prescrição IA"; "Sugerir com IA" em TRN-21 (`?origem=modelo`) e TRN-23 (`?origem=treino&aluno=`); "Abrir sugestões" em TRN-02. Passos: (1) **Contexto**: modo "Para um aluno" (combobox só de alunos do personal, com motivo neutro para os indisponíveis) ou "Sem dados do aluno"; (2) **Pedido**: objetivo, nível, dias por semana, duração por sessão, equipamento, restrições digitadas (texto livre, 300 caracteres, aviso de não colar dado de saúde identificável; desabilitado em "Para um aluno" sem portão), pedido livre opcional (500); (3) **Dados que a IA vai ler** (TRN-42 inline: caixas por categoria, saúde desmarcada); (4) **Resumo** com consequência: "Isto usa 1 sugestão da sua cota (18 de 30 neste mês). A IA lê só os dados marcados. Nada é salvo." + "Gerar sugestões" e "Cancelar" de mesmo peso; (5) **Resultado**; (6) por sugestão: "Aceitar" (modal de confirmação), "Dispensar", "Útil/Não útil" (retorno sem texto livre). Saída: "Aceitar" abre o editor de origem com o conteúdo no rascunho (nada salvo); "Voltar ao editor sem usar"; "Gerar de novo" (consome nova cota, com aviso).

**Conteúdo.**
- h1 "Prescrição com IA"; subtítulo "A IA sugere. Você revisa, escolhe e salva."; selo "Requer API nova"; faixa fixa "A IA só sugere. Você decide e salva. Ela pode errar." e cota "18 de 30 sugestões neste mês" (`progress`, `role=progressbar`, texto "Restam 12").
- **Resultado, bloco Sugestões**: lista de cartões, cada um com: título ("Dividir em 3 dias: A, B e C"), tipo (Estrutura do treino, Exercício, Série e repetições, Progressão, Ordem), o que muda em frase simples, **Por que a IA sugeriu** (2 a 3 linhas: quais dados e quais objetivos pesaram, em categorias; ex. "Considerou: objetivo do treino, 3 dias por semana, equipamento informado."; **não** repete valores de saúde), evidência (0 a 3 fontes), selo "Gerado por IA", ações "Aceitar", "Dispensar", "Útil", "Não útil". Para sugestão de exercício: nome vinculado ao catálogo (TRN-10) ou "Não encontrado no catálogo" (nunca criar exercício sozinho).
- **Resultado, bloco Pontos de atenção** (só com saúde lida): cartões com ícone + texto de severidade "Para observar" ou "Para conversar com o aluno" (sem "grave", sem vermelho de emergência), frase neutra (ex. "O aluno registrou desconforto em [região MOCK]. Considere reduzir o volume do exercício X e perguntar como ele se sentiu."), fonte(s), aviso fixo de não-diagnóstico. Ações: "Entendi" (marca como visto só na tela, sem gravar alerta), "Dispensar". **Ponto de atenção nunca cria alerta (`alerts`), nunca resolve alerta, nunca notifica o aluno.** Sem dados de saúde lidos: bloco substituído por "Pontos de atenção indisponíveis: a IA não leu dados de saúde nesta geração." (com motivo).
- **Justificativa ética (bloco "Como a IA chegou aqui")**, recolhido por padrão (`details`): (a) dados lidos (categorias e período), (b) o que **não** foi lido, (c) limites ("A IA não examina o aluno, não conhece o histórico completo e pode errar."), (d) "Quem decide: você." (e) "O que ficou registrado: data, quem pediu e categorias, sem o conteúdo." (liga a TRN-42), (f) link "Ver dados usados".
- **Aceitar** (modal `AuraUI.confirm`): "Levar esta sugestão ao rascunho?" mostra antes/depois em texto (ex. "Sessão A: acrescenta Remada curvada, 3 séries de 8 a 10"), consequências: "Nada é salvo ainda." "Você poderá editar tudo no editor." "O aluno não é avisado." Botões "Levar ao rascunho" e "Cancelar" de mesmo peso. Sugestão aceita fica marcada "Levada ao rascunho" (texto + ícone) e continua desfazível ("Remover do rascunho" volta ao estado anterior se o editor ainda não foi salvo).
- Aceitar em lote: **ausente** (cada sugestão por vez; evita aplicar sem olhar). Exceção: nenhuma.

**Componentes.** page-header, `stepper`, `combobox`, `checkbox`/`switch` por categoria, `textarea`, `progress`, `card`, `badge` (info/warning/neutral), `chip`, `details`, lista de fontes (`list`), `alert`, `empty-state`, `skeleton`, `modal`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `padrao, sem-dados-do-aluno, para-aluno, pedido-passo-1, pedido-passo-2, dados-passo-3, resumo, gerando, resultado, resultado-sem-pontos-de-atencao, resultado-com-pontos-de-atencao, sugestao-sem-evidencia, sugestao-exercicio-fora-do-catalogo, aceitando, aceita-no-rascunho, dispensada, ia-sem-consentimento, ia-revogado, saude-nao-liberada, saude-revogada, nao-confirmado, vinculo-pausado, vinculo-encerrando, vinculo-encerrado, menor-em-espera, limite-cota, sem-plano-ia, ia-indisponivel, resposta-vazia, resposta-bloqueada, erro-gerar, erro-validacao, conflito, carregando, erro, offline, sem-permissao`).
- **Vazio (primeiro acesso)**: empty-state "Nenhuma sugestão ainda." / "Descreva o treino que você quer montar e a IA sugere um ponto de partida. Você revisa tudo." / ação "Começar" (neutro, sem promessa de resultado).
- **Sem consentimento IA** (`ia-sem-consentimento`): no modo "Para um aluno", cartão: "Este aluno não liberou o uso de IA." / "A IA não lê dados dele. Você pode pedir a liberação ao aluno ou usar a IA sem dados do aluno." Ações: "Pedir liberação" (confirmação, ver TRN-42, selo I5) e "Usar sem dados do aluno" (mesmo peso). Nenhum dado, contagem ou prévia do aluno no cartão.
- **Revogado** (`ia-revogado`): "O aluno revogou o uso de IA." / "A IA não lê mais os dados dele. Sugestões antigas deste aluno ficam ocultas. O que você já salvou no treino não muda." (destino do já gerado: **[LEGAL]** padrão conservador: ocultar). Sem botão de pedir de novo imediato; "Pedir liberação" reaparece como secundário após confirmação ("O aluno já revogou antes. Pedir de novo pode incomodar. Continuar?").
- **Saúde não liberada / revogada / não confirmada** com IA liberada: a IA roda só com categorias não-saúde; bloco de pontos de atenção indisponível com cartão "Oculto por privacidade" e motivo (0.2 do lote E: "Saúde não liberada pelo aluno", "Saúde revogada pelo aluno", "Consentimento não confirmado agora"). Nenhuma menção a conteúdo.
- **Vínculo pausado / encerrando / encerrado / menor em espera**: modo "Para um aluno" desabilitado com o motivo (0.2 do lote E); "Usar sem dados do aluno" continua. Tela aberta com `?aluno=` nesses estados mostra o cartão e não carrega nada do aluno.
- **Limite de cota** (`limite-cota`): ao chegar a 90%, alerta info "Você usou 27 de 30 sugestões neste mês." sem pressão; no limite: "Você chegou ao limite de sugestões do mês." / "Você pode montar treinos normalmente, sem IA. A cota volta em 01/12 [MOCK]." ação "Ver planos" **secundária** (nunca primária, sem contagem regressiva, sem "últimas chances"). "Gerar" desabilitado com motivo. Telas só consomem o número (entitlement).
- **Sem plano de IA** (`sem-plano-ia`): "O seu plano não inclui sugestões com IA." / "O resto do Aura continua igual." ação "Ver planos" secundária.
- **Erro de validação**: "Informe o objetivo.", "Escolha ao menos um dia por semana.", "O pedido passou de 500 caracteres." Foco no primeiro erro (`AuraUI.setError`).
- **Erro ao gerar** (`erro-gerar`): "Não foi possível gerar sugestões agora. Nada foi alterado e sua cota não foi usada." (se a cota foi debitada pelo backend: texto ajustado "[MOCK] a cota é devolvida"; decisão de produto, pressuposto 6). **Resposta vazia**: ver comuns. **Bloqueada** (filtro de segurança do serviço): "A IA não pôde responder a este pedido. Reescreva de outra forma." sem expor o motivo técnico.
- **Conflito**: "Este treino mudou desde que você pediu. Recarregue antes de aceitar." (aceitar desabilitado até recarregar).
- **Offline**: gerar, aceitar e pedir liberação desabilitados com motivo; resultado já na tela continua legível, com aviso. Sem rascunho persistido.
- **Sem permissão**: não responsável: acesso negado sem confirmar existência. Gestor sem ser responsável: sem modo "Para um aluno" daquele aluno; vê o painel só no modo sem dados. Sem papel de personal/gestor: acesso negado.

**Textos-chave.** "Prescrição com IA", "Gerar sugestões", "Aceitar", "Dispensar", "Levar ao rascunho", "Por que a IA sugeriu", "Pontos de atenção", "Abrir fonte", "A IA só sugere. Você decide e salva.", "Isto não é diagnóstico nem orientação de saúde." Toast: "Sugestão levada ao rascunho." Nenhuma notificação de IA ao aluno.

**Acessibilidade específica.** Stepper com `aria-current=step`; cota com `role=progressbar` e texto; cartões de sugestão como `article`/`h3`; "Útil/Não útil" como `aria-pressed` com texto; modal de aceitar com foco no título, Esc fecha, foco volta ao botão; fontes com `rel=noopener` e aviso de nova aba em texto; pontos de atenção com ícone e rótulo de severidade; resultado anunciado sem conteúdo; evidência em `details` com resumo legível ("Evidência (2 fontes)").

**Layout.** 390: etapas em tela cheia, resultado em abas "Sugestões | Atenção | Como chegou aqui" (`tabs`); 768: pedido em coluna estreita | resultado; 1440: três áreas com cota no cabeçalho.

**Dados mock.** `request`: id, mode (STUDENT|NONE), studentName|null, gate {iaState, healthEligible, reasonCode}, inputs {goal, level, daysPerWeek, durationMin, equipment, restrictionsText}, categoriesChosen[] (GOAL, CURRENT_PLAN, EXECUTIONS, PAIN, MEASURES, QUESTIONNAIRES). `suggestion`: id, kind, title, summary, why (categorias usadas), evidence[{org, year, type, title, url, summaryByAI}], catalogExerciseId|null, status (NEW|IN_DRAFT|DISMISSED), feedback (USEFUL|NOT_USEFUL|null). `attention`: id, severityLabel, text, evidence[], dismissed. `quota`: used 18, limit 30, resetsAt. Mínimo: 3 alunos (1 com IA e saúde liberadas, 1 com IA revogada, 1 com IA liberada e saúde revogada), 6 sugestões (1 sem evidência, 1 fora do catálogo), 3 pontos de atenção, 6 fontes `[MOCK]` com títulos genéricos (sem autor real, sem DOI real, links `#`). Nenhum dado real.

---

## TRN-41 Importar planilha ou texto

**Objetivo.** Transformar uma planilha ou texto do personal em itens de treino com revisão linha a linha; nada entra no sistema sem decisão humana. Arquivo: `screens/ia/importar.html`. Selo I3.

**Fluxo.** Entrada: "Importar planilha ou texto" em TRN-20; "Importar" em TRN-21 (modelo novo ou existente); menu "Prescrição IA". Passos: (1) **Origem**: "Enviar arquivo" (`.csv`, `.xlsx`, `.txt`; até 2 MB e 200 linhas [MOCK]) ou "Colar texto" (até 10 000 caracteres); (2) **Leitura** (processando, cancelável); (3) **Revisão linha a linha**; (4) **Resumo e destino**: "Levar ao editor" (cria rascunho de modelo no TRN-21, nada salvo) ou "Cancelar". Saída: editor de modelo com o rascunho; ou volta à origem sem efeito.

**Conteúdo.**
- h1 "Importar planilha ou texto"; subtítulo "A IA lê o seu arquivo e propõe os itens. Você revisa cada linha."; selo "Requer API nova"; faixa "A IA só sugere. Nada é salvo até você levar ao editor e salvar."
- Aviso antes do envio (obrigatório, sem pré-marcar): caixa "Confirmo que este arquivo não contém dados de saúde de pessoas identificáveis." (desmarcada; "Ler arquivo" desabilitado até marcar, com motivo). Texto de apoio: "Use só para a estrutura do treino: exercícios, séries, repetições, cargas e observações." ([LEGAL] [MOCK] texto provisório). Arquivo **não** é guardado após a leitura nesta versão (nota; retenção real **[LEGAL]**, pressuposto 3).
- **Revisão**: tabela (390: cartões) com colunas: Linha original (texto como veio, escapado), Sessão/dia, Exercício reconhecido (combobox do catálogo TRN-10, "Não reconhecido" quando vazio), Séries, Repetições, Carga, Observação, Situação (badge com ícone e texto: "Reconhecido", "Confirmar" para ambíguo, "Não reconhecido", "Ignorada"). Ações por linha: "Aceitar", "Editar", "Ignorar" (mesmo peso). **Ambíguas e não reconhecidas exigem decisão por linha** (não entram por padrão); "Aceitar reconhecidas (n)" existe só para linhas "Reconhecido", com confirmação que diz a contagem e "Você ainda revisa tudo no editor". Painel lateral/resumo: "12 linhas: 8 reconhecidas, 3 para confirmar, 1 não reconhecida". Cargas sem unidade: "Informe a unidade (kg)" (nunca assume). Valores fora de faixa plausível [MOCK] (ex. 50 séries): linha "Confirmar" com texto "Valor incomum. Confira."
- **Conteúdo do arquivo é dado, nunca instrução**: texto do arquivo que se pareça com comando ("ignore as regras", "apague") aparece como texto na linha, marcado "Texto do arquivo, sem efeito" e **não altera** o comportamento nem executa ação; a IA nunca cria exercício sozinha nem altera o catálogo (linha não reconhecida pode virar "Criar exercício" só pelo fluxo humano de TRN-12, em outra tela, sem selo da IA).
- **Segurança do arquivo (UX)**: rejeita planilha com macros ou fórmulas externas com mensagem "Este arquivo tem macros ou links externos. Salve uma cópia sem eles e tente de novo." Fórmulas exibidas como texto. Nomes de arquivo escapados.
- **Levar ao editor** (confirmação): "Levar 9 itens ao editor de modelo?" "Nada é salvo ainda." "Itens ignorados ou não decididos ficam de fora." "Você poderá editar tudo." Botões "Levar ao editor" e "Cancelar" de mesmo peso. Sem atribuição a aluno neste fluxo.

**Componentes.** page-header, `stepper`, `file-input`/dropzone com alternativa de botão, `textarea`, `checkbox`, `table`/`table-wrap`, `combobox`, `badge`, `progress`, `alert`, `empty-state`, `modal`, `skeleton`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `padrao, origem-arquivo, origem-texto, aviso-nao-marcado, lendo, revisao, revisao-ambigua, revisao-nao-reconhecida, revisao-tudo-decidido, aceitar-reconhecidas, resumo, levando-ao-editor, arquivo-grande, arquivo-formato-invalido, arquivo-com-macros, arquivo-vazio, texto-com-instrucao, limite-linhas, limite-cota, sem-plano-ia, ia-indisponivel, erro-ler, erro-validacao, conflito, carregando, erro, offline, sem-permissao`).
- Vazio: empty-state "Nenhum arquivo ou texto ainda." / "Envie um arquivo ou cole o texto do treino para começar." Sem tom promocional.
- **Sem consentimento IA / revogado / vínculo pausado ou encerrado / menor em espera**: **não se aplicam** a esta tela (não lê dado de aluno nem escolhe aluno). Se aberta com `?aluno=` (inválido), a tela ignora o parâmetro e mostra nota "Importar não usa dados de alunos." Registrado para evitar vazamento por URL.
- Carregando (`lendo`): "Lendo o arquivo. Pode levar até 30 segundos." com "Cancelar"; `aria-busy`. Erro ao ler: "Não foi possível ler o arquivo. Nada foi importado." + "Tentar de novo" e "Escolher outro arquivo".
- Arquivo grande/formato: "O arquivo passa de 2 MB.", "Use .csv, .xlsx ou .txt." Limite de linhas: "Este arquivo tem mais de 200 linhas. Divida em partes." Arquivo vazio: "Não encontramos linhas de treino neste arquivo." Foco no primeiro erro.
- **Limite de cota** e **sem plano de IA**: iguais a TRN-40 (importação consome 1 sugestão [MOCK]); sem pressão.
- Conflito: "O modelo mudou desde que você abriu o editor. Recarregue antes de levar os itens." Offline: ler e levar desabilitados com motivo.
- Sem permissão: sem papel de personal/gestor: acesso negado. Gestor pode importar para modelo do tenant (sem aluno).

**Textos-chave.** "Importar planilha ou texto", "Ler arquivo", "Aceitar", "Editar", "Ignorar", "Aceitar reconhecidas (8)", "Levar ao editor", "Texto do arquivo, sem efeito". Toast: "Itens levados ao editor." (sem trecho).

**Acessibilidade específica.** Dropzone sempre com botão equivalente e foco visível; tabela de revisão com `caption`, `scope` e situação em texto; combobox com busca e anúncio de opções; contagem do resumo em `aria-live=polite`; erro de arquivo com `role=alert` e foco; ações por linha com nome ("Aceitar linha 4"); sem arrastar como única forma.

**Layout.** 390: origem em tela cheia, revisão em cartões por linha com ações em largura total, resumo fixo no rodapé; 768: tabela compacta (esconde Observação), resumo acima; 1440: tabela completa e resumo fixo à direita (320 px).

**Dados mock.** `import`: id, source (FILE|TEXT), fileName (genérico), rows[{n, originalText, day, exerciseGuess, catalogExerciseId|null, sets, reps, load, unit, note, status (RECOGNIZED|AMBIGUOUS|UNRECOGNIZED|IGNORED), warning}]. 12 linhas (8 reconhecidas, 3 ambíguas, 1 não reconhecida), 1 linha com texto de "instrução" inofensivo para a variante `texto-com-instrucao`. Dados genéricos `[MOCK]`, nenhum dado de pessoa.

---

## TRN-42 Dados do aluno usados pela IA e consentimento IA

**Objetivo.** Mostrar ao personal, de forma transparente, o que a IA pode ler de cada aluno, quais categorias estão liberadas ou bloqueadas e por quê, o registro de uso (quem, quando, quais categorias) e permitir pedir ao aluno a liberação. O personal **nunca** concede nem altera o consentimento do aluno. Arquivo: `screens/ia/dados-ia.html` (`?aluno=`). Selos I4 (escolha de categorias e registro de uso) e I5 (pedido de liberação).

**Fluxo.** Entrada: menu "Prescrição IA" > "Dados usados pela IA"; link em TRN-40 (passo 3) e TRN-02. Saída: "Pedir liberação" (modal), "Abrir aluno" (TRN-02), "Voltar às sugestões" (TRN-40). Sem tela de edição de consentimento: o aluno decide em ALU-06.

**Conteúdo.**
- h1 "Dados usados pela IA"; subtítulo "O que a IA pode ler de cada aluno e o que ela já leu."; selo "Requer API nova"; faixa fixa (lote A, regra 3, variante): "Este aluno sabe que você, os outros responsáveis e o gestor da conta veem os dados que ele liberou. A IA só lê o que ele liberou para IA." ([LEGAL] [MOCK] texto provisório).
- **Seletor de aluno** (combobox; só alunos do personal; o gestor vê todos do tenant em leitura). Cartão **Consentimento de Uso de IA**: estado (Liberado, Não liberado, Revogado, Não confirmado agora) com ícone, data da última mudança (`time`), "Quem decide: o aluno" e texto explicativo por estado. Projeção vencida: "Não confirmado agora" (tratado como não liberado, 10.1).
- **Tabela "Categorias" (matriz)**: Categoria | Situação | Motivo | "Usar nesta sugestão" (switch). Categorias: Objetivo do treino (não é saúde, spec; sempre disponível com IA liberada), Treinos atribuídos (portão), Histórico de execuções (portão), Dor e retorno (portão), Medidas e respostas de questionário (portão), Objetivos informados pelo aluno (portão, selo N2), Nutrição (portão, selo N1), **Fotos e vídeos: "Nunca usados pela IA nesta versão"** (sem switch, sem exceção, [LEGAL]). Situações: "Disponível", "Bloqueado: uso de IA não liberado", "Bloqueado: saúde não liberada", "Bloqueado: saúde revogada", "Bloqueado: consentimento não confirmado agora", "Bloqueado: vínculo pausado/encerrando/encerrado", "Bloqueado: aguardando idade ou responsável legal". Bloqueado = switch ausente (não só desabilitado) e **sem contagem nem prévia do dado**. Switches de saúde começam **desligados** e o desligar é o padrão a cada geração (nada de lembrar "ligado" entre sessões: o padrão conservador exige escolha a cada vez).
- **Pedir liberação** (selo I5), só quando IA NEVER_GIVEN ou REVOKED e vínculo ACTIVE sem bloqueio de idade: modal "Pedir ao aluno que libere o uso de IA?" com consequências: "O aluno recebe um aviso genérico no app: 'Seu personal pediu para usar IA no seu treino'." "Ele decide e pode recusar sem consequência para o treino." "Você não vê dados até ele liberar." "Você pode pedir uma vez por mês [MOCK]." Botões "Enviar pedido" e "Cancelar" de mesmo peso. Sem texto livre no pedido (evita pressão e saúde). Texto sem culpa e sem urgência. Notificação ao aluno genérica (T-51); sem insistência automática.
- **Registro de uso** (selo I4): tabela do aluno (e para o gestor, do tenant): data/hora (`time`), quem pediu (nome do personal), tipo (Sugestões, Importação sem aluno não aparece aqui), categorias lidas (lista de nomes), resultado (Gerado, Cancelado, Erro). **Sem conteúdo** de pedido, resposta ou dado. Retenção do registro: **[LEGAL]** (pressuposto 4). Vínculo ENDED: registro oculto; metadado mínimo conforme 0.3 do lote E.
- Nota "Consentimento e direitos do aluno": "O aluno pode revogar a qualquer momento em ALU-06. A IA para de ler na hora." sem prometer apagar o que já foi gerado ([LEGAL]).
- **Modo sem aluno**: bloco "Usar IA sem dados de aluno" explicando que isso não lê nada de ninguém; link "Abrir painel sem dados do aluno".

**Componentes.** page-header, `combobox`, `card`, `table`/`table-wrap`, `badge`, `switch`, `alert`, `modal`, `empty-state`, `skeleton`, `AuraUI.confirm/toast`, `AuraState`.

**Estados e variantes** (`aura-variants`: `padrao, ia-liberada-saude-liberada, ia-liberada-sem-saude, ia-nao-liberada, ia-revogada, nao-confirmado, vinculo-pausado, vinculo-encerrando, vinculo-encerrado, menor-em-espera, pedido-modal, pedido-enviado, pedido-ja-enviado, pedido-limite, enviando-pedido, erro-pedido, registro-vazio, registro-com-itens, gestor-leitura, sem-alunos, carregando, erro, offline, conflito, sem-permissao, limite-cota, sem-plano-ia`).
- **Vazio**: sem alunos: "Você ainda não tem alunos." / "Convide um aluno para ver aqui o que a IA pode ler." Registro vazio: "A IA ainda não leu dados deste aluno."
- **Sem consentimento IA** (`ia-nao-liberada`): cartão "Este aluno não liberou o uso de IA." tabela com todas as categorias de dado do aluno "Bloqueado: uso de IA não liberado", exceto "Objetivo do treino" também bloqueado (a IA não lê nada do aluno), registro oculto, ação "Pedir liberação" (primária) e "Usar IA sem dados do aluno" (secundária, mesmo peso visual).
- **Revogado**: "O aluno revogou o uso de IA." Registro e sugestões anteriores deste aluno ocultos (conservador, [LEGAL]); "Pedir liberação" exige confirmação extra (ver TRN-40). Banner "A IA parou de ler os dados deste aluno."
- **Pausado/encerrando/encerrado/menor em espera**: cartão com motivo (0.2 do lote E), matriz toda "Bloqueado", ação "Pedir liberação" ausente (sem sentido sem vínculo ativo). Encerrado: só nome e período do vínculo.
- **Limite**: pedido de liberação limitado a 1 por mês por aluno [MOCK] (`pedido-limite`): "Você já pediu este mês. Você poderá pedir de novo em dd/mm." Limite de cota de IA e plano sem IA: como TRN-40, aqui como info (a tela informativa continua acessível; só "Gerar" some).
- Erro do pedido: "Não foi possível enviar o pedido. O aluno não foi avisado." + "Tentar de novo". Conflito: "O estado do consentimento mudou. Recarregar." (o pedido não é enviado). Offline: pedido desabilitado com motivo.
- Sem permissão: não responsável: acesso negado sem confirmar existência. Gestor sem ser responsável: leitura da matriz e do registro (sem conteúdo), sem pedir liberação nem gerar (nota "Só o responsável pede liberação ao aluno."). Sem papel: acesso negado.

**Textos-chave.** "Dados usados pela IA", "Uso de IA", "Liberado", "Não liberado", "Revogado", "Não confirmado agora", "Bloqueado: [motivo]", "Pedir liberação", "Enviar pedido", "Nunca usados pela IA nesta versão". Toast: "Pedido enviado." (sem nome de dado).

**Acessibilidade específica.** Matriz como tabela com `caption` e `scope`, situação em texto e ícone, switch com rótulo "Usar [categoria] nesta sugestão" e estado em texto ("Ligado/Desligado"); categorias bloqueadas anunciam o motivo em `aria-describedby`; modal de pedido com foco no título e retorno ao botão; registro com `time`; seletor de aluno com resultados anunciados.

**Layout.** 390: seletor e cartão de consentimento, matriz em cartões por categoria, registro em lista; 768: matriz em tabela compacta, registro abaixo; 1440: cartão de consentimento e matriz à esquerda, registro à direita (420 px).

**Dados mock.** `consent`: studentName, scope IA, state (GRANTED|NEVER_GIVEN|REVOKED|STALE), changedAt, link {status}, gate {eligible, reasonCode}. `category`: key, label, isHealth, situation, reason, canUse. `usage`: id, at, byName, kind (SUGGESTIONS), categories[], result. 4 alunos: 1 IA+saúde liberadas, 1 IA liberada sem saúde, 1 nunca liberou, 1 revogou; 1 pausado; 6 registros `[MOCK]`; 1 pedido já enviado.

---

## 8. Itens com selo "Requer API nova" (acrescentados em `_pendencias-api-training.md`)

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| I1 | Sugestões da IA para montar e ajustar treino (painel, aceitar para rascunho; IA só sugere) | TRN-40, entradas em TRN-21/TRN-23 | IA fora da v1 (T-38); só o encaixe do consentimento IA existe |
| I2 | Pontos de atenção de saúde e evidência científica citada | TRN-40 | Idem; sem contrato de evidência nem de conteúdo de saúde gerado |
| I3 | Importação de planilha/arquivo de texto com revisão linha a linha | TRN-41 | Idem; sem endpoint de leitura e interpretação |
| I4 | Escolha das categorias lidas pela IA e registro de uso (quem, quando, categorias) | TRN-40 passo 3, TRN-42 | Sem tabela de registro de uso de IA nem leitura por categoria |
| I5 | Pedido de liberação de uso de IA do personal ao aluno | TRN-42, TRN-40 | Consentimento é do aluno (identity/privacidade); fluxo de pedido não existe |

Sem selo: estados do consentimento IA e portão de saúde (10.1, T-55), cota/limite de IA (entitlement, T-40; só consumo do número), vínculo (T-50).

## 9. Pendências Low a absorver (lista de referência, sem decidir)

Fonte: `docs/operations/estado-vivo-proto-training.md` (Low abertos do lote E, não bloqueiam). O frontend-senior do lote D decide se absorve ou devolve ao principal; nada foi decidido aqui.

| ID | Descrição (resumo) | Relação com o lote D |
|----|--------------------|----------------------|
| REV-E3-01 / PRV-E3-01 / QA-E3-01 | Heurística de saúde (lista de palavras) contornável; marcada [LEGAL-REVIEW] | Se D reutilizar verificação de texto (pedido livre, restrições), é só heurística de protótipo, não proteção |
| REV-E3-02 | Texto `sr-only` redundante | Evitar duplicar rótulo e texto oculto em selos e switches |
| PRV-E3-02 | Nome e hora no alerta neutro | Registro de uso de IA mostra nome do personal e hora; decidir o nível de detalhe |
| QA-E3-02 | Sino do shell mostra "1 não lidas" enquanto há 3 | Pedido de liberação gera notificação ao aluno, não ao personal; não afeta o sino, mas manter contador coerente |
| QA-E3-03 | Carimbo duplicado nas bolhas | Evitar carimbo de hora repetido em cartões de sugestão e registro |
| (sem ID) | Espaço de 0 a 4 px entre abas e "Enviar questionário" | Conferir espaçamento entre abas e ações primárias nas telas novas |
| QA-BC-04, QA-BC-05 (lote B+C, abertos) | Alvos < 44 px no 390; ">" órfão no breadcrumb | Já tratados como requisito em "Acessibilidade comum a D" |

## 10. Pressupostos e lacunas (para decisão do principal ou do humano)

1. Gestor que não é responsável lê TRN-42 e não gera nem pede liberação (coerente com A, BC e E).
2. "Aceitar" leva ao rascunho do editor e o "Salvar" do editor é o gravar; o painel nunca grava. Se o editor ainda não aceitar rascunho externo (TRN-21/TRN-23), frontend-senior define o mecanismo em memória, sem persistir no navegador.
3. Retenção do arquivo importado, do pedido e da resposta da IA no serviço: **[LEGAL]**; o protótipo diz "não é guardado" só como padrão conservador a confirmar.
4. Registro de uso: guarda categorias e hora, não conteúdo; prazo e acesso do gestor são **[LEGAL]**/produto.
5. Destino de sugestões e registro após revogação de IA (ocultar vs. apagar): padrão conservador ocultar; **[LEGAL]**.
6. Cota consumida em erro de geração: decisão de produto/billing (devolver ou não); tela texto ajustável.
7. "Pedir liberação" no máximo 1 por mês por aluno é palpite do autor; risco de pressão sobre o aluno a avaliar com privacy-compliance.
8. Fotos e vídeos nunca vão à IA nesta versão (conservador). Nutrição e objetivos do aluno só existirão com N1/N2.
9. Ordem "Pontos de atenção" depois de "Sugestões" e o rótulo "Para observar/Para conversar com o aluno" a testar: risco de parecer triagem clínica.
10. Evidência de usabilidade ausente: nenhuma sessão com personais. Recomenda-se teste rápido (5 personais) em: entender "A IA só sugere", aceitar ao rascunho e revisão de importação. Privacy-compliance deve revisar TRN-40 (pontos de atenção, dados lidos), TRN-41 (aviso de arquivo, injeção por conteúdo) e TRN-42 (pedido de liberação, registro) antes de congelar. Reviewer técnico: coerência com lotes A, B+C e E.
11. Contraste e alvos de toque não verificados aqui (dependem dos tokens); QA do lote confirma 4.5:1 em claro e escuro e 44 px no 390.
12. Numeração TRN-40 a TRN-42 mantida; sem alterações. Sugestão de reuso: `g8-*` para cartão de sugestão, lista de fontes, matriz de categorias e modal "Levar ao rascunho".
