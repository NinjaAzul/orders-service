# Load Tests

Este diretório contém testes de carga com k6 para entender, de forma inicial, até onde a API GraphQL aguenta antes de começar a ficar lenta.

Teste de carga não é um teste funcional comum. A ideia não é apenas saber se a API responde, mas observar como ela se comporta quando várias pessoas usam ao mesmo tempo.

## Conceitos Básicos

- `VU` significa virtual user. É como se fosse uma pessoa ou cliente fazendo requests.
- `req/s` significa requests por segundo.
- `avg` é o tempo médio de resposta.
- `p95` significa que 95% das requests responderam até aquele tempo.
- `p99` significa que 99% das requests responderam até aquele tempo.
- `http_req_failed` mostra a taxa de erro HTTP.

Exemplo: se `p95 = 200ms`, quer dizer que 95 de cada 100 requests responderam em até 200ms.

## Scripts Disponíveis

### `list-products.js`

Faz consultas GraphQL de listagem de produtos:

```graphql
query {
  products(pagination: { limit: 20, offset: 0 }) {
    data {
      id
      name
      price
      stock
    }
    pageInfo {
      limit
      offset
      total
    }
  }
}
```

É o teste mais seguro para começar, porque não cria dados nem altera estoque.

### `create-order.js`

Cria pedidos com carga gradual.

Antes de rodar, o banco precisa ter:

- usuário com `id = 1`;
- produto com `id = 1`;
- estoque suficiente.

Esse teste altera dados e consome estoque.

### `concurrent-orders.js`

Cria pedidos concorrentes.

É útil para validar comportamento de transação, controle de estoque e idempotência sob concorrência.

Esse teste também altera dados e consome estoque.

## Como Executar

Com k6 instalado localmente:

```bash
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/list-products.js
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/create-order.js
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/concurrent-orders.js
```

Como alternativa, use a imagem Docker do k6 na mesma rede do Compose:

```bash
docker run --rm \
  --network order-service_order-service-network \
  -v "$PWD:/work:ro" \
  -w /work \
  -e BASE_URL=http://order-service-api:3000/graphql \
  grafana/k6:latest run test/load/scripts/list-products.js
```

## Critérios De Sucesso

Os scripts usam thresholds para dizer se o teste passou ou falhou:

```js
thresholds: {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<800', 'p(99)<1500'],
}
```

Isso significa:

- menos de 5% das requests podem falhar;
- 95% das requests devem responder em menos de 800ms;
- 99% das requests devem responder em menos de 1500ms.

## Resultado Medido Localmente

Foi executado um teste exploratório no endpoint `products`, usando a API em Docker Compose e o k6 via Docker.

Esse teste bateu em leitura de produtos e os logs indicaram resposta a partir do cache:

```txt
products listed from cache
```

Resumo dos resultados:

| VUs | req/s aproximado |   avg |   p95 |   p99 | erro HTTP |
| --: | ---------------: | ----: | ----: | ----: | --------: |
|  10 |            520/s |  19ms |  32ms |  52ms |        0% |
|  25 |            549/s |  45ms |  69ms |  94ms |        0% |
|  50 |            635/s |  78ms | 124ms | 189ms |        0% |
| 100 |            638/s | 156ms | 233ms | 1.01s |        0% |
| 200 |            767/s | 259ms | 393ms |  3.1s |        0% |

## Interpretação Para Leigos

A API respondeu bem até 100 usuários virtuais no teste de leitura.

Em 200 usuários virtuais, ela ainda não retornou erro HTTP, mas algumas requests ficaram lentas. O `p99` chegou em 3.1s, passando o limite de 1.5s definido no teste.

Na prática:

- Até 50 VUs: comportamento muito confortável.
- Em 100 VUs: ainda saudável, mas com começo de aumento de latência.
- Em 200 VUs: a API continua respondendo, mas já existe degradação para parte dos usuários.

Com os thresholds atuais, o limite saudável observado para leitura ficou próximo de 100 VUs.

## Possíveis Gargalos

Como o teste de leitura estava usando cache, o gargalo observado provavelmente não é apenas PostgreSQL.

Possíveis pontos de atenção:

- processamento da API Node.js;
- volume de logs JSON por request;
- envio de logs para Loki via Alloy;
- envio de traces para Tempo via OpenTelemetry Collector;
- Redis/cache;
- recursos locais da máquina rodando Docker.

## Cuidados

Não rode `create-order.js` ou `concurrent-orders.js` sem preparar dados antes. Esses scripts criam pedidos e consomem estoque.

Para testes de escrita, prefira criar uma massa isolada, por exemplo:

- usuário específico para carga;
- produto específico para carga;
- estoque alto;
- `idempotencyKey` única por iteração.

Assim o teste não mistura dados manuais com dados de carga.
