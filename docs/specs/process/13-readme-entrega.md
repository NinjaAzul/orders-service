# 13 - README e Entrega

## Objetivo

Definir a estrutura esperada do README final e os pontos que devem ser comunicados na entrega.

Esta spec cobre:

- Estrutura do README.
- Instruções de execução.
- Decisões técnicas.
- Trade-offs.
- Testes.
- Melhorias futuras.

## Estrutura Recomendada

```md
# Order Service

## Visão Geral

## Arquitetura

## Stack

## Como Executar

## Variáveis de Ambiente

## API GraphQL

## Modelagem de Dados

## Regras de Negócio

## Estratégia de Performance

## Observabilidade

## Testes

## Teste de Carga

## Qualidade de Código

## Project Agent Skills

## Decisões Técnicas

## Trade-offs

## O Que Faria Diferente Com Mais Tempo
```

## Visão Geral

O README deve explicar em poucas linhas:

- o sistema gerencia usuários, produtos e pedidos;
- a API é GraphQL;
- PostgreSQL é a fonte da verdade;
- Redis é usado como cache;
- pedidos são tratados com foco em consistência de estoque.

## Arquitetura

Referenciar a spec:

- `docs/specs/foundation/01-system-design.md`

Pontos a citar:

- execução local com Docker Compose;
- API, PostgreSQL e Redis em containers;
- Grafana, Tempo, Loki e Collector em containers;
- somente API e Grafana expostos para acesso local;
- banco, cache e backends de observabilidade acessíveis pela rede interna.

## Stack

Referenciar a spec:

- `docs/specs/foundation/02-backend-tooling.md`

Pontos a citar:

- Node.js com TypeScript;
- NestJS;
- GraphQL;
- Kysely com `pg`;
- PostgreSQL;
- Redis com `ioredis`;
- Zod;
- Jest;
- Logger padrão do NestJS;
- OpenTelemetry;
- Grafana;
- Tempo;
- Loki.

## Como Executar

Comandos esperados:

```bash
npm install
docker compose up -d
npm run migrate
npm run start:dev
```

Ou, se a API também rodar em container:

```bash
docker compose up --build
```

## Variáveis de Ambiente

O README deve listar variáveis necessárias sem expor valores sensíveis.

Exemplo:

```txt
PORT
DATABASE_URL
REDIS_HOST
REDIS_PORT
OTEL_SERVICE_NAME
OTEL_EXPORTER_OTLP_ENDPOINT
OTEL_TRACES_ENABLED
LOG_LEVEL
```

Observação:

- valores reais não devem ser versionados;
- um arquivo de exemplo pode ser usado para documentação.

## API GraphQL

Referenciar a spec:

- `docs/specs/foundation/04-api-graphql.md`

Pontos a citar:

- endpoint GraphQL;
- queries disponíveis;
- mutations disponíveis;
- exemplo de `createOrder`;
- principais códigos de erro.

## Modelagem de Dados

Referenciar a spec:

- `docs/specs/foundation/03-modelagem-dados.md`

Pontos a citar:

- tabelas principais;
- relacionamentos;
- constraints;
- índices;
- idempotência em pedidos;
- preço histórico em itens do pedido.

## Regras de Negócio

Referenciar a spec:

- `docs/specs/foundation/05-regras-negocio-transacoes.md`

Pontos a citar:

- criação de pedido é transacional;
- estoque é controlado no PostgreSQL;
- baixa de estoque deve ser atômica;
- Redis não faz parte da confirmação do pedido;
- idempotência reduz risco de pedido duplicado.

## Estratégia de Performance

Referenciar a spec:

- `docs/specs/quality/06-cache-performance.md`

Pontos a citar:

- paginação nas listagens;
- índices;
- cache com Redis;
- invalidação de cache;
- mitigação de N+1 em GraphQL;
- pool de conexão com banco.

## Observabilidade

Referenciar a spec:

- `docs/specs/quality/09-observability-logs-traces.md`

Pontos a citar:

- Grafana para visualizar logs e traces;
- Tempo para armazenar traces;
- Loki para armazenar logs;
- OpenTelemetry Collector ou Grafana Alloy para coleta;
- OpenTelemetry na API para instrumentação;
- logs estruturados no stdout da aplicação;
- traces exportados via OTLP;
- `requestId` e `correlationId` para correlacionar logs e traces;
- spans por resolver, validação, use case, repositório, banco e cache.

## Testes

Referenciar a spec:

- `docs/specs/quality/07-estrategia-testes.md`

Comandos esperados:

```bash
npm test
npm run test:e2e
```

Pontos a citar:

- testes unitários para use cases;
- testes de integração para repositórios;
- teste de concorrência de estoque;
- testes e2e para GraphQL.

## Teste de Carga

Referenciar a spec:

- `docs/specs/quality/08-load-testing-stack.md`

Comando esperado:

```bash
k6 run test/load/scripts/list-products.js
```

Pontos a citar:

- k6 como ferramenta de carga;
- scripts versionados em `test/load`;
- cenários de leitura, escrita e concorrência;
- métricas p95, p99, taxa de erro e throughput;
- thresholds iniciais para entender limites do MVP.

## Qualidade de Código

Referenciar a spec:

- `docs/specs/quality/10-code-quality-standards.md`

Comandos esperados:

```bash
npm run lint
npm run format:check
npm run quality:check
```

Pontos a citar:

- ESLint para análise estática;
- Prettier para formatação;
- TypeScript strict;
- Husky para hooks locais;
- lint-staged no pre-commit;
- lint, formatação e testes no pre-push;
- bloqueio de `any`, variáveis não usadas e formatação inconsistente.

## CI/CD

Referenciar a spec:

- `docs/specs/quality/11-ci-cd-github-actions.md`

Pontos a citar:

- GitHub Actions como pipeline de validação;
- workflow em pull requests e pushes para `main` e `develop`;
- uso de `npm ci` para instalação reproduzível;
- execução de lint, format check, testes e build;
- PostgreSQL e Redis como services descartáveis para testes;
- `.env` real não deve ser usado no CI;
- secrets devem ficar no GitHub Secrets.

## Commits

Referenciar o guia:

- `docs/agent-guides/commit-message-standard.md`

Pontos a citar:

- commits devem ser feitos conforme specs ou etapas forem concluídas;
- usar ticket quando houver;
- usar tipo em maiúsculas;
- manter descrição curta em português;
- não misturar assuntos diferentes no mesmo commit.

Formato:

```txt
[TICKET-123] - TYPE - descrição curta no imperativo
TYPE - descrição curta no imperativo
```

Tipos:

- `FEAT`
- `FIX`
- `REFACTOR`
- `HOTFIX`
- `DOCS`
- `CHORE`

## Project Agent Skills

Referenciar a spec:

- `docs/specs/process/12-project-agent-skills.md`

Organização das specs:

- `docs/specs/00-index.md`
- `docs/specs/foundation/`
- `docs/specs/quality/`
- `docs/specs/process/`
- `docs/specs/features/`
- `docs/specs/archive/`

Entry points:

- `AGENTS.md`

Guias agnósticos:

- `docs/agent-guides/README.md`
- `docs/agent-guides/mcp-docs-gate.md`
- `docs/agent-guides/order-service-spec-driven.md`
- `docs/agent-guides/code-quality-gate.md`
- `docs/agent-guides/spec-workflow.md`
- `docs/agent-guides/generate-pr-description.md`
- `docs/agent-guides/commit-message-standard.md`

Templates de adaptadores:

- `docs/agent-adapters/README.md`
- `docs/agent-adapters/templates/`

Comando de geração local:

```bash
scripts/setup-agent-adapters.sh
```

Entrada das specs:

- `docs/specs/00-index.md`

Memory temporária:

- `docs/memory/README.md`
- `docs/memory/decisions.md`
- `docs/memory/implementation-notes.md`
- `docs/memory/open-questions.md`

Adaptadores Cursor:

- `mcp-docs-gate`
- `order-service-spec-driven`
- `code-quality-gate`
- `generate-pr-description`
- `commit-message-standard`

Adaptadores Claude Code:

- `CLAUDE.md`
- `.claude/README.md`

Rules Cursor:

- `.cursor/rules/spec-driven-workflow.mdc`
- `.cursor/rules/mcp-docs-gate.mdc`

Pontos a citar:

- `AGENTS.md` é o entry point universal para agentes;
- `CLAUDE.md` é gerado localmente para Claude Code;
- guias agnósticos ficam em `docs/agent-guides`;
- templates ficam em `docs/agent-adapters/templates`;
- adaptadores do Cursor são gerados em `.cursor/skills`;
- adaptadores do Claude são gerados em `.claude`;
- rules do Cursor são geradas em `.cursor/rules`;
- adaptadores gerados são ignorados pelo Git;
- Cursor usa skills formais como ponte para os guias agnósticos;
- Claude Code usa `CLAUDE.md` e `.claude/README.md` como entry points para os mesmos guias;
- outros agentes, como Claude Code, devem ler os guias agnósticos;
- agentes devem começar por `docs/specs/00-index.md`;
- specs de fundação, qualidade e processo são permanentes;
- specs em `features/` são temporárias durante desenvolvimento;
- specs concluídas podem ser promovidas, arquivadas ou apagadas;
- `docs/memory` guarda apenas notas temporárias;
- `mcp-docs-gate` obriga consulta MCP/Context7 quando documentação atual é necessária;
- `order-service-spec-driven` guia implementação a partir das specs locais;
- `code-quality-gate` reforça lint, formatação, hooks e testes antes de finalizar mudanças;
- `generate-pr-description` gera descrição de PR em português usando Jira, branch atual e commits reais da branch;
- `commit-message-standard` padroniza mensagens de commit com ticket opcional, tipo e descrição curta.

## Decisões Técnicas

Decisões para destacar:

- NestJS pela organização modular.
- Kysely para evitar ORM completo e manter controle das queries.
- PostgreSQL como fonte da verdade.
- Redis apenas como cache.
- Zod para validação explícita.
- Jest para testes.
- OpenTelemetry para traces.
- Grafana, Tempo e Loki para observabilidade local.
- ESLint, Prettier, Husky e lint-staged para padronização.
- `AGENTS.md` como entry point universal para agentes.
- Guias agnósticos de agente para reforçar padrões do projeto.
- Templates de adaptadores por IDE versionados.
- Adaptadores por IDE gerados localmente no setup.
- Clean Architecture para separar regras e infraestrutura.

## Trade-offs

Trade-offs para explicar:

- Kysely demanda mais código manual que ORM completo, mas dá mais controle.
- Redis melhora leitura, mas adiciona invalidação de cache.
- Docker Compose simplifica execução local, mas não representa uma produção completa.
- Observabilidade local adiciona containers, mas facilita investigar requests e falhas.
- Logger padrão é suficiente no MVP, mas logs estruturados com Pino seriam melhores em produção.
- Hooks locais aumentam a disciplina de qualidade, mas podem tornar commits e pushes um pouco mais lentos.
- Guias de agente ajudam consistência entre IDEs, mas precisam ser mantidos junto com as specs.
- Templates de adaptadores adicionam arquivos ao repositório, mas os adaptadores gerados ficam locais e evitam duplicar conhecimento em cada ferramenta.
- Offset pagination é simples, mas cursor pagination escala melhor para grandes volumes.

## O Que Faria Diferente Com Mais Tempo

Melhorias futuras:

- Kubernetes.
- API Gateway ou Ingress.
- Elasticsearch para busca avançada de produtos.
- Mensageria para eventos assíncronos.
- Outbox pattern para integração confiável.
- Workers para indexação e processamento.
- Read replicas no PostgreSQL.
- Observabilidade com métricas, logs estruturados e tracing.
- Dashboards de observabilidade mais completos.
- Alertas baseados em taxa de erro e latência.
- Rate limit.
- Autenticação e autorização.
- Auditoria de alterações de estoque.
- Pipeline de CI com testes automatizados.

## Critério de README Completo

O README estará completo quando uma pessoa conseguir:

- entender a arquitetura;
- rodar o projeto;
- acessar a API;
- executar testes;
- entender as decisões técnicas;
- entender os trade-offs;
- entender os próximos passos possíveis.
