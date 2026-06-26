# 02 - Backend Tooling e Estrutura

## Objetivo

Definir as ferramentas iniciais do backend e a estrutura de pastas do projeto.

Esta spec cobre apenas:

- Framework backend.
- Validação de dados.
- Testes.
- Acesso ao banco.
- Cache.
- Logs.
- Traces.
- Observabilidade.
- Erros customizados.
- Organização de pastas com Clean Architecture.

Regras de negócio, modelagem de dados e schema GraphQL devem ficar em specs separadas.

## Stack Escolhida

### Linguagem

Node.js com TypeScript.

Motivos:

- Boa produtividade para APIs.
- Tipagem estática.
- Ecossistema maduro para GraphQL, PostgreSQL, Redis e testes.

### Framework

NestJS.

Motivos:

- Estrutura modular.
- Suporte nativo a dependency injection.
- Boa integração com GraphQL.
- Jest já vem como padrão no ecossistema.
- Facilita separar camadas de apresentação, aplicação, domínio e infraestrutura.

### API

GraphQL com NestJS.

Ferramentas previstas:

- `@nestjs/graphql`
- `@nestjs/apollo`
- `@apollo/server`
- `graphql`

Motivos:

- Contrato flexível para consultas de leitura.
- Permite expor queries e mutations com contrato claro.
- Combina bem com resolvers organizados por módulo.

### Validação

Zod.

Motivos:

- Validação explícita e independente do framework.
- Boa inferência de tipos com TypeScript.
- Pode ser usado em use cases, inputs e validações de domínio.
- Evita acoplar validação de regra de entrada apenas a decorators.

### Testes

Jest.

Motivos:

- Padrão no NestJS.
- Suporta testes unitários e de integração.
- Bom suporte a mocks.
- Adequado para testar use cases e repositórios.

### Banco de Dados

PostgreSQL.

Motivos:

- Fonte da verdade do sistema.
- Bom suporte a transações.
- Boa performance para dados relacionais.
- Adequado para fluxos que precisam de consistência transacional.

### Acesso ao Banco

Kysely com `pg`.

Ferramentas previstas:

- `kysely`
- `pg`
- `@types/pg`

Motivos:

- Kysely é query builder tipado, não ORM completo.
- Mantém as queries próximas do SQL real.
- Evita relations automáticas e carregamentos implícitos.
- Ajuda a reduzir riscos comuns de performance em ORMs.
- Permite escrever transações e queries condicionais com controle explícito.
- Funciona bem com Clean Architecture quando usado apenas na camada de infraestrutura.

Trade-off:

- Demanda escrever mais SQL/query builder manualmente.
- Não entrega a produtividade de um ORM completo como Prisma ou TypeORM.
- Em troca, oferece mais previsibilidade e controle de performance.

Decisão:

- Não usar ORM completo no MVP.
- Usar Kysely como query builder tipado.
- Manter SQL crítico explícito quando necessário.

### Cache

Redis.

Ferramenta prevista:

- `ioredis`

Motivos:

- Cliente maduro para Redis em Node.js.
- Simples de usar no MVP.
- Pode ser isolado em um provider de infraestrutura.

### Configuração

Nest Config.

Ferramenta prevista:

- `@nestjs/config`

Motivos:

- Centraliza variáveis de ambiente.
- Facilita separar configuração da aplicação.
- Evita espalhar leitura de `process.env` pelo código.

### Logs

Logger padrão do NestJS no MVP.

Motivos:

- Não adiciona dependência extra no início.
- Suficiente para logs básicos.
- Pode ser substituído futuramente por Pino ou Winston.

Melhoria futura:

- Adicionar logs estruturados com request id, correlation id e contexto da operação.

### Observabilidade

OpenTelemetry com Grafana, Tempo e Loki.

Ferramentas previstas na API:

- `@opentelemetry/api`
- `@opentelemetry/sdk-node`
- `@opentelemetry/exporter-trace-otlp-proto`
- `@opentelemetry/auto-instrumentations-node`
- `@opentelemetry/instrumentation-http`
- `@opentelemetry/instrumentation-graphql`

Ferramentas previstas na infraestrutura local:

- Grafana
- Tempo
- Loki
- OpenTelemetry Collector ou Grafana Alloy

Motivos:

- Permite rastrear uma requisição ponta a ponta.
- Facilita investigar erros por request.
- Permite criar spans para etapas internas dos use cases.
- Ajuda a entender tempo gasto em validação, banco, cache e regras.
- Mantém logs e traces separados da lógica de negócio.

Eventos que devem ser observáveis:

- entrada da requisição;
- operação GraphQL;
- validação com Zod;
- execução do use case;
- chamadas a repositórios;
- transação no PostgreSQL;
- chamadas ao Redis;
- sucesso ou erro da operação.

Decisão:

- Usar OpenTelemetry para traces.
- Usar logs no stdout da aplicação para coleta pelo Loki.
- Visualizar logs e traces no Grafana.
- Não bloquear a API se a stack de observabilidade estiver indisponível.

Padrões de criação de logs, traces e spans serão detalhados em spec própria:

- `docs/specs/quality/09-observability-logs-traces.md`

### Erros Customizados

O projeto deve ter uma base própria para erros da aplicação.

Objetivo:

- Padronizar erros de domínio e aplicação.
- Facilitar mapeamento para erros GraphQL.
- Evitar espalhar mensagens soltas pelo código.

Estrutura prevista:

- `AppError`
- `DomainError`
- `ValidationError`
- `NotFoundError`
- `ConflictError`

O mapeamento final para GraphQL será detalhado na spec de API.

## Comandos Previstos de Instalação

Criação do projeto:

```bash
npx @nestjs/cli new order-service
```

Dependências de GraphQL:

```bash
npm install @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

Dependências de validação:

```bash
npm install zod
```

Dependências de banco:

```bash
npm install kysely pg
npm install -D @types/pg
```

Dependências de cache:

```bash
npm install ioredis
```

Dependências de configuração:

```bash
npm install @nestjs/config
```

Dependências de observabilidade:

```bash
npm install @opentelemetry/api @opentelemetry/sdk-node
npm install @opentelemetry/exporter-trace-otlp-proto
npm install @opentelemetry/auto-instrumentations-node
npm install @opentelemetry/instrumentation-http @opentelemetry/instrumentation-graphql
```

Testes:

```bash
npm test
npm run test:e2e
```

## Estrutura de Pastas

Estrutura proposta seguindo Clean Architecture:

```txt
src/
  main.ts
  app.module.ts

  shared/
    errors/
      app-error.ts
      domain-error.ts
      validation-error.ts
      not-found-error.ts
      conflict-error.ts
      graphql-error.mapper.ts
    graphql/
      pagination.types.ts
    validation/
      parse-with-zod.ts

  infrastructure/
    config/
      app-config.module.ts
      env.schema.ts
    database/
      database.module.ts
      database.provider.ts
      database.types.ts
      migrate.ts
      migrations/
        001_initial_schema.sql
    cache/
      cache.module.ts
      redis.provider.ts
      cache.service.ts
    observability/
      observability.module.ts
      tracing.ts
      tracing.service.ts
      app-logger.service.ts

  modules/
    health/
      health.module.ts
      health.resolver.ts

    users/
      users.module.ts
      domain/
        entities/
          user.entity.ts
        repositories/
          users.repository.ts
      application/
        use-cases/
          create-user.use-case.ts
          list-users.use-case.ts
      infrastructure/
        repositories/
          kysely-users.repository.ts
      presentation/
        graphql/
          users.resolver.ts
          users.inputs.ts
          users.types.ts

    products/
      products.module.ts
      domain/
        entities/
          product.entity.ts
        repositories/
          products.repository.ts
      application/
        use-cases/
          create-product.use-case.ts
          find-product.use-case.ts
          list-products.use-case.ts
      infrastructure/
        repositories/
          kysely-products.repository.ts
      presentation/
        graphql/
          products.resolver.ts
          products.inputs.ts
          products.types.ts
          products.mapper.ts

    orders/
      orders.module.ts
      domain/
        entities/
          order.entity.ts
        repositories/
          orders.repository.ts
      application/
        use-cases/
          create-order.use-case.ts
          find-order.use-case.ts
      infrastructure/
        repositories/
          kysely-orders.repository.ts
      presentation/
        graphql/
          orders.resolver.ts
          orders.inputs.ts
          orders.types.ts
          orders.mapper.ts
```

## Responsabilidade das Camadas

### Domain

Contém regras centrais e contratos.

Pode conter:

- Entidades.
- Value objects.
- Interfaces de repositório.
- Erros de domínio.

Não deve depender de NestJS, Kysely, Redis ou GraphQL.

### Application

Contém os casos de uso.

Pode conter:

- `CreateUserUseCase`
- `CreateProductUseCase`
- `CreateOrderUseCase`
- `ListUsersUseCase`
- `ListProductsUseCase`

Essa camada orquestra regras, mas não conhece detalhes técnicos de banco, cache ou GraphQL.

### Infrastructure

Contém integrações técnicas.

Pode conter:

- Implementações de repositórios com Kysely.
- Provider de conexão com PostgreSQL.
- Provider de Redis.
- Configuração de OpenTelemetry.
- Migrations.

Essa é a única camada que deve conhecer Kysely, `pg`, Redis e detalhes de observabilidade.

### Presentation

Contém a entrada da aplicação.

Pode conter:

- GraphQL resolvers.
- Inputs GraphQL.
- Types GraphQL.
- Pipes de validação.
- Mapeamento de erros para GraphQL.

Essa camada chama os use cases e traduz entrada/saída para o contrato da API.

## Estrutura de Testes

Testes devem ficar próximos do tipo de validação feita.

Estrutura prevista:

```txt
test/
  jest-e2e.json
  unit/
    users/
      create-user.use-case.spec.ts
    orders/
      create-order.use-case.spec.ts
  e2e/
    health.e2e-spec.ts
  load/
    README.md
    fixtures/
      users.json
      products.json
    scripts/
      concurrent-orders.js
      create-order.js
      list-products.js
```

Prioridade dos testes no MVP:

- Unit tests para use cases.
- Integration tests para repositórios e transações quando o risco justificar.
- E2E tests para mutations e queries principais.
- Load tests para fluxo de produtos e pedidos concorrentes.

## Decisões

- Usar NestJS como framework principal.
- Usar Jest para testes.
- Usar Zod para validação.
- Usar Kysely com `pg` para acesso ao PostgreSQL.
- Evitar ORM completo no MVP por previsibilidade e controle de performance.
- Usar Redis com `ioredis`.
- Usar Logger padrão do NestJS no MVP.
- Usar OpenTelemetry para traces.
- Usar Grafana, Tempo e Loki para visualização local de observabilidade.
- Criar erros customizados desde o início.
- Organizar módulos seguindo Clean Architecture.
