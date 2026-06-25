# Code Quality Gate

## Objetivo

Garantir que alterações de código passem pelos padrões de qualidade antes de serem consideradas prontas.

Este guia é agnóstico à IDE e pode ser usado por Cursor, Claude Code ou qualquer outro agente.

## Referência

Seguir:

- `docs/specs/10-code-quality-standards.md`

## Checks Obrigatórios

Antes de finalizar implementação:

```bash
npm run lint
npm run format:check
npm test
```

Antes de entrega completa:

```bash
npm run test:e2e
```

## Bloqueios

Não considerar pronto se houver:

- `any` explícito;
- variáveis não usadas;
- imports não usados;
- promises sem tratamento;
- formatação inconsistente;
- `console.log` no código da aplicação;
- testes unitários falhando;
- hooks quebrados.

## Hooks Esperados

```txt
pre-commit: lint-staged
pre-push: npm run lint && npm run format:check && npm test
```

## Resultado Esperado

Ao terminar, o agente deve informar:

- comandos executados;
- resultado dos comandos;
- validações não executadas, se houver;
- motivo de qualquer validação pendente.
