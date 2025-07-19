export interface Note {
  id: string;
  title: string;
  content: string;
  audioUrl?: string;
  transcript?: string;
  summary?: string;
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