# Aura Echo — protótipo do hub

Protótipo visual do **hub do ecossistema Aura**: uma landing pública e um
portal autenticado onde o cliente vê, num lugar só, os serviços Aura que
contratou. Dados **mockados**, no mesmo molde do Aura Fit (`prototype-v2`).

Design e plano: `../docs/superpowers/specs/2026-11-20-aura-echo-prototipo-design.md`
e `../docs/superpowers/plans/2026-11-20-aura-echo-prototipo.md`.

## Rodar

```bash
pnpm install
pnpm dev      # servidor de desenvolvimento
pnpm build    # tsc -b && vite build -> dist/ estático
pnpm lint     # oxlint
pnpm test     # vitest (lógica do store)
```

## Rotas

Usa `HashRouter` (abre de qualquer hospedagem estática).

| Rota | Tela |
| --- | --- |
| `#/` | Landing pública: hero, serviços, preços por serviço |
| `#/entrar`, `#/criar-conta` | Auth cosmético (não valida; entra no portal) |
| `#/app/inicio` | Dashboard: "Meus serviços" + "Descobrir" |
| `#/app/loja` | Loja: contratar serviços avulsos |
| `#/app/loja/:slug` | Detalhe do serviço: assinar / abrir / cancelar |
| `#/app/assinatura` | Minha assinatura: total, status, cancelar/reativar |
| `#/app/conta` | Dados do usuário e aparência (tema) |

## Perfis de demonstração

No menu do usuário (rodapé do menu lateral) há um seletor **"ver como"** que
troca entre perfis mockados, para validar os estados do portal:

- **Marina (completo)** — assina os 4 serviços;
- **Rafael (parcial)** — Aura Fit + Aura Brand;
- **Bia (novo)** — nada contratado (zero-state).

A troca persiste em `localStorage` (`aura-echo-profile`).

## Serviços (mock)

Aura Fit (academia), Aura Barber (barbearia), Aura Brand (CRM + marketing),
Aura Vagas (recrutamento). Planos **individuais por serviço**, sem bundles.
O botão "Abrir" aponta para a URL da vertical (deep-link mockado).

## Estrutura

```
src/
  components/   AppShell, Brand, ServiceCard, ui/ (kit shadcn copiado do Aura Fit)
  lib/          services, profiles, store (+ store.test), nav, theme, utils
  pages/        landing, entrar, inicio, loja, servico-detalhe, assinatura, conta
```

O tema "Aura mestre" (neutro + teal, cromas por serviço) vive em `src/index.css`.
