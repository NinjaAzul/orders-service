---
name: observability-debugging
description: Guides observability work and debugging. Use when adding or validating logs, traces, OpenTelemetry spans, Grafana, Tempo, Loki, Alloy, Collector, or runtime diagnostics.
---

# Observability Debugging

## Adapter

This Cursor skill delegates to the IDE-agnostic guide:

- `docs/agent-guides/observability-debugging.md`

## Workflow

1. Read `docs/agent-guides/observability-debugging.md`.
2. Use structured JSON logs and manual spans for critical operations.
3. Validate with Loki and Tempo when runtime stack is available.
4. Do not log secrets, `.env`, tokens, or full sensitive payloads.
