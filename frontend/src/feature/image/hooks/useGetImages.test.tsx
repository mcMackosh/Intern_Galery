import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetImagesInfinite } from './useGetImages';
import { imageService } from '@/servises/image.service';
import { useParams } from 'next/navigation';
import { SERVER_URL } from '@/env';

jest.mock('@/servises/image.service');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

const mockUseParams = useParams as jest.Mock;
const mockGetImagesByGallery = imageService.getImagesByGallery as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetImagesInfinite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and transform images with full path', async () => {
    mockUseParams.mockReturnValue({ galleryId: '123' });

    const apiResponse = {
      page: 1,
      totalPages: 2,
      items: {
        '2025-12-27': [
          { id: '1', galleryId: '123', path: 'img1.png', originalFilename: 'img1.png', createdAt: new Date() },
        ],
      },
    };

    mockGetImagesByGallery.mockResolvedValue(apiResponse);

    const { result } = renderHook(() => useGetImagesInfinite(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.pages[0].items['2025-12-27'][0].path).toBe(
        `img1.png`
      );
    });
  });

  it('should handle ascending sort', async () => {
    mockUseParams.mockReturnValue({ galleryId: '123' });

    const apiResponse = {
      page: 1,
      totalPages: 1,
      items: {},
    };
    mockGetImagesByGallery.mockResolvedValue(apiResponse);

    renderHook(() => useGetImagesInfinite(20, 'dateAsc'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockGetImagesByGallery).toHaveBeenCalledWith('123', 1, 20, 'asc');
    });
  });

  it('should determine next page correctly', () => {
    const lastPage = { page: 2, totalPages: 2, items: {} };
    const getNextPageParam = (page: typeof lastPage) =>
      page.page >= page.totalPages ? undefined : page.page + 1;

    const nextPage = getNextPageParam(lastPage);
    expect(nextPage).toBeUndefined();
  });

  it('should not run query if galleryId is missing', async () => {
    mockUseParams.mockReturnValue({});

    const { result } = renderHook(() => useGetImagesInfinite(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
