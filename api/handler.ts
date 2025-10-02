import type { Request, Response } from "express";

let _cachedApp: any = (global as any).__vercel_express_app;

async function loadApp() {
  if (_cachedApp) return _cachedApp;

  try {
    const m = await import("./index.js");
    const mm: any = m;
    _cachedApp = mm.default ?? mm.app ?? mm;
    (global as any).__vercel_express_app = _cachedApp;
    return _cachedApp;
  } catch (err) {
    console.error("Failed to import ./index.js", err);
    throw new Error("Failed to load API app");
  }
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await loadApp();
    return app(req, res);
  } catch (err) {
    console.error("api/handler failed to load app:", err);
    res.status(500).send("Server misconfigured: failed to load API app");
  }
}
