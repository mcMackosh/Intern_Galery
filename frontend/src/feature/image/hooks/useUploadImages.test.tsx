import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUploadImages } from './useUploadImages';
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

const mockUploadImages = imageService.uploadImages as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastMessage = toastMessage as jest.Mock;
const mockUseParams = useParams as jest.Mock;

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

describe('useUploadImages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should upload images successfully', async () => {
    mockUseParams.mockReturnValue({ galleryId: '123' });

    const files = [new File(['img'], 'test.png')];
    const response = [
      {
        id: '1',
        galleryId: '123',
        path: '/img.png',
        originalFilename: 'test.png',
        createdAt: new Date(),
      },
    ];

    mockUploadImages.mockResolvedValue(response);

    const { result } = renderHook(() => useUploadImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate(files);
    });

    await waitFor(() => {
      expect(mockUploadImages).toHaveBeenCalledWith('123', files);
    });
  });

  it('should invalidate queries and show success toast on success', async () => {
    mockUseParams.mockReturnValue({ galleryId: '123' });

    mockUploadImages.mockResolvedValue([]);

    const { result } = renderHook(() => useUploadImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate([]);
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Upload is successful');
    });
  });

  it('should handle service error', async () => {
    mockUseParams.mockReturnValue({ galleryId: '123' });

    const error = new Error('Upload failed');
    mockUploadImages.mockRejectedValue(error);

    const { result } = renderHook(() => useUploadImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate([]);
    });

    await waitFor(() => {
      expect(mockToastMessage).toHaveBeenCalledWith(error);
    });
  });

  it('should throw error if galleryId is missing', async () => {
    mockUseParams.mockReturnValue({});

    const { result } = renderHook(() => useUploadImages(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate([]);
    });

    await waitFor(() => {
      expect(mockToastMessage).toHaveBeenCalled();
    });
  });
});
