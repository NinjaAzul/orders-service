# GraphQL API Workflow

## Objetivo

Guiar agentes ao criar, alterar ou testar a API GraphQL do Order Service.

Use quando a tarefa envolver resolvers, inputs, types, schema GraphQL, queries, mutations, paginação, mappers ou contrato público da API.

## Specs Relacionadas

- `docs/specs/foundation/04-api-graphql.md`
- `docs/specs/foundation/05-regras-negocio-transacoes.md`
- `docs/specs/quality/07-estrategia-testes.md`

## Estrutura Esperada

Dentro de cada módulo:

```txt
presentation/graphql/
  *.resolver.ts
  *.inputs.ts
  *.types.ts
  *.mapper.ts
```

## Fluxo

1. Ler a spec da API GraphQL.
2. Verificar se a mudança pertence a `users`, `products` ou `orders`.
3. Alterar input/type/resolver sem vazar detalhes de infraestrutura.
4. Chamar use cases da camada `application`.
5. Mapear entidades de domínio para tipos GraphQL com mapper explícito.
6. Validar com build e testes.

## Regras

- Resolver não deve conter regra de negócio complexa.
- Resolver não deve acessar Kysely, Redis ou `process.env` diretamente.
- Inputs GraphQL são contrato externo; validação de regra fica no use case com Zod.
- IDs vindos do GraphQL podem ser string no contrato e convertidos antes do use case.
- Não expor stack trace, SQL, variáveis de ambiente ou dados sensíveis.
- Paginação deve respeitar limites definidos em spec.

## Teste Rápido

```bash
curl -s -X POST http://localhost:3000/graphql \
  -H 'content-type: application/json' \
  --data '{"query":"query { health }"}'
```

## Resultado Esperado

Ao finalizar mudança GraphQL, informar:

- operação alterada;
- input/type/resolver afetado;
- validações executadas;
- exemplo mínimo de query ou mutation, se útil.
