#!/usr/bin/env bash
# 续接当初发布这个 Site 的 Codex 线程，让它按 sites-hosting 把当前 HEAD 发布到 chatgpt.site。
# 发布要推代码、要调 Sites 连接器，所以沙箱给 full access；一切走订阅登录（~/.codex/auth.json）。
set -uo pipefail
cd "$(dirname "$0")/.."

THREAD="01a08ae0-065a-77c0-b878-5ff65df24c64"
PROMPT="codex_publish_prompt.md"
OUT=".codex-publish/result.md"
LOG=".codex-publish/events.jsonl"
mkdir -p .codex-publish

echo "HEAD=$(git rev-parse HEAD)  branch=$(git rev-parse --abbrev-ref HEAD)"
git status --porcelain | head -3

codex exec resume "$THREAD" \
  --skip-git-repo-check \
  -c sandbox_mode="danger-full-access" \
  -c model_reasoning_effort=medium \
  --json \
  -o "$OUT" \
  - < "$PROMPT" > "$LOG" 2>&1
echo "exit=$?"
echo "----- 结果 -----"
cat "$OUT" 2>/dev/null || { echo "无输出，日志尾部："; tail -20 "$LOG"; }
