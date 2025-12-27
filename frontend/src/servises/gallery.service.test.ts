import { galleryService } from './gallery.service';
import api from '@/shared/lib/api/api-interceptor';
import type { IGallery, IGalleryListResponse } from '@/types/gallery';
import type { TypeCreateGalleryScheme, TypeUpdateGalleryScheme } from '@/feature/gallery/schemes/gallery.shemes';
import { UserRole } from '@/types/membership';

jest.mock('@/shared/lib/api/api-interceptor');

describe('GalleryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all galleries with default page', async () => {
    const mockData: IGalleryListResponse = {
      data: [{ id: '1', title: 'Gallery1', description: 'Desc', role: UserRole.REGULAR }],
      meta: { total: 1, page: 1, limit: 6, totalPages: 1 },
    };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await galleryService.getAllGalleries();

    expect(api.get).toHaveBeenCalledWith('/gallery?page=1&limit=6', { signal: undefined });
    expect(result).toEqual(mockData);
  });

  it('should fetch all galleries with query string', async () => {
    const mockData: IGalleryListResponse = {
      data: [{ id: '1', title: 'Gallery1', description: 'Desc', role: UserRole.REGULAR }],
      meta: { total: 1, page: 2, limit: 6, totalPages: 1 },
    };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const queryString = 'search=test';
    const result = await galleryService.getAllGalleries(2, undefined, queryString);

    expect(api.get).toHaveBeenCalledWith('/gallery?page=2&limit=6&search=test', { signal: undefined });
    expect(result).toEqual(mockData);
  });

  it('should pass signal to getAllGalleries', async () => {
    const mockSignal = {} as AbortSignal;
    const mockData: IGalleryListResponse = { data: [], meta: { total: 0, page: 1, limit: 6, totalPages: 0 } };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    await galleryService.getAllGalleries(1, mockSignal);

    expect(api.get).toHaveBeenCalledWith('/gallery?page=1&limit=6', { signal: mockSignal });
  });

  it('should build query string correctly', async () => {
    const mockData: IGalleryListResponse = { data: [], meta: { total: 0, page: 3, limit: 6, totalPages: 1 } };
    (api.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await galleryService.getAllGalleries(3, undefined, 'search=test&role=ADMIN');

    expect(api.get).toHaveBeenCalledWith('/gallery?page=3&limit=6&search=test&role=ADMIN', { signal: undefined });
    expect(result).toEqual(mockData);
  });

  it('should throw error if getAllGalleries fails', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));
    await expect(galleryService.getAllGalleries()).rejects.toThrow('Network error');
  });

  it('should create a gallery', async () => {
    const createData: TypeCreateGalleryScheme = { title: 'New', description: 'New gallery description' };
    (api.post as jest.Mock).mockResolvedValue({ data: { id: '1', ...createData, role: UserRole.REGULAR } });

    await galleryService.createGallery(createData);

    expect(api.post).toHaveBeenCalledWith('/gallery', createData);
  });

  it('should throw error if createGallery fails', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Create failed'));
    const createData: TypeCreateGalleryScheme = { title: 'New', description: 'New gallery description' };
    await expect(galleryService.createGallery(createData)).rejects.toThrow('Create failed');
  });

  it('should fetch a gallery by id', async () => {
    const gallery: IGallery = { id: '1', title: 'Gallery1', description: 'Desc', role: UserRole.REGULAR };
    (api.get as jest.Mock).mockResolvedValue({ data: gallery });

    const result = await galleryService.getGallery('1');

    expect(api.get).toHaveBeenCalledWith('/gallery/1');
    expect(result).toEqual(gallery);
  });

  it('should throw error if getGallery fails', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Not found'));
    await expect(galleryService.getGallery('invalid-id')).rejects.toThrow('Not found');
  });

  it('should update a gallery', async () => {
    const updateData: TypeUpdateGalleryScheme = { title: 'Updated', description: 'Updated description' };
    (api.put as jest.Mock).mockResolvedValue({ data: { id: '1', ...updateData, role: UserRole.REGULAR } });

    await galleryService.updateGallery('1', updateData);

    expect(api.put).toHaveBeenCalledWith('/gallery/1', updateData);
  });

  it('should throw error if updateGallery fails', async () => {
    (api.put as jest.Mock).mockRejectedValue(new Error('Update failed'));
    const updateData: TypeUpdateGalleryScheme = { title: 'Updated', description: 'Updated description' };
    await expect(galleryService.updateGallery('1', updateData)).rejects.toThrow('Update failed');
  });

  it('should delete a gallery', async () => {
    (api.delete as jest.Mock).mockResolvedValue({ data: true });

    await galleryService.deleteGallery('1');

    expect(api.delete).toHaveBeenCalledWith('/gallery/1');
  });

  it('should throw error if deleteGallery fails', async () => {
    (api.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));
    await expect(galleryService.deleteGallery('1')).rejects.toThrow('Delete failed');
  });
});
