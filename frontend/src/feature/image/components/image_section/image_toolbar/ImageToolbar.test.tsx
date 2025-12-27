import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ImageToolbar } from './ImageToolbar';
import { useCopyImages } from '@/feature/image/hooks/useCopyImages';
import { useMoveImages } from '@/feature/image/hooks/useMoveImages';
import { useDeleteImages } from '@/feature/image/hooks/useDeleteImage';

jest.mock('@/feature/image/hooks/useCopyImages');
jest.mock('@/feature/image/hooks/useMoveImages');
jest.mock('@/feature/image/hooks/useDeleteImage');
jest.mock('../image_modal/GallerySelectModal', () => ({
  GallerySelectModal: jest.fn(({ onClose, onSelect }) => (
    <div data-testid="gallery-select-modal">
      <button onClick={() => onSelect('gallery-1')}>Select Gallery</button>
      <button onClick={onClose}>Close</button>
    </div>
  )),
}));
jest.mock('@/shared/ui/Modal/BaseModal', () => ({
  BaseModal: ({ children }: any) => <div data-testid="base-modal">{children}</div>,
}));

const mockUseCopyImages = useCopyImages as jest.Mock;
const mockUseMoveImages = useMoveImages as jest.Mock;
const mockUseDeleteImages = useDeleteImages as jest.Mock;

describe('ImageToolbar', () => {
  const reset = jest.fn();
  const selectedIds = ['1', '2'];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCopyImages.mockReturnValue({ copyImages: jest.fn(), isLoading: false });
    mockUseMoveImages.mockReturnValue({ moveImages: jest.fn(), isLoading: false });
    mockUseDeleteImages.mockReturnValue({ deleteImages: jest.fn(), isLoading: false });
  });

  it('renders buttons and selected count', () => {
    render(<ImageToolbar selectedIds={selectedIds} reset={reset} />);

    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('opens GallerySelectModal on Copy and Move click', async () => {
    render(<ImageToolbar selectedIds={selectedIds} reset={reset} />);

    fireEvent.click(screen.getByText('Copy'));
    expect(screen.getByTestId('gallery-select-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    fireEvent.click(screen.getByText('Move'));
    expect(screen.getByTestId('gallery-select-modal')).toBeInTheDocument();
  });

  it('calls copyImages when selecting gallery after Copy', async () => {
    const copyImages = jest.fn();
    mockUseCopyImages.mockReturnValue({ copyImages, isLoading: false });

    render(<ImageToolbar selectedIds={selectedIds} reset={reset} />);

    fireEvent.click(screen.getByText('Copy'));
    fireEvent.click(screen.getByText('Select Gallery'));

    await waitFor(() => {
      expect(copyImages).toHaveBeenCalledWith({ targetGalleryId: 'gallery-1', ids: selectedIds });
      expect(reset).toHaveBeenCalled();
    });
  });

  it('calls moveImages when selecting gallery after Move', async () => {
    const moveImages = jest.fn();
    mockUseMoveImages.mockReturnValue({ moveImages, isLoading: false });

    render(<ImageToolbar selectedIds={selectedIds} reset={reset} />);

    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Select Gallery'));

    await waitFor(() => {
      expect(moveImages).toHaveBeenCalledWith({ targetGalleryId: 'gallery-1', ids: selectedIds });
      expect(reset).toHaveBeenCalled();
    });
  });

  it('opens confirm modal on Delete click and calls deleteImages on confirm', async () => {
    const deleteImages = jest.fn();
    mockUseDeleteImages.mockReturnValue({ deleteImages, isLoading: false });

    render(<ImageToolbar selectedIds={selectedIds} reset={reset} />);

    fireEvent.click(screen.getByText('Delete'));

    const modal = screen.getByTestId('base-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();

    fireEvent.click(within(modal).getByText('Delete'));

    await waitFor(() => {
      expect(deleteImages).toHaveBeenCalledWith(selectedIds);
      expect(reset).toHaveBeenCalled();
    });
  });

  it('calls reset button', () => {
    render(<ImageToolbar selectedIds={selectedIds} reset={reset} />);
    fireEvent.click(screen.getByText('Reset'));
    expect(reset).toHaveBeenCalled();
  });

  it('renders nothing if no selectedIds', () => {
    const { container } = render(<ImageToolbar selectedIds={[]} reset={reset} />);
    expect(container.firstChild).toBeNull();
  });
});