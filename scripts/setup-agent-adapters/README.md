# setup-agent-adapters

## Objetivo

Gerar adapters locais para diferentes IDEs e agentes de IA sem prender o projeto a uma plataforma específica.

A fonte de verdade continua sendo:

- `AGENTS.md`
- `docs/agent-guides/`
- `docs/specs/00-index.md`

Os adapters gerados apenas apontam para esses arquivos.

## Por Que Existe

Cada ferramenta lê instruções de um jeito:

- Cursor usa `.cursor/skills/` e `.cursor/rules/`.
- Claude Code usa `CLAUDE.md` e `.claude/`.
- VS Code/GitHub Copilot usa `.github/copilot-instructions.md`.
- Gemini CLI usa `GEMINI.md`.

Este script gera os arquivos certos para o ambiente usado pela pessoa.

## Como Usar

Gerar tudo:

```bash
scripts/setup-agent-adapters.sh
```

Gerar apenas Cursor:

```bash
scripts/setup-agent-adapters.sh cursor
```

Gerar apenas Claude Code:

```bash
scripts/setup-agent-adapters.sh claude
```

Gerar apenas VS Code/GitHub Copilot:

```bash
scripts/setup-agent-adapters.sh vscode
```

Alias equivalente:

```bash
scripts/setup-agent-adapters.sh copilot
```

Gerar apenas Gemini CLI:

```bash
scripts/setup-agent-adapters.sh gemini
```

## O Que É Gerado

```txt
cursor  -> .cursor/
claude  -> CLAUDE.md e .claude/
vscode  -> .github/copilot-instructions.md
copilot -> .github/copilot-instructions.md
gemini  -> GEMINI.md
all     -> todos os adapters acima
```

## Arquivos Versionados

Templates ficam em:

```txt
docs/agent-adapters/templates/
```

Script:

```txt
scripts/setup-agent-adapters.sh
```

Este README:

```txt
scripts/setup-agent-adapters/README.md
```

## Arquivos Ignorados

Os adapters gerados são locais e ficam ignorados pelo Git:

```txt
.cursor/
.claude/
CLAUDE.md
GEMINI.md
.github/copilot-instructions.md
```

Isso evita que o repositório fique acoplado a uma IDE específica.

## Regra

Quando adicionar um novo padrão de agente:

1. Criar ou atualizar um guia agnóstico em `docs/agent-guides/`.
2. Criar template curto em `docs/agent-adapters/templates/<ambiente>/`.
3. Atualizar `scripts/setup-agent-adapters.sh`.
4. Atualizar este README.

Não duplique regras longas nos adapters. Eles devem apenas apontar para os guias agnósticos.
