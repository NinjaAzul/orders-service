# Agent Guides

## Objetivo

Guias agnósticos para qualquer agente ou IDE.

Use estes arquivos em Cursor, Claude Code ou outra ferramenta.

## Guias

- `spec-workflow.md`: como trabalhar com specs, memory, features e archive.
- `order-service-spec-driven.md`: como implementar seguindo specs do projeto.
- `mcp-docs-gate.md`: quando consultar documentação atual via MCP/Context7.
- `code-quality-gate.md`: validações de qualidade antes de finalizar código.
- `generate-pr-description.md`: como gerar descrição enxuta de PR a partir de branch, Jira e commits.
- `commit-message-standard.md`: padrão de mensagens de commit com ticket opcional, tipo e descrição curta.

## Entry Points

Entry point universal:

- `AGENTS.md`

Templates de adaptadores:

- `docs/agent-adapters/README.md`
- `docs/agent-adapters/templates/`

Gerar adaptadores locais:

```bash
scripts/setup-agent-adapters.sh
```

Adaptador Claude Code gerado:

- `CLAUDE.md`
- `.claude/README.md`

Adaptadores Cursor gerados:

- `.cursor/rules/`
- `.cursor/skills/`

## Regra

As regras principais devem ficar aqui.

Adaptadores específicos de IDE devem ser curtos e apontar para estes guias.
