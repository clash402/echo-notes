'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchFilters, Note } from '@/types';

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  notes: Note[];
}

export const SearchAndFilter = ({ filters, onFiltersChange, notes }: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique tags from the actual notes
  const availableTags = useMemo(() => {
    const allTags = notes.flatMap(note => note.tags || []);
    return [...new Set(allTags)].sort();
  }, [notes]);

  const handleSearchChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      sortBy: 'newest',
      tags: [],
    });
  };

  const hasActiveFilters = filters.query.trim() || filters.tags.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes by title, content, or tags..."
            value={filters.query}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'newest' as const, label: 'Newest First' },
                { value: 'oldest' as const, label: 'Oldest First' },
                { value: 'title' as const, label: 'Title A-Z' },
              ].map((option) => {
                const isSelected = filters.sortBy === option.value;
                return (
                  <Button
                    key={option.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange(option.value)}
                    style={{
                      backgroundColor: isSelected ? 'hsl(var(--primary))' : 'transparent',
                      color: isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                      borderColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                    }}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Tag Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = filters.tags.includes(tag);
                return (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => handleTagToggle(tag)}
                    className="text-xs"
                    style={{
                      backgroundColor: isSelected ? 'hsl(var(--primary))' : 'transparent',
                      color: isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                      borderColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                    }}
                  >
                    {tag}
                  </Button>
                );
              })}
              {availableTags.length === 0 && (
                <div className="text-sm text-gray-500">No tags available</div>
              )}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="text-sm text-gray-600">
                             {filters.query && (
                 <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2">
                   Search: &ldquo;{filters.query}&rdquo;
                 </span>
               )}
              {filters.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded mr-2 mb-2"
                >
                  Tag: {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 