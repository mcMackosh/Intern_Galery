import {
    Injectable,
    InternalServerErrorException,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { Membership, UserRole } from 'prisma/__generated__';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MembershipService {
    constructor(private prisma: PrismaService) {}

    async createOrUpdateMembership(
        userId: string,
        galleryId: string,
        role: UserRole,
        currentUserRole: UserRole,
    ) {
        let existing: Membership | null = null;

        if(role == UserRole.OWNER) 
            throw new InternalServerErrorException('Role Owner don`t assign');

        try {
            existing = await this.prisma.membership.findUnique({
                where: { galleryId_userId: { galleryId, userId } },
                include: { user: true },
            });
        } catch {
            throw new InternalServerErrorException('Failed to check existing membership');
        }

        if (currentUserRole === UserRole.ADMIN) {
            if (existing && existing.role !== UserRole.REGULAR) {
                throw new ForbiddenException('Admin can manage only REGULAR members');
            }

            if (role !== UserRole.REGULAR) {
                throw new ForbiddenException('Admin can assign only REGULAR role');
            }
        }

        if (existing?.role === UserRole.OWNER && currentUserRole !== UserRole.OWNER) {
            throw new ForbiddenException('Only OWNER can modify OWNER membership');
        }

        if (existing) {
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
                    user: { select: { id: true, firstName: true, lastName: true, email: true } },
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

    async deleteMembership(
        galleryId: string,
        userId: string,
        currentUserRole: UserRole,
    ) {
        const membership = await this.prisma.membership.findUnique({
            where: { galleryId_userId: { galleryId, userId } },
        });

        if (!membership) throw new NotFoundException('Membership not found');

        if (currentUserRole === UserRole.ADMIN && membership.role !== UserRole.REGULAR) {
            throw new ForbiddenException('Admin can delete only REGULAR members');
        }

        if (membership.role === UserRole.OWNER && currentUserRole !== UserRole.OWNER) {
            throw new ForbiddenException('Only OWNER can delete OWNER');
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