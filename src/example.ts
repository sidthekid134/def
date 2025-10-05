import { ContentFetcher } from './lib/content-fetcher';

/**
 * Example usage of the ContentFetcher class
 */
async function main() {
  // Create a new ContentFetcher instance
  // The default cache TTL is 1 hour (3600000ms)
  const fetcher = new ContentFetcher();
  
  try {
    // Example URL to a recipe page
    const url = 'https://example-recipe-site.com/chocolate-cake';
    
    console.log(`Fetching recipe from: ${url}`);
    
    // Fetch and extract recipe in one step
    const recipeData = await fetcher.fetchAndExtractRecipe(url);
    
    // Output the extracted recipe data
    console.log('\nExtracted Recipe:');
    console.log('-----------------');
    console.log(`Title: ${recipeData.title}`);
    
    console.log('\nIngredients:');
    recipeData.ingredients.forEach((ingredient, index) => {
      console.log(`${index + 1}. ${ingredient}`);
    });
    
    console.log('\nInstructions:');
    recipeData.steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step}`);
    });
    
    console.log('\nMetadata:');
    Object.entries(recipeData.metadata).forEach(([key, value]) => {
      if (value) {
        console.log(`${key}: ${value}`);
      }
    });
    
    // Cache statistics
    const cacheStats = fetcher.getCacheStats();
    console.log('\nCache Statistics:');
    console.log(`Cache Size: ${cacheStats.size}`);
    console.log(`Average Age: ${Math.round(cacheStats.averageAge / 1000)} seconds`);
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

// Run the example
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});