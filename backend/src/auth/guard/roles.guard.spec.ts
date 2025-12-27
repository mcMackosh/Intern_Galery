import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';
import { UserRole } from 'prisma/__generated__';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let prisma: PrismaService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: PrismaService,
          useValue: {
            membership: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get(RolesGuard);
    prisma = module.get(PrismaService);
    reflector = module.get(Reflector);
  });

  function mockExecutionContext(user: any, params: any = {}): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => ({ user, params }) }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  }

  it('should allow if no required roles', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);

    const context = mockExecutionContext({ userId: '1' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw ForbiddenException if user not found', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);

    const context = mockExecutionContext(null);

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should allow OWNER role regardless of required roles', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);
    (prisma.membership.findFirst as jest.Mock).mockResolvedValue({ role: UserRole.OWNER });

    const context = mockExecutionContext({ userId: '1' }, { galleryId: 'g1' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should allow if user has required role', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);
    (prisma.membership.findFirst as jest.Mock).mockResolvedValue({ role: UserRole.ADMIN });

    const context = mockExecutionContext({ userId: '1' }, { galleryId: 'g1' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('should throw ForbiddenException if user has insufficient role', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);
    (prisma.membership.findFirst as jest.Mock).mockResolvedValue({ role: UserRole.REGULAR });

    const context = mockExecutionContext({ userId: '1' }, { galleryId: 'g1' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should check multiple gallery IDs and allow if roles are sufficient', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);
    (prisma.membership.findFirst as jest.Mock)
      .mockResolvedValueOnce({ role: UserRole.ADMIN })
      .mockResolvedValueOnce({ role: UserRole.OWNER });

    const context = mockExecutionContext({ userId: '1' }, { galleryId: 'g1', targetGalleryId: 'g2' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(prisma.membership.findFirst).toHaveBeenCalledTimes(2);
  });

  it('should throw ForbiddenException if membership not found', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);
    (prisma.membership.findFirst as jest.Mock).mockResolvedValue(null);

    const context = mockExecutionContext({ userId: '1' }, { galleryId: 'g1' });

    await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
  });

  it('should ignore undefined or empty gallery IDs', async () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(['ADMIN']);
    (prisma.membership.findFirst as jest.Mock).mockResolvedValue({ role: UserRole.ADMIN });

    const context = mockExecutionContext({ userId: '1' }, { galleryId: '', targetGalleryId: undefined });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(prisma.membership.findFirst).not.toHaveBeenCalled();
  });
});
