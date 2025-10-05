import { z } from 'zod';

// TypeScript interface for Recipe
export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
}

export interface Step {
  order: number;
  description: string;
}

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  ingredients: Ingredient[];
  steps: Step[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Zod schemas for validation
export const IngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().optional(),
});

export const StepSchema = z.object({
  order: z.number().int().min(1, "Step order must be a positive integer"),
  description: z.string().min(1, "Step description is required"),
});

export const RecipeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().min(1, "Description is required"),
  prepTime: z.number().int().min(0, "Prep time cannot be negative"),
  cookTime: z.number().int().min(0, "Cook time cannot be negative"),
  servings: z.number().int().min(1, "Servings must be at least 1"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  cuisine: z.string().min(1, "Cuisine is required"),
  ingredients: z.array(IngredientSchema).nonempty("At least one ingredient is required"),
  steps: z.array(StepSchema).nonempty("At least one step is required"),
  tags: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Type inferences from Zod schemas
export type ValidatedIngredient = z.infer<typeof IngredientSchema>;
export type ValidatedStep = z.infer<typeof StepSchema>;
export type ValidatedRecipe = z.infer<typeof RecipeSchema>;