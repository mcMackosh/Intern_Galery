import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Membership, UserRole } from 'prisma/__generated__';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrUpdateMembership(
    userId: string,
    galleryId: string,
    role: UserRole,
    currentUserRole: UserRole,
  ): Promise<Membership> {

    if (role === UserRole.OWNER) {
      throw new BadRequestException('OWNER role cannot be assigned');
    }

    const userExisting = await this.prisma.user.findUnique({
      where: {id: userId},
    });

    if(!userExisting)
    {
        throw new ForbiddenException(
          'User is uncorrect',
        );
    }

    const existing = await this.prisma.membership.findUnique({
      where: { galleryId_userId: { galleryId, userId } },
    });

    if (currentUserRole === UserRole.ADMIN) {
      if (existing && existing.role !== UserRole.REGULAR) {
        throw new ForbiddenException(
          'Admin can manage only REGULAR members',
        );
      }

      if (role !== UserRole.REGULAR) {
        throw new ForbiddenException(
          'Admin can assign only REGULAR role',
        );
      }
    }

    if (
      existing?.role === UserRole.OWNER &&
      currentUserRole !== UserRole.OWNER
    ) {
      throw new ForbiddenException(
        'Only OWNER can modify OWNER membership',
      );
    }

    if (existing) {
      return this.prisma.membership.update({
        where: { galleryId_userId: { galleryId, userId } },
        data: { role },
      });
    }

    return this.prisma.membership.create({
      data: { userId, galleryId, role },
    });
  }

  async getAllMemberships(galleryId: string) {
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

    return memberships.map(m => ({
      id: m.user.id,
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      email: m.user.email,
      role: m.role,
    }));
  }

  async deleteMembership(
    galleryId: string,
    userId: string,
    currentUserRole: UserRole,
  ) {
    const membership = await this.prisma.membership.findUnique({
      where: { galleryId_userId: { galleryId, userId } },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (
      currentUserRole === UserRole.ADMIN &&
      membership.role !== UserRole.REGULAR
    ) {
      throw new ForbiddenException(
        'Admin can delete only REGULAR members',
      );
    }

    if (
      membership.role === UserRole.OWNER &&
      currentUserRole !== UserRole.OWNER
    ) {
      throw new ForbiddenException(
        'Only OWNER can delete OWNER',
      );
    }

    await this.prisma.membership.delete({
      where: { galleryId_userId: { galleryId, userId } },
    });

    return true;
  }
}