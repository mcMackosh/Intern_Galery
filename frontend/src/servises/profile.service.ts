import api from "@/shared/lib/api/api-interceptor";
import { UpdateProfile, IProfile } from "@/types/profile";

class ProfileService {
  async getProfile(): Promise<IProfile> {
    const { data } = await api.get<IProfile>("/profile");
    return data;
  }

  async updateProfile(data: UpdateProfile): Promise<void> {
    await api.put("/profile", data);
  }
};

export const profileService = new ProfileService();
