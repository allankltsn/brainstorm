# Lotes B e C, Exercícios e Treinos: especificação de UX (TRN-10 a TRN-14 e TRN-20 a TRN-24)

Data: 2026-11-10. Autor: ux-designer. Base: spec de telas (`../docs/superpowers/specs/2026-11-10-training-prototype-telas-design.md`, seções 3 a 7), spec do training (T-04 a T-15, T-30, T-55), `internal/aura-training/prisma/schema.prisma` (Exercise, Program, ProgramSession, ProgramGroup, ProgramItem, ProgramItemSet, Assignment*), `lote-a-meus-alunos.md` (seção 0 vale aqui por referência: termos, selo, estados comuns, acessibilidade comum, breakpoints, regra 8 do portão único de saúde).
Convenções: protótipo estático, dados sempre mock `[MOCK]`, pt-BR com acentos, claro e escuro, sem HTML/CSS/JS aqui. Estados via `AuraState`, variantes via `aura-variants`.

## 0. Decisões transversais

**Menu.** "Treinos" sai de "Em breve" e abre TRN-20; "Exercícios" entra como item irmão (TRN-10). "Prescrição IA" continua "Em breve". Breadcrumb: Início > Exercícios > [Nome]; Início > Treinos > [Modelo].

**Termos (uma palavra por conceito).** "Exercício" (item do catálogo); "Modelo de treino" = Programa do schema; "Sessão" (A, B, C) dentro do modelo; "Item" = exercício na sessão; "Série". "Atribuição" = cópia do modelo dada a um aluno, chamada na tela de "Treino do aluno". "Versão" = número do modelo. Visibilidade: "Privado", "Compartilhado", "Público". Origem: "Do sistema" (GLOBAL), "Seu", "De [personal]". Agrupamentos: "Bi-set", "Super-set", "Circuito".

**Selo "Requer API nova"** como no lote A (seção 0). IDs novos, registrados em `_pendencias-api-training.md`: X1 a X4 (exercícios), M1 a M4 (modelos), I1 (IA, só encaixe). Seção 8.

**Regras de produto (spec de telas, seção 3).**
1. IA só sugere, nunca grava. Nos lotes B e C a IA aparece apenas como espaço "Sugestões da IA (Em breve, lote D)" com selo I1, sem botão que altere dado. Nenhum texto "aplicar automaticamente". Toda criação, edição, exclusão, atribuição e mudança de visibilidade é clique humano com confirmação que declara a consequência.
2. Mídia de exercício não contém dado pessoal. Todo upload (TRN-12) tem a caixa NÃO pré-marcada "Confirmo que o arquivo não mostra rosto ou pessoa identificável, nome, documento, local reconhecível nem dado de saúde de alguém." Sem marcar, "Salvar mídia" fica desabilitado, com o motivo visível. O nome do arquivo original não é exibido nem gravado como título (campo "Título da mídia" separado). Metadados do arquivo (EXIF) removidos: aviso "Removemos dados de localização e câmera do arquivo." [MOCK] a confirmar com o aura-media. Mídia de aluno nunca entra no catálogo (os dois são fluxos distintos).
3. Catálogo e modelos NÃO são dado de saúde (não há aluno neles). Já a atribuição a aluno e o treino do aluno SÃO conteúdo classificado como saúde (lote A, regra 8: treinos atribuídos, notas `assignment_*`). Portão único em TRN-22 e TRN-23: exige SAUDE_GERAL GRANTED, projeção vigente, vínculo ACTIVE, sem bloqueio de idade. Fora dele, o aluno aparece só pelo nome, desabilitado, com motivo textual neutro (seção TRN-22), sem contagem, sem treino anterior, sem prévia. **[LEGAL] pendente** (mesmo ponto de PRV-A-04): se atribuir treino sem consentimento é permitido; padrão conservador adotado.
4. Nenhuma tela de B e C exibe dado de aluno, exceto TRN-22, TRN-23 e a aba "Alunos que usam" de TRN-24 (dentro do portão).
5. Padrão conservador: ação irreversível (arquivar, retirar visibilidade, excluir) pede confirmação com consequência; Cancelar tem o mesmo peso do confirmar.

**Visibilidade e origem (mapa único, usado em B e C).**

| Rótulo na tela | Schema | Selo |
|----------------|--------|------|
| Do sistema (público) | `scope=GLOBAL`, escrita só do admin (T-04) | não, spec cobre leitura |
| Privado | `scope=TENANT`, criado pelo personal (T-04) | X3 (restrição ao criador dentro do tenant; hoje a spec isola por tenant, não por personal) |
| Compartilhado com outros personais | não existe | X2 |
| Público criado por personal | não existe (T-04: só admin escreve GLOBAL) | X1 |
| Cópia de global ("Personalizado") | `scope=TENANT`, `origin_exercise_id` (T-05) | não |

Em tenant de personal solo, "Privado" equivale ao que a spec entrega; o selo X3 aparece só no seletor de visibilidade, não na lista.

**Acessibilidade comum a B e C (além da seção 0 do lote A).** Um `h1` por tela. Selo, visibilidade e origem sempre com texto e ícone, nunca só cor. Reordenar (itens, sessões, séries) tem alternativa por teclado: botões "Subir" e "Descer" por linha, com anúncio em `aria-live` ("Supino reto movido para a posição 2 de 5"); arrastar é extra, nunca o único meio. Alvos mínimos 44 px no 390. Vídeo: legenda/descrição textual obrigatória no campo "Descrição da mídia" (alt), sem autoplay, `prefers-reduced-motion` respeitado, controles nativos, poster visível. Formulários: rótulo visível, `AuraUI.setError`, foco no primeiro erro, resumo de erros no topo. Alterações não salvas: aviso ao sair ("Você tem mudanças não salvas") com opções "Continuar editando" e "Descartar mudanças" de mesmo peso. Rascunho mantido localmente no navegador (nunca campos de saúde: nesses lotes só em TRN-23 as notas do aluno ficam fora do rascunho local, pois podem conter saúde).

**Estados comuns a B e C** (além dos do lote A): carregando (skeleton do formato), vazio, erro (alerta danger + "Tentar de novo"), sem permissão (`acesso-negado.html`; ação ausente ou desabilitada com motivo visível), offline/lento (info "Sem conexão. Mostrando a última carga de hh:mm"; escrita desabilitada com motivo, não enfileira), conflito de edição ("Este item mudou desde que você abriu. Recarregar" com `If-Match`; nada é sobrescrito sem escolha), salvando (botão com `aria-busy`, texto "Salvando…"), sucesso (toast `role=status`).

---

# Lote B, Exercícios

## TRN-10 Catálogo de exercícios

**Objetivo.** Achar e escolher exercícios (do sistema, seus e de colegas). Arquivo: `screens/exercicios/catalogo.html`.

**Fluxo.** Entrada: menu "Exercícios"; seletor de exercício em TRN-21 (mesmo componente em modal, modo "escolher"). Saída: cartão abre TRN-11; "Novo exercício" abre TRN-12; "Personalizar" abre TRN-13.

**Conteúdo.**
- h1 "Exercícios"; subtítulo "Use os exercícios do sistema, crie os seus ou veja os que colegas compartilharam."; ação primária "Novo exercício".
- Abas (`tabs`, contador no rótulo): **Públicos (n)** (Do sistema; mais, com selo X1, os criados por personais), **Meus (n)** (criados por você: privados, compartilhados, públicos, cópias), **Compartilhados comigo (n)** (aba inteira com selo X2).
- Busca "Buscar exercício" (nome, sem acento; T-07) e filtros: Músculo, Equipamento, Padrão de movimento, Nível (BEGINNER, INTERMEDIATE, ADVANCED = "Iniciante", "Intermediário", "Avançado"), Tag. Em Meus: filtro "Visibilidade" (Todos, Privado, Compartilhado, Público) e "Mostrar arquivados" (desmarcado). Chips de filtros ativos com "Limpar filtros".
- Resultado: grade de cartões (miniatura/poster, nome, músculo primário, equipamento, nível, selos de origem e visibilidade). Miniatura só quando `ref_state = READY`; senão ícone neutro com texto "Sem imagem".
- Ordenação: Nome, Mais recentes. Paginação "Carregar mais", 24 por página.
- Badges de origem/visibilidade: "Do sistema" (ícone globo), "Privado" (cadeado), "Compartilhado" (usuários), "Público" (globo), "Personalizado" (cópia; ícone copiar), "De [nome]" nos compartilhados comigo. Arquivado: badge "Arquivado".
- Modo "escolher" (modal vindo de TRN-21): cartão tem botão "Adicionar" (e "Adicionado ✓" desabilitado) e a seleção múltipla com contador "3 selecionados" e "Adicionar 3".

**Componentes.** page-header, `tabs`/`chip-tabs`, `input`, `select`, `chip`, `card` de exercício, `badge`, `empty-state`, `skeleton`, `alert`, modal `modal-lg` (modo escolher), `AuraState`.

**Estados e variantes** (`aura-variants`: `padrao, so-do-sistema, meus-vazio, compartilhados-vazio, filtro-sem-resultado, carregando, erro, offline, sem-permissao, modo-escolher`).
- Carregando: 12 skeletons de cartão. Erro: "Não foi possível carregar os exercícios." + "Tentar de novo"; cache visível com aviso.
- Vazio Meus: "Você ainda não criou exercícios." / "Crie o seu, ou personalize um exercício do sistema." / ações "Novo exercício" e "Ver exercícios do sistema". Vazio Compartilhados: "Nenhum colega compartilhou exercícios com você." (selo X2 visível).
- Sem resultado: "Nenhum exercício encontrado para 'xxx'. Limpar busca e filtros." (`role=status`).
- Sem permissão: perfil sem papel de personal: acesso negado. Perfil só leitura: "Novo exercício" ausente com nota "Seu perfil só consulta exercícios."
- Sem dado de aluno em nenhuma variante.

**Textos-chave.** "Novo exercício"; "Personalizar uma cópia"; "Do sistema"; contador anunciado em `aria-live` ("18 exercícios encontrados").

**Acessibilidade específica.** Cada cartão é `article` com título `h2` link; ações do cartão em menu "Mais" (botão 44 px, `aria-haspopup`); imagens com `alt` = descrição da mídia ou nome; vídeo nunca toca na grade.

**Layout.** 390: uma coluna de cartões, filtros em modal "Filtros" (botão com contador); 768: 2 colunas, filtros em linha recolhível; 1440: 4 colunas, filtros em barra lateral esquerda (largura 280).

**Dados mock (campos).** `exercise`: id, scope (GLOBAL|TENANT), name, level, movementPattern, primaryMuscles[], secondaryMuscles[], equipments[], tags[], visibility (PRIVATE|SHARED|PUBLIC; selo), originExerciseId|null, originName|null, ownerName, archivedAt|null, posterRefState, mediaCount. Mínimo 28 exercícios: 16 Do sistema ([MOCK] nomes genéricos), 6 Meus (2 privados, 1 compartilhado, 1 público, 1 cópia de global, 1 arquivado), 4 Compartilhados comigo, 2 públicos de outro personal.

## TRN-11 Detalhe do exercício

**Objetivo.** Ver instruções, mídia, variações e onde é usado. Arquivo: `screens/exercicios/exercicio-detalhe.html?id=`.

**Fluxo.** Entrada: TRN-10, TRN-21. Saída: "Editar" (TRN-12, só Seus), "Personalizar" (TRN-13, Do sistema/públicos/compartilhados), "Visibilidade" (TRN-14, só Seus), "Adicionar a um modelo" (abre TRN-20 em modo escolha; "Em breve" se TRN-21 ainda sem rota), "Arquivar".

**Conteúdo.**
- Cabeçalho: nome, badges de origem e visibilidade, nível, ações conforme dono.
- Mídia: vídeo de demonstração (DEMO_VIDEO), imagens (IMAGE), poster. Estados por mídia (`ref_state`): PENDING "Processando o arquivo…", READY (reproduz), FAILED "Não foi possível processar. Envie outro arquivo." (ação só para dono), PURGED "Mídia removida".
- Blocos: Músculos (primário/secundário), Equipamentos, Padrão de movimento, Instruções, Erros comuns, Variações e substituições (`ExerciseRelation` VARIATION e SUBSTITUTE, links), Tags.
- Origem: "Cópia de [Exercício X] (do sistema)" com link, quando `origin_exercise_id`; se a origem foi arquivada/removida: "Original indisponível" (SET NULL, spec).
- "Onde é usado": "Usado em n dos seus modelos" (lista de modelos, só seus). Não mostra alunos nem sessões. A contagem de uso por outros personais não é exibida (privacidade entre profissionais).
- Atribuição de visibilidade e de autoria: "Criado por [nome] em dd/mm/aaaa".

**Estados e variantes** (`aura-variants`: `do-sistema, meu-privado, meu-compartilhado, meu-publico, copia-de-global, de-colega, arquivado, midia-processando, midia-falhou, sem-midia, carregando, erro, nao-encontrado, sem-permissao`).
- Do sistema: sem Editar/Visibilidade; botão primário "Personalizar uma cópia"; nota "Este exercício é mantido pelo aura e não pode ser alterado por você."
- De colega (selo X2): só leitura; "Personalizar uma cópia" cria cópia sua; nota "Compartilhado por [nome]. Pode deixar de estar disponível se ele retirar o compartilhamento."
- Arquivado: alerta info "Arquivado em dd/mm. Continua nos modelos e no histórico dos alunos, mas não aparece para novas escolhas." Ação "Restaurar" (confirmação leve).
- Sem mídia: "Este exercício ainda não tem vídeo ou imagem." (dono: "Adicionar mídia").
- Não encontrado/sem acesso: "Exercício não encontrado ou sem acesso." sem revelar se existe (padrão lote A).
- Arquivar: `AuraUI.confirm` "Arquivar [Nome]?" consequências: "Ele deixa de aparecer nas buscas." "Modelos e treinos que já o usam continuam funcionando." "Você pode restaurar depois." (T-04/schema: exercício só arquiva).

**Acessibilidade específica.** Vídeo com controles, legenda quando houver, transcrição/descrição em texto abaixo; título `h1`, blocos `h2`; links de variação com nome completo; estado de mídia por texto e ícone.

**Layout.** 390: mídia no topo, blocos empilhados, ações em menu "Ações"; 768: mídia e dados em duas colunas; 1440: mídia à esquerda (60%), ficha à direita, "Variações" em largura total.

**Dados mock.** `exercise` de TRN-10 mais: instructions, commonMistakes, media[] (id, role, refState, durationSec, alt, title), relations[] (kind, relatedId, relatedName), usedInModels[] (id, name), createdByName, createdAt, updatedAt. Textos de instrução são [MOCK] genéricos (sem recomendação clínica).

## TRN-12 Criar ou editar exercício (com mídia)

**Objetivo.** Criar um exercício seu ou editar um seu. Arquivo: `screens/exercicios/exercicio-form.html` (`?id=` para editar; modal de página inteira no 390).

**Fluxo.** Entrada: "Novo exercício" (TRN-10), "Editar" (TRN-11), conclusão de TRN-13. Saída: "Salvar exercício" volta a TRN-11 com toast; "Cancelar" volta (com aviso se houver mudanças).

**Conteúdo (seções, cada uma `fieldset`/`section`).**
1. **Dados básicos**: Nome (obrigatório, 3 a 80 caracteres, contador), Nível (Iniciante, Intermediário, Avançado; opcional), Padrão de movimento (select da taxonomia), Tags (campo com chips; criar tag nova só com Enter e confirmação; tags da taxonomia existente primeiro).
2. **Músculos**: Primário (obrigatório, ao menos 1), Secundários (opcional). Equipamentos (multi).
3. **Instruções e erros comuns** (`textarea`, 2000 caracteres, contador; texto simples). Aviso fixo: "Descreva só a execução do exercício. Não escreva informação de saúde de ninguém."
4. **Variações e substituições**: busca de exercícios do catálogo; tipo "Variação" ou "Substituto".
5. **Mídia**: até 1 vídeo de demonstração, 6 imagens, 1 poster (o poster do vídeo pode ser gerado: "Usar um quadro do vídeo" [MOCK]). Cada mídia: arquivo (formatos e tamanho máximo exibidos antes do envio, [MOCK] 100 MB vídeo, 10 MB imagem), "Título da mídia", "Descrição da mídia (para quem não vê o vídeo)" obrigatória, caixa de confirmação sem dado pessoal (regra 2, NÃO pré-marcada). Estados do envio: aguardando, enviando (barra `progress` com `aria-valuenow` e texto "Enviando 42%"), processando (PENDING), pronto (READY), falhou (FAILED, "Tentar de novo" e "Remover"). Cancelar envio disponível. Remover mídia: confirmação "Remover esta mídia? Ela some do exercício." 
6. **Visibilidade inicial**: padrão **Privado** (ver TRN-14); nunca pré-selecionado Compartilhado ou Público.

**Variantes** (`aura-variants`: `novo, editar, editar-copia-de-global, salvando, erro-validacao, erro-salvar, upload-enviando, upload-processando, upload-falhou, upload-arquivo-invalido, upload-grande, sem-confirmacao-pessoal, conflito, offline, sem-permissao`).
- Validação inline: "Informe o nome do exercício." "Escolha ao menos um músculo principal." "A descrição da mídia é obrigatória." "Este arquivo é grande demais (máx. [MOCK] 100 MB)." "Formato não aceito. Use MP4 ou WebM para vídeo; JPG, PNG ou WebP para imagem." Foco no primeiro erro.
- Nome duplicado entre os seus: aviso (não erro) "Você já tem um exercício com este nome. Quer continuar?" 
- Editar exercício usado em modelos: alerta info "Este exercício é usado em n modelos seus. As mudanças valem para eles e para novos treinos; treinos já atribuídos não mudam." (T-13: atribuição é snapshot; o exercício em si é referenciado, então a mudança de texto/mídia é visível; ver pressuposto 4).
- Offline: "Sem conexão. Não dá para salvar agora." (rascunho local mantido; mídia não).
- Conflito: "Este exercício foi alterado em outro lugar. Recarregue para ver a versão atual."
- Sem permissão: não é o dono (ou do sistema): acesso negado; sem papel: acesso negado.
- Rascunho preservado localmente (nome, textos); caixa de confirmação de mídia e arquivos nunca preservados.

**Acessibilidade específica.** Resumo de erros no topo (`role=alert`); campo de arquivo com botão visível e instruções; progresso de upload anunciado em `aria-live` em marcos (25%, 50%, 75%, pronto) para não verbosear; ordem das mídias com Subir/Descer.

**Layout.** 390: seções empilhadas, botão "Salvar exercício" fixo no rodapé, mídia em lista; 768: duas colunas (dados | mídia); 1440: formulário à esquerda (720 px) e painel "Pré-visualização do cartão" à direita.

**Dados mock.** `form`: name, level, movementPatternId, muscles[{id, role}], equipments[], tags[], instructions, commonMistakes, relations[], media[{localId, kind, title, alt, size, uploadState, refState, confirmedNoPersonalData}], visibility. Taxonomias ([MOCK] 12 músculos, 8 equipamentos, 6 padrões, 10 tags).

## TRN-13 Personalizar exercício global (cria cópia)

**Objetivo.** Editar um exercício do sistema sem alterá-lo: gera cópia sua (T-05). Modal em duas etapas ou página curta. Arquivo: `screens/exercicios/exercicio-personalizar.html?id=` (reusa o formulário de TRN-12).

**Fluxo.** Entrada: "Personalizar" em TRN-10/TRN-11 (Do sistema, público de outro ou compartilhado com selo X1/X2). Etapa 1: explicação e confirmação. Etapa 2: formulário de TRN-12 pré-preenchido. Saída: "Criar minha cópia" abre TRN-11 da cópia com toast "Cópia criada. O original não mudou."

**Etapa 1 (conteúdo).** Título "Personalizar [Nome]". Lista de consequências: "Criamos uma cópia só sua. O exercício original não muda." "O histórico dos seus alunos nesse exercício continua ligado, mesmo na cópia." (`history_key`, T-05) "A cópia começa como Privada." "Você pode apagar a cópia depois; o original continua disponível." Se mídia do original: "A mídia do original é reaproveitada; você pode trocar por outra." Botões "Continuar" e "Cancelar" (mesmo peso).

**Variantes** (`aura-variants`: `etapa-1, etapa-2, ja-tem-copia, salvando, erro, origem-indisponivel, sem-permissao`).
- `ja-tem-copia`: alerta "Você já tem uma cópia deste exercício: [Nome]." ações "Abrir minha cópia" (primária) e "Criar outra cópia" (secundária, com confirmação). Evita duplicar sem aviso.
- Origem indisponível (arquivado/removido): "Este exercício não está mais disponível para copiar."
- Erro ao criar: "Não foi possível criar a cópia. Nada foi alterado." + "Tentar de novo".
- Sem permissão: acesso negado.
- Carregando: skeleton do formulário.

**Acessibilidade específica.** Etapas com indicador textual "Passo 1 de 2"; foco no `h1` ao trocar de etapa; modal como `dialog` com foco preso.

**Layout.** 390 página inteira, passo atual no topo, botões empilhados; 768/1440 modal `modal-lg` na etapa 1 e página na etapa 2.

**Dados mock.** `source` (exercício origem), `existingCopyId|null`, `defaultVisibility = PRIVATE`.

## TRN-14 Visibilidade (privado, compartilhado, público)

**Objetivo.** Escolher quem vê um exercício seu. Modal aberto de TRN-11 (ações do dono) e de TRN-12. Arquivo: `screens/exercicios/exercicio-visibilidade.html` (ou modal).

**Fluxo.** Entrada: "Visibilidade" no detalhe do exercício Seu. Saída: "Salvar visibilidade" fecha com toast; "Cancelar".

**Conteúdo.**
- Grupo de opções (`radiogroup`, rótulo "Quem pode usar este exercício") com descrição em cada opção, **nenhuma pré-selecionada além do valor atual** (padrão novo = Privado):
  - **Privado**: "Só você vê e usa." (selo X3 explicado: "Restringe ao seu usuário, não ao tenant inteiro".)
  - **Compartilhado** (selo X2): "Outros personais que você escolher podem ver e usar. Eles não podem alterar o original." Campo "Escolher personais" (lista de personais do tenant, busca, chips; sem personais externos nesta v1 do protótipo). 
  - **Público** (selo X1): "Todos os personais do aura podem ver e usar. Passa por revisão antes de aparecer para todos." (Revisão é pressuposto 6.) 
- Mudança para uma opção mais aberta (Privado para Compartilhado/Público): `AuraUI.confirm` com consequência: "Outros personais poderão ver o exercício, a mídia e suas instruções. Não inclua informação pessoal." Botões "Tornar [público]" e "Manter [privado]" de mesmo peso.
- Mudança para opção mais fechada: confirmação com consequência: "Quem já copiou o exercício continua com a cópia. Modelos de outros personais que o usam mantêm o exercício, mas ele deixa de aparecer em novas buscas deles." (selo X4: efeito em modelos de terceiros não especificado.)
- Aviso sobre mídia: "Se este exercício tem mídia, ela passa a ser vista por quem tiver acesso. Confirme que ela não mostra pessoa identificável." Caixa NÃO pré-marcada, obrigatória para Compartilhado e Público (reaplica a regra 2).
- Sem texto jurídico final: o aviso sobre responsabilidade pelo conteúdo é **[LEGAL]** [MOCK] texto provisório ("Você é responsável pelo conteúdo que compartilha. [MOCK]"); regras de moderação do conteúdo público também (pressuposto 6).

**Variantes** (`aura-variants`: `privado, compartilhado, publico, mudando-para-aberto, mudando-para-fechado, sem-personais-no-tenant, em-revisao, recusado, salvando, erro, offline, sem-permissao`).
- `sem-personais-no-tenant`: opção Compartilhado desabilitada com "Você é o único personal desta conta."
- `em-revisao` (Público): badge "Em revisão" em TRN-10/11; continua privado até aprovar; texto "Enquanto está em revisão, só você vê." Ação "Cancelar publicação".
- `recusado`: alerta "Este exercício não foi publicado. Motivo: [MOCK] conteúdo com informação pessoal." Mantém Privado.
- Erro: "Não foi possível alterar. A visibilidade continua [Privado]." Offline: opções desabilitadas com motivo.
- Sem permissão: só o dono (e o gestor, por pressuposto) altera; outros: ausente, com nota "Só quem criou o exercício altera quem pode vê-lo."
- Exercício Do sistema: tela não aplicável (botão não existe).

**Acessibilidade específica.** `radiogroup` com `aria-describedby` por opção; selo ao lado do rótulo, não só tooltip; foco inicial na opção atual; `AuraUI.confirm` com foco em "Manter"; estado final anunciado em `aria-live`.

**Layout.** 390: bottom sheet em tela cheia; 768: modal 560; 1440: modal 560 centrado.

**Dados mock.** `visibility` atual, `sharedWith[]` (userId, name), `tenantPersonals[]` (3 [MOCK]), `reviewState` (NONE|IN_REVIEW|REJECTED|APPROVED), `reviewNote`, `mediaConfirmed`.

---

# Lote C, Treinos

## TRN-20 Biblioteca de modelos de treino

**Objetivo.** Gerir modelos (seus, do sistema, públicos, compartilhados). Arquivo: `screens/treinos/biblioteca.html`.

**Fluxo.** Entrada: menu "Treinos". Saída: cartão abre TRN-21 (leitura ou edição); "Novo modelo" abre TRN-21 vazio; "Atribuir a aluno" abre TRN-22; "Histórico" abre TRN-24; "Duplicar".

**Conteúdo.**
- h1 "Treinos"; subtítulo "Monte seus modelos e atribua a seus alunos."; ação primária "Novo modelo".
- Abas (contador): **Meus (n)** (Programas do tenant: spec cobre), **Do sistema (n)** (selo M1), **Públicos e compartilhados (n)** (selo M1 e M2). Filtros: Status (Rascunho DRAFT, Ativo ACTIVE, Arquivado ARCHIVED; padrão oculta arquivados), Nível, Objetivo (texto livre `goal`), busca por nome.
- Cartão do modelo: nome, nível, objetivo, nº de sessões (A, B, C), nº de exercícios, versão ("v3"), status (badge), origem e visibilidade, "Atualizado em dd/mm", "Em uso por n alunos" (contagem dentro do portão: ver variante; sem nomes). 
- Ações no cartão: "Abrir", "Atribuir", "Duplicar" (cria Rascunho próprio), "Arquivar" e "Restaurar", "Histórico". Modelo Do sistema/de colega: só "Abrir", "Duplicar para meus modelos" (selo M1), "Atribuir" (usa a cópia no momento de atribuir, que já é snapshot).

**Estados e variantes** (`aura-variants`: `padrao, vazio, so-rascunhos, filtro-sem-resultado, carregando, erro, offline, sem-permissao, sistema-vazio`).
- Vazio Meus: "Você ainda não tem modelos de treino." / "Monte o primeiro, ou comece por um modelo do sistema." / "Novo modelo" e "Ver modelos do sistema".
- Contagem "em uso por n alunos": só soma alunos que estão no portão; os demais não entram nem somam (evita revelar existência por contagem); texto "Em uso por 3 alunos com acompanhamento ativo" [MOCK]. Sem aluno nominal.
- Arquivar: confirmação "Arquivar [Nome]? Ele sai da lista principal. Treinos já atribuídos a alunos continuam como estão (são cópias). Você pode restaurar."
- Duplicar: toast "Cópia criada como rascunho: [Nome] (cópia)."
- Abas Do sistema e Públicos mostram selo ao lado do título da aba e vazio "Ainda não há modelos aqui." (selo visível, sem prometer data).
- Erro, carregando, filtro sem resultado: padrão do TRN-10.
- Sem permissão: acesso negado.

**Acessibilidade específica.** Cartão `article` com `h2` link; ações em menu "Mais"; badge de status com texto; contagens em texto.

**Layout.** 390: lista de cartões, filtros em modal; 768: 2 colunas; 1440: tabela opcional (nome, nível, sessões, versão, status, atualizado, ações) com alternância "Cartões | Tabela" (`aria-pressed`).

**Dados mock.** `program`: id, name, description, goal, level, status (DRAFT|ACTIVE|ARCHIVED), version, sessionsCount, itemsCount, updatedAt, scope (OWN|SYSTEM|PUBLIC|SHARED; selos M1/M2), ownerName, usedByActiveStudents (int). Mínimo 8 modelos Meus (2 rascunhos, 1 arquivado), 3 do sistema, 3 públicos/compartilhados ([MOCK], nomes genéricos como "Full body iniciante [MOCK]").

## TRN-21 Criar ou editar modelo (Programa > Sessão > Item > Série)

**Objetivo.** Montar o modelo com estrutura completa e agrupamentos. Arquivo: `screens/treinos/modelo-editor.html` (`?id=`).

**Fluxo.** Entrada: "Novo modelo", "Abrir" (TRN-20). Saída: "Salvar rascunho" (permanece), "Publicar versão" (ACTIVE, gera nova versão), "Atribuir" (TRN-22), "Histórico" (TRN-24), "Fechar" (aviso se não salvo).

**Estrutura da tela.**
- Cabeçalho: nome (obrigatório), objetivo (`goal`, opcional), nível, descrição, status, "Versão atual vN".
- **Sessões** (abas internas A, B, C… `label` até 8 caracteres, nome opcional, notas). "Adicionar sessão", "Renomear", "Duplicar sessão", "Remover sessão" (confirmação: "Remover a sessão B e seus n exercícios? Isso só vale neste modelo.").
- Dentro da sessão: lista ordenada de **blocos**: Item avulso ou **Grupo** (Bi-set com 2 itens, Super-set com 2 a 4, Circuito com 3 ou mais; `rounds`, descanso após o grupo `restAfterGroupSeconds`, notas). Criar grupo: selecionar itens contíguos e "Agrupar como…" ou "Adicionar grupo". Desagrupar mantém os itens. Regra de tela: bi-set exige exatamente 2 itens; erro inline "Um bi-set tem 2 exercícios."
- **Item**: exercício (abre seletor modal de TRN-10 modo escolher; mostra nome, origem e miniatura), notas (`notes`) e tabela de **séries**: tipo (Aquecimento, Normal, Drop, Falha), repetições mín. e máx. (faixa), carga em kg (opcional), RPE alvo (opcional, 1 a 10, passo 0,5), descanso (segundos, atalhos 30/60/90/120), cadência (`tempo`, 16 caracteres, ex. "3-1-1-0" [MOCK]), notas da série. Ações: "Adicionar série", "Duplicar série", "Remover série", "Trocar exercício", "Remover do treino". Preferir "carga ou RPE" (T-12): se ambos vazios, aviso suave "Sem carga nem esforço alvo" (não bloqueia).
- Resumo lateral (1440) / rodapé (390): nº de exercícios, séries, tempo estimado ([MOCK] cálculo simples e rotulado "estimativa"), avisos de validação.
- **Sugestões da IA**: bloco recolhido "Sugestões da IA (Em breve, lote D)" com selo I1, sem controles; texto "Quando existir, a IA só sugere. Você decide e confirma cada mudança." Sem botão "aplicar".
- **Importar planilha/arquivo**: botão desabilitado "Importar (Em breve, lote D)" com selo I1.
- Reordenar: Subir/Descer por sessão, bloco, item e série; arrastar opcional. Mover item para dentro/fora de grupo por menu "Mover para…".

**Salvar e versões.** "Salvar rascunho" grava o rascunho; "Publicar versão" (selo M3: versões numeradas com histórico não existem no schema além do campo `version`) confirma "Publicar a versão v4? Treinos já atribuídos NÃO mudam, pois cada aluno tem uma cópia." (T-13). Alterar modelo não altera atribuições: aviso permanente (info) "Mudanças neste modelo não alteram treinos já atribuídos."

**Variantes** (`aura-variants`: `novo, rascunho, ativo, arquivado, so-leitura-sistema, so-leitura-publico, com-bi-set, com-circuito, erro-validacao, salvando, erro-salvar, nao-salvo, conflito, offline, vazio-sessao, carregando, sem-permissao`).
- Vazio sessão: "Esta sessão ainda não tem exercícios." / "Adicionar exercício". Modelo novo sem sessão: cria a sessão "A" automaticamente com vazio guiado.
- Validação ao publicar: nome obrigatório, ao menos 1 sessão com 1 item, cada item com ao menos 1 série, repetições máx >= mín, RPE entre 1 e 10, grupos com tamanho válido. Lista de problemas no topo com links que levam ao campo ("Sessão B, item 2: informe ao menos uma série.").
- Exercício arquivado no modelo: badge "Arquivado" no item com aviso "Este exercício foi arquivado. Continua funcionando aqui; considere trocar." (não bloqueia). Exercício que deixou de ser acessível (compartilhado retirado, selo X4): item com alerta "Exercício indisponível" e botão "Trocar exercício" obrigatório para publicar.
- Do sistema/público/de colega: só leitura, com "Duplicar para meus modelos" (selo M1) e "Atribuir".
- Conflito: "Este modelo foi alterado em outro lugar. Recarregue." Offline: edição local mantida como rascunho do navegador; "Salvar" desabilitado com motivo.
- Sem permissão: acesso negado; sem papel de edição: modo leitura.
- Sem dado de aluno em nenhuma variante (o modelo não contém aluno).

**Acessibilidade específica.** Estrutura com `h1` (nome), `h2` por sessão, `h3` por grupo/item; tabela de séries com `caption` oculta "Séries de [exercício]" e cabeçalhos `scope`; no 390 a tabela vira lista de cartões por série com rótulos visíveis; Subir/Descer anunciam posição; modais do seletor com foco preso; navegação por teclado completa (Tab, setas nas abas de sessão); confirmações com a consequência.

**Layout.** 390: um bloco por vez, abas de sessão roláveis, ações em barra inferior ("Salvar rascunho", "Mais"); 768: editor em coluna única larga, resumo no topo; 1440: duas colunas (editor 2/3, resumo e validação à direita, fixos).

**Dados mock.** `program` (id, name, goal, level, status, version), `sessions[]` (id, label, name, notes), `groups[]` (id, sessionId, type BISET|SUPERSET|CIRCUIT, rounds, restAfterGroupSeconds, notes), `items[]` (id, sessionId, groupId|null, exerciseId, exerciseName, notes), `sets[]` (itemId, setType, repsMin, repsMax, loadKg, rpeTarget, restSeconds, tempo, notes). Modelo exemplo: 3 sessões, 1 bi-set, 1 circuito, 1 item com exercício arquivado ([MOCK] sem dado de aluno).

## TRN-22 Atribuir modelo a aluno

**Objetivo.** Dar uma cópia editável do modelo a um aluno, com período e dias. Arquivo: `screens/treinos/atribuir.html?modelo=` (modal grande no 390).

**Fluxo.** Entrada: "Atribuir" em TRN-20/TRN-21; "Atribuir treino" na aba Treinos de TRN-02 (lote A, hoje desabilitado), com o aluno pré-selecionado. Saída: "Atribuir treino" abre TRN-23 do aluno com toast; "Cancelar".

**Passos (página única com seções, ou etapas no 390).**
1. **Modelo**: nome, versão ("v3"), resumo de sessões. Opção alternativa "Montar um treino personalizado só para este aluno" (cria atribuição sem modelo, origem "Personalizado", e abre TRN-23 vazio).
2. **Aluno**: seletor de alunos com vínculo ACTIVE. Cada opção: nome. Opções fora do portão (regra 3) aparecem desabilitadas com motivo: "Aguardando liberação de saúde" (sem consentimento/revogado/não confirmado), "Conta em espera" (idade), "Vínculo pausado" ou "Vínculo encerrando". Alunos encerrados não aparecem. Nunca mostra dados de saúde, treino atual ou histórico no seletor. Busca só por nome.
3. **Período**: início (padrão hoje), fim (opcional; "Sem data de fim"), validação "O fim deve ser depois do início" (T-15).
4. **Dias da semana**: para cada sessão do modelo (A, B, C), escolher dias (dom a sáb) por `weekdays_mask`; opção "Treino livre (sem dia fixo)" (`weekdays_mask = 0`, T-15). Resumo "A: seg e qui; B: ter e sex". Aviso de conflito: "Dois treinos no mesmo dia." (não bloqueia; é aviso).
5. **Notas para o aluno** (opcional): campo habilitado só dentro do portão; aviso "Não escreva informação de saúde aqui, a menos que o aluno já tenha liberado." Como dentro do portão a escrita é permitida, o aviso é lembrança; fora do portão o campo nem existe porque o aluno não é selecionável.
6. **Resumo e confirmação**: "Você vai atribuir [Modelo v3] a [Nome], de dd/mm a dd/mm, nos dias [..]." Consequências: "O aluno recebe uma cópia. Mudanças futuras no modelo não alteram a cópia." "Você pode ajustar só o treino dele depois." "O aluno é avisado do novo treino." ([MOCK] texto; notificação ao aluno é do aluno-app; confirmar). Já havia atribuição ACTIVE: "Este aluno já tem um treino ativo. O atual será encerrado na data de início do novo?" com opções neutras e de mesmo peso: "Encerrar o atual no dia anterior" e "Manter os dois" (mais de uma ativa: pressuposto 5) e "Cancelar". Dados da atribuição anterior só dentro do portão (nome, não conteúdo).

**Variantes** (`aura-variants`: `modelo-escolhido, aluno-preselecionado, aluno-fora-do-portao, aluno-menor-em-espera, aluno-pausado, sem-alunos-ativos, ja-tem-treino, treino-livre, personalizado, erro-validacao, salvando, erro-salvar, offline, limite-modelo-vazio, sem-permissao`).
- Sem alunos ativos: "Você ainda não tem alunos ativos para atribuir." / "Convidar aluno" (link PER-01). Sem nenhum elegível (todos fora do portão): "Nenhum aluno elegível agora." / "Alunos aguardando liberação de saúde não recebem treinos até liberar." (neutro, sem pressão, sem contagem).
- Modelo sem item: bloqueia com "Este modelo está vazio. Adicione exercícios antes de atribuir." Modelo arquivado: "Restaurar o modelo antes de atribuir."
- Erro ao salvar: "Não foi possível atribuir. Nada foi enviado ao aluno." Sucesso: toast "Treino atribuído a [Nome]." (nome é dado pessoal, mas não de saúde; o texto não cita o treino em notificação do sistema).
- Sem permissão: não é responsável pelo aluno: acesso negado (sem confirmar existência). Gestor sem ser responsável: lê, não atribui (pressuposto 7).
- Offline: escrita crítica desabilitada.
- Sem texto de saúde em títulos, `title` ou toasts.

**Acessibilidade específica.** Seletor de aluno como `combobox` com lista e motivo de desabilitado lido em `aria-describedby`; dias da semana como grupo de caixas de seleção com rótulos completos ("segunda-feira"), não só letras; datas `input type=date` com formato pt-BR visível e erro textual; resumo final em `aria-live`; foco volta ao disparador ao fechar.

**Layout.** 390: etapas em tela cheia, "Voltar/Continuar" empilhados; 768: página única, resumo no rodapé fixo; 1440: formulário à esquerda e "Resumo da atribuição" à direita (sticky).

**Dados mock.** `students[]` (id, name, linkStatus, gate {eligible, reasonCode: OK|NO_CONSENT|REVOKED|UNCONFIRMED|AGE_HOLD|PAUSED|ENDING}) ([MOCK] sem dado de saúde: 4 elegíveis, 1 sem consentimento, 1 revogado, 1 menor em espera, 1 pausado); `model` {id, name, version, sessions[]}; `assignmentDraft` {startDate, endDate|null, weekdaysBySession{label: mask}, free, note}.

## TRN-23 Editar treino do aluno

**Objetivo.** Ajustar a cópia do aluno (T-14) sem alterar o modelo. Arquivo: `screens/treinos/treino-aluno-editor.html?aluno=&id=`.

**Fluxo.** Entrada: TRN-22 (após atribuir), "Editar treino" na aba Treinos de TRN-02. Saída: "Salvar ajustes" volta a TRN-02 aba Treinos; "Ver histórico" (TRN-24); "Pausar treino"/"Encerrar treino" (atribuição PAUSED/ENDED, spec cobre status).

**Conteúdo.** Mesmo editor de TRN-21 (reuso do componente) aplicado à cópia (`assignment_*`), com diferenças:
- Cabeçalho: "Treino de [Nome do aluno]" (nome é dado básico), origem "Modelo [X] v3" ou "Personalizado", "Ajustado em dd/mm (customized_at)", período e dias (editáveis), status (Ativo, Pausado, Encerrado).
- Faixa fixa de privacidade (texto do lote A, seção 0, regra 3) mais aviso: "O aluno vê os ajustes que você salvar." 
- Notas por item/série: campo existe só dentro do portão (colunas HEALTH_*, spec 6.9(q)); não entram no rascunho local do navegador.
- Sem "Publicar versão" de modelo: só "Salvar ajustes" (um passo, confirmação leve quando já há sessões executadas: "Há sessões já feitas neste treino. Os registros delas continuam como foram; mudanças valem para as próximas.").
- "Restaurar do modelo" (selo M4: re-sincronizar com versão atual do modelo não existe; spec define snapshot sem sincronização) com confirmação "Isso descarta seus ajustes neste aluno." Mostrado como "Em breve" desabilitado com selo.
- Pausar: "O aluno deixa de ver este treino hoje e você pode retomar." Encerrar treino: confirmação "O treino fica no histórico. O aluno deixa de recebê-lo." Mesma regra de consequência e de peso igual.
- Sessões já executadas: os itens executados aparecem com marca "Já feito em dd/mm" (metadado de treino, dentro do portão); carga e RPE do aluno NÃO aparecem aqui (são do TRN-31, lote E).

**Variantes** (`aura-variants`: `padrao, personalizado, com-sessoes-feitas, pausado, encerrado, fora-do-portao, menor-em-espera, vinculo-pausado, erro-validacao, salvando, erro-salvar, conflito, offline, carregando, erro, sem-permissao`).
- Fora do portão, menor em espera, vínculo pausado/encerrando/encerrado: tela inteira vira o cartão "Oculto por privacidade" (lote A, regra 8) com o motivo; nenhuma estrutura de treino, nome de exercício ou contagem aparece; mock não gera treino para esses alunos. Ações de escrita ausentes.
- Encerrado (atribuição): leitura limitada dentro do portão com "Este treino foi encerrado em dd/mm. Só leitura."
- Conflito: "Este treino foi alterado em outro lugar. Recarregue."
- Erro de validação: igual a TRN-21.
- Sem permissão: acesso negado, sem confirmar existência.

**Acessibilidade específica.** Igual a TRN-21; `h1` inclui só o nome do aluno e "Treino" (sem texto de saúde no título/`title`); região de ajustes salvos anunciada em `aria-live`.

**Layout.** Igual a TRN-21; 1440: coluna direita com "Origem" e "Ajustes" (lista de mudanças em linguagem simples, dentro do portão).

**Dados mock.** `assignment` (id, studentId, name, startDate, endDate, status, sourceName, sourceVersion, customizedAt, weekdaysBySession), mais sessões/grupos/itens/séries como TRN-21 e `performedMarks[]` (assignmentItemId, doneAt). Só para 2 alunos elegíveis; nenhum dado de saúde [MOCK].

## TRN-24 Histórico de versões

**Objetivo.** Ver mudanças ao longo do tempo: do modelo (versões) e do treino de um aluno (ajustes). Arquivo: `screens/treinos/historico-versoes.html?modelo=` ou `?aluno=&id=`.

**Fluxo.** Entrada: "Histórico" em TRN-20, TRN-21, TRN-23. Saída: "Voltar"; "Duplicar esta versão como rascunho" (cria rascunho do modelo; selo M3); "Ver esta versão" (leitura).

**Conteúdo.**
- Modo **modelo** (selo M3): linha do tempo com "v4 (atual)", "v3", "v2", "v1": data, quem publicou, resumo de mudança em linguagem simples ("Adicionou 1 sessão, trocou 2 exercícios" [MOCK]), status ("Atual", "Anterior"). Ação "Comparar com a atual" abre diferença lado a lado: sessões/itens/séries adicionados, removidos e alterados, com ícone e texto (+ , −, ~), nunca só cor; no 390 vira lista agrupada. Abas internas: "Versões" e "Atribuições feitas" (nome do aluno, data, versão de origem; **só alunos dentro do portão**; resumo agregado "n atribuições" para os demais, sem nomes; padrão conservador).
- Modo **treino do aluno** (selo M4): lista de ajustes do personal na cópia (data, quem, resumo) e eventos de status (Atribuído, Pausado, Retomado, Encerrado). Só dentro do portão; fora dele: "Oculto por privacidade". Conteúdo clínico (cargas do aluno, dor) nunca aparece.
- Aviso permanente: "Treinos já atribuídos são cópias. Publicar uma versão nova não os altera." (T-13).
- Restaurar versão antiga: apenas "Duplicar como rascunho"; não há "restaurar por cima" (evita perda). Confirmação: "Criar um rascunho a partir da v2? A versão atual não muda."

**Variantes** (`aura-variants`: `modelo, treino-aluno, so-uma-versao, sem-historico, comparando, carregando, erro, offline, fora-do-portao, sem-permissao`).
- Só uma versão: "Este modelo ainda está na v1." / "Quando você publicar mudanças, as versões anteriores aparecem aqui."
- Sem histórico do aluno: "Ainda não há ajustes neste treino."
- Erro: "Não foi possível carregar o histórico." + "Tentar de novo". Offline: leitura do cache com hora.
- Fora do portão: cartão "Oculto por privacidade" no modo aluno; modo modelo funciona (sem aluno), com a aba "Atribuições feitas" mostrando só agregado.
- Sem permissão: acesso negado.

**Acessibilidade específica.** Linha do tempo como lista ordenada (`ol`) com `time datetime`; diferenças com texto "Adicionado", "Removido", "Alterado" além de ícone; comparação com navegação por teclado; botões com nome completo ("Comparar v2 com a versão atual").

**Layout.** 390: lista vertical, comparação em acordeões; 768: lista e painel de detalhe em duas colunas; 1440: lista à esquerda (360) e comparação lado a lado à direita.

**Dados mock.** `versions[]` (version, publishedAt, publishedByName, summary, status, changes[{kind ADDED|REMOVED|CHANGED, path, before, after}]); `assignmentsFromModel[]` (studentId|null, studentName|null conforme portão, at, version); `studentChanges[]` (at, byName, summary, kind). [MOCK], sem dado de saúde.

---

## 8. Itens com selo "Requer API nova" (para `_pendencias-api-training.md`)

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| X1 | Exercício PÚBLICO criado por personal (inclui revisão antes de publicar) | TRN-10, 11, 13, 14 | Spec: só admin escreve GLOBAL (T-04) |
| X2 | Exercício COMPARTILHADO com outros personais e aba "Compartilhados comigo" | TRN-10, 11, 13, 14 | Compartilhamento é T-31, fora da v1 |
| X3 | Exercício PRIVADO restrito ao criador (hoje a visibilidade é por tenant) | TRN-14 | RLS [C] é por tenant, não por usuário |
| X4 | Efeito de retirar visibilidade em modelos e cópias de terceiros | TRN-14, TRN-21 | Não especificado |
| M1 | Modelo DO SISTEMA e público (listar, abrir, duplicar) | TRN-20, 21 | Presets fora da v1 |
| M2 | Modelo compartilhado entre personais | TRN-20 | Idem |
| M3 | Histórico de versões do modelo (publicar vN, comparar, duplicar versão) | TRN-21, 24 | Schema só tem `programs.version` (inteiro), sem tabela de versões |
| M4 | Histórico de ajustes do treino do aluno e "Restaurar do modelo" | TRN-23, 24 | Só `customized_at`; sem sincronização com o modelo |
| I1 | Sugestões da IA e importação (apenas encaixe "Em breve") | TRN-21 | IA fora da v1 (T-38); a IA só sugere |
Sem selo (spec cobre): exercícios GLOBAL (leitura) e TENANT, cópia de global, metadados, mídia por referência e `ref_state`, busca (T-07), programas, sessões, grupos, itens, séries, atribuição com período, dias da semana e status, edição por aluno (`customized_at`).

## 9. Pressupostos e lacunas (para decisão do principal/humano)
1. "Meus" = exercícios criados pelo usuário; o schema pede `created_by_user_id`, então o filtro existe, mas a visibilidade entre personais do mesmo tenant hoje é do tenant (X3).
2. Revisão antes de publicar exercício público e moderação: assumida; regras e responsável não definidos (**[LEGAL]** e produto).
3. Aviso de responsabilidade pelo conteúdo compartilhado e remoção de EXIF: textos provisórios [MOCK], confirmar com privacy-compliance e aura-media.
4. Editar exercício Seu usado em modelos: o modelo referencia o exercício (mudança de texto/mídia aparece); atribuições guardam `exercise_name_snapshot`. Confirmar se mudança de mídia afeta treinos já atribuídos.
5. Mais de uma atribuição ACTIVE por aluno: spec (T-15) permite sessões livres; regra de coexistência de atribuições não definida; padrão do protótipo oferece "encerrar a atual" ou "manter as duas".
6. Gestor que não é responsável: assumido leitura, sem atribuir (como lote A, pressuposto 1).
7. Atribuição fora do portão de saúde bloqueada (conservador); **[LEGAL] pendente** junto com PRV-A-04. Se o jurídico liberar, reabrir só TRN-22 e TRN-23.
8. Notificação ao aluno sobre novo treino: assumida, texto [MOCK], sem conteúdo de saúde.
9. Numeração mantida TRN-10 a TRN-14 e TRN-20 a TRN-24; sem alterações. Sugestão de reuso: seletor de exercício (TRN-10 em modal) e editor de sessão (TRN-21 e TRN-23) como componentes compartilhados `g5-*`.
10. Evidência de usabilidade ausente: nenhuma sessão com personais. Recomenda-se teste rápido (5 personais) no editor TRN-21 (agrupamentos e séries), na escolha de visibilidade TRN-14 e na atribuição TRN-22. Privacy-compliance deve revisar TRN-12 (mídia), TRN-14, TRN-22 e TRN-23 antes de congelar.
11. Contraste não verificado aqui (depende dos tokens); QA do lote confirma 4.5:1 em claro e escuro, incluindo selo e badges.
