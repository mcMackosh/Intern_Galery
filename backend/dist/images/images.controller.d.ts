import { ImagesService } from './images.service';
import { IdsImagesDto } from './dto/ids-images.dto';
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    uploadFiles(galleryId: string, files: Express.Multer.File[]): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
    getByGallery(galleryId: string, page: number, limit: number, order: 'asc' | 'desc'): Promise<{
        items: Record<string, {
            id: string;
            createdAt: Date;
            path: string;
            galleryId: string;
            originalFilename: string;
        }[]>;
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    deleteImages(body: IdsImagesDto, galleryId: string): Promise<{
        deleted: string[];
    }>;
    moveImages(body: IdsImagesDto, targetGalleryId: string, galleryId: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
    copyImages(body: IdsImagesDto, targetGalleryId: string, galleryId: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
}
