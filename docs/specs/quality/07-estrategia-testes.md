# 07 - Estratégia de Testes

## Objetivo

Definir a estratégia de testes automatizados do MVP.

Esta spec cobre:

- Tipos de teste.
- Prioridades.
- Casos mínimos.
- Testes de concorrência.
- Testes de API GraphQL.
- Critérios de aceite.

## Ferramenta

Jest será usado como ferramenta principal de testes.

Tipos previstos:

- testes unitários;
- testes de integração;
- testes end-to-end.

## Pirâmide de Testes

```txt
E2E
Integração
Unitários
```

Prioridade:

- muitos testes unitários para use cases;
- alguns testes de integração para repositórios e transações;
- poucos testes e2e cobrindo fluxos principais da API.

## Estrutura de Pastas

```txt
test/
  unit/
    users/
    products/
    orders/
  integration/
    database/
    repositories/
  e2e/
    graphql/
```

## Testes Unitários

Objetivo:

- Validar regras dos use cases sem depender de banco real.

Casos mínimos:

### Usuários

- deve criar usuário com dados válidos;
- deve rejeitar email inválido;
- deve rejeitar email duplicado.

### Produtos

- deve criar produto com dados válidos;
- deve rejeitar preço menor ou igual a zero;
- deve rejeitar estoque negativo.

### Pedidos

- deve criar pedido com estoque suficiente;
- deve rejeitar pedido sem usuário existente;
- deve rejeitar pedido com produto inexistente;
- deve rejeitar pedido sem itens;
- deve rejeitar item com quantidade inválida;
- deve calcular total corretamente;
- deve manter preço histórico do item.

## Testes de Integração

Objetivo:

- Validar integração com PostgreSQL e comportamento transacional.

Casos mínimos:

- deve persistir usuário;
- deve respeitar unicidade de email;
- deve persistir produto;
- deve persistir pedido e itens;
- deve reverter transação quando pedido falhar;
- deve reduzir estoque quando pedido for confirmado;
- não deve permitir estoque negativo;
- deve respeitar `idempotency_key`.

## Teste de Concorrência

Esse é o teste de maior risco do MVP.

Cenário:

```txt
Dado um produto com estoque 1
Quando duas requisições tentam comprar 1 unidade ao mesmo tempo
Então apenas um pedido deve ser confirmado
E a outra tentativa deve falhar com INSUFFICIENT_STOCK
E o estoque final deve ser 0
```

Objetivo:

- Validar que a baixa de estoque é atômica.
- Garantir que pedidos simultâneos não vendem mais do que o estoque disponível.

## Testes E2E GraphQL

Objetivo:

- Validar o contrato público da API.

Casos mínimos:

- `createUser` deve criar usuário;
- `createProduct` deve criar produto;
- `products` deve listar produtos com paginação;
- `users` deve listar usuários com pedidos;
- `createOrder` deve criar pedido confirmado;
- `createOrder` deve retornar erro quando não houver estoque suficiente;
- `createOrder` com mesma `idempotencyKey` deve retornar pedido já processado.

## Testes de Cache

No MVP, cache pode ser validado em integração.

Casos mínimos:

- deve buscar produtos do banco quando cache estiver vazio;
- deve salvar listagem de produtos no Redis;
- deve invalidar cache após criação de produto;
- deve invalidar cache após pedido confirmado;
- falha no Redis não deve impedir criação de pedido.

## Banco de Testes

Testes de integração e e2e devem usar banco isolado.

Regras:

- não usar banco de desenvolvimento nos testes automatizados;
- limpar dados entre testes;
- executar migrations antes dos testes;
- usar massa de dados mínima por cenário.

## Critérios de Aceite

O MVP deve ser considerado coberto quando:

- use cases principais tiverem testes unitários;
- repositórios principais tiverem testes de integração;
- fluxo de criação de pedido tiver teste e2e;
- concorrência de estoque tiver teste automatizado;
- falhas de negócio retornarem códigos padronizados;
- testes rodarem com um único comando.

## Decisões

- Priorizar testes de regras críticas.
- Testar concorrência com banco real.
- Evitar depender de mocks para comportamento transacional.
- Manter testes e2e em menor quantidade.
- Usar fixtures simples e explícitas.
