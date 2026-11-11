# aura-fit · protótipo v2

Protótipo novo em React, criado para avaliar o visual antes do desenvolvimento.
Usa dois kits de interface, com um único tema:

| Kit | Onde fica | Para quê |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com) | `src/components/ui` | Estrutura: menu lateral, tabela, diálogo, menus, gráfico, avisos |
| [affectUI](https://www.affectui.com) (itens gratuitos, MIT) | `src/components/affect` | Formulários e interação: botão, campo, seleção, abas, código de verificação, cartões de IA |

| [Lightswind UI](https://lightswind.com) (MIT) | `src/components/lightswind` | Campo de conversa com microfone, busca geral (Ctrl K), texto com brilho |

O protótipo antigo (HTML puro) continua em `../prototype` para comparação.

## Rodar

```bash
npm install
```

```bash
npm run dev
```

`npm run build` gera `dist/`, que é estático e abre em qualquer hospedagem.

## Telas já migradas

- Entrar (`#/login`) e confirmar e-mail (`#/verificar-email`)
- Início do personal, do aluno e do admin (`#/inicio`; troque o perfil no menu do usuário, no rodapé do menu lateral)
- Alunos: lista com busca e filtros, e detalhe do aluno (`#/alunos`)
- Treinos: meus treinos, exercícios e importar planilha em abas (`#/treinos`)
- Criar e editar treino: seções, adicionar exercício, séries, repetições, descanso e ordem (`#/treinos/novo`, `#/treinos/t1`)
- Exercícios: biblioteca em cartões, detalhe e formulário de criar/editar (`#/treinos/exercicios/e01`, `#/treinos/exercicios/novo`)
- Acompanhar: alertas, treinos feitos e questionários em abas (`#/acompanhamento`)
- Mensagens (`#/mensagens`)
- Sugerir treino com IA (`#/ia`)
- Configurações: dados, aparência, avisos, assinatura, privacidade e IA (`#/configuracoes`)
- Recuperar senha (`#/esqueci-senha`, `#/redefinir-senha`) e criar conta de personal (`#/cadastro`)
- Convidar aluno (`#/convidar-aluno`), com vagas do plano e link copiável
- Planos do personal: escolher, cupom e pagamento simulado (`#/planos`); cancelar assinatura (`#/assinatura/cancelar`)
- Meu treino do aluno: execução exercício a exercício, descanso e esforço percebido (`#/treino`)
- Avisos (`#/avisos`) e resposta de questionário (`#/acompanhamento/respostas/s01`)
- Admin: usuários com bloqueio e convite (`#/usuarios`), planos e cupons (`#/planos` no perfil admin)
- Aceitar convite (`#/convite`), selecionar perfil (`#/selecionar-perfil`), termos (`#/termos`) e privacidade (`#/privacidade`)
- Sessão expirada (`#/sessao-expirada`) e manutenção (`#/manutencao`)
- Pausar ou encerrar acompanhamento do aluno (`#/alunos/s01/vinculo`)
- Detalhe do treino feito com retorno (`#/acompanhamento/treinos/x3`)
- Enviar questionário e criar modelo (`#/acompanhamento/questionarios/enviar`, `.../modelo`)
- Importar planilha com revisão (`#/treinos/importar`) e dados usados pela IA (`#/ia/dados`)
- Admin: detalhe do usuário (`#/usuarios/u1`), permissões por perfil (`#/usuarios/permissoes`) e relatório de cupom (`#/planos/cupons/PRO20`)
- Página não encontrada (qualquer rota inexistente)
- Kit de interface: cores e componentes dos dois kits lado a lado (`#/design-system`)

Ainda faltam, do protótipo antigo: histórico de versões do treino, atribuir treino a aluno, visibilidade e personalização de exercício,
responsáveis do aluno, excluir conta e exportar dados, e as variantes de erro de cada tela.

## Como o menu é organizado

- No máximo 5 destinos por perfil, iguais no menu lateral e na barra do celular (`src/lib/nav.ts`).
- Tudo o que é "criar" fica no botão **Novo**.
- Tudo o que é da conta (configurações, assinatura, sair) fica no menu do usuário.
- Subdivisões viram abas dentro da página, guardadas na URL (`?aba=`).
- **Buscar** (Ctrl K) encontra telas, alunos e ações num lugar só.

## Botões

- Um botão principal (vermelho) por tela, sempre com verbo: "Convidar aluno", "Criar treino".
- Ações de apoio usam o secundário (contorno); ações menores, o discreto.
- Botão só com ícone sempre tem dica ao passar o mouse e nome para leitor de tela.

## Aura, a assistente

Botão flutuante com a nuvem do affectUI (`Glow Cloud`), em `src/components/assistant.tsx` e `src/lib/assistant.tsx`.

- Os olhos seguem o ponteiro pela janela; a expressão muda por estado: disponível, sonolenta (sem uso),
  ouvindo, trabalhando e contente ao terminar. Isso foi acrescentado ao arquivo `glow-cloud.tsx` (`mood`, `followWindow`).
- Clicar abre o chat. A conversa é por voz ou texto; **o microfone começa desligado** e só liga quando a pessoa toca no botão.
  Com ele ligado, a Aura ouve (Web Speech API, pt-BR) e responde em voz alta. Fechar o chat desliga o microfone.
- As respostas são de exemplo (função `reply`); em produção, troque pela chamada ao agente.
- Reconhecimento de voz depende do navegador (Chrome e Edge têm; Firefox não). Sem suporte, o chat segue por texto.

## Tema

Tudo em `src/index.css`:

- Tokens no padrão shadcn (`--background`, `--primary`…), claro e escuro (`.dark` no `<html>`).
- Ponte para o affectUI: as variáveis `--aui-*` apontam para os mesmos tokens.
- O botão principal do affectUI foi ajustado para o vermelho da marca.

## Adicionar componentes

shadcn/ui:

```bash
npx shadcn@latest add calendar
```

affectUI gratuito (a pasta separada evita conflito de nomes como `button` e `select`):

```bash
npx shadcn@latest add @affectui/tool-call-card --path src/components/affect
```

Lightswind: os arquivos vêm de `https://lightswind.com/api/registry` (ou `npx lightswind@latest add <nome>`).
Aqui eles foram copiados para `src/components/lightswind` com o import de `cn` apontando para `@/lib/utils`;
o `ai-prompt` foi adaptado (campo controlado, botão de voz) e o `command` usa o diálogo do shadcn.

Itens Pro do affectUI respondem 401 sem a chave de compra (`AFFECTUI_TOKEN`); este protótipo usa só os gratuitos.

Os textos internos dos componentes do affectUI vêm em inglês. Os já instalados foram traduzidos
direto nos arquivos; ao adicionar um item novo, traduza também.
