---
name: cache-performance-workflow
description: Guides cache and performance changes. Use when working with Redis, product cache, invalidation, pagination, indexes, N+1 risks, query performance, or list endpoints.
---

# Cache Performance Workflow

## Adapter

This Cursor skill delegates to the IDE-agnostic guide:

- `docs/agent-guides/cache-performance-workflow.md`

## Workflow

1. Read `docs/agent-guides/cache-performance-workflow.md`.
2. Keep Redis outside critical writes.
3. Preserve cache invalidation and observability.
4. Validate performance-sensitive behavior with tests or documented checks.
