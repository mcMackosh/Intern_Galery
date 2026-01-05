export interface Image {
  id: string;
  galleryId: string;
  path: string;
  originalFilename: string;
  createdAt: Date;
}

export interface GetImagesResponse {
  items: Record<string, Image[]>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UploadImageResponse extends Array<Image> {}
export interface MoveCopyImageResponse extends Array<Image> {}

export interface DeleteImagesResponse {
  deleted: string[];
}

export interface SelectedImagesDto {
  ids: string[];
}