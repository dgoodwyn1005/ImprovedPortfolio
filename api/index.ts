import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { registerRoutes } from "./routes";
import path from "path";

const app = express();
// Keep a copy of the raw body on the request for endpoints that need
// to verify signatures (Stripe webhooks). We still parse JSON for normal routes.
app.use((req, res, next) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    // Save raw body for webhook handlers; don't overwrite if already set
    if (data && !('rawBody' in req)) {
      // Some frameworks attach rawBody; follow that convention
      (req as any).rawBody = data;
    }
    next();
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration for Vercel
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

// Session configuration with PostgreSQL fallback for development
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
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
};

// Use PostgreSQL session store when DATABASE_URL is available (production/Vercel)
if (process.env.DATABASE_URL) {
  const PgSession = connectPgSimple(session);
  sessionConfig.store = new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions',
    createTableIfMissing: true,
  });
  console.log('Using PostgreSQL session store');
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
    const { setupVite, serveStatic } = await import('./vite');
    // Note: In development, Vite middleware will be added by setupVite
    console.log('Vite development middleware will be set up by the dev server');
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

// Note: Server startup is now handled by server/index.ts in development
// This ensures compatibility with existing npm scripts while supporting Vercel deployment