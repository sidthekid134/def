import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { logger, morganStream } from './utils/logger';
import { errorHandler } from './middleware/error-handler';
import { defaultRateLimiter } from './middleware/rate-limiter';

// Import routes
import ingestRoutes from './routes/ingest';

/**
 * Create and configure the Express application
 */
export function createApp(): Express {
  const app = express();

  // Add request ID to each request
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.headers['x-request-id'] = req.headers['x-request-id'] || uuidv4();
    next();
  });

  // Security middleware
  app.use(helmet());
  app.use(cors());
  
  // Request logging
  app.use(
    morgan('[:date[iso]] ":method :url" :status :res[content-length] - :response-time ms', { 
      stream: morganStream 
    })
  );
  
  // Request parsing
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Apply default rate limiter to all routes
  app.use(defaultRateLimiter);

  // API routes
  app.use('/ingest', ingestRoutes);

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        message: 'Not Found',
        status: 404,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Error handler must be last
  app.use(errorHandler);

  return app;
}

// If this file is run directly, start the server
if (require.main === module) {
  const app = createApp();
  const port = process.env.PORT || 3000;
  
  app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  });
}