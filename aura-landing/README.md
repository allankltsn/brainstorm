# aura-fit · landing (nova versão)

Nova landing do aura-fit, refeita com UI kits open source de componentes animados.
Substitui visualmente o protótipo em `../prototipo-landing` (HTML/CSS/JS puro), mantendo o mesmo conteúdo
(`conteudo.md`) e a marca: paleta (`#141414` → `#f5f5f5`, vermelho `#b1111b` / `#d0202b` / `#ff6f78`),
tipografia Inter e o logo anel + ponto.

Preços, limites, números e depoimentos ainda são de exemplo; as marcações `[MOCK]` / `[a confirmar]` foram retiradas da página a pedido.

## Rodar

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

O build sai em `dist/` (caminhos relativos, pode ser servido de qualquer subpasta).

## Stack e kits

| Peça | Uso | Licença |
|---|---|---|
| Vite + React + TypeScript | base | MIT |
| Tailwind CSS v4 | estilos; tokens da marca em `src/index.css` | MIT |
| Motion (`motion/react`) | animações, scroll, layout | MIT |
| Lenis | rolagem suave | MIT |
| [Magic UI](https://magicui.design) | `src/components/magicui`: light-rays, particles, text-animate, blur-fade, number-ticker, scroll-based-velocity, magic-card, animated-list, border-beam, shine-border, marquee, dot-pattern, scroll-progress, animated-shiny-text | MIT |
| [Lightswind UI](https://lightswind.com) | `src/components/lightswind`: accordion (FAQ), magnetic-button (CTA final) | MIT |
| lucide-react | ícones | ISC |
| Inter Variable (`@fontsource-variable/inter`) | tipografia, servida localmente | OFL 1.1 |

Os componentes dos kits são código-fonte copiado para o projeto (modelo shadcn), com as cores trocadas pelos tokens do aura-fit.

## Estrutura

- `src/sections/Hero.tsx`: barra superior, hero, faixa de números, letreiro.
- `src/sections/Product.tsx`: problema, manifesto, recursos (bento), como funciona.
- `src/sections/Roi.tsx`: calculadora (mesmas premissas do protótipo).
- `src/sections/Closing.tsx`: depoimentos (mural em colunas), planos, comparativo, FAQ, CTA final, rodapé.
- `src/sections/Porque.tsx`: "Por que o aura-fit", seis benefícios em cartões que inclinam com o ponteiro, cada um com uma mini-ilustração animada.
- `src/components/ui.tsx`: logo, botões e blocos comuns.
- `src/sections/Relatorios.tsx`: painel "Gráficos e relatórios".
- `src/components/charts.tsx`: **estilo padrão de gráficos** (`LineChart`, `Bars`, `BarList`, `Ring`, `Delta`), inspirado nas telas de Analytics do affectUI. Todo gráfico novo deve sair daqui: entra animado quando aparece na tela e reage ao ponteiro (linha-guia, pontos e dica com valores).

## Telas do app e fluxo interativo

As capturas em `public/img/` vêm de `../_evidence/` (testes Cypress, 390×844):

| Arquivo | Origem | Onde aparece |
|---|---|---|
| `tela-aluno-inicio.png` | `g4/home-03-aluno-light-390x844.png` | hero; fluxo do aluno, tela 1 |
| `tela-aluno-treino.png` | `g4/home-04-aluno-light-390x844.png` | fluxo do aluno, tela 2 |
| `fluxo-p1-treinos.png` | `training-bc/biblioteca-padrao-light-390.png` (topo) | fluxo do personal, tela 1 |
| `fluxo-p2-modelo.png` | `training-bc/modelo-editor-padrao-light-390.png` | fluxo do personal, tela 2 |
| `fluxo-p3-aluno.png` | `training-a/trn02-resumo-light-390.png` | fluxo do personal, tela 3 |
| `fluxo-p4-editor.png` | `training-bc/treino-aluno-editor-com-sessoes-feitas-light-390.png` (topo) | fluxo do personal, tela 4 |

`src/sections/Demo.tsx` define os fluxos: cada tela tem pontos (`spots`) em px da captura. Ponto com `to` é clicável e leva a outra tela; sem `to`, só mostra a dica ao passar o mouse. O aparelho inclina com o cursor e as áreas acendem conforme ele se aproxima.

## IA ilustrada e login

- `src/sections/AiUses.tsx`: quatro SVGs animados (SMIL) dos usos da IA: dúvidas de treino, análise de vídeo do movimento, relatos de dor e exames, treino preenchido a partir de um documento.
- Os botões de cadastro ("Começar grátis" e afins) levam para `https://allankltsn.github.io/brainstorm/login`.

## Fotos e referências de movimento

Fotos em `public/img/foto-*.webp`: `foto-atleta-faixa` (hero), `foto-atleta-retrato` (manifesto), `foto-halteres` (faixa de números e login), `foto-halter-torso` (por que o aura-fit), `foto-flexao` (CTA final).

Alguns padrões foram inspirados no [affectUI](https://www.affectui.com) (Gradient Floor, Gradient Text, Grid Background, Tilt Card, Testimonial Wall e as card illustrations) e reescritos aqui com a marca do aura-fit; nenhum código do affectUI foi copiado.

## Acessibilidade e movimento

`prefers-reduced-motion` desliga a rolagem suave e reduz as animações (`MotionConfig reducedMotion="user"`).
Tema único escuro (a versão clara do protótipo não foi portada).
