---
name: escrever-story
description: Escreve uma história de usuário pronta para desenvolvimento, com narrativa, regras de negócio, critérios Given/When/Then, Definition of Ready e Definition of Done. Use na fase de Planejamento, ao quebrar um PRD em histórias e tarefas, ou quando pedirem user story, critérios de aceite ou card de backlog.
---

# Escrever uma história

Uma história por arquivo: `docs/04-planejamento/stories/S-NNN-titulo-curto.md`. O mesmo texto serve de corpo da issue no GitHub (título `[S-NNN] <título>`; tarefas como sub-issues).

```markdown
# [S-NNN] <título no imperativo>

- Épico: [E-NN] <nome> | Prioridade: crítica / alta / média / baixa | Estimativa: <pontos>
- Requisitos: RF-xx, RNF-xx | Regras: RN-xx
- Dados pessoais: sim / não | Depende de: S-NNN ou "nada"

## Narrativa
Como <persona>, quero <ação> para <benefício>.

## Contexto
O mínimo para entender: tela ou endpoint, link do design, ADR e contrato de API relacionados.

## Regras de negócio
- RN-xx: <regra citada do PRD>

## Critérios de aceite
1. Dado <estado inicial>, quando <ação>, então <resultado observável>.
2. Dado <caso de erro>, quando <ação>, então <mensagem ou comportamento>.
3. Dado <limite ou permissão>, quando <ação>, então <resultado>.

## Fora de escopo
- <o que esta história não faz>

## Tarefas
- [ ] task-N-impl: <o quê> (papel: backend / frontend / ...)
- [ ] task-N-review, task-N-security, task-N-qa

## Definition of Ready
- [ ] Narrativa e critérios claros e testáveis
- [ ] Regras de negócio citadas
- [ ] Design e contrato referenciados
- [ ] Dependências resolvidas ou declaradas
- [ ] Dados pessoais e riscos marcados

## Definition of Done
- [ ] Cada critério provado com evidência (teste ou execução)
- [ ] Testes automatizados passando no snapshot final
- [ ] Revisão técnica, segurança e QA aprovados no mesmo snapshot
- [ ] Privacidade aprovada (se houver dado pessoal)
- [ ] Documentação e changelog atualizados
```

## Como escrever bons critérios

- **Observáveis:** descrevem o que se vê ou se mede, não a implementação. "Então vejo a mensagem X", não "então o service lança Y".
- Cubra o **caminho feliz, os erros, os limites e a permissão** (outro usuário não acessa este recurso).
- Um comportamento por critério. Mais de oito critérios: divida a história.
- Inclua o requisito não funcional que a história toca (acessibilidade por teclado, tempo de resposta, estado de carregamento e de vazio).
- Mensagens de erro de autenticação não revelam se a conta existe.

## Fatiamento

Vertical (entrega algo de ponta a ponta), pequena (um PR revisável) e independente quando possível. Uma história só é despachada com a Definition of Ready completa e só é concluída com a Definition of Done provada.
