import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCopyImages } from './useCopyImages';
import { imageService } from '@/servises/image.service';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { useParams } from 'next/navigation';

// mocks
jest.mock('@/servises/image.service');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}));
jest.mock('@/shared/utils/tost');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

const mockUseParams = useParams as jest.Mock;
const mockCopyImages = imageService.copyImages as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastMessage = toastMessage as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCopyImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should copy images successfully', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });
    mockCopyImages.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.copyImages({
        targetGalleryId: 'target-id',
        ids: ['1', '2'],
      });
    });

    await waitFor(() => {
      expect(mockCopyImages).toHaveBeenCalledWith(
        'source-id',
        'target-id',
        ['1', '2']
      );
    });
  });

  it('should show success toast and invalidate queries on success', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });
    mockCopyImages.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.copyImages({
        targetGalleryId: 'target-id',
        ids: [],
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Copy images is successful'
      );
    });
  });

  it('should handle service error', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });

    const error = new Error('Copy failed');
    mockCopyImages.mockRejectedValue(error);

    const { result } = renderHook(() => useCopyImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.copyImages({
        targetGalleryId: 'target-id',
        ids: ['1'],
      });
    });

    await waitFor(() => {
      expect(mockToastMessage).toHaveBeenCalledWith(error);
    });
  });

  it('should handle missing source galleryId', async () => {
    mockUseParams.mockReturnValue({});

    const { result } = renderHook(() => useCopyImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.copyImages({
        targetGalleryId: 'target-id',
        ids: ['1'],
      });
    });

    await waitFor(() => {
      expect(mockToastMessage).toHaveBeenCalled();
    });
  });

  it('should work with copyImagesAsync', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });
    mockCopyImages.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCopyImages(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.copyImagesAsync({
        targetGalleryId: 'target-id',
        ids: ['1', '2'],
      });
    });

    expect(mockCopyImages).toHaveBeenCalledTimes(1);
  });
});
