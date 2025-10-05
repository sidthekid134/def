import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeDashboard from '../RecipeDashboard';
import { Recipe } from '../../models/Recipe';

// Mock fetch
global.fetch = jest.fn();

// Mock recipes data
const mockRecipes: Recipe[] = [
  {
    title: 'Spaghetti Carbonara',
    ingredients: [
      '400g spaghetti',
      '200g pancetta',
      '4 large eggs',
      '50g pecorino cheese',
      '50g parmesan',
      'Freshly ground black pepper',
      'Sea salt'
    ],
    steps: [
      'Cook the spaghetti in a large pot of salted boiling water.',
      'In a large pan, fry the pancetta until crispy.',
      'Beat the eggs and mix with the grated cheeses.',
      'Drain the pasta and add to the pan with the pancetta.',
      'Remove the pan from the heat and quickly stir in the egg and cheese mixture.',
      'Season with black pepper and serve immediately.'
    ],
    metadata: {
      prepTime: 10,
      cookTime: 15,
      totalTime: 25,
      servings: 4,
      cuisine: 'Italian',
      category: 'Pasta',
      difficulty: 'Medium'
    }
  },
  {
    title: 'Chicken Curry',
    ingredients: [
      '500g chicken breast',
      '1 onion',
      '2 cloves garlic',
      '1 tbsp curry powder',
      '400ml coconut milk',
      'Fresh coriander',
      'Salt and pepper'
    ],
    steps: [
      'Dice the chicken breast into cubes.',
      'Finely chop the onion and garlic.',
      'Sauté the onion and garlic until soft.',
      'Add the chicken and cook until browned.',
      'Add the curry powder and stir well.',
      'Pour in the coconut milk and simmer for 15 minutes.',
      'Season with salt and pepper and garnish with fresh coriander.'
    ],
    metadata: {
      prepTime: 15,
      cookTime: 25,
      totalTime: 40,
      servings: 4,
      cuisine: 'Indian',
      category: 'Main Course',
      difficulty: 'Easy'
    }
  },
  {
    title: 'Chocolate Brownies',
    ingredients: [
      '200g dark chocolate',
      '175g butter',
      '325g caster sugar',
      '130g plain flour',
      '3 eggs',
      '1 tsp vanilla extract'
    ],
    steps: [
      'Preheat the oven to 180°C/160°C fan.',
      'Melt the chocolate and butter together.',
      'Whisk the eggs and sugar until pale and fluffy.',
      'Fold in the chocolate mixture.',
      'Sift in the flour and fold gently.',
      'Pour into a lined baking tin and bake for 25-30 minutes.',
      'Allow to cool before cutting into squares.'
    ],
    metadata: {
      prepTime: 20,
      cookTime: 30,
      totalTime: 50,
      servings: 16,
      cuisine: 'American',
      category: 'Dessert',
      difficulty: 'Easy'
    }
  }
];

describe('RecipeDashboard', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock successful fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockRecipes,
    });
  });

  it('renders loading state initially', async () => {
    render(<RecipeDashboard />);
    
    // Check for loading indicator
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  it('renders recipes after loading', async () => {
    render(<RecipeDashboard />);
    
    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Chicken Curry')).toBeInTheDocument();
      expect(screen.getByText('Chocolate Brownies')).toBeInTheDocument();
    });
  });

  it('filters recipes by search query', async () => {
    render(<RecipeDashboard />);
    
    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText('Search recipes by title, ingredients or tags...');
    fireEvent.change(searchInput, { target: { value: 'chocolate' } });
    
    // Check that only the chocolate brownies recipe is displayed
    await waitFor(() => {
      expect(screen.queryByText('Spaghetti Carbonara')).not.toBeInTheDocument();
      expect(screen.queryByText('Chicken Curry')).not.toBeInTheDocument();
      expect(screen.getByText('Chocolate Brownies')).toBeInTheDocument();
    });
  });

  it('filters recipes by cuisine', async () => {
    render(<RecipeDashboard />);
    
    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });
    
    // Select Italian cuisine
    const cuisineFilter = screen.getByLabelText('Cuisine');
    fireEvent.change(cuisineFilter, { target: { value: 'Italian' } });
    
    // Check that only the Italian recipe is displayed
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.queryByText('Chicken Curry')).not.toBeInTheDocument();
      expect(screen.queryByText('Chocolate Brownies')).not.toBeInTheDocument();
    });
  });

  it('sorts recipes by title', async () => {
    render(<RecipeDashboard />);
    
    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });
    
    // Select sort by title Z-A
    const sortOption = screen.getByLabelText('Sort By');
    fireEvent.change(sortOption, { target: { value: 'title-desc' } });
    
    // Check that recipes are sorted by title in descending order
    const recipeElements = screen.getAllByRole('heading', { level: 3 });
    expect(recipeElements[0]).toHaveTextContent('Spaghetti Carbonara');
    expect(recipeElements[1]).toHaveTextContent('Chocolate Brownies');
    expect(recipeElements[2]).toHaveTextContent('Chicken Curry');
  });

  it('switches between grid and list view', async () => {
    render(<RecipeDashboard />);
    
    // Wait for recipes to load in grid view by default
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });
    
    // Find the list view button and click it
    const listViewButton = screen.getByRole('button', { name: /list/i });
    fireEvent.click(listViewButton);
    
    // Verify list view is active
    expect(listViewButton).toHaveClass('bg-blue-50');
    
    // Find the grid view button and click it
    const gridViewButton = screen.getByRole('button', { name: /grid/i });
    fireEvent.click(gridViewButton);
    
    // Verify grid view is active
    expect(gridViewButton).toHaveClass('bg-blue-50');
  });

  it('displays an empty state when no recipes match filters', async () => {
    render(<RecipeDashboard />);
    
    // Wait for recipes to load
    await waitFor(() => {
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    });
    
    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search recipes by title, ingredients or tags...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent recipe' } });
    
    // Check that empty state is displayed
    await waitFor(() => {
      expect(screen.getByText('No recipes found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Mock fetch error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(<RecipeDashboard />);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Error fetching recipes. Please try again later.')).toBeInTheDocument();
    });
  });
});