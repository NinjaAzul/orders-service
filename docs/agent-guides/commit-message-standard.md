# Commit Message Standard

## Objetivo

Padronizar mensagens de commit do projeto para manter histórico claro por spec, feature ou correção.

Use este guia quando:

- o usuário pedir commit;
- uma spec for concluída;
- uma etapa de implementação for finalizada;
- for necessário sugerir ou revisar mensagem de commit.

## Formato

Com ticket:

```txt
[TICKET-123] - TYPE - descrição curta no imperativo
```

Sem ticket:

```txt
TYPE - descrição curta no imperativo
```

## Tipos Permitidos

- `FEAT`: nova feature.
- `FIX`: correção de bug.
- `REFACTOR`: refatoração sem mudança de comportamento.
- `HOTFIX`: correção urgente para produção.
- `DOCS`: specs, README, guias e documentação.
- `CHORE`: setup, scripts, configs e manutenção sem regra de negócio.

## Regras

- Usar sempre letras maiúsculas no tipo.
- Usar descrição curta, em português, no imperativo.
- Não usar ponto final.
- Não misturar assuntos diferentes no mesmo commit.
- Preferir um commit por spec finalizada ou etapa funcional concluída.
- Se houver ticket no nome da branch, usar o ticket no commit.
- Se não houver ticket, omitir o bloco `[TICKET]`.

## Exemplos

```txt
[FPSMS-456] - FEAT - adiciona criação de pedidos
[FPSMS-456] - FIX - corrige validação de estoque
[FPSMS-456] - REFACTOR - reorganiza camada de aplicação
[FPSMS-456] - HOTFIX - corrige falha crítica no checkout
DOCS - adiciona spec de CI/CD
CHORE - configura eslint e prettier
```

## Fluxo Para Agentes

1. Verificar a branch atual com `git branch --show-current`.
2. Extrair ticket se houver padrão como `ABC-123`.
3. Verificar mudanças com `git status` e `git diff`.
4. Escolher o tipo conforme a natureza da alteração.
5. Criar mensagem no formato definido neste guia.
6. Antes de commitar código, seguir `docs/agent-guides/code-quality-gate.md`.

## Escolha do Tipo

- Mudou comportamento para entregar capacidade nova: `FEAT`.
- Corrigiu comportamento quebrado: `FIX`.
- Corrigiu produção com urgência: `HOTFIX`.
- Melhorou estrutura interna sem mudar comportamento: `REFACTOR`.
- Alterou specs, guias ou README: `DOCS`.
- Alterou configuração, scripts ou setup: `CHORE`.
