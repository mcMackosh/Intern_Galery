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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const images_service_1 = require("./images.service");
const delete_images_dto_1 = require("./dto/delete-images.dto");
const move_images_dto_1 = require("./dto/move-images.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = __importDefault(require("path"));
const extention_file_1 = require("./dto/extention.file");
let ImagesController = class ImagesController {
    imagesService;
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    async uploadFiles(galleryId, files) {
        if (!files || files.length === 0)
            throw new common_1.BadRequestException('No files provided');
        return this.imagesService.uploadImages(galleryId, files);
    }
    async getByGallery(galleryId, page = 1, limit = 20) {
        return this.imagesService.getImagesByGallery(galleryId, page, limit);
    }
    async deleteImages(body, galleryId) {
        if (!body?.ids || !Array.isArray(body.ids)) {
            throw new common_1.BadRequestException('ids array is required');
        }
        return this.imagesService.deleteImages(body.ids, galleryId);
    }
    async moveImages(body, targetGalleryId, galleryId) {
        if (!body?.ids || !Array.isArray(body.ids) || !targetGalleryId) {
            throw new common_1.BadRequestException('ids array and targetGalleryId are required');
        }
        console.log(galleryId, targetGalleryId, body);
        return this.imagesService.moveImages(body.ids, targetGalleryId, galleryId);
    }
    async copyImages(body, targetGalleryId, galleryId) {
        if (!body?.ids || !Array.isArray(body.ids) || !targetGalleryId) {
            throw new common_1.BadRequestException('ids array and targetGalleryId are required');
        }
        return this.imagesService.copyImages(body.ids, targetGalleryId, galleryId);
    }
};
exports.ImagesController = ImagesController;
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 20, {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname).toLowerCase();
            if (!extention_file_1.ALLOWED_EXTENSIONS.includes(ext)) {
                return cb(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('galleryId')),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "uploadFiles", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER', 'REGULAR'),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Param)('galleryId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "getByGallery", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER'),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('galleryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_images_dto_1.DeleteImagesDto, String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "deleteImages", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER'),
    (0, common_1.Post)('move/:targetGalleryId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('targetGalleryId')),
    __param(2, (0, common_1.Param)('galleryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [move_images_dto_1.MoveImagesDto, String, String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "moveImages", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER'),
    (0, common_1.Post)('copy/:targetGalleryId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('targetGalleryId')),
    __param(2, (0, common_1.Param)('galleryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [move_images_dto_1.MoveImagesDto, String, String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "copyImages", null);
exports.ImagesController = ImagesController = __decorate([
    (0, common_1.Controller)('galleries/:galleryId/image'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
//# sourceMappingURL=images.controller.js.map