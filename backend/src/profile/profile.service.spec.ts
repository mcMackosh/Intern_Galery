import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ProfileDto } from './dto/profile.dto';
import { userSafeSelect, UserSafeSelectType } from './profile.select';

jest.mock('bcrypt');

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

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
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn() as any,
              create: jest.fn() as any,
              update: jest.fn() as any,
            },
          },
        },
      ],
    }).compile();

    service = module.get(ProfileService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: userSafeSelect,
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on prisma error', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.findById('1')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await service.findByEmail('john@example.com');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
    });

    it('should throw InternalServerErrorException on prisma error', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));
      await expect(service.findByEmail('john@example.com')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('create', () => {
    const dto: RegisterDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
    };

    // it('should create user with hashed password', async () => {
    //   (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    //   (prisma.user.create as jest.Mock).mockResolvedValue({ ...mockUser, password: 'hashedPassword' });

    //   const result = await service.create(dto);

    //   expect(result).toEqual(mockUser);
    //   expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    //   expect(prisma.user.create).toHaveBeenCalledWith({
    //     data: { ...dto, password: 'hashedPassword' },
    //     select: userSafeSelect,
    //   });
    // });

    it('should throw ConflictException if email already exists', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockRejectedValue({ code: 'P2002', meta: { target: ['email'] } });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(service.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const dto: ProfileDto = { firstName: 'Jane', email: 'jane@example.com', password: 'NewPass123' };

    it('should update user with hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      (prisma.user.update as jest.Mock).mockResolvedValue({ ...mockUser, ...dto, password: 'hashedPassword' });

      const result = await service.update('1', dto);

      expect(result).toEqual({ ...mockUser, ...dto, password: 'hashedPassword' });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ...dto, password: 'hashedPassword' },
        select: userSafeSelect,
      });
    });

    it('should throw ConflictException if email already in use', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'findByEmail').mockResolvedValue({ ...mockUser, password: 'hashedPassword', });

      await expect(service.update('1', { email: 'jane@example.com' })).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException if findByEmail fails', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'findByEmail').mockRejectedValue(new Error('DB error'));

      await expect(service.update('1', { email: 'jane@example.com' })).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(service.update('1', dto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should update user without password if not provided', async () => {
      const dtoWithoutPassword: ProfileDto = { firstName: 'Jane' };
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      (prisma.user.update as jest.Mock).mockResolvedValue({ ...mockUser, ...dtoWithoutPassword });

      const result = await service.update('1', dtoWithoutPassword);

      expect(result).toEqual({ ...mockUser, ...dtoWithoutPassword });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ...dtoWithoutPassword },
        select: userSafeSelect,
      });
    });
  });
});
