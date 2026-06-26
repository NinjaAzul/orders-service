# Local Dev Docker Stack

## Objetivo

Guiar agentes ao subir, validar e depurar a stack local Docker do Order Service.

Use quando a tarefa envolver Docker, Docker Compose, containers, build da API, PostgreSQL, Redis, Grafana, Tempo, Loki, Alloy ou OpenTelemetry Collector.

## Specs Relacionadas

- `docs/specs/foundation/01-system-design.md`
- `docs/specs/foundation/02-backend-tooling.md`
- `docs/specs/quality/09-observability-logs-traces.md`

## Comandos Base

Subir a stack:

```bash
docker compose up -d --build
```

Ver containers:

```bash
docker ps
```

Validar Compose:

```bash
docker compose config
```

Testar API:

```bash
curl -s -X POST http://localhost:3000/graphql \
  -H 'content-type: application/json' \
  --data '{"query":"query { health }"}'
```

## Serviços Esperados

- `order-service-api`
- `order-service-postgres`
- `order-service-redis`
- `order-service-grafana`
- `order-service-tempo`
- `order-service-loki`
- `order-service-alloy`
- `order-service-otel-collector`

## Arquivos de Infra Docker

Configurações de observabilidade da stack local ficam em:

```txt
infra/docker/observability/
```

## Portas

- API: `http://localhost:3000/graphql`
- Grafana: `http://localhost:3001`
- Postgres: interno no Compose, `5432`
- Redis: interno no Compose, `6379`

## Regras

- Não usar `.env` como fonte para resposta ou documentação.
- Preferir `.env.example` para explicar variáveis.
- Não trocar versões, imagens ou portas sem verificar specs.
- Se `docker compose up --build` falhar por `buildx`, verificar `docker buildx version` e `docker compose version`.
- Não usar `DOCKER_BUILDKIT=0 COMPOSE_DOCKER_CLI_BUILD=0` como padrão se `buildx` estiver funcionando.

## Resultado Esperado

Ao finalizar uma tarefa de stack local, informar:

- comando usado para subir ou validar;
- containers principais e status;
- endpoint testado;
- qualquer limitação local encontrada.
