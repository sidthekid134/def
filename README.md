# Recipe Web Application

A modern web application for recipes with URL ingestion capabilities powered by LLM parsing.

## Features

- Secure URL fetching with proper error handling
- Robust content extraction for recipe websites
- Automatic extraction of title, ingredients, steps, and metadata
- LLM-based recipe parsing using OpenAI or Gemini
- API endpoints for recipe ingestion
- Rate limiting to prevent abuse
- Comprehensive error handling and logging

## Installation

```bash
npm install
```

## URL Ingestion API Endpoint

The API provides the following endpoint for ingesting recipes from URLs:

### POST /ingest/url

This endpoint accepts a URL as input, fetches content from the URL, and parses the recipe using LLM.

**Request:**

```json
{
  "url": "https://example.com/recipe"
}
```

**Response:**

```json
{
  "recipe": {
    "title": "Chocolate Cake",
    "ingredients": [
      "200g chocolate",
      "100g butter",
      "3 eggs",
      "150g sugar"
    ],
    "steps": [
      "Preheat the oven to 180°C.",
      "Melt the chocolate and butter together.",
      "Mix in eggs and sugar.",
      "Bake for 30 minutes."
    ],
    "metadata": {
      "prepTime": 15,
      "cookTime": 30,
      "totalTime": 45,
      "servings": 8,
      "category": "Dessert",
      "cuisine": "International",
      "sourceUrl": "https://example.com/recipe"
    }
  },
  "meta": {
    "sourceUrl": "https://example.com/recipe",
    "processingTimeMs": 1234
  }
}
```

## Getting Started

1. Set up environment variables:

```
OPENAI_API_KEY=your_api_key
# or
GEMINI_API_KEY=your_api_key
```

2. Install dependencies:

```
npm install
```

3. Start the API server:

```
npm run api:dev
```

The API will be available at http://localhost:3000.

## Available Scripts

- `npm run api:dev` - Start the API server in development mode
- `npm run api:build` - Build the API server for production
- `npm run api:start` - Start the API server in production mode
- `npm test` - Run tests

## Configuration

Configure the API using environment variables:

- `PORT` - Port number (default: 3000)
- `HOST` - Host (default: localhost)
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL` - OpenAI model (default: gpt-3.5-turbo)
- `GEMINI_API_KEY` - Google Gemini API key
- `GEMINI_MODEL` - Gemini model (default: gemini-pro)
- `LLM_TEMPERATURE` - Temperature for the LLM (default: 0.2)
- `LLM_MAX_RETRIES` - Maximum number of retries (default: 2)
- `LLM_RETRY_DELAY_MS` - Delay between retries in milliseconds (default: 1000)

## Core Components

### ContentFetcher

Provides functionality to fetch and extract recipe content from URLs:

```typescript
import { ContentFetcher } from './src/lib/content-fetcher';

// Create a new ContentFetcher instance
const fetcher = new ContentFetcher();

// Fetch content
const html = await fetcher.fetchContent('https://example.com/recipe');

// Extract recipe data
const recipeData = fetcher.extractRecipeContent(html, 'https://example.com/recipe');
```

### RecipeParser

Parses recipe content using LLM (OpenAI or Gemini):

```typescript
import { RecipeParser } from './src/lib/llm/recipe-parser';

// Create a new RecipeParser instance
const parser = new RecipeParser({
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  apiKey: process.env.OPENAI_API_KEY
});

// Parse recipe content
const recipe = await parser.parseRecipe(recipeData.content);
```

## Data Structure

```typescript
interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
  metadata: {
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    servings?: number;
    category?: string;
    cuisine?: string;
    nutritionalInfo?: {
      calories?: number;
      protein?: number;
      carbohydrates?: number;
      fat?: number;
      fiber?: number;
      sugar?: number;
      sodium?: number;
    };
    source?: string;
    sourceUrl?: string;
    difficulty?: string;
    tags?: string[];
  };
}
```