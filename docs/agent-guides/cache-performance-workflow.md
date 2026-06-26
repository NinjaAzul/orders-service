# Cache Performance Workflow

## Objetivo

Guiar agentes ao alterar cache, paginação, performance de leitura e uso de Redis.

Use quando a tarefa envolver Redis, cache de produtos, invalidação, paginação, N+1, índices, listagens ou otimização de queries.

## Specs Relacionadas

- `docs/specs/quality/06-cache-performance.md`
- `docs/specs/foundation/05-regras-negocio-transacoes.md`
- `docs/specs/quality/09-observability-logs-traces.md`

## Princípios

- Cache acelera leitura, não garante regra crítica.
- Banco continua sendo fonte da verdade.
- Invalidação deve ocorrer após escrita que muda leitura cacheada.
- Cache deve ter TTL.
- Logs e spans devem mostrar hit, miss, set e invalidate.

## Fluxo

1. Confirmar qual leitura pode ser cacheada.
2. Definir chave com paginação e filtros relevantes.
3. Buscar cache antes do banco.
4. Se miss, consultar banco e salvar resultado serializável.
5. Converter datas serializadas ao retornar do cache.
6. Invalidar cache em mutations que alteram produtos/estoque.

## Regras

- Não cachear dados sensíveis.
- Não usar `keys` do Redis em caminho de alta escala sem avaliar alternativa.
- Não usar cache para validar estoque de pedido.
- Não retornar objeto cacheado sem ajustar tipos como `Date`.
- Não esconder falha de cache como sucesso de negócio; cache pode falhar sem derrubar o fluxo.

## Observabilidade

Logs úteis:

- `cache hit`
- `cache miss`
- `cache write succeeded`
- `product cache invalidated`
- `cache read/write/invalidation failed`

Spans úteis:

- `redis.get`
- `redis.set`
- `redis.invalidate`

## Resultado Esperado

Ao finalizar mudança de cache/performance, informar:

- chave/cache alterado;
- regra de invalidação;
- impacto esperado;
- validação executada.
