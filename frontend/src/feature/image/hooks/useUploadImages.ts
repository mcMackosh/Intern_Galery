import { useMutation, useQueryClient } from '@tanstack/react-query';
import { imageService } from '@/servises/image.service';
import { UploadImageResponse } from '@/types/image';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';

export const useUploadImages = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  return useMutation<UploadImageResponse, Error, File[]>({
    mutationFn: (files: File[]) => {
      if (!galleryId) throw new Error('Gallery ID is missing');
      return imageService.uploadImages(galleryId, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images', galleryId] });
      toast.success('Upload is successful');
    },
    onError: (error: Error) => {
      toastMessage(error);
    },
  });
};