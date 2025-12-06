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
exports.MembershipController = void 0;
const common_1 = require("@nestjs/common");
const membership_service_1 = require("./membership.service");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const authorized_decorator_1 = require("../auth/decorators/authorized.decorator");
const __generated__1 = require("../../prisma/__generated__/index.js");
let MembershipController = class MembershipController {
    membershipService;
    constructor(membershipService) {
        this.membershipService = membershipService;
    }
    findAll(galleryId) {
        return this.membershipService.getAllMemberships(galleryId);
    }
    createOrUpdate(body, galleryId, currentUserRole) {
        const targetRole = body.role ?? __generated__1.UserRole.REGULAR;
        return this.membershipService.createOrUpdateMembership(body.userId, galleryId, targetRole, currentUserRole);
    }
    remove(galleryId, userId, currentUserRole) {
        return this.membershipService.deleteMembership(galleryId, userId, currentUserRole);
    }
    removeMe(galleryId, userId, currentUserRole) {
        return this.membershipService.deleteMembership(galleryId, userId, currentUserRole);
    }
};
exports.MembershipController = MembershipController;
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'REGULAR', 'OWNER'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('galleryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "findAll", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER'),
    (0, common_1.Post)('create-or-update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('galleryId')),
    __param(2, (0, authorized_decorator_1.Authorized)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "createOrUpdate", null);
__decorate([
    (0, auth_decorator_1.Authorization)('ADMIN', 'OWNER'),
    (0, common_1.Delete)(':userId'),
    __param(0, (0, common_1.Param)('galleryId')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, authorized_decorator_1.Authorized)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "remove", null);
__decorate([
    (0, auth_decorator_1.Authorization)('OWNER'),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Param)('galleryId')),
    __param(1, (0, authorized_decorator_1.Authorized)('userId')),
    __param(2, (0, authorized_decorator_1.Authorized)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MembershipController.prototype, "removeMe", null);
exports.MembershipController = MembershipController = __decorate([
    (0, common_1.Controller)('gallery/:galleryId/members'),
    __metadata("design:paramtypes", [membership_service_1.MembershipService])
], MembershipController);
//# sourceMappingURL=membership.controller.js.map