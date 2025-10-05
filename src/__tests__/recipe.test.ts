import { 
  RecipeSchema, 
  validateRecipe, 
  parseRecipeInput, 
  safeParseRecipeInput 
} from '../types/recipe';

describe('Recipe Schema Validation', () => {
  const validRecipe = {
    id: 'recipe-123',
    title: 'Spaghetti Carbonara',
    servings: '4',
    totalTimeMinutes: 30,
    activeTimeMinutes: 25,
    passiveTimeMinutes: 5,
    metadata: {
      cuisine: 'Italian',
      dishType: 'Main Course',
      difficultyLevel: 'Intermediate'
    },
    ingredients: [
      { name: 'Spaghetti', quantity: '400g', type: 'Pasta' },
      { name: 'Pancetta', quantity: '150g', type: 'Meat' },
      { name: 'Eggs', quantity: '3 large', type: 'Dairy' },
      { name: 'Parmesan Cheese', quantity: '50g', type: 'Dairy' },
      { name: 'Black Pepper', quantity: '2 tsp', type: 'Spice' },
      { name: 'Salt', quantity: 'To taste', type: 'Seasoning' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare Ingredients',
        equipmentNeeded: ['Cutting Board', 'Knife'],
        instructions: 'Dice the pancetta into small cubes. Grate the Parmesan cheese.',
        ingredientsUsed: [
          { name: 'Pancetta', quantity: '150g', type: 'Meat' },
          { name: 'Parmesan Cheese', quantity: '50g', type: 'Dairy' }
        ],
        estimatedTimeMinutes: 5,
        definitionOfDone: 'Pancetta is diced and cheese is grated'
      },
      {
        stepNumber: 2,
        title: 'Cook Pasta',
        equipmentNeeded: ['Large Pot', 'Colander'],
        instructions: 'Bring water to boil. Add salt and spaghetti. Cook until al dente, about 8-10 minutes.',
        ingredientsUsed: [
          { name: 'Spaghetti', quantity: '400g', type: 'Pasta' },
          { name: 'Salt', quantity: 'To taste', type: 'Seasoning' }
        ],
        estimatedTimeMinutes: 10,
        definitionOfDone: 'Pasta is cooked al dente'
      },
      {
        stepNumber: 3,
        title: 'Cook Pancetta',
        equipmentNeeded: ['Large Skillet'],
        instructions: 'In a large skillet, cook pancetta over medium heat until crispy.',
        ingredientsUsed: [
          { name: 'Pancetta', quantity: '150g', type: 'Meat' }
        ],
        estimatedTimeMinutes: 5,
        definitionOfDone: 'Pancetta is crispy'
      },
      {
        stepNumber: 4,
        title: 'Prepare Egg Mixture',
        equipmentNeeded: ['Bowl', 'Whisk'],
        instructions: 'In a bowl, whisk together eggs, grated Parmesan, and black pepper.',
        ingredientsUsed: [
          { name: 'Eggs', quantity: '3 large', type: 'Dairy' },
          { name: 'Parmesan Cheese', quantity: '50g', type: 'Dairy' },
          { name: 'Black Pepper', quantity: '2 tsp', type: 'Spice' }
        ],
        estimatedTimeMinutes: 3,
        definitionOfDone: 'Egg mixture is smooth and well-combined'
      },
      {
        stepNumber: 5,
        title: 'Combine and Serve',
        equipmentNeeded: ['Tongs'],
        instructions: 'Drain pasta, reserving 1/2 cup of pasta water. Add pasta to skillet with pancetta. Remove from heat. Quickly add egg mixture, tossing continuously. Add pasta water as needed for creaminess.',
        ingredientsUsed: [
          { name: 'Spaghetti', quantity: '400g', type: 'Pasta' },
          { name: 'Pancetta', quantity: '150g', type: 'Meat' },
          { name: 'Eggs', quantity: '3 large', type: 'Dairy' },
          { name: 'Parmesan Cheese', quantity: '50g', type: 'Dairy' }
        ],
        estimatedTimeMinutes: 7,
        definitionOfDone: 'Pasta is coated evenly with creamy sauce'
      }
    ],
    allEquipmentNeeded: ['Cutting Board', 'Knife', 'Large Pot', 'Large Skillet', 'Colander', 'Bowl', 'Whisk', 'Tongs']
  };

  const invalidRecipe = {
    // Missing id and other required fields
    title: 'Spaghetti Carbonara',
    servings: '4',
    ingredients: [
      { name: 'Spaghetti', quantity: '400g', type: 'Pasta' }
    ],
    // Missing steps, metadata, etc.
  };

  test('Valid recipe passes validation', () => {
    expect(validateRecipe(validRecipe)).toBe(true);
    
    // Should not throw an error
    expect(() => parseRecipeInput(validRecipe)).not.toThrow();
    
    // Safe parse should return success
    const result = safeParseRecipeInput(validRecipe);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test('Invalid recipe fails validation', () => {
    expect(validateRecipe(invalidRecipe)).toBe(false);
    
    // Should throw an error
    expect(() => parseRecipeInput(invalidRecipe)).toThrow();
    
    // Safe parse should return an error
    const result = safeParseRecipeInput(invalidRecipe);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('Required fields are properly enforced', () => {
    // Test missing ID
    const missingId = { ...validRecipe, id: undefined };
    expect(validateRecipe(missingId)).toBe(false);
    
    // Test missing title
    const missingTitle = { ...validRecipe, title: undefined };
    expect(validateRecipe(missingTitle)).toBe(false);
    
    // Test missing servings
    const missingServings = { ...validRecipe, servings: undefined };
    expect(validateRecipe(missingServings)).toBe(false);
    
    // Test missing totalTimeMinutes
    const missingTotalTime = { ...validRecipe, totalTimeMinutes: undefined };
    expect(validateRecipe(missingTotalTime)).toBe(false);
  });

  test('Optional fields can be null', () => {
    const recipeWithNullOptionals = {
      ...validRecipe,
      activeTimeMinutes: null,
      passiveTimeMinutes: null
    };
    
    expect(validateRecipe(recipeWithNullOptionals)).toBe(true);
  });

  test('Nested validation works correctly', () => {
    // Test invalid metadata
    const invalidMetadata = {
      ...validRecipe,
      metadata: {
        // Missing difficultyLevel
        cuisine: 'Italian',
        dishType: 'Main Course'
      }
    };
    expect(validateRecipe(invalidMetadata)).toBe(false);
    
    // Test invalid ingredient
    const invalidIngredient = {
      ...validRecipe,
      ingredients: [
        { name: 'Spaghetti', quantity: '400g' } // Missing 'type' field
      ]
    };
    expect(validateRecipe(invalidIngredient)).toBe(false);
    
    // Test invalid step
    const invalidStep = {
      ...validRecipe,
      steps: [
        {
          ...validRecipe.steps[0],
          stepNumber: 'one' // Should be a number, not a string
        }
      ]
    };
    expect(validateRecipe(invalidStep)).toBe(false);
  });

  test('Serialization and deserialization works correctly', () => {
    const { serializeRecipe, deserializeRecipe } = require('../types/recipe');
    
    const serialized = serializeRecipe(validRecipe);
    expect(typeof serialized).toBe('string');
    
    const deserialized = deserializeRecipe(serialized);
    expect(deserialized).toEqual(validRecipe);
  });
});