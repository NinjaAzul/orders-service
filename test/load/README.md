# Load Tests

Scripts k6 para entender limites iniciais da API GraphQL.

## Execução

```bash
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/list-products.js
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/create-order.js
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/concurrent-orders.js
```

Via Docker:

```bash
docker run --rm -i -e BASE_URL=http://host.docker.internal:3000/graphql grafana/k6 run - < test/load/scripts/list-products.js
```

Prepare dados antes dos scripts de escrita.
