'use client';

import { useState } from 'react';
import { Recorder } from '@/components/DynamicRecorder';
import { NoteCard } from '@/components/NoteCard';
import { PlaybackBar } from '@/components/PlaybackBar';
import { useNotes } from '@/hooks/useNotes';
import { Note } from '@/types';

export default function Home() {
  const { notes, isLoading, error } = useNotes();
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  const handlePlayNote = (note: Note) => {
    if (note.audioUrl) {
      setCurrentAudioUrl(note.audioUrl);
    }
  };

  const handleClosePlayback = () => {
    setCurrentAudioUrl(null);
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
          <p className="text-gray-600">Record, transcribe, and organize your thoughts</p>
        </div>

        {/* Recorder Section */}
        <div className="mb-8">
          <Recorder />
        </div>

        {/* Notes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Notes</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No notes yet. Start recording to create your first note!</p>
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
