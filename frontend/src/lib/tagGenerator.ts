// Common tag categories and their associated keywords
const TAG_CATEGORIES = {
  work: {
    keywords: ['project', 'meeting', 'team', 'sprint', 'deadline', 'client', 'business', 'work', 'office', 'collaboration'],
    tags: ['work', 'project', 'meeting', 'team', 'business']
  },
  technical: {
    keywords: ['code', 'programming', 'development', 'architecture', 'api', 'database', 'frontend', 'backend', 'deployment', 'testing', 'bug', 'feature'],
    tags: ['technical', 'development', 'code', 'architecture', 'api']
  },
  personal: {
    keywords: ['personal', 'goals', 'learning', 'hobby', 'family', 'health', 'fitness', 'travel', 'reading', 'music', 'art'],
    tags: ['personal', 'goals', 'learning', 'hobby']
  },
  planning: {
    keywords: ['plan', 'strategy', 'roadmap', 'timeline', 'schedule', 'organize', 'prioritize', 'goal', 'objective', 'milestone'],
    tags: ['planning', 'strategy', 'timeline', 'organization']
  },
  feedback: {
    keywords: ['feedback', 'review', 'user', 'customer', 'improvement', 'suggestion', 'complaint', 'praise', 'survey'],
    tags: ['feedback', 'user', 'improvement']
  },
  performance: {
    keywords: ['performance', 'speed', 'optimization', 'efficiency', 'slow', 'fast', 'loading', 'response time', 'bottleneck'],
    tags: ['performance', 'optimization', 'efficiency']
  },
  ux: {
    keywords: ['user experience', 'ux', 'ui', 'interface', 'design', 'usability', 'user interface', 'interaction', 'wireframe'],
    tags: ['ux', 'design', 'interface', 'usability']
  },
  research: {
    keywords: ['research', 'study', 'analysis', 'data', 'statistics', 'survey', 'investigation', 'explore', 'discover'],
    tags: ['research', 'analysis', 'data']
  },
  ideas: {
    keywords: ['idea', 'concept', 'innovation', 'creative', 'brainstorm', 'inspiration', 'vision', 'future', 'possibility'],
    tags: ['ideas', 'innovation', 'creative']
  }
};

// Priority weights for different content types
const CONTENT_WEIGHTS = {
  title: 3,      // Title matches are most important
  summary: 2,    // Summary matches are important
  content: 1,    // Content matches are standard
  transcript: 1  // Transcript matches are standard
};

export interface TagSuggestion {
  tag: string;
  confidence: number;
  category: string;
  reason: string;
}

/**
 * Generate tags from note content
 */
export function generateTags(note: {
  title: string;
  content: string;
  summary?: string;
  transcript?: string;
}): TagSuggestion[] {
  const suggestions: TagSuggestion[] = [];
  const textToAnalyze = [
    { text: note.title, weight: CONTENT_WEIGHTS.title },
    { text: note.content, weight: CONTENT_WEIGHTS.content },
    { text: note.summary || '', weight: CONTENT_WEIGHTS.summary },
    { text: note.transcript || '', weight: CONTENT_WEIGHTS.transcript }
  ];

  // Analyze each category
  Object.entries(TAG_CATEGORIES).forEach(([category, config]) => {
    let totalScore = 0;
    const matches: string[] = [];

    // Check each piece of content
    textToAnalyze.forEach(({ text, weight }) => {
      if (!text) return;
      
      const lowerText = text.toLowerCase();
      config.keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          totalScore += weight;
          matches.push(keyword);
        }
      });
    });

    // If we found matches, add suggestions
    if (totalScore > 0) {
      config.tags.forEach(tag => {
        const confidence = Math.min(totalScore / 10, 1); // Normalize to 0-1
        const reason = `Matched keywords: ${[...new Set(matches)].slice(0, 3).join(', ')}`;
        
        suggestions.push({
          tag,
          confidence,
          category,
          reason
        });
      });
    }
  });

  // Sort by confidence and remove duplicates
  const uniqueSuggestions = suggestions
    .sort((a, b) => b.confidence - a.confidence)
    .filter((suggestion, index, self) => 
      index === self.findIndex(s => s.tag === suggestion.tag)
    );

  // Return top 6 suggestions
  return uniqueSuggestions.slice(0, 6);
}

/**
 * Get tag suggestions for a specific category
 */
export function getTagSuggestionsByCategory(category: string): string[] {
  return TAG_CATEGORIES[category as keyof typeof TAG_CATEGORIES]?.tags || [];
}

/**
 * Get all available tag categories
 */
export function getTagCategories(): string[] {
  return Object.keys(TAG_CATEGORIES);
}

/**
 * Get all available tags
 */
export function getAllAvailableTags(): string[] {
  const allTags = new Set<string>();
  Object.values(TAG_CATEGORIES).forEach(category => {
    category.tags.forEach(tag => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}

/**
 * Format confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
} 