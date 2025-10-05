import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Error response structure
 */
interface ErrorResponse {
  error: {
    message: string;
    status: number;
    timestamp: string;
    path: string;
    requestId?: string;
    [key: string]: any;
  };
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Set default status code
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  
  // Prepare error response
  const errorResponse: ErrorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      requestId: req.headers['x-request-id'] as string,
    },
  };
  
  // Add stack trace in development environment
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.error.stack = err.stack;
  }
  
  // Log error
  if (statusCode >= 500) {
    logger.error(`API Error: ${err.message}`, {
      error: err,
      requestId: req.headers['x-request-id'],
      path: req.path,
      method: req.method,
      statusCode,
    });
  } else {
    logger.warn(`API Error: ${err.message}`, {
      requestId: req.headers['x-request-id'],
      path: req.path,
      method: req.method,
      statusCode,
    });
  }
  
  // Send response
  res.status(statusCode).json(errorResponse);
}