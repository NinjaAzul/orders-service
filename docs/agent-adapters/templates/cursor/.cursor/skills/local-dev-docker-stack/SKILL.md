---
name: local-dev-docker-stack
description: Guides local Docker stack work for the order service. Use when building, starting, validating, or debugging Docker Compose, API, PostgreSQL, Redis, Grafana, Tempo, Loki, Alloy, or OpenTelemetry Collector.
---

# Local Dev Docker Stack

## Adapter

This Cursor skill delegates to the IDE-agnostic guide:

- `docs/agent-guides/local-dev-docker-stack.md`

## Workflow

1. Read `docs/agent-guides/local-dev-docker-stack.md`.
2. Validate commands against the current Docker/Compose state.
3. Do not read or expose `.env`.
4. Report containers, health check, and relevant logs.
