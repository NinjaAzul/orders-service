# Agent Adapters

## Objetivo

Guardar templates versionados para adaptadores específicos de IDE/agente.

Os arquivos gerados localmente são ignorados pelo Git.

## Templates Versionados

```txt
docs/agent-adapters/templates/
  claude/
    CLAUDE.md
    .claude/
  cursor/
    .cursor/
```

## Geração Local

Gerar todos os adaptadores:

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

## Arquivos Gerados

Cursor:

```txt
.cursor/
```

Uso:

- `.cursor/skills/` contém adaptadores curtos para guias agnósticos.
- `.cursor/rules/` contém regras persistentes do Cursor.

Claude Code:

```txt
CLAUDE.md
.claude/
```

Uso:

- `CLAUDE.md` aponta para `AGENTS.md`.
- `.claude/README.md` explica como carregar os guias agnósticos.
- Claude Code não duplica as skills do Cursor.

## Regra

Não editar os arquivos gerados como fonte de verdade.

Atualize os templates ou os guias agnósticos:

- `docs/agent-guides/`
- `docs/agent-adapters/templates/`
