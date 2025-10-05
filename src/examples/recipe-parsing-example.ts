import { ContentFetcher } from '../lib/content-fetcher';
import { RecipeParser } from '../lib/llm/recipe-parser';
import { llmMonitor } from '../lib/llm/monitoring';

/**
 * Example demonstrating the complete recipe processing pipeline:
 * 1. Fetch recipe content from a URL
 * 2. Extract initial recipe data
 * 3. Parse and normalize with LLM
 * 4. Output results and monitoring information
 */
async function main() {
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is required');
    console.error('Set it before running: export OPENAI_API_KEY="your-api-key"');
    process.exit(1);
  }

  // Create content fetcher
  const fetcher = new ContentFetcher();
  
  // Create recipe parser with OpenAI
  const parser = new RecipeParser({
    provider: 'openai',
    model: 'gpt-3.5-turbo', // Use 'gpt-4' for better results but higher cost
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0.2,
    maxRetries: 2,
    retryDelayMs: 1000
  });
  
  // Example recipe URL
  const url = process.argv[2] || 'https://example-recipe-site.com/chocolate-cake';
  
  try {
    console.log(`\n🍽️  Recipe Parsing Demo`);
    console.log(`==============================`);
    console.log(`Fetching and parsing recipe from: ${url}\n`);
    
    // Step 1: Fetch content
    console.log('1️⃣ Fetching recipe page content...');
    const html = await fetcher.fetchContent(url);
    console.log(`✅ Successfully fetched ${html.length} bytes of HTML\n`);
    
    // Step 2: Extract basic recipe data
    console.log('2️⃣ Extracting recipe content...');
    const extractedData = fetcher.extractRecipeContent(html);
    console.log(`✅ Initial extraction complete`);
    console.log(`   Title: ${extractedData.title || 'Not found'}`);
    console.log(`   Found ${extractedData.ingredients.length} ingredients and ${extractedData.steps.length} steps\n`);
    
    // Step 3: Use LLM to parse and normalize
    console.log('3️⃣ Processing with LLM for enhanced parsing...');
    console.log(`   Model: ${parser.getConfig().provider}/${parser.getConfig().model}`);
    
    const startTime = Date.now();
    const recipe = await parser.parseRecipe(extractedData.content);
    const parsingTime = Date.now() - startTime;
    
    console.log(`✅ LLM parsing complete (${parsingTime}ms)\n`);
    
    // Step 4: Output results
    console.log(`📊 Final Recipe Results:`);
    console.log(`==============================`);
    console.log(`Title: ${recipe.title}`);
    
    console.log(`\nIngredients (${recipe.ingredients.length}):`);
    recipe.ingredients.forEach((ingredient, index) => {
      console.log(`  ${index + 1}. ${ingredient}`);
    });
    
    console.log(`\nInstructions (${recipe.steps.length}):`);
    recipe.steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
    
    console.log(`\nMetadata:`);
    Object.entries(recipe.metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'nutritionalInfo' && recipe.metadata.nutritionalInfo) {
          console.log(`  ${key}:`);
          Object.entries(recipe.metadata.nutritionalInfo).forEach(([nutritionKey, nutritionValue]) => {
            if (nutritionValue !== undefined && nutritionValue !== null) {
              console.log(`    ${nutritionKey}: ${nutritionValue}`);
            }
          });
        } else if (Array.isArray(value)) {
          console.log(`  ${key}: ${value.join(', ')}`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
    });
    
    // Step 5: Output monitoring information
    const usageStats = llmMonitor.getUsageStats();
    console.log(`\n📈 LLM Usage Statistics:`);
    console.log(`==============================`);
    console.log(`Total API calls: ${usageStats.totalCalls}`);
    console.log(`Total tokens: ${usageStats.totalTokens.toLocaleString()}`);
    console.log(`Estimated cost: $${usageStats.totalCost.toFixed(6)}`);
    console.log(`Average latency: ${Math.round(usageStats.avgLatencyMs)}ms`);
    console.log(`Calls by model: ${Object.entries(usageStats.callsByModel)
      .map(([model, count]) => `${model} (${count})`)
      .join(', ')}`);
    
  } catch (error) {
    console.error('\n❌ Error occurred:');
    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);
      if (error.stack) {
        console.error(error.stack.split('\n').slice(1).join('\n'));
      }
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
}

// Run the example
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});