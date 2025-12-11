import { ImagesService } from './images.service';
import { DeleteImagesDto } from './dto/delete-images.dto';
import { MoveImagesDto } from './dto/move-images.dto';
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
    getByGallery(galleryId: string, page?: number, limit?: number): Promise<{
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
    deleteImages(body: DeleteImagesDto, galleryId: string): Promise<{
        deleted: string[];
    }>;
    moveImages(body: MoveImagesDto, targetGalleryId: string, galleryId: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
    copyImages(body: MoveImagesDto, targetGalleryId: string, galleryId: string): Promise<{
        id: string;
        createdAt: Date;
        path: string;
        galleryId: string;
        originalFilename: string;
    }[]>;
}
