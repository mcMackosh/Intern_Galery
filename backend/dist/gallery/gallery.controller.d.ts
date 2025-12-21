import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GetGalleriesQueryDto } from './dto/gallery.search.options';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    getGallery(galleryId: string, userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        role: import("prisma/__generated__").$Enums.UserRole;
    }>;
    createGallery(userId: string, dto: CreateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    getAllGaleries(userId: string, page: number | undefined, limit: number | undefined, options: GetGalleriesQueryDto): Promise<{
        data: {
            id: string;
            title: string;
            createdAt: Date;
            role: import("prisma/__generated__").$Enums.UserRole;
            imagesCount: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateGallery(galleryId: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    deleteGallery(galleryId: string): Promise<boolean>;
}
