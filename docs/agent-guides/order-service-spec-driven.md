# Order Service Spec Driven

## Objetivo

Guiar qualquer agente a implementar o projeto a partir das specs locais.

Este guia é agnóstico à IDE e pode ser usado por Cursor, Claude Code ou qualquer outro agente.

## Fonte de Verdade

Antes de implementar, leia primeiro:

- `docs/specs/00-index.md`
- `docs/agent-guides/spec-workflow.md`

Depois, leia somente as specs relevantes:

- `docs/specs/foundation/01-system-design.md`
- `docs/specs/foundation/02-backend-tooling.md`
- `docs/specs/foundation/03-modelagem-dados.md`
- `docs/specs/foundation/04-api-graphql.md`
- `docs/specs/foundation/05-regras-negocio-transacoes.md`
- `docs/specs/quality/06-cache-performance.md`
- `docs/specs/quality/07-estrategia-testes.md`
- `docs/specs/quality/08-load-testing-stack.md`
- `docs/specs/quality/09-observability-logs-traces.md`
- `docs/specs/quality/10-code-quality-standards.md`
- `docs/specs/process/12-project-agent-skills.md`
- `docs/specs/process/13-readme-entrega.md`

## Workflow

1. Ler `docs/specs/00-index.md`.
2. Selecionar de 2 a 4 specs relevantes.
3. Ler só as seções necessárias.
4. Implementar seguindo a decisão existente.
5. Se surgir decisão nova, registrar em `docs/memory/decisions.md`.
6. Promover decisão estável para a spec responsável.
7. Rodar validações aplicáveis.
8. Atualizar README apenas no final.

## Guardrails

- PostgreSQL é fonte da verdade.
- Redis não participa do caminho crítico de escrita.
- Kysely é o acesso ao banco, não ORM completo.
- Zod é a validação de entrada.
- Jest cobre testes principais.
- OpenTelemetry cobre traces.
- Grafana, Tempo e Loki compõem observabilidade local.
- ESLint, Prettier, Husky e lint-staged protegem qualidade.

## Resultado Esperado

Toda implementação deve conseguir responder:

- qual spec foi seguida;
- qual decisão técnica foi aplicada;
- quais testes/validações foram executados;
- se algum ponto ficou fora do escopo.
