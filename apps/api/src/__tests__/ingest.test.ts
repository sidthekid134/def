import request from 'supertest';
import { createApp } from '../app';
import { ContentFetcher } from '../../../../src/lib/content-fetcher';
import { RecipeParser } from '../../../../src/lib/llm/recipe-parser';

// Mock the content fetcher and recipe parser
jest.mock('../../../../src/lib/content-fetcher');
jest.mock('../../../../src/lib/llm/recipe-parser');

describe('/ingest/url endpoint', () => {
  const app = createApp();
  
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  it('should return 400 for invalid URL', async () => {
    const response = await request(app)
      .post('/ingest/url')
      .send({ url: 'not-a-valid-url' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toContain('Validation failed');
  });
  
  it('should return 200 and recipe for valid URL', async () => {
    // Mock implementation
    const mockHtml = '<html><body><h1>Chocolate Cake</h1></body></html>';
    const mockRecipe = {
      title: 'Chocolate Cake',
      ingredients: ['200g chocolate', '100g butter', '3 eggs'],
      steps: ['Mix ingredients', 'Bake for 30 minutes'],
      metadata: {
        prepTime: 15,
        cookTime: 30,
        sourceUrl: 'https://example.com/recipe'
      }
    };
    
    // Setup mocks
    (ContentFetcher.prototype.fetchContent as jest.Mock).mockResolvedValue(mockHtml);
    (ContentFetcher.prototype.extractRecipeContent as jest.Mock).mockReturnValue({
      title: 'Chocolate Cake',
      ingredients: [],
      steps: [],
      content: mockHtml,
      sourceUrl: 'https://example.com/recipe'
    });
    (RecipeParser.prototype.parseRecipe as jest.Mock).mockResolvedValue(mockRecipe);
    (RecipeParser.prototype.getConfig as jest.Mock).mockReturnValue({
      provider: 'openai',
      model: 'gpt-3.5-turbo'
    });
    
    // Make request
    const response = await request(app)
      .post('/ingest/url')
      .send({ url: 'https://example.com/recipe' });
    
    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.recipe).toEqual(mockRecipe);
    expect(response.body.meta.sourceUrl).toBe('https://example.com/recipe');
    expect(response.body.meta.processingTimeMs).toBeDefined();
  });
  
  it('should return 422 when content fetching fails', async () => {
    // Setup mocks
    (ContentFetcher.prototype.fetchContent as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch URL: 404 Not Found')
    );
    
    // Make request
    const response = await request(app)
      .post('/ingest/url')
      .send({ url: 'https://example.com/nonexistent' });
    
    // Assertions
    expect(response.status).toBe(422);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toContain('Failed to fetch URL');
  });
});