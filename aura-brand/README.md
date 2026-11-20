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
- **Conteúdo** (`#/conteudo`): gerador de conteúdo, agenda e publicação, em quatro abas:
  - Criar: formato (post ou carrossel), rede, objetivo e assunto geram um rascunho;
  - Fila de aprovação: editar título, legenda, hashtags, telas do carrossel e data, com prévia ao lado; "Criar outra versão", "Descartar" e "Aprovar e agendar";
  - Agenda: calendário do mês (no celular, só a lista), próximos posts, avisos de rede não conectada e o que não foi publicado, com "Publicar agora";
  - Publicados: o que já saiu, do mais recente ao mais antigo.
- **Redes** (`#/configuracoes?aba=redes`): conectar e desconectar Instagram, Facebook e LinkedIn, com o estado de cada conexão.
- **Clientes** (`#/clientes`): captação e funil, em quatro abas:
  - Funil: colunas por etapa (Novo, Em conversa, Proposta, Fechado) com os **negócios** e o total em reais; a etapa muda por um seletor em cada cartão; perdidos ficam numa lista à parte;
  - Contatos: pessoas, com a empresa quando é venda B2B; busca, filtro por origem, adicionar contato (com empresa e cargo opcionais) e importar planilha CSV (nome, e-mail, telefone);
  - Captação: formulários e páginas de captura com visitas, contatos e conversão; o editor mostra a prévia com as cores da marca, e enviar a prévia cria um contato de verdade no funil;
  - Automações: mensagens de texto fixo por etapa, com liga e desliga.
  - A ficha do contato (painel lateral) traz empresa, negócios com propostas, consentimento, anotações e o atalho para o atendimento.
- **Atendimento** (`#/atendimento`; o antigo `#/conversas` redireciona): todos os canais numa tela, com a estrutura da referência enviada:
  - quatro colunas a partir de 1400px (filas, conversas, conversa, cliente); três a partir de 1280px (a fila vira um seletor); duas a partir de 1024px (o cliente abre num painel); uma por vez no celular. O menu do app recolhe para ícones nesta tela;
  - filas: todas, atribuídas a mim, sem responsável, atrasadas, por equipe, por canal e resolvidas;
  - uma conversa por cliente, juntando WhatsApp, Instagram, Facebook, e-mail, chat do site, TikTok e X; cada mensagem mostra o canal, quem respondeu e a leitura;
  - notas internas com menção, lembretes, eventos do cliente (formulário, mudança de etapa, campanha recebida) e resumo da Aura na mesma linha do tempo;
  - campo de resposta com Responder, Nota e Lembrete, respostas prontas, Aura (sugerir, reescrever no tom da marca, expandir, encurtar, corrigir), escolha do canal e anexo de material da marca; aviso da janela de 24 horas do WhatsApp com envio só de modelo;
  - painel do cliente: responsável, fila, negócios com etapa e propostas, origem, consentimento, etiquetas, dados personalizados e histórico;
  - Campanhas continuam como aba do Atendimento.
- **Relatórios** (`#/inicio?aba=relatorios`): painel da marca por período (7, 30 ou 90 dias): contatos novos, taxa de fechamento, valores, funil, origem dos contatos, conteúdo, campanhas e créditos de IA por recurso, com download das origens em CSV.
- Entrar, Configurações e Kit de interface vieram do `prototype-v2`, com os textos adaptados.

## Regras do brand kit

- A IA só sugere. Cada parte do kit começa como "falta aprovar" e só vale depois de aprovada.
- Editar uma parte aprovada devolve para "falta aprovar".
- O kit fica guardado no aparelho (`localStorage`, chave `aura-brand-kit`); o logo enviado não é guardado.

## Regras do conteúdo

- Nada é agendado sem aprovação. Rascunho novo sempre entra na fila.
- A Aura só usa as partes do kit que foram aprovadas. O que falta aprovar sai neutro (cores em grafite, fonte padrão, tom equilibrado), e a tela avisa.
- A fila é uma só: aparece em Conteúdo, no Início ("Precisa de você") e no número do menu.
- Um post tem quatro estados: na fila, agendado, publicado e não publicado. O que não foi publicado aparece primeiro no Início e na Agenda, com o motivo.
- Dá para agendar um post de uma rede não conectada, mas a tela avisa que ele não sai. "Publicar agora" com a rede desconectada não muda nada e leva até Redes.
- Post agendado ou publicado não é editável; para editar, ele volta para a fila e precisa de nova aprovação.
- Rascunhos e conexões ficam no aparelho (`localStorage`, chaves `aura-brand-content-2` e `aura-brand-networks`).

## Regras de clientes e atendimento

- Modelo: Empresa tem Pessoas; cada Pessoa tem uma conversa (todos os canais juntos) e um ou mais Negócios, que andam no funil e recebem propostas. Venda ao consumidor final usa só Pessoa.
- Conversa atrasada: aberta, com a última mensagem do cliente há mais de 30 minutos. Responder deixa a conversa "aguardando cliente" e atribui a quem respondeu, se não tinha responsável.
- A resposta sai pelo último canal que o cliente usou, com troca no seletor. No WhatsApp, passadas 24 horas da última mensagem do cliente, só dá para enviar modelo aprovado.
- Usuários, papéis e permissões estão fora deste protótipo: a equipe (Helena, Lia, Cadu, Rafa) é fixa e só serve para responsável, menções e presença.

- Todo contato guarda a origem (rede, formulário, indicação, planilha ou cadastro à mão).
- Consentimento (LGPD): quem não aceitou receber mensagens fica fora de campanhas e automações, e a tela mostra quantos ficaram de fora. Responder a uma mensagem do próprio contato continua permitido. Contatos importados de planilha entram sem consentimento.
- Automações têm texto fixo escrito pelo dono, não pela IA. Rodam quando o contato entra na etapa e a mensagem aparece na conversa, marcada como automação.
- Enviar uma proposta leva o contato para Proposta; marcar como aceita, para Fechado. Responder um contato novo leva para Em conversa.
- A Aura sugere respostas e textos de campanha, mas nada sai sem revisão: a sugestão vai para o campo de texto e quem envia é o dono. "Enviar agora" numa campanha pede confirmação.
- Limite do plano: 500 contatos; a importação recusa a planilha que passar disso.
- Tudo fica no aparelho (`localStorage`, chave `aura-brand-crm-2`).

## O que é simulado

- Os rascunhos (`draftFrom` em `src/lib/content.tsx`) saem de modelos de texto, não de IA. Nada é enviado a rede nenhuma: conectar uma rede e publicar só mudam o estado no aparelho. O relógio do protótipo é fixo (11/11/2026, 10h), então um post agendado não sai sozinho no horário; use "Publicar agora".

- A sugestão do kit (`suggestFrom` em `src/lib/brand.tsx`) e as respostas da Aura (`reply` em `src/lib/assistant.tsx`) são de exemplo. Em produção, viram chamadas ao agente.
- Os logos são desenhados em SVG a partir do nome e da paleta.
- Só a fonte Geist está instalada; os outros pares de tipografia usam fontes do aparelho.
- Nenhuma mensagem ou campanha é enviada de verdade, e nenhuma chega: o atendimento só tem as conversas de exemplo. O resumo e as ações da Aura no texto são regras simples, não IA. Os números de visitas dos formulários e de abertura das campanhas de exemplo são fixos; uma campanha enviada no protótipo fica em "aguardando".
- Os relatórios são calculados a partir dos dados de exemplo do app. Os créditos de IA são um número fixo, que não diminui com o uso.
- Todos os dados (`src/lib/data.ts`, `src/lib/crm.tsx`, `src/lib/content.tsx`) são fictícios.

## Tema

Tudo em `src/index.css`: tokens no padrão shadcn (claro e `.dark`), ponte `--aui-*` para o affectUI, botão principal e nuvem da Aura em roxo.
As cores em `PALETTES` (`src/lib/brand.tsx`) são dados da marca do cliente, não tokens da interface.
