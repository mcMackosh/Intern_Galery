import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class GalleryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createGallery(dto: CreateGalleryDto, creatorId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    getAllGalleries(userId: string): Promise<{
        role: import("prisma/__generated__").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }[]>;
    getGalleryInfoById(id: string, userId: string): Promise<{
        role: import("prisma/__generated__").$Enums.UserRole;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    updateGallery(galleryId: string, dto: UpdateGalleryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
    }>;
    deleteGallery(galleryId: string): Promise<{
        message: string;
    }>;
}
