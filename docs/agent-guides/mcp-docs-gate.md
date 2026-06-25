# MCP Docs Gate

## Objetivo

Garantir que agentes consultem documentação atual antes de responder ou implementar detalhes de bibliotecas, frameworks, SDKs, CLIs e ferramentas.

Este guia é agnóstico à IDE e pode ser usado por Cursor, Claude Code ou qualquer outro agente.

## Quando Usar

Use este guia quando a tarefa envolver:

- instalação ou configuração de dependências;
- APIs de bibliotecas;
- setup de frameworks;
- NestJS;
- GraphQL;
- Kysely;
- OpenTelemetry;
- Redis;
- Grafana;
- Tempo;
- Loki;
- k6;
- ESLint;
- Prettier;
- Husky;
- lint-staged;
- RTK/Redux Toolkit, se entrar no projeto.

## Regras

1. Se a tarefa depende de documentação atual, consulte uma fonte de docs antes de continuar.
2. Preferir MCP/Context7 quando disponível.
3. Se usar MCP, ler o schema da ferramenta antes de chamar.
4. Fazer perguntas específicas para reduzir tokens.
5. Resumir apenas o necessário.
6. Se a documentação necessária não estiver disponível, parar e avisar.
7. Não seguir apenas de memória em tarefas docs-sensitive, exceto se o usuário pedir explicitamente.

## Estratégia de Baixo Consumo de Tokens

- Consultar uma biblioteca por vez.
- Fazer uma pergunta objetiva por consulta.
- Pedir exemplos de configuração, não documentação completa.
- Não colar respostas longas.
- Referenciar a decisão tomada e seguir.

## Resultado Esperado

O agente deve conseguir dizer:

- qual documentação consultou;
- qual decisão foi tomada;
- qual trecho da documentação influenciou a implementação;
- se alguma documentação necessária estava indisponível.
