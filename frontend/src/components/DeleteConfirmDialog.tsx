'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note } from '@/types';

interface DeleteConfirmDialogProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
}

export const DeleteConfirmDialog = ({ 
  note, 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: DeleteConfirmDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Note</h3>
            <p className="text-sm text-gray-600">This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>&ldquo;{note.title}&rdquo;</strong>? 
            This will permanently remove the note and all its associated data.
          </p>
          
          {note.audioUrl && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This will also delete the associated audio file.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className='cursor-pointer'
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isLoading ? (
              'Deleting...'
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Note
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}; 