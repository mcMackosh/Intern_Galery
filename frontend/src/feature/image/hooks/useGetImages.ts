import { SERVER_URL } from '@/env';
import { imageService } from '@/servises/image.service';
import { GetImagesResponse, Image } from '@/types/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

export const useGetImagesInfinite = (limit = 20, sort: 'dateAsc' | 'dateDesc' = 'dateDesc') => {
  const params = useParams();
  const galleryId = params?.galleryId as string | undefined;
  const order = sort === 'dateAsc' ? 'asc' : 'desc';

  return useInfiniteQuery<GetImagesResponse, Error>({
    queryKey: ['images', galleryId, order],
    queryFn: async ({ pageParam = 1 }) => {
      if (!galleryId) throw new Error('Gallery ID is missing');

      const data = await imageService.getImagesByGallery(galleryId, pageParam as number, limit, order);

      return { ...data};
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.totalPages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    enabled: !!galleryId,
    refetchOnWindowFocus: false,
  });
};
