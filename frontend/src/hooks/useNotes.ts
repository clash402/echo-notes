import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export const useNotes = () => {
  const queryClient = useQueryClient();

  const {
    data: notes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes'],
    queryFn: apiClient.getNotes,
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
  }) => {
    return createNoteMutation.mutateAsync(noteData);
  };

  return {
    notes,
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