import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GallerySelectModal } from './GallerySelectModal';
import { useGalleries } from '@/feature/gallery/hooks/useGallery';
import { useParams } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('@/feature/gallery/hooks/useGallery');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

const mockUseGalleries = useGalleries as jest.Mock;
const mockUseParams = useParams as jest.Mock;

describe('GallerySelectModal', () => {
  const onClose = jest.fn();
  const onSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    mockUseGalleries.mockReturnValue({ data: null, isLoading: true, isError: false, meta: null });
    render(<GallerySelectModal onClose={onClose} onSelect={onSelect} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseGalleries.mockReturnValue({ data: null, isLoading: false, isError: true, meta: null });
    render(<GallerySelectModal onClose={onClose} onSelect={onSelect} />);
    expect(screen.getByText('Error loading galleries')).toBeInTheDocument();
  });

  it('renders gallery list and handles selection', () => {
    mockUseParams.mockReturnValue({ galleryId: '1' });
    mockUseGalleries.mockReturnValue({
      data: [
        { id: '1', title: 'Gallery 1', role: 'Admin' },
        { id: '2', title: 'Gallery 2', role: 'Member' },
      ],
      isLoading: false,
      isError: false,
      meta: { totalPages: 1 },
    });

    render(<GallerySelectModal onClose={onClose} onSelect={onSelect} />);

    expect(screen.getByTestId('current-gallery')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('gallery-item-1'));
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('gallery-item-2'));
    expect(onSelect).toHaveBeenCalledWith('2');
  });

  it('handles pagination buttons', () => {
    mockUseParams.mockReturnValue({ galleryId: '1' });
    mockUseGalleries.mockReturnValue({
      data: [
        { id: '1', title: 'Gallery 1', role: 'Admin' },
        { id: '2', title: 'Gallery 2', role: 'Member' },
      ],
      isLoading: false,
      isError: false,
      meta: { totalPages: 3 },
    });

    render(<GallerySelectModal onClose={onClose} onSelect={onSelect} />);

    const nextBtn = screen.getByTestId('paginate-next');
    const prevBtn = screen.getByTestId('paginate-prev');

    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    fireEvent.click(prevBtn);
  });

  it('renders modal title', () => {
    mockUseGalleries.mockReturnValue({ data: [], isLoading: false, isError: false, meta: null });
    render(<GallerySelectModal onClose={onClose} onSelect={onSelect} />);
    expect(screen.getByTestId('gallery-title')).toBeInTheDocument();
    expect(screen.getByTestId('gallery-title')).toHaveTextContent('Pick a Gallery');
  });
});
