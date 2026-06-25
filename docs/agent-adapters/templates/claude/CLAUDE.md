# CLAUDE

## Project Entry Point

Read `AGENTS.md` first.

This repository keeps IDE-agnostic agent instructions in:

- `docs/agent-guides/`

Generated Claude-specific local files live in:

- `.claude/`

## Required Flow

1. Start with `docs/specs/00-index.md`.
2. Use `docs/agent-guides/spec-workflow.md`.
3. Read only the relevant specs.
4. Use `docs/memory/` only for temporary notes.
5. Promote stable decisions into specs.
6. Keep README updates for final delivery.

## Guide Map

- Implementation: `docs/agent-guides/order-service-spec-driven.md`
- Code quality: `docs/agent-guides/code-quality-gate.md`
- External docs: `docs/agent-guides/mcp-docs-gate.md`
- Commits: `docs/agent-guides/commit-message-standard.md`
- PR descriptions: `docs/agent-guides/generate-pr-description.md`

## Documentation Policy

For library/framework/tooling work, use current documentation.

If MCP/Context7 or equivalent docs access is required but unavailable, stop and tell the user what needs to be configured.
