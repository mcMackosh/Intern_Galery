import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGallery } from '@/types/gallery';
import { useParams } from 'next/navigation';

export const useOneGallery = (galleryId?: string) => {
    const params = useParams();
    const id = galleryId || params?.galleryId as string ||  undefined;
    console.log(galleryId)
    const { data: gallery, isLoading } = useQuery<IGallery>({
        queryKey: ['gallery', id],
        queryFn: () => galleryService.getGallery(id as string),
    });

    return { gallery, isLoading}
};
