import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { tool } from '@opencode-ai/plugin';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

const HOME = process.env.HOME || process.env.USERPROFILE || '/tmp';
const DATA_DIR = join(HOME, '.local/share/opencode/plugins-data');
const MEMORY_JSON = join(DATA_DIR, 'memory.json');
const MEMORY_DB = join(DATA_DIR, 'memory.db');
const MAX_CONTEXT = 8;

const CATEGORY_BONUS = {
  decision: 5,
  error: 4,
  learning: 4,
  config: 2,
  preference: 1,
};

const MEMORY_PROTOCOL = `
## MEMORY PROTOCOL

The agent manages persistent memory across sessions.

### Tools:
- memory_signal: Save a HIGH-VALUE signal (decision, error, learning, config, preference). Use topic_key to avoid duplicates.
- memory_search_v2: Search memory with full-text search.
- memory_context: Get top signals for a project before starting work.
- memory_timeline: View history of a project, optionally filtered by date.
- memory_get: View full details of a specific signal by ID.
- memory_update: Update an existing signal.
- memory_summarize_session: Call at session END to persist a summary.

### When to save:
- Design decision → memory_signal(category=decision)
- Bug fix / root cause → memory_signal(category=error)
- New understanding of codebase → memory_signal(category=learning)
- Important config discovered → memory_signal(category=config)
- User preference learned → memory_signal(category=preference)

### When to search:
- Before implementing something you may have done before
- When user asks about past decisions
- When debugging a similar issue
- At session start: memory_context(project=X)

### Session lifecycle:
At end of significant work session, call memory_summarize_session with a concise summary.
The next session will receive this summary automatically.
`;

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function openDB() {
  ensureDataDir();
  const db = new Database(MEMORY_DB);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS engram (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      importance INTEGER NOT NULL DEFAULT 3,
      project TEXT NOT NULL DEFAULT 'global',
      content TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      topic_key TEXT NOT NULL DEFAULT '',
      created TEXT NOT NULL,
      accessed TEXT NOT NULL
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS engram_fts USING fts5(
      id UNINDEXED,
      category,
      project,
      content,
      context,
      tags
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      project TEXT NOT NULL DEFAULT 'global',
      summary TEXT NOT NULL DEFAULT '',
      engram_count INTEGER NOT NULL DEFAULT 0,
      started TEXT NOT NULL,
      ended TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project);
    CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started);
    CREATE INDEX IF NOT EXISTS idx_engram_project ON engram(project);
  `);
  migrateV2Schema(db);
  migrateJsonEngrams(db);
  return db;
}

function migrateV2Schema(db) {
  try {
    db.exec("ALTER TABLE engram ADD COLUMN topic_key TEXT NOT NULL DEFAULT ''");
  } catch {}
  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_engram_topic ON engram(project, topic_key)");
  } catch {}
  try {
    db.exec("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, project TEXT NOT NULL DEFAULT 'global', summary TEXT NOT NULL DEFAULT '', engram_count INTEGER NOT NULL DEFAULT 0, started TEXT NOT NULL, ended TEXT)");
  } catch {}
  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project)");
  } catch {}
  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started)");
  } catch {}
  try {
    db.exec("CREATE INDEX IF NOT EXISTS idx_engram_project ON engram(project)");
  } catch {}
}

function migrateJsonEngrams(db) {
  try {
    db.exec('CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
    const migrated = db.prepare("SELECT value FROM meta WHERE key = 'json_migrated'");
    if (migrated.get()) return;
  } catch {
    return;
  }

  if (!existsSync(MEMORY_JSON)) {
    db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('json_migrated', ?)").run(new Date().toISOString());
    return;
  }

  try {
    const parsed = JSON.parse(readFileSync(MEMORY_JSON, 'utf-8'));
    const engrams = Array.isArray(parsed.engram) ? parsed.engram : [];
    const insert = db.prepare(`
      INSERT OR IGNORE INTO engram (id, category, importance, project, content, context, tags, topic_key, created, accessed)
      VALUES (@id, @category, @importance, @project, @content, @context, @tags, '', @created, @accessed)
    `);
    const insertFts = db.prepare(`
      INSERT OR REPLACE INTO engram_fts (id, category, project, content, context, tags)
      VALUES (@id, @category, @project, @content, @context, @tagsText)
    `);
    const tx = db.transaction((items) => {
      for (const item of items) {
        const entry = normalizeEntry({ ...item, topic_key: '' });
        insert.run(entry);
        insertFts.run({ ...entry, tagsText: tagsToText(entry.tags) });
      }
      db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('json_migrated', ?)").run(new Date().toISOString());
    });
    tx(engrams);
  } catch {
    db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('json_migrated', ?)").run(new Date().toISOString());
  }
}

function normalizeEntry(input) {
  const now = new Date().toISOString();
  const tags = Array.isArray(input.tags) ? input.tags : parseTags(input.tags);
  return {
    id: String(input.id || genId()),
    category: validCategory(input.category),
    importance: clampImportance(input.importance),
    project: String(input.project || 'global').slice(0, 80),
    content: String(input.content || '').slice(0, 800),
    context: String(input.context || '').slice(0, 300),
    tags: JSON.stringify(tags.map((tag) => String(tag).slice(0, 40)).slice(0, 12)),
    topic_key: String(input.topic_key || '').slice(0, 120),
    created: String(input.created || now),
    accessed: String(input.accessed || now),
  };
}

function validCategory(category) {
  return Object.prototype.hasOwnProperty.call(CATEGORY_BONUS, category) ? category : 'learning';
}

function clampImportance(importance) {
  return Math.max(1, Math.min(5, Number(importance) || 3));
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags || '[]');
  } catch {
    return [];
  }
}

function tagsToText(tagsJson) {
  return parseTags(tagsJson).join(' ');
}

function genId() {
  return `e${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function ageBonus(created) {
  const createdMs = new Date(created).getTime();
  if (!Number.isFinite(createdMs)) return 0;
  const days = (Date.now() - createdMs) / 86400000;
  if (days <= 7) return 5;
  if (days <= 30) return 3;
  return 1;
}

function lexicalScore(entry, query, project) {
  const words = normalizeWords(query);
  const text = [entry.content, entry.context, entry.category, entry.project, tagsToText(entry.tags)].join(' ').toLowerCase();
  let score = CATEGORY_BONUS[entry.category] || 0;
  score += clampImportance(entry.importance) * 2;
  score += ageBonus(entry.created);
  for (const word of words) {
    if (text.includes(word)) score += 2;
    if (tagsToText(entry.tags).toLowerCase().split(/\s+/).includes(word)) score += 3;
  }
  if (project && String(entry.project).toLowerCase() === String(project).toLowerCase()) score += 2;
  return score;
}

function normalizeWords(text) {
  return String(text || '')
    .toLowerCase()
    .split(/[^a-z0-9_-]+/i)
    .filter((word) => word.length > 2)
    .slice(0, 12);
}

function ftsQuery(query) {
  const words = normalizeWords(query).map((word) => word.replace(/"/g, ''));
  if (words.length === 0) return '';
  return words.map((word) => `"${word}"`).join(' OR ');
}

function rowsToEntries(rows) {
  return rows.map((row) => ({ ...row, tags: row.tags || '[]' }));
}

function formatEngram(entry, score) {
  const tags = parseTags(entry.tags);
  const suffix = tags.length ? ` tags=${tags.join(',')}` : '';
  return `[${entry.category} i${entry.importance} score=${score}] ${entry.project || 'global'} :: ${entry.content}${suffix}`;
}

function formatEngramDetail(entry) {
  const tags = parseTags(entry.tags);
  const lines = [
    `ID: ${entry.id}`,
    `Project: ${entry.project}`,
    `Category: ${entry.category}`,
    `Importance: ${entry.importance}`,
    `Content: ${entry.content}`,
    `Context: ${entry.context}`,
    `Tags: ${tags.join(', ') || '(none)'}`,
    `Topic key: ${entry.topic_key || '(none)'}`,
    `Created: ${entry.created}`,
    `Accessed: ${entry.accessed}`,
  ];
  return lines.join('\n');
}

function insertEngram(db, input) {
  const entry = normalizeEntry(input);
  db.prepare(`
    INSERT INTO engram (id, category, importance, project, content, context, tags, topic_key, created, accessed)
    VALUES (@id, @category, @importance, @project, @content, @context, @tags, @topic_key, @created, @accessed)
  `).run(entry);
  db.prepare(`
    INSERT INTO engram_fts (id, category, project, content, context, tags)
    VALUES (@id, @category, @project, @content, @context, @tagsText)
  `).run({ ...entry, tagsText: tagsToText(entry.tags) });
  return entry;
}

function upsertEngram(db, input) {
  const entry = normalizeEntry(input);

  if (entry.topic_key) {
    const existing = db.prepare(
      'SELECT id FROM engram WHERE project = ? AND topic_key = ? LIMIT 1'
    ).get(entry.project, entry.topic_key);

    if (existing) {
      entry.id = existing.id;
      db.prepare(`
        UPDATE engram SET category=?, importance=?, content=?, context=?, tags=?, accessed=?
        WHERE id = ?
      `).run(entry.category, entry.importance, entry.content, entry.context, entry.tags, entry.accessed, entry.id);
      db.prepare(`
        UPDATE engram_fts SET category=?, project=?, content=?, context=?, tags=?
        WHERE id = ?
      `).run(entry.category, entry.project, entry.content, entry.context, tagsToText(entry.tags), entry.id);
      return { ...entry, updated: true };
    }
  }

  return { ...insertEngram(db, entry), updated: false };
}

function updateAccessed(db, ids) {
  if (ids.length === 0) return;
  const stmt = db.prepare('UPDATE engram SET accessed = ? WHERE id = ?');
  const now = new Date().toISOString();
  const tx = db.transaction((items) => {
    for (const id of items) stmt.run(now, id);
  });
  tx(ids);
}

function ensureSession(db, project) {
  const open = db.prepare(
    "SELECT id FROM sessions WHERE project = ? AND ended IS NULL LIMIT 1"
  ).get(project);
  if (open) {
    const count = db.prepare(
      'SELECT COUNT(*) as c FROM engram WHERE project = ? AND created >= (SELECT started FROM sessions WHERE id = ?)'
    ).get(project, open.id);
    if (count) {
      db.prepare('UPDATE sessions SET engram_count = ? WHERE id = ?').run(count.c, open.id);
    }
    return open.id;
  }

  const id = `s${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO sessions (id, project, engram_count, started) VALUES (?, ?, 0, ?)'
  ).run(id, project, now);
  return id;
}

function closeSession(db, project, summary) {
  const now = new Date().toISOString();
  const count = db.prepare(
    'SELECT COUNT(*) as c FROM engram WHERE project = ?'
  ).get(project);
  const result = db.prepare(
    "UPDATE sessions SET ended = ?, summary = ?, engram_count = ? WHERE project = ? AND ended IS NULL ORDER BY started DESC LIMIT 1"
  ).run(now, summary.slice(0, 2000), count ? count.c : 0, project);
  return result.changes > 0;
}

function getLastSessionSummary(db, project) {
  const row = db.prepare(
    "SELECT summary, engram_count FROM sessions WHERE project = ? AND ended IS NOT NULL AND summary != '' ORDER BY ended DESC LIMIT 1"
  ).get(project);
  return row || null;
}

export const memoryV2Plugin = async () => {
  const initDB = openDB();
  initDB.close();

  return {

  'experimental.chat.system.transform': async (_input, output) => {
    if (output.system.length > 0) {
      output.system[output.system.length - 1] += '\n\n' + MEMORY_PROTOCOL;
    } else {
      output.system.push(MEMORY_PROTOCOL);
    }
  },

  'experimental.session.compacting': async (_input, output) => {
    const db = openDB();
    try {
      const top = db.prepare("SELECT * FROM engram ORDER BY importance DESC, created DESC LIMIT 5").all();
      const blocks = [];

      if (top.length > 0) {
        blocks.push(`## ENGRAMS IMPORTANTES\n${top.map((entry) => `- ${entry.content}`).join('\n')}`);
      }

      const projects = [...new Set(top.map(e => e.project).filter(Boolean))];
      for (const project of projects.slice(0, 2)) {
        const lastSession = getLastSessionSummary(db, project);
        if (lastSession) {
          blocks.push(`## ULTIMA SESION (${project})\nResumen: ${lastSession.summary}\nEngrams generados: ${lastSession.engram_count}`);
        }
      }

      if (blocks.length > 0) {
        output.context.push(blocks.join('\n\n'));
      }
    } finally {
      db.close();
    }
  },

  tool: {
    memory_signal: tool({
      description: 'Guardar una senal de alto valor: decision, error, learning, config o preference.',
      args: {
        category: tool.schema.enum(['decision', 'error', 'learning', 'config', 'preference']).describe('Tipo de senal.'),
        importance: tool.schema.number().optional().default(3).describe('Importancia 1-5.'),
        project: tool.schema.string().optional().default('global').describe('Proyecto asociado, ej: pbot, vozart.'),
        content: tool.schema.string().describe('Hecho concreto a recordar, max 800 chars.'),
        context: tool.schema.string().optional().default('').describe('Archivo/spec/fuente relacionada.'),
        tags: tool.schema.array(tool.schema.string()).optional().default([]).describe('Tags de busqueda.'),
        topic_key: tool.schema.string().optional().default('').describe('Clave unica para upsert: si existe mismo project+topic_key, se actualiza en vez de duplicar.'),
      },
      async execute(args, ctx) {
        const db = openDB();
        try {
          ensureSession(db, args.project || 'global');
          const result = upsertEngram(db, args);
          const verb = result.updated ? 'Actualizado' : 'Guardado';
          ctx.metadata({ title: `engram ${result.updated ? '~' : '+'}1 ${result.category}` });
          return `${verb} engram ${result.id}: ${result.content.slice(0, 140)}`;
        } finally {
          db.close();
        }
      },
    }),

    memory_search_v2: tool({
      description: 'Buscar engramas con SQLite FTS5, scoring, proyecto y tags.',
      args: {
        query: tool.schema.string().describe('Consulta de busqueda.'),
        project: tool.schema.string().optional().default('').describe('Proyecto preferido.'),
        limit: tool.schema.number().optional().default(10).describe('Max resultados.'),
      },
      async execute(args) {
        const db = openDB();
        try {
          const limit = Math.max(1, Math.min(20, Number(args.limit) || 10));
          const match = ftsQuery(args.query);
          let rows;
          if (match) {
            rows = db.prepare(`
              SELECT e.*
              FROM engram_fts f
              JOIN engram e ON e.id = f.id
              WHERE engram_fts MATCH ?
              LIMIT 80
            `).all(match);
          } else {
            rows = db.prepare('SELECT * FROM engram ORDER BY importance DESC, created DESC LIMIT 80').all();
          }
          const results = rowsToEntries(rows)
            .map((entry) => ({ entry, score: lexicalScore(entry, args.query, args.project) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
          updateAccessed(db, results.map((item) => item.entry.id));
          if (results.length === 0) return 'No se encontraron engramas relevantes.';
          return results.map((item) => formatEngram(item.entry, item.score)).join('\n\n');
        } finally {
          db.close();
        }
      },
    }),

    memory_context: tool({
      description: 'Obtener las senales mas importantes para un proyecto antes de trabajar.',
      args: {
        project: tool.schema.string().describe('Proyecto, ej: pbot, vozart, osiris.'),
        limit: tool.schema.number().optional().default(MAX_CONTEXT).describe('Max resultados.'),
      },
      async execute(args) {
        const db = openDB();
        try {
          ensureSession(db, args.project);
          const limit = Math.max(1, Math.min(20, Number(args.limit) || MAX_CONTEXT));
          const rows = db.prepare('SELECT * FROM engram WHERE lower(project) = lower(?) ORDER BY importance DESC, created DESC LIMIT ?').all(args.project, limit);
          const results = rowsToEntries(rows).map((entry) => ({ entry, score: lexicalScore(entry, args.project, args.project) }));
          updateAccessed(db, results.map((item) => item.entry.id));

          const lastSession = getLastSessionSummary(db, args.project);
          const parts = [];
          if (results.length > 0) {
            parts.push(results.map((item) => formatEngram(item.entry, item.score)).join('\n\n'));
          }
          if (lastSession) {
            parts.push(`\n## ULTIMA SESION\nResumen: ${lastSession.summary}\nEngrams: ${lastSession.engram_count}`);
          }
          if (parts.length === 0) return `No hay engramas para ${args.project}.`;
          return parts.join('\n\n');
        } finally {
          db.close();
        }
      },
    }),

    memory_timeline: tool({
      description: 'Ver historial de engramas por proyecto, opcionalmente filtrado por fecha.',
      args: {
        project: tool.schema.string().describe('Proyecto, ej: pbot, vozart.'),
        date_from: tool.schema.string().optional().default('').describe('Fecha inicio ISO (opcional).'),
        date_to: tool.schema.string().optional().default('').describe('Fecha fin ISO (opcional).'),
        limit: tool.schema.number().optional().default(20).describe('Max resultados.'),
      },
      async execute(args) {
        const db = openDB();
        try {
          const project = args.project;
          const limit = Math.max(1, Math.min(100, Number(args.limit) || 20));
          let sql = 'SELECT * FROM engram WHERE lower(project) = lower(?)';
          const params = [project.toLowerCase()];

          if (args.date_from) {
            sql += ' AND created >= ?';
            params.push(args.date_from);
          }
          if (args.date_to) {
            sql += ' AND created <= ?';
            params.push(args.date_to);
          }

          sql += ' ORDER BY created DESC LIMIT ?';
          params.push(limit);

          const rows = db.prepare(sql).all(...params);
          const entries = rowsToEntries(rows);
          if (entries.length === 0) return `No hay engramas para ${project}${args.date_from || args.date_to ? ' en el rango indicado' : ''}.`;
          return entries.map((entry) => {
            const tags = parseTags(entry.tags);
            return `${entry.created.slice(0, 10)} [${entry.category} i${entry.importance}] ${entry.content}${tags.length ? ` (${tags.join(',')})` : ''}`;
          }).join('\n');
        } finally {
          db.close();
        }
      },
    }),

    memory_get: tool({
      description: 'Ver detalle completo de un engrama por ID.',
      args: {
        id: tool.schema.string().describe('ID del engrama (ej: e1234567890_abcd).'),
      },
      async execute(args) {
        const db = openDB();
        try {
          const row = db.prepare('SELECT * FROM engram WHERE id = ?').get(args.id);
          if (!row) return `No se encontro engrama con id: ${args.id}`;
          updateAccessed(db, [args.id]);
          return formatEngramDetail(rowsToEntries([row])[0]);
        } finally {
          db.close();
        }
      },
    }),

    memory_update: tool({
      description: 'Actualizar un engrama existente por ID.',
      args: {
        id: tool.schema.string().describe('ID del engrama a actualizar.'),
        content: tool.schema.string().optional().describe('Nuevo contenido.'),
        importance: tool.schema.number().optional().describe('Nueva importancia 1-5.'),
        category: tool.schema.enum(['decision', 'error', 'learning', 'config', 'preference']).optional().describe('Nueva categoria.'),
        tags: tool.schema.array(tool.schema.string()).optional().describe('Nuevos tags.'),
        context: tool.schema.string().optional().describe('Nuevo contexto.'),
      },
      async execute(args) {
        const db = openDB();
        try {
          const existing = db.prepare('SELECT * FROM engram WHERE id = ?').get(args.id);
          if (!existing) return `No se encontro engrama con id: ${args.id}`;

          const updates = [];
          const ftsUpdates = [];
          const params = [];
          const ftsParams = [];

          if (args.content !== undefined) {
            const val = String(args.content).slice(0, 800);
            updates.push('content = ?');
            ftsUpdates.push('content = ?');
            params.push(val);
            ftsParams.push(val);
          }
          if (args.importance !== undefined) {
            const val = clampImportance(args.importance);
            updates.push('importance = ?');
            params.push(val);
          }
          if (args.category !== undefined) {
            const val = validCategory(args.category);
            updates.push('category = ?');
            ftsUpdates.push('category = ?');
            params.push(val);
            ftsParams.push(val);
          }
          if (args.tags !== undefined) {
            const val = JSON.stringify(args.tags.map(t => String(t).slice(0, 40)).slice(0, 12));
            updates.push('tags = ?');
            params.push(val);
            ftsUpdates.push('tags = ?');
            ftsParams.push(tagsToText(val));
          }
          if (args.context !== undefined) {
            const val = String(args.context).slice(0, 300);
            updates.push('context = ?');
            ftsUpdates.push('context = ?');
            params.push(val);
            ftsParams.push(val);
          }

          if (updates.length === 0) return 'No se proporcionaron campos para actualizar.';

          const now = new Date().toISOString();
          updates.push('accessed = ?');
          params.push(now);

          params.push(args.id);
          db.prepare(`UPDATE engram SET ${updates.join(', ')} WHERE id = ?`).run(...params);

          if (ftsUpdates.length > 0) {
            ftsParams.push(args.id);
            try {
              db.prepare(`UPDATE engram_fts SET ${ftsUpdates.join(', ')} WHERE id = ?`).run(...ftsParams);
            } catch {}
          }

          return `Actualizado engrama ${args.id}.`;
        } finally {
          db.close();
        }
      },
    }),

    memory_summarize_session: tool({
      description: 'Cerrar la sesion actual con un resumen de lo trabajado.',
      args: {
        project: tool.schema.string().describe('Proyecto de la sesion, ej: pbot, vozart.'),
        summary: tool.schema.string().describe('Resumen conciso de lo que se hizo en esta sesion.'),
      },
      async execute(args) {
        const db = openDB();
        try {
          const closed = closeSession(db, args.project, args.summary);
          if (closed) {
            return `Sesion cerrada para ${args.project}. Resumen guardado.`;
          }
          return `No habia sesion abierta para ${args.project}. Se ha creado una nueva sesion con el resumen.`;
        } finally {
          db.close();
        }
      },
    }),
  },
  };
};

export default memoryV2Plugin;
