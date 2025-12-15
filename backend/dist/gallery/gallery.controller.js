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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryController = void 0;
const common_1 = require("@nestjs/common");
const gallery_service_1 = require("./gallery.service");
const create_gallery_dto_1 = require("./dto/create-gallery.dto");
const authorized_decorator_1 = require("../auth/decorators/authorized.decorator");
const update_gallery_dto_1 = require("./dto/update-gallery.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
let GalleryController = class GalleryController {
    galleryService;
    constructor(galleryService) {
        this.galleryService = galleryService;
    }
    async getGallery(galleryId, userId) {
        const gallery = await this.galleryService.getGalleryInfoById(galleryId, userId);
        return gallery;
    }
    async createGallery(userId, dto) {
        const gallery = await this.galleryService.createGallery(dto, userId);
        return gallery;
    }
    async getAllGaleries(userId, page = 1, limit = 3) {
        const galeries = await this.galleryService.getAllGalleries(userId, page, limit);
        return galeries;
    }
    async updateGallery(galleryId, dto) {
        const gallery = await this.galleryService.updateGallery(galleryId, dto);
        return gallery;
    }
    async deleteGallery(galleryId) {
        await this.galleryService.deleteGallery(galleryId);
        return true;
    }
};
exports.GalleryController = GalleryController;
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER', 'REGULAR'),
    (0, common_1.Get)('/:galleryId'),
    __param(0, (0, common_1.Param)('galleryId')),
    __param(1, (0, authorized_decorator_1.Authorized)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getGallery", null);
__decorate([
    (0, auth_decorator_1.Authorization)(),
    (0, common_1.Post)(),
    __param(0, (0, authorized_decorator_1.Authorized)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_gallery_dto_1.CreateGalleryDto]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "createGallery", null);
__decorate([
    (0, auth_decorator_1.Authorization)(),
    (0, common_1.Get)(),
    __param(0, (0, authorized_decorator_1.Authorized)('userId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "getAllGaleries", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER'),
    (0, common_1.Put)(':galleryId'),
    __param(0, (0, common_1.Param)('galleryId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_gallery_dto_1.UpdateGalleryDto]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "updateGallery", null);
__decorate([
    (0, auth_decorator_1.Authorization)('OWNER'),
    (0, common_1.Delete)(':galleryId'),
    __param(0, (0, common_1.Param)('galleryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GalleryController.prototype, "deleteGallery", null);
exports.GalleryController = GalleryController = __decorate([
    (0, common_1.Controller)('gallery'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService])
], GalleryController);
//# sourceMappingURL=gallery.controller.js.map