import { TranscriptionResult, SummaryResult } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL env var:', process.env.NEXT_PUBLIC_API_URL);

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
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

  async getNotes() {
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
      // Return empty array if backend is not available
      console.warn('Backend not available, returning empty notes array:', error);
      return [];
    }
  }

  async getNote(id: string) {
    const response = await fetch(`${this.baseUrl}/api/notes/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch note: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(); 