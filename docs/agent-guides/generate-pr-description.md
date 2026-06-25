# Generate PR Description

## Objetivo

Gerar uma descrição enxuta de Pull Request em português, com no máximo 4000 caracteres, usando a branch atual, a issue Jira e os commits reais da branch.

Este guia é agnóstico à IDE e pode ser usado por Cursor, Claude Code ou outro agente.

## Quando Usar

Use quando o usuário pedir:

- descrição de PR;
- resumo de Pull Request;
- texto para Azure DevOps;
- `/generate-pr-description`.

## Saída Esperada

Salvar o arquivo em:

```txt
.claude/pr-descriptions/<ID-JIRA>.md
```

Depois, exibir o conteúdo completo formatado na resposta.

## 1. Identificar a Issue do Jira

Execute:

```bash
git branch --show-current
```

Extraia o ID da issue do nome da branch.

Padrões comuns:

```txt
FPSMS-123
feat/FPSMS-123-descricao
FPSMS-123-descricao
```

Exemplo:

```txt
feat/FPSMS-456 -> FPSMS-456
```

Se não encontrar ID Jira, pare e peça a issue ao usuário.

## 2. Buscar Detalhes da Issue

Use MCP Atlassian:

```txt
server: plugin-atlassian-atlassian
toolName: getJiraIssue
```

Argumentos:

```json
{
  "cloudId": "d3f143bc-efd4-4db9-a73d-ddfe4cf9950a",
  "issueIdOrKey": "<ID extraído da branch>",
  "responseContentFormat": "markdown"
}
```

Antes de chamar o MCP, leia o schema/descriptor da ferramenta quando o ambiente exigir.

Extraia:

- título;
- descrição;
- tipo da issue.

Mapeie o tipo Jira:

| Jira                        | PR       |
| --------------------------- | -------- |
| Story / Epic / New Feature  | Feature  |
| Bug                         | Bug      |
| Task / Sub-task sem feature | Chore    |
| Refactor / Technical debt   | Refactor |

## 3. Analisar Apenas Commits da Branch

Execute:

```bash
git log develop..HEAD --oneline --no-merges
```

Use somente esses commits.

Para cada commit listado, execute:

```bash
git show --stat <hash>
```

Regras:

- ignore merges;
- ignore arquivos que aparecem apenas em `git diff develop...HEAD`, mas não aparecem nos commits listados;
- não use mudanças de outras branches já mergeadas em `develop`.

## 4. Inferir Produto

Inferir produto pelos paths alterados:

| Path            | Produto |
| --------------- | ------- |
| `layers/do/`    | D&O     |
| `layers/rural/` | Rural   |
| `layers/vida/`  | Vida    |
| `layers/admin/` | Admin   |

Se houver múltiplas layers, listar todas.

Se não houver layer identificável, usar `Não identificado`.

## 5. Montar Descrição

O documento inteiro deve ter no máximo 4000 caracteres.

Template:

```markdown
# <Título resumido>

| Campo       | Valor                                                   |
| ----------- | ------------------------------------------------------- |
| **Issue**   | [<ID>](https://fairfaxbrasil.atlassian.net/browse/<ID>) |
| **Tipo**    | <Feature / Bug / Chore / Refactor>                      |
| **Produto** | <ex: D&O, Rural, Vida>                                  |
| **Branch**  | `<nome-da-branch>`                                      |

---

## Contexto

> <1-2 frases: problema de negócio ou motivação da mudança.>

---

## O que foi feito

### <Grupo 1>

- **`NomeDoArquivoOuComposable`** — <descrição em uma linha do que mudou e por quê>

### <Grupo 2>

- ...

---

## Screenshots / Referências

> _(Adicione prints ou links do Figma se necessário)_
```

Agrupe arquivos por domínio:

- componentes;
- composables;
- i18n;
- testes;
- services;
- hooks;
- infra/config;
- outros.

Omitir:

- lockfile;
- mudanças triviais;
- formatação pura;
- arquivos sem relevância para revisão.

## 6. Salvar Arquivo

Criar diretório se não existir:

```txt
.claude/pr-descriptions/
```

Salvar em:

```txt
.claude/pr-descriptions/<ID-JIRA>.md
```

Use a ferramenta de escrita disponível no agente/IDE.

## 7. Confirmar Para o Usuário

Responder com:

- caminho do arquivo gerado;
- confirmação de que o conteúdo pode ser colado diretamente no PR do Azure DevOps;
- conteúdo completo formatado.

## Restrições

- Responder em português.
- Máximo de 4000 caracteres no arquivo final.
- Ser conciso.
- Usar apenas commits reais da branch.
- Não incluir arquivos de outras branches.
- Não inventar contexto que não esteja no Jira ou nos commits.
