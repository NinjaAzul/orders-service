# 11 - Project Agent Skills

## Objetivo

Definir skills locais do projeto para guiar agentes durante implementação, revisão e manutenção.

Esta spec cobre:

- Skills do projeto.
- Quando cada skill deve ser usada.
- Política de uso de MCP e Context7.
- Separação entre specs e skills.
- Como evoluir novas skills.

## Guias Agnósticos

Os padrões compartilháveis entre IDEs e agentes ficam em:

```txt
docs/agent-guides/
```

Guias criados:

```txt
docs/agent-guides/
  mcp-docs-gate.md
  order-service-spec-driven.md
  code-quality-gate.md
```

Esses arquivos podem ser usados por Cursor, Claude Code ou qualquer outro agente.

## Adaptadores do Cursor

Os adaptadores específicos do Cursor ficam em:

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
```

Esses arquivos devem ser curtos e apontar para os guias agnósticos em `docs/agent-guides`.

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

- Antes de implementar, identificar qual spec controla a mudança.
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

## Relação Entre Specs e Skills

Specs definem decisões do projeto.

Guias agnósticos transformam essas decisões em instruções reutilizáveis por qualquer agente.

Skills específicas da IDE funcionam como adaptadores para esses guias.

Exemplo:

```txt
10-code-quality-standards.md
  -> define ferramentas, regras e hooks

docs/agent-guides/code-quality-gate.md
  -> guia agnóstico para aplicar essas regras

.cursor/skills/code-quality-gate/SKILL.md
  -> adaptador do Cursor que aponta para o guia agnóstico
```

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

Criar um adaptador específico de IDE somente quando:

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
- Usar adaptadores específicos de IDE apenas como ponte.
- Separar guias por responsabilidade.
- Usar Context7 via MCP para documentação atual.
- Não continuar tarefas docs-sensitive se MCP necessário estiver indisponível.
- Usar specs locais como fonte de verdade para implementação.
