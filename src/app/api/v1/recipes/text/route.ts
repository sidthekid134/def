import { NextRequest, NextResponse } from 'next/server';
import { OpenAIProvider } from '@/lib/llm/OpenAIProvider';
import { LLMService } from '@/lib/llm/LLMService';
import { RecipeGenerator } from '@/lib/llm/RecipeGenerator';
import { Recipe } from '@/schemas/recipe';
import { z } from 'zod';

// Input validation schema
const TextInputSchema = z.object({
  text: z.string().min(10, "Description must be at least 10 characters"),
});

// Initialize the LLM service with OpenAI provider
const openaiProvider = new OpenAIProvider();
const llmService = new LLMService(openaiProvider);
const recipeGenerator = new RecipeGenerator(llmService);

/**
 * POST handler for generating a recipe from text description
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate input
    const { text } = TextInputSchema.parse(body);
    
    // Generate recipe from text
    const recipe: Recipe = await recipeGenerator.generateFromText(text);
    
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