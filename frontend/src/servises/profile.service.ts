
import api from "@/shared/lib/api/api-interceptor";
import { UpdateProfile, IProfile, ResetPasswordDtoByToken } from "@/types/profile";

class ProfileService {
  async getProfile(): Promise<IProfile> {
    const { data } = await api.get<IProfile>("/profile");
    return data;
  }

  async updateProfile(data: UpdateProfile): Promise<void> {
    await api.patch("/profile", data);
  }

  async resetPassword(data: ResetPasswordDtoByToken): Promise<void> {
    await api.patch("/profile/change-password", data);
  }
};

export const profileService = new ProfileService();
