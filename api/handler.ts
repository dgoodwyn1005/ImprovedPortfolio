// Vercel sometimes packages serverless functions in a way where the
// compiled filename or module format differs (./index, ./index.js, CJS, etc.).
// Dynamically load the Express `app` at runtime with multiple fallbacks so
// the function doesn't crash with ERR_MODULE_NOT_FOUND when the exact path
// isn't present in the deployment bundle.

let _cachedApp: any = (global as any).__vercel_express_app;
async function loadApp() {
  if (_cachedApp) return _cachedApp;

  const errors: any[] = [];

  // Try a few common import/require strategies. Prefer ESM dynamic import
  // with explicit .js extension first (this is how Vercel usually emits).
  try {
    const m = await import('./index.js');
    const mm: any = m;
    _cachedApp = mm.default ?? mm.app ?? mm;
    (global as any).__vercel_express_app = _cachedApp;
    return _cachedApp;
  } catch (err) {
    errors.push(err);
  }

  try {
    const m = await import('./index');
    const mm: any = m;
    _cachedApp = mm.default ?? mm.app ?? mm;
    (global as any).__vercel_express_app = _cachedApp;
    return _cachedApp;
  } catch (err) {
    errors.push(err);
  }

  // Fall back to CommonJS require using createRequire
  try {
    // `createRequire` is available in Node.js and works in ESM modules
    const mod: any = await import('module');
    const createRequire = mod.createRequire;
    const require = createRequire(import.meta.url);
    // Try both index.js and index
    try {
      const m = require('./index.js');
      const mm: any = m;
      _cachedApp = mm.default ?? mm.app ?? mm;
      (global as any).__vercel_express_app = _cachedApp;
      return _cachedApp;
    } catch (innerErr) {
      errors.push(innerErr);
    }

    try {
      const m = require('./index');
      const mm: any = m;
      _cachedApp = mm.default ?? mm.app ?? mm;
      (global as any).__vercel_express_app = _cachedApp;
      return _cachedApp;
    } catch (innerErr) {
      errors.push(innerErr);
    }
  } catch (err) {
    errors.push(err);
  }

  const aggregate = new Error('Failed to load API app using multiple resolution strategies');
  (aggregate as any).errors = errors;
  throw aggregate;
}

// Export the Vercel serverless handler. We load the Express app lazily so
// that deployments which don't include `api/index` at the exact resolved
// path won't immediately crash the function; instead the handler will return
// a 500 with diagnostics.
export default async function handler(req: any, res: any) {
  try {
    const app = await loadApp();
    // Express app is a function compatible with (req, res)
    return app(req, res);
  } catch (err) {
    console.error('api/handler failed to load app:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Server misconfigured: failed to load API app');
  }
}
