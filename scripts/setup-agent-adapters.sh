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

case "$TARGET" in
  cursor)
    setup_cursor
    ;;
  claude)
    setup_claude
    ;;
  all)
    setup_cursor
    setup_claude
    ;;
  *)
    echo "Usage: $0 [cursor|claude|all]" >&2
    exit 1
    ;;
esac
