// CommonJS wrapper to expose Postgres pool for serverless API routes
// Uses server/db.js which is ES module; require via dynamic import
let pool = null;

async function getPool() {
  if (pool) return pool;
  try {
    const mod = await import('../server/db.js');
    // the server/db exports `pool`
    pool = mod.pool;
    return pool;
  } catch (e) {
    console.warn('[api/_pg] failed to import server/db pool:', e && e.message ? e.message : e);
    return null;
  }
}

module.exports = { getPool };
