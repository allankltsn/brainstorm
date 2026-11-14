---
name: checklist-release
description: Monta o checklist de go-live de um release com evidência por item (gates, versão, migrações, configuração, observabilidade, rollback e comunicação). Use na fase de Entrega, antes de qualquer deploy em produção ou quando pedirem checklist de release, go-live ou plano de rollback.
---

# Checklist de release

Grave em `docs/07-entrega/checklist-release.md`. Cada item marcado precisa de **evidência** (link, comando e resultado, ou caminho do arquivo). Item sem evidência fica desmarcado, com o motivo.

```markdown
# Release <versão> (<AAAA-MM-DD>)

Snapshot liberado: <SHA por repositório> | Responsável humano: <nome> | Janela: <data e hora, fuso>

## 1. Escopo
- [ ] Lista de histórias e PRs incluídos: <link>
- [ ] O que ficou de fora e por quê

## 2. Qualidade (no SHA liberado)
- [ ] Revisão técnica aprovada: <caminho>
- [ ] Segurança aprovada: <caminho>
- [ ] Privacidade aprovada (se há dado pessoal): <caminho>
- [ ] QA aprovado: <caminho>
- [ ] Pipeline verde: <link da execução>
- [ ] Sem achado crítico ou alto em aberto (ou risco aceito por <nome>)

## 3. Versão e notas
- [ ] Versão definida (SemVer) e changelog atualizado
- [ ] Notas para o usuário revisadas

## 4. Banco e dados
- [ ] Migrações compatíveis com a versão anterior (expandir antes de contrair)
- [ ] Migração testada em cópia ou ambiente de teste: <evidência>
- [ ] Backup recente confirmado e restauração testada em: <data>

## 5. Configuração
- [ ] Variáveis e segredos novos criados no ambiente (só nomes aqui, nunca valores)
- [ ] Feature flags no estado inicial planejado
- [ ] DNS, certificados e regras de borda conferidos (se mudam)

## 6. Ordem de deploy
1. <componente> <versão>
2. ...

## 7. Verificação pós-deploy
- [ ] Health checks respondendo
- [ ] Teste de fumaça das jornadas críticas: <lista>
- [ ] Erros, latência e saturação dentro dos limites por 30 a 60 minutos: <painel>

## 8. Rollback
| Componente | Versão anterior | Ação proposta | Migração reversível? | Testado? |
Critério para voltar atrás: <limite objetivo> | Quem decide: <nome>

## 9. Comunicação
- [ ] Quem precisa saber antes e depois (equipe, suporte, usuários)

## Decisão
Go / no-go por <nome humano> em <data e hora>.
```

## Regras

- O go/no-go é **humano**. O agente prepara e aponta o que falta.
- Gate aprovado em SHA antigo não vale para código alterado depois: confira o SHA.
- Nunca escreva valor de segredo; só o nome da variável.
- Rollback não testado é registrado como risco, não como item feito.
- Build verde não é deploy feito; deploy feito não é release saudável.
