# aura-brand · plano da próxima versão

Proposta para discutir antes de desenhar as telas. Parte das cinco ideias do produto e liga cada uma ao que o protótipo já tem.

## A ideia em uma frase

O aura-brand é o lugar onde a empresa **define a marca uma vez** e **tudo o que sai dela usa essa marca**: posts, PDFs, slides, site, e-mails e respostas. Em volta disso, o app **encontra clientes, fala com eles e acompanha cada um até fechar**.

Duas regras valem para tudo:

1. **A marca aprovada é a fonte da verdade.** Nenhum material usa cor, fonte ou tom que não esteja aprovado no brand kit. O protótipo já faz isso no conteúdo (o que falta aprovar sai neutro); a regra passa a valer para PDFs, slides, site e campanhas.
2. **A IA sugere, a pessoa aprova.** Oportunidades, posts, respostas e campanhas passam pela fila "Precisa de você". A única coisa que sai sozinha é o que já foi aprovado com data marcada (post agendado) ou o que a pessoa escreveu e ligou (automação de texto fixo).

## As cinco ideias, ligadas ao protótipo

| Ideia | O que já existe no protótipo | O que muda |
|---|---|---|
| 1. Criar a marca e os materiais | Marca: briefing, logo, paleta, tipografia, tom de voz, aprovação por parte | Novas abas **Regras** (manual da marca) e **Materiais** (PDF, slides, site) |
| 2. Achar oportunidades com IA | Nada | Nova aba **Oportunidades** em Clientes, com um agente de prospecção |
| 3. Postar em várias redes | Conteúdo: criar, fila, agenda com calendário, publicados; Instagram, Facebook e LinkedIn; uma prévia genérica | **TikTok e X**; um post vira **versões por rede**; **prévia fiel de cada rede**; criação manual e biblioteca de mídia |
| 4. Captar leads e atender em todos os canais | Clientes > Captação; Conversas: caixa de entrada com WhatsApp, Instagram e e-mail | Caixa com **todos os canais** (inclui comentários e formulários); atribuição para a equipe |
| 5. Atender e gerir o cliente numa tela | Ficha do contato em painel lateral; conversa em outra tela, ligadas por botão | Tela **Atendimento** em três colunas: lista, conversa e ficha do cliente ao lado |

## Menu proposto (continua com 5 destinos)

As cinco ideias cabem nos cinco destinos que já existem; muda o nome de um e entram abas novas.

```
Início        Hoje (Precisa de você) · Relatórios
Marca         Identidade · Regras · Materiais
Conteúdo      Criar · Fila · Agenda · Publicados
Atendimento   Caixa de entrada (com a ficha ao lado) · Campanhas      ← hoje "Conversas"
Clientes      Funil · Contatos · Oportunidades · Captação · Automações
```

Por que assim:

- **Prospecção fica em Clientes, não num destino próprio.** Uma oportunidade é um cliente que ainda não sabe que você existe. Ela entra no topo do funil, numa etapa nova **Oportunidade**, antes de **Novo**. Assim o funil mostra o caminho inteiro: achado pela IA → contatado → em conversa → proposta → fechado.
- **Site e landing page ficam em Marca > Materiais**, porque são material da marca. Os formulários de captação continuam em Clientes > Captação e são **blocos que entram no site**. Um construtor de páginas só, para o site da empresa e para as páginas de campanha.
- **Atendimento junta as ideias 4 e 5** numa tela: a conversa no meio e a ficha do cliente ao lado. Gerir a carteira (funil, contatos, propostas) continua em Clientes.

## 1. Marca: identidade, regras e materiais

**Identidade** é o que já existe. Duas evoluções:
- Logo com variações (horizontal, vertical, só o símbolo, versão para fundo escuro) e envio em SVG.
- Cores com papel definido (já existe) e uma escala gerada a partir de cada cor, para os materiais terem tons de apoio.

**Regras** (manual da marca), novo:
- Uso do logo: área de proteção, tamanho mínimo, fundos permitidos e proibidos, com exemplos de "assim sim / assim não" gerados a partir do próprio kit.
- Combinações de cor permitidas, com o contraste já calculado (o protótipo já calcula).
- Tom de voz com exemplos por situação: post, resposta a reclamação, e-mail de proposta.
- Exportar o manual em PDF.

**Materiais**, novo. Cada material é um modelo que lê a marca aprovada:
- **Documento PDF**: proposta comercial, orçamento, apresentação da empresa. Liga com Clientes: a proposta criada na ficha do contato sai neste modelo.
- **Slides**: apresentação institucional e de proposta, exportável em PDF e PPTX.
- **Site / landing page**: página da empresa com seções prontas (sobre, produtos, depoimentos, contato) e o formulário de captação embutido. Publicada num endereço do aura (e, depois, com domínio próprio).
- **Modelos de post**: os layouts que o Conteúdo usa para montar a arte.

Fluxo: escolher o modelo → a IA preenche com o briefing → a pessoa edita → exporta ou publica. Se uma parte do kit não estiver aprovada, o material avisa, como o Conteúdo já faz.

## 2. Oportunidades: prospecção com IA

É a ideia mais nova e a que mais precisa ser afinada antes de desenhar.

**O que é uma oportunidade.** Proposta: uma empresa ou pessoa que **combina com o cliente ideal** e tem **um sinal de que precisa agora**, com o motivo escrito. Três tipos, do mais simples ao mais difícil:

1. **Na própria base**: clientes que pararam de comprar, propostas sem resposta, contatos que abriram a campanha mas não responderam. Usa só dados que o app já tem; não depende de fonte externa nem de consentimento novo. Bom ponto de partida.
2. **Sinais públicos de interesse**: comentários e posts públicos pedindo indicação ("alguém conhece um café para eventos em Pinheiros?"), menções à marca ou a concorrentes.
3. **Empresas que combinam com o perfil** (B2B): empresas da região e do segmento certo, a partir de dados públicos (cadastros de empresas, mapas, sites).

**Como o agente trabalha.** A pessoa define a **missão** (quem é o cliente ideal, região, sinais que importam) e liga as **fontes** (como as redes em Configurações). O agente roda todo dia e entrega uma lista curta, cada item com motivo, evidência (o link ou o dado que gerou a sugestão) e uma nota de quão bem combina. Agentes, plugins e MCP são o jeito de implementar as fontes; na tela, a pessoa vê "fontes conectadas", não a tecnologia.

**Fluxo.** Oportunidade aparece em "Precisa de você" e em Clientes > Oportunidades → a pessoa aceita ou descarta (descartar ensina o agente) → aceita vira contato na etapa Oportunidade, com origem "Prospecção" → a IA sugere a primeira abordagem → a pessoa revisa e envia.

**Limites a respeitar, e que mudam o desenho:**
- **LGPD.** Prospectar pessoa física com dado pessoal exige base legal (em geral, legítimo interesse) e oferecer saída fácil. Contato vindo de prospecção entra **sem consentimento**: não recebe campanha nem automação até dar o aceite. O protótipo já tem essa regra para planilha importada.
- **Termos das plataformas.** Raspar dados de redes como LinkedIn e Instagram costuma violar os termos de uso; a fonte precisa ser uma API oficial ou dado público permitido.
- **WhatsApp.** A API oficial exige que a pessoa tenha aceitado receber mensagem; abordagem fria pelo WhatsApp arrisca bloquear o número da empresa. A primeira abordagem de prospecção deveria ser por e-mail corporativo ou mensagem manual.

## 3. Conteúdo em cinco redes, com prévia fiel

O que muda em relação ao protótipo:

- **Um post, várias versões.** Ao criar, a pessoa marca as redes (LinkedIn, Instagram, Facebook, TikTok, X). O app gera uma versão por rede, com os limites de cada uma: tamanho do texto, formato da imagem (quadrado, 4:5, 9:16), número de hashtags, vídeo obrigatório no TikTok. A pessoa pode ajustar cada versão sem mexer nas outras.
- **Prévia de cada rede.** Ao lado do editor, uma aba por rede mostra o post como ele aparece no feed daquela rede: cabeçalho com nome e foto do perfil, corte da imagem, texto cortado no "ver mais", contador de caracteres. Reaproveita o `PostPreview` atual, que vira um componente por rede.
- **Criar com IA ou à mão.** Hoje só existe "Criar rascunho" com IA. Entra o caminho manual: escrever, subir foto ou vídeo, escolher um modelo de arte da marca.
- **Biblioteca de mídia.** Fotos e vídeos da empresa, para usar nos posts e nos materiais. Sem isso, TikTok e Instagram ficam limitados a arte com texto.
- **Publicação automática na data.** Já está desenhada (agendado → publicado ou não publicado, com o motivo e o caminho para resolver). Na versão real, um agendador no servidor publica pela API de cada rede.

Restrições de API a confirmar antes de prometer a funcionalidade: cada rede exige aprovação do app para publicar em nome de terceiros (Meta, TikTok e LinkedIn têm processos de revisão), o Instagram só publica em contas profissionais, e o acesso de escrita à API do X é pago.

## 4 e 5. Atendimento: uma tela para todos os canais

O protótipo já tem a caixa de entrada unificada e a ficha do contato. A proposta é juntar as duas:

```
┌──────────────┬───────────────────────────┬──────────────────┐
│ Conversas    │ Conversa                  │ Cliente          │
│ filtros:     │                           │ etapa · valor    │
│ canal,       │ mensagens de qualquer     │ origem           │
│ responsável, │ canal, em ordem           │ consentimento    │
│ status       │                           │ propostas        │
│              │ sugestão da Aura          │ anotações        │
│ sem resposta │ [resposta]   [Enviar]     │ histórico        │
│ primeiro     │                           │ próximos passos  │
└──────────────┴───────────────────────────┴──────────────────┘
```

O que entra além do que já existe:
- **Canais**: WhatsApp, Instagram (direct e comentários), Facebook (Messenger e comentários), e-mail, formulários do site, TikTok e X (comentários). Comentário em post vira conversa, ligada ao post de origem.
- **Equipe**: atribuir a conversa a uma pessoa, status (aberta, aguardando cliente, resolvida) e tempo sem resposta.
- **Respostas prontas** escritas pela empresa, além da sugestão da Aura.
- **Ações sem sair da tela**: mudar a etapa, criar proposta (no modelo de PDF da marca), agendar retorno.

Restrição a confirmar: as mensagens privadas do LinkedIn não têm API aberta para esse uso; LinkedIn provavelmente entra só com comentários da página da empresa.

## Ordem sugerida para desenhar

1. **Atendimento em três colunas.** Junta duas telas que já existem; é a tela de uso diário.
2. **Conteúdo multi-rede** com versões e prévias por rede. Evolui o que já funciona.
3. **Oportunidades** (começando pelo tipo 1, a própria base, que não depende de fonte externa).
4. **Marca > Materiais e Regras** (PDF e slides primeiro; o site é o maior dos três).

## Decisões em aberto

1. **Para quem vende o cliente do aura-brand?** Só para consumidor final (B2C), ou também para outras empresas (B2B)? A prospecção do tipo 3 só faz sentido para B2B; para B2C, ela se resume à própria base e a sinais públicos.
2. **Uma pessoa ou uma equipe?** Se houver equipe, atribuição e permissões entram já na primeira versão do Atendimento.
3. **Qual é a tela "desenhada" de atendimento** que deve servir de referência?
4. **Site: um por empresa ou várias páginas?** A proposta é um construtor só para as duas coisas.
5. **Mídia dos posts:** só fotos e vídeos enviados pela empresa, ou também imagem gerada por IA? O TikTok exige vídeo.
