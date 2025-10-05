import { NextRequest, NextResponse } from 'next/server';
import { OpenAIProvider } from '@/lib/llm/OpenAIProvider';
import { LLMService } from '@/lib/llm/LLMService';
import { RecipeGenerator } from '@/lib/llm/RecipeGenerator';
import { z } from 'zod';

// Input validation schema
const GenerateInputSchema = z.object({
  ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
});

// Initialize the LLM service with OpenAI provider
const openaiProvider = new OpenAIProvider();
const llmService = new LLMService(openaiProvider);
const recipeGenerator = new RecipeGenerator(llmService);

/**
 * POST handler for generating a recipe name from ingredients
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate input
    const { ingredients } = GenerateInputSchema.parse(body);
    
    // Generate recipe name
    const recipeName = await recipeGenerator.generateName(ingredients);
    
    // Return the recipe name
    return NextResponse.json({ 
      success: true, 
      name: recipeName 
    }, { status: 200 });
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
    console.error('Recipe name generation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate recipe name', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}