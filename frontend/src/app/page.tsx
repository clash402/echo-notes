'use client';

import { useState } from 'react';
import { Recorder } from '@/components/Recorder';
import { NoteCard } from '@/components/NoteCard';
import { SearchAndFilter } from '@/components/SearchAndFilter';
import { EditNoteModal } from '@/components/EditNoteModal';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Toast, ToastType } from '@/components/Toast';
import { VoiceSettings } from '@/components/VoiceSettings';
import { useNotes } from '@/hooks/useNotes';
import { useVoiceOutput } from '@/hooks/useVoiceOutput';
import { Note, SearchFilters } from '@/types';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    sortBy: 'newest',
    tags: [],
  });

  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingNote, setDeletingNote] = useState<Note | null>(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [speakingNoteId, setSpeakingNoteId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const { 
    notes,
    total,
    isLoading,
    error,
    updateNote,
    deleteNote,
    isUpdating,
    isDeleting
  } = useNotes(filters);

  const {
    voiceSettings,
    updateVoiceSettings,
    speakNote,
    testVoice,
    isLoading: isVoiceLoading,
    isEnabled: voiceEnabled
  } = useVoiceOutput();

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
      await updateNote(editingNote.id, updatedNote);
      showToast('Note updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update note', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingNote) return;

    try {
      await deleteNote(deletingNote.id);
      showToast('Note deleted successfully!', 'error');
    } catch (error) {
      showToast('Failed to delete note', 'error');
    }
  };

  const handleSpeakNote = async (note: Note) => {
    setSpeakingNoteId(note.id);
    try {
      await speakNote(note);
    } catch (error) {
      showToast('Failed to read note aloud', 'error');
    } finally {
      setSpeakingNoteId(null);
    }
  };

  const handleTestVoice = async (text: string) => {
    try {
      await testVoice(text);
      showToast('Voice test completed!', 'success');
    } catch (error) {
      showToast('Voice test failed', 'error');
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Echo Notes</h1>
            <p className="text-gray-600">Transform your voice into organized notes with AI</p>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant={voiceEnabled ? "default" : "outline"}
              onClick={() => updateVoiceSettings({ enabled: !voiceEnabled })}
              className="flex items-center gap-2"
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  Voice Enabled
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  Voice Disabled
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowVoiceSettings(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Voice Settings
            </Button>
          </div>

          {/* Recorder */}
          <Recorder />

          {/* Search and Filter */}
          <SearchAndFilter filters={filters} onFiltersChange={handleFiltersChange} />

          {/* Notes Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {total} note{total !== 1 ? 's' : ''}
              </h2>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading notes...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load notes</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {filters.query || filters.tags.length > 0
                    ? 'No notes match your search criteria'
                    : 'No notes yet. Start recording to create your first note!'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={(noteId: string) => {
                      const note = notes.find(n => n.id === noteId);
                      if (note) handleDeleteNote(note);
                    }}
                    onSpeak={handleSpeakNote}
                    isSpeaking={speakingNoteId === note.id}
                    voiceEnabled={voiceEnabled}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditNoteModal
        note={editingNote}
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleSaveNote}
        isLoading={isUpdating}
      />

      <DeleteConfirmDialog
        note={deletingNote}
        isOpen={!!deletingNote}
        onClose={() => setDeletingNote(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      <VoiceSettings
        isOpen={showVoiceSettings}
        onClose={() => setShowVoiceSettings(false)}
        onSettingsChange={updateVoiceSettings}
        currentSettings={voiceSettings}
        onTestVoice={handleTestVoice}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
