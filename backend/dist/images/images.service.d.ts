import { PrismaService } from '../prisma/prisma.service';
export declare class ImagesService {
    private readonly prisma;
    private readonly UPLOAD_ROOT;
    constructor(prisma: PrismaService);
    private ensureGalleryFolder;
    private toImageUrl;
    uploadImages(galleryId: string, files: Express.Multer.File[]): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        galleryId: string;
        originalFilename: string;
    }[]>;
    deleteImages(ids: string[], galleryId: string): Promise<{
        deleted: string[];
    }>;
    getImagesByGallery(galleryId: string, page?: number, limit?: number, order?: 'asc' | 'desc'): Promise<{
        items: Record<string, {
            path: string;
            id: string;
            createdAt: Date;
            galleryId: string;
            originalFilename: string;
        }[]>;
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    moveImages(ids: string[], targetGalleryId: string, galleryId: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        galleryId: string;
        originalFilename: string;
    }[]>;
    copyImages(ids: string[], targetGalleryId: string, galleryId: string): Promise<{
        path: string;
        id: string;
        createdAt: Date;
        galleryId: string;
        originalFilename: string;
    }[]>;
}
