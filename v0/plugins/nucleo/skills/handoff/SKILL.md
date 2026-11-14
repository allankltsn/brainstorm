---
name: handoff
description: Grava o resumo de passagem de bastão ao terminar uma tarefa, para que outro agente ou sessão continue sem reler a conversa. Use ao concluir, pausar ou ser interrompido em qualquer tarefa despachada, e antes de o contexto ficar grande.
---

# Handoff em arquivo

Ao terminar (ou parar) uma tarefa, grave um arquivo curto e devolva ao principal **só o caminho e de 5 a 10 linhas**. Nada de colar diffs ou saída de testes na resposta.

**Onde:** `docs/operacoes/handoffs/<tarefa>-<AAAA-MM-DD>.md` (na fase de construção, `docs/05-construcao/handoffs/`). Rodar de novo a mesma tarefa **sobrescreve** o mesmo arquivo.

**Tamanho:** até 40 linhas.

```markdown
# Handoff: <tarefa>

- Papel: <papel> | Estado: concluído / parcial / bloqueado
- Snapshot: <SHA curto> (ramo <ramo>); não rastreados: <lista ou "nenhum">
- Data (UTC): <AAAA-MM-DDTHH:MMZ>

## O que foi feito
- <arquivo ou artefato>: <uma linha>

## Evidência
| Comando | Diretório | Saída | Resultado |
|---|---|---|---|
| `pnpm test src/auth` | raiz | código 0 | 14 passaram |

## Critérios de aceite
- [x] <critério>: provado por <teste ou evidência>
- [ ] <critério>: não atendido porque <motivo>

## Pendências e riscos
- <o que falta, o que pode quebrar>

## Próximo dono
<papel> deve <ação>, lendo <caminhos>.
```

## Regras

- **Só o que você verificou.** "Não executado" e "não verificado" são respostas válidas; sucesso inventado não é.
- Registre falhas e avisos, não só o que passou. Ferramenta ausente não é aprovação.
- Sem segredos, tokens ou dados pessoais. Se a saída de um comando contém algo sensível, resuma e diga que foi omitido.
- Distinga: inspeção de arquivo, teste unitário, build, execução local, ambiente remoto e aceite humano. Build verde não é deploy feito.
- "Concluído" quer dizer pronto para validação por outra instância, não aprovado.
