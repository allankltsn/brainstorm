# Aura — Mapa de pendências

11/11/2026

## Resumo

O protótipo `prototype-v2` cobre hoje o ciclo principal em telas, mas tudo é mock com dados fictícios: nenhum item tem backend. Restam 8 telas por criar, 6 ajustes em telas existentes, o backend inteiro e 2 pendências de publicação.

Este mapa junta três relatórios de sessão. Dois deles são idênticos (mesma entrega, commit `05af13b` na `main`), então há duas fontes de fato:

- **Sessão de telas (commit `05af13b`).** Entregou 19 rotas: histórico de versões e atribuição de treino, visibilidade e versão própria de exercício, responsáveis do aluno, exclusão de conta e cópia de dados, pagamento recusado, cupom, formulário de plano, perfis de acesso, acesso negado e em breve. Build e lint passaram; as rotas abriram em 390 e 1440 px sem rolagem horizontal nem erro no console.
- **Sessão de levantamento.** Leu o código da branch `ccr-72e415d8-mmyr49` e classificou os itens P0 a P3 do plano. Não leu o chat daquela sessão nem a lista de pendências de API.

O levantamento pode ser anterior ao commit `05af13b`. Onde as duas fontes se cruzam, a situação está marcada como "a confirmar".

## Telas que faltam

Oito telas ainda não existem no protótipo; a única de P0 é o histórico e a evolução do aluno.

| # | Prioridade | Tela | O que falta |
| --- | --- | --- | --- |
| T1 | P0 | Histórico e evolução do aluno | Cargas e frequência ao longo do tempo. A rota `/treino` existe, sem histórico |
| T2 | P1 | Check-in periódico | Peso, medidas e fotos. Nenhuma tela encontrada |
| T3 | P1 | Cobrança do personal ao aluno | Mensalidade do aluno. O que existe (planos, cupons, cancelamento) é a assinatura do personal com o Aura |
| T4 | P1 | Suporte dentro do app | Nenhuma tela |
| T5 | P2 | Linha do tempo do aluno | Visão única com anotações. Existe só "treino feito" com retorno ao aluno |
| T6 | P2 | Checklist de onboarding do aluno | Existe só o fluxo de convite e aceite |
| T7 | P2 | Aniversário e frase do dia | Nenhuma tela |
| T8 | P2 | Créditos de IA | A fila "Precisa de você" e a tela de dados usados pela IA existem; faltam os créditos |

Três itens precisam de conferência no código antes de entrar na lista acima:

| # | Prioridade | Item | Dúvida |
| --- | --- | --- | --- |
| C1 | P0 | Lembrete de treino e preferências de aviso | O centro de avisos (`/avisos`) existe; lembrete e preferências não foram verificados |
| C2 | P2 | Versionamento de modelos e restaurar do modelo (M3, M4) | O levantamento marcou como pendente; depois entrou o histórico de versões do treino (`#/treinos/t1/versoes`). Falta saber se cobre modelos e se há restaurar |
| C3 | P2 | Modelos prontos do sistema (M1) | Marcado como pendente no levantamento; não aparece na entrega do commit `05af13b` |

## Ajustes em telas que já existem

Seis pendências ficaram abertas na entrega do commit `05af13b`.

| # | Tipo | Pendência | Detalhe |
| --- | --- | --- | --- |
| A1 | Conteúdo | Variantes de erro e de limite | As variantes de cada tela do protótipo antigo não foram portadas |
| A2 | Conteúdo | Retirar liberações na aba Privacidade | Só entraram a cópia dos dados e a exclusão de conta |
| A3 | Navegação | Acesso negado (`#/acesso-negado`) | Só abre pelo endereço; nenhum botão leva a ela |
| A4 | Navegação | Em breve (`#/em-breve/agenda`) | Só abre pelo endereço; nenhum botão leva a ela |
| A5 | Verificação | Conferência visual tela a tela | As 19 rotas abriram sem erro, mas o visual não foi revisado |
| A6 | Verificação | Teste em 768 px | Só 390 e 1440 px foram testados |

## Backend e API

Nenhuma tela do protótipo tem backend: todas usam dados de exemplo, e várias levam o selo "Requer API nova". A lista oficial de pendências de API (`_pendencias-api-training.md`) não foi lida por nenhuma sessão, então os códigos abaixo são só os citados nos relatórios.

| # | Área | Telas prontas sem backend | Código citado |
| --- | --- | --- | --- |
| B1 | Execução do treino | Meu treino (`/treino`): concluir série, dor, finalizar | |
| B2 | Avisos | Centro de avisos (`/avisos`) | |
| B3 | Mensagens | Chat personal e aluno (`/mensagens`) | C1 |
| B4 | Vínculo | Pausar, retomar e encerrar (`/alunos/:id/vinculo`) | V1, V4 |
| B5 | Importação | Importar planilha (`/treinos/importar`) | I3 |
| B6 | Treinos | Histórico de versões, usar o treino com alunos | M3, M4 a confirmar |
| B7 | Exercícios | Quem pode ver, criar minha versão | |
| B8 | Alunos | Convidar aluno, modo de acompanhamento e responsáveis | |
| B9 | Questionários | Modelo, envio e resposta | |
| B10 | Conta e acesso | Cadastro, convite, recuperar e redefinir senha, seleção de perfil, sessão expirada | |
| B11 | Privacidade | Termos, cópia dos dados, excluir conta | |
| B12 | Assinatura | Planos, pagamento recusado, cancelar assinatura | |
| B13 | Admin | Usuários, permissões, perfis de acesso, planos, cupons e relatório de cupom | |
| B14 | IA | Fila "Precisa de você", dados usados pela IA | |

- [ ] Ler `_pendencias-api-training.md` na branch `ccr-72e415d8-mmyr49` e cruzar com esta tabela.
- [ ] Verificar se a sessão de telas acrescentou itens a essa lista.

## Publicação e infraestrutura

Duas pendências impedem a publicação de rodar sozinha.

| # | Pendência | Detalhe |
| --- | --- | --- |
| I1 | Tarefa agendada sem o repositório anexado | O `scripts/sync.sh` foi rodado à mão. Até anexar o repositório à tarefa, cada publicação depende de execução manual |
| I2 | ~~Deploy do GitHub Pages não confirmado~~ | **Fechado em 12/11/2026:** deploy no ar, tag `v0.1.0` (commit `9e3f5ae`) |

## Fora da v1 e pontos a confirmar

Seis frentes ficam para depois da v1 (P3), sem mudança: IA de prescrição, nutrição, compartilhamento entre personais, painel personalizável, multiunidade e Academy.

Pontos em aberto neste mapa:

- [ ] O levantamento foi feito antes ou depois do commit `05af13b`? Disso depende a situação de C2 e C3.
- [ ] A branch `ccr-72e415d8-mmyr49` e a `main` têm o mesmo conjunto de telas?
- [ ] Qual a ordem de ataque: fechar telas (T1 a T8) ou começar o backend do ciclo P0 (B1, B2)?

Este documento foi montado só a partir dos três relatórios; o código do protótipo não foi relido para ele.

## Adiados do login (rodada 2 de gates, 12/11/2026)

- [ ] **Tema 1 (só com architect):** URL do host x iframe, F5/Voltar, título, query (REV-BL-02, REV-BL-03, REV-BL-04 base/09, UX-BL-02, UX-BL-03, UX-BL-12).
- [ ] **Tema 5:** contraste e foco medidos em navegador (UX-BL-07).
- [ ] **Tema 6 (login real):** SEC-BL-05, SEC-BL-07, UX-BL-11, `?estado=` vindo do servidor, build de produção sem `VITE_DEMO`, teste do host (`init/src/App.jsx`, REV-BL-05) por falta de runner, validar com personal trainers reais.
