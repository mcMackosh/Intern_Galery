import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGalleries } from './useGallery';
import { galleryService } from '../../../servises/gallery.service';
import { IGalleryListResponse } from '@/types/gallery';

jest.mock('../../../servises/gallery.service');
const mockedGalleryService = galleryService as jest.Mocked<typeof galleryService>;

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));
import { useSearchParams } from 'next/navigation';
import { UserRole } from '@/types/membership';
const mockedUseSearchParams = useSearchParams as jest.Mock;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
);

describe('useGalleries', () => {
  const mockData: IGalleryListResponse = {
    data: [
      { id: '1', title: 'Gallery 1', description: 'Desc 1', role: UserRole.ADMIN, images: [] },
      { id: '2', title: 'Gallery 2', description: 'Desc 2', role: UserRole.REGULAR, images: [] },
    ],
    meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSearchParams.mockReturnValue({
      toString: () => '',
    } as any);
  });

  it('should return data on successful fetch', async () => {
    mockedGalleryService.getAllGalleries.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGalleries(1), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockData.data));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.meta).toEqual(mockData.meta);
    expect(mockedGalleryService.getAllGalleries).toHaveBeenCalledWith(
      1,
      expect.any(AbortSignal),
      ''
    );
  });

  it('should set isError true on failure', async () => {
    mockedGalleryService.getAllGalleries.mockRejectedValue(new Error('Failed fetch'));

    const { result } = renderHook(() => useGalleries(1), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.meta).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle query string from useSearchParams', async () => {
    mockedUseSearchParams.mockReturnValue({
      toString: () => 'filter=test',
    } as any);

    mockedGalleryService.getAllGalleries.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGalleries(1), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockData.data));

    expect(mockedGalleryService.getAllGalleries).toHaveBeenCalledWith(
      1,
      expect.any(AbortSignal),
      'filter=test'
    );
  });

  it('should call refetch function', async () => {
    mockedGalleryService.getAllGalleries.mockResolvedValue(mockData);

    const { result } = renderHook(() => useGalleries(1), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockData.data));

    mockedGalleryService.getAllGalleries.mockResolvedValue({
      data: [{ id: '3', title: 'Gallery 3', description: 'Desc 3', role: UserRole.REGULAR, images: []}],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    });

    await result.current.refetch();

    await waitFor(() =>
      expect(result.current.data).toEqual([
        { id: '3', title: 'Gallery 3', description: 'Desc 3', role: UserRole.REGULAR, images: []},
      ])
    );
  });
});