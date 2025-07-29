import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { SearchFilters, SearchResult, Note } from '@/types';

export const useNotes = (filters?: SearchFilters, page: number = 1, limit: number = 10) => {
  const queryClient = useQueryClient();

  const {
    data: searchResult = { notes: [], total: 0, hasMore: false },
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes', filters, page, limit],
    queryFn: () => apiClient.getNotes(filters, page, limit),
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

// Hook for infinite scrolling
export const useInfiniteNotes = (filters?: SearchFilters, limit: number = 10) => {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['infinite-notes', filters, limit],
    queryFn: ({ pageParam = 1 }) => apiClient.getNotes(filters, pageParam, limit),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const allNotes = data?.pages.flatMap(page => page.notes) || [];
  const total = data?.pages[0]?.total || 0;

  return {
    notes: allNotes,
    total,
    hasMore: hasNextPage,
    isLoading,
    error,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  };
};

export const useNote = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => apiClient.getNote(id),
    enabled: !!id,
  });
}; 