import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Recipe } from '../models/Recipe';

// Type for recipe filter criteria
interface FilterCriteria {
  cuisine?: string;
  difficulty?: string;
  category?: string; // dish type
}

// Type for sort options
type SortField = 'title' | 'prepTime' | 'cookTime' | 'totalTime' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  direction: SortDirection;
}

// Type for recipe card props
interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

// Type for pagination
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// RecipeCard Component
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={() => onClick(recipe)}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
        <div className="mt-2 text-sm text-gray-600">
          {recipe.metadata.cuisine && (
            <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2 mb-2">
              {recipe.metadata.cuisine}
            </span>
          )}
          {recipe.metadata.difficulty && (
            <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs mr-2 mb-2">
              {recipe.metadata.difficulty}
            </span>
          )}
          {recipe.metadata.category && (
            <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs mr-2 mb-2">
              {recipe.metadata.category}
            </span>
          )}
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          {recipe.metadata.totalTime && (
            <span className="mr-3">
              <span className="font-medium">{recipe.metadata.totalTime}</span> min
            </span>
          )}
          {recipe.metadata.servings && (
            <span>
              <span className="font-medium">{recipe.metadata.servings}</span> servings
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {recipe.ingredients.slice(0, 3).join(', ')}
          {recipe.ingredients.length > 3 ? '...' : ''}
        </p>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex items-center">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`px-3 py-1 border border-gray-300 text-sm font-medium ${
              currentPage === i + 1
                ? 'bg-blue-50 text-blue-600'
                : 'bg-white text-gray-500 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

// EmptyState Component
const EmptyState: React.FC<{ message?: string }> = ({ message = "No recipes found" }) => {
  return (
    <div className="text-center py-12">
      <svg 
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        {message}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter criteria.
      </p>
    </div>
  );
};

// Main RecipeDashboard Component
const RecipeDashboard: React.FC = () => {
  // State for recipes data
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for search, filter and sort
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'title', direction: 'asc' });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  
  // State for view type (grid or list)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  // Fuse.js search instance
  const fuse = useMemo(() => {
    return new Fuse(recipes, {
      keys: ['title', 'ingredients', 'metadata.tags'],
      threshold: 0.4,
      includeScore: true
    });
  }, [recipes]);

  // Fetch recipes data
  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError('Error fetching recipes. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipes();
  }, []);

  // Extract unique filter options from recipes
  const filterOptions = useMemo(() => {
    return {
      cuisines: [...new Set(recipes.map(recipe => recipe.metadata.cuisine).filter(Boolean))],
      difficulties: [...new Set(recipes.map(recipe => recipe.metadata.difficulty).filter(Boolean))],
      categories: [...new Set(recipes.map(recipe => recipe.metadata.category).filter(Boolean))]
    };
  }, [recipes]);

  // Filter, sort, and paginate recipes
  const displayedRecipes = useMemo(() => {
    // First search using Fuse.js
    let filteredRecipes = searchQuery.trim() 
      ? fuse.search(searchQuery).map(result => result.item) 
      : [...recipes];
    
    // Then apply filters
    if (filters.cuisine) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.metadata.cuisine === filters.cuisine);
    }
    if (filters.difficulty) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.metadata.difficulty === filters.difficulty);
    }
    if (filters.category) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.metadata.category === filters.category);
    }
    
    // Apply sorting
    filteredRecipes.sort((a, b) => {
      let aValue, bValue;
      
      // Handle special fields
      if (sortOption.field.includes('Time')) {
        const field = sortOption.field as keyof typeof a.metadata;
        aValue = a.metadata[field] || 0;
        bValue = b.metadata[field] || 0;
      } else if (sortOption.field === 'title') {
        aValue = a.title;
        bValue = b.title;
      } else {
        // Fallback for other fields
        aValue = (a as any)[sortOption.field];
        bValue = (b as any)[sortOption.field];
      }
      
      // Handle direction
      return sortOption.direction === 'asc' 
        ? (aValue > bValue ? 1 : -1) 
        : (aValue < bValue ? 1 : -1);
    });
    
    return filteredRecipes;
  }, [recipes, searchQuery, filters, sortOption, fuse]);
  
  // Paginate the results
  const paginatedRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return displayedRecipes.slice(startIndex, endIndex);
  }, [displayedRecipes, currentPage, itemsPerPage]);
  
  // Reset pagination when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);
  
  // Handler for recipe click
  const handleRecipeClick = (recipe: Recipe) => {
    console.log('Recipe clicked:', recipe);
    // Navigate to recipe detail page or show modal
    // This would typically use router navigation
  };
  
  // Handler for filter change
  const handleFilterChange = (key: keyof FilterCriteria, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };
  
  // Handler for sort change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = event.target.value.split('-') as [SortField, SortDirection];
    setSortOption({ field, direction });
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Recipe Collection</h1>
      
      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes by title, ingredients or tags..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Cuisine Filter */}
          <div>
            <label htmlFor="cuisine-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Cuisine
            </label>
            <select
              id="cuisine-filter"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={filters.cuisine || 'all'}
              onChange={(e) => handleFilterChange('cuisine', e.target.value)}
            >
              <option value="all">All cuisines</option>
              {filterOptions.cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category Filter */}
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Dish Type
            </label>
            <select
              id="category-filter"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={filters.category || 'all'}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All dish types</option>
              {filterOptions.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              id="difficulty-filter"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={filters.difficulty || 'all'}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              <option value="all">All difficulties</option>
              {filterOptions.difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort Options */}
          <div>
            <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort-options"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={`${sortOption.field}-${sortOption.direction}`}
              onChange={handleSortChange}
            >
              <option value="title-asc">Name (A-Z)</option>
              <option value="title-desc">Name (Z-A)</option>
              <option value="prepTime-asc">Prep Time (Low to High)</option>
              <option value="prepTime-desc">Prep Time (High to Low)</option>
              <option value="cookTime-asc">Cook Time (Low to High)</option>
              <option value="cookTime-desc">Cook Time (High to Low)</option>
              <option value="totalTime-asc">Total Time (Low to High)</option>
              <option value="totalTime-desc">Total Time (High to Low)</option>
            </select>
          </div>
        </div>
        
        {/* View Type Selector */}
        <div className="flex justify-end mt-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setViewType('grid')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewType === 'grid' 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewType('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                viewType === 'list' 
                  ? 'bg-blue-50 text-blue-700 border-blue-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Recipes Count */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{displayedRecipes.length}</span> recipes found
        </div>
        <div className="text-sm text-gray-600">
          <label htmlFor="items-per-page" className="mr-2">Show:</label>
          <select
            id="items-per-page"
            className="rounded border-gray-300 text-sm"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>
      </div>

      {/* Recipes Display */}
      {displayedRecipes.length === 0 ? (
        <EmptyState />
      ) : viewType === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} onClick={handleRecipeClick} />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {paginatedRecipes.map((recipe, index) => (
            <div 
              key={index} 
              className="py-4 flex items-center hover:bg-gray-50 cursor-pointer transition"
              onClick={() => handleRecipeClick(recipe)}
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{recipe.title}</h3>
                <div className="mt-1 flex items-center">
                  {recipe.metadata.cuisine && (
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs mr-2">
                      {recipe.metadata.cuisine}
                    </span>
                  )}
                  {recipe.metadata.difficulty && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs mr-2">
                      {recipe.metadata.difficulty}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-600 truncate">
                  {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 ? '...' : ''}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 text-sm text-gray-500">
                {recipe.metadata.totalTime && (
                  <div>
                    <span className="font-medium">{recipe.metadata.totalTime}</span> min
                  </div>
                )}
                {recipe.metadata.servings && (
                  <div>
                    <span className="font-medium">{recipe.metadata.servings}</span> servings
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      <Pagination 
        totalItems={displayedRecipes.length} 
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RecipeDashboard;