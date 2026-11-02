// One row holds the whole planner state as JSON. A write only wins if it is newer than what is stored,
// so an out-of-date device can never overwrite newer data from another device.
import { neon } from '@neondatabase/serverless';
import { COOKIE, readCookie, validToken } from '../lib/auth.js';

const ROW = 'me';
let ready = null;

function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  return url ? neon(url) : null;
}
async function ensureTable(sql) {
  ready = ready || sql`CREATE TABLE IF NOT EXISTS life_state (
    id text PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at bigint NOT NULL
  )`;
  return ready;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!(await validToken(readCookie(req.headers.cookie, COOKIE)))) return res.status(401).json({ error: 'Sign in first' });
  const sql = db();
  if (!sql) return res.status(503).json({ error: 'The database is not connected yet' });
  try {
    await ensureTable(sql);
    if (req.method === 'GET') {
      const rows = await sql`SELECT data, updated_at FROM life_state WHERE id = ${ROW}`;
      return res.status(200).json(rows[0] ? { data: rows[0].data, updatedAt: Number(rows[0].updated_at) } : { data: null, updatedAt: 0 });
    }
    if (req.method === 'PUT') {
      const data = req.body && req.body.data;
      const at = Number(data && data.updatedAt);
      if (!data || typeof data !== 'object' || !at) return res.status(400).json({ error: 'Nothing to save' });
      if (JSON.stringify(data).length > 900000) return res.status(413).json({ error: 'Too much data' });
      const saved = await sql`
        INSERT INTO life_state (id, data, updated_at) VALUES (${ROW}, ${JSON.stringify(data)}::jsonb, ${at})
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
        WHERE life_state.updated_at < EXCLUDED.updated_at
        RETURNING updated_at`;
      if (saved.length) return res.status(200).json({ ok: true, updatedAt: at });
      const rows = await sql`SELECT data, updated_at FROM life_state WHERE id = ${ROW}`;
      return res.status(409).json({ error: 'Newer data is already saved', data: rows[0].data, updatedAt: Number(rows[0].updated_at) });
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Use GET or PUT' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'The database did not answer' });
  }
}
