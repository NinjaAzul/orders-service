# 00 - Índice de Specs

## Objetivo

Servir como ponto único de entrada para agentes e pessoas entenderem quais specs existem e quais devem ser lidas para cada tipo de tarefa.

Este arquivo reduz custo de contexto: leia primeiro o índice, depois abra apenas as specs relevantes.

## Ordem das Specs

| Spec                                         | Quando ler                                                                                     |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `foundation/01-system-design.md`             | Arquitetura Docker, componentes de infraestrutura, rede, volumes e observabilidade no Compose. |
| `foundation/02-backend-tooling.md`           | Stack backend, NestJS, Kysely, Zod, Redis, OpenTelemetry e estrutura de pastas.                |
| `foundation/03-modelagem-dados.md`           | Tabelas, campos, constraints, índices, status de pedido e idempotência.                        |
| `foundation/04-api-graphql.md`               | Types, queries, mutations, inputs, paginação e erros GraphQL.                                  |
| `foundation/05-regras-negocio-transacoes.md` | Regras permanentes de usuário, produto, pedido, estoque, transações e idempotência.            |
| `quality/06-cache-performance.md`            | Redis, cache, paginação, índices, N+1, pool e performance.                                     |
| `quality/07-estrategia-testes.md`            | Testes unitários, integração, e2e, cache e concorrência.                                       |
| `quality/08-load-testing-stack.md`           | k6, scripts de carga, cenários, métricas e thresholds.                                         |
| `quality/09-observability-logs-traces.md`    | Logs, traces, spans, correlation id, Tempo, Loki e Grafana.                                    |
| `quality/10-code-quality-standards.md`       | ESLint, Prettier, TypeScript strict, Husky, lint-staged e quality gates.                       |
| `quality/11-ci-cd-github-actions.md`         | Workflow GitHub Actions, lint, format check, testes, build e serviços de CI.                   |
| `process/12-project-agent-skills.md`         | Guias agnósticos, adaptadores Cursor, MCP/Context7 e política de agentes.                      |
| `process/13-readme-entrega.md`               | Estrutura final do README e pontos de comunicação da entrega.                                  |

## Pastas

| Pasta         | Uso                                                                      |
| ------------- | ------------------------------------------------------------------------ |
| `foundation/` | Decisões permanentes que definem a base do projeto.                      |
| `quality/`    | Padrões permanentes de qualidade, testes, performance e observabilidade. |
| `process/`    | Processo, agentes, guias e documentação final.                           |
| `features/`   | Specs temporárias de features durante desenvolvimento.                   |
| `archive/`    | Histórico de specs substituídas ou encerradas.                           |

## Mapa Por Tipo de Trabalho

### Setup Inicial do Projeto

Ler:

- `foundation/01-system-design.md`
- `foundation/02-backend-tooling.md`
- `quality/10-code-quality-standards.md`
- `quality/11-ci-cd-github-actions.md`

### Banco de Dados

Ler:

- `foundation/03-modelagem-dados.md`
- `foundation/05-regras-negocio-transacoes.md`
- `quality/06-cache-performance.md`

### GraphQL

Ler:

- `foundation/04-api-graphql.md`
- `foundation/05-regras-negocio-transacoes.md`
- `quality/07-estrategia-testes.md`

### Pedido e Estoque

Ler:

- `foundation/03-modelagem-dados.md`
- `foundation/05-regras-negocio-transacoes.md`
- `quality/07-estrategia-testes.md`
- `quality/09-observability-logs-traces.md`

### Cache e Performance

Ler:

- `quality/06-cache-performance.md`
- `quality/08-load-testing-stack.md`
- `quality/09-observability-logs-traces.md`

### Observabilidade

Ler:

- `foundation/01-system-design.md`
- `foundation/02-backend-tooling.md`
- `quality/09-observability-logs-traces.md`

### Qualidade de Código

Ler:

- `quality/10-code-quality-standards.md`
- `quality/07-estrategia-testes.md`
- `quality/11-ci-cd-github-actions.md`

### CI/CD

Ler:

- `quality/10-code-quality-standards.md`
- `quality/11-ci-cd-github-actions.md`
- `quality/07-estrategia-testes.md`

### Feature Nova

Ler:

- `features/README.md`
- specs permanentes relacionadas à feature.

Criar contexto temporário em:

- `features/YYYY-MM-DD-feature-name/`

### README Final

Ler:

- `process/13-readme-entrega.md`
- specs citadas pela seção que será documentada.

## Regra Para Agentes

1. Ler este índice primeiro.
2. Selecionar no máximo 2 a 4 specs relevantes para a tarefa.
3. Não carregar todas as specs sem necessidade.
4. Se for feature temporária, criar contexto em `features/`.
5. Se uma decisão nova virar permanente, atualizar a spec responsável.
6. Manter `process/13-readme-entrega.md` para a etapa final.
