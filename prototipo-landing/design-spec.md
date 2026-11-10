# Design spec: landing aura-fit (prototipo, 2026-10-31)

Fontes: `../tokens.json`, `../components.md`, `conteudo.md`. Status: DEMONSTRATIVO ([MOCK] / [a confirmar] sempre em texto). Sem libs, sem CDN: HTML + CSS + JS puro. Animar so `transform` e `opacity`.

## 0. Tokens e deltas

Cores: sempre via custom properties `--c-*` espelhando `tokens.json` (claro/escuro definidos juntos; escuro por `.dark` em `<html>` e `prefers-color-scheme` quando sem escolha). Nenhum hex fora do bloco de tokens da folha de estilo.

| Uso | Token | Claro / Escuro |
|---|---|---|
| Fundo pagina / secao alternada | bg / surface-2 | #f5f5f5 / #141414 ; #efefef / #2a2a2a |
| Cartao | surface | #fff / #1f1f1f |
| Texto principal | ink | #1f1f1f / #f5f5f5 |
| Texto secundario | muted | #5c5c5c / #b0b0b0 (so sobre fundo escuro; nunca #b0b0b0 sobre claro) |
| Texto terciario/legal | faint | #666 / #999 (nunca abaixo disso) |
| Acao | primary / hover / press | #b1111b #960f17 #7b0c13 / #d0202b #d8323c #b1111b |
| Texto vermelho (links, eyebrow) | accent-text | #b1111b / #ff6f78 |
| Fundo suave destaque (Pro) | primary-soft, primary-line | #fbe8e9 #ecb4b8 / #451b1e #7a1a21 |
| Bordas | line, line-strong | decorativas apenas; borda de controle usa faint (3:1) |
| Status "em avaliacao" | warning-bg / warning-text | #fdf0cc #855800 / #3e341a #f1b93a |
| Contras (lista) | danger-text | #b42318 / #ff8a80 |
| Pros (lista) | success-text | #137a3d / #52d88a |

Contraste conferido por calculo: ink/surface, muted/bg, faint/bg, on-primary/primary (claro 7,6:1; escuro ~5,3:1), accent-text/bg nos dois temas ficam >= 4,5:1.

Tipografia: Inter (fallback system-ui, sans-serif), pesos 400/500/600/700, `font-display: swap`; sem CDN: usar Inter local se existir em `assets/` do prototipo, senao a pilha do sistema (ver pendencia D-L1). Escala do `tokens.json` para corpo e UI; a landing precisa de display maior que 32px, entao ha um **delta proposto** (escala "marketing", fluida, so nesta pagina):

| Papel | 1440 | 390 | Peso / entrelinha |
|---|---|---|---|
| hero-h1 | 56 / 60 | 34 / 40 | 700 / 1.1 ; tracking -0.02em |
| h2 | 40 / 48 | 26 / 34 (heading-lg) | 700 |
| h3 | 22 / 30 (heading-md) | 20 / 28 | 700 |
| sub/lead | 20 / 30 | 16 / 26 | 400, muted |
| body | 16 / 26 | 16 / 26 | 400 (nao usar 14px em texto corrido: leitura) |
| label/eyebrow | 12 / 18 caixa-alta 0.08em, 600 | idem | accent-text |
| caption/legal | 14 / 22 (minimo) | 14 / 22 | faint |
| botao | 15 / 20 (lg) , 600 | 15 / 20 | |

Implementacao fluida sugerida: `clamp(34px, 2.2rem + 1.6vw, 56px)` para h1; h2 `clamp(26px, 1.4rem + 1.1vw, 40px)`.

Espacamento (grade 4px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Secao: padding vertical 96 (1440) / 56 (390). Raio: cartoes 12 (lg), botoes 10 (md), chips/inputs 8 (sm). Sombra: elev-1 repouso, elev-2 hover, elev-3 so no destaque Pro em hover (cor da sombra derivada de `--shadow-rgb`).

Movimento (tokens novos, delta proposto):
- `--dur-fast 150ms`, `--dur-base 240ms`, `--dur-slow 480ms`, `--dur-reveal 640ms`.
- `--ease-out cubic-bezier(.22,1,.36,1)` (entradas, hover), `--ease-in-out cubic-bezier(.65,0,.35,1)` (trocas), `--ease-spring-soft cubic-bezier(.34,1.3,.64,1)` (so botao pressionado/soltar, sobreposicao <= 4%).

## 1. Layout por secao

Container: max 1200px, centrado, lateral 48px (1440) / 20px (390). Grid 12 colunas, gap 24 (1440) / 16 (390). Breakpoints: 390 (base, mobile-first), 640, 960, 1280. Matriz de verificacao: 390, 768, 1024, 1440, 1920 (container nao passa de 1200).

**Faixa fixa [MOCK] (topo).** `position: sticky; top:0; z 50`; altura 40 (1440) / ate 3 linhas em 390 (min 40). Fundo `ink` no claro e `surface-2` no escuro; texto `bg`/`ink` 14px 500 com prefixo "[MOCK]" em texto; sem fechar (obrigatoria). Reservar altura via `--banner-h` para sticky do menu: CLS zero.

**Menu.** Sticky abaixo da faixa, altura 64 (1440) / 56 (390). Logo a esquerda, links (Recursos, Planos, Comparativo, FAQ) e botao "Comecar gratis" a direita; seletor de tema (botao 44x44). Em 390: links viram botao "Menu" com painel (disclosure), alvo 44. Fundo `surface` com 0.92 de opacidade + borda inferior `line`.

**1. Hero (revisado em 2026-11-03).** Zona escura fixa (`.zone`, tokens do tema escuro em ambos os temas). Foto full-bleed (foto-hero.jpg) a direita (62% da largura em 1440, topo da seção em 390), com degradê da cor `bg` escura sobre a foto: >= .78 de opacidade atrás de todo texto (AA conferido por cálculo; QA confere no navegador). H1 editorial `clamp(40px, 6.2vw, 92px)`, peso 800, tracking -.04em, max 12ch, revelado palavra a palavra. Tela de celular (app-treino.png) flutuante no canto inferior direito (só >= 960px). Dois anéis decorativos de borda. 390: foto no topo (altura `clamp(340px, 92vw, 560px)`) esvanecendo para o fundo sólido, texto abaixo, CTAs empilhados. Altura mínima `clamp(640px, 92svh, 940px)` independente de JS (CLS 0).

**1b. Faixa rolando.** Duas linhas de texto grande em movimento oposto (42s e 56s, `translate3d`), grupos duplicados (`aria-hidden`), pausa em hover e botão "Pausar animações decorativas" (44px, `aria-pressed`). Sem JS ou reduced-motion: sem movimento, grupos quebram em linhas, segunda linha oculta.

**1c. Frase grande sobre foto (manifesto).** Banda escura com cantos de 40px (>= 960), foto foto-faixa.jpg com overlay >= .85 sob o texto, h2 `display--md`; palavras acendem (opacidade .55 -> 1) conforme a rolagem.

**1d. Telas do app (pinned).** Seção `#telas`: >= 960px e altura >= 560px com movimento, stage `sticky` abaixo do topo e trilho horizontal com 3 telas que se movem com a rolagem (cada tela "segura" 60% do trecho); barra de progresso decorativa. Nos demais casos (mobile, reduced-motion, sem JS): telas empilhadas, ordem alternada.

**1e. Galeria e contadores.** Galeria 3 colunas com deslocamentos parallax distintos (>= 960) e carrossel com snap contido (< 960, `tabindex=0` só quando rola). Contadores: três números grandes em cor `accent-text`, contagem 0 -> valor em 1,4s ao entrar na tela (rotulados [MOCK]).

**2. Problema.** H2 centrado (max 20ch). 3 cartoes: 1440 grid 3 colunas; 390 empilhado. Cartao: padding 24, icone 32 em `primary-soft`, h3, texto muted. Fecho: faixa centrada, lead, borda esquerda 4px `primary` (so decorativa).

**3. Recursos.** 3 blocos principais alternando texto/visual (1440: 6+6 colunas, inverte a cada bloco, gap 64 entre blocos; 390: texto, visual, sempre nessa ordem). Visual: mini-interface SVG em cartao razao 4:3. Bullets com icone check (success-text) 16px; nota em caption faint com borda `line`. 3.4: grid 2 colunas (1440) / 1 (390), cartoes menores, selo "Em avaliacao" (warning-bg/warning-text, icone + texto; nunca so cor) e frase "ainda nao e compromisso de entrega".

**4. Como funciona.** Fundo surface-2. 1440: 3 colunas com linha conectora horizontal (2px `line-strong`) atras dos numeros; 390: vertical, linha a esquerda. Numero em circulo 44 `primary`/`on-primary`. CTA centrado abaixo.

**5. Planos.** H2 + sub centrados. Seletor de periodo: controle segmentado (radiogroup) centrado, altura 48, 3 opcoes min 44 de largura (1440: ~120 cada; 390: largura total, 3 colunas iguais); texto "Mensal | Trimestral | Anual" + etiqueta de economia em texto ("economize R$ x" calculado pela diferenca aritmetica [MOCK]). 1440: 3 cartoes lado a lado (gap 24), Pro com elevacao: sobe 8px (translateY), borda 2px `primary`, fundo `primary-soft` no cabecalho, selo "Mais popular" (texto, sem numeros). 390: empilhado, ordem Pro, Starter, Premium nao: manter ordem Starter, Pro, Premium para consistencia; Pro com mesmo destaque sem translate. Cartao: cabecalho (nome h3, frase), preco (36 / 44 peso 700, sufixo "/mes" 16 muted), linha de economia, lista de itens (alunos, treinos, IA, suporte) com rotulo e valor, CTA largura total. Abaixo: bloco "Para quem, pros e contras" em 3 colunas (1440) ou disclosure por plano (390); icones + e - com texto "Pros"/"Contras" (nao so cor). Texto legal caption.

Preco: container com altura fixa (`min-height` do maior valor) e `font-variant-numeric: tabular-nums` para CLS zero na troca.

**6. Comparativo.** H2, sub caption faint com aviso. Tabela semantica (`<table>`, `<caption>`, `th scope`) com linha do aura-fit destacada (fundo primary-soft + texto "aura-fit [MOCK]"). 1440: 6 colunas, cabecalho sticky dentro do container. 390: cada linha vira cartao (`td[data-label]`, padrao do components.md `.table-wrap`). Abaixo, 2 colunas Pros/Contras (390: empilhadas), contras com mesma importancia visual dos pros (franqueza).

**7. FAQ.** Coluna unica max 760 centrada. 7 itens, linha 64 min, gap 0 com divisor `line`. 390: igual, padding 16.

**8. CTA final.** Faixa full-width `primary` (claro) / `primary-soft` com borda (escuro, evita brilho excessivo); h2 em on-primary (claro). Botao invertido (fundo `surface`, texto `accent-text`). Rodape: caption, links com sublinhado, [a confirmar] em texto.

## 2. Componentes animados

Regra geral: nada dependente de movimento para entender conteudo; estado final = estado sem JS. Revelacoes usam classe `.is-in` aplicada por `IntersectionObserver` (threshold 0.15, uma vez). Estado inicial oculto apenas quando `html.js-motion` (adicionado por JS se nao houver reduced-motion); sem JS tudo visivel.

| Componente | Estados | Duracao / easing | Gatilho |
|---|---|---|---|
| Hero revelacao | eyebrow, h1, sub, CTAs, ilustracao: `opacity 0->1` + `translateY 16px->0`; atraso escalonado 80ms (max 5 itens, total <= 800ms) | 640ms ease-out | carga (apos fontes/`DOMContentLoaded`) |
| Reveal de secoes | filhos diretos entram com `translateY 20px->0`, `opacity`, stagger 60ms (max 6) | 640ms ease-out | IntersectionObserver |
| Cartao de recurso/problema | repouso elev-1; hover/foco-dentro: `translateY -4px`, elev-2, borda `primary-line`; ativo: `translateY -1px` | 240ms ease-out | `:hover`, `:focus-within`, ponteiro |
| Cartao de plano | igual ao de recurso; Pro: repouso `translateY -8px` (1440) + elev-2; hover Pro: -12px + elev-3; foco: anel 3px | 240ms ease-out | hover/foco |
| Seletor de periodo | indicador (pilula `primary`) desliza com `translateX` e largura fixa por opcao (3 opcoes iguais, nao anima width); `aria-checked` troca; texto ativo on-primary | 240ms ease-in-out | clique, setas, Home/End |
| Troca de preco | valor antigo `opacity 1->0` + `translateY 0->-8px` (120ms), novo `opacity 0->1` + `translateY 8px->0` (200ms), sobrepostos em grid de 1 celula (CLS zero); contador numerico opcional (rAF, 360ms, ease-out) so se sem reduced-motion; regiao com `aria-live="polite"` anuncia "Pro: R$ 134,70 por trimestre [MOCK]" | 320ms total | mudanca do periodo |
| Pros/contras (plano) [REMOVIDO da pagina em 2026-11-03; historico] | 390: disclosure; altura anima por `grid-template-rows 0fr->1fr` (transicao de grid, sem layout shift fora do bloco aberto) com `opacity` | 320ms ease-in-out | clique/Enter/Espaco |
| Comparativo | linhas `opacity/translateY 12px` com stagger 40ms (max 6); linha aura-fit com entrada +120ms; hover de linha (1440): fundo `surface-2` via `opacity` de pseudo-elemento | 400ms ease-out | IntersectionObserver / hover |
| FAQ acordeao | `<button aria-expanded aria-controls>` + painel `role="region"`; abre com `grid-template-rows 0fr->1fr` + `opacity 0->1`; icone "+" gira 45 graus (transform); um aberto por vez e opcional (permitir varios, padrao) | 320ms ease-in-out | clique, Enter, Espaco; setas cima/baixo e Home/End entre itens |
| CTA / botoes | repouso; hover: fundo `primary-hover`, `translateY -1px`; ativo: `primary-press`, `scale .98` (spring-soft); foco: anel; `:disabled` nao usado | 150ms ease-out | hover/foco/pressao |
| CTA final | fundo com gradiente radial estatico; botao com leve "respiro" (scale 1->1.02) so em hover, sem loop | 240ms | hover |
| Faixa [MOCK] | estatica, sem animacao; ao carregar nao desloca layout | n/a | n/a |
| Menu mobile | painel `opacity` + `translateY -8px->0`; `aria-expanded`; Esc fecha e devolve foco | 240ms ease-out | clique |
| Troca de tema | `color-scheme` e variaveis mudam sem transicao de cor em tudo (evita custo); so botao anima icone (rotate 180) | 240ms | clique |

### 2.1 Landing fluida (2026-11-03)

| Componente | Estados | Duração / easing | Gatilho |
|---|---|---|---|
| Hero palavras em cascata | cada palavra em máscara `overflow:hidden`, `translate 0 110% -> 0`, atraso 70ms por palavra (5 palavras) | 900ms ease-out | IntersectionObserver (is-in); após 1,9s `is-done` fixa o estado final |
| Parallax por rolagem | `[data-par]` com `translate3d` proporcional à posição da seção (`data-par-box`): fotos +-36/40px, tela do hero -56px, fotos da galeria +-26 a 44px (só >= 960) | por quadro (rAF compartilhado) | scroll, passivo |
| Tela flutuando | `float`: `translate3d 0 -> -14px` e rotação +-1 grau, em laço | 7s ease-in-out infinito | carga; pausável pelo botão; desligada em reduced-motion e sem JS |
| Faixa rolando | `translate3d 0 -> -50%` em laço, linhas em sentidos opostos | 42s e 56s linear | carga; pausa em hover, botão e reduced |
| Texto revelado (scrub) | palavras `opacity .55 -> 1` conforme a posição do h2 na janela | 360ms | scroll |
| Seção pinned | `translate3d` do trilho (0% a -66,67%) com platô por tela; `is-active` escala/opacidade da tela (.88/.6 -> 1) | 700ms ease-out nas telas | scroll |
| Barra de progresso do topo | `scaleX` 0 -> 1 | por quadro | scroll |
| Contadores | texto 0 -> valor, ease-out cúbico, largura mínima fixa em `ch` | 1400ms | entrada na tela (IntersectionObserver .4) |
| Cartões da galeria | hover: foto `scale 1.07`, legenda `translate 0 -6px` (só `(hover:hover)`) | 800ms / 500ms | hover |

Regras: um único laço rAF (o mesmo dos efeitos de ponteiro); só `transform`, `opacity`, `translate`, `scale`; reduced-motion desliga tudo e deixa o conteúdo estático e completo; sem JS o conteúdo é legível (faixa sem movimento). Nenhum efeito de ponteiro novo.

Foco visivel (todos): `outline: 3px solid` cor `primary` (claro) / `accent-text` (escuro), `outline-offset: 2px`, mais anel interno `bg` para contraste >= 3:1 contra fundo e contra o cartao. Nunca remover outline sem substituto.

### 1f. Integração venda + visual (2026-11-03, passe 2)

- **Altura**: 14.241 px em 1440 (era ~16.700; meta ~14.000). Cortes: #experiencias fundida em #telas, galeria #forca removida, bloco "para quem, prós e contras" dos planos removido, prós e contras do comparativo em duas linhas, "Apoio ao dia a dia" virou nota, padding de seção desktop 96 para 64, pinned com 50svh por tela (era 100svh), hero 80svh, faixas de foto com padding menor.
- **Faixa de números** (#numeros, zona escura, 4 colunas >= 960px, 2 em >= 600px): contadores no mesmo rAF; formatação pt-BR (1.200); sinal de menos e sufixos fora do número animado; selo [MOCK] na legenda e em cada rótulo; sem JS ou reduced-motion mostra o valor final.
- **Calculadora** (#roi): `calcular(alunos, ticket, horas, inad, valorHora, modo)` em JS puro dentro de app.js; premissas em constantes (SEMANAS_MES 4,33; conservador 0,20/0,25; padrão 0,35/0,40; planos por faixa de alunos 5/30). Entradas: número com label, slider sincronizado (alunos, horas, inadimplência), valor da hora em `<details>`. Vazio vira o padrão, fora do limite é travado ao sair do campo e no cálculo. Resultado: números animados só como texto (contador rAF, 450 ms; reduced-motion = valor direto); resumo único em `aria-live="polite"` (sr-only, atraso de 500 ms, só após a pessoa mexer). Starter oculta retorno e prazo. Sem JS fica o resultado estático do cenário conservador, sliders e botões de cenário ocultos. Resultado fica sticky >= 960px.
- **Caso de teste** (padrão, 20 alunos, R$ 250, 10 h, 12%, R$ 60/h): liberadas 15,2 h; tempo R$ 909; recuperado R$ 240; ganho líquido R$ 1.099; retorno 22,0x; prazo "menos de 2 dias". Conservador (padrão da página): 8,7 h; R$ 520; R$ 150; R$ 620; 12,4x; "menos de 3 dias".
- **Cenários**: cartões com selo [MOCK] e botão `aria-pressed`; ao clicar preenche a calculadora e leva o resultado à vista (scrollIntoView nearest; sem suavização em reduced-motion). Os números dos cartões seguem o modo escolhido.
- **Depoimentos**: trilho `overflow-x: auto` com scroll-snap dentro do container (a página não rola na horizontal), `tabindex="0"`, role group, setas/Home/End, botões anterior/próximo com `aria-disabled`, arraste com mouse (toque usa rolagem nativa), 3 cartões visíveis >= 960px.
- **Garantias**: grade de 5 cartões, 1/2/5 colunas. **FAQ**: duas colunas >= 960px, perguntas em h4 sob h3 de grupo.
- **Mockup SVG do financeiro**: viewBox 520x644, mesmas regras de tamanho do `.phone` das capturas; status por texto e cor (Pago / Pendente / Atrasado); cores `--z-ok/--z-warn/--z-bad` com contraste AA sobre #1f1f1f.
- Mantidos: um único rAF, transform/opacity, reduced-motion e sem JS, foco, alvos >= 44px (botões, labels de modo, summary, links do FAQ e CTA), body sem rolagem horizontal.

## 3. Interacao com mouse

Um unico modulo JS (`motion.js`, IIFE, ~120 linhas), um unico laco `requestAnimationFrame` compartilhado, ativo so enquanto ha elemento sob o ponteiro (cancelar rAF em `pointerleave`/blur). Escuta `pointermove` com `{passive:true}`; leitura de `getBoundingClientRect` uma vez em `pointerenter` (cache) e em `resize`; escrita so de custom properties/transform no rAF. Nenhuma leitura de layout dentro do rAF.

Elegibilidade global: `matchMedia('(hover: hover) and (pointer: fine)')` E nao `(prefers-reduced-motion: reduce)`. Fora disso nenhum listener de ponteiro e instalado (toque, caneta, teclado nao recebem efeito, e nada some).

**3.1 Spotlight nos cards** (`.fx-spot`: recursos, problema, planos, comparativo-cartao).
- Camada `::before` com `radial-gradient(240px circle at var(--mx) var(--my), rgb(var(--spot) / .14), transparent 60%)`, `position:absolute; inset:0; pointer-events:none; opacity:0`. `--spot` = primary (claro) / accent-text (escuro). Animar so `opacity` (0 -> 1 em 240ms); `--mx/--my` atualizados no rAF (em px relativos ao cartao). Atencao: gradiente repintado ao mover; limitar a cartoes sob o ponteiro (max 1 ativo).
- Texto sobre o spotlight mantem contraste: opacidade maxima .14 nao reduz AA (conferir no teste).
- Fallback toque/teclado: `:focus-within` acende o spotlight fixo no centro (`--mx:50%; --my:30%`) com opacity .08, sem seguir nada.

**3.2 Tilt 3D sutil** (`.fx-tilt`: cartoes de plano e de recurso, nao a tabela nem FAQ).
- Max 6 graus por eixo (`rotateX/rotateY = clamp(-6, 6)`), proporcional a posicao normalizada (-1..1) do ponteiro; `perspective(900px)` no `transform` do proprio cartao; `translateZ(0)`. Suavizacao por lerp no rAF (fator .15), retorno a 0 em 320ms ease-out ao sair. Sem `scale` maior que 1.01. Elementos internos nao recebem translateZ (texto nitido, sem parallax interno).
- Desligado em cartoes que contem controle em uso (ex.: `:focus-within`) para nao mover alvo durante o clique: ao focar, tilt volta a 0.
- Fallback: toque/teclado/reduced: sem tilt; hover vira apenas elevacao do item 2.

**3.3 Parallax leve no hero.**
- Ilustracao e 2 formas decorativas de fundo (SVG, `aria-hidden`) deslocam por `translate3d` em razao do ponteiro dentro do hero: ilustracao max 10px, formas 16 e 24px (profundidade). Texto e CTAs nunca se movem. Lerp .08. Amplitude zera abaixo de 960px de largura.
- Em toque: opcional, nenhum giroscopio. Fallback: posicao neutra.
- Alternativa de rolagem (sem mouse): nenhum parallax por scroll (evita enjoo e custo).

**3.4 Botao magnetico** (`.fx-mag`: apenas CTA primario do hero e CTA final; max 2 na pagina).
- Raio de atracao 80px alem da borda; deslocamento max 8px por eixo (`translate3d`), atracao = 0.25 x distancia ao centro, lerp .18; ao sair do raio volta em 320ms ease-spring-soft. Rotulo interno acompanha 50% do deslocamento (so transform).
- O alvo de clique **nao** pode sair do hit-area: o botao mantem 44px minimo e o movimento max 8px nao o afasta do cursor. Cliques sao tratados normalmente (sem preventDefault em pointer).
- Em `:focus-visible`, sem deslocamento. Fallback toque/teclado/reduced: botao estatico.

**3.5 Reduced motion** (`@media (prefers-reduced-motion: reduce)` + checagem JS com `matchMedia(...).addEventListener('change')`):
- Revelacoes e stagger: sem `translate`; estado final imediato (ou fade de 1 frame, `opacity` em 100ms no maximo; padrao: nenhum).
- Spotlight, tilt, parallax, magnetico, contador, indicador deslizante, giro do "+" e do tema: desligados; troca de periodo/preco e acordeao mudam instantaneamente (so estado, sem transicao); fundo e foco permanecem.
- Hover/foco mantem mudanca de cor/borda/sombra (sem movimento). Estados nunca dependem de animacao.
- Teste: DevTools > Rendering > Emulate prefers-reduced-motion.

**3.6 Desempenho:** `will-change: transform` so no elemento ativo (set em `pointerenter`, removido em `pointerleave`); sem `filter`/`backdrop-filter` animados; um rAF por vez; `IntersectionObserver` desconecta apos revelar; pausar efeitos com `document.hidden`.

## 4. Criterios de aceite verificaveis

Cada item e verificavel por ferramenta ou inspecao; registrar resultado por tema (claro/escuro) e viewport (390, 1440).

| ID | Criterio | Como verificar |
|---|---|---|
| A-01 | Contraste de texto >= 4.5:1 (texto grande >= 3:1) em todos os pares dos dois temas, incluindo texto sobre spotlight ativo, selo "Mais popular", selo "Em avaliacao", botoes em hover/press e CTA final | script de contraste sobre os tokens + axe/DevTools nos 2 temas; nenhum `#b0b0b0` sobre fundo claro |
| A-02 | Contraste de componentes de UI (bordas de controle, indicador de foco, icones informativos, segmentado) >= 3:1 | idem; bordas de controle usam `faint` |
| A-03 | Foco visivel e na ordem logica em todo controle: menu, tema, CTAs, segmentado, cartoes interativos, acordeao, disclosure; anel 3px offset 2px, contraste >= 3:1; nada oculto por faixa/menu sticky (`scroll-padding-top` = banner+menu) | tabulacao completa; WCAG 2.4.7, 2.4.11 |
| A-04 | Alvo >= 44x44 CSS px em botoes, links de menu, opcoes do segmentado, cabecalho de FAQ, botao de tema, links do rodape (altura minima 44 com padding) | medir via DevTools/script `getBoundingClientRect` |
| A-05 | CLS = 0,00 em 390 e 1440 (carga, troca de periodo, abrir FAQ, trocar tema, carga de fonte) | Lighthouse/Performance Insights; `PerformanceObserver('layout-shift')` retorna soma 0. Requisitos: `aspect-ratio` nas imagens/ilustracoes, altura fixa da faixa e preco, `font-display: swap` com fallback de metrica ajustada (`size-adjust`), nenhuma animacao de `height/top/left/margin` |
| A-06 | Somente `transform`/`opacity` animados (exceto `grid-template-rows` do acordeao, aceito por nao afetar o resto) | busca no CSS por `transition`/`animation`: lista de propriedades revisada |
| A-07 | Limites do mouse: tilt <= 6 graus por eixo, magnetico <= 8px, parallax <= 24px, 1 rAF ativo, 0 listener de ponteiro quando `(hover:none)` ou reduced-motion | teste no console: forcar extremos; inspecao de listeners |
| A-08 | Reduced motion: com a preferencia ativa, nenhuma transicao > 100ms de movimento, nenhum efeito de ponteiro, conteudo completo visivel | emulacao + captura |
| A-09 | Sem JS: conteudo completo legivel, FAQ visivel (details/summary ou painel aberto), seletor de periodo com Mensal padrao e precos acessiveis | desativar JS |
| A-10 | Teclado: seletor com setas/Home/End; FAQ com Enter/Espaco e setas; menu com Esc; nada preso | roteiro manual |
| A-11 | Marcadores [MOCK] e [a confirmar] presentes em texto em preco, limites, comparativo e rodape; faixa fixa [MOCK] no topo em todas as larguras sem cobrir conteudo | inspecao textual |
| A-12 | Sem rolagem horizontal em 390 e 1440 (e 320 como verificacao extra); zoom 200% sem perda de conteudo; reflow em 320px | captura/`scrollWidth <= innerWidth` |
| A-13 | Tabelas com `caption` e `th scope`; ilustracoes com alt de `conteudo.md`; decorativas `aria-hidden`; troca de preco anunciada via `aria-live` | axe + leitor de tela |
| A-14 | Tom e marca: Inter, vermelho #b1111b so como acao/acento, sem urgencia, sem marca ou pessoa real, sem promessa de saude; numeros, depoimentos e selos so como dados ficticios com [MOCK] visivel (decisao de 2026-11-03) | revisao de conteudo |

## 5. Pendencias e pedidos de delta ao design system

- D-L1: Inter local nao confirmada no repositorio; decidir entre arquivo local em `prototipo-landing/assets/` (licenca OFL, registrar) e pilha do sistema. Nada baixado nesta rodada.
- D-L2: escala "marketing" (hero 56, h2 40, body 16) e tokens de movimento (secao 0) propostos como delta local da landing; nao alteram o produto.
- D-L3: sombra elev-3 usa 18% de opacidade; no escuro confirmar visibilidade (usar borda `primary-line` como apoio).
- D-L4: valor de economia no seletor e diferenca aritmetica [MOCK]; sem "mais vantajoso" nem urgencia.

## Changelog

- 2026-10-31: spec inicial. Consumidores: frontend (prototipo HTML/CSS/JS), QA (secao 4), revisao de acessibilidade.
- 2026-11-03: landing fluida: hero imersivo com foto, faixa rolando, frase grande sobre foto, telas do app em seção pinned, galeria, contadores [MOCK]; seções 1, 1b-1e e 2.1 acrescentadas. Zona escura fixa (`.zone`) com tokens do tema escuro nos dois temas. Pendências: ver handoff landing-fluida-frontend-2026-11-03.
- 2026-11-03 (passe 2): integração de copy de marketing e vendas, calculadora de ROI, cenários, depoimentos [MOCK], garantias, FAQ com objeções; fusão #experiencias/#telas; financeiro vira mockup SVG próprio; galeria removida. Ver 1f.
