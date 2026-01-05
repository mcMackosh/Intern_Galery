import { UserRole } from "./membership";

export interface IGallery {
  id: string;
  title: string;
  description: string;
  role: UserRole;
  images: string[];
}

export interface IGalleryListResponse {
  data: IGallery[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type GallerySortBy = 'title' | 'createdAt' | '';
export type GalleryOrderBy = 'asc' | 'desc' | '';