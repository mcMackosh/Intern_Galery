import { useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGallery } from '@/types/gallery';
import { useParams, useRouter } from 'next/navigation';
import { toastMessage } from '@/shared/utils/tost';
import { toast } from 'sonner';

export function useDeleteGallery(galleryId?: string) {
    const queryClient = useQueryClient()
    const params = useParams()
    const router = useRouter()
    const id = galleryId || (params?.galleryId as string) || undefined;

    const { mutate: deleteGallery, isPending: isLoading } =useMutation({
        mutationFn: () => galleryService.deleteGallery(id as string),

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['galleries'] });
            const previous = queryClient.getQueryData<IGallery[]>(['galleries']);

            if (previous) {
                queryClient.setQueryData(
                    ['galleries'],
                    previous.filter((g) => g.id !== id)
                );
            }
            
            return { previous };
        },
        onSuccess: () => {
            toast.success('Gallery deleted successfully!');
        },
        onError: (_err, _newGallery, context: any) => {
            if (context?.previous)
                queryClient.setQueryData(['galleries'], context.previous);
            toastMessage(_err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['galleries'] });
            router.push(`/`);
        },
    });

    return { deleteGallery, isLoading };
}