import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GetGalleriesQueryDto } from './dto/gallery.search.options';
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
    getAllGalleries(userId: string, page: number, limit: number, query: GetGalleriesQueryDto): Promise<{
        data: {
            id: string;
            title: string;
            createdAt: Date;
            role: import("prisma/__generated__").$Enums.UserRole;
            imagesCount: number;
            images: string[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getGalleryInfoById(id: string, userId: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        role: import("prisma/__generated__").$Enums.UserRole;
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
