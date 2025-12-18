import { UserRole } from "./membership";

export interface IGallery {
  id: string;
  title: string;
  description: string;
  role: UserRole;
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

export interface GalleryFilters {
  search?: string;
  sortBy?: 'title' | 'createdAt';
  startDate?: Date | null;
  endDate?: Date | null;
  minImages?: number;
  maxImages?: number;
}