# aura-fit · landing (nova versão)

Nova landing do aura-fit, refeita com UI kits open source de componentes animados.
Substitui visualmente o protótipo em `../prototipo-landing` (HTML/CSS/JS puro), mantendo o mesmo conteúdo
(`conteudo.md`) e a marca: paleta (`#141414` → `#f5f5f5`, vermelho `#b1111b` / `#d0202b` / `#ff6f78`),
tipografia Inter e o logo anel + ponto.

Status: DEMONSTRATIVO. Preços, limites, números e depoimentos seguem marcados com `[MOCK]` / `[a confirmar]`.

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
- `src/sections/Product.tsx`: problema, manifesto, recursos (bento), telas do app, como funciona.
- `src/sections/Roi.tsx`: calculadora (mesmas premissas do protótipo).
- `src/sections/Closing.tsx`: depoimentos, planos, comparativo, FAQ, CTA final, rodapé.
- `src/components/ui.tsx`: logo, botões e blocos comuns.

## Telas do app

As capturas em `public/img/tela-*.png` vêm de `../_evidence/` (testes Cypress, 390×844) e são exibidas na moldura `Phone` (`src/components/ui.tsx`):

| Arquivo | Origem | Onde aparece |
|---|---|---|
| `tela-aluno-inicio.png` | `g4/home-03-aluno-light-390x844.png` | hero |
| `tela-aluno-treino.png` | `g4/home-04-aluno-light-390x844.png` | telas, 01 |
| `tela-prescricao-ia.png` | `training-d/painel-abas-390-light.png` | telas, 02 |
| `tela-personal-painel.png` | `g4/home-02-personal-dark-390x844.png` | telas, 03 |

## Acessibilidade e movimento

`prefers-reduced-motion` desliga a rolagem suave e reduz as animações (`MotionConfig reducedMotion="user"`).
Tema único escuro (a versão clara do protótipo não foi portada).
