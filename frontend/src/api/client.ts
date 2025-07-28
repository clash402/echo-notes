import { TranscriptionResult, SummaryResult, Note, SearchFilters, SearchResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL env var:', process.env.NEXT_PUBLIC_API_URL);

// Dummy data for development
const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Project Ideas for Q1',
    content: 'Need to focus on user experience improvements and mobile optimization.',
    transcript: 'I was thinking about our project ideas for Q1. We really need to focus on user experience improvements and mobile optimization. The current app is good but could be much better.',
    summary: 'Planning Q1 projects focusing on UX improvements and mobile optimization.',
    tags: ['project', 'planning', 'ux'],
    audioUrl: '/api/audio/1',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    title: 'Meeting Notes - Team Sync',
    content: 'Discussed new feature requirements and timeline for the upcoming sprint.',
    transcript: 'In today\'s team sync, we discussed the new feature requirements and timeline for the upcoming sprint. Everyone seems to be on the same page about priorities.',
    summary: 'Team sync meeting covering new feature requirements and sprint timeline.',
    tags: ['meeting', 'team', 'sprint'],
    audioUrl: '/api/audio/2',
    createdAt: new Date('2024-01-14T14:20:00Z'),
    updatedAt: new Date('2024-01-14T14:20:00Z'),
  },
  {
    id: '3',
    title: 'Code Architecture Thoughts',
    content: 'Considering microservices approach for better scalability and maintenance.',
    transcript: 'I\'ve been thinking about our code architecture. We might want to consider a microservices approach for better scalability and maintenance. It would require some upfront work but could pay off long-term.',
    summary: 'Exploring microservices architecture for improved scalability and maintenance.',
    tags: ['architecture', 'technical', 'scalability'],
    audioUrl: '/api/audio/3',
    createdAt: new Date('2024-01-13T16:45:00Z'),
    updatedAt: new Date('2024-01-13T16:45:00Z'),
  },
  {
    id: '4',
    title: 'User Feedback Summary',
    content: 'Users want faster loading times and better search functionality.',
    transcript: 'Looking at the user feedback we\'ve received, the main complaints are about loading times and search functionality. Users want things to be faster and easier to find.',
    summary: 'User feedback highlights need for faster loading and improved search.',
    tags: ['feedback', 'users', 'performance'],
    audioUrl: '/api/audio/4',
    createdAt: new Date('2024-01-12T09:15:00Z'),
    updatedAt: new Date('2024-01-12T09:15:00Z'),
  },
  {
    id: '5',
    title: 'Personal Goals for 2024',
    content: 'Focus on learning new technologies and improving leadership skills.',
    transcript: 'For 2024, I want to focus on learning new technologies, especially around AI and machine learning. I also want to improve my leadership skills and mentor more junior developers.',
    summary: 'Personal development goals: learn new tech (AI/ML) and improve leadership.',
    tags: ['personal', 'goals', 'learning'],
    audioUrl: '/api/audio/5',
    createdAt: new Date('2024-01-10T11:00:00Z'),
    updatedAt: new Date('2024-01-10T11:00:00Z'),
  },
];

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  // Helper method to filter and sort notes
  private filterAndSortNotes(notes: Note[], filters: SearchFilters): Note[] {
    let filteredNotes = [...notes];

    // Apply search query
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.transcript?.toLowerCase().includes(query) ||
        note.summary?.toLowerCase().includes(query) ||
        note.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        note.tags?.some(tag => filters.tags.includes(tag))
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

    return filteredNotes;
  }

  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch(`${this.baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }

    return response.json();
  }

  async summarizeText(text: string): Promise<SummaryResult> {
    const response = await fetch(`${this.baseUrl}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.statusText}`);
    }

    return response.json();
  }

  async saveNote(note: {
    title: string;
    content: string;
    audioUrl?: string;
    transcript?: string;
    summary?: string;
    tags?: string[];
  }) {
    const response = await fetch(`${this.baseUrl}/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (!response.ok) {
      throw new Error(`Failed to save note: ${response.statusText}`);
    }

    return response.json();
  }

  async updateNote(id: string, updates: {
    title?: string;
    content?: string;
    tags?: string[];
  }) {
    // For now, simulate API call with dummy data
    console.log('Updating note with dummy data:', { id, updates });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and update the note in dummy data
    const noteIndex = dummyNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    // Update the note
    dummyNotes[noteIndex] = {
      ...dummyNotes[noteIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return dummyNotes[noteIndex];

    // Original backend logic (commented out for now)
    /*
    const response = await fetch(`${this.baseUrl}/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`Failed to update note: ${response.statusText}`);
    }

    return response.json();
    */
  }

  async deleteNote(id: string) {
    // For now, simulate API call with dummy data
    console.log('Deleting note with dummy data:', id);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find and remove the note from dummy data
    const noteIndex = dummyNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    // Remove the note
    dummyNotes.splice(noteIndex, 1);

    return { success: true };

    // Original backend logic (commented out for now)
    /*
    const response = await fetch(`${this.baseUrl}/api/notes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete note: ${response.statusText}`);
    }

    return response.json();
    */
  }

  async getNotes(filters?: SearchFilters): Promise<SearchResult> {
    // For now, always use dummy data to ensure the UI works
    // TODO: Remove this when backend is fully operational
    console.log('Using dummy data for development');
    
    const defaultFilters: SearchFilters = {
      query: '',
      sortBy: 'newest',
      tags: [],
    };

    const appliedFilters = filters || defaultFilters;
    const filteredNotes = this.filterAndSortNotes(dummyNotes, appliedFilters);

    return {
      notes: filteredNotes,
      total: filteredNotes.length,
      hasMore: false,
    };

    // Original backend logic (commented out for now)
    /*
    try {
      if (!this.baseUrl) {
        console.warn('baseUrl is undefined, using fallback');
        this.baseUrl = 'http://localhost:8000';
      }
      
      const response = await fetch(`${this.baseUrl}/api/notes`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Return dummy data if backend is not available
      console.warn('Backend not available, returning dummy data:', error);
      
      const defaultFilters: SearchFilters = {
        query: '',
        sortBy: 'newest',
        tags: [],
      };

      const appliedFilters = filters || defaultFilters;
      const filteredNotes = this.filterAndSortNotes(dummyNotes, appliedFilters);

      return {
        notes: filteredNotes,
        total: filteredNotes.length,
        hasMore: false,
      };
    }
    */
  }

  async getNote(id: string) {
    const response = await fetch(`${this.baseUrl}/api/notes/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all available tags for filter dropdown
  async getAvailableTags(): Promise<string[]> {
    // For now, always use dummy tags to ensure the UI works
    // TODO: Remove this when backend is fully operational
    console.log('Using dummy tags for development');
    
    const allTags = new Set<string>();
    dummyNotes.forEach(note => {
      note.tags?.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();

    // Original backend logic (commented out for now)
    /*
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Return dummy tags if backend is not available
      console.warn('Backend not available, returning dummy tags:', error);
      
      const allTags = new Set<string>();
      dummyNotes.forEach(note => {
        note.tags?.forEach(tag => allTags.add(tag));
      });
      
      return Array.from(allTags).sort();
    }
    */
  }
}

export const apiClient = new ApiClient(); 