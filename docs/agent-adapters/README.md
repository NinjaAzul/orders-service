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
  copilot/
    .github/
  cursor/
    .cursor/
  gemini/
    GEMINI.md
```

## Geração Local

Gere apenas o adapter do ambiente usado pela pessoa.

Os arquivos gerados não são fonte de verdade do projeto e devem continuar ignorados pelo Git.

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

Gerar apenas GitHub Copilot:

```bash
scripts/setup-agent-adapters.sh copilot
```

Gerar para VS Code com GitHub Copilot:

```bash
scripts/setup-agent-adapters.sh vscode
```

Gerar apenas Gemini CLI:

```bash
scripts/setup-agent-adapters.sh gemini
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

GitHub Copilot:

```txt
.github/copilot-instructions.md
```

Uso:

- arquivo de instruções do Copilot aponta para `AGENTS.md` e `docs/agent-guides/`.
- não duplica guias longos.
- deve ser gerado apenas em ambientes que usam VS Code/GitHub Copilot.

Gemini CLI:

```txt
GEMINI.md
```

Uso:

- arquivo de contexto do Gemini aponta para `AGENTS.md` e `docs/agent-guides/`.
- não duplica guias longos.

## Regra

Não editar os arquivos gerados como fonte de verdade.

Atualize os templates ou os guias agnósticos:

- `docs/agent-guides/`
- `docs/agent-adapters/templates/`
