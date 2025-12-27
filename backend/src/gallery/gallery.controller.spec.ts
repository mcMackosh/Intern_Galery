import { Test, TestingModule } from '@nestjs/testing';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { GetGalleriesQueryDto } from './dto/gallery.search.options';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

const mockGalleryService = {
  getGalleryInfoById: jest.fn(),
  createGallery: jest.fn(),
  getAllGalleries: jest.fn(),
  updateGallery: jest.fn(),
  deleteGallery: jest.fn(),
};

describe('GalleryController', () => {
  let controller: GalleryController;
  let galleryService: GalleryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GalleryController],
      providers: [
        {
          provide: GalleryService,
          useValue: mockGalleryService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
          .useValue({ canActivate: jest.fn(() => true) })
          .overrideGuard(RolesGuard)
          .useValue({ canActivate: jest.fn(() => true) })
          .compile();

    controller = module.get<GalleryController>(GalleryController);
    galleryService = module.get<GalleryService>(GalleryService);
    jest.clearAllMocks();
  });

  describe('createGallery', () => {
    it('should create a new gallery', async () => {
      const userId = 'user-123';
      const createDto: CreateGalleryDto = {
        title: 'New Gallery',
        description: 'Gallery description',
      };
      const expectedGallery = {
        id: 'gallery-123',
        ...createDto,
        createdAt: new Date(),
      };

      mockGalleryService.createGallery.mockResolvedValue(expectedGallery);

      const result = await controller.createGallery(userId, createDto);

      expect(result).toEqual(expectedGallery);
      expect(galleryService.createGallery).toHaveBeenCalledWith(createDto, userId);
    });

    it('should create a gallery without description', async () => {
      const userId = 'user-123';
      const createDto: CreateGalleryDto = {
        title: 'Gallery without description',
      };

      await controller.createGallery(userId, createDto);

      expect(galleryService.createGallery).toHaveBeenCalledWith(
        { title: 'Gallery without description' },
        userId,
      );
    });
  });

  describe('getAllGaleries', () => {
    it('should return galleries with pagination', async () => {
      const userId = 'user-123';
      const page = 1;
      const limit = 10;
      const queryOptions: GetGalleriesQueryDto = {
        search: 'test',
        sortBy: 'createdAt',
        orderBy: 'desc',
      };

      const expectedResponse = {
        data: [
          {
            id: 'gallery-1',
            title: 'Test Gallery',
            createdAt: new Date(),
            role: 'OWNER',
            imagesCount: 5,
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockGalleryService.getAllGalleries.mockResolvedValue(expectedResponse);

      const result = await controller.getAllGaleries(userId, page, limit, queryOptions);

      expect(result).toEqual(expectedResponse);
      expect(galleryService.getAllGalleries).toHaveBeenCalledWith(
        userId,
        page,
        limit,
        queryOptions,
      );
    });

    it('should use default values for page and limit', async () => {
      const userId = 'user-123';
      const queryOptions: GetGalleriesQueryDto = {};

      await controller.getAllGaleries(userId, undefined, undefined, queryOptions);

      expect(galleryService.getAllGalleries).toHaveBeenCalledWith(
        userId,
        1,
        3,
        queryOptions,
      );
    });

    it('should work without additional search parameters', async () => {
      const userId = 'user-123';

      await controller.getAllGaleries(userId, 1, 10, {});

      expect(galleryService.getAllGalleries).toHaveBeenCalledWith(
        userId,
        1,
        10,
        {},
      );
    });
  });

  describe('getGallery', () => {
    it('should return gallery information', async () => {
      const galleryId = 'gallery-123';
      const userId = 'user-123';
      const expectedGallery = {
        id: galleryId,
        title: 'My Gallery',
        createdAt: new Date(),
        role: 'OWNER',
      };

      mockGalleryService.getGalleryInfoById.mockResolvedValue(expectedGallery);

      const result = await controller.getGallery(galleryId, userId);

      expect(result).toEqual(expectedGallery);
      expect(galleryService.getGalleryInfoById).toHaveBeenCalledWith(
        galleryId,
        userId,
      );
    });
  });

  describe('updateGallery', () => {
    it('should update a gallery', async () => {
      const galleryId = 'gallery-123';
      const updateDto: UpdateGalleryDto = {
        title: 'Updated title',
        description: 'Updated description',
      };
      const updatedGallery = {
        id: galleryId,
        ...updateDto,
        createdAt: new Date(),
      };

      mockGalleryService.updateGallery.mockResolvedValue(updatedGallery);

      const result = await controller.updateGallery(galleryId, updateDto);

      expect(result).toEqual(updatedGallery);
      expect(galleryService.updateGallery).toHaveBeenCalledWith(
        galleryId,
        updateDto,
      );
    });

    it('should update only the title', async () => {
      const galleryId = 'gallery-123';
      const updateDto: UpdateGalleryDto = {
        title: 'New title',
      };

      await controller.updateGallery(galleryId, updateDto);

      expect(galleryService.updateGallery).toHaveBeenCalledWith(
        galleryId,
        { title: 'New title' },
      );
    });
  });

  describe('deleteGallery', () => {
    it('should delete a gallery', async () => {
      const galleryId = 'gallery-123';

      mockGalleryService.deleteGallery.mockResolvedValue({
        message: 'Gallery deleted successfully',
      });

      const result = await controller.deleteGallery(galleryId);

      expect(result).toBe(true);
      expect(galleryService.deleteGallery).toHaveBeenCalledWith(galleryId);
    });
  });
});
