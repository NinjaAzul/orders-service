#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
TEMPLATES_DIR="$ROOT_DIR/docs/agent-adapters/templates"
TARGET="${1:-all}"

copy_dir() {
  src="$1"
  dest="$2"

  if [ ! -d "$src" ]; then
    echo "Template not found: $src" >&2
    exit 1
  fi

  mkdir -p "$dest"
  cp -R "$src"/. "$dest"/
}

setup_cursor() {
  copy_dir "$TEMPLATES_DIR/cursor/.cursor" "$ROOT_DIR/.cursor"
  echo "Cursor adapters generated in .cursor/"
}

setup_claude() {
  cp "$TEMPLATES_DIR/claude/CLAUDE.md" "$ROOT_DIR/CLAUDE.md"
  copy_dir "$TEMPLATES_DIR/claude/.claude" "$ROOT_DIR/.claude"
  echo "Claude adapters generated in CLAUDE.md and .claude/"
}

setup_copilot() {
  copy_dir "$TEMPLATES_DIR/copilot/.github" "$ROOT_DIR/.github"
  echo "GitHub Copilot adapter generated in .github/copilot-instructions.md"
}

setup_gemini() {
  cp "$TEMPLATES_DIR/gemini/GEMINI.md" "$ROOT_DIR/GEMINI.md"
  echo "Gemini adapter generated in GEMINI.md"
}

case "$TARGET" in
  cursor)
    setup_cursor
    ;;
  claude)
    setup_claude
    ;;
  copilot)
    setup_copilot
    ;;
  vscode)
    setup_copilot
    ;;
  gemini)
    setup_gemini
    ;;
  all)
    setup_cursor
    setup_claude
    setup_copilot
    setup_gemini
    ;;
  *)
    echo "Usage: $0 [cursor|claude|copilot|vscode|gemini|all]" >&2
    exit 1
    ;;
esac
