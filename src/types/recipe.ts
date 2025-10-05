import { z } from 'zod';

// TypeScript interfaces for Recipe Schema
export interface Ingredient {
  name: string;
  quantity: string;
  type: string;
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  equipmentNeeded: string[];
  instructions: string;
  ingredientsUsed: Ingredient[];
  estimatedTimeMinutes: number;
  definitionOfDone: string;
}

export interface RecipeMetadata {
  cuisine: string;
  dishType: string;
  difficultyLevel: string;
}

export interface Recipe {
  id: string;
  title: string;
  servings: string;
  totalTimeMinutes: number;
  activeTimeMinutes: number | null;
  passiveTimeMinutes: number | null;
  metadata: RecipeMetadata;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  allEquipmentNeeded: string[];
}

// Zod schema definitions
export const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.string(),
  type: z.string(),
});

export const RecipeStepSchema = z.object({
  stepNumber: z.number().int(),
  title: z.string(),
  equipmentNeeded: z.array(z.string()),
  instructions: z.string(),
  ingredientsUsed: z.array(IngredientSchema),
  estimatedTimeMinutes: z.number().int(),
  definitionOfDone: z.string(),
});

export const RecipeMetadataSchema = z.object({
  cuisine: z.string(),
  dishType: z.string(),
  difficultyLevel: z.string(),
});

export const RecipeSchema = z.object({
  id: z.string().describe('Unique identifier for the recipe'),
  title: z.string().describe('Title of the recipe'),
  servings: z.string().describe('Number of servings'),
  totalTimeMinutes: z.number().int().describe('Total time required in minutes'),
  activeTimeMinutes: z.number().int().nullable().describe('Active cooking time in minutes (optional)'),
  passiveTimeMinutes: z.number().int().nullable().describe('Passive cooking time in minutes (optional)'),
  metadata: RecipeMetadataSchema,
  ingredients: z.array(IngredientSchema),
  steps: z.array(RecipeStepSchema),
  allEquipmentNeeded: z.array(z.string()),
});

// Type definitions from Zod schema
export type RecipeType = z.infer<typeof RecipeSchema>;
export type IngredientType = z.infer<typeof IngredientSchema>;
export type RecipeStepType = z.infer<typeof RecipeStepSchema>;
export type RecipeMetadataType = z.infer<typeof RecipeMetadataSchema>;

// Validation functions
export const parseRecipeInput = (data: unknown): RecipeType => {
  return RecipeSchema.parse(data);
};

export const validateRecipe = (data: unknown): boolean => {
  try {
    RecipeSchema.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const safeParseRecipeInput = (data: unknown): { success: boolean; data?: RecipeType; error?: z.ZodError } => {
  const result = RecipeSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
};

export const serializeRecipe = (recipe: RecipeType): string => {
  return JSON.stringify(recipe);
};

export const deserializeRecipe = (json: string): RecipeType => {
  const data = JSON.parse(json);
  return parseRecipeInput(data);
};