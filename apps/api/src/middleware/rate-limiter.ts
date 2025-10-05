import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

/**
 * Configuration options for creating a rate limiter
 */
interface RateLimiterOptions {
  /**
   * Maximum number of requests allowed
   */
  max: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Message to send when rate limit is exceeded
   */
  message?: string;
  
  /**
   * Name for logging purposes
   */
  name?: string;
}

/**
 * Creates a rate limiter middleware with the given options
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const {
    max,
    windowMs,
    name = 'default',
    message = 'Too many requests, please try again later.',
  } = options;
  
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: {
        message,
        status: 429,
        timestamp: new Date().toISOString(),
      },
    },
    handler: (req, res, next, options) => {
      const requestId = req.headers['x-request-id'] as string;
      logger.warn(`Rate limit exceeded for ${name}`, {
        path: req.path,
        ip: req.ip,
        requestId,
      });
      res.status(429).json(options.message);
    },
  });
}

/**
 * URL ingestion rate limiter - more restrictive since it involves external requests and LLM API calls
 */
export const urlIngestRateLimiter = createRateLimiter({
  max: 10, // 10 requests
  windowMs: 60 * 1000, // per minute
  name: 'url-ingest',
  message: 'Rate limit exceeded for URL ingestion. Please try again later.',
});

/**
 * Default API rate limiter
 */
export const defaultRateLimiter = createRateLimiter({
  max: 100, // 100 requests
  windowMs: 60 * 1000, // per minute
  name: 'api-default',
  message: 'Too many requests, please try again later.',
});