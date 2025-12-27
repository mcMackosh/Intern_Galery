import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UserRole } from 'prisma/__generated__';
import * as fs from 'fs';
import * as path from 'path';

const mockPrismaService = {
  gallery: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
};

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
  promises: {
    rm: jest.fn(),
  },
}));

jest.mock('fs/promises');

describe('GalleryService', () => {
  let service: GalleryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('createGallery', () => {
    it('should create a gallery with an owner', async () => {
      const dto: CreateGalleryDto = { title: 'New Gallery' };
      const userId = 'user-123';
      const mockGallery = { id: 'gallery-123', ...dto, createdAt: new Date() };

      mockPrismaService.gallery.create.mockResolvedValue(mockGallery);

      const result = await service.createGallery(dto, userId);

      expect(result).toEqual(mockGallery);
      expect(prisma.gallery.create).toHaveBeenCalledWith({
        data: {
          title: 'New Gallery',
          memberships: {
            create: {
              userId: userId,
              role: UserRole.OWNER,
            },
          },
        },
      });
    });
  });

  describe('getAllGalleries', () => {
    it('should return galleries with pagination', async () => {
      const userId = 'user-123';
      const mockGalleries = [
        {
          id: 'gallery-1',
          title: 'Gallery 1',
          createdAt: new Date(),
          memberships: [{ role: UserRole.OWNER }],
          _count: { images: 5 },
        },
      ];

      mockPrismaService.gallery.findMany.mockResolvedValue(mockGalleries);

      const result = await service.getAllGalleries(userId, 1, 10, {});

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Gallery 1');
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should filter by search query', async () => {
      const userId = 'user-123';
      const query = { search: 'test' };

      await service.getAllGalleries(userId, 1, 10, query);

      expect(prisma.gallery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: expect.objectContaining({
              contains: 'test',
              mode: 'insensitive',
            }),
          }),
        }),
      );
    });
  });

  describe('getGalleryInfoById', () => {
    it('should return gallery information', async () => {
      const galleryId = 'gallery-123';
      const userId = 'user-123';
      const mockGallery = {
        id: galleryId,
        title: 'Test Gallery',
        createdAt: new Date(),
        memberships: [{ role: UserRole.OWNER }],
      };

      mockPrismaService.gallery.findFirst.mockResolvedValue(mockGallery);

      const result = await service.getGalleryInfoById(galleryId, userId);

      expect(result.id).toBe(galleryId);
      expect(result.title).toBe('Test Gallery');
      expect(result.role).toBe(UserRole.OWNER);
    });

    it('should throw an error if gallery is not found', async () => {
      const galleryId = 'non-existent';
      const userId = 'user-123';

      mockPrismaService.gallery.findFirst.mockResolvedValue(null);

      await expect(service.getGalleryInfoById(galleryId, userId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getGalleryInfoById(galleryId, userId)).rejects.toThrow(
        'Gallery not found',
      );
    });
  });

  describe('updateGallery', () => {
    it('should update a gallery', async () => {
      const galleryId = 'gallery-123';
      const updateDto = { title: 'Updated Title' };
      const updatedGallery = {
        id: galleryId,
        ...updateDto,
        createdAt: new Date(),
      };

      mockPrismaService.gallery.update.mockResolvedValue(updatedGallery);

      const result = await service.updateGallery(galleryId, updateDto);

      expect(result.title).toBe('Updated Title');
      expect(prisma.gallery.update).toHaveBeenCalledWith({
        where: { id: galleryId },
        data: updateDto,
      });
    });
  });

  describe('deleteGallery', () => {
    it('should delete a gallery and its folder', async () => {
      const galleryId = 'gallery-123';
      const galleryFolder = path.join(process.cwd(), 'uploads', galleryId);

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.rm as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteGallery(galleryId);

      expect(result.message).toBe('Gallery deleted successfully');
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(fs.existsSync).toHaveBeenCalledWith(galleryFolder);
    });

    it('should delete a gallery even if the folder does not exist', async () => {
      const galleryId = 'gallery-123';

      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return await callback(prisma);
      });
      
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = await service.deleteGallery(galleryId);

      expect(result.message).toBe('Gallery deleted successfully');
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.promises.rm).not.toHaveBeenCalled();
    });
  });
});
