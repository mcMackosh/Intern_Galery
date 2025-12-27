import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { NotFoundException, ConflictException, InternalServerErrorException, CanActivate, ExecutionContext } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { UserSafeSelectType } from './profile.select';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockUser: UserSafeSelectType = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get(ProfileController);
    service = module.get(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findProfile', () => {
    it('should return user profile successfully', async () => {
      (service.findById as jest.Mock).mockResolvedValue(mockUser);
      const result = await controller.findProfile('1');
      expect(result).toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith('1');
    });

    it('should propagate NotFoundException from service', async () => {
      (service.findById as jest.Mock).mockRejectedValue(new NotFoundException('User not found'));
      await expect(controller.findProfile('1')).rejects.toThrow(NotFoundException);
    });

    it('should propagate InternalServerErrorException from service', async () => {
      (service.findById as jest.Mock).mockRejectedValue(new InternalServerErrorException());
      await expect(controller.findProfile('1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateProfile', () => {
    const dto: ProfileDto = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      password: 'NewPass123',
    };

    it('should update user profile successfully', async () => {
      (service.update as jest.Mock).mockResolvedValue(mockUser);
      const result = await controller.updateProfile('1', dto);
      expect(result).toEqual(mockUser);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });

    it('should propagate ConflictException from service', async () => {
      (service.update as jest.Mock).mockRejectedValue(new ConflictException('Email already in use'));
      await expect(controller.updateProfile('1', dto)).rejects.toThrow(ConflictException);
    });

    it('should propagate NotFoundException from service', async () => {
      (service.update as jest.Mock).mockRejectedValue(new NotFoundException('User not found'));
      await expect(controller.updateProfile('1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should propagate InternalServerErrorException from service', async () => {
      (service.update as jest.Mock).mockRejectedValue(new InternalServerErrorException());
      await expect(controller.updateProfile('1', dto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
