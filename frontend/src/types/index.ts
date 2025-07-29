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
  stream?: MediaStream;
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

// New types for token cost tracking
export interface TokenUsage {
  transcription: number;
  summarization: number;
  total: number;
}

export interface CostBreakdown {
  transcription: {
    tokens: number;
    cost: number;
  };
  summarization: {
    tokens: number;
    cost: number;
  };
  total: {
    tokens: number;
    cost: number;
  };
}

export interface ProcessingSession {
  id: string;
  audioDuration: number;
  tokenUsage: TokenUsage;
  costBreakdown: CostBreakdown;
  status: 'processing' | 'completed' | 'error';
  createdAt: Date;
}

// New types for voice output controls
export interface VoiceSettings {
  enabled: boolean;
  voiceId: string;
  voiceName: string;
  playbackSpeed: number;
  volume: number;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
  labels?: Record<string, string>;
}

export interface VoicePreferences {
  defaultVoice: string;
  defaultSpeed: number;
  defaultVolume: number;
  autoPlay: boolean;
} 