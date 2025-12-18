import { useMutation, useQueryClient } from '@tanstack/react-query';
import { imageService } from '@/servises/image.service';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';

type MoveImagesPayload = {
  targetGalleryId: string;
  ids: string[];
};

export const useMoveImages = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  const mutation = useMutation({
    mutationFn: ({ targetGalleryId, ids }: MoveImagesPayload) => {
      if (!galleryId) {
        throw new Error('Source gallery ID is missing');
      }

      return imageService.moveImages(galleryId, targetGalleryId, ids);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', galleryId] });
      toast.success('Moving images is successful');
    },
    onError: (error: Error) => {
      toastMessage(error);
    },
  });

  return {
    moveImages: mutation.mutate,
    moveImagesAsync: mutation.mutateAsync,
    data: mutation.data,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
