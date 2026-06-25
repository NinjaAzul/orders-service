# Claude Adapter

## Objetivo

Adaptador local gerado para Claude Code.

As regras reais do projeto são agnósticas e ficam em:

- `AGENTS.md`
- `docs/agent-guides/`
- `docs/specs/00-index.md`

## Regra

Não duplicar padrões aqui.

Este diretório deve conter apenas adaptações específicas do Claude Code quando necessário.

Claude Code não precisa ter uma cópia das skills do Cursor.

Quando uma tarefa exigir um padrão do projeto, use o guia agnóstico correspondente:

- implementação: `docs/agent-guides/order-service-spec-driven.md`
- qualidade: `docs/agent-guides/code-quality-gate.md`
- documentação externa: `docs/agent-guides/mcp-docs-gate.md`
- commits: `docs/agent-guides/commit-message-standard.md`
- descrição de PR: `docs/agent-guides/generate-pr-description.md`

## Fluxo

1. Ler `AGENTS.md`.
2. Ler `docs/specs/00-index.md`.
3. Ler os guias em `docs/agent-guides/`.
4. Seguir as specs relevantes.
