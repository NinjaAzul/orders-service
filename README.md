# Order Service

API GraphQL para gerenciar usuários, produtos e pedidos.

O projeto usa PostgreSQL como fonte da verdade, Redis como cache e foco em consistência na criação de pedidos.

## Arquitetura

Arquitetura local via Docker Compose:

- API GraphQL em NestJS.
- PostgreSQL para dados transacionais.
- Redis para cache de leitura.
- Grafana, Tempo, Loki e OpenTelemetry Collector para observabilidade local.

Referência: `docs/specs/foundation/01-system-design.md`.

## Stack

- Node.js 22
- TypeScript strict
- NestJS
- GraphQL com Apollo
- PostgreSQL
- Kysely com `pg`
- Redis com `ioredis`
- Zod
- Jest
- OpenTelemetry
- Grafana, Tempo e Loki

## Como Executar

Use Node.js 22:

```bash
nvm use
```

Instale dependências:

```bash
npm install
```

Suba infraestrutura:

```bash
docker compose up -d postgres redis tempo loki otel-collector grafana
```

Execute migrations:

```bash
npm run migrate
```

Rode a API:

```bash
npm run start:dev
```

Ou rode tudo via Docker:

```bash
docker compose up --build
```

GraphQL:

```txt
http://localhost:3000/graphql
```

Grafana:

```txt
http://localhost:3001
```

## Variáveis de Ambiente

Use `.env.example` como referência. Valores reais não devem ser versionados.

Principais variáveis:

- `PORT`
- `DATABASE_URL`
- `REDIS_HOST`
- `REDIS_PORT`
- `OTEL_SERVICE_NAME`
- `OTEL_EXPORTER_OTLP_ENDPOINT`
- `OTEL_TRACES_ENABLED`
- `LOG_LEVEL`

## API GraphQL

Queries principais:

- `health`
- `users(pagination)`
- `products(pagination)`
- `product(id)`
- `order(id)`

Mutations principais:

- `createUser(input)`
- `createProduct(input)`
- `createOrder(input)`

Exemplo:

```graphql
mutation {
  createOrder(
    input: {
      userId: "1"
      idempotencyKey: "order-request-123"
      items: [{ productId: "1", quantity: 2 }]
    }
  ) {
    id
    status
    total
  }
}
```

## Modelagem de Dados

Tabelas:

- `users`
- `products`
- `orders`
- `order_items`

Decisões importantes:

- `orders.idempotency_key` evita duplicidade em retentativas.
- `order_items.price` preserva o preço histórico do produto.
- Constraints protegem preço, estoque e quantidade.

## Regras de Negócio

Criação de pedido:

- valida usuário;
- valida itens;
- baixa estoque com update condicional;
- cria pedido e itens na mesma transação;
- retorna sucesso apenas após commit;
- invalida cache após confirmar pedido.

Redis não participa do caminho crítico de escrita.

## Testes

```bash
npm test
npm run test:e2e
```

Validação completa local:

```bash
npm run quality:check
```

## Teste de Carga

Scripts k6 ficam em `load-tests/`.

Exemplo:

```bash
BASE_URL=http://localhost:3000/graphql k6 run load-tests/scripts/list-products.js
```

## Qualidade de Código

Comandos:

```bash
npm run lint
npm run format:check
npm run quality:check
```

Hooks:

- `pre-commit`: `lint-staged`
- `pre-push`: lint, format check e testes

## CI/CD

Workflow em `.github/workflows/ci.yml`.

Checks:

- `npm ci`
- lint
- format check
- testes
- build

## Project Agent Skills

Entrada universal:

- `AGENTS.md`

Guias agnósticos:

- `docs/agent-guides/`

Specs:

- `docs/specs/00-index.md`

## Trade-offs

O MVP não usa:

- ORM completo;
- Elasticsearch;
- mensageria;
- Kubernetes;
- réplicas de banco;
- secret manager.

Esses pontos são melhorias futuras para um cenário mais robusto.

## O Que Faria Diferente Com Mais Tempo

- Adicionar DataLoader para todos os relacionamentos GraphQL.
- Ampliar testes de integração com banco real.
- Executar k6 em workflow manual.
- Adicionar dashboards de observabilidade versionados.
- Adicionar pipeline de deploy.
- Avaliar Elasticsearch para busca avançada de produtos.
