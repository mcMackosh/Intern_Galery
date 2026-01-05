import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ProfileDto } from './dto/profile.dto';
import { UserSafeSelectType } from './profile.select';

jest.mock('bcrypt');

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userSafeSelectMock: UserSafeSelectType = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================
  // resetPasswordByUserId
  // ==========================
  describe('resetPasswordByUserId', () => {
    it('should reset password if oldPassword matches', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(userSafeSelectMock as any);

      const result = await service.resetPasswordByUserId('1', 'oldPass', 'newPass');

      expect(result).toEqual(userSafeSelectMock);
      expect(bcrypt.compare).toHaveBeenCalledWith('oldPass', mockUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.resetPasswordByUserId('1', 'oldPass', 'newPass')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(service.resetPasswordByUserId('1', 'wrongOld', 'newPass')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==========================
  // resetPasswordByEmail
  // ==========================
  describe('resetPasswordByEmail', () => {
    it('should reset password if oldPassword matches', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashed');

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue(userSafeSelectMock as any);

      const result = await service.resetPasswordByUserId('test@example.com', 'oldPass', 'newPass');

      expect(result).toEqual(userSafeSelectMock);
      expect(bcrypt.compare).toHaveBeenCalledWith('oldPass', mockUser.password);
      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.resetPasswordByUserId('notfound@test.com', 'oldPass', 'newPass'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if old password is incorrect', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(
        service.resetPasswordByUserId('test@example.com', 'wrongOld', 'newPass'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});