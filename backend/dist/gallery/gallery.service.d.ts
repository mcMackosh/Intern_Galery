import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
            role: import("prisma/__generated__").$Enums.UserRole;
            imagesCount: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
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
