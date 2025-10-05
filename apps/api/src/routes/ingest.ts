import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Recipe } from '../../../../src/models/Recipe';
import { ContentFetcher } from '../../../../src/lib/content-fetcher';
import { RecipeParser } from '../../../../src/lib/llm/recipe-parser';
import { logger } from '../utils/logger';
import { validateRequest } from '../middleware/validate-request';
import { ApiError } from '../middleware/error-handler';
import { urlIngestRateLimiter } from '../middleware/rate-limiter';

// Create router
const router = Router();

// Initialize services
const contentFetcher = new ContentFetcher();

/**
 * Get recipe parser instance based on environment configuration
 */
function getRecipeParser(): RecipeParser {
  // Check environment variables for API keys
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!openaiApiKey && !geminiApiKey) {
    throw new Error('No LLM API key found. Set either OPENAI_API_KEY or GEMINI_API_KEY in environment variables.');
  }

  // Configure based on available API keys
  if (openaiApiKey) {
    return new RecipeParser({
      provider: 'openai',
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      apiKey: openaiApiKey,
      temperature: Number(process.env.LLM_TEMPERATURE) || 0.2,
      maxRetries: Number(process.env.LLM_MAX_RETRIES) || 2,
      retryDelayMs: Number(process.env.LLM_RETRY_DELAY_MS) || 1000
    });
  } else {
    return new RecipeParser({
      provider: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      apiKey: geminiApiKey!,
      temperature: Number(process.env.LLM_TEMPERATURE) || 0.2,
      maxRetries: Number(process.env.LLM_MAX_RETRIES) || 2,
      retryDelayMs: Number(process.env.LLM_RETRY_DELAY_MS) || 1000
    });
  }
}

/**
 * URL validation function
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Route: POST /ingest/url
 * 
 * Handles ingestion of recipe from a URL.
 * 
 * Request body:
 * {
 *   "url": "https://example.com/recipe"
 * }
 * 
 * Response:
 * {
 *   "recipe": Recipe  // Recipe object as per the Recipe schema
 *   "meta": {
 *     "sourceUrl": "https://example.com/recipe",
 *     "processingTimeMs": 1234
 *   }
 * }
 */
router.post(
  '/url',
  urlIngestRateLimiter,
  validateRequest([
    body('url')
      .isString()
      .withMessage('URL must be a string')
      .notEmpty()
      .withMessage('URL is required')
      .custom(isValidUrl)
      .withMessage('Invalid URL format')
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] as string;
    const url = req.body.url;
    
    logger.info(`Processing recipe URL: ${url}`, { requestId });
    const startTime = Date.now();
    
    try {
      // Lazily initialize parser to avoid errors if no API key is set
      const parser = getRecipeParser();
      
      // Step 1: Fetch content from URL
      logger.debug(`Fetching content from URL: ${url}`, { requestId });
      const html = await contentFetcher.fetchContent(url);
      
      // Step 2: Extract recipe content
      logger.debug(`Extracting content from HTML (${html.length} bytes)`, { requestId });
      const extractedData = contentFetcher.extractRecipeContent(html, url);
      
      // Step 3: Parse recipe using LLM
      logger.debug(`Parsing recipe with LLM (${parser.getConfig().provider}/${parser.getConfig().model})`, { requestId });
      const recipe: Recipe = await parser.parseRecipe(extractedData.content);
      
      // Make sure the source URL is included in the metadata
      if (!recipe.metadata.sourceUrl) {
        recipe.metadata.sourceUrl = url;
      }
      
      // Calculate processing time
      const processingTimeMs = Date.now() - startTime;
      
      // Log success
      logger.info(`Successfully processed recipe from ${url} in ${processingTimeMs}ms`, {
        requestId,
        processingTimeMs,
        recipeTitle: recipe.title,
        ingredientCount: recipe.ingredients.length,
        stepCount: recipe.steps.length
      });
      
      // Return the recipe with metadata
      res.status(200).json({
        recipe,
        meta: {
          sourceUrl: url,
          processingTimeMs
        }
      });
    } catch (error) {
      // Log error
      if (error instanceof Error) {
        logger.error(`Error processing URL: ${error.message}`, {
          requestId,
          url,
          error: error.stack || error.message
        });
        
        // Determine appropriate error status code
        let statusCode = 500;
        if (error.message.includes('Invalid URL') || error.message.includes('URL format')) {
          statusCode = 400;
        } else if (error.message.includes('Failed to fetch URL')) {
          statusCode = 422;
        } else if (error.message.includes('API key')) {
          statusCode = 500;
        }
        
        return next(new ApiError(error.message, statusCode));
      }
      
      // Generic error handling
      logger.error(`Unknown error processing URL`, {
        requestId,
        url,
        error: String(error)
      });
      
      return next(new ApiError('Failed to process recipe URL', 500));
    }
  }
);

export default router;