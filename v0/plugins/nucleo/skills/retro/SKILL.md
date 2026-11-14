---
name: retro
description: Conduz a retrospectiva de um ciclo ou de uma fase e transforma o que foi aprendido em melhorias concretas nos agentes, skills e regras. Use na fase de Crescimento, ao fim de um release ou depois de um incidente ou retrabalho grande.
---

# Retrospectiva

Objetivo: sair com **mudanças concretas e pequenas**, não com uma lista de sentimentos.

## 1. Junte os fatos

Leia, sem reinterpretar:

- `agentes status` e o histórico de portões em `.agentes/estado.json` (aprovações, rejeições e motivos).
- Handoffs em `docs/operacoes/handoffs/` e `docs/05-construcao/handoffs/`.
- Relatórios de `docs/06-verificacao/` (achados por gate e quantas rodadas até aprovar).
- `agentes orcamento status` (chamadas, subagentes, tokens aproximados, alertas de conteúdo externo).
- Registro de instalações.

## 2. Meça

| Métrica | Como obter |
|---|---|
| Portões rejeitados e motivo | histórico do estado |
| Rodadas de correção por história | relatórios de verificação |
| Achados por gate e severidade | relatórios de verificação |
| Custo por fase (chamadas e tokens aproximados) | orçamento das sessões |
| Bloqueios de hook (o que foi barrado e por quê) | handoffs e sessões |
| Tempo de espera em portão | datas do histórico |

Se um número não existe, escreva "não medido". Não estime para preencher a tabela.

## 3. Ache a causa

Para os três maiores problemas, pergunte "por quê" até chegar a algo que se pode mudar: briefing incompleto, critério de aceite ambíguo, agente com ferramenta demais ou de menos, tier errado, regra que ninguém aplicava, hook com falso positivo, papel sem dono.

## 4. Proponha mudanças

Grave `docs/08-crescimento/retro.md`:

```markdown
# Retrospectiva <ciclo ou release> (<data>)

## Fatos e números
## O que funcionou (manter)
## Problemas e causas
## Mudanças propostas
| # | Mudança | Onde (arquivo) | Evidência que motivou | Como saber se funcionou |
|---|---|---|---|---|
## Decisões que dependem do humano
```

Cada mudança aponta para um arquivo real: o prompt de um agente, uma skill, `modelos.json`, `fluxo.json`, a configuração de limites ou uma regra de hook.

## Regras

- **Proponha; não aplique.** Mudança em agente, skill, hook ou limite só entra com aprovação do usuário.
- Uma mudança por problema, a menor que resolve. Regra nova precisa de um caso real que a justifique.
- Afrouxar uma proteção (limite, hook, gate) exige mostrar o falso positivo e o risco que volta.
- Fatos sobre o processo, não culpa de agente ou pessoa.
