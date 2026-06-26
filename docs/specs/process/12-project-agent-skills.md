# 12 - Project Agent Skills

## Objetivo

Definir skills locais do projeto para guiar agentes durante implementação, revisão e manutenção.

Esta spec cobre:

- Skills do projeto.
- Quando cada skill deve ser usada.
- Política de uso de MCP e Context7.
- Separação entre specs e skills.
- Índice de specs.
- Memory temporária.
- Rules do Cursor.
- Como evoluir novas skills.

## Guias Agnósticos

Os padrões compartilháveis entre IDEs e agentes ficam em:

```txt
docs/agent-guides/
```

Guias criados:

```txt
docs/agent-guides/
  README.md
  mcp-docs-gate.md
  order-service-spec-driven.md
  code-quality-gate.md
  spec-workflow.md
  generate-pr-description.md
  commit-message-standard.md
  local-dev-docker-stack.md
  graphql-api-workflow.md
  database-transaction-safety.md
  cache-performance-workflow.md
  observability-debugging.md
  testing-load-testing.md
```

Esses arquivos podem ser usados por Cursor, Claude Code ou qualquer outro agente.

## Entry Points Agnósticos

Entry points versionados na raiz:

```txt
AGENTS.md
```

Uso:

- `AGENTS.md`: entry point universal para qualquer agente.

Regra:

- entry points devem apontar para `docs/agent-guides`;
- não devem duplicar regras extensas;
- devem ser criados no setup inicial do projeto.

## Templates de Adaptadores

Templates versionados ficam em:

```txt
docs/agent-adapters/
  README.md
  templates/
    claude/
    copilot/
    cursor/
    gemini/
```

Gerar adaptadores locais:

```bash
scripts/setup-agent-adapters.sh
```

Gerar por IDE:

```bash
scripts/setup-agent-adapters.sh cursor
scripts/setup-agent-adapters.sh claude
scripts/setup-agent-adapters.sh copilot
scripts/setup-agent-adapters.sh vscode
scripts/setup-agent-adapters.sh gemini
```

Arquivos gerados são locais, por ambiente e ignorados pelo Git.

Regra:

- não versionar adapter específico de IDE como fonte de verdade;
- não depender de Cursor, Claude Code, VS Code/Copilot ou Gemini;
- versionar apenas guias agnósticos e templates de adapter.

## Índice de Specs

Todo agente deve começar por:

```txt
docs/specs/00-index.md
```

Objetivo:

- mapear quais specs existem;
- escolher apenas as specs relevantes;
- reduzir consumo de tokens;
- evitar carregar contexto desnecessário.

## Memory Temporária

Notas temporárias ficam em:

```txt
docs/memory/
```

Arquivos:

```txt
docs/memory/
  README.md
  decisions.md
  implementation-notes.md
  open-questions.md
```

Regra:

```txt
memory é temporário
spec é fonte de verdade
README é comunicação final
```

## Specs Temporárias de Feature

Contexto temporário de features fica em:

```txt
docs/specs/features/
```

Use para regras de negócio ou decisões que ainda estão em desenvolvimento.

Ao finalizar uma feature:

- promover decisões permanentes para `foundation/`, `quality/` ou `process/`;
- mover histórico útil para `archive/`;
- apagar rascunhos sem valor histórico.

Specs permanentes ficam em:

```txt
docs/specs/foundation/
docs/specs/quality/
docs/specs/process/
```

## Adaptadores do Cursor

Os adaptadores específicos do Cursor são gerados localmente em:

```txt
.cursor/skills/
```

Skills/adaptadores criados:

```txt
.cursor/skills/
  mcp-docs-gate/
    SKILL.md
  order-service-spec-driven/
    SKILL.md
  code-quality-gate/
    SKILL.md
  generate-pr-description/
    SKILL.md
  commit-message-standard/
    SKILL.md
  local-dev-docker-stack/
    SKILL.md
  graphql-api-workflow/
    SKILL.md
  database-transaction-safety/
    SKILL.md
  cache-performance-workflow/
    SKILL.md
  observability-debugging/
    SKILL.md
  testing-load-testing/
    SKILL.md
```

Esses arquivos devem ser curtos e apontar para os guias agnósticos em `docs/agent-guides`.

Eles são gerados a partir de:

```txt
docs/agent-adapters/templates/cursor/
```

## Adaptadores do Claude Code

Arquivos específicos para Claude Code são gerados localmente:

```txt
CLAUDE.md
.claude/
  README.md
```

Objetivo:

- permitir que Claude Code descubra o fluxo do projeto;
- apontar para `AGENTS.md`;
- evitar duplicação dos guias agnósticos.

Regra:

- `CLAUDE.md` deve ser curto;
- `.claude/` deve conter apenas adaptações específicas do Claude Code;
- padrões compartilhados continuam em `docs/agent-guides`.

Eles são gerados a partir de:

```txt
docs/agent-adapters/templates/claude/
```

## Adaptadores do GitHub Copilot

Arquivo específico para GitHub Copilot:

```txt
.github/copilot-instructions.md
```

Objetivo:

- permitir que Copilot descubra o fluxo do projeto;
- apontar para `AGENTS.md`;
- apontar para `docs/agent-guides`;
- evitar duplicação dos guias agnósticos.

Ele é gerado a partir de:

```txt
docs/agent-adapters/templates/copilot/
```

## Adaptadores do Gemini CLI

Arquivo específico para Gemini CLI:

```txt
GEMINI.md
```

Objetivo:

- permitir que Gemini CLI carregue contexto persistente do projeto;
- apontar para `AGENTS.md`;
- apontar para `docs/agent-guides`;
- evitar duplicação dos guias agnósticos.

Ele é gerado a partir de:

```txt
docs/agent-adapters/templates/gemini/
```

## Agentes Sem Skills Formais

Nem toda IDE/agente usa o conceito de skill como o Cursor.

Para esses casos, a regra é:

- `docs/agent-guides/` continua sendo a fonte de verdade;
- o adaptador local deve apontar para `AGENTS.md`;
- `AGENTS.md` deve apontar para os guias agnósticos relevantes;
- não duplicar regras longas em arquivos específicos da IDE.

Exemplo para Claude Code:

```txt
CLAUDE.md
  -> AGENTS.md
    -> docs/specs/00-index.md
    -> docs/agent-guides/spec-workflow.md
    -> docs/agent-guides/order-service-spec-driven.md
    -> docs/agent-guides/code-quality-gate.md
    -> docs/agent-guides/mcp-docs-gate.md
    -> docs/agent-guides/commit-message-standard.md
    -> docs/agent-guides/generate-pr-description.md
    -> docs/agent-guides/local-dev-docker-stack.md
    -> docs/agent-guides/graphql-api-workflow.md
    -> docs/agent-guides/database-transaction-safety.md
    -> docs/agent-guides/cache-performance-workflow.md
    -> docs/agent-guides/observability-debugging.md
    -> docs/agent-guides/testing-load-testing.md
```

Critério:

- se a IDE suporta skill formal, criar adaptador curto;
- se a IDE não suporta skill formal, reforçar o fluxo no entry point local;
- em ambos os casos, a regra real permanece em `docs/agent-guides/`.

## Rules do Cursor

Rules específicas do Cursor ficam em:

```txt
.cursor/rules/
```

Rules criadas:

```txt
.cursor/rules/
  spec-driven-workflow.mdc
  mcp-docs-gate.mdc
```

Objetivo:

- aplicar o fluxo spec-driven em todas as conversas;
- obrigar leitura do índice antes de implementar;
- reforçar uso de MCP/Context7 em tarefas docs-sensitive.

## Skill `mcp-docs-gate`

Objetivo:

- Evitar decisões baseadas em memória quando uma documentação atual é necessária.
- Reduzir consumo de tokens com buscas focadas em Context7.
- Bloquear avanço quando uma documentação necessária não estiver disponível via MCP.

Usar quando a tarefa envolver:

- NestJS;
- GraphQL;
- Kysely;
- PostgreSQL client;
- Redis client;
- OpenTelemetry;
- Grafana;
- Tempo;
- Loki;
- k6;
- ESLint;
- Prettier;
- Husky;
- lint-staged;
- RTK/Redux Toolkit, se entrar no projeto futuramente.

Regra:

- Se a tarefa depende de documentação atual, consultar MCP/Context7 primeiro.
- Se MCP/Context7 não estiver configurado ou não responder, parar e pedir configuração.
- Não continuar usando apenas memória quando a documentação for necessária.

## Skill `order-service-spec-driven`

Objetivo:

- Garantir que implementação siga as specs locais.
- Evitar decisões soltas fora do desenho planejado.
- Fazer o agente ler apenas a spec relevante em vez de carregar tudo.

Usar quando a tarefa envolver:

- implementação de feature;
- mudança de arquitetura;
- criação de módulo;
- alteração de banco;
- alteração de GraphQL;
- cache;
- observabilidade;
- testes;
- README;
- Docker.

Regra:

- Antes de implementar, ler `docs/specs/00-index.md`.
- Selecionar de 2 a 4 specs relevantes.
- Se uma decisão nova for necessária, atualizar a spec antes do código.
- README deve continuar sendo atualizado no final.

## Skill `code-quality-gate`

Objetivo:

- Garantir que código novo siga padronização local.
- Evitar subir código sem lint, formatação e testes.
- Reforçar hooks locais e scripts de qualidade.

Usar quando a tarefa envolver:

- edição de TypeScript;
- testes;
- configs;
- package scripts;
- hooks;
- finalização de implementação.

Regra:

- Não considerar implementação pronta se lint, formatação ou testes principais estiverem quebrados.
- Bloquear `any`, variáveis não usadas, imports não usados e `console.log` em código da aplicação.

## Skill `generate-pr-description`

Objetivo:

- Gerar descrição enxuta de PR em português.
- Usar branch atual para identificar issue Jira.
- Buscar detalhes da issue via MCP Atlassian.
- Analisar apenas commits reais da branch.
- Salvar o resultado em `.claude/pr-descriptions/<ID-JIRA>.md`.

Usar quando a tarefa envolver:

- descrição de PR;
- resumo de Pull Request;
- texto para Azure DevOps;
- `/generate-pr-description`.

Regra:

- Seguir `docs/agent-guides/generate-pr-description.md`.
- Limitar o arquivo final a 4000 caracteres.
- Não usar arquivos que não pertençam aos commits reais da branch.
- Exibir o conteúdo final formatado ao usuário.

## Skill `commit-message-standard`

Objetivo:

- Padronizar mensagens de commit do projeto.
- Usar ticket quando existir.
- Classificar o commit por tipo.
- Manter histórico claro conforme specs e etapas forem concluídas.

Usar quando a tarefa envolver:

- criação de commit;
- sugestão de mensagem de commit;
- finalização de spec;
- finalização de etapa funcional;
- revisão de histórico Git.

Formato:

```txt
[TICKET-123] - TYPE - descrição curta no imperativo
TYPE - descrição curta no imperativo
```

Tipos:

- `FEAT`: nova feature.
- `FIX`: correção de bug.
- `REFACTOR`: refatoração sem mudança de comportamento.
- `HOTFIX`: correção urgente para produção.
- `DOCS`: specs, README, guias e documentação.
- `CHORE`: setup, scripts, configs e manutenção sem regra de negócio.

Regra:

- Seguir `docs/agent-guides/commit-message-standard.md`.
- Preferir um commit por spec concluída ou etapa funcional finalizada.
- Antes de commitar código, seguir `docs/agent-guides/code-quality-gate.md`.

## Skill `local-dev-docker-stack`

Objetivo:

- Padronizar como agentes sobem e validam a stack local.
- Evitar workarounds Docker desnecessários quando `buildx` está funcionando.
- Guiar depuração de API, Postgres, Redis, Grafana, Tempo, Loki, Alloy e Collector.

Usar quando a tarefa envolver:

- Docker;
- Docker Compose;
- build da API;
- health check;
- containers de observabilidade;
- problemas de ambiente local.

Regra:

- Seguir `docs/agent-guides/local-dev-docker-stack.md`.
- Não ler ou expor `.env`.
- Validar com `docker compose config`, `docker ps` e health GraphQL quando aplicável.

## Skill `graphql-api-workflow`

Objetivo:

- Padronizar alterações no contrato GraphQL.
- Manter resolvers finos.
- Evitar regra de negócio em `presentation`.

Usar quando a tarefa envolver:

- resolvers;
- inputs;
- types;
- mappers;
- queries;
- mutations;
- paginação GraphQL.

Regra:

- Seguir `docs/agent-guides/graphql-api-workflow.md`.
- Resolver deve chamar use case.
- Contrato público deve respeitar `docs/specs/foundation/04-api-graphql.md`.

## Skill `database-transaction-safety`

Objetivo:

- Proteger consistência de pedidos, estoque e idempotência.
- Reforçar PostgreSQL como fonte da verdade.
- Evitar perda ou duplicidade de pedidos.

Usar quando a tarefa envolver:

- PostgreSQL;
- Kysely;
- migrations;
- repositórios;
- estoque;
- criação de pedido;
- idempotência;
- concorrência.

Regra:

- Seguir `docs/agent-guides/database-transaction-safety.md`.
- Redis não participa do caminho crítico de escrita.
- Transação de pedido deve manter atualização de estoque atômica.

## Skill `cache-performance-workflow`

Objetivo:

- Padronizar uso de Redis para leitura.
- Evitar cache no caminho crítico.
- Manter logs/spans de hit, miss, set e invalidate.

Usar quando a tarefa envolver:

- cache;
- Redis;
- paginação;
- listagens;
- performance;
- invalidação.

Regra:

- Seguir `docs/agent-guides/cache-performance-workflow.md`.
- Não usar cache para validar estoque.
- Sempre revisar invalidação ao alterar escrita relacionada a produtos.

## Skill `observability-debugging`

Objetivo:

- Padronizar logs estruturados e traces.
- Guiar depuração com Grafana, Tempo e Loki.
- Evitar logs inúteis ou sensíveis.

Usar quando a tarefa envolver:

- OpenTelemetry;
- logs JSON;
- spans;
- Grafana;
- Tempo;
- Loki;
- Alloy;
- Collector;
- investigação de erro.

Regra:

- Seguir `docs/agent-guides/observability-debugging.md`.
- Não logar `.env`, tokens, senhas ou payload completo sensível.
- Validar traces e logs quando a stack local estiver disponível.

## Skill `testing-load-testing`

Objetivo:

- Padronizar criação e execução de testes.
- Guiar escolha entre unitário, integração, e2e e carga.
- Reforçar testes de concorrência quando mexer em estoque/transação.

Usar quando a tarefa envolver:

- Jest;
- e2e;
- mocks;
- concorrência;
- k6;
- fixtures;
- validação antes de entrega.

Regra:

- Seguir `docs/agent-guides/testing-load-testing.md`.
- Usar mocks em unitários.
- Rodar `npm run quality:check` e `npm run build` antes de finalizar código.

## Relação Entre Specs e Skills

Specs definem decisões do projeto.

Guias agnósticos transformam essas decisões em instruções reutilizáveis por qualquer agente.

Skills específicas da IDE funcionam como adaptadores gerados para esses guias.

Entry points como `AGENTS.md` apontam para os mesmos guias.

Exemplo:

```txt
10-code-quality-standards.md
  -> define ferramentas, regras e hooks

docs/agent-guides/code-quality-gate.md
  -> guia agnóstico para aplicar essas regras

.cursor/skills/code-quality-gate/SKILL.md
  -> adaptador do Cursor que aponta para o guia agnóstico
```

## Relação Entre Memory e Specs

Memory deve ser usada para decisões temporárias, dúvidas e notas de execução.

Quando uma decisão se estabilizar, ela deve sair de `docs/memory` e entrar na spec responsável.

Se houver conflito:

- spec vence memory;
- decisão nova deve atualizar a spec correta;
- README só recebe informação final.

## Política de MCP

Quando uma resposta depende de documentação externa:

1. Verificar se existe MCP adequado.
2. Ler o schema da ferramenta antes de chamar.
3. Usar Context7 para documentação pública de bibliotecas.
4. Fazer queries específicas.
5. Resumir apenas o necessário.
6. Parar se a ferramenta necessária não estiver configurada.

Objetivo:

- reduzir respostas desatualizadas;
- reduzir consumo de tokens;
- evitar pesquisar documentos grandes sem necessidade;
- manter decisões técnicas rastreáveis.

## Como Criar Novas Skills

Criar um novo guia agnóstico quando:

- um padrão aparece em várias specs;
- o agente precisa aplicar sempre o mesmo fluxo;
- existe risco alto de esquecer uma etapa;
- uma tarefa recorrente consome muitos tokens;
- um processo precisa de bloqueio explícito.

Criar template de adaptador específico de IDE somente quando:

- a IDE tiver formato próprio de skill;
- o agente daquela IDE precisar descobrir o guia automaticamente;
- o adaptador puder ser curto e apontar para `docs/agent-guides`.

Evitar criar guia/skill quando:

- a regra é usada apenas uma vez;
- a spec já resolve o problema;
- a skill ficaria genérica demais;
- a instrução duplicaria conteúdo sem reduzir esforço.

## Decisões

- Manter skills dentro do projeto.
- Manter guias agnósticos em `docs/agent-guides`.
- Criar `AGENTS.md` como entry point universal.
- Versionar templates de adaptadores em `docs/agent-adapters`.
- Gerar `CLAUDE.md`, `.claude/` e `.cursor/` localmente via script.
- Gerar `.github/copilot-instructions.md` e `GEMINI.md` localmente via script.
- Ignorar adaptadores gerados no Git.
- Usar adaptadores específicos de IDE apenas como ponte gerada.
- Gerar apenas o adapter do ambiente usado pela pessoa, exceto quando o usuário pedir `all`.
- Usar `.cursor/rules` gerado para regras persistentes do Cursor.
- Usar `docs/specs/00-index.md` como entrada única das specs.
- Usar `docs/memory` para notas temporárias.
- Separar guias por responsabilidade.
- Usar Context7 via MCP para documentação atual.
- Não continuar tarefas docs-sensitive se MCP necessário estiver indisponível.
- Usar specs locais como fonte de verdade para implementação.
