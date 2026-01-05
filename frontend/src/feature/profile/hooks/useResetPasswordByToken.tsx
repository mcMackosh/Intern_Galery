import { useMutation } from '@tanstack/react-query';
import { profileService } from '@/servises/profile.service';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { ResetPasswordDtoByToken } from '@/types/profile';

export function useResetPasswordByToken() {
  return useMutation({
    mutationFn: (dto: ResetPasswordDtoByToken) => profileService.resetPassword(dto),
    onError: (err) => {
      toastMessage(err);
    },
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
  });
}
