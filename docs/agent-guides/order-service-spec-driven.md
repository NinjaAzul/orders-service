# Order Service Spec Driven

## Objetivo

Guiar qualquer agente a implementar o projeto a partir das specs locais.

Este guia é agnóstico à IDE e pode ser usado por Cursor, Claude Code ou qualquer outro agente.

## Fonte de Verdade

Antes de implementar, leia somente as specs relevantes:

- `docs/specs/01-system-design.md`
- `docs/specs/02-backend-tooling.md`
- `docs/specs/03-modelagem-dados.md`
- `docs/specs/04-api-graphql.md`
- `docs/specs/05-regras-negocio-transacoes.md`
- `docs/specs/06-cache-performance.md`
- `docs/specs/07-estrategia-testes.md`
- `docs/specs/08-load-testing-stack.md`
- `docs/specs/09-observability-logs-traces.md`
- `docs/specs/10-code-quality-standards.md`
- `docs/specs/11-project-agent-skills.md`
- `docs/specs/12-readme-entrega.md`

## Workflow

1. Identificar qual spec controla a mudança.
2. Ler só as seções relevantes.
3. Implementar seguindo a decisão existente.
4. Se surgir decisão nova, atualizar a spec antes do código.
5. Rodar validações aplicáveis.
6. Atualizar README apenas no final.

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
