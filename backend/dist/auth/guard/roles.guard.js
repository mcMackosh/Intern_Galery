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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const prisma_service_1 = require("../../prisma/prisma.service");
const __generated__1 = require("../../../prisma/__generated__/index.js");
let RolesGuard = class RolesGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles)
            return true;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const galleryId = request.params.galleryId;
        if (!user || !user.userId || !galleryId) {
            throw new common_1.ForbiddenException('User or gallery ID not found');
        }
        const membership = await this.prisma.membership.findFirst({
            where: { userId: user.userId, galleryId },
        });
        if (!membership) {
            throw new common_1.ForbiddenException('User is not a member of the gallery');
        }
        const currentRole = membership.role;
        request.galleryRole = currentRole;
        if (currentRole === __generated__1.UserRole.OWNER) {
            return true;
        }
        const endpointAllows = requiredRoles.includes(currentRole);
        if (!endpointAllows) {
            throw new common_1.ForbiddenException('Not enough permissions');
        }
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map