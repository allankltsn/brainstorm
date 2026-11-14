---
name: threat-model
description: Estrutura um modelo de ameaças (ativos, atores, fluxo de dados, fronteiras de confiança, ameaças STRIDE, casos de abuso, mitigações e riscos aceitos). Use na fase de Arquitetura, antes de implementar funcionalidade sensível (autenticação, pagamento, dados pessoais, upload, integrações) ou quando o desenho mudar.
---

# Modelo de ameaças

Grave em `docs/03-arquitetura/threat-model.md`. Faça **antes do código**. Atualize quando surgir componente, integração ou tipo de dado novo.

```markdown
# Modelo de ameaças: <sistema ou funcionalidade>

Versão: <n> — Data: <AAAA-MM-DD> — Escopo: <o que cobre e o que não cobre>

## 1. Ativos
| Ativo | Por que importa | Classificação (público / interno / pessoal / sensível / segredo) |

## 2. Atores
Usuário legítimo; usuário autenticado mal-intencionado; atacante externo; serviço ou dependência comprometida; pessoa interna; agente de IA com acesso ao repositório ou à infraestrutura.

## 3. Fluxo de dados e fronteiras de confiança
Navegador -> [borda] -> front -> [rede] -> BFF -> [rede interna] -> serviços -> banco
Liste cada fronteira e o que é verificado ao cruzá-la (autenticação, autorização, validação).

## 4. Ameaças
| ID | Fronteira ou componente | STRIDE | Cenário (passo a passo) | Prob. | Impacto | Mitigação | Como verificar | Dono |
| T-01 | BFF -> serviço | Elevação de privilégio | Usuário troca o ID do recurso na URL e lê dado de outro cliente | Alta | Alto | Autorização por recurso, filtrando pelo cliente do contexto autenticado | Teste: usuário A pede recurso de B e recebe 404 | backend |

## 5. Casos de abuso do negócio
Enumeração de contas, uso duplicado de cupom ou crédito, fraude de pagamento, raspagem, spam por convite.

## 6. Requisitos de segurança derivados
Lista verificável que vira critério de aceite das histórias.

## 7. Cadeia de suprimentos e operação
Dependências, imagens base, CI, segredos, quem publica e quem acessa produção.

## 8. Riscos aceitos
| Risco | Por que não mitigar agora | Aceito por (humano) | Revisar em |
```

## STRIDE em uma linha cada

| Letra | Ameaça | Pergunta |
|---|---|---|
| S | Falsificação de identidade | Alguém consegue se passar por outro usuário ou serviço? |
| T | Adulteração | Alguém consegue alterar dado em trânsito ou em repouso? |
| R | Repúdio | Dá para negar uma ação por falta de trilha? |
| I | Vazamento de informação | Algum dado sai para quem não devia (resposta, log, erro, URL)? |
| D | Negação de serviço | Dá para esgotar recurso com pouco esforço? |
| E | Elevação de privilégio | Alguém consegue fazer o que não tem permissão? |

## Regras

- Ameaça só entra com **cenário concreto**. "SQL injection" sem dizer onde e como não ajuda.
- Toda mitigação tem "como verificar". Sem isso, ninguém prova que existe.
- Comece pelo que expõe dados de outros usuários, dinheiro ou segredos.
- Inclua o próprio fluxo de agentes: conteúdo externo com instruções maliciosas, segredo em log de sessão, plugin de terceiros.
- Aceitar risco é decisão humana, com nome e data de revisão.
