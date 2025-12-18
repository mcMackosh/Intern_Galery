import { SERVER_URL } from '@/env';
import { imageService } from '@/servises/image.service';
import { GetImagesResponse, Image } from '@/types/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export const useGetImagesInfinite = (limit = 20) => {
  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;

  return useInfiniteQuery<GetImagesResponse, Error>({
    queryKey: ['images', galleryId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!galleryId) throw new Error('Gallery ID is missing');
      const data = await imageService.getImagesByGallery(galleryId, pageParam as number, limit);
  

      const items: Image[] = data.items.map(img => ({
        ...img,
        path: `${SERVER_URL}/uploads/${img.path}`,
      }));

      return { ...data, items };
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.items.length < limit) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!galleryId,
    refetchOnWindowFocus: false,
  });
};
