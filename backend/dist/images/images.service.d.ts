import { PrismaService } from '../prisma/prisma.service';
export declare class ImagesService {
    private readonly prisma;
    private UPLOAD_ROOT;
    constructor(prisma: PrismaService);
    private ensureGalleryFolder;
    uploadImages(galleryId: string, files: Express.Multer.File[]): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
    deleteImages(ids: string[], galleryId: string): Promise<{
        deleted: string[];
    }>;
    getImagesByGallery(galleryId: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            createdAt: Date;
            path: string;
            galleryId: string;
            originalFilename: string;
        }[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    moveImages(ids: string[], targetGalleryId: string, galleryId: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
    copyImages(ids: string[], targetGalleryId: string, galleryId: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
}
