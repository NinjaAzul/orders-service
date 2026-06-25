# 10 - Padronização e Qualidade de Código

## Objetivo

Definir a stack de qualidade de código para manter o projeto consistente, seguro para manutenção e com feedback local antes de subir alterações.

Esta spec cobre:

- ESLint.
- Prettier.
- TypeScript strict.
- Husky.
- lint-staged.
- Hooks de commit e push.
- Regras bloqueantes.
- Scripts de validação local.

## Stack

Ferramentas previstas:

- ESLint para análise estática.
- typescript-eslint para regras TypeScript.
- Prettier para formatação.
- eslint-config-prettier para evitar conflito entre ESLint e Prettier.
- Husky para Git hooks.
- lint-staged para validar apenas arquivos staged no pre-commit.
- Jest para garantir testes antes do push.

## Princípios

- Código deve estar formatado antes do commit.
- Código com lint error não deve entrar no repositório.
- Testes devem passar antes do push.
- `any` explícito deve ser evitado.
- Variáveis não usadas devem ser bloqueadas.
- Regras automáticas devem rodar localmente.
- Hooks devem proteger a branch sem substituir revisão de código.

## ESLint

ESLint será usado para bloquear problemas de código.

Regras importantes:

- não permitir `any` explícito;
- não permitir variáveis não usadas;
- não permitir imports não usados;
- evitar promises não tratadas;
- evitar floating promises;
- evitar código morto;
- manter consistência em imports;
- impedir `console.log` fora de casos permitidos.

Regras sugeridas:

```txt
@typescript-eslint/no-explicit-any: error
@typescript-eslint/no-unused-vars: error
@typescript-eslint/no-floating-promises: error
@typescript-eslint/await-thenable: error
@typescript-eslint/no-misused-promises: error
no-console: warn
```

Observação:

- Logs da aplicação devem usar o logger definido no projeto, não `console.log` espalhado.

## Prettier

Prettier será responsável apenas por formatação.

Configuração sugerida:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

Arquivos cobertos:

- `.ts`
- `.js`
- `.json`
- `.md`
- `.yml`
- `.yaml`

## TypeScript

TypeScript deve ser configurado com modo estrito.

Opções importantes:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true
}
```

Objetivo:

- reduzir erros em runtime;
- evitar contratos implícitos;
- forçar tratamento de tipos nulos;
- impedir variáveis e parâmetros esquecidos.

## Husky

Husky será usado para configurar Git hooks.

Hooks previstos:

- `pre-commit`
- `pre-push`

## lint-staged

lint-staged será usado no `pre-commit`.

Objetivo:

- rodar Prettier e ESLint apenas nos arquivos staged;
- manter commit rápido;
- bloquear código fora do padrão antes de entrar no histórico.

Configuração sugerida:

```json
{
  "*.{ts,js,json,md,yml,yaml}": [
    "prettier --write"
  ],
  "*.{ts,js}": [
    "eslint --fix"
  ]
}
```

## Pre-commit

O `pre-commit` deve executar:

```bash
npx lint-staged
```

Responsabilidades:

- formatar arquivos staged;
- corrigir lint quando possível;
- bloquear commit se ainda existirem erros.

Não deve rodar toda a suíte de testes para não deixar commits lentos.

## Pre-push

O `pre-push` deve executar validações mais completas:

```bash
npm run lint
npm run format:check
npm test
```

Responsabilidades:

- garantir lint completo;
- garantir formatação;
- garantir testes unitários;
- impedir push quebrado.

Testes e2e podem ser mantidos fora do `pre-push` local se ficarem lentos, mas devem estar documentados e rodar manualmente antes da entrega.

## Scripts Esperados

Scripts esperados no `package.json`:

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.ts\" \"test/**/*.ts\"",
    "lint:fix": "eslint \"src/**/*.ts\" \"test/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\" \"docs/**/*.md\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"test/**/*.ts\" \"docs/**/*.md\"",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "quality:check": "npm run lint && npm run format:check && npm test"
  }
}
```

## Dependências Previstas

Dependências de desenvolvimento:

```bash
npm install -D eslint prettier eslint-config-prettier
npm install -D typescript-eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D husky lint-staged
```

Inicialização do Husky:

```bash
npx husky init
```

## Arquivos de Configuração

Arquivos previstos:

```txt
eslint.config.js
.prettierrc
.prettierignore
.husky/pre-commit
.husky/pre-push
```

## Regras Bloqueantes

O código não deve passar se houver:

- `any` explícito sem justificativa;
- variável não usada;
- parâmetro não usado;
- import não usado;
- erro de formatação;
- teste unitário quebrado;
- promise sem tratamento;
- erro de TypeScript;
- uso de `console.log` no código da aplicação.

## Exceções

Exceções devem ser raras.

Quando necessário:

- justificar no código;
- limitar ao menor escopo possível;
- nunca usar disable global sem motivo;
- preferir corrigir a tipagem em vez de silenciar regra.

Exemplo aceitável:

```ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- integração externa sem tipo disponível
```

## Fluxo Local Antes de Subir Código

Antes de abrir PR ou entregar alterações:

```bash
npm run quality:check
npm run test:e2e
```

Fluxo esperado:

```txt
alterar código
  -> pre-commit roda lint-staged
  -> pre-push roda lint, format check e testes
  -> push apenas se tudo passar
```

## Decisões

- Usar ESLint para análise estática.
- Usar Prettier para formatação.
- Usar Husky para hooks locais.
- Usar lint-staged para validação rápida no commit.
- Bloquear `any` explícito.
- Bloquear variáveis não usadas.
- Rodar testes unitários antes do push.
- Rodar e2e manualmente antes da entrega quando o custo local for maior.
