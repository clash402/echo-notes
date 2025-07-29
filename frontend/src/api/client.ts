import { Note, SearchFilters, SearchResult, CostBreakdown, TokenUsage } from '@/types';
import { calculateTotalCost } from '@/lib/costCalculator';
import { getAllAvailableTags } from '@/lib/tagGenerator';

// Dummy notes for development
const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Project Planning Meeting',
    content: 'Discussed the new feature roadmap for Q2. Key priorities include user authentication improvements and mobile app development. Team agreed on sprint planning for next week.',
    audioUrl: '/api/audio/1',
    transcript: 'Discussed the new feature roadmap for Q2. Key priorities include user authentication improvements and mobile app development.',
    summary: 'Q2 roadmap planning with focus on auth improvements and mobile development.',
    tags: ['work', 'meeting', 'planning'],
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    title: 'Grocery Shopping List',
    content: 'Need to buy milk, bread, eggs, and vegetables. Also need to pick up some cleaning supplies and toiletries. Remember to check for any sales or coupons.',
    audioUrl: '/api/audio/2',
    transcript: 'Need to buy milk, bread, eggs, and vegetables. Also need to pick up some cleaning supplies and toiletries.',
    summary: 'Grocery shopping list including dairy, produce, and household items.',
    tags: ['personal', 'shopping'],
    createdAt: new Date('2024-01-14T16:45:00Z'),
    updatedAt: new Date('2024-01-14T16:45:00Z'),
  },
  {
    id: '3',
    title: 'Code Review Notes',
    content: 'Reviewed the authentication middleware implementation. Found several security issues that need to be addressed. The JWT token validation logic needs improvement.',
    audioUrl: '/api/audio/3',
    transcript: 'Reviewed the authentication middleware implementation. Found several security issues that need to be addressed.',
    summary: 'Security issues found in auth middleware, JWT validation needs improvement.',
    tags: ['technical', 'code', 'security'],
    createdAt: new Date('2024-01-13T14:20:00Z'),
    updatedAt: new Date('2024-01-13T14:20:00Z'),
  },
  {
    id: '4',
    title: 'Book Recommendations',
    content: 'Interested in reading more about machine learning and AI. Looking for books that explain complex concepts in simple terms. Also want to explore some fiction for leisure reading.',
    audioUrl: '/api/audio/4',
    transcript: 'Interested in reading more about machine learning and AI. Looking for books that explain complex concepts in simple terms.',
    summary: 'Seeking ML/AI books and fiction recommendations for learning and leisure.',
    tags: ['personal', 'learning', 'books'],
    createdAt: new Date('2024-01-12T09:15:00Z'),
    updatedAt: new Date('2024-01-12T09:15:00Z'),
  },
  {
    id: '5',
    title: 'Fitness Goals',
    content: 'Want to improve overall fitness and strength. Plan to work out 3-4 times per week. Focus on compound movements and progressive overload. Need to track nutrition as well.',
    audioUrl: '/api/audio/5',
    transcript: 'Want to improve overall fitness and strength. Plan to work out 3-4 times per week. Focus on compound movements.',
    summary: 'Fitness goals: 3-4 workouts weekly, compound movements, nutrition tracking.',
    tags: ['personal', 'fitness', 'goals'],
    createdAt: new Date('2024-01-11T18:30:00Z'),
    updatedAt: new Date('2024-01-11T18:30:00Z'),
  },
  {
    id: '6',
    title: 'Travel Planning',
    content: 'Planning a trip to Japan for next spring. Want to visit Tokyo, Kyoto, and Osaka. Need to research best times to visit, accommodation options, and must-see attractions.',
    audioUrl: '/api/audio/6',
    transcript: 'Planning a trip to Japan for next spring. Want to visit Tokyo, Kyoto, and Osaka.',
    summary: 'Japan travel planning for spring: Tokyo, Kyoto, Osaka with research needed.',
    tags: ['personal', 'travel', 'planning'],
    createdAt: new Date('2024-01-10T12:00:00Z'),
    updatedAt: new Date('2024-01-10T12:00:00Z'),
  },
  {
    id: '7',
    title: 'Team Retrospective',
    content: 'Had our quarterly team retrospective. Discussed what went well, what could be improved, and action items for next quarter. Communication and documentation were highlighted as areas for improvement.',
    audioUrl: '/api/audio/7',
    transcript: 'Had our quarterly team retrospective. Discussed what went well, what could be improved, and action items for next quarter.',
    summary: 'Quarterly team retrospective with focus on communication and documentation improvements.',
    tags: ['work', 'meeting', 'retrospective'],
    createdAt: new Date('2024-01-09T15:30:00Z'),
    updatedAt: new Date('2024-01-09T15:30:00Z'),
  },
  {
    id: '8',
    title: 'Recipe Ideas',
    content: 'Want to try making homemade pasta and pizza from scratch. Need to research recipes, buy ingredients, and practice techniques. Also interested in learning to make sourdough bread.',
    audioUrl: '/api/audio/8',
    transcript: 'Want to try making homemade pasta and pizza from scratch. Need to research recipes, buy ingredients, and practice techniques.',
    summary: 'Cooking goals: homemade pasta, pizza, and sourdough bread recipes.',
    tags: ['personal', 'cooking', 'recipes'],
    createdAt: new Date('2024-01-08T19:45:00Z'),
    updatedAt: new Date('2024-01-08T19:45:00Z'),
  },
  {
    id: '9',
    title: 'Database Optimization',
    content: 'Need to optimize the database queries for better performance. Current queries are taking too long to execute. Should implement proper indexing and consider query optimization techniques.',
    audioUrl: '/api/audio/9',
    transcript: 'Need to optimize the database queries for better performance. Current queries are taking too long to execute.',
    summary: 'Database optimization needed: indexing and query performance improvements.',
    tags: ['technical', 'database', 'performance'],
    createdAt: new Date('2024-01-07T11:20:00Z'),
    updatedAt: new Date('2024-01-07T11:20:00Z'),
  },
  {
    id: '10',
    title: 'Language Learning Goals',
    content: 'Want to improve my Spanish speaking skills. Plan to practice daily for 30 minutes using language apps and conversation partners. Focus on vocabulary building and grammar practice.',
    audioUrl: '/api/audio/10',
    transcript: 'Want to improve my Spanish speaking skills. Plan to practice daily for 30 minutes using language apps.',
    summary: 'Spanish learning goals: daily practice, vocabulary, and grammar improvement.',
    tags: ['personal', 'learning', 'language'],
    createdAt: new Date('2024-01-06T14:15:00Z'),
    updatedAt: new Date('2024-01-06T14:15:00Z'),
  },
  {
    id: '11',
    title: 'Product Feature Ideas',
    content: 'Brainstorming new features for our product. Ideas include dark mode, offline support, advanced search filters, and integration with third-party tools. Need to prioritize based on user feedback.',
    audioUrl: '/api/audio/11',
    transcript: 'Brainstorming new features for our product. Ideas include dark mode, offline support, advanced search filters.',
    summary: 'Product feature ideas: dark mode, offline support, search filters, integrations.',
    tags: ['work', 'product', 'features'],
    createdAt: new Date('2024-01-05T16:30:00Z'),
    updatedAt: new Date('2024-01-05T16:30:00Z'),
  },
  {
    id: '12',
    title: 'Home Improvement Projects',
    content: 'Planning several home improvement projects for the year. Want to repaint the living room, update the kitchen backsplash, and install new lighting fixtures. Need to budget and schedule the work.',
    audioUrl: '/api/audio/12',
    transcript: 'Planning several home improvement projects for the year. Want to repaint the living room, update the kitchen backsplash.',
    summary: 'Home improvement projects: painting, kitchen updates, lighting installation.',
    tags: ['personal', 'home', 'improvement'],
    createdAt: new Date('2024-01-04T10:00:00Z'),
    updatedAt: new Date('2024-01-04T10:00:00Z'),
  },
];

// Helper function to filter and sort notes
const filterAndSortNotes = (
  notes: Note[],
  filters: SearchFilters,
  page: number = 1,
  limit: number = 10
): SearchResult => {
  let filteredNotes = [...notes];

  // Apply search query filter
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    filteredNotes = filteredNotes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      note.transcript?.toLowerCase().includes(query) ||
      note.summary?.toLowerCase().includes(query)
    );
  }

  // Apply tag filters
  if (filters.tags.length > 0) {
    filteredNotes = filteredNotes.filter(note =>
      filters.tags.every(tag => note.tags?.includes(tag))
    );
  }

  // Apply date range filter
  if (filters.dateRange) {
    filteredNotes = filteredNotes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate >= filters.dateRange!.start && noteDate <= filters.dateRange!.end;
    });
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'oldest':
      filteredNotes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'title':
      filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'newest':
    default:
      filteredNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Apply pagination
  const total = filteredNotes.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  return {
    notes: paginatedNotes,
    total,
    hasMore,
  };
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Check if we're in production (Vercel deployment)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      this.baseUrl = 'https://echo-notes-backend.fly.dev';
    } else {
      // Local development
      this.baseUrl = 'http://localhost:8000';
    }
  }

  async getNotes(filters?: SearchFilters, page: number = 1, limit: number = 10): Promise<SearchResult> {
    try {
      // For development, always use dummy data
      console.log('🔧 Using dummy data for development');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return filterAndSortNotes(dummyNotes, filters || { query: '', sortBy: 'newest', tags: [] }, page, limit);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      // Fallback to dummy data
      return filterAndSortNotes(dummyNotes, filters || { query: '', sortBy: 'newest', tags: [] }, page, limit);
    }
  }

  async saveNote(noteData: {
    title: string;
    content: string;
    audioUrl?: string;
    transcript?: string;
    summary?: string;
    tags?: string[];
  }): Promise<Note> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Add to dummy data
      dummyNotes.unshift(newNote);
      
      return newNote;
    } catch (error) {
      console.error('Failed to save note:', error);
      throw error;
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<{
    text: string;
    confidence: number;
    costBreakdown: CostBreakdown;
  }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscript = "This is a simulated transcript of the audio recording. In a real implementation, this would be generated by OpenAI's Whisper API.";
      const mockConfidence = 0.95;
      
      // Simulate cost calculation
      const costBreakdown = calculateTotalCost(30, mockTranscript); // Assume 30 seconds
      
      return {
        text: mockTranscript,
        confidence: mockConfidence,
        costBreakdown,
      };
    } catch (error) {
      console.error('Failed to transcribe audio:', error);
      throw error;
    }
  }

  async summarizeText(text: string): Promise<{
    summary: string;
    keyPoints: string[];
    costBreakdown: CostBreakdown;
  }> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSummary = "This is a simulated summary of the provided text. In a real implementation, this would be generated by OpenAI's GPT API.";
      const mockKeyPoints = [
        "Key point 1 from the text",
        "Key point 2 from the text",
        "Key point 3 from the text"
      ];
      
      // Simulate cost calculation
      const costBreakdown = calculateTotalCost(0, text, true); // Use GPT-4 for summarization
      
      return {
        summary: mockSummary,
        keyPoints: mockKeyPoints,
        costBreakdown,
      };
    } catch (error) {
      console.error('Failed to summarize text:', error);
      throw error;
    }
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const noteIndex = dummyNotes.findIndex(note => note.id === id);
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }
      
      const updatedNote = {
        ...dummyNotes[noteIndex],
        ...updates,
        updatedAt: new Date(),
      };
      
      dummyNotes[noteIndex] = updatedNote;
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  }

  async deleteNote(id: string): Promise<void> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const noteIndex = dummyNotes.findIndex(note => note.id === id);
      if (noteIndex === -1) {
        throw new Error('Note not found');
      }
      
      dummyNotes.splice(noteIndex, 1);
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  }

  async getNote(id: string): Promise<Note> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const note = dummyNotes.find(note => note.id === id);
      if (!note) {
        throw new Error('Note not found');
      }
      
      return note;
    } catch (error) {
      console.error('Failed to fetch note:', error);
      throw error;
    }
  }

  async getAvailableTags(): Promise<string[]> {
    try {
      // For development, always use tag generator
      console.log('🔧 Using tag generator for development');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return getAllAvailableTags();
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      // Fallback to tag generator
      return getAllAvailableTags();
    }
  }
}

export const apiClient = new ApiClient();