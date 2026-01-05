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
    count: jest.fn(),
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

describe('GalleryService', () => {
  let service: GalleryService;
  let prisma: PrismaService;
  const userId = 'user-123';
  const galleryId = 'gallery-123';

  // --- HELPER FUNCTIONS ---
  const mockGallery = (overrides = {}) => ({
    id: galleryId,
    title: 'Test Gallery',
    createdAt: new Date(),
    memberships: [{ role: UserRole.OWNER }],
    images: [{ path: 'img1.jpg' }, { path: 'img2.jpg' }],
    _count: { images: 2 },
    ...overrides,
  });

  const setupFindManyMock = (galleries: any[], total = galleries.length) => {
    mockPrismaService.gallery.count.mockResolvedValue(total);
    mockPrismaService.gallery.findMany.mockResolvedValue(galleries);
  };

  const getGalleryFolder = (id: string) =>
    path.join(process.cwd(), 'uploads', id);

  // ------------------------

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GalleryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GalleryService>(GalleryService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('createGallery', () => {
    it('should create a gallery with owner membership', async () => {
      const dto: CreateGalleryDto = { title: 'New Gallery' };
      mockPrismaService.gallery.create.mockResolvedValue(mockGallery(dto));

      const result = await service.createGallery(dto, userId);

      expect(result.title).toBe(dto.title);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(prisma.gallery.create).toHaveBeenCalledWith({
        data: {
          title: 'New Gallery',
          memberships: { create: { userId, role: UserRole.OWNER } },
        },
      });
    });
  });

  describe('getAllGalleries', () => {
    it('should return paginated galleries with correct meta', async () => {
      const galleries = [mockGallery()]; // мок з Prisma
      setupFindManyMock(galleries, 10);

      const result = await service.getAllGalleries(userId, 2, 5, {});

      // Очікувана структура після трансформації всередині сервісу
      const expected = galleries.map(g => ({
        id: g.id,
        title: g.title,
        createdAt: g.createdAt,
        role: g.memberships[0].role,
        images: g.images.map(img => img.path),
        imagesCount: g._count.images,
      }));

      expect(result.data).toEqual(expected);
      expect(result.meta).toEqual({
        total: 10,
        page: 2,
        limit: 5,
        totalPages: 2,
      });
    });

    it('should apply search filter', async () => {
      const galleries = [mockGallery({ title: 'Test Gallery' })];
      setupFindManyMock(galleries);

      await service.getAllGalleries(userId, 1, 10, { search: 'Test' });

      expect(prisma.gallery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: 'Test', mode: 'insensitive' },
          }),
        })
      );
    });

    it('should filter by date range', async () => {
      const startDate = '2026-01-01';
      const endDate = '2026-01-31';
      const galleries = [mockGallery({ createdAt: new Date('2026-01-10') })];
      setupFindManyMock(galleries);

      await service.getAllGalleries(userId, 1, 10, { startDate: new Date(startDate), endDate: new Date(endDate) });

      expect(prisma.gallery.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
          }),
        })
      );
    });

    it('should filter by images count range', async () => {
      const galleries = [
        mockGallery({ id: '2', images: Array(10).fill({ path: 'img.jpg' }), _count: { images: 10 } }),
        mockGallery({ id: '1', images: [], _count: { images: 3 } }),
        mockGallery({ id: '3', images: Array(15).fill({ path: 'img.jpg' }), _count: { images: 15 } }),
      ];
      setupFindManyMock(galleries, 3);

      const result = await service.getAllGalleries(userId, 1, 10, { minImages: 6, maxImages: 12 });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('2');
      expect(result.data[0].imagesCount).toBe(10);
    });
  });

  describe('getGalleryInfoById', () => {
    it('should return gallery info with user role', async () => {
      mockPrismaService.gallery.findFirst.mockResolvedValue(mockGallery());

      const result = await service.getGalleryInfoById(galleryId, userId);

      expect(result).toEqual({
        id: galleryId,
        title: 'Test Gallery',
        createdAt: expect.any(Date),
        role: UserRole.OWNER,
      });
    });

    it('should throw NotFoundException when gallery not found', async () => {
      mockPrismaService.gallery.findFirst.mockResolvedValue(null);

      await expect(service.getGalleryInfoById('invalid-id', userId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateGallery', () => {
    it('should update gallery title', async () => {
      const updateDto = { title: 'Updated Title' };
      mockPrismaService.gallery.update.mockResolvedValue(mockGallery(updateDto));

      const result = await service.updateGallery(galleryId, updateDto);

      expect(result.title).toBe('Updated Title');
    });
  });

  describe('deleteGallery', () => {
    beforeEach(() => {
      mockPrismaService.$transaction.mockImplementation(async (cb) => cb(prisma));
    });

    it('should delete gallery and folder if exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.promises.rm as jest.Mock).mockResolvedValue(undefined);

      const result = await service.deleteGallery(galleryId);

      expect(result).toEqual({ message: 'Gallery deleted successfully' });
      expect(fs.promises.rm).toHaveBeenCalledWith(getGalleryFolder(galleryId), { recursive: true, force: true });
    });

    it('should delete gallery without removing folder if not exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await service.deleteGallery(galleryId);

      expect(fs.promises.rm).not.toHaveBeenCalled();
    });
  });
});
