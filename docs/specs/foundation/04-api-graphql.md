# 04 - API GraphQL

## Objetivo

Definir o contrato inicial da API GraphQL.

Esta spec cobre:

- Types.
- Queries.
- Mutations.
- Inputs.
- Erros esperados no contrato.
- Convenções de resposta.

Regras internas, transações e detalhes de persistência devem ficar em specs separadas.

## Convenções

- IDs serão expostos como `ID`.
- Valores monetários serão expostos como `Float` no contrato GraphQL do MVP.
- Datas serão expostas como `String` em formato ISO.
- Mutations recebem sempre um objeto `input`.
- Erros de negócio devem usar códigos padronizados.

## Types

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
  createdAt: String!
}

type Product {
  id: ID!
  name: String!
  price: Float!
  stock: Int!
  createdAt: String!
}

type Order {
  id: ID!
  user: User!
  items: [OrderItem!]!
  status: OrderStatus!
  total: Float!
  createdAt: String!
}

type OrderItem {
  id: ID!
  product: Product!
  quantity: Int!
  price: Float!
}

enum OrderStatus {
  CONFIRMED
  REJECTED
}
```

## Queries

```graphql
type Query {
  users(pagination: PaginationInput): UserConnection!
  products(pagination: PaginationInput): ProductConnection!
  order(id: ID!): Order
}
```

## Connections

```graphql
type PageInfo {
  limit: Int!
  offset: Int!
  total: Int!
}

type UserConnection {
  data: [User!]!
  pageInfo: PageInfo!
}

type ProductConnection {
  data: [Product!]!
  pageInfo: PageInfo!
}
```

## Mutations

```graphql
type Mutation {
  createUser(input: CreateUserInput!): User!
  createProduct(input: CreateProductInput!): Product!
  createOrder(input: CreateOrderInput!): Order!
}
```

## Inputs

```graphql
input PaginationInput {
  limit: Int = 20
  offset: Int = 0
}

input CreateUserInput {
  name: String!
  email: String!
}

input CreateProductInput {
  name: String!
  price: Float!
  stock: Int!
}

input CreateOrderInput {
  userId: ID!
  items: [CreateOrderItemInput!]!
  idempotencyKey: String
}

input CreateOrderItemInput {
  productId: ID!
  quantity: Int!
}
```

## Validações de Entrada

As validações de entrada serão implementadas com Zod.

Regras iniciais:

- `name` não pode ser vazio.
- `email` deve ter formato válido.
- `price` deve ser maior que zero.
- `stock` deve ser maior ou igual a zero.
- `quantity` deve ser maior que zero.
- `items` deve ter pelo menos um item.
- `limit` deve ter valor máximo definido pela aplicação.
- `offset` deve ser maior ou igual a zero.

## Erros

Erros devem ser retornados com código padronizado em `extensions.code`.

Códigos previstos:

- `VALIDATION_ERROR`
- `USER_NOT_FOUND`
- `USER_EMAIL_ALREADY_EXISTS`
- `PRODUCT_NOT_FOUND`
- `INSUFFICIENT_STOCK`
- `ORDER_ALREADY_PROCESSED`
- `INTERNAL_ERROR`

## Exemplo de Mutation

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
    items {
      quantity
      price
      product {
        id
        name
      }
    }
  }
}
```

## Decisões

- Usar GraphQL como contrato público da API.
- Usar paginação nas listagens desde o início.
- Usar `input` em mutations para facilitar evolução do contrato.
- Expor pedidos dentro de usuários, mas evitar consultas N+1 usando DataLoader ou estratégia equivalente.
- Padronizar erros com códigos estáveis.
- Manter o schema enxuto para o MVP.
