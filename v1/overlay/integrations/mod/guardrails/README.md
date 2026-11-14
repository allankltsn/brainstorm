# Mod guardrails

Transforma em controle técnico parte das regras que hoje são só texto (`policies/safety.md`, `policies/untrusted-content.md`). São hooks de comando em Python, só com biblioteca padrão.

| Hook | Evento | O que faz |
|---|---|---|
| `guarda_bash.py` | PreToolUse (Bash) | **Nega:** `rm -r` em alvo amplo, push forçado, push em ou a partir de ramo protegido, `--no-verify`, `curl \| sh`, despejo de variáveis de ambiente, comando que expõe ou versiona arquivo sensível. **Pede confirmação:** `kubectl`, `helm`, `terraform`, `wrangler deploy`, `vercel --prod`, migrações do Prisma, `publish`, `gh pr merge`, `docker push`, `ssh`, SQL destrutivo |
| `guarda_arquivos.py` | PreToolUse (Read, Edit, Write, MultiEdit, NotebookEdit, Grep) | Nega ler ou editar `.env`, chaves e credenciais; nega gravar conteúdo com padrão de segredo (informa a classe, nunca o valor); nega editar o estado do mod |
| `orcamento.py` | PreToolUse (todas) | Teto por sessão de chamadas, subagentes e tokens (aproximado); barra a mesma chamada repetida em sequência |
| `conteudo_externo.py` | PostToolUse (WebFetch, WebSearch, MCP) | Marca a sessão que leu conteúdo externo, alerta em padrões de prompt injection e reforça a confirmação de comandos de produção |

## Instalar

A partir da árvore montada (veja o README da `v1`):

```bash
python install.py <projeto> --mod guardrails
```

O instalador copia o mod para `<projeto>/.claude/mods/guardrails`, o script para `<projeto>/.claude/scripts/guardrails.py`, registra o marketplace local `guilda-mods`, instala o plugin pelo próprio Claude Code e acrescenta a linha em `docs/operations/registro-instalacoes.md`.

## Configurar

`<projeto>/.claude/guardrails/config.json` (opcional; o agente não consegue editar este arquivo):

```json
{
  "ramos_protegidos": ["main", "master"],
  "orcamento": {"max_chamadas": 400, "max_subagentes": 30, "max_repeticoes": 5, "max_tokens": 0},
  "producao_apos_conteudo_externo": "perguntar",
  "bash_negar": [],
  "bash_perguntar": []
}
```

`max_tokens` 0 desliga o teto de tokens. `producao_apos_conteudo_externo` aceita `perguntar` ou `negar`. `bash_negar` e `bash_perguntar` são expressões regulares próprias do projeto.

## Orçamento

Rode você mesmo, no terminal, na raiz do projeto:

```bash
python .claude/scripts/guardrails.py status
python .claude/scripts/guardrails.py renovar --chamadas 200 --por "Seu Nome"
python .claude/scripts/guardrails.py limites --max-chamadas 600
```

Se o agente tentar renovar, o hook pede a sua confirmação.

## Remover

```bash
claude plugin uninstall guardrails@guilda-mods --scope project
```

Depois apague `.claude/mods/guardrails`, `.claude/scripts/guardrails.py` e `.claude/guardrails/`.

## Limites conhecidos

- **Barreira, não sandbox.** Um comando ofuscado pode escapar. Menor privilégio e aprovação humana para produção continuam necessários.
- **Tokens aproximados:** a soma lê a transcrição principal e não inclui subagentes. O teto de chamadas é o controle confiável.
- **Python no PATH:** os hooks chamam `python3`. No Windows, monte com `--python python` (ou `py`).
- **Falha do hook não trava a sessão:** erro interno é reportado como aviso e a ação segue.
- **Testado com entradas simuladas** e validado com `claude plugin validate`; confira o disparo numa sessão real no primeiro uso.
