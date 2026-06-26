---
name: graphql-api-workflow
description: Guides GraphQL API changes in the order service. Use when changing resolvers, inputs, types, mappers, queries, mutations, pagination, schema, or public API contract.
---

# GraphQL API Workflow

## Adapter

This Cursor skill delegates to the IDE-agnostic guide:

- `docs/agent-guides/graphql-api-workflow.md`

## Workflow

1. Read `docs/agent-guides/graphql-api-workflow.md`.
2. Read the GraphQL spec before changing API shape.
3. Keep resolvers thin and route business flow through use cases.
4. Validate build and tests.
