import { createApp } from './app';
import { logger } from './utils/logger';

// Load environment variables if needed
try {
  // Check for required env variables
  if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
    logger.warn('No LLM API key found. Set either OPENAI_API_KEY or GEMINI_API_KEY in environment variables.');
  }
} catch (error) {
  logger.error('Error loading environment variables', { error });
}

// Create and start the server
const app = createApp();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Start the server
app.listen(port, () => {
  logger.info(`API Server started at http://${host}:${port}`);
  logger.info(`Health check endpoint: http://${host}:${port}/health`);
  logger.info(`Recipe URL ingestion endpoint: http://${host}:${port}/ingest/url`);
});