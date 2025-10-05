# Content Fetcher for Recipe Web Application

This module provides functionality to fetch recipe content from URLs and extract structured recipe data.

## Features

- Secure URL fetching with proper error handling
- Robust content extraction for recipe websites
- Automatic extraction of title, ingredients, steps, and metadata
- Built-in caching mechanism for improved performance
- Comprehensive error handling

## Installation

```bash
npm install
```

## Usage

```typescript
import { ContentFetcher } from './src/lib/content-fetcher';

// Create a new ContentFetcher instance
const fetcher = new ContentFetcher();

// Fetch and extract a recipe
const recipeData = await fetcher.fetchAndExtractRecipe('https://example.com/recipe');

// Access recipe data
console.log(recipeData.title);
console.log(recipeData.ingredients);
console.log(recipeData.steps);
console.log(recipeData.metadata);
```

## API Reference

### ContentFetcher

#### Constructor

```typescript
constructor(cacheTTL: number = 3600000)
```

- `cacheTTL` - Time to live for cache items in milliseconds (default: 1 hour)

#### Methods

- `async fetchUrl(url: string): Promise<string>`
  - Fetches HTML content from a URL
  - Returns the HTML content as a string
  - Throws an error for invalid URLs or failed requests

- `extractRecipeContent(html: string, url: string): RecipeData`
  - Extracts structured recipe data from HTML content
  - Returns a RecipeData object

- `async fetchAndExtractRecipe(url: string): Promise<RecipeData>`
  - Fetches a URL and extracts recipe content in one operation
  - Returns a Promise resolving to RecipeData
  - Uses cache when available

- `clearCache(): void`
  - Clears the entire cache

- `removeFromCache(url: string): void`
  - Removes a specific URL from the cache

- `getCacheStats(): { size: number; averageAge: number }`
  - Returns statistics about the cache

## Data Structure

```typescript
interface RecipeData {
  title: string;
  ingredients: string[];
  steps: string[];
  metadata: {
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    servings?: string;
    cuisine?: string;
    author?: string;
    description?: string;
  };
}
```

## Running Tests

```bash
npm test
```