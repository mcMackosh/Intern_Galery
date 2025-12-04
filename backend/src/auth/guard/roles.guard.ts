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

    const galleryId = request.params.galleryId as string;
    
    if (!user || !user.userId || !galleryId) {
      throw new ForbiddenException('User or gallery ID not found');
    }

    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: user.userId,
        galleryId : galleryId
      },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of the gallery');
    }

    if (!requiredRoles.includes(membership.role)) {
      throw new ForbiddenException('Not enough permissions');
    }

    return true;
  }
}