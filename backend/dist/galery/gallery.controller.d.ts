import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
export declare class GalleryController {
    private readonly galleryService;
    constructor(galleryService: GalleryService);
    getGallery(galleryId: string, userId: string): Promise<{
        role: import("prisma/__generated__").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    createGallery(userId: string, dto: CreateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    getAllGaleries(userId: string): Promise<{
        role: import("prisma/__generated__").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }[]>;
    updateGallery(galleryId: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    deleteGallery(galleryId: string): Promise<boolean>;
}
