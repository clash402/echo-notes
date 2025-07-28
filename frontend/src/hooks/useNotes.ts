import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { SearchFilters, SearchResult } from '@/types';

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

  return {
    notes: searchResult.notes,
    total: searchResult.total,
    hasMore: searchResult.hasMore,
    isLoading,
    error,
    refetch,
    createNote,
    isCreating: createNoteMutation.isPending,
  };
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => apiClient.getNote(id),
    enabled: !!id,
  });
}; 