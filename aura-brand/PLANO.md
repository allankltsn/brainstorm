# aura-brand · plano da próxima versão

Plano para desenhar as próximas telas. Parte das cinco ideias do produto, liga cada uma ao que o protótipo já tem e registra as decisões já tomadas.

## A ideia em uma frase

O aura-brand é o lugar onde a empresa **define a marca uma vez** e **tudo o que sai dela usa essa marca**: posts, PDFs, slides, páginas, e-mails e respostas. Em volta disso, o app **sugere o que publicar, encontra clientes, conversa com eles em uma tela só e acompanha cada um até fechar**.

Duas regras valem para tudo:

1. **A marca aprovada é a fonte da verdade.** Nenhum material usa cor, fonte ou tom que não esteja aprovado no brand kit. O protótipo já faz isso no conteúdo (o que falta aprovar sai neutro); a regra passa a valer para PDFs, slides, páginas, campanhas e respostas.
2. **A IA sugere, a pessoa aprova.** Ideias de post, oportunidades, posts, respostas e campanhas passam pela fila "Precisa de você". Só sai sozinho o que já foi aprovado com data marcada (post agendado) ou o que a pessoa escreveu e ligou (automação de texto fixo).

## Decisões tomadas

| Pergunta | Decisão | Consequência no desenho |
|---|---|---|
| Para quem o cliente vende? | **B2C e B2B** | Contato pode ser pessoa ou empresa, e uma empresa tem várias pessoas. A prospecção busca empresas e também sinais de pessoas. |
| Uma pessoa ou equipe? | **Equipe** | Atendimento com responsável, filas por equipe, notas internas com menção e presença de quem está online. **Usuários, papéis e permissões são planejados em outro lugar**: aqui só se assume que existem. |
| Referência do Atendimento | **A imagem enviada**, como estrutura | Quatro colunas: filas, lista, conversa e painel do cliente. Detalhe na seção de Atendimento. |
| Site | **Várias páginas** | Construtor de páginas: site institucional e páginas de campanha, cada uma com endereço e formulários próprios. |
| Mídia dos posts | **Fotos e vídeos da empresa e imagens geradas por IA** | Biblioteca de mídia com as duas origens. E a IA **sugere ideias de post** o tempo todo (nova aba Ideias). |

## As cinco ideias, ligadas ao protótipo

| Ideia | O que já existe no protótipo | O que muda |
|---|---|---|
| 1. Criar a marca e os materiais | Marca: briefing, logo, paleta, tipografia, tom de voz, aprovação por parte | Novas abas **Regras** (manual da marca) e **Materiais** (PDF, slides, páginas) |
| 2. Achar oportunidades com IA | Nada | Nova aba **Oportunidades** em Clientes, com um agente de prospecção |
| 3. Postar em várias redes | Conteúdo: criar, fila, agenda, publicados; 3 redes; prévia genérica | Aba **Ideias**; **TikTok e X**; **versões por rede** com **prévia fiel de cada rede**; criação manual; biblioteca de mídia |
| 4. Captar e atender em todos os canais | Clientes > Captação; Conversas com WhatsApp, Instagram e e-mail | **Atendimento** com todos os canais numa conversa por cliente, filas e equipe |
| 5. Atender e gerir o cliente numa tela | Ficha do contato em painel lateral, separada da conversa | Painel do cliente **ao lado da conversa**, com funil, propostas e histórico |

## Menu (continua com 5 destinos)

```
Início        Hoje (Precisa de você) · Relatórios
Marca         Identidade · Regras · Materiais
Conteúdo      Ideias · Criar · Fila · Agenda · Publicados
Atendimento   Caixa de entrada · Campanhas                         ← hoje "Conversas"
Clientes      Funil · Contatos · Oportunidades · Captação · Automações
```

- **Prospecção fica em Clientes.** Uma oportunidade entra no topo do funil, numa etapa nova **Oportunidade**, antes de **Novo**. O funil mostra o caminho inteiro: achado pela IA → contatado → em conversa → proposta → fechado.
- **Páginas ficam em Marca > Materiais**, porque são material da marca. Os formulários de Clientes > Captação são **blocos que entram nas páginas**.
- **Atendimento junta as ideias 4 e 5.** A gestão da carteira (funil, contatos, propostas) continua em Clientes, e o painel do cliente no Atendimento mostra o essencial dela.

## Modelo de dados (por causa de B2B + B2C)

```
Empresa ──< Pessoa ──< Conversa ──< Mensagem (cada uma com o seu canal)
   │           │
   └──< Negócio (etapa do funil, valor, propostas) >── Pessoa de contato
```

- **Contato** passa a ser **Pessoa**, que pode pertencer a uma **Empresa**. Venda ao consumidor final usa só Pessoa.
- **Negócio** é o que anda no funil (hoje a etapa fica no contato). Uma empresa pode ter mais de um negócio aberto; um cliente B2C costuma ter um.
- **Conversa é por pessoa, não por canal.** Se o cliente escreveu no Instagram e depois no WhatsApp, é a mesma conversa; cada mensagem mostra por onde chegou ("Enviado pelo WhatsApp", como na imagem).

## 1. Marca: identidade, regras e materiais

**Identidade** é o que já existe, com duas evoluções:
- Logo com variações (horizontal, vertical, só o símbolo, versão para fundo escuro) e envio em SVG.
- Uma escala de tons gerada a partir de cada cor, para os materiais terem tons de apoio.

**Regras** (manual da marca), novo:
- Uso do logo: área de proteção, tamanho mínimo, fundos permitidos e proibidos, com exemplos de "assim sim / assim não" gerados a partir do próprio kit.
- Combinações de cor permitidas, com o contraste já calculado (o protótipo já calcula).
- Tom de voz com exemplos por situação: post, resposta a reclamação, e-mail de proposta. É isto que a Aura usa para "Reescrever no tom da marca" no Atendimento.
- Exportar o manual em PDF.

**Materiais**, novo. Cada material é um modelo que lê a marca aprovada:
- **Documento PDF**: proposta comercial, orçamento, catálogo, apresentação da empresa. A proposta criada no Atendimento ou em Clientes sai neste modelo.
- **Slides**: apresentação institucional e de proposta, exportável em PDF e PPTX.
- **Páginas**: várias por empresa. Site institucional (com várias seções) e páginas de campanha (uma oferta, um formulário). Cada página tem endereço próprio, recebe os formulários de Captação e registra a origem de quem preenche, inclusive a campanha que levou até ela.
- **Modelos de post**: os layouts que o Conteúdo usa para montar a arte.

Fluxo: escolher o modelo → a IA preenche com o briefing → a pessoa edita → exporta ou publica. Se uma parte do kit não estiver aprovada, o material avisa.

## 2. Oportunidades: prospecção com IA

**O que é uma oportunidade:** uma empresa ou pessoa que **combina com o cliente ideal** e tem **um sinal de que precisa agora**, sempre com o motivo escrito e a evidência (o link ou o dado que gerou a sugestão).

Três tipos, na ordem de construção:
1. **Na própria base**: clientes que pararam de comprar, propostas sem resposta, quem abriu a campanha mas não respondeu. Não depende de fonte externa nem de consentimento novo.
2. **Sinais públicos de interesse**: posts e comentários públicos pedindo indicação, menções à marca ou a concorrentes. Serve para B2C e B2B.
3. **Empresas que combinam com o perfil** (B2B): empresas da região e do segmento certo, a partir de dados públicos de empresas, mapas e sites.

**Como o agente trabalha:** a pessoa define a **missão** (cliente ideal, região, sinais que importam) e liga as **fontes**, como liga as redes em Configurações. O agente roda todo dia e entrega uma lista curta, com motivo, evidência e quão bem combina. Agentes, plugins e MCP são como as fontes são implementadas; na tela, a pessoa vê "fontes conectadas".

**Fluxo:** a oportunidade aparece em "Precisa de você" e em Clientes > Oportunidades → a pessoa aceita ou descarta (descartar ensina o agente) → a aceita vira Pessoa ou Empresa na etapa Oportunidade, com origem "Prospecção" → a IA sugere a primeira abordagem → alguém da equipe revisa e envia.

**Limites que mudam o desenho:**
- **LGPD.** Prospectar pessoa física exige base legal (em geral, legítimo interesse) e uma forma fácil de sair. Contato vindo de prospecção entra **sem consentimento** e só recebe campanha ou automação depois de dar o aceite (regra que o protótipo já aplica à planilha importada).
- **Termos das plataformas.** Raspar dados de redes sociais costuma violar os termos de uso; a fonte precisa ser uma API oficial ou um dado público permitido.
- **WhatsApp.** A API oficial exige aceite prévio; abordagem fria pelo WhatsApp arrisca bloquear o número. A primeira abordagem de prospecção é por e-mail corporativo ou mensagem manual.

## 3. Conteúdo: ideias, cinco redes e prévia fiel

### Ideias (aba nova)

A IA sugere ideias de post o tempo todo, adaptadas ao nicho, ao público e ao tom de voz da empresa. Cada ideia tem título, por que agora, para quais redes e um rascunho de abordagem.

| Fonte da ideia | Exemplo para uma cafeteria |
|---|---|
| Datas comemorativas e feriados (nacionais e regionais) | Dia das Mães: kit presente com café e caneca |
| Datas do nicho | O dia do café: bastidores da torra |
| Épocas do ano | Inverno: bebidas quentes; Black Friday; fim de ano |
| Tendências virais | Um formato de vídeo em alta, refeito com os produtos da casa |
| Assuntos e personalidades em evidência | O tema do momento, comentado no tom da marca |
| A própria empresa | Post de melhor desempenho do mês, para repetir o formato |

Onde aparecem:
- Na aba **Ideias**, numa linha do tempo das próximas semanas.
- No **calendário da Agenda**, as datas especiais aparecem marcadas antes de terem post.
- Em **"Precisa de você"**, um resumo semanal ("3 datas nas próximas 2 semanas e nada agendado").

Fluxo: ideia → "Criar post" já preenchido → versões por rede → fila → agenda.

Cuidados que entram no desenho:
- **Tendências precisam de fonte de dados** (ferramentas de tendência das redes e de busca). Sem fonte conectada, a aba mostra só datas e épocas.
- **Personalidades e marcas de terceiros:** usar nome, rosto ou voz de uma pessoa famosa em post comercial esbarra em direito de imagem. A IA sugere o **formato** ou o **assunto**, nunca a imagem da pessoa, e avisa quando a ideia cita alguém.
- **Músicas em alta:** contas comerciais costumam ter acesso restrito às músicas das redes. A ideia indica "use uma música liberada para empresas".

### Criar e publicar

- **Um post, várias versões.** Ao criar, a pessoa marca as redes (LinkedIn, Instagram, Facebook, TikTok, X). O app gera uma versão por rede, com os limites de cada uma: tamanho do texto, formato da imagem (quadrado, 4:5, 9:16), hashtags, vídeo obrigatório no TikTok. Cada versão pode ser ajustada sem mexer nas outras.
- **Prévia de cada rede.** Ao lado do editor, uma aba por rede mostra o post como aparece no feed dela: cabeçalho com nome e foto do perfil, corte da imagem, texto cortado no "ver mais", contador de caracteres. O `PostPreview` atual vira um componente por rede.
- **Criar com IA ou à mão.** Entra o caminho manual: escrever, escolher da biblioteca de mídia, aplicar um modelo de arte da marca.
- **Biblioteca de mídia.** Fotos e vídeos enviados pela empresa e imagens geradas por IA a partir do brand kit, com a origem marcada em cada item.
- **Publicação automática na data.** O estado já está desenhado (agendado → publicado ou não publicado, com o motivo e o caminho para resolver). Na versão real, um agendador no servidor publica pela API de cada rede.

Restrições a confirmar antes de prometer: cada rede exige aprovação do app para publicar em nome de terceiros (Meta, TikTok e LinkedIn têm processos de revisão), o Instagram só publica em contas profissionais e a escrita na API do X é paga.

## 4 e 5. Atendimento

Estrutura da imagem de referência, adaptada ao aura-brand:

```
┌──────────────┬───────────────────┬──────────────────────────┬────────────────────┐
│ Filas        │ Conversas         │ Conversa                 │ Cliente            │
│              │ [Todas ▾] Filtros │ ⏸ Aguardando  [Resolver] │ Rosa Braun         │
│ Todas        │                   │                          │ Café Aurora (B2B)  │
│ Minhas       │ Rosa > Lia     ●  │ ○ cliente · Instagram    │ [Abrir ficha]      │
│ Sem resp.    │ Recebi o pedido…  │      ● equipe · WhatsApp │                    │
│ ──────────── │                   │ ┌ nota interna ───────┐  │ Responsável  Lia ▾ │
│ Vendas       │ Ronaldo > Cadu ●  │ │ @Cadu confirma o    │  │ Funil              │
│ Suporte      │ Apaguei sem que…  │ │ valor?              │  │  Proposta · R$ 2,4k│
│ Pós-venda    │                   │ └─────────────────────┘  │  [Mudar etapa]     │
│ ──────────── │ …                 │ ◷ Lembrete: ligar 15h    │ Origem             │
│ Por canal    │                   │                          │  Página: Café p/   │
│ Arquivadas   │                   │      [Ver resumo da IA]  │  empresas          │
│              │                   │ Responder│Nota│Lembrete  │ Consentimento ✓    │
│              │ (equipe online)   │ Respostas prontas│Aura ▾ │ Etiquetas          │
│              │                   │ [texto]   Canal▾ [Enviar]│ Dados · Histórico  │
└──────────────┴───────────────────┴──────────────────────────┴────────────────────┘
```

No desktop, o menu principal do app recolhe para ícones nesta tela, para caber as quatro colunas. No celular, é uma coluna por vez: filas → lista → conversa, com o painel do cliente abrindo por cima.

**Coluna 1 · Filas** (na imagem, as caixas de entrada):
- Todas, Atribuídas a mim, Sem responsável.
- Uma fila por equipe (Vendas, Suporte, Pós-venda), que a empresa cria. As regras de qual conversa vai para qual fila ficam em Configurações; quem pode ver cada fila é assunto do planejamento de permissões.
- Por canal; Arquivadas e Spam.

**Coluna 2 · Lista de conversas:**
- Foto, nome, responsável ("Rosa > Lia"), início da última mensagem e o ícone do canal (no lugar da bandeira da imagem: para nós, o canal importa mais que o país).
- Estado com texto e cor: aberta, aguardando cliente, resolvida, **atrasada** (passou do tempo de resposta).
- Filtros: canal, responsável, etiqueta, etapa do funil. Botão "+" para iniciar conversa.
- Rodapé com quem da equipe está online.

**Coluna 3 · Conversa:**
- **Uma linha do tempo por cliente**, juntando os canais; cada mensagem mostra o canal e a confirmação de leitura.
- **Nota interna** com menção a colegas (fundo amarelo, só a equipe vê), **lembrete** ("ligar às 15h") e eventos do cliente (preencheu formulário, mudou de etapa, recebeu campanha) aparecem na mesma linha do tempo.
- Anexos, inclusive materiais da marca (proposta em PDF, catálogo, slides).
- **Resumo da IA** da conversa, para quem assume no meio.
- **Abas do campo de resposta:** Responder · Nota · Lembrete · Respostas prontas · Aura.
- **Aura** (na imagem, MagicReply): Sugerir resposta, Expandir, Encurtar, **Reescrever no tom da marca**, Corrigir. A sugestão vai para o campo; quem envia é a pessoa.
- **Canal da resposta:** por padrão, o último canal que o cliente usou, com troca no seletor. Se a janela do WhatsApp estiver fechada (o cliente não escreve há mais de 24 horas), o campo avisa e oferece só modelos aprovados de mensagem.
- No topo: estado da conversa (aguardando, resolver) e ações rápidas (mudar etapa, criar proposta, bloquear). Ligação e vídeo ficam fora desta versão.

**Coluna 4 · Painel do cliente** (o que é "gestão do cliente" dentro do atendimento):
- Cabeçalho: nome, empresa (quando B2B), e-mail, telefone, cidade e hora local. Botão "Abrir ficha completa" leva a Clientes.
- **Responsável** (na imagem, "Conversation Routing").
- **Funil**: negócio aberto, etapa, valor, propostas; mudar etapa e criar proposta sem sair da tela. É o que a imagem não tem e o aura-brand precisa.
- **Origem**: por onde chegou (post, página, formulário, prospecção, indicação).
- **Consentimento** (LGPD) e preferências de canal.
- **Etiquetas** (na imagem, "Segments").
- **Dados personalizados** em chave e valor (na imagem, "Visitor data").
- **Histórico**: conversas anteriores, campanhas recebidas, compras.
- O bloco "dispositivo" da imagem só aparece quando o cliente veio pelo chat de uma página.

**Canais:** WhatsApp, Instagram (direct e comentários), Facebook (Messenger e comentários), e-mail, formulários e chat das páginas, TikTok e X (comentários). Comentário em post vira mensagem na conversa do cliente, com o link do post. As mensagens privadas do LinkedIn provavelmente não têm API aberta para esse uso: LinkedIn entra com comentários da página da empresa, a confirmar.

**Campanhas** continuam como aba do Atendimento, como no protótipo.

## Ordem sugerida para desenhar

1. **Atendimento** em quatro colunas. Tela de uso diário da equipe; junta duas telas que já existem.
2. **Conteúdo: Ideias e multi-rede** com versões e prévias por rede.
3. **Oportunidades**, começando pelo tipo 1 (a própria base).
4. **Marca: Materiais e Regras**: PDF e slides primeiro, depois o construtor de páginas, que é o maior.

O modelo de dados (Empresa, Pessoa, Negócio, conversa por pessoa) entra junto com o Atendimento, porque a tela já depende dele.

## Fora deste plano

- Usuários, papéis, permissões e gestão da equipe: planejados em outro lugar. Aqui só se assume que a equipe existe e que cada conversa tem um responsável.
- Ligação e vídeo no atendimento.
- Cobrança e planos.
