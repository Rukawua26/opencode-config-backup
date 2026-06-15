#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${HOME}/.config/opencode"
BACKUP_DIR="${HOME}/.config/opencode.backup.$(date +%Y%m%d-%H%M%S)"

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync no esta instalado. Instalalo y vuelve a ejecutar este script."
  exit 1
fi

mkdir -p "${HOME}/.config"

if [ -d "${TARGET_DIR}" ]; then
  cp -a "${TARGET_DIR}" "${BACKUP_DIR}"
  echo "Backup creado en: ${BACKUP_DIR}"
fi

rsync -a \
  --exclude ".git/" \
  --exclude "node_modules/" \
  --exclude ".env" \
  --exclude "README.md" \
  --exclude "install.sh" \
  "${SOURCE_DIR}/" "${TARGET_DIR}/"

for file in \
  "${TARGET_DIR}/opencode.jsonc" \
  "${TARGET_DIR}/profiles/work/opencode.jsonc" \
  "${TARGET_DIR}/profiles/personal/opencode.jsonc"; do
  sed -i "s|__HOME__|${HOME}|g" "${file}"
done

if [ ! -f "${TARGET_DIR}/.env" ]; then
  cp "${SOURCE_DIR}/.env.example" "${TARGET_DIR}/.env"
  echo "Se creo ${TARGET_DIR}/.env. Agrega tus API keys antes de usar MCP."
fi

if [ -f "${TARGET_DIR}/package-lock.json" ]; then
  npm ci --prefix "${TARGET_DIR}"
else
  npm install --prefix "${TARGET_DIR}"
fi

echo "Instalacion completada en ${TARGET_DIR}"
echo "Reinicia OpenCode para que cargue la nueva configuracion."
