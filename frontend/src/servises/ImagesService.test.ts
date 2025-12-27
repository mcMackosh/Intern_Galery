import { imageService } from './image.service';
import api from '@/shared/lib/api/api-interceptor';
import { Image, GetImagesResponse, UploadImageResponse, MoveCopyImageResponse, DeleteImagesResponse } from '@/types/image';

jest.mock('@/shared/lib/api/api-interceptor');

const mockedApi = api as jest.Mocked<typeof api>;

describe('ImagesService', () => {
    const galleryId = 'gallery-123';
    const targetGalleryId = 'gallery-456';
    const ids = ['img1', 'img2'];
    const files = [new File(['dummy'], 'file1.png', { type: 'image/png' })];

    const mockImage: Image = {
        id: 'img1',
        galleryId,
        path: '/path/to/img1.png',
        originalFilename: 'img1.png',
        createdAt: new Date(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getImagesByGallery', () => {
        it('should fetch images successfully', async () => {
            const mockResponse: GetImagesResponse = {
                items: { '2025-12-22': [mockImage] },
                page: 1,
                limit: 20,
                total: 1,
                totalPages: 1,
            };
            mockedApi.get.mockResolvedValue({ data: mockResponse });

            const result = await imageService.getImagesByGallery(galleryId, 1, 20, 'asc');

            expect(mockedApi.get).toHaveBeenCalledWith(`galleries/${galleryId}/image?page=1&limit=20&order=asc`);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error if API fails', async () => {
            mockedApi.get.mockRejectedValue(new Error('Network Error'));

            await expect(
                imageService.getImagesByGallery(galleryId, undefined, undefined, 'asc')
            ).rejects.toThrow('Network Error');
        });
    });

    describe('uploadImages', () => {
        it('should upload images successfully', async () => {
            const mockResponse: UploadImageResponse = [mockImage];
            mockedApi.post.mockResolvedValue({ data: mockResponse });

            const result = await imageService.uploadImages(galleryId, files);

            expect(mockedApi.post).toHaveBeenCalled();
            const callArgs = mockedApi.post.mock.calls[0];
            expect(callArgs[0]).toBe(`galleries/${galleryId}/image/upload`);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error if upload fails', async () => {
            mockedApi.post.mockRejectedValue(new Error('Upload Failed'));
            await expect(imageService.uploadImages(galleryId, files)).rejects.toThrow('Upload Failed');
        });
    });

    describe('deleteImages', () => {
        it('should delete images successfully', async () => {
            const mockResponse: DeleteImagesResponse = { deleted: ids };
            mockedApi.delete.mockResolvedValue({ data: mockResponse });

            const result = await imageService.deleteImages(galleryId, ids);

            expect(mockedApi.delete).toHaveBeenCalledWith(`galleries/${galleryId}/image`, { data: { ids } });
            expect(result).toEqual(mockResponse);
        });

        it('should throw error if deletion fails', async () => {
            mockedApi.delete.mockRejectedValue(new Error('Delete Failed'));
            await expect(imageService.deleteImages(galleryId, ids)).rejects.toThrow('Delete Failed');
        });
    });

    describe('moveImages', () => {
        it('should move images successfully', async () => {
            const mockResponse: MoveCopyImageResponse = [mockImage];
            mockedApi.post.mockResolvedValue({ data: mockResponse });

            const result = await imageService.moveImages(galleryId, targetGalleryId, ids);

            expect(mockedApi.post).toHaveBeenCalledWith(
                `galleries/${galleryId}/image/move/${targetGalleryId}`,
                { ids }
            );
            expect(result).toEqual(mockResponse);
        });

        it('should throw error if move fails', async () => {
            mockedApi.post.mockRejectedValue(new Error('Move Failed'));
            await expect(imageService.moveImages(galleryId, targetGalleryId, ids)).rejects.toThrow('Move Failed');
        });
    });

    describe('copyImages', () => {
        it('should copy images successfully', async () => {
            const mockResponse: MoveCopyImageResponse = [mockImage];
            mockedApi.post.mockResolvedValue({ data: mockResponse });

            const result = await imageService.copyImages(galleryId, targetGalleryId, ids);

            expect(mockedApi.post).toHaveBeenCalledWith(
                `galleries/${galleryId}/image/copy/${targetGalleryId}`,
                { ids }
            );
            expect(result).toEqual(mockResponse);
        });

        it('should throw error if copy fails', async () => {
            mockedApi.post.mockRejectedValue(new Error('Copy Failed'));
            await expect(imageService.copyImages(galleryId, targetGalleryId, ids)).rejects.toThrow('Copy Failed');
        });
    });
});