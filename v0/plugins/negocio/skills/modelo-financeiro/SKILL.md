---
name: modelo-financeiro
description: Estrutura o modelo financeiro de um produto (premissas, preço, unit economics, custos, projeção em três cenários, ponto de equilíbrio, runway e sensibilidade). Use na fase de Descoberta, ao avaliar viabilidade, definir ou mudar preço, ou quando pedirem business case, unit economics, LTV, CAC ou break-even.
---

# Modelo financeiro do produto

Grave em `docs/00-descoberta/modelo-financeiro.md`. O objetivo é responder: **isto se paga, em quanto tempo e do que depende?**

```markdown
# Modelo financeiro: <produto>

Data: <AAAA-MM-DD> — Moeda: <BRL> — Horizonte: <12 a 24 meses>

## 1. Premissas
| # | Premissa | Valor | Tipo (dado / referência / estimativa) | Fonte e data |
| P1 | Preço do plano mensal | R$ 49 | estimativa | comparação com 3 concorrentes, <links> |

## 2. Receita e preço
Planos, preço, cobrança (mensal, anual), descontos, taxa do meio de pagamento.

## 3. Unit economics
| Indicador | Fórmula | Valor |
| Receita média por cliente (ARPU) | receita mensal / clientes ativos | |
| Margem bruta | (receita - custo variável) / receita | |
| Churn mensal | clientes perdidos no mês / clientes no início do mês | |
| Tempo de vida | 1 / churn mensal | |
| LTV | ARPU x margem bruta x tempo de vida | |
| CAC | gasto de aquisição / clientes novos | |
| LTV / CAC | | |
| Payback do CAC (meses) | CAC / (ARPU x margem bruta) | |

## 4. Custos mensais
| Item | Fixo ou variável | Valor | Base de cálculo |
Infraestrutura, ferramentas, taxas de pagamento, pessoas, marketing, suporte, IA.

## 5. Projeção
| Mês | Clientes | Receita | Custo | Resultado | Caixa acumulado |
Três cenários: pessimista, base e otimista, dizendo o que muda entre eles.

## 6. Ponto de equilíbrio e runway
Clientes necessários para empatar = custo fixo / (ARPU x margem bruta).
Runway = caixa disponível / queima mensal.

## 7. Sensibilidade
| Premissa | Variação | Efeito no ponto de equilíbrio | Efeito no caixa em 12 meses |
As três premissas que mais mexem no resultado.

## 8. Riscos e recomendação
Seguir, ajustar (o quê) ou parar. O que precisa ser validado primeiro e como.
```

## Regras

- **Toda conta é refazível:** fórmula ao lado do número, premissa referenciada pelo ID.
- Separe **dado** (veio do usuário ou de sistema), **referência** (mercado, com link e data) e **estimativa** (sua, marcada).
- Faixas em vez de falsa precisão. "Entre 3% e 6% de churn" é mais honesto que "4,37%".
- Referências de mercado variam muito por setor e envelhecem: não trate como verdade.
- Com churn muito baixo o tempo de vida explode: limite o horizonte (por exemplo, 36 meses).
- Impostos e enquadramento: marque `[REVISÃO-CONTÁBIL]`. O modelo não substitui um contador.
- Falta dado essencial? Pergunte. Não preencha com número inventado.
