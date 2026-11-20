---
theme: aura-brand
label: Aura Brand
colors:
  primary: "#6a0dad"
  background: "#ffffff"
  surface: "#ffffff"
  text-primary: "#18181b"
  text-secondary: "#63636b"
  border: "#e7e7ea"
  accent: "#5b0b95"
typography:
  display-lg: { font: "'Geist Variable', ui-sans-serif, system-ui, sans-serif", size: "3.5rem", weight: 600 }
  body-md: { font: "'Geist Variable', ui-sans-serif, system-ui, sans-serif", size: "1rem", weight: 400 }
  label-md: { font: "'JetBrains Mono Variable', ui-monospace, 'SFMono-Regular', monospace", size: "0.85rem", weight: 500 }
spacing: { base: "0.25rem", gap: "1rem", card-padding: "1.25rem", section-padding: "5rem" }
rounded: { card: "0.75rem", control: "calc(0.75rem * 0.8)", pill: "999px" }
---

# Aura Brand — DESIGN

## Colors
A cor da marca (`--primary`, #6a0dad) aparece só em ações principais, foco e destaques.
Fundo e texto vêm da rampa neutra (zinc). Tons derivados (`brand-soft`, hover) saem de `--primary`
via `color-mix`; trocar a marca é trocar uma cor. Modo claro e escuro no mesmo tema.

## Typography
Corpo e títulos em 'Geist Variable', ui-sans-serif, system-ui, sans-serif; rótulos técnicos e código em mono ('JetBrains Mono Variable', ui-monospace, 'SFMono-Regular', monospace).

## Guardrails
- Nunca usar hex solto nem cor primitiva do Tailwind: só tokens semânticos.
- Mesmo raio e borda em botões, cards e badges.
- Efeitos de fundo sempre atrás do conteúdo; respeitar `prefers-reduced-motion`.
- Todo par texto/fundo passa em WCAG AA; anel de foco em 3:1.
