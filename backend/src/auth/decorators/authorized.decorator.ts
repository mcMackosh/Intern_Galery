import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Authorized = createParamDecorator(
  (data: 'userId' | 'role' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    const galleryRole = request.galleryRole;
    if (data === 'userId') return user?.userId;
    if (data === 'role') return galleryRole;

    return user;
  },
);