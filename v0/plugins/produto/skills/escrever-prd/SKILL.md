---
name: escrever-prd
description: Estrutura um documento de requisitos de produto (PRD) com problema, público, objetivos mensuráveis, requisitos funcionais e não funcionais, fora de escopo e riscos. Use na fase de Requisitos ou quando pedirem PRD, especificação de produto ou levantamento de requisitos.
---

# Escrever o PRD

Grave em `docs/01-requisitos/prd.md`. O PRD diz **o quê e por quê**; o como fica para a arquitetura. Leia antes a visão, o mercado e o modelo financeiro em `docs/00-descoberta/`.

```markdown
# PRD: <produto ou funcionalidade>

Estado: rascunho | em revisão | aceito — Versão: <n> — Data: <AAAA-MM-DD>

## 1. Problema
Quem sofre, com o quê, com que frequência e o que faz hoje. Evidência (pesquisa, dado, relato).

## 2. Público e personas
Uma a três personas: contexto, objetivo, limitações (tempo, técnica, acessibilidade).

## 3. Objetivos e métricas
| Objetivo | Métrica | Linha de base | Meta | Prazo |
Sem métrica, não é objetivo.

## 4. Escopo
### Dentro
### Fora (e por quê)

## 5. Requisitos funcionais
| ID | Requisito | Persona | Prioridade (essencial / importante / desejável) | Critério de aceite resumido |
| RF-01 | ... |

## 6. Requisitos não funcionais
| ID | Categoria | Requisito verificável |
| RNF-01 | Desempenho | p95 da página inicial abaixo de 2 s em 4G |
Categorias: desempenho, disponibilidade, segurança, privacidade, acessibilidade (WCAG 2.2 AA), observabilidade, compatibilidade, custo.

## 7. Dados pessoais
Quais dados, finalidade, base legal pretendida, retenção. Se houver, o gate de privacidade é obrigatório.

## 8. Regras de negócio
Numeradas (RN-01...), sem ambiguidade, com exemplos.

## 9. Jornadas principais
Passo a passo do caminho feliz e dos principais desvios.

## 10. Dependências e restrições
Integrações, prazos, orçamento, stack obrigatória, obrigações legais.

## 11. Riscos e premissas
| Risco ou premissa | Impacto | Como validar ou mitigar |

## 12. Perguntas em aberto
Cada uma com dono e data.
```

## Regras

- Todo requisito é **verificável**: alguém consegue provar que foi atendido. Troque "rápido" e "fácil" por número ou comportamento observável.
- Não invente regra de negócio nem dado de mercado. O que falta vira pergunta em aberto.
- Um requisito por linha, com ID estável. As histórias vão citar esses IDs.
- Prioridade tem que discriminar: se tudo é essencial, nada é.
- "Fora de escopo" é obrigatório: evita discussão depois.
