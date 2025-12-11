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
const util_1 = require("util");
const mkdir = (0, util_1.promisify)(fs.mkdir);
const unlink = (0, util_1.promisify)(fs.unlink);
const copyFile = (0, util_1.promisify)(fs.copyFile);
const access = (0, util_1.promisify)(fs.access);
const fs_extra_1 = require("fs-extra");
const crypto_1 = require("crypto");
let ImagesService = class ImagesService {
    prisma;
    UPLOAD_ROOT = path.join(process.cwd(), 'uploads');
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureGalleryFolder(galleryId) {
        const folder = path.join(this.UPLOAD_ROOT, galleryId);
        try {
            await access(folder);
        }
        catch (e) {
            await mkdir(folder, { recursive: true });
        }
        return folder;
    }
    async uploadImages(galleryId, files) {
        return this.prisma.$transaction(async (tx) => {
            const createdImages = [];
            const galleryFolder = await this.ensureGalleryFolder(galleryId);
            for (const file of files) {
                const fileGuid = (0, crypto_1.randomUUID)();
                const relativePath = path.join(galleryId, `${fileGuid}_${file.originalname}`);
                let image;
                try {
                    image = await tx.image.create({
                        data: {
                            path: relativePath,
                            originalFilename: file.originalname,
                            galleryId,
                        },
                    });
                }
                catch (err) {
                    throw new common_1.InternalServerErrorException(`Failed to save file: ${file.originalname}`);
                }
                const fullFilePath = path.join(galleryFolder, `${fileGuid}_${file.originalname}`);
                try {
                    await fs.promises.writeFile(fullFilePath, file.buffer);
                }
                catch (err) {
                    throw new common_1.InternalServerErrorException(`Failed to save file: ${file.originalname} to disk`);
                }
                createdImages.push(image);
            }
            return createdImages;
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
            for (const img of images) {
                const fullPath = path.join(this.UPLOAD_ROOT, img.path);
                try {
                    await unlink(fullPath);
                }
                catch (err) {
                    throw new common_1.InternalServerErrorException(`Failed to delete file: ${img.originalFilename}`);
                }
            }
            await tx.image.deleteMany({
                where: {
                    id: { in: ids }
                },
            });
            return { deleted: ids };
        });
    }
    async getImagesByGallery(galleryId, page = 1, limit = 20) {
        try {
            const skip = (page - 1) * limit;
            const [items, total] = await Promise.all([
                this.prisma.image.findMany({
                    where: { galleryId },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit,
                }),
                this.prisma.image.count({ where: { galleryId } }),
            ]);
            return {
                items,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Problem with get image');
        }
    }
    async moveImages(ids, targetGalleryId, galleryId) {
        return this.prisma.$transaction(async (tx) => {
            let images;
            try {
                images = await tx.image.findMany({
                    where: { id: { in: ids }, galleryId },
                });
            }
            catch {
                throw new common_1.InternalServerErrorException(`Cannot move file`);
            }
            await this.ensureGalleryFolder(targetGalleryId);
            const updated = [];
            for (const img of images) {
                const src = path.join(this.UPLOAD_ROOT, img.path);
                const filename = path.basename(img.path);
                const destRel = path.join(targetGalleryId, filename);
                const dest = path.join(this.UPLOAD_ROOT, destRel);
                try {
                    await (0, fs_extra_1.move)(src, dest, { overwrite: true });
                }
                catch {
                    throw new common_1.InternalServerErrorException(`Cannot move file from ${src} to ${dest}`);
                }
                let updatedImg;
                try {
                    updatedImg = await tx.image.update({
                        where: { id: img.id },
                        data: { galleryId: targetGalleryId, path: destRel },
                    });
                }
                catch {
                    throw new common_1.InternalServerErrorException(`Cannot move file from ${src} to ${dest}`);
                }
                updated.push(updatedImg);
            }
            return updated;
        });
    }
    async copyImages(ids, targetGalleryId, galleryId) {
        return this.prisma.$transaction(async (tx) => {
            const images = await tx.image.findMany({
                where: { id: { in: ids }, galleryId },
            });
            await this.ensureGalleryFolder(targetGalleryId);
            const created = [];
            for (const img of images) {
                const src = path.join(this.UPLOAD_ROOT, img.path);
                const fileGuid = (0, crypto_1.randomUUID)();
                const destRel = path.join(targetGalleryId, `${fileGuid}_${img.originalFilename}`);
                const dest = path.join(this.UPLOAD_ROOT, destRel);
                try {
                    await copyFile(src, dest);
                }
                catch (err) {
                    throw new common_1.InternalServerErrorException(`Cannot copy file from ${src} to ${dest}: ${err.message}`);
                }
                const newImage = await tx.image.create({
                    data: {
                        path: destRel,
                        originalFilename: img.originalFilename,
                        galleryId: targetGalleryId,
                    },
                });
                created.push(newImage);
            }
            return created;
        });
    }
};
exports.ImagesService = ImagesService;
exports.ImagesService = ImagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImagesService);
//# sourceMappingURL=images.service.js.map