# Quadro Kanban

Peças do contrato `core/workflow/kanban-board.md` (perfil `kanban-board`).

| Arquivo | Para quê |
|---|---|
| `audit_board.py` | Auditor determinístico do quadro: 25 regras, sem IA |
| `setup-kanban-fields.sh` | Cria os campos Etapa, Precisa de você e Gates num Project existente |
| `example-board.json` | Quadro fictício com erros plantados, para demonstração e testes |

O modelo de card está em `core/templates/kanban-card.md`.

## Auditar

```bash
python audit_board.py --owner <dono> --projeto <número>             # ao vivo, pelo gh
python audit_board.py --arquivo example-board.json                  # a partir de um export
python audit_board.py --owner <dono> --projeto <número> --aplicar   # corrige só campos derivados
python audit_board.py ... --json                                    # saída para máquinas
```

Código de saída: `0` sem erros, `1` com erros, `2` se não conseguiu ler o quadro.

O relatório agrupa as pendências por quem deve resolver. `--aplicar` altera somente Etapa,
Precisa de você e Gates. Evidência, veredito, critério, resumo e listas de verificação nunca são
preenchidos pelo script: são cobrados do responsável.

## Formato do export

Uma lista de cards, ou `{"cards": [...]}`. Cada card:

```json
{"repo": "dono/repo", "number": 14, "title": "[S-014] Título", "status": "in-review",
 "etapa": "Em validação", "precisa": "não", "agent": "backend · be-1", "gates": "R… S… P… Q…",
 "updated_at": "2026-11-15T09:00:00Z", "body": "<corpo da issue>", "log": ["<comentários>"]}
```

Serve quando o `gh` não está disponível: quem tem acesso ao GitHub por outro meio exporta o
quadro nesse formato e o auditor confere.

## Limites

- **O modo ao vivo não foi testado contra o GitHub real.** Ele depende do formato de saída do
  `gh project item-list` e `field-list`; confira no primeiro uso. O modo por arquivo tem testes.
- O GitHub não impede ninguém de mover um card. A auditoria detecta depois; não bloqueia antes.
- A auditoria confere estrutura e coerência, não verdade: um link de evidência pode apontar para
  nada. Os gates e a reexecução de evidência pelo principal cobrem isso.
- As views do quadro são criadas na interface; a CLI do GitHub não cria views.
