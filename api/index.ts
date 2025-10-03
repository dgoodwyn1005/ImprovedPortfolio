import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes.js";
import path from "path";
import { supabase } from "./db.js";
import { SupabaseSessionStore } from './supabase-session-store.js';

const app = express();

// CORS configuration - must come before body parsers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parsing middleware
// Note: If you need raw body for webhooks (e.g., Stripe), handle those routes 
// separately BEFORE express.json() in routes.ts
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration with Supabase
const sessionConfig: any = {
  secret: process.env.SESSION_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET must be set in production');
    }
    return 'admin-session-secret-key-dev-only';
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
};

// Use Supabase session store
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  sessionConfig.store = new SupabaseSessionStore(supabase, 'user_sessions');
  console.log('Using Supabase session store');
} else {
  console.log('Using in-memory session store for development');
}

app.use(session(sessionConfig));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Initialize routes
(async () => {
  await registerRoutes(app);
  
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error('Express error:', err);
    res.status(status).json({ message });
  });

  // Setup frontend serving
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Vite will handle static files');
  } else {
    // Serve static files in production (built React app)
    const staticPath = path.join(process.cwd(), 'dist', 'public');
    app.use(express.static(staticPath));
    
    // Handle client-side routing - serve React app for non-API routes
    app.get('*', (req: Request, res: Response) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(staticPath, 'index.html'));
      }
    });
  }
})();

// Export for Vercel serverless functions
export default app;