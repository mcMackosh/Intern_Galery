import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Membership, UserRole } from 'prisma/__generated__';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MembershipService {
    constructor(private prisma: PrismaService) { }

    async createOrUpdateMembership(
        userId: string,
        galleryId: string,
        role: UserRole = UserRole.REGULAR,
    ) {
        let existing: Membership | null = null;

        try {
            existing = await this.prisma.membership.findUnique({
                where: { galleryId_userId: { galleryId, userId } },
            });
        } catch {
            throw new InternalServerErrorException('Failed to check existing membership');
        }

        if (existing) {
            if (existing.role === UserRole.ADMIN && role === UserRole.REGULAR) {
                const adminCount = await this.prisma.membership.count({
                    where: { galleryId, role: UserRole.ADMIN },
                });

                if (adminCount <= 1) {
                    throw new BadRequestException('Gallery must have at least one admin');
                }
            }

            try {
                return await this.prisma.membership.update({
                    where: { galleryId_userId: { galleryId, userId } },
                    data: { role },
                });
            } catch {
                throw new InternalServerErrorException('Failed to update membership');
            }
        }

        try {
            return await this.prisma.membership.create({
                data: { userId, galleryId, role },
            });
        } catch {
            throw new InternalServerErrorException('Failed to create membership');
        }
    }

    async getAllMemberships(galleryId: string) {
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
        } catch {
            throw new InternalServerErrorException('Failed to fetch memberships');
        }
    }

    async deleteMembership(galleryId: string, userId: string) {
        const membership = await this.prisma.membership.findUnique({
            where: { galleryId_userId: { galleryId, userId } },
        });

        if (!membership) {
            throw new NotFoundException('Membership not found');
        }

        if (membership.role === UserRole.ADMIN) {
            const adminCount = await this.prisma.membership.count({
                where: { galleryId, role: UserRole.ADMIN },
            });

            if (adminCount <= 1) {
                throw new BadRequestException('Cannot delete the last admin of the gallery');
            }
        }

        try {
            await this.prisma.membership.delete({
                where: { galleryId_userId: { galleryId, userId } },
            });
        } catch {
            throw new InternalServerErrorException('Failed to delete membership');
        }

        return true;
    }
}
