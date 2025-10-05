/**
 * Represents a recipe with all its components
 */
export interface Recipe {
  /**
   * The title of the recipe
   */
  title: string;
  
  /**
   * List of ingredients with quantities and units
   */
  ingredients: string[];
  
  /**
   * Ordered list of preparation steps
   */
  steps: string[];
  
  /**
   * Additional recipe metadata
   */
  metadata: RecipeMetadata;
}

/**
 * Additional recipe information
 */
export interface RecipeMetadata {
  /**
   * Preparation time in minutes
   */
  prepTime?: number;
  
  /**
   * Cooking time in minutes
   */
  cookTime?: number;
  
  /**
   * Total time in minutes
   */
  totalTime?: number;
  
  /**
   * Number of servings
   */
  servings?: number;
  
  /**
   * Recipe category (e.g., "Dessert", "Main Course")
   */
  category?: string;
  
  /**
   * Recipe cuisine (e.g., "Italian", "Mexican")
   */
  cuisine?: string;
  
  /**
   * Nutritional information if available
   */
  nutritionalInfo?: NutritionalInfo;
  
  /**
   * Source of the recipe
   */
  source?: string;
  
  /**
   * URL where the recipe was found
   */
  sourceUrl?: string;
  
  /**
   * Difficulty level (e.g., "Easy", "Medium", "Hard")
   */
  difficulty?: string;
  
  /**
   * Any additional tags or keywords
   */
  tags?: string[];
}

/**
 * Nutritional information for a recipe
 */
export interface NutritionalInfo {
  /**
   * Calories per serving
   */
  calories?: number;
  
  /**
   * Protein in grams per serving
   */
  protein?: number;
  
  /**
   * Carbohydrates in grams per serving
   */
  carbohydrates?: number;
  
  /**
   * Fat in grams per serving
   */
  fat?: number;
  
  /**
   * Fiber in grams per serving
   */
  fiber?: number;
  
  /**
   * Sugar in grams per serving
   */
  sugar?: number;
  
  /**
   * Sodium in milligrams per serving
   */
  sodium?: number;
}