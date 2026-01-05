import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGalleryListResponse } from '@/types/gallery';
import { useSearchParams } from 'next/navigation';


export const useGalleries = (page: number) => {
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ?? '';

  const queryKey = ['galleries', page, queryString];

  const query = useQuery<IGalleryListResponse, Error>({
    queryKey,
    queryFn: ({ signal }) =>
      galleryService.getAllGalleries(page, signal, queryString),
      placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  return {
    data: query.data?.data,
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
