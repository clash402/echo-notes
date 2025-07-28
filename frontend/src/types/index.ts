export interface Note {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  transcript?: string;
  summary?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob?: Blob;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
}

// New types for search and filter
export interface SearchFilters {
  query: string;
  sortBy: 'newest' | 'oldest' | 'title';
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchResult {
  notes: Note[];
  total: number;
  hasMore: boolean;
} 