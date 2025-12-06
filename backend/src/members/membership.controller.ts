import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { Authorization } from 'src/auth/decorators/auth.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { UserRole } from 'prisma/__generated__';

@Controller('gallery/:galleryId/members')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Authorization('ADMIN', 'REGULAR', 'OWNER')
  @Get()
  findAll(@Param('galleryId') galleryId: string) {
    return this.membershipService.getAllMemberships(galleryId);
  }

  @Authorization('ADMIN', 'OWNER')
  @Post('create-or-update')
  createOrUpdate(
    @Body() body: { userId: string; role?: UserRole },
    @Param('galleryId') galleryId: string,
    @Authorized('role') currentUserRole: UserRole,
  ) {
    const targetRole = body.role ?? UserRole.REGULAR;

    return this.membershipService.createOrUpdateMembership(
      body.userId,
      galleryId,
      targetRole,
      currentUserRole,
    );
  }

  @Authorization('ADMIN', 'OWNER')
  @Delete(':userId')
  remove(
    @Param('galleryId') galleryId: string,
    @Param('userId') userId: string,
    @Authorized('role') currentUserRole: UserRole,
  ) {
    return this.membershipService.deleteMembership(
      galleryId,
      userId,
      currentUserRole,
    );
  }

  @Authorization('OWNER')
  @Delete()
  removeMe(
    @Param('galleryId') galleryId: string,
    @Authorized('userId') userId: string,
    @Authorized('role') currentUserRole: UserRole,
  ) {
    return this.membershipService.deleteMembership(
      galleryId,
      userId,
      currentUserRole,
    );
  }
}
