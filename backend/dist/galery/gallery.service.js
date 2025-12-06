"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const __generated__1 = require("../../prisma/__generated__/index.js");
let GalleryService = class GalleryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createGallery(dto, creatorId) {
        try {
            return await this.prisma.gallery.create({
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
        catch {
            throw new common_1.InternalServerErrorException('Failed to create gallery');
        }
    }
    async getAllGalleries(userId, page, limit) {
        try {
            const skip = (page - 1) * limit;
            const galleries = await this.prisma.gallery.findMany({
                where: {
                    memberships: {
                        some: { userId },
                    },
                },
                include: {
                    memberships: {
                        where: { userId },
                        select: { role: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            });
            const totalCount = await this.prisma.gallery.count({
                where: {
                    memberships: {
                        some: { userId },
                    },
                },
            });
            const formattedGalleries = galleries.map(gallery => {
                const role = gallery.memberships[0]?.role || null;
                const { memberships, ...galleryWithoutMemberships } = gallery;
                return {
                    ...galleryWithoutMemberships,
                    role,
                };
            });
            return {
                data: formattedGalleries,
                meta: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit),
                },
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to fetch galleries');
        }
    }
    async getGalleryInfoById(id, userId) {
        try {
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
            const role = gallery.memberships[0]?.role || null;
            const { memberships, ...galleryWithoutMemberships } = gallery;
            return {
                ...galleryWithoutMemberships,
                role
            };
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to fetch gallery');
        }
    }
    async updateGallery(galleryId, dto) {
        try {
            return await this.prisma.gallery.update({
                where: { id: galleryId },
                data: { ...dto },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to update gallery');
        }
    }
    async deleteGallery(galleryId) {
        try {
            await this.prisma.gallery.delete({
                where: { id: galleryId },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to delete gallery');
        }
        return { message: 'Gallery deleted successfully' };
    }
};
exports.GalleryService = GalleryService;
exports.GalleryService = GalleryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleryService);
//# sourceMappingURL=gallery.service.js.map