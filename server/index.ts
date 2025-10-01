// Development server runner for Replit workflow
// This allows the existing "npm run dev" script to work while we migrate to Vercel
// The actual serverless function code is now in api/index.ts

import app from '../api/index.ts';
import { createServer } from 'http';

(async () => {
  const port = parseInt(process.env.PORT || '5000', 10);
  const server = createServer(app);

  // Setup Vite middleware in development for frontend serving
  if (process.env.NODE_ENV === 'development') {
    const { setupVite } = await import('../api/vite.ts');
    await setupVite(app, server);
    console.log('Vite development middleware attached');
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port} with full dev setup`);
  });
})();