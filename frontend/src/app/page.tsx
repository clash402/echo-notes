'use client';

import { useEffect, useState } from 'react';
import { Recorder } from '@/components/DynamicRecorder';
import { NoteCard } from '@/components/NoteCard';
import { PlaybackBar } from '@/components/PlaybackBar';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { useNotes } from '@/hooks/useNotes';
import { Note, SearchFilters } from '@/types';

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'newest',
    tags: [],
  });
  
  const { notes, total, isLoading, error } = useNotes(filters);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // Get backend URL - use production URL in deployment, localhost for development
  const getBackendUrl = () => {
    // Check if we're in production (Vercel deployment)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return 'https://echo-notes-backend.fly.dev';
    }
    // Local development
    return 'http://localhost:8000';
  };
  
  const backendUrl = getBackendUrl();
  console.log('🔧 backendUrl from page.tsx:', backendUrl);
  console.log('🔧 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');

  // Health check on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log('🔍 Checking backend health...');
        const response = await fetch(`${backendUrl}/health`);
        const data = await response.json();
        console.log('✅ Health check successful:', data);
      } catch (error) {
        console.error('❌ Health check failed:', error);
      }
    };

    checkHealth();
  }, [backendUrl]);

  const handlePlayNote = (note: Note) => {
    if (note.audioUrl) {
      setCurrentAudioUrl(note.audioUrl);
    }
  };

  const handleClosePlayback = () => {
    setCurrentAudioUrl(null);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">Failed to load notes. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Echo Notes</h1>
          <p className="text-gray-600">Record, transcribe, and organize your thoughts!</p>
        </div>

        {/* Recorder Section */}
        <div className="mb-8">
          <Recorder />
        </div>

        {/* Search and Filter Section */}
        <SearchAndFilter filters={filters} onFiltersChange={handleFiltersChange} />

        {/* Notes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Your Notes</h2>
            {total > 0 && (
              <span className="text-sm text-gray-600">
                {total} note{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              {filters.query || filters.tags.length > 0 ? (
                <div>
                  <p className="text-gray-600 mb-2">No notes found matching your search criteria.</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <p className="text-gray-600">No notes yet. Start recording to create your first note!</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note: Note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPlay={handlePlayNote}
                  onEdit={(note: Note) => console.log('Edit note:', note)}
                  onDelete={(noteId: string) => console.log('Delete note:', noteId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Playback Bar */}
      {currentAudioUrl && (
        <PlaybackBar
          audioUrl={currentAudioUrl}
          onClose={handleClosePlayback}
        />
      )}
    </div>
  );
}
