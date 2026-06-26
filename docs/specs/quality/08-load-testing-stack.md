# 08 - Stack de Teste de Carga

## Objetivo

Definir uma stack separada para testes de carga e performance.

Esta spec cobre:

- Ferramenta de carga.
- Estrutura de scripts.
- Cenários mínimos.
- Métricas observadas.
- Critérios iniciais.
- Como executar localmente.

Esta stack não substitui os testes unitários, integração e e2e com Jest. Ela serve para entender limites iniciais da API e identificar gargalos.

## Ferramenta Escolhida

k6.

Motivos:

- Permite escrever testes de carga como código.
- Scripts ficam versionados no repositório.
- Suporta thresholds para definir critérios de sucesso.
- Roda via CLI ou Docker.
- É simples para cenários HTTP e GraphQL.
- Produz métricas úteis como latência, taxa de erro e throughput.

## Papel da Stack

A stack de carga deve responder perguntas como:

- Quantas requisições por segundo a API suporta localmente?
- Qual é a latência p95 e p99 das operações principais?
- O banco passa a ser gargalo em qual cenário?
- O cache melhora a listagem de produtos?
- Pedidos concorrentes continuam preservando estoque?
- A API falha de forma controlada sob carga?

## Estrutura de Pastas

```txt
test/
  load/
    scripts/
      list-products.js
      create-order.js
      concurrent-orders.js
    fixtures/
      products.json
      users.json
    README.md
```

## Execução

Execução local com k6 instalado:

```bash
k6 run test/load/scripts/list-products.js
```

Execução via Docker:

```bash
docker run --rm -i grafana/k6 run - < test/load/scripts/list-products.js
```

Execução apontando para a API local:

```bash
BASE_URL=http://localhost:3000/graphql k6 run test/load/scripts/list-products.js
```

## Cenários Mínimos

### Listagem de Produtos

Objetivo:

- Medir latência da query de produtos.
- Comparar comportamento com cache frio e cache quente.

Operação:

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

### Criação de Pedido

Objetivo:

- Medir custo da mutation de pedido.
- Observar impacto de transação no banco.
- Validar taxa de erro sob carga moderada.

Operação:

```graphql
mutation {
  createOrder(
    input: {
      userId: "1"
      idempotencyKey: "load-test-order-1"
      items: [{ productId: "1", quantity: 1 }]
    }
  ) {
    id
    status
    total
  }
}
```

### Pedidos Concorrentes

Objetivo:

- Validar comportamento da API quando muitas requisições tentam comprar o mesmo produto.
- Garantir que o sistema não gera estoque negativo.
- Entender como a API responde quando parte das requisições falha por regra de negócio.

Cenário:

```txt
Dado um produto com estoque limitado
Quando múltiplos usuários tentam comprar ao mesmo tempo
Então apenas pedidos compatíveis com o estoque devem ser confirmados
E os demais devem falhar com erro de negócio esperado
```

## Configuração de Carga Inicial

Configuração sugerida para MVP:

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<800', 'p(99)<1500'],
  },
};
```

Interpretação:

- até 5% de falhas HTTP em teste local pode indicar ponto de investigação;
- 95% das requisições devem responder abaixo de 800ms;
- 99% das requisições devem responder abaixo de 1500ms.

Esses números são critérios iniciais e podem ser ajustados após as primeiras medições.

## Métricas Observadas

Métricas do k6:

- `http_reqs`
- `http_req_duration`
- `http_req_failed`
- `iterations`
- `vus`
- `checks`

Métricas externas úteis:

- CPU dos containers.
- Memória dos containers.
- conexões ativas no PostgreSQL.
- uso de Redis.
- logs de erro da API.

## Checks

Cada script deve validar respostas mínimas.

Exemplos:

- status HTTP deve ser `200`;
- resposta não deve conter erro inesperado;
- mutation de pedido deve retornar `CONFIRMED` quando houver estoque;
- falha de estoque deve retornar erro esperado, não erro interno.

## Separação de Ambientes

Teste de carga deve rodar contra ambiente descartável ou local.

Regras:

- não rodar carga contra banco de desenvolvimento com dados importantes;
- preparar massa de dados antes do teste;
- limpar massa de dados após execução quando necessário;
- não misturar teste de carga com teste funcional do Jest.

## Limites do MVP

Esta stack inicial não terá:

- Grafana Cloud.
- Dashboards persistentes.
- Prometheus.
- Execução distribuída.
- k6 Operator em Kubernetes.
- Testes em pipeline obrigatórios.

Esses pontos podem entrar como melhoria futura.

## Decisões

- Usar k6 como ferramenta de carga.
- Manter scripts em `test/load` para centralizar testes unitários, e2e e carga.
- Testar leitura, escrita e concorrência.
- Usar thresholds como critério inicial de qualidade.
- Rodar carga separadamente dos testes Jest.
- Usar os resultados para guiar otimizações, não para criar complexidade antes da hora.
