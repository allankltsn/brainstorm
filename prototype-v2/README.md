# aura-fit · protótipo v2

Protótipo novo em React, criado para avaliar o visual antes do desenvolvimento.
Usa dois kits de interface, com um único tema:

| Kit | Onde fica | Para quê |
| --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com) | `src/components/ui` | Estrutura: menu lateral, tabela, diálogo, menus, gráfico, avisos |
| [affectUI](https://www.affectui.com) (itens gratuitos, MIT) | `src/components/affect` | Formulários e interação: botão, campo, seleção, abas, código de verificação, cartões de IA |

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
- Sugerir treino com IA (`#/ia`)
- Configurações: dados, aparência, avisos (`#/configuracoes`)
- Kit de interface: cores e componentes dos dois kits lado a lado (`#/design-system`)

As demais entradas do menu mostram um aviso de "ainda não migrada".

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

Itens Pro do affectUI respondem 401 sem a chave de compra (`AFFECTUI_TOKEN`); este protótipo usa só os gratuitos.

Os textos internos dos componentes do affectUI vêm em inglês. Os já instalados foram traduzidos
direto nos arquivos; ao adicionar um item novo, traduza também.
