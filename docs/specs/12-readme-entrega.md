# 12 - README e Entrega

## Objetivo

Definir a estrutura esperada do README final e os pontos que devem ser comunicados na entrega.

Esta spec cobre:

- Estrutura do README.
- Instruções de execução.
- Decisões técnicas.
- Trade-offs.
- Testes.
- Melhorias futuras.

## Estrutura Recomendada

```md
# Order Service

## Visão Geral

## Arquitetura

## Stack

## Como Executar

## Variáveis de Ambiente

## API GraphQL

## Modelagem de Dados

## Regras de Negócio

## Estratégia de Performance

## Observabilidade

## Testes

## Teste de Carga

## Qualidade de Código

## Project Agent Skills

## Decisões Técnicas

## Trade-offs

## O Que Faria Diferente Com Mais Tempo
```

## Visão Geral

O README deve explicar em poucas linhas:

- o sistema gerencia usuários, produtos e pedidos;
- a API é GraphQL;
- PostgreSQL é a fonte da verdade;
- Redis é usado como cache;
- pedidos são tratados com foco em consistência de estoque.

## Arquitetura

Referenciar a spec:

- `docs/specs/01-system-design.md`

Pontos a citar:

- execução local com Docker Compose;
- API, PostgreSQL e Redis em containers;
- Grafana, Tempo, Loki e Collector em containers;
- somente API e Grafana expostos para acesso local;
- banco, cache e backends de observabilidade acessíveis pela rede interna.

## Stack

Referenciar a spec:

- `docs/specs/02-backend-tooling.md`

Pontos a citar:

- Node.js com TypeScript;
- NestJS;
- GraphQL;
- Kysely com `pg`;
- PostgreSQL;
- Redis com `ioredis`;
- Zod;
- Jest;
- Logger padrão do NestJS;
- OpenTelemetry;
- Grafana;
- Tempo;
- Loki.

## Como Executar

Comandos esperados:

```bash
npm install
docker compose up -d
npm run migrate
npm run start:dev
```

Ou, se a API também rodar em container:

```bash
docker compose up --build
```

## Variáveis de Ambiente

O README deve listar variáveis necessárias sem expor valores sensíveis.

Exemplo:

```txt
PORT
DATABASE_URL
REDIS_HOST
REDIS_PORT
OTEL_SERVICE_NAME
OTEL_EXPORTER_OTLP_ENDPOINT
OTEL_TRACES_ENABLED
LOG_LEVEL
```

Observação:

- valores reais não devem ser versionados;
- um arquivo de exemplo pode ser usado para documentação.

## API GraphQL

Referenciar a spec:

- `docs/specs/04-api-graphql.md`

Pontos a citar:

- endpoint GraphQL;
- queries disponíveis;
- mutations disponíveis;
- exemplo de `createOrder`;
- principais códigos de erro.

## Modelagem de Dados

Referenciar a spec:

- `docs/specs/03-modelagem-dados.md`

Pontos a citar:

- tabelas principais;
- relacionamentos;
- constraints;
- índices;
- idempotência em pedidos;
- preço histórico em itens do pedido.

## Regras de Negócio

Referenciar a spec:

- `docs/specs/05-regras-negocio-transacoes.md`

Pontos a citar:

- criação de pedido é transacional;
- estoque é controlado no PostgreSQL;
- baixa de estoque deve ser atômica;
- Redis não faz parte da confirmação do pedido;
- idempotência reduz risco de pedido duplicado.

## Estratégia de Performance

Referenciar a spec:

- `docs/specs/06-cache-performance.md`

Pontos a citar:

- paginação nas listagens;
- índices;
- cache com Redis;
- invalidação de cache;
- mitigação de N+1 em GraphQL;
- pool de conexão com banco.

## Observabilidade

Referenciar a spec:

- `docs/specs/09-observability-logs-traces.md`

Pontos a citar:

- Grafana para visualizar logs e traces;
- Tempo para armazenar traces;
- Loki para armazenar logs;
- OpenTelemetry Collector ou Grafana Alloy para coleta;
- OpenTelemetry na API para instrumentação;
- logs estruturados no stdout da aplicação;
- traces exportados via OTLP;
- `requestId` e `correlationId` para correlacionar logs e traces;
- spans por resolver, validação, use case, repositório, banco e cache.

## Testes

Referenciar a spec:

- `docs/specs/07-estrategia-testes.md`

Comandos esperados:

```bash
npm test
npm run test:e2e
```

Pontos a citar:

- testes unitários para use cases;
- testes de integração para repositórios;
- teste de concorrência de estoque;
- testes e2e para GraphQL.

## Teste de Carga

Referenciar a spec:

- `docs/specs/08-load-testing-stack.md`

Comando esperado:

```bash
k6 run load-tests/scripts/list-products.js
```

Pontos a citar:

- k6 como ferramenta de carga;
- scripts versionados em `load-tests`;
- cenários de leitura, escrita e concorrência;
- métricas p95, p99, taxa de erro e throughput;
- thresholds iniciais para entender limites do MVP.

## Qualidade de Código

Referenciar a spec:

- `docs/specs/10-code-quality-standards.md`

Comandos esperados:

```bash
npm run lint
npm run format:check
npm run quality:check
```

Pontos a citar:

- ESLint para análise estática;
- Prettier para formatação;
- TypeScript strict;
- Husky para hooks locais;
- lint-staged no pre-commit;
- lint, formatação e testes no pre-push;
- bloqueio de `any`, variáveis não usadas e formatação inconsistente.

## Project Agent Skills

Referenciar a spec:

- `docs/specs/11-project-agent-skills.md`

Guias agnósticos:

- `docs/agent-guides/mcp-docs-gate.md`
- `docs/agent-guides/order-service-spec-driven.md`
- `docs/agent-guides/code-quality-gate.md`

Adaptadores Cursor:

- `mcp-docs-gate`
- `order-service-spec-driven`
- `code-quality-gate`

Pontos a citar:

- guias agnósticos ficam em `docs/agent-guides`;
- adaptadores do Cursor ficam em `.cursor/skills`;
- outros agentes, como Claude Code, devem ler os guias agnósticos;
- `mcp-docs-gate` obriga consulta MCP/Context7 quando documentação atual é necessária;
- `order-service-spec-driven` guia implementação a partir das specs locais;
- `code-quality-gate` reforça lint, formatação, hooks e testes antes de finalizar mudanças.

## Decisões Técnicas

Decisões para destacar:

- NestJS pela organização modular.
- Kysely para evitar ORM completo e manter controle das queries.
- PostgreSQL como fonte da verdade.
- Redis apenas como cache.
- Zod para validação explícita.
- Jest para testes.
- OpenTelemetry para traces.
- Grafana, Tempo e Loki para observabilidade local.
- ESLint, Prettier, Husky e lint-staged para padronização.
- Guias agnósticos de agente para reforçar padrões do projeto.
- Adaptadores Cursor apenas como ponte para os guias compartilháveis.
- Clean Architecture para separar regras e infraestrutura.

## Trade-offs

Trade-offs para explicar:

- Kysely demanda mais código manual que ORM completo, mas dá mais controle.
- Redis melhora leitura, mas adiciona invalidação de cache.
- Docker Compose simplifica execução local, mas não representa uma produção completa.
- Observabilidade local adiciona containers, mas facilita investigar requests e falhas.
- Logger padrão é suficiente no MVP, mas logs estruturados com Pino seriam melhores em produção.
- Hooks locais aumentam a disciplina de qualidade, mas podem tornar commits e pushes um pouco mais lentos.
- Guias de agente ajudam consistência entre IDEs, mas precisam ser mantidos junto com as specs.
- Offset pagination é simples, mas cursor pagination escala melhor para grandes volumes.

## O Que Faria Diferente Com Mais Tempo

Melhorias futuras:

- Kubernetes.
- API Gateway ou Ingress.
- Elasticsearch para busca avançada de produtos.
- Mensageria para eventos assíncronos.
- Outbox pattern para integração confiável.
- Workers para indexação e processamento.
- Read replicas no PostgreSQL.
- Observabilidade com métricas, logs estruturados e tracing.
- Dashboards de observabilidade mais completos.
- Alertas baseados em taxa de erro e latência.
- Rate limit.
- Autenticação e autorização.
- Auditoria de alterações de estoque.
- Pipeline de CI com testes automatizados.

## Critério de README Completo

O README estará completo quando uma pessoa conseguir:

- entender a arquitetura;
- rodar o projeto;
- acessar a API;
- executar testes;
- entender as decisões técnicas;
- entender os trade-offs;
- entender os próximos passos possíveis.
