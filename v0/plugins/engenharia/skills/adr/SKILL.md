---
name: adr
description: Registra uma decisão de arquitetura (ADR) com contexto, opções consideradas, escolha, consequências e quem aprovou. Use ao tomar ou mudar uma decisão técnica que custa caro reverter (stack, banco, hospedagem, autenticação, divisão de serviços, padrão de integração).
---

# Registrar uma decisão de arquitetura

Um ADR por decisão, em `docs/03-arquitetura/adr/NNNN-titulo-curto.md`, numerado em sequência. ADR aceito **não se edita**: uma decisão nova o substitui e os dois se referenciam.

```markdown
# ADR NNNN: <decisão em uma frase>

- Estado: proposto | aceito | substituído por ADR NNNN | rejeitado
- Data: <AAAA-MM-DD> | Decidido por: <humano que aprovou>
- Relacionados: RF-xx, RNF-xx, ADR NNNN

## Contexto
O problema, as forças em jogo (prazo, custo, equipe, requisitos não funcionais) e as restrições. Fatos, com fonte.

## Opções consideradas
| Opção | Prós | Contras | Custo e esforço | Risco |
|---|---|---|---|---|
| A | | | | |
| B | | | | |
| Não fazer nada | | | | |

## Decisão
Escolhemos <opção> porque <razão ligada ao contexto>.

## Consequências
- Positivas:
- Negativas e dívidas assumidas:
- O que passa a ser obrigatório para quem implementa:
- Impacto em segurança, privacidade, custo e operação:

## Como reverter
O que seria preciso para voltar atrás e quanto custaria.

## Como validar
O sinal ou a métrica que mostrará se a decisão foi boa, e quando revisitar.
```

## Regras

- **Pelo menos duas opções reais**, mais "não fazer nada". Decisão com uma opção só é anúncio, não decisão.
- A razão liga a escolha ao contexto. "É a mais moderna" não é razão.
- Registre o que foi **confirmado** (versão testada, limite do plano conferido na data) e o que é **suposição**.
- Quem aprova é humano. Agente propõe com estado `proposto`.
- Sem segredos, endereços internos ou dados de cliente no ADR.
- Decisão reversível e barata não precisa de ADR: uma linha no handoff basta.
