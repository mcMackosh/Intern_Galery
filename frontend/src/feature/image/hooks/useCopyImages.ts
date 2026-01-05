import { useMutation, useQueryClient } from '@tanstack/react-query';
import { imageService } from '@/servises/image.service';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { SelectedImagesDto } from '@/types/image';

type CopyImagesPayload = {
  targetGalleryId: string;
  ids: SelectedImagesDto;
};

export const useCopyImages = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  const mutation = useMutation({
    mutationFn: ({ targetGalleryId, ids }: CopyImagesPayload) => {
      if (!galleryId) {
        throw new Error('Source gallery ID is missing');
      }

      return imageService.copyImages(galleryId, targetGalleryId, ids);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', galleryId] });
      toast.success('Copy images is successful');
    },
    onError: (error: Error) => {
      toastMessage(error);
    },
  });

  return {
    copyImages: mutation.mutate,
    copyImagesAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
