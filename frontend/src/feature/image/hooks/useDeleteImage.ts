import { imageService } from '@/servises/image.service';
import { toastMessage } from '@/shared/utils/tost';
import { SelectedImagesDto } from '@/types/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

export const useDeleteImages = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  const mutation = useMutation({
    mutationFn: async (data: SelectedImagesDto) => {
      if (!data.ids || data.ids.length === 0) throw new Error('No image IDs provided');
      if (!galleryId) throw new Error('No image IDs provided');

      return imageService.deleteImages(galleryId, data);
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
