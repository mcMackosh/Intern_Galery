import { useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { IGallery } from '@/types/gallery';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { UserRole } from '@/types/membership';

export function useCreateGallery() {
    const queryClient = useQueryClient()

    const { mutate: createGallery, isPending: isLoading } = useMutation({
        mutationFn: galleryService.createGallery,

        onMutate: async (newGallery) => {
            await queryClient.cancelQueries({ queryKey: ['galleries'] });
            const previous = queryClient.getQueryData<IGallery[]>(['galleries']);

            const optimistic: IGallery = {
                id: 'temp-' + Math.random().toString(36).slice(2, 9),
                title: newGallery.title,
                description: newGallery.description,
                role: UserRole.ADMIN,
            };

            queryClient.setQueryData<IGallery[]>(['galleries'], (old = []) => [optimistic, ...old]);

            return { previous };
        },
        onSuccess: () => {
            toast.success(`Gallery created successfully!`);
        },
        onError: (_err, _newGallery, context: any) => {
            if (context?.previous)
                queryClient.setQueryData(["galleries"], context.previous);

            toastMessage(_err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['galleries'] });
        },
    })

    return { createGallery, isLoading };
}
