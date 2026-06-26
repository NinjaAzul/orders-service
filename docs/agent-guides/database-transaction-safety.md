# Database Transaction Safety

## Objetivo

Guiar agentes ao mexer em banco, repositórios, migrations e fluxo de pedido.

Use quando a tarefa envolver PostgreSQL, Kysely, migrations, repositórios, estoque, criação de pedido, idempotência ou consistência transacional.

## Specs Relacionadas

- `docs/specs/foundation/03-modelagem-dados.md`
- `docs/specs/foundation/05-regras-negocio-transacoes.md`
- `docs/specs/quality/07-estrategia-testes.md`

## Princípios

- PostgreSQL é a fonte da verdade.
- Redis nunca participa do caminho crítico de escrita.
- Pedido não pode ser confirmado sem estoque decrementado com segurança.
- Transações devem ser curtas.
- Idempotência deve evitar duplicidade de pedidos.

## Fluxo Para Alterar Pedido

1. Ler a regra de negócio de transações.
2. Identificar se a alteração afeta `orders`, `order_items` ou `products.stock`.
3. Manter atualização de estoque dentro da transação.
4. Usar update atômico com condição de estoque suficiente.
5. Registrar spans/logs relevantes quando afetar operação crítica.
6. Criar ou ajustar teste de concorrência se houver risco de corrida.

## Regras

- Não calcular estoque somente em memória.
- Não confiar em cache para validar estoque.
- Não abrir transação antes de validações que podem ocorrer fora dela.
- Não fazer chamadas externas longas dentro da transação.
- Não logar SQL completo com dados sensíveis.
- Repositórios implementam contratos do domínio; contratos ficam em `domain/repositories`.

## Sinais de Risco

- `select` de produto seguido de `update` sem condição de estoque.
- Criação de pedido fora da transação de estoque.
- Uso de Redis para bloquear estoque.
- Falta de idempotency key em mutation sensível a retry.
- Teste sem cenário de estoque insuficiente.

## Resultado Esperado

Ao finalizar mudança de banco/transação, informar:

- tabelas afetadas;
- garantia de consistência usada;
- testes executados;
- impacto em observabilidade, se houver.
