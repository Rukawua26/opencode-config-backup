import { existsSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tool } from "@opencode-ai/plugin";

const HOME = process.env.HOME || process.env.USERPROFILE || '/tmp';
const CHECKPOINT_DIR = join(HOME, '.local/share/opencode/plugins-data/checkpoints');
const MAX_SNAPSHOTS = 10;
const SKIP_PATTERNS = [/node_modules/, /\.git\//, /\.local\/share\/opencode\/plugins-data/];

function isSkippable(absPath) {
  return SKIP_PATTERNS.some(p => p.test(absPath));
}

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function snapshotFile(filePath) {
  if (!filePath || typeof filePath !== 'string') return;
  if (!existsSync(filePath)) return;

  const absPath = resolve(filePath);
  if (isSkippable(absPath)) return;

  const safeName = absPath.replace(/[^a-zA-Z0-9_\-/.]/g, '_');
  const ts = Date.now();
  const dir = join(CHECKPOINT_DIR, safeName);

  ensureDir(dir);
  copyFileSync(absPath, join(dir, `${ts}.bak`));

  const snapshots = readdirSync(dir)
    .filter(f => f.endsWith('.bak'))
    .sort()
    .reverse();

  while (snapshots.length > MAX_SNAPSHOTS) {
    rmSync(join(dir, snapshots.pop()), { force: true });
  }
}

function extractFilePaths(args) {
  const paths = [];
  if (!args || typeof args !== 'object') return paths;

  const candidates = ['filePath', 'file_path', 'path', 'file', 'filepath'];
  for (const key of candidates) {
    if (typeof args[key] === 'string' && existsSync(args[key])) {
      paths.push(args[key]);
    }
  }

  if (Array.isArray(args.files)) {
    for (const f of args.files) {
      if (typeof f === 'string' && existsSync(f)) paths.push(f);
    }
  }

  return paths;
}

export const checkpointsPlugin = async () => {
  ensureDir(CHECKPOINT_DIR);

  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === 'edit' || input.tool === 'write' || input.tool === 'patch') {
        const paths = extractFilePaths(output.args);
        for (const p of paths) {
          snapshotFile(p);
        }
      }
    },

    "file.edited": async (input) => {
      if (input?.filePath) {
        snapshotFile(input.filePath);
      }
    },

    tool: {
      snapshots_list: tool({
        description: "Listar checkpoints (backups) disponibles de un archivo.",
        args: {
          file: tool.schema.string().describe("Ruta del archivo para ver sus snapshots"),
        },
        async execute(args, ctx) {
          const absPath = resolve(args.file);
          const safeName = absPath.replace(/[^a-zA-Z0-9_\-/.]/g, '_');
          const dir = join(CHECKPOINT_DIR, safeName);
          if (!existsSync(dir)) return "📭 No hay checkpoints para este archivo.";
          const files = readdirSync(dir).sort().reverse();
          return files.map(f => {
            const ts = parseInt(f.split('.')[0]);
            return `- ${new Date(ts).toISOString().replace('T', ' ').slice(0, 19)}`;
          }).join('\n') || "📭 No hay checkpoints.";
        },
      }),
    },
  };
};

export default checkpointsPlugin;
