# Pendências de API do aura-training (selo "Requer API nova")

Registro dos itens do protótipo que não têm endpoint ou campo na especificação do training. Cada item aparece na tela com o selo "Requer API nova" (`data-pend="<id>"`). Fonte: `_ux/lote-a-meus-alunos.md`, seção 8. Lote A (Meus alunos). Dados do protótipo são mock.

| Id | Item | Telas e arquivos | Motivo |
|----|------|------------------|--------|
| N1 | Dados de nutrição do aluno (refeições, metas, observações) | TRN-03: bloco Nutrição em `screens/alunos/aluno-saude.html` e aba Saúde de `aluno-detalhe.html` | Nutrição fora da v1 (spec das telas, seção 4, item 4) |
| N2 | Objetivos declarados pelo aluno (distintos do `goal` do programa) | TRN-03: bloco Objetivos, mesmos arquivos de N1 | Sem campo no schema para o aluno |
| V1 | Personal pausar, retomar e encerrar vínculo (SUSPENDED, ENDING, ENDED) | TRN-02 menu "Mais ações" (`aluno-detalhe.html`); TRN-05 (`aluno-vinculo.html` e modal em `grupo-g5.js`) | Vínculo vem do identity (T-50); ação do personal não especificada |
| V2 | Adicionar, remover e trocar o principal de responsáveis; aviso ao aluno da mudança | TRN-04: card Responsáveis (`aluno-acompanhamento.html`) | Tabela existe (T-48); endpoint e aviso não |
| V3 | Estado "aguardando vaga" para convite aceito com limite cheio | TRN-01 aba Pendentes, variante `aceite-sem-vaga` (`meus-alunos.html`); TRN-06 | Depende de billing e identity, fora do training |
| V4 | Motivo de pausa ou encerramento (nota privada do personal) | TRN-05: campo "Motivo" no modal de pausar (`grupo-g5.js`) | Sem campo no schema. Visibilidade (gestor?) e retenção do motivo (texto livre) ficam a definir (PRV-A-09) |
| V5 | Aba "Pendentes" unificando convites (identity) e vínculos aguardando consentimento (training) | TRN-01: seções "Convites enviados" e "Aguardando liberação" (`meus-alunos.html`) | Composição entre serviços, não prevista |
| V6 | Busca por nome (cliente) e por e-mail só no servidor e por correspondência exata (PRV-A-08), ordenação e paginação da lista de alunos | TRN-01: barra de filtros (`meus-alunos.html`) | Nome e e-mail vêm do identity; sem listagem unificada prevista |

### Lotes B e C (Exercícios e Treinos), fonte: `_ux/lote-bc-exercicios-treinos.md`, seção 8

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| X1 | Exercício público criado por personal (com revisão antes de publicar) | TRN-10, 11, 13, 14 | Spec: só admin escreve GLOBAL (T-04) |
| X2 | Exercício compartilhado com outros personais e aba "Compartilhados comigo" | TRN-10, 11, 13, 14 | Compartilhamento é T-31, fora da v1 |
| X3 | Exercício privado restrito ao criador (hoje a visibilidade é por tenant) | TRN-14 | RLS é por tenant, não por usuário |
| X4 | Efeito de retirar visibilidade em modelos e cópias de terceiros | TRN-14, TRN-21 | Não especificado |
| M1 | Modelo do sistema e público (listar, abrir, duplicar) | TRN-20, 21 | Presets fora da v1 |
| M2 | Modelo compartilhado entre personais | TRN-20 | Idem |
| M3 | Histórico de versões do modelo (publicar vN, comparar, duplicar versão) | TRN-21, 24 | Schema só tem `programs.version`, sem tabela de versões |
| M4 | Histórico de ajustes do treino do aluno e "Restaurar do modelo" | TRN-23, 24 | Só `customized_at`; sem sincronização com o modelo |
| I1 | Sugestões da IA e importação (apenas encaixe "Em breve"; a IA só sugere) | TRN-21 | IA fora da v1 (T-38) |

### Lote E (Acompanhamento), fonte: `_ux/lote-e-acompanhamento.md`, seção 8

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| C1 | Chat privado geral personal-aluno (conversa, não lidas, anexo com consentimento de fotos/vídeos) | TRN-33 (`mensagens.html`) | Spec: só retorno por sessão ou série (T-35) |
| C2 | Centro de notificações do personal (lista unificada, lida/não lida, preferências) | TRN-34 (`notificacoes.html`, sino) | Spec: só `alerts` e notificação externa genérica (T-51) |
| I1 (reuso) | Sugestões da IA só como encaixe "Em breve" (alertas, retorno, mensagem, perguntas) | TRN-30 a TRN-33 | IA fora da v1 (T-38) |

### Lote D (Prescrição com IA), fonte: `_ux/lote-d-prescricao-ia.md`, seção 8

| Id | Item | Telas | Motivo |
|----|------|-------|--------|
| I1 (reuso) | Sugestões da IA para montar e ajustar treino (painel; aceitar leva ao rascunho; a IA só sugere) | TRN-40, entradas em TRN-21 e TRN-23 | IA fora da v1 (T-38) |
| I2 | Pontos de atenção de saúde e evidência científica citada | TRN-40 | Idem; sem contrato de evidência nem de conteúdo de saúde gerado |
| I3 | Importação de planilha ou arquivo de texto com revisão linha a linha | TRN-41 (`importar.html`) | Idem; sem endpoint de leitura e interpretação |
| I4 | Escolha das categorias lidas pela IA e registro de uso (quem, quando, categorias; sem conteúdo) | TRN-40 passo 3, TRN-42 (`dados-ia.html`) | Sem tabela de registro de uso nem leitura por categoria |
| I5 | Pedido de liberação de uso de IA do personal ao aluno | TRN-42, TRN-40 | Consentimento é do aluno; fluxo de pedido não existe |

Sem selo (a spec cobre): vínculos, consentimentos, atribuições, sessões, dor, alertas (PAIN, ABSENCE, CHECKIN_OVERDUE), questionários, retorno, mídia privada, modo de acompanhamento, número do limite (consumo).

## Pressupostos mantidos do UX (para decisão do principal ou do humano)
Ver `_ux/lote-a-meus-alunos.md`, seção 9. Textos de consentimento, aviso ao aluno e destino do dado após revogação são [LEGAL] e aparecem como "[MOCK] texto provisório".
