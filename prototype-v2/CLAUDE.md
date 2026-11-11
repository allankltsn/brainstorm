# prototype-v2 · regras para agentes

## Publicar ao concluir

Ao concluir uma tarefa de protótipo neste repositório, publique sem pedir confirmação (autorizado pelo dono):

1. Confirme que `npm run build` passa e que o trabalho está commitado e enviado na branch da tarefa.
2. Dispare a tarefa agendada **"Sincronizar telas na main"** informando a pasta e a branch, por exemplo `prototype-v2 minha-branch`.
   Ela roda `scripts/sync.sh <pasta> <branch>` na `main`, que copia a pasta para a `main` e faz o push.
   O push na `main` aciona o deploy no GitHub Pages (`.github/workflows/pages.yml`).
3. Sem acesso à tarefa agendada, rode `scripts/sync.sh <pasta> <branch>` a partir da `main`.
4. Informe no fim se a publicação foi feita ou por que falhou. Se o script falhar, mostre a saída e não contorne.

Não publique trabalho pela metade, com build quebrado ou fora das pastas listadas em `scripts/sync.conf`. Nunca edite `init/`.
