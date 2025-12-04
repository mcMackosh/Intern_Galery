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
exports.MembershipService = void 0;
const common_1 = require("@nestjs/common");
const __generated__1 = require("../../prisma/__generated__/index.js");
const prisma_service_1 = require("../prisma/prisma.service");
let MembershipService = class MembershipService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrUpdateMembership(userId, galleryId, role = __generated__1.UserRole.REGULAR) {
        let existing = null;
        try {
            existing = await this.prisma.membership.findUnique({
                where: { galleryId_userId: { galleryId, userId } },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to check existing membership');
        }
        if (existing) {
            if (existing.role === __generated__1.UserRole.ADMIN && role === __generated__1.UserRole.REGULAR) {
                const adminCount = await this.prisma.membership.count({
                    where: { galleryId, role: __generated__1.UserRole.ADMIN },
                });
                if (adminCount <= 1) {
                    throw new common_1.BadRequestException('Gallery must have at least one admin');
                }
            }
            try {
                return await this.prisma.membership.update({
                    where: { galleryId_userId: { galleryId, userId } },
                    data: { role },
                });
            }
            catch {
                throw new common_1.InternalServerErrorException('Failed to update membership');
            }
        }
        try {
            return await this.prisma.membership.create({
                data: { userId, galleryId, role },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to create membership');
        }
    }
    async getAllMemberships(galleryId) {
        try {
            const memberships = await this.prisma.membership.findMany({
                where: { galleryId },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });
            return memberships.map((m) => ({
                id: m.user.id,
                firstName: m.user.firstName,
                lastName: m.user.lastName,
                email: m.user.email,
                role: m.role,
            }));
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to fetch memberships');
        }
    }
    async deleteMembership(galleryId, userId) {
        const membership = await this.prisma.membership.findUnique({
            where: { galleryId_userId: { galleryId, userId } },
        });
        if (!membership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        if (membership.role === __generated__1.UserRole.ADMIN) {
            const adminCount = await this.prisma.membership.count({
                where: { galleryId, role: __generated__1.UserRole.ADMIN },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException('Cannot delete the last admin of the gallery');
            }
        }
        try {
            await this.prisma.membership.delete({
                where: { galleryId_userId: { galleryId, userId } },
            });
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to delete membership');
        }
        return true;
    }
};
exports.MembershipService = MembershipService;
exports.MembershipService = MembershipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipService);
//# sourceMappingURL=membership.service.js.map