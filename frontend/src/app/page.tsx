'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Sun, Moon, Monitor, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recorder } from '@/components/Recorder';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { NoteCard } from '@/components/NoteCard';
import { EditNoteModal } from '@/components/EditNoteModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Toast } from '@/components/Toast';

import { SettingsModal } from '@/components/SettingsModal';
import { NoteCardSkeletonGrid } from '@/components/NoteCardSkeleton';
import { useInfiniteNotes } from '@/hooks/useNotes';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePreferences } from '@/hooks/usePreferences';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { apiClient } from '@/api/client';
import type { Note, SearchFilters } from '@/types';

export default function Home() {
  // State management
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    sortBy: 'newest'
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [speakingNoteId, setSpeakingNoteId] = useState<string | null>(null);

  // Hooks
  const { notes, total, hasMore, isLoading, error, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteNotes(filters);
  const { voiceSettings, updateVoiceSettings, speakNote, testVoice, toggleVoiceOutput, isEnabled: voiceEnabled } = useVoiceOutput();
  const { preferences, updatePreferences, toggleTheme, isLoaded: preferencesLoaded } = usePreferences();

  // Infinite scroll
  const { loadingRef } = useInfiniteScroll({
    hasMore,
    isLoading: isFetchingNextPage,
    onLoadMore: fetchNextPage,
  });

  // Keyboard shortcuts
  const handleShortcutAction = (action: string) => {
    switch (action) {
      case 'start-recording':
        // Focus on recorder start button
        (document.querySelector('[data-action="start-recording"]') as HTMLElement)?.focus();
        break;
      case 'stop-recording':
        // Focus on recorder stop button
        (document.querySelector('[data-action="stop-recording"]') as HTMLElement)?.focus();
        break;
      case 'focus-search':
        // Focus on search input
        (document.querySelector('[data-action="search-input"]') as HTMLElement)?.focus();
        break;
      case 'focus-filter':
        // Focus on filter dropdown
        (document.querySelector('[data-action="filter-dropdown"]') as HTMLElement)?.focus();
        break;
      case 'go-home':
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'show-shortcuts':
        setShowSettings(true);
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
      case 'toggle-voice':
        toggleVoiceOutput();
        break;
      case 'open-note':
        // Focus on first note card
        (document.querySelector('[data-action="note-card"]') as HTMLElement)?.focus();
        break;
      case 'edit-note':
        // Focus on first edit button
        (document.querySelector('[data-action="edit-note"]') as HTMLElement)?.focus();
        break;
      case 'delete-note':
        // Focus on first delete button
        (document.querySelector('[data-action="delete-note"]') as HTMLElement)?.focus();
        break;
      case 'play-note':
        // Focus on first play button
        (document.querySelector('[data-action="play-note"]') as HTMLElement)?.focus();
        break;
    }
  };

  useKeyboardShortcuts({
    enabled: preferences.keyboardShortcuts,
    shortcuts: [
      { key: 'n', description: 'New recording', action: 'start-recording', category: 'recording' },
      { key: 'Escape', description: 'Stop recording', action: 'stop-recording', category: 'recording' },
      { key: 's', description: 'Search notes', action: 'focus-search', category: 'navigation' },
      { key: 'f', description: 'Filter notes', action: 'focus-filter', category: 'navigation' },
      { key: 'h', description: 'Go home', action: 'go-home', category: 'navigation' },
      { key: '?', description: 'Show shortcuts', action: 'show-shortcuts', category: 'general' },
      { key: 't', description: 'Toggle theme', action: 'toggle-theme', category: 'general' },
      { key: 'v', description: 'Toggle voice', action: 'toggle-voice', category: 'general' },
      { key: 'Enter', description: 'Open note', action: 'open-note', category: 'editing' },
      { key: 'Delete', description: 'Delete note', action: 'delete-note', category: 'editing' },
      { key: 'e', description: 'Edit note', action: 'edit-note', category: 'editing' },
      { key: 'p', description: 'Play note', action: 'play-note', category: 'editing' },
    ],
    onShortcut: handleShortcutAction,
  });

  // Event handlers
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleDeleteNote = (note: Note) => {
    setDeletingNote(note);
  };

  const handleSaveNote = async (updatedNote: Partial<Note>) => {
    if (!editingNote) return;
    
    try {
      // Call the API to update the note
      await apiClient.updateNote(editingNote.id, updatedNote);
      setEditingNote(null);
      showToast('Note updated successfully', 'success');
      refetch();
    } catch (error) {
      console.error('Failed to update note:', error);
      showToast('Failed to update note', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingNote) return;
    
    try {
      // Call the API to delete the note
      await apiClient.deleteNote(deletingNote.id);
      setDeletingNote(null);
      showToast('Note deleted successfully', 'error');
      refetch();
    } catch (error) {
      console.error('Failed to delete note:', error);
      showToast('Failed to delete note', 'error');
    }
  };

  const handleSpeakNote = async (note: Note) => {
    if (!voiceEnabled) {
      showToast('Voice output is disabled', 'error');
      return;
    }

    setSpeakingNoteId(note.id);
    try {
      await speakNote(note);
      showToast('Voice output completed', 'success');
    } catch (error) {
      showToast('Failed to generate speech', 'error');
    } finally {
      setSpeakingNoteId(null);
    }
  };

  const handleTestVoice = async (testText?: string) => {
    try {
      await testVoice(testText);
      showToast('Voice test completed', 'success');
    } catch (error) {
      showToast('Voice test failed', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Don't render until preferences are loaded
  if (!preferencesLoaded) {
    return <NoteCardSkeletonGrid count={6} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-sm border-b" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center space-x-2">
              <Mic className="w-8 h-8" style={{ color: 'hsl(158 64% 52%)' }} />
              <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--foreground))' }}>Echo Notes</h1>
            </div>

            {/* Right side - Voice controls and settings */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoiceOutput}
                className="flex items-center space-x-2 cursor-pointer"
                style={{ 
                  color: voiceEnabled ? 'hsl(158 64% 52%)' : 'hsl(var(--muted-foreground))'
                }}
                aria-label={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <span className="hidden sm:inline">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="hover:opacity-80 cursor-pointer"
                style={{ color: 'hsl(var(--muted-foreground))' }}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        
        {/* Recorder Section */}
        <div className="mb-8">
          <Recorder />
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchAndFilter filters={filters} onFiltersChange={handleFiltersChange} notes={notes} />
        </div>

        {/* Notes Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <NoteCardSkeletonGrid count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>Failed to load notes</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <Mic className="w-16 h-16 mx-auto mb-4" />
                                  <h3 className="text-lg font-medium mb-2" style={{ color: 'hsl(var(--foreground))' }}>No notes yet</h3>
                                  <p style={{ color: 'hsl(var(--muted-foreground))' }}>
                    Start recording to create your first note
                  </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={(noteId: string) => {
                      const noteToDelete = notes.find(n => n.id === noteId);
                      if (noteToDelete) handleDeleteNote(noteToDelete);
                    }}
                    onSpeak={handleSpeakNote}
                    isSpeaking={speakingNoteId === note.id}
                    voiceEnabled={voiceEnabled}
                  />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="text-center py-8">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    className="w-full max-w-md"
                  >
                    {isFetchingNextPage ? 'Loading more notes...' : 'Load More Notes'}
                  </Button>
                </div>
              )}

              {/* End of notes indicator */}
              {!hasMore && notes.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>You&apos;ve reached the end of your notes</p>
                </div>
              )}

              {/* Infinite scroll trigger */}
              <div ref={loadingRef} className="h-4" />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 py-6 border-t" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <div className="w-full px-6">
          <div className="flex flex-col items-center justify-center text-sm space-y-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <div>
              © 2025 Josh Courtney. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
                                  <a 
                      href="https://joshcourtney.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-colors"
                    >
                My Site
              </a>
                                  <a 
                      href="https://github.com/clash402" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-colors"
                    >
                GitHub
              </a>
                                  <a 
                      href="https://www.linkedin.com/in/joshcourtney402/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-colors"
                    >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveNote}
          isLoading={false}
        />
      )}

      {deletingNote && (
        <DeleteConfirmDialog
          note={deletingNote}
          isOpen={!!deletingNote}
          onClose={() => setDeletingNote(null)}
          onConfirm={handleConfirmDelete}
          isLoading={false}
        />
      )}



      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          preferences={preferences}
          onPreferencesChange={updatePreferences}
          shortcuts={[
            { key: 'n', description: 'New recording', action: 'start-recording', category: 'recording' },
            { key: 'Escape', description: 'Stop recording', action: 'stop-recording', category: 'recording' },
            { key: 's', description: 'Search notes', action: 'focus-search', category: 'navigation' },
            { key: 'f', description: 'Filter notes', action: 'focus-filter', category: 'navigation' },
            { key: 'h', description: 'Go home', action: 'go-home', category: 'navigation' },
            { key: '?', description: 'Show shortcuts', action: 'show-shortcuts', category: 'general' },
            { key: 't', description: 'Toggle theme', action: 'toggle-theme', category: 'general' },
            { key: 'v', description: 'Toggle voice', action: 'toggle-voice', category: 'general' },
            { key: 'Enter', description: 'Open note', action: 'open-note', category: 'editing' },
            { key: 'Delete', description: 'Delete note', action: 'delete-note', category: 'editing' },
            { key: 'e', description: 'Edit note', action: 'edit-note', category: 'editing' },
            { key: 'p', description: 'Play note', action: 'play-note', category: 'editing' },
          ]}
          onShortcutAction={handleShortcutAction}
          onTestVoice={handleTestVoice}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
          isVisible={true}
        />
      )}
    </div>
  );
}
