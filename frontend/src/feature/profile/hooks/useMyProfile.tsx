import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/servises/profile.service';
import { IProfile } from '@/types/profile';

export function useMyProfile() {
  return useQuery<IProfile, Error>({
    queryKey: ['myProfile'],
    queryFn: () => profileService.getProfile(),
  });
}
