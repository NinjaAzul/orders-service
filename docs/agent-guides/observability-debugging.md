# Observability Debugging

## Objetivo

Guiar agentes ao criar, validar ou depurar logs, traces e a stack Grafana/Tempo/Loki.

Use quando a tarefa envolver OpenTelemetry, spans, logs JSON, Grafana, Tempo, Loki, Alloy, Collector, request tracking ou investigação de erro em runtime.

## Specs Relacionadas

- `docs/specs/quality/09-observability-logs-traces.md`
- `docs/specs/foundation/01-system-design.md`

## Fluxo Local

```txt
API -> traces OTLP -> OpenTelemetry Collector -> Tempo -> Grafana
API stdout JSON -> Grafana Alloy -> Loki -> Grafana
```

## Regras

- Logs de negócio devem ser JSON estruturado.
- Não usar `console.log` em código da aplicação.
- Logger padrão do Nest deve ficar reduzido a logs úteis.
- Não logar `.env`, tokens, senhas, headers de autorização ou payload completo sensível.
- Spans customizados devem envolver operações críticas.
- Sempre encerrar span em `finally`.
- Falha de observabilidade não pode derrubar fluxo de negócio.

## Logs Esperados

Campos mínimos:

```txt
timestamp
level
service
feature
operation
message
```

Consultas úteis:

```logql
{container_name="order-service-api"} | json
{container_name="order-service-api"} | json | feature="orders"
{container_name="order-service-api"} | json | operation="createOrder"
{container_name="order-service-api"} | json | level="warn"
```

## Spans Esperados

- `POST /graphql`
- `usecase.create_order`
- `db.transaction`
- `db.update_stock`
- `db.create_order`
- `db.create_order_items`
- `redis.get`
- `redis.set`
- `redis.invalidate`

## Checklist de Depuração

1. Confirmar containers com `docker ps`.
2. Confirmar API com query `health`.
3. Conferir logs do `order-service-api`.
4. Conferir logs do `order-service-otel-collector`.
5. Conferir logs do `order-service-alloy`.
6. Consultar Loki por `container_name`.
7. Consultar Tempo por `service.name=order-service`.

## Resultado Esperado

Ao finalizar tarefa de observabilidade, informar:

- logs ou traces validados;
- consulta usada no Loki/Tempo;
- spans ou campos adicionados;
- qualquer limitação de ambiente.
