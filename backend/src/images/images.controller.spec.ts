import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { BadRequestException } from '@nestjs/common';
import { IdsImagesDto } from './dto/ids-images.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

describe('ImagesController', () => {
    let controller: ImagesController;
    let service: jest.Mocked<ImagesService>;

    const mockImage = {
        id: '1',
        path: 'gallery1/img1.png',
        originalFilename: 'img1.png',
        createdAt: new Date(),
        galleryId: 'gallery1'
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ImagesController],
            providers: [
                {
                    provide: ImagesService,
                    useValue: {
                        uploadImages: jest.fn(),
                        getImagesByGallery: jest.fn(),
                        deleteImages: jest.fn(),
                        moveImages: jest.fn(),
                        copyImages: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<ImagesController>(ImagesController);
        service = module.get(ImagesService);
    });

    describe('uploadFiles', () => {
        it('should call service.uploadImages with correct params', async () => {
            const files = [{ originalname: 'img1.png', buffer: Buffer.from('data') } as Express.Multer.File];
            service.uploadImages.mockResolvedValue([mockImage]);
            const res = await controller.uploadFiles('gallery1', files);
            expect(service.uploadImages).toHaveBeenCalledWith('gallery1', files);
            expect(res).toEqual([mockImage]);
        });
    });

    // describe('getByGallery', () => {
    //     it('should call service.getImagesByGallery with correct params', async () => {
    //         const result = {
    //             items: [{ id: 'img1', url: 'url1' }],
    //             page: 1,
    //             limit: 10,
    //             total: 1,
    //             totalPages: 1,
    //         };

    //         service.getImagesByGallery = jest.fn().mockResolvedValue(result);

    //         const galleryId = 'gallery1';
    //         const page = 1;
    //         const limit = 10;
    //         const order: 'asc' | 'desc' = 'desc';

    //         const res = await controller.getByGallery(galleryId, page, limit, order);

    //         expect(service.getImagesByGallery).toHaveBeenCalledWith(
    //             galleryId,
    //             page,
    //             limit,
    //             order
    //         );

    //         expect(res).toEqual(result);
    //     });
    // });
    describe('deleteImages', () => {
        it.each([
            [{} as IdsImagesDto, 'gallery1'],
        ])('should throw BadRequestException if ids array is missing', async (dto, galleryId) => {
            await expect(controller.deleteImages(dto, galleryId)).rejects.toThrow(BadRequestException);
        });

        it('should call service.deleteImages with correct params', async () => {
            const dto: IdsImagesDto = { ids: ['id1', 'id2'] };
            const result = { deleted: ['id1', 'id2'] };
            service.deleteImages.mockResolvedValue(result);
            const res = await controller.deleteImages(dto, 'gallery1');
            expect(service.deleteImages).toHaveBeenCalledWith(dto.ids, 'gallery1');
            expect(res).toEqual(result);
        });
    });

    describe('moveImages', () => {
        it.each([
            [{} as IdsImagesDto, '', 'gallery1'],
            [{ ids: [] } as IdsImagesDto, 'gallery2', 'gallery1'],
        ])('should throw BadRequestException if ids or targetGalleryId missing', async (dto, targetGalleryId, galleryId) => {
            await expect(controller.moveImages(dto, targetGalleryId, galleryId)).rejects.toThrow(BadRequestException);
        });

        it('should call service.moveImages with correct params', async () => {
            const dto: IdsImagesDto = { ids: ['id1'] };
            service.moveImages.mockResolvedValue([mockImage]);
            const res = await controller.moveImages(dto, 'gallery2', 'gallery1');
            expect(service.moveImages).toHaveBeenCalledWith(dto.ids, 'gallery2', 'gallery1');
            expect(res).toEqual([mockImage]);
        });
    });

    describe('copyImages', () => {
        it.each([
            [{} as IdsImagesDto, '', 'gallery1'],
            [{ ids: [] } as IdsImagesDto, 'gallery2', 'gallery1'],
        ])('should throw BadRequestException if ids or targetGalleryId missing', async (dto, targetGalleryId, galleryId) => {
            await expect(controller.copyImages(dto, targetGalleryId, galleryId)).rejects.toThrow(BadRequestException);
        });

        it('should call service.copyImages with correct params', async () => {
            const dto: IdsImagesDto = { ids: ['id1'] };
            service.copyImages.mockResolvedValue([mockImage]);
            const res = await controller.copyImages(dto, 'gallery2', 'gallery1');
            expect(service.copyImages).toHaveBeenCalledWith(dto.ids, 'gallery2', 'gallery1');
            expect(res).toEqual([mockImage]);
        });
    });
});
