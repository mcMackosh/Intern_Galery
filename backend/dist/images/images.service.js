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
exports.ImagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const fs_extra_1 = require("fs-extra");
let ImagesService = class ImagesService {
    prisma;
    UPLOAD_ROOT = path.join(process.cwd(), 'uploads');
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureGalleryFolder(galleryId) {
        const folder = path.join(this.UPLOAD_ROOT, galleryId);
        await fs.promises.mkdir(folder, { recursive: true });
        return folder;
    }
    toImageUrl(filePath) {
        return path.posix.join(...filePath.split(path.sep));
    }
    async uploadImages(galleryId, files) {
        return this.prisma.$transaction(async (tx) => {
            const galleryFolder = await this.ensureGalleryFolder(galleryId);
            const createdImages = [];
            for (const file of files) {
                const fileGuid = (0, crypto_1.randomUUID)();
                const filename = `${fileGuid}_${file.originalname}`;
                const relativePath = path.join(galleryId, filename);
                const fullPath = path.join(galleryFolder, filename);
                const image = await tx.image.create({
                    data: {
                        path: relativePath,
                        originalFilename: file.originalname,
                        galleryId,
                    },
                });
                await fs.promises.writeFile(fullPath, file.buffer);
                createdImages.push(image);
            }
            return createdImages.map(img => ({
                ...img,
                path: this.toImageUrl(img.path),
            }));
        });
    }
    async deleteImages(ids, galleryId) {
        return this.prisma.$transaction(async (tx) => {
            const images = await tx.image.findMany({
                where: {
                    id: { in: ids },
                    galleryId,
                },
            });
            if (images.length !== ids.length) {
                throw new common_1.ForbiddenException('Some images do not belong to this gallery');
            }
            await tx.image.deleteMany({
                where: { id: { in: ids } },
            });
            for (const img of images) {
                const fullPath = path.join(this.UPLOAD_ROOT, img.path);
                await fs.promises.unlink(fullPath);
            }
            return { deleted: ids };
        });
    }
    async getImagesByGallery(galleryId, page = 1, limit = 20, order = 'desc') {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.image.findMany({
                where: { galleryId },
                orderBy: { createdAt: order },
                skip,
                take: limit,
            }),
            this.prisma.image.count({ where: { galleryId } }),
        ]);
        const mapped = items.map(item => ({
            ...item,
            path: this.toImageUrl(item.path),
        }));
        const grouped = mapped.reduce((acc, item) => {
            const key = item.createdAt.toISOString().split('T')[0];
            acc[key] ??= [];
            acc[key].push(item);
            return acc;
        }, {});
        return {
            items: grouped,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async moveImages(ids, targetGalleryId, galleryId) {
        return this.prisma.$transaction(async (tx) => {
            const images = await tx.image.findMany({
                where: { id: { in: ids }, galleryId },
            });
            if (images.length !== ids.length) {
                throw new common_1.ForbiddenException('Some images do not belong to this gallery');
            }
            await this.ensureGalleryFolder(targetGalleryId);
            const updated = [];
            for (const img of images) {
                const filename = path.basename(img.path);
                const src = path.join(this.UPLOAD_ROOT, img.path);
                const destRel = path.join(targetGalleryId, filename);
                const dest = path.join(this.UPLOAD_ROOT, destRel);
                await (0, fs_extra_1.move)(src, dest, { overwrite: true });
                const updatedImg = await tx.image.update({
                    where: { id: img.id },
                    data: {
                        galleryId: targetGalleryId,
                        path: destRel,
                    },
                });
                updated.push(updatedImg);
            }
            return updated.map(img => ({
                ...img,
                path: this.toImageUrl(img.path),
            }));
        });
    }
    async copyImages(ids, targetGalleryId, galleryId) {
        return this.prisma.$transaction(async (tx) => {
            const images = await tx.image.findMany({
                where: { id: { in: ids }, galleryId },
            });
            if (images.length !== ids.length) {
                throw new common_1.ForbiddenException('Some images do not belong to this gallery');
            }
            await this.ensureGalleryFolder(targetGalleryId);
            const created = [];
            for (const img of images) {
                const fileGuid = (0, crypto_1.randomUUID)();
                const filename = `${fileGuid}_${img.originalFilename}`;
                const src = path.join(this.UPLOAD_ROOT, img.path);
                const destRel = path.join(targetGalleryId, filename);
                const dest = path.join(this.UPLOAD_ROOT, destRel);
                await fs.promises.copyFile(src, dest);
                const newImage = await tx.image.create({
                    data: {
                        path: destRel,
                        originalFilename: img.originalFilename,
                        galleryId: targetGalleryId,
                    },
                });
                created.push(newImage);
            }
            return created.map(img => ({
                ...img,
                path: this.toImageUrl(img.path),
            }));
        });
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagesService);
//# sourceMappingURL=images.service.js.map