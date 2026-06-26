# Gemini Project Instructions

## Project Entry Point

Read `AGENTS.md` first.

Gemini CLI should use this file only as an adapter. The shared instructions live in:

- `AGENTS.md`
- `docs/agent-guides/`
- `docs/specs/00-index.md`

## Required Flow

1. Read `AGENTS.md`.
2. Read `docs/specs/00-index.md`.
3. Select only the relevant `docs/agent-guides/` files.
4. Follow specs before changing code.
5. Use `docs/memory/` only for temporary notes.
6. Do not read or expose `.env`.

## Guide Map

- Implementation: `docs/agent-guides/order-service-spec-driven.md`
- Code quality: `docs/agent-guides/code-quality-gate.md`
- External docs: `docs/agent-guides/mcp-docs-gate.md`
- Commits: `docs/agent-guides/commit-message-standard.md`
- PR descriptions: `docs/agent-guides/generate-pr-description.md`
- Docker/local dev: `docs/agent-guides/local-dev-docker-stack.md`
- GraphQL/API: `docs/agent-guides/graphql-api-workflow.md`
- Database/transactions: `docs/agent-guides/database-transaction-safety.md`
- Cache/performance: `docs/agent-guides/cache-performance-workflow.md`
- Observability/debugging: `docs/agent-guides/observability-debugging.md`
- Tests/load testing: `docs/agent-guides/testing-load-testing.md`

## Validation

For code changes, prefer:

```bash
npm run quality:check
npm run build
```
