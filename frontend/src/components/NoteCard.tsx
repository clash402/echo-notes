'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Edit, Trash2, Tag } from 'lucide-react';
import { Note } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onPlay?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
}

export const NoteCard = ({ note, onPlay, onEdit, onDelete }: NoteCardProps) => {
  const handlePlay = () => {
    if (onPlay && note.audioUrl) {
      onPlay(note);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {note.title}
          </CardTitle>
          <div className="flex space-x-2">
            {note.audioUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePlay}
                className="text-blue-600 hover:text-blue-700"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="text-gray-600 hover:text-gray-700"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 line-clamp-3 mb-3">
          {note.content}
        </p>
        
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Tag className="w-3 h-3 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {note.transcript && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-600 mb-1">Transcript</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {note.transcript}
            </p>
          </div>
        )}
        
        {note.summary && (
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Summary</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {note.summary}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 