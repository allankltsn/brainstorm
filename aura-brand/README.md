# aura-brand · protótipo

Protótipo em React da plataforma de marca. O escopo e as decisões estão em [`PRODUTO.md`](./PRODUTO.md).
Parte do kit de `../prototype-v2` (shell, tokens, shadcn/ui, affectUI e Lightswind), com o roxo `#6A0DAD` no lugar do vermelho.

## Rodar

```bash
npm install
```

```bash
npm run dev
```

`npm run build` gera `dist/`, que é estático e abre em qualquer hospedagem.

## Telas

- **Início** (`#/inicio`): fila "Precisa de você" com rascunhos para revisar e aprovar, andamento do brand kit, leads e créditos de IA.
- **Marca** (`#/marca`): o brand kit, em abas guardadas na URL (`?aba=`):
  - Briefing guiado (5 respostas) que gera a sugestão do kit;
  - Logo: três estilos sugeridos ou envio do logo próprio;
  - Paleta: cinco cores editáveis, "Sugerir outra" e verificação de contraste;
  - Tipografia: pares de fontes com prévia;
  - Tom de voz: personalidade, formalidade, regras e frase de exemplo;
  - Visão geral: andamento e prévia de um post com o kit aplicado.
- Entrar, Configurações e Kit de interface vieram do `prototype-v2`, com os textos adaptados.
- Conteúdo, Clientes e Conversas ainda mostram "ainda não foi construída".

## Regras do brand kit

- A IA só sugere. Cada parte do kit começa como "falta aprovar" e só vale depois de aprovada.
- Editar uma parte aprovada devolve para "falta aprovar".
- O kit fica guardado no aparelho (`localStorage`, chave `aura-brand-kit`); o logo enviado não é guardado.

## O que é simulado

- A sugestão do kit (`suggestFrom` em `src/lib/brand.tsx`) e as respostas da Aura (`reply` em `src/lib/assistant.tsx`) são de exemplo. Em produção, viram chamadas ao agente.
- Os logos são desenhados em SVG a partir do nome e da paleta.
- Só a fonte Geist está instalada; os outros pares de tipografia usam fontes do aparelho.
- Todos os dados (`src/lib/data.ts`) são fictícios.

## Tema

Tudo em `src/index.css`: tokens no padrão shadcn (claro e `.dark`), ponte `--aui-*` para o affectUI, botão principal e nuvem da Aura em roxo.
As cores em `PALETTES` (`src/lib/brand.tsx`) são dados da marca do cliente, não tokens da interface.
