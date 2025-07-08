#!/usr/bin/env sh

set -e # hata olursa dur

echo "Postinstall script started"

SEPOLIA_FILE="node_modules/viem/_esm/chains/definitions/sepolia.js"

if [ -f "$SEPOLIA_FILE" ]; then
  echo "Patching $SEPOLIA_FILE..."

  inplace_sed() {
    if sed --version >/dev/null 2>&1; then
      sed -i -E "$1" "$2"
    else
      sed -E -i '' "$1" "$2"
    fi
  }

  inplace_sed 's/(testnet:[[:space:]]*)true/\1false/' "$SEPOLIA_FILE"

  echo "Patch applied."
else
  echo "File not found: $SEPOLIA_FILE"
fi

echo "Postinstall script completed"
