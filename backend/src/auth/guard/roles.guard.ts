// roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from 'prisma/__generated__';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const { galleryId, targetGalleryId } = request.params;

    if (!user?.userId) {
      throw new ForbiddenException('User not found');
    }

    const galleryIdsToCheck = [galleryId, targetGalleryId].filter(id => id !== undefined && id !== null && id !== '');

    for (const gid of galleryIdsToCheck) {
      const membership = await this.prisma.membership.findFirst({
        where: { userId: user.userId, galleryId: gid },
      });

      if (!membership) {
        throw new ForbiddenException(
          `User has no permissions for gallery ${gid}`
        );
      }

      const currentRole = membership.role;

      if (currentRole === UserRole.OWNER) {
        continue;
      }

      if (!requiredRoles.includes(currentRole)) {
        throw new ForbiddenException(
          `Not enough permissions for gallery ${gid}`
        );
      }
    }

    return true;
  }
}

