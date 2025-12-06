import { useQuery, UseQueryOptions, keepPreviousData } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGalleryListResponse } from '@/types/gallery';


export const useGalleries = (page: number) => {
  const options: UseQueryOptions<IGalleryListResponse, Error> = {
    queryKey: ['galleries', page],
    queryFn: () => galleryService.getAllGalleries(page),
    placeholderData: keepPreviousData,
    staleTime: 5000
  };

  const query = useQuery(options);

  return {
    data: query.data?.data,
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
