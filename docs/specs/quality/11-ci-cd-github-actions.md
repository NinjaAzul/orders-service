# 11 - CI/CD GitHub Actions

## Objetivo

Definir a estratégia inicial de CI/CD usando GitHub Actions.

Esta spec cobre:

- eventos do workflow;
- checks obrigatórios;
- build;
- testes;
- serviços auxiliares;
- variáveis e secrets;
- critérios para bloquear merge.

## Princípios

- O CI deve replicar os principais checks locais.
- Nenhuma alteração deve ser considerada pronta se lint, formatação, testes ou build falharem.
- O workflow não deve depender de `.env` real.
- Secrets devem ser configurados no GitHub, não versionados.
- Testes com banco e cache devem usar serviços descartáveis.

## Eventos

O workflow deve rodar em:

```yaml
on:
  pull_request:
  push:
    branches:
      - main
      - develop
```

## Checks Obrigatórios

Pipeline mínimo:

```txt
checkout
setup node
npm ci
npm run lint
npm run format:check
npm test
npm run build
```

## Testes de Integração

Quando houver testes de integração com PostgreSQL e Redis, o workflow deve subir serviços descartáveis.

Serviços previstos:

- PostgreSQL
- Redis

Esses serviços devem ser usados apenas durante o job.

## Testes E2E

Testes e2e podem rodar em uma etapa separada.

Critério inicial:

- rodar e2e no CI quando o ambiente Docker/test database estiver estável;
- se ficar lento no MVP, documentar execução manual antes da entrega.

## Build

O build deve garantir que o projeto compila.

Comando esperado:

```bash
npm run build
```

## Docker Build

Validação futura:

```bash
docker build .
```

No MVP, pode ser incluído se o Dockerfile já estiver estável.

## Variáveis de Ambiente

O CI deve usar variáveis específicas para teste.

Exemplo:

```txt
NODE_ENV=test
DATABASE_URL=postgres://postgres:postgres@localhost:5432/order_service_test
REDIS_HOST=localhost
REDIS_PORT=6379
OTEL_TRACES_ENABLED=false
```

## Secrets

Não versionar secrets.

Usar GitHub Secrets quando necessário.

Exemplos futuros:

- tokens de registry;
- credenciais externas;
- webhooks;
- chaves de deploy.

## Workflow Inicial Sugerido

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  validate:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: order_service_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379

    env:
      NODE_ENV: test
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/order_service_test
      REDIS_HOST: localhost
      REDIS_PORT: 6379
      OTEL_TRACES_ENABLED: false

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

## Critério de Merge

Pull request só deve ser considerado pronto quando:

- lint passar;
- formatação passar;
- testes unitários passarem;
- build passar;
- testes de integração/e2e passarem quando habilitados.

## Relação Com Qualidade Local

O CI complementa:

- `docs/specs/quality/10-code-quality-standards.md`
- hooks locais com Husky;
- `npm run quality:check`.

Diferença:

- hooks dão feedback rápido local;
- CI garante validação reproduzível no repositório remoto.

## Melhorias Futuras

- Rodar testes e2e em job separado.
- Validar Docker build.
- Publicar coverage.
- Exigir status check obrigatório no branch protection.
- Executar k6 em workflow manual.
- Adicionar deploy após merge.
- Adicionar análise de segurança de dependências.

## Decisões

- Usar GitHub Actions para CI.
- Rodar workflow em pull requests e pushes para `main` e `develop`.
- Usar `npm ci` para instalação reproduzível.
- Rodar lint, format check, testes e build.
- Usar PostgreSQL e Redis descartáveis para testes quando necessário.
- Não usar `.env` real no CI.
