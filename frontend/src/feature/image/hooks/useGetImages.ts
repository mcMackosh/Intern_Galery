import { imageService } from '@/servises/image.service';
import { GetImagesResponse, Image } from '@/types/image';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const useGetImages = (page = 1, limit = 20) => {

  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  return useQuery<GetImagesResponse, Error>({
    queryKey: ['images', galleryId, page, limit],
    queryFn: async () => {
      if (!galleryId) throw new Error('Gallery ID is missing');

      const data = await imageService.getImagesByGallery(galleryId, page, limit);

      const imagesWithFullPath: Image[] = data.items.map(img => ({
        ...img,
        path: `${process.env.NEXT_PUBLIC_SERVER_URL}/uploads/${img.path}`,
      }));

      return { ...data, imagesWithFullPath };
    },
    placeholderData: keepPreviousData,
    enabled: !!galleryId,
  })
};