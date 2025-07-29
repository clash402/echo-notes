'use client';

import { useState } from 'react';
import { Tag, Plus, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagSuggestion, generateTags, formatConfidence } from '@/lib/tagGenerator';

interface TagSuggestionsProps {
  note: {
    title: string;
    content: string;
    summary?: string;
    transcript?: string;
  };
  currentTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagSuggestions = ({ 
  note, 
  currentTags, 
  onAddTag, 
  onRemoveTag 
}: TagSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const generateTagSuggestions = async () => {
    setIsGenerating(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSuggestions = generateTags(note);
    setSuggestions(newSuggestions);
    setShowSuggestions(true);
    setIsGenerating(false);
  };

  const handleAddSuggestion = (tag: string) => {
    if (!currentTags.includes(tag)) {
      onAddTag(tag);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return '🔥';
    if (confidence >= 0.6) return '⚡';
    if (confidence >= 0.4) return '💡';
    return '💭';
  };

  return (
    <div className="space-y-4">
      {/* Current Tags */}
      {currentTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Tags</h4>
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Generate Suggestions Button */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={generateTagSuggestions}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Tag Suggestions
            </>
          )}
        </Button>
        
        {suggestions.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="text-gray-600"
          >
            {showSuggestions ? 'Hide' : 'Show'} Suggestions
          </Button>
        )}
      </div>

      {/* Tag Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-medium text-gray-700">AI-Generated Suggestions</h4>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              Based on your note content
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((suggestion) => {
              const isAlreadyAdded = currentTags.includes(suggestion.tag);
              const confidenceColor = getConfidenceColor(suggestion.confidence);
              const confidenceIcon = getConfidenceIcon(suggestion.confidence);
              
              return (
                <div
                  key={suggestion.tag}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isAlreadyAdded 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{confidenceIcon}</span>
                      <span className="font-medium text-gray-900">{suggestion.tag}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${confidenceColor}`}>
                        {formatConfidence(suggestion.confidence)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{suggestion.reason}</p>
                  </div>
                  
                  <Button
                    variant={isAlreadyAdded ? "ghost" : "outline"}
                    size="sm"
                    onClick={() => handleAddSuggestion(suggestion.tag)}
                    disabled={isAlreadyAdded}
                    className={`flex items-center gap-1 ${
                      isAlreadyAdded 
                        ? 'text-green-600 hover:text-green-700' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {isAlreadyAdded ? (
                      <>
                        <span className="text-green-600">✓</span>
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Suggestions are generated based on keywords found in your note content. 
              Higher confidence means better relevance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 