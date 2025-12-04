import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGallery } from '@/types/gallery';

export const useGalleries = () => {
  const { data, isLoading, isError, refetch } =  useQuery<IGallery[]>({
    queryKey: ['galleries'],
    queryFn: galleryService.getAllGalleries,
  });

  return { data, isLoading, isError, refetch }
};