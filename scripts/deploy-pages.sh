#!/usr/bin/env bash
# 把 static/ 发到 GitHub Pages（国内可访问的备用入口）。
# 正式站仍在 OpenAI Sites，这里只是给大陆用的镜像。
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="guangzhou-trip-2026"
OWNER="minisochuck-commits"
SRC="static"

[ -d "$SRC/_next" ] || { echo "没有 $SRC/_next，先跑 make-static.mjs"; exit 1; }
[ -f "$SRC/index.html" ] || { echo "没有 $SRC/index.html"; exit 1; }

TMP="$(mktemp -d)"
cp -R "$SRC/." "$TMP/"
touch "$TMP/.nojekyll"

cd "$TMP"
git init -q -b main
git config user.name minisochuck
git config user.email minisochuck@gmail.com
git add -A
git commit -q -m "$(cat <<'MSG'
Publish guide from source 80d3c7c

Serves the same build from a host that opens inside mainland China;
the OpenAI Sites deployment stays the primary one.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
MSG
)"

if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  echo "仓库已存在，复用"
else
  gh repo create "$OWNER/$REPO" --public \
    -d "MINISO Egypt 广州行程分享页（国内可访问镜像）" >/dev/null
  echo "已创建 $OWNER/$REPO"
fi

git remote add origin "https://github.com/$OWNER/$REPO.git"
git push -f -q origin main
echo "已推送"

gh api -X POST "repos/$OWNER/$REPO/pages" \
  -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || gh api -X PUT "repos/$OWNER/$REPO/pages" \
      -f "source[branch]=main" -f "source[path]=/" >/dev/null 2>&1 \
  || true

echo "URL=https://$OWNER.github.io/$REPO/"
cd - >/dev/null
rm -rf "$TMP"
