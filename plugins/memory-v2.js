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

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function openDB() {
  ensureDataDir();
  const db = new Database(MEMORY_DB);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS engram (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      importance INTEGER NOT NULL DEFAULT 3,
      project TEXT NOT NULL DEFAULT 'global',
      content TEXT NOT NULL,
      context TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
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
  `);
  migrateJsonEngrams(db);
  return db;
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
      INSERT OR IGNORE INTO engram (id, category, importance, project, content, context, tags, created, accessed)
      VALUES (@id, @category, @importance, @project, @content, @context, @tags, @created, @accessed)
    `);
    const insertFts = db.prepare(`
      INSERT OR REPLACE INTO engram_fts (id, category, project, content, context, tags)
      VALUES (@id, @category, @project, @content, @context, @tagsText)
    `);
    const tx = db.transaction((items) => {
      for (const item of items) {
        const entry = normalizeEntry(item);
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
    const parsed = JSON.parse(tags || '[]');
    return Array.isArray(parsed) ? parsed : [];
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

function insertEngram(db, input) {
  const entry = normalizeEntry(input);
  db.prepare(`
    INSERT INTO engram (id, category, importance, project, content, context, tags, created, accessed)
    VALUES (@id, @category, @importance, @project, @content, @context, @tags, @created, @accessed)
  `).run(entry);
  db.prepare(`
    INSERT INTO engram_fts (id, category, project, content, context, tags)
    VALUES (@id, @category, @project, @content, @context, @tagsText)
  `).run({ ...entry, tagsText: tagsToText(entry.tags) });
  return entry;
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

export const memoryV2Plugin = async () => {
  const initDB = openDB();
  initDB.close();

  return {
  'experimental.session.compacting': async (_input, output) => {
    const db = openDB();
    try {
      const top = db.prepare('SELECT * FROM engram ORDER BY importance DESC, created DESC LIMIT 5').all();
      if (top.length > 0) output.context.push(`## ENGRAMS IMPORTANTES\n${top.map((entry) => `- ${entry.content}`).join('\n')}`);
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
      },
      async execute(args, ctx) {
        const db = openDB();
        try {
          const entry = insertEngram(db, args);
          ctx.metadata({ title: `engram +1 ${entry.category}` });
          return `Guardado en SQLite engram ${entry.id}: ${entry.content.slice(0, 140)}`;
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
          const limit = Math.max(1, Math.min(20, Number(args.limit) || MAX_CONTEXT));
          const rows = db.prepare('SELECT * FROM engram WHERE lower(project) = lower(?) ORDER BY importance DESC, created DESC LIMIT ?').all(args.project, limit);
          const results = rowsToEntries(rows).map((entry) => ({ entry, score: lexicalScore(entry, args.project, args.project) }));
          updateAccessed(db, results.map((item) => item.entry.id));
          if (results.length === 0) return `No hay engramas para ${args.project}.`;
          return results.map((item) => formatEngram(item.entry, item.score)).join('\n\n');
        } finally {
          db.close();
        }
      },
    }),
  },
  };
};

export default memoryV2Plugin;
