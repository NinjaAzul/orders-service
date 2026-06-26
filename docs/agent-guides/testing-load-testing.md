# Testing And Load Testing

## Objetivo

Guiar agentes ao criar, ajustar ou executar testes unitários, integração, e2e e carga.

Use quando a tarefa envolver Jest, testes de use case, testes GraphQL, concorrência, k6, fixtures ou validação antes de entrega.

## Specs Relacionadas

- `docs/specs/quality/07-estrategia-testes.md`
- `docs/specs/quality/08-load-testing-stack.md`
- `docs/specs/quality/10-code-quality-standards.md`

## Pirâmide Local

- Unitários: use cases e regras isoladas.
- Integração: repositórios, banco e cache quando necessário.
- E2E: contrato GraphQL principal.
- Carga: k6 para limite e comportamento sob concorrência.

## Comandos

Qualidade principal:

```bash
npm run quality:check
```

Unitários:

```bash
npm test
```

E2E:

```bash
npm run test:e2e
```

Load tests:

```bash
k6 run test/load/scripts/list-products.js
k6 run test/load/scripts/create-order.js
k6 run test/load/scripts/concurrent-orders.js
```

## Regras

- Teste unitário não deve depender de Docker.
- Use case deve receber mocks de repositório, logger, tracing e cache.
- Teste de pedido deve cobrir idempotência, usuário inexistente, produto inexistente e estoque insuficiente quando o fluxo for alterado.
- Teste de concorrência é obrigatório quando alterar estoque/transação.
- Load test não substitui teste funcional.
- Fixtures de carga devem ser pequenas e não conter dados sensíveis.

## Antes de Finalizar

1. Rodar `npm run quality:check`.
2. Rodar `npm run build`.
3. Se mexeu em GraphQL, rodar ou explicar e2e.
4. Se mexeu em performance, rodar ou explicar k6.

## Resultado Esperado

Ao finalizar tarefa de testes, informar:

- testes adicionados ou alterados;
- comandos executados;
- cenários cobertos;
- lacunas conhecidas.
