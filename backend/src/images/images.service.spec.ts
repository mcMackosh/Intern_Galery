import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ImagesService } from './images.service';
import * as fs from 'fs/promises';
import { move } from 'fs-extra';
import * as crypto from 'crypto';
import { Image } from 'prisma/__generated__';
import { ForbiddenException } from '@nestjs/common';

jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
  copyFile: jest.fn(),
}));

jest.mock('fs-extra', () => ({ move: jest.fn() }));
jest.mock('crypto', () => ({ randomUUID: jest.fn() }));

describe('ImagesService', () => {
  let service: ImagesService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockImage = (overrides: Partial<Image> = {}): Image => ({
    id: 'image-id-1',
    path: 'gallery1/filename.jpg',
    originalFilename: 'original.jpg',
    galleryId: 'gallery-id-1',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  });

  const mockFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test-image-content'),
    size: 1024,
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
    ...overrides,
  });

  const mockTransaction = (overrides: any = {}) =>
    jest.fn(async (cb: any) => {
      const tx = {
        image: {
          create: jest.fn(),
          findMany: jest.fn(),
          deleteMany: jest.fn(),
          update: jest.fn(),
          count: jest.fn(),
          ...overrides.image,
        },
      };
      return cb(tx);
    });

  const mockFsMethods = () => {
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.unlink as jest.Mock).mockResolvedValue(undefined);
    (fs.copyFile as jest.Mock).mockResolvedValue(undefined);
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            image: {
              create: jest.fn(),
              findMany: jest.fn(),
              deleteMany: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    prismaService = module.get(PrismaService) as jest.Mocked<PrismaService>;

    mockFsMethods();
  });

  afterEach(() => jest.restoreAllMocks());

  describe('uploadImages', () => {
    it('uploads multiple images', async () => {
      const galleryId = 'gallery-1';
      const files = [mockFile(), mockFile({ originalname: 'test2.jpg' })];

      prismaService.$transaction.mockImplementation(
        mockTransaction({
          image: {
            create: jest
              .fn()
              .mockResolvedValueOnce(mockImage({ path: 'gallery-1/mocked-uuid_test.jpg' }))
              .mockResolvedValueOnce(mockImage({ path: 'gallery-1/mocked-uuid_test2.jpg' })),
          },
        }),
      );

      const result = await service.uploadImages(galleryId, files);

      expect(result).toHaveLength(2);
      expect(result[0].path).toBe('gallery-1/mocked-uuid_test.jpg');
      expect(fs.writeFile).toHaveBeenCalledTimes(2);
    });

    it('should return empty array if no files provided', async () => {
      prismaService.$transaction.mockImplementation(mockTransaction());

      const result = await service.uploadImages('gallery-1', []);
      expect(result).toEqual([]);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('throws on writeFile error', async () => {
      (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error('Disk full'));
      prismaService.$transaction.mockImplementation(mockTransaction());

      await expect(service.uploadImages('gallery-1', [mockFile()])).rejects.toThrow('Disk full');
    });
  });

  describe('deleteImages', () => {
    it('deletes images', async () => {
      const ids = ['id-1', 'id-2'];
      const galleryId = 'gallery-1';
      const mockImages = ids.map((id) => mockImage({ id, path: `${galleryId}/file${id.slice(-1)}.jpg` }));

      prismaService.$transaction.mockImplementation(
        mockTransaction({
          image: { findMany: jest.fn().mockResolvedValue(mockImages), deleteMany: jest.fn().mockResolvedValue({ count: 2 }) },
        }),
      );

      const result = await service.deleteImages(ids, galleryId);

      expect(result).toEqual({ deleted: ids });
      expect(fs.unlink).toHaveBeenCalledTimes(2);
    });
  });

  describe('moveImages', () => {
    it('moves images to target gallery', async () => {
      const ids = ['id-1', 'id-2'];
      const source = 'source-gallery';
      const target = 'target-gallery';
      const mockImages = ids.map((id) => mockImage({ id, galleryId: source, path: `${source}/file${id.slice(-1)}.jpg` }));

      const updated = mockImages.map((img) => ({ ...img, galleryId: target, path: `${target}/${img.path.split('/')[1]}` }));

      prismaService.$transaction.mockImplementation(
        mockTransaction({
          image: {
            findMany: jest.fn().mockResolvedValue(mockImages),
            update: jest.fn().mockResolvedValueOnce(updated[0]).mockResolvedValueOnce(updated[1]),
          },
        }),
      );

      (move as jest.Mock).mockResolvedValue(undefined);

      const result = await service.moveImages(ids, target, source);
      expect(result.map((i) => i.galleryId)).toEqual([target, target]);
      expect(move).toHaveBeenCalledTimes(2);
    });
  });

  it('should throw if images not found in source gallery when moving', async () => {
    prismaService.$transaction.mockImplementation(
      mockTransaction({ image: { findMany: jest.fn().mockResolvedValue([]) } })
    );

    await expect(service.moveImages(['id-1'], 'target', 'source'))
      .rejects
      .toThrow('Some images do not belong to this gallery');
  });

  describe('copyImages', () => {
    it('copies images and generates new UUID', async () => {
      const ids = ['id-1'];
      const source = 'source-gallery';
      const target = 'target-gallery';
      const mockImages = [mockImage({ id: 'id-1', galleryId: source, path: `${source}/file1.jpg` })];

      prismaService.$transaction.mockImplementation(
        mockTransaction({
          image: {
            findMany: jest.fn().mockResolvedValue(mockImages),
            create: jest.fn().mockResolvedValue({ ...mockImages[0], id: 'new-id', path: `${target}/mocked-uuid_file1.jpg`, galleryId: target }),
          },
        }),
      );

      const result = await service.copyImages(ids, target, source);
      expect(result[0].path).toContain('mocked-uuid_file1.jpg');
      expect(fs.copyFile).toHaveBeenCalledTimes(1);
    });

    it('handles copyFile errors', async () => {
      const ids = ['id-1'];
      const source = 'source-gallery';
      const target = 'target-gallery';
      const mockImages = [mockImage({ id: 'id-1', galleryId: source, path: `${source}/file1.jpg` })];

      prismaService.$transaction.mockImplementation(
        mockTransaction({
          image: {
            findMany: jest.fn().mockResolvedValue(mockImages),
            create: jest.fn().mockResolvedValue({ ...mockImages[0], id: 'new-id', path: `${target}/mocked-uuid_file1.jpg`, galleryId: target }),
          },
        }),
      );

      (fs.copyFile as jest.Mock).mockRejectedValue(new Error('NOENT: no such file or directory'));

      await expect(service.copyImages(ids, target, source)).rejects.toThrow('NOENT: no such file or directory');
    });
  });
});
