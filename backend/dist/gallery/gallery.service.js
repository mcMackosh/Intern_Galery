"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const __generated__1 = require("../../prisma/__generated__/index.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let GalleryService = class GalleryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createGallery(dto, creatorId) {
        return this.prisma.gallery.create({
            data: {
                ...dto,
                memberships: {
                    create: {
                        userId: creatorId,
                        role: __generated__1.UserRole.OWNER,
                    },
                },
            },
        });
    }
    async getAllGalleries(userId, page, limit, query) {
        const { search, sortBy, orderBy, startDate, endDate, minImages, maxImages, } = query;
        const skip = (page - 1) * limit;
        const where = {
            memberships: {
                some: { userId },
            },
        };
        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        const galleries = await this.prisma.gallery.findMany({
            where,
            orderBy: {
                [sortBy]: orderBy,
            },
            include: {
                memberships: {
                    where: { userId },
                    select: { role: true },
                },
                _count: {
                    select: { images: true },
                },
            },
        });
        const filtered = galleries.filter(g => {
            const count = g._count.images;
            if (minImages !== undefined && count < minImages)
                return false;
            if (maxImages !== undefined && count > maxImages)
                return false;
            return true;
        });
        const paginated = filtered.slice(skip, skip + limit);
        return {
            data: paginated.map(g => ({
                id: g.id,
                title: g.title,
                createdAt: g.createdAt,
                role: g.memberships[0]?.role ?? null,
                imagesCount: g._count.images,
            })),
            meta: {
                total: filtered.length,
                page,
                limit,
                totalPages: Math.ceil(filtered.length / limit),
            },
        };
    }
    async getGalleryInfoById(id, userId) {
        const gallery = await this.prisma.gallery.findFirst({
            where: { id },
            include: {
                memberships: {
                    where: { userId },
                    select: { role: true },
                },
            },
        });
        if (!gallery) {
            throw new common_1.NotFoundException('Gallery not found');
        }
        return {
            id: gallery.id,
            title: gallery.title,
            createdAt: gallery.createdAt,
            role: gallery.memberships[0]?.role ?? null,
        };
    }
    async updateGallery(galleryId, dto) {
        return this.prisma.gallery.update({
            where: { id: galleryId },
            data: dto,
        });
    }
    async deleteGallery(galleryId) {
        const galleryFolder = path.join(process.cwd(), 'uploads', galleryId);
        await this.prisma.$transaction(async (tx) => {
            await tx.gallery.delete({
                where: { id: galleryId },
            });
            if (fs.existsSync(galleryFolder)) {
                await fs.promises.rm(galleryFolder, {
                    recursive: true,
                    force: true,
                });
            }
        });
        return { message: 'Gallery deleted successfully' };
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map