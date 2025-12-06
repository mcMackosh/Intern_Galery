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