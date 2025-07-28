import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { SearchFilters, SearchResult, Note } from '@/types';

export const useNotes = (filters?: SearchFilters) => {
  const queryClient = useQueryClient();

  const {
    data: searchResult = { notes: [], total: 0, hasMore: false },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes', filters],
    queryFn: () => apiClient.getNotes(filters),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createNoteMutation = useMutation({
    mutationFn: apiClient.saveNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Note> }) =>
      apiClient.updateNote(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const createNote = async (noteData: {
    title: string;
    content: string;
    audioUrl?: string;
    transcript?: string;
    summary?: string;
    tags?: string[];
  }) => {
    return createNoteMutation.mutateAsync(noteData);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    return updateNoteMutation.mutateAsync({ id, updates });
  };

  const deleteNote = async (id: string) => {
    return deleteNoteMutation.mutateAsync(id);
  };

  return {
    notes: searchResult.notes,
    total: searchResult.total,
    hasMore: searchResult.hasMore,
    isLoading,
    error,
    refetch,
    createNote,
    updateNote,
    deleteNote,
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
  };
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => apiClient.getNote(id),
    enabled: !!id,
  });
}; 