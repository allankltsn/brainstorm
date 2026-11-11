# Aura — Mapa de pendências

Atualizado em 11/11/2026, conferido no código do `prototype-v2`.

## Resumo

Todas as telas do plano P0 a P2 existem no protótipo. O que resta é publicar a última rodada na `main`, fechar seis ajustes pequenos e construir o backend, que não existe para nenhuma tela.

- **Na `main` (commit `05af13b`):** as telas das rodadas anteriores, incluindo evolução do aluno, check-in, linha do tempo, cobranças, créditos de IA, suporte, primeiros passos, aniversários e frase do dia.
- **Na branch `prototipo-landing` (commit `b0b7ee0`), ainda não publicado:** modelos prontos, restaurar do modelo, retirar liberações, acesso negado por perfil, entradas de "em breve" e estados de carregando, erro, vazio e limite nas listas antigas.

A versão anterior deste mapa listava oito telas como faltando. Estava errada: ela se baseou num relatório feito antes de essas telas entrarem.

## Telas do plano: situação

Nenhuma tela de P0 a P2 está faltando.

| Prioridade | Item | Onde está | Publicado na `main` |
| --- | --- | --- | --- |
| P0 | Execução do treino pelo aluno | `#/treino` | Sim |
| P0 | Histórico e evolução do aluno | `#/evolucao`, `#/alunos/s03/evolucao` | Sim |
| P0 | Avisos, lembrete de treino e preferências | `#/avisos`, `#/configuracoes?aba=avisos` | Sim |
| P1 | Chat personal e aluno | `#/mensagens` | Sim |
| P1 | Pausar, retomar e encerrar vínculo | `#/alunos/s01/vinculo` | Sim |
| P1 | Check-in periódico | `#/check-in` | Sim |
| P1 | Cobrança do personal ao aluno | `#/cobrancas`, `#/pagamentos` | Sim |
| P1 | Suporte dentro do app | `#/suporte` | Sim |
| P2 | Linha do tempo do aluno | `#/alunos/s03/linha-do-tempo` | Sim |
| P2 | Checklist de onboarding do aluno | `#/primeiros-passos` | Sim |
| P2 | Aniversário e frase do dia | `#/inicio` (personal e aluno) | Sim |
| P2 | Prioridades do dia e créditos de IA | `#/inicio`, `#/ia/creditos` | Sim |
| P2 | Versionamento de treinos (M3) | `#/treinos/t1/versoes` | Sim |
| P2 | Restaurar do modelo (M4) | `#/treinos/t3/versoes` | Não |
| P2 | Modelos prontos do sistema (M1) | `#/treinos?aba=prontos` | Não |
| P2 | Importar planilha (I3) | `#/treinos/importar` | Sim |

## Pendências do protótipo

Sete itens abertos; o primeiro trava os demais de aparecerem no site.

| # | Tipo | Pendência | Detalhe |
| --- | --- | --- | --- |
| F1 | Publicação | Sincronizar a rodada de 11/11 na `main` | `scripts/sync.sh prototype-v2 prototipo-landing` foi barrado pela checagem de permissão da sessão. Precisa de liberação ou de execução manual |
| F2 | Conteúdo | Erro ao salvar em formulários | Treino, exercício, cupom, questionário e convite só simulam o sucesso |
| F3 | Conteúdo | Erro em entrar e criar conta | Não verificado se há variante de senha errada, e-mail já usado e conta bloqueada |
| F4 | Visual | Tabela de alunos em 768 px | As colunas da direita ficam cortadas e rolam dentro do cartão |
| F5 | Texto | Aba Privacidade no perfil aluno | A seção de IA fala como personal ("nada vai para o aluno sem você aprovar") |
| F6 | Verificação | Conferência visual tela a tela | 171 aberturas em 390, 768 e 1440 px sem erro nem rolagem lateral; só quatro telas foram vistas em captura |
| F7 | Definição | Sentido de "restaurar do modelo" (M4) | Foi feito como: um treino copiado de modelo pronto volta ao conteúdo do modelo. Confirmar se era isso |

Feito na rodada de 11/11:

- Estados de carregando, erro e vazio em Alunos, Treinos, Acompanhar, Mensagens, Avisos, Usuários e Planos e cupons (`?estado=erro`, `?estado=vazio`).
- Limite atingido em Alunos e Convidar aluno (vagas do plano) e em Sugerir treino com IA (créditos zerados), com `?estado=limite`.
- Retirar e devolver liberações na aba Privacidade, com lista própria por perfil.
- Acesso negado: abrir pelo endereço uma tela de outro perfil mostra a tela de acesso negado.
- Em breve: Agenda e Nutrição abrem pela busca (Ctrl K) no perfil personal.

## Backend e API

Nenhuma tela do protótipo tem backend: todas usam dados de exemplo. A lista oficial de pendências de API (`_pendencias-api-training.md`) não foi lida, então os códigos abaixo são só os citados nos relatórios.

| # | Área | Telas prontas sem backend | Código citado |
| --- | --- | --- | --- |
| B1 | Execução do treino | Meu treino: concluir série, dor, finalizar | |
| B2 | Avisos | Centro de avisos, lembretes e preferências | |
| B3 | Mensagens | Chat personal e aluno | C1 |
| B4 | Vínculo | Pausar, retomar e encerrar | V1, V4 |
| B5 | Importação | Importar planilha | I3 |
| B6 | Treinos | Versões, restaurar do modelo, modelos prontos, usar com alunos | M1, M3, M4 |
| B7 | Exercícios | Quem pode ver, criar minha versão | |
| B8 | Alunos | Convite, responsáveis, evolução, check-in, linha do tempo, primeiros passos | |
| B9 | Questionários | Modelo, envio e resposta | |
| B10 | Conta e acesso | Cadastro, convite, senha, seleção de perfil, sessão expirada, acesso por perfil | |
| B11 | Privacidade | Termos, liberações, cópia dos dados, excluir conta | |
| B12 | Assinatura | Planos, pagamento recusado, cancelar assinatura, limite de vagas | |
| B13 | Cobrança do aluno | Cobranças do personal e pagamentos do aluno | |
| B14 | Admin | Usuários, permissões, perfis de acesso, planos, cupons e relatório de cupom | |
| B15 | IA | Prioridades do dia, sugestão de treino, dados usados, créditos | |
| B16 | Suporte | Ajuda e chamados | |

- [ ] Ler `_pendencias-api-training.md` e cruzar com esta tabela.

## Publicação e infraestrutura

Três pendências, além da F1.

| # | Pendência | Detalhe |
| --- | --- | --- |
| I1 | Tarefa agendada sem o repositório anexado | "Sincronizar telas na main" não roda sozinha; cada publicação depende de execução manual do `scripts/sync.sh` |
| I2 | `scripts/sync.conf` desatualizado | Aponta `prototype-v2` para a branch `ccr-01d79291-y749e2`, mas as últimas rodadas vieram de outras branches. Um sync sem argumentos pode trazer uma versão diferente da atual |
| I3 | Deploy do GitHub Pages não confirmado | Falta conferir que o deploy mais recente da `main` terminou |

## Fora da v1

Seis frentes ficam para depois da v1 (P3), sem mudança: IA de prescrição, nutrição, compartilhamento entre personais, painel personalizável, multiunidade e Academy.
