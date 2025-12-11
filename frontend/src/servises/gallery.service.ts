import { TypeCreateGalleryScheme, TypeUpdateGalleryScheme } from "@/feature/gallery/schemes/gallery.shemes";
import api from "@/shared/lib/api/api-interceptor";
import { IGallery, IGalleryListResponse } from "@/types/gallery";
import { CONFIG } from "./config";

class GalleryService {
  public async getAllGalleries(page = 1, signal?: AbortSignal): Promise<IGalleryListResponse> {
    const {data} = await api.get<IGalleryListResponse>("/gallery", {
      params: { page, limit: CONFIG.limit_item_queary }, signal
    });
    return data;
  }

  public async createGallery(dto: TypeCreateGalleryScheme) {
    await api.post<IGallery>("/gallery", dto);
  }

  public async getGallery(galleryId: string) {
    const { data } = await api.get<IGallery>(`/gallery/${galleryId}`);
    return data;
  }

  public async updateGallery(galleryId: string, dto: TypeUpdateGalleryScheme) {
    await api.put<IGallery>(`/gallery/${galleryId}`, dto);
  }

  public async deleteGallery(galleryId: string) {
    await api.delete<boolean>(`/gallery/${galleryId}`);
  }
}

export const galleryService = new GalleryService();