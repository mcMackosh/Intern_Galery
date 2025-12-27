import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMoveImages } from './useMoveImages';
import { imageService } from '@/servises/image.service';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { useParams } from 'next/navigation';

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
const mockMoveImages = imageService.moveImages as jest.Mock;
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

describe('useMoveImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should move images successfully', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });
    mockMoveImages.mockResolvedValue(undefined);

    const { result } = renderHook(() => useMoveImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.moveImages({
        targetGalleryId: 'target-id',
        ids: ['1', '2'],
      });
    });

    await waitFor(() => {
      expect(mockMoveImages).toHaveBeenCalledWith(
        'source-id',
        'target-id',
        ['1', '2']
      );
    });
  });

  it('should show success toast on success', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });
    mockMoveImages.mockResolvedValue(undefined);

    const { result } = renderHook(() => useMoveImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.moveImages({
        targetGalleryId: 'target-id',
        ids: [],
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        'Moving images is successful'
      );
    });
  });

  it('should handle service error', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });

    const error = new Error('Move failed');
    mockMoveImages.mockRejectedValue(error);

    const { result } = renderHook(() => useMoveImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.moveImages({
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

    const { result } = renderHook(() => useMoveImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.moveImages({
        targetGalleryId: 'target-id',
        ids: ['1'],
      });
    });

    await waitFor(() => {
      expect(mockToastMessage).toHaveBeenCalled();
    });
  });

  it('should work with moveImagesAsync', async () => {
    mockUseParams.mockReturnValue({ galleryId: 'source-id' });
    mockMoveImages.mockResolvedValue(undefined);

    const { result } = renderHook(() => useMoveImages(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.moveImagesAsync({
        targetGalleryId: 'target-id',
        ids: ['1', '2'],
      });
    });

    expect(mockMoveImages).toHaveBeenCalledTimes(1);
  });
});
