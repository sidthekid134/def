import { NextRequest, NextResponse } from 'next/server';
import { OpenAIProvider } from '@/lib/llm/OpenAIProvider';
import { LLMService } from '@/lib/llm/LLMService';
import { RecipeGenerator } from '@/lib/llm/RecipeGenerator';
import { Recipe } from '@/schemas/recipe';
import { z } from 'zod';

// Input validation schema
const UrlInputSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

// Initialize the LLM service with OpenAI provider
const openaiProvider = new OpenAIProvider();
const llmService = new LLMService(openaiProvider);
const recipeGenerator = new RecipeGenerator(llmService);

/**
 * Simple URL content fetcher
 * Note: In a real implementation, this would be more robust
 * @param url The URL to fetch
 * @returns The text content from the URL
 */
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    
    // Get content type
    const contentType = response.headers.get('content-type') || '';
    
    // Handle different content types
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return JSON.stringify(data);
    } else {
      // Default to text
      return await response.text();
    }
  } catch (error) {
    throw new Error(`Error fetching URL content: ${error.message}`);
  }
}

/**
 * POST handler for generating a recipe from URL
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate input
    const { url } = UrlInputSchema.parse(body);
    
    // Fetch content from URL
    const content = await fetchUrlContent(url);
    
    // Generate recipe from URL content
    const recipe: Recipe = await recipeGenerator.generateFromUrlContent(url, content);
    
    // Return the recipe
    return NextResponse.json({ success: true, recipe }, { status: 200 });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 });
    }
    
    // Handle other errors
    console.error('Recipe generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate recipe', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}