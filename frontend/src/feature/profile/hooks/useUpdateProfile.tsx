import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/servises/profile.service';
import { IProfile, UpdateProfile } from '@/types/profile';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';

interface Context {
  prevProfile?: IProfile;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfile) => profileService.updateProfile(dto),
    onMutate: async (newData: UpdateProfile) => {
      await queryClient.cancelQueries({ queryKey: ['myProfile'] });

      const prevProfile = queryClient.getQueryData<IProfile>(['myProfile']);

      if (prevProfile) {
        queryClient.setQueryData(['myProfile'], {
          ...prevProfile,
          ...newData,
        });
      }

      return { prevProfile };
    },
    onError: (_err, _newData, context: Context | undefined) => {
      if (context?.prevProfile) {
        queryClient.setQueryData(['myProfile'], context.prevProfile);
      }
      toastMessage(_err);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
    },
  });
}
