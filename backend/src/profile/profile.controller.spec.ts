import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ProfileDto, ResetPasswordDto } from './dto/profile.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = { userId: '1' };
      return true;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findById: jest.fn(),
            updateProfile: jest.fn(),
            resetPasswordByUserId: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get(ProfileController);
    service = module.get(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================
  // findProfile
  // ==========================
  describe('findProfile', () => {
    it('should return current user profile', async () => {
      service.findById.mockResolvedValue(mockUser as any);

      const result = await controller.findProfile('1');

      expect(result).toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith('1');
    });

    it('should propagate NotFoundException', async () => {
      service.findById.mockRejectedValue(new NotFoundException());

      await expect(controller.findProfile('1')).rejects.toThrow(NotFoundException);
    });

    it('should propagate InternalServerErrorException', async () => {
      service.findById.mockRejectedValue(new InternalServerErrorException());

      await expect(controller.findProfile('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ==========================
  // updateProfile
  // ==========================
  describe('updateProfile', () => {
    const dto: ProfileDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    };

    it('should update profile successfully', async () => {
      service.updateProfile.mockResolvedValue(mockUser as any);

      const result = await controller.updateProfile('1', dto);

      expect(result).toEqual(mockUser);
      expect(service.updateProfile).toHaveBeenCalledWith('1', dto);
    });

    it('should propagate ConflictException', async () => {
      service.updateProfile.mockRejectedValue(new ConflictException());

      await expect(controller.updateProfile('1', dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  // ==========================
  // resetPasswordByToken
  // ==========================
  describe('resetPasswordByToken', () => {
    const dto: ResetPasswordDto = {
      oldPassword: 'oldPass',
      newPassword: 'newPass123',
    };

    it('should reset password successfully', async () => {
      service.resetPasswordByUserId.mockResolvedValue(mockUser as any);

      const result = await controller.resetPasswordByToken('1', dto);

      expect(result).toEqual(mockUser);
      expect(service.resetPasswordByUserId).toHaveBeenCalledWith(
        '1',
        dto.oldPassword,
        dto.newPassword,
      );
    });

    it('should propagate NotFoundException', async () => {
      service.resetPasswordByUserId.mockRejectedValue(new NotFoundException());

      await expect(controller.resetPasswordByToken('1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should propagate BadRequestException', async () => {
      service.resetPasswordByUserId.mockRejectedValue(new BadRequestException());

      await expect(controller.resetPasswordByToken('1', dto)).rejects.toThrow(BadRequestException);
    });
  });
});
