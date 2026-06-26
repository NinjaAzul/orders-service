# AGENTS

## Objetivo

Este é o entry point agnóstico para qualquer agente trabalhando neste repositório.

Use este arquivo em Cursor, Claude Code ou outro agente.

## Ordem Obrigatória

1. Leia `docs/specs/00-index.md`.
2. Leia `docs/agent-guides/spec-workflow.md`.
3. Se a tarefa envolver implementação, leia `docs/agent-guides/order-service-spec-driven.md`.
4. Se a tarefa envolver ferramenta, biblioteca ou configuração, leia `docs/agent-guides/mcp-docs-gate.md`.
5. Se a tarefa envolver código, testes ou setup, leia `docs/agent-guides/code-quality-gate.md`.

## Guias Por Cenário

- Implementação: `docs/agent-guides/order-service-spec-driven.md`
- Qualidade: `docs/agent-guides/code-quality-gate.md`
- Documentação externa: `docs/agent-guides/mcp-docs-gate.md`
- Commits: `docs/agent-guides/commit-message-standard.md`
- Descrição de PR: `docs/agent-guides/generate-pr-description.md`
- Docker/local dev: `docs/agent-guides/local-dev-docker-stack.md`
- GraphQL/API: `docs/agent-guides/graphql-api-workflow.md`
- Banco/transações: `docs/agent-guides/database-transaction-safety.md`
- Cache/performance: `docs/agent-guides/cache-performance-workflow.md`
- Observabilidade/debug: `docs/agent-guides/observability-debugging.md`
- Testes/carga: `docs/agent-guides/testing-load-testing.md`

## Fonte de Verdade

```txt
specs = fonte de verdade
memory = temporário
README = comunicação final
```

## Specs

Comece sempre por:

- `docs/specs/00-index.md`

Specs permanentes:

- `docs/specs/foundation/`
- `docs/specs/quality/`
- `docs/specs/process/`

Specs temporárias de feature:

- `docs/specs/features/`

Histórico:

- `docs/specs/archive/`

## Memory

Use `docs/memory/` apenas para notas temporárias:

- `docs/memory/decisions.md`
- `docs/memory/implementation-notes.md`
- `docs/memory/open-questions.md`

Promova decisões estáveis para a spec correta.

## Regras de Documentação Externa

Para tarefas envolvendo bibliotecas, frameworks, SDKs, CLIs ou configurações:

- consultar documentação atual;
- preferir MCP/Context7 quando disponível;
- parar e avisar se a documentação necessária não estiver acessível;
- não seguir de memória em tarefas docs-sensitive, salvo pedido explícito.

## Validação

Antes de finalizar código, seguir:

- `docs/agent-guides/code-quality-gate.md`

Checks esperados:

```bash
npm run lint
npm run format:check
npm test
```

Para entrega:

```bash
npm run test:e2e
```

## Commits

Quando o usuário pedir commit ou uma etapa/spec for concluída, seguir:

- `docs/agent-guides/commit-message-standard.md`

Formato:

```txt
[TICKET-123] - TYPE - descrição curta no imperativo
TYPE - descrição curta no imperativo
```

## Adaptadores Por IDE

Adaptadores específicos de IDE são gerados localmente por ambiente e ignorados pelo Git.

A fonte de verdade continua sendo:

- `AGENTS.md`
- `docs/agent-guides/`
- `docs/specs/00-index.md`

Não prender o projeto a Cursor, Claude Code, VS Code/Copilot ou Gemini.

Gerar todos:

```bash
scripts/setup-agent-adapters.sh
```

Cursor:

- `.cursor/rules/`
- `.cursor/skills/`

Claude Code:

- `CLAUDE.md`
- `.claude/README.md`

GitHub Copilot:

- `.github/copilot-instructions.md`

VS Code com GitHub Copilot:

```bash
scripts/setup-agent-adapters.sh vscode
```

Gemini CLI:

- `GEMINI.md`

Esses adaptadores devem apontar para os guias agnósticos, não duplicar regras.
