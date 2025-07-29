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
  preferredVoiceId: string;
  preferredSpeed: number;
  preferredVolume: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  keyboardShortcuts: boolean;
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
  recording: {
    autoStart: boolean;
    quality: 'low' | 'medium' | 'high';
    maxDuration: number; // in minutes
  };
  display: {
    compactMode: boolean;
    showTimestamps: boolean;
    showCosts: boolean;
    notesPerPage: number;
  };
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: string;
  category: 'navigation' | 'recording' | 'editing' | 'general';
}

export interface AccessibilitySettings {
  enableKeyboardNavigation: boolean;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableReducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  focusIndicator: boolean;
} 