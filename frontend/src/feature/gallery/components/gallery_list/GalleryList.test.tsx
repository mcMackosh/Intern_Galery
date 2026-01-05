/* ---------- IMPORTS ---------- */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import GalleryList from './GalleryList';
import { useGalleries } from '../../hooks/useGallery';
import { useSelector } from 'react-redux';

jest.mock('../../hooks/useGallery');

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

jest.mock('./GalleryCard', () => ({
  __esModule: true,
  default: ({ gallery }: any) => (
    <div data-testid="gallery-card">{gallery.id}</div>
  ),
}));

jest.mock('./GalleryFilters', () => ({
  __esModule: true,
  default: () => <div data-testid="filters" />,
}));

jest.mock('@/shared/ui/Buton', () => ({
  __esModule: true,
  default: ({ onClick, children }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock('./Pagination', () => ({
  __esModule: true,
  PaginationComponent: ({ totalPages }: any) => (
    <div data-testid="pagination">{totalPages}</div>
  ),
}));

const mockedUseSelector = jest.mocked(useSelector);

describe('GalleryList', () => {
  const mockUseSelector = mockedUseSelector;
  const mockUseGalleries = useGalleries as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockReturnValue(1);
  });

  describe('GalleryList', () => {
    it('shows loader while loading', async () => {
      mockUseGalleries.mockReturnValue({
        data: null,
        meta: null,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
      });

      render(<GalleryList />);

      const loader = await screen.findByTestId('loader');
      expect(loader).toBeInTheDocument();
    });
  });

  it('shows error and retry button on error', () => {
    const refetchMock = jest.fn();

    mockUseGalleries.mockReturnValue({
      data: null,
      meta: null,
      isLoading: false,
      isError: true,
      refetch: refetchMock,
    });

    render(<GalleryList />);

    expect(
      screen.getByText(/error loading galleries/i)
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /retry/i })
    );

    expect(refetchMock).toHaveBeenCalledTimes(1);
  });

  it('renders galleries, filters and pagination', () => {
    mockUseGalleries.mockReturnValue({
      data: [{ id: '1' }, { id: '2' }],
      meta: { total: 2, page: 1, limit: 10, totalPages: 3 },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<GalleryList />);

    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getAllByTestId('gallery-card')).toHaveLength(2);
    expect(screen.getByTestId('pagination')).toHaveTextContent('3');
  });

  it('shows "No pages" message when totalPages is zero', () => {
    mockUseGalleries.mockReturnValue({
      data: [{ id: '1' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 0 },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    render(<GalleryList />);

    expect(screen.getByText(/no pages/i)).toBeInTheDocument();
  });
});
