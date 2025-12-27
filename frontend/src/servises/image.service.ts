import axios from 'axios';
import {
  Image,
  GetImagesResponse,
  UploadImageResponse,
  MoveCopyImageResponse,
  DeleteImagesResponse,
  DeleteImagesDto,
  MoveImagesDto,
} from '@/types/image';
import api from "@/shared/lib/api/api-interceptor";

class ImagesService {
  async getImagesByGallery(
    galleryId: string,
    page = 1,
    limit = 20,
    order: 'asc' | 'desc'
  ): Promise<GetImagesResponse> {
    const { data } = await api.get<GetImagesResponse>(
      `galleries/${galleryId}/image?page=${page}&limit=${limit}&order=${order}`
    );
    return data;
  }

  async uploadImages(galleryId: string, files: File[]): Promise<UploadImageResponse> {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const { data } = await api.post<UploadImageResponse>(
      `galleries/${galleryId}/image/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  }

  async deleteImages(galleryId: string, ids: string[]): Promise<DeleteImagesResponse> {
    const { data } = await api.delete<DeleteImagesResponse>(
      `galleries/${galleryId}/image`,
      { data: { ids } as DeleteImagesDto }
    );
    return data;
  }

  async moveImages(
    galleryId: string,
    targetGalleryId: string,
    ids: string[]
  ): Promise<MoveCopyImageResponse> {
    const { data } = await api.post<MoveCopyImageResponse>(
      `galleries/${galleryId}/image/move/${targetGalleryId}`,
      { ids } as MoveImagesDto
    );
    return data;
  }

  async copyImages(
    galleryId: string,
    targetGalleryId: string,
    ids: string[]
  ): Promise<MoveCopyImageResponse> {
    const { data } = await api.post<MoveCopyImageResponse>(
      `galleries/${galleryId}/image/copy/${targetGalleryId}`,
      { ids } as MoveImagesDto
    );
    return data;
  }
}

export const imageService = new ImagesService();
