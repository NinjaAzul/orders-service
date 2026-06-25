---
name: generate-pr-description
description: Gera uma descrição enxuta de PR em português, com no máximo 4000 caracteres, salva em .claude/pr-descriptions/<ID-JIRA>.md e exibe o conteúdo formatado. Use quando o usuário pedir descrição de PR, resumo de pull request, texto para Azure DevOps, ou mencionar /generate-pr-description.
---

# Generate PR Description

## Adapter

This Cursor skill delegates to the IDE-agnostic guide:

- `docs/agent-guides/generate-pr-description.md`

## Instructions

1. Read `docs/agent-guides/generate-pr-description.md`.
2. Follow the guide exactly.
3. Save the generated PR description in `.claude/pr-descriptions/<ID-JIRA>.md`.
4. Show the complete formatted content to the user.
