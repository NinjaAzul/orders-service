# 06 - Cache e Performance

## Objetivo

Definir a estratégia inicial de performance do MVP.

Esta spec cobre:

- Uso de Redis.
- Paginação.
- Índices.
- Evitar N+1 em GraphQL.
- Pool de conexão.
- Invalidação de cache.
- Observabilidade de performance.
- Limites do MVP.

## Princípios

- PostgreSQL é a fonte da verdade.
- Redis é cache, não armazenamento definitivo.
- Escritas críticas não devem depender do Redis.
- Listagens devem ter paginação.
- Relacionamentos em GraphQL devem evitar N+1.
- Transações devem ser curtas.

## Estratégia de Cache

Redis será usado para dados de leitura frequente.

Usos iniciais:

- Cache de listagem de produtos.
- Cache de produto por ID.

Não usar Redis para:

- confirmar pedido;
- controlar estoque;
- armazenar pedido como fonte definitiva;
- substituir constraints do banco.

## Chaves de Cache

Chaves iniciais:

```txt
products:list:limit:{limit}:offset:{offset}
products:id:{productId}
```

TTL inicial:

```txt
60 segundos
```

Motivo:

- Mantém o cache simples.
- Reduz risco de dado antigo por muito tempo.
- É suficiente para o MVP.

## Invalidação de Cache

Eventos que devem invalidar cache de produtos:

- criação de produto;
- criação de pedido confirmado;
- alteração de estoque.

Estratégia inicial:

- Invalidar chaves relacionadas a produtos após commit no PostgreSQL.
- Se a invalidação falhar, registrar log e seguir com a resposta.

## Paginação

Listagens devem ter paginação desde o início.

Parâmetros:

- `limit`
- `offset`

Valores recomendados:

- `limit` padrão: `20`
- `limit` máximo: `100`
- `offset` padrão: `0`

Motivo:

- Evita retornar muitos registros de uma vez.
- Reduz carga no banco.
- Mantém resposta previsível.

## Índices no Banco

Índices iniciais:

```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

Índice único:

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_orders_idempotency_key ON orders(idempotency_key);
```

Observação:

- Alguns índices únicos podem ser criados automaticamente por constraints `UNIQUE`.
- A implementação final deve evitar duplicar índice sem necessidade.

## GraphQL e N+1

Consultas GraphQL podem gerar N+1 quando resolvers carregam relacionamentos individualmente.

Exemplo de risco:

```txt
listar usuários
para cada usuário, buscar pedidos
para cada pedido, buscar itens
para cada item, buscar produto
```

Mitigação:

- Usar DataLoader ou batching equivalente.
- Carregar relacionamentos em lote por IDs.
- Evitar queries por item dentro de loops.

## Pool de Conexão

O acesso ao PostgreSQL deve usar pool de conexão.

Configuração inicial sugerida:

- pool mínimo conforme padrão da lib;
- pool máximo pequeno no ambiente local;
- timeout configurado;
- logs de erro em falhas de conexão.

Objetivo:

- Reaproveitar conexões.
- Evitar criar conexão por request.
- Manter consumo previsível no banco.

## Transações Curtas

Transações devem conter apenas operações necessárias.

Evitar dentro de transações:

- chamadas ao Redis;
- chamadas externas;
- processamento pesado;
- logs excessivos;
- esperas artificiais.

## Observabilidade de Performance

O MVP deve permitir investigar o comportamento de uma requisição usando logs e traces.

Stack prevista:

- Grafana para visualização.
- Tempo para traces.
- Loki para logs.
- OpenTelemetry para instrumentação da API.

Cada request relevante deve ter um identificador de correlação, como `requestId` ou `correlationId`.

Esse identificador deve aparecer:

- nos logs;
- nos spans;
- nos erros retornados ou registrados internamente quando aplicável.

Logs úteis:

- entrada da requisição;
- início e fim de criação de pedido;
- falha de estoque;
- falha de validação;
- falha de banco;
- falha de cache;
- duração de operações críticas.

Spans úteis:

- `graphql.request`;
- `zod.validation`;
- `usecase.create_order`;
- `repository.find_user`;
- `repository.find_products`;
- `database.transaction`;
- `database.update_stock`;
- `database.create_order`;
- `redis.get`;
- `redis.set`;
- `redis.invalidate`.

Exemplo de fluxo observável:

```txt
createOrder request
  -> validate input
  -> execute use case
  -> check idempotency key
  -> start database transaction
  -> update stock
  -> create order
  -> create order items
  -> commit transaction
  -> invalidate cache
  -> return response
```

Em caso de erro:

```txt
createOrder request
  -> validate input
  -> execute use case
  -> start database transaction
  -> update stock
  -> insufficient stock
  -> rollback transaction
  -> return business error
```

Padrões completos de logs, traces, spans e correlação serão definidos em spec própria:

- `docs/specs/09-observability-logs-traces.md`

## Melhorias Futuras

Possíveis evoluções:

- Elasticsearch para busca avançada.
- Read replicas no PostgreSQL.
- Métricas com Prometheus.
- Logs estruturados com Pino.
- Cache warming para catálogo.
- Cursor pagination para listagens maiores.

## Decisões

- Usar Redis apenas para cache.
- Usar TTL curto no MVP.
- Invalidar cache após commit do banco.
- Usar paginação nas listagens.
- Usar índices para relacionamentos.
- Mitigar N+1 no GraphQL.
- Manter transações curtas.
- Usar logs e traces para acompanhar requests e gargalos.
