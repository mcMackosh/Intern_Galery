import { useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGallery } from '@/types/gallery';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { TypeUpdateGalleryScheme } from '../schemes/gallery.shemes';

export function useUpdateGallery(galleryId?: string) {
    const queryClient = useQueryClient();
    const params = useParams();
    
    const id = galleryId || (params?.galleryId as string) || undefined;
    const isListPage = Boolean(galleryId);
    const isSinglePage = !galleryId && Boolean(params?.galleryId);

    const { mutate: updateGallery, isPending: isLoading } = useMutation({
        mutationFn: (dto: TypeUpdateGalleryScheme) =>
            galleryService.updateGallery(id as string, dto),

        onMutate: async (newGalleryDto) => {
            
            if (isSinglePage) {
                await queryClient.cancelQueries({ queryKey: ['gallery', id] });

                const prevGallery = queryClient.getQueryData<IGallery>(['gallery', id]);

                if (prevGallery) {
                    queryClient.setQueryData<IGallery>(['gallery', id], {
                        ...prevGallery,
                        ...newGalleryDto,
                    });
                }

                return { prevGallery };
            }
            return {};
        },

        onError: (_err, _newGallery, context: any) => {
            if (isSinglePage && context?.prevGallery) {
                queryClient.setQueryData(['gallery', id], context.prevGallery);
            }
            toastMessage(_err);
        },

        onSuccess: () => {
            if (isSinglePage) {
                queryClient.invalidateQueries({ queryKey: ['gallery', id] });
            }

            if (isListPage) {
                queryClient.invalidateQueries({ queryKey: ['galleries'] });
            }

            toast.success('Gallery updated successfully!');
        }
    });

    return { updateGallery, isLoading };
}
