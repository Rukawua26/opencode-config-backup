#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${HOME}/.config/opencode"
BACKUP_DIR="${HOME}/.config/opencode.backup.$(date +%Y%m%d-%H%M%S)"
SKILLS_DIR="${HOME}/opencode-custom/skills"

if [ ! -d "${SOURCE_DIR}/.git" ]; then
  echo "ERROR: Ejecuta desde la raiz del repositorio clonado."
  exit 1
fi

mkdir -p "${HOME}/.config" "${SKILLS_DIR}"

# Backup de config existente
if [ -d "${TARGET_DIR}" ]; then
  cp -a "${TARGET_DIR}" "${BACKUP_DIR}"
  echo "Backup creado en: ${BACKUP_DIR}"
fi

# Copiar configuracion principal sin depender de rsync.
mkdir -p "${TARGET_DIR}"
for item in "${SOURCE_DIR}"/* "${SOURCE_DIR}"/.[!.]* "${SOURCE_DIR}"/..?*; do
  [ -e "${item}" ] || continue
  name=$(basename "${item}")
  case "${name}" in
    .git|node_modules|.env|README.md|install.sh|skills) continue ;;
  esac
  cp -a "${item}" "${TARGET_DIR}/"
done

# Copiar skills a ~/opencode-custom/skills
rm -rf "${SKILLS_DIR}"
mkdir -p "$(dirname "${SKILLS_DIR}")"
cp -a "${SOURCE_DIR}/skills" "${SKILLS_DIR}"

# Copiar AGENTS.md a ~/AGENTS.md
cp "${SOURCE_DIR}/AGENTS.md" "${HOME}/AGENTS.md"

# Reemplazar __HOME__ por el home real del usuario
for file in \
  "${TARGET_DIR}/opencode.jsonc" \
  "${TARGET_DIR}/profiles/work/opencode.jsonc" \
  "${TARGET_DIR}/profiles/personal/opencode.jsonc" \
  "${TARGET_DIR}/profiles/light/opencode.jsonc" \
  "${TARGET_DIR}/tools/agent-consult.ts" \
  "${TARGET_DIR}/commands/spec.md"; do
  if [ -f "${file}" ]; then
    sed -i "s|__HOME__|${HOME}|g" "${file}"
  fi
done

# Los symlinks relativos y agentes regulares se preservan con rsync -a.
agent_count=0
for agent_file in "${TARGET_DIR}/agents/"*.md; do
  [ -e "${agent_file}" ] || {
    if [ -L "${agent_file}" ]; then
      echo "ERROR: symlink de agente roto: ${agent_file}"
      exit 1
    fi
    continue
  }
  agent_count=$((agent_count + 1))
done
echo "Agentes activos restaurados: ${agent_count}"

# Crear .env si no existe
if [ ! -f "${TARGET_DIR}/.env" ]; then
  cp "${SOURCE_DIR}/.env.example" "${TARGET_DIR}/.env"
  echo "Se creo ${TARGET_DIR}/.env. Agrega tus API keys antes de usar MCP."
fi

# Instalar dependencias npm, salvo en pruebas de restauracion aisladas.
if [ "${OPENCODE_SKIP_INSTALL:-0}" = "1" ]; then
  echo "Instalacion npm omitida por OPENCODE_SKIP_INSTALL=1"
elif [ -f "${TARGET_DIR}/package-lock.json" ]; then
  npm ci --prefix "${TARGET_DIR}"
else
  npm install --prefix "${TARGET_DIR}"
fi

echo ""
echo "Instalacion completada:"
echo "  Config: ${TARGET_DIR}"
echo "  Skills: ${SKILLS_DIR}"
echo "  Rules: ${HOME}/AGENTS.md"
echo ""
echo "Reinicia OpenCode para que cargue la nueva configuracion."
