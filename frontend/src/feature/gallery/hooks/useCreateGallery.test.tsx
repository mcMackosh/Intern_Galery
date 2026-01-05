import { renderHook, act, waitFor } from '@testing-library/react';
import { useCreateGallery } from './useCreateGallery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { galleryService } from '../../../servises/gallery.service';
import { toast } from 'sonner';
import { toastMessage } from '@/shared/utils/tost';
import { UserRole } from '@/types/membership';
import { IGallery } from '@/types/gallery';

jest.mock('../../../servises/gallery.service');
jest.mock('sonner');
jest.mock('@/shared/utils/tost');

describe('useCreateGallery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('optimistically adds gallery and calls success toast', async () => {
    const newGallery = { title: 'Test', description: 'Desc' };
    (galleryService.createGallery as jest.Mock).mockResolvedValue(undefined);

    queryClient.setQueryData<IGallery[]>(['galleries'], []);

    const { result } = renderHook(() => useCreateGallery(), { wrapper });

    act(() => result.current.createGallery(newGallery));

    await waitFor(() => {
      const data = queryClient.getQueryData<IGallery[]>(['galleries']);
      expect(data?.[0]).toMatchObject({
        title: 'Test',
        description: 'Desc',
        role: UserRole.ADMIN,
      });
      expect(data?.[0].id).toMatch(/^temp-/);
    });

    await waitFor(() => expect(galleryService.createGallery).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Gallery created successfully!');
  });

  it('rolls back data on error and calls toastMessage', async () => {
    const previousData: IGallery[] = [
      { id: '1', title: 'Old', description: 'Old Desc', role: UserRole.ADMIN, images: [] },
    ];
    queryClient.setQueryData(['galleries'], previousData);

    const newGallery = { title: 'Test', description: 'Desc' };
    (galleryService.createGallery as jest.Mock).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useCreateGallery(), { wrapper });

    act(() => result.current.createGallery(newGallery));

    await waitFor(() => expect(galleryService.createGallery).toHaveBeenCalled());

    const data = queryClient.getQueryData<IGallery[]>(['galleries']);
    expect(data).toEqual(previousData);

    expect(toastMessage).toHaveBeenCalled();
  });

  it('invalidates queries on settled', async () => {
    const newGallery = { title: 'Test', description: 'Desc' };
    (galleryService.createGallery as jest.Mock).mockResolvedValue(undefined);

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateGallery(), { wrapper });

    act(() => result.current.createGallery(newGallery));

    await waitFor(() => expect(galleryService.createGallery).toHaveBeenCalled());

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['galleries'] });
  });
});
