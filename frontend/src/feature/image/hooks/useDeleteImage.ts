import { imageService } from '@/servises/image.service';
import { toastMessage } from '@/shared/utils/tost';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export const useDeleteImages = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!ids || ids.length === 0) throw new Error('No image IDs provided');
      if (!galleryId) throw new Error('No image IDs provided');

      return imageService.deleteImages(galleryId, ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
      toast.success('Deleting images is successful');
    },
    onError: (error: Error) => {
      toastMessage(error);
    },
  });

  return {
    deleteImages: mutation.mutate,
    deleteImagesAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
