#!/usr/bin/env bash
# Builds the submitted Firefox extension from a clean checkout of this source archive.
#
#   bash scripts/build.sh          # Firefox (default) → output/firefox-mv2
#   bash scripts/build.sh chrome   # Chrome            → output/chrome-mv3
#
# Invoked via `bash` because a zip archive doesn't carry the executable bit.
#
# Every step is here; there is nothing to run before or after it.

set -euo pipefail
cd "$(dirname "$0")/.."

TARGET="${1:-firefox}"
REQUIRED_NODE_MAJOR=18

command -v node >/dev/null 2>&1 || { echo "error: node is not installed — see the README."; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "error: npm is not installed — see the README."; exit 1; }

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ]; then
  echo "error: Node $REQUIRED_NODE_MAJOR or newer is required (found $(node --version))."
  exit 1
fi

echo "==> node $(node --version), npm $(npm --version)"

# `npm ci` (not `install`) so the exact versions in package-lock.json are used, which is
# what makes the build reproducible. It also runs `wxt prepare`, generating the
# TypeScript types under .wxt/ that the build needs.
echo "==> installing dependencies"
npm ci

echo "==> building ($TARGET)"
if [ "$TARGET" = "chrome" ]; then
  npm run build
  echo "==> done: output/chrome-mv3"
else
  npm run build:firefox
  echo "==> done: output/firefox-mv2"
fi
