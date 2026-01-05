
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GalleryCard from '../gallery_list/GalleryCard';
import { IGallery } from '@/types/gallery';
import { UserRole } from '@/types/membership';
import { useRouter } from 'next/navigation';
import { useDeleteGallery } from '../../hooks/useDeleteGallery';
const pushMock = jest.fn();
const deleteGalleryMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(() => ({})),
}));

jest.mock('../../hooks/useDeleteGallery', () => ({
  useDeleteGallery: jest.fn(),
}));

jest.mock('../gallery_page/EditGalleryForm', () => ({
  UpdateGalleryForm: () => <div data-testid="update-gallery-form" />,
}));

jest.mock('@/shared/ui/Modal/BaseModal', () => ({
  BaseModal: ({ children, isOpen, ...props }: any) =>
    isOpen ? <div data-testid={props['data-testid']}>{children}</div> : null,
}));

jest.mock('@/shared/ui/Buton', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('../../hooks/useOneGallery', () => ({
  useOneGallery: jest.fn(() => ({
    gallery: { id: '1', title: 'My Gallery', description: '', images: [] },
    isLoading: false,
  })),
}));

describe('GalleryCard', () => {
  const baseGallery: IGallery = {
    id: '1',
    title: 'Test Gallery',
    description: 'Test description',
    role: UserRole.REGULAR,
    images: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useDeleteGallery as jest.Mock).mockReturnValue({
      deleteGallery: deleteGalleryMock,
      isLoading: false,
    });
  });

  it('renders gallery basic info', () => {
    render(<GalleryCard gallery={baseGallery} />);

    expect(screen.getByText('Test Gallery')).toBeInTheDocument();
    expect(screen.getByTestId('gallery-role')).toHaveTextContent('REGULAR');
    expect(screen.getByTestId('gallery-card')).toBeInTheDocument();
  });

  it('navigates to gallery page on card click', () => {
    render(<GalleryCard gallery={baseGallery} />);

    fireEvent.click(screen.getByTestId('gallery-card'));

    expect(pushMock).toHaveBeenCalledWith('/gallery/1');
  });

  it('does not show edit/delete buttons for REGULAR role', () => {
    render(<GalleryCard gallery={baseGallery} />);

    expect(screen.queryByTestId('edit-gallery')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-gallery')).not.toBeInTheDocument();
  });

  it('shows edit button for ADMIN role', () => {
    render(
      <GalleryCard gallery={{ ...baseGallery, role: UserRole.ADMIN }} />
    );

    expect(screen.getByTestId('edit-gallery')).toBeInTheDocument();
    expect(screen.queryByTestId('delete-gallery')).not.toBeInTheDocument();
  });

  it('shows edit and delete buttons for OWNER role', () => {
    render(
      <GalleryCard gallery={{ ...baseGallery, role: UserRole.OWNER }} />
    );

    expect(screen.getByTestId('edit-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('delete-gallery')).toBeInTheDocument();
  });

  it('opens edit modal', async () => {
    render(<GalleryCard gallery={{ ...baseGallery, role: UserRole.ADMIN }} />);

    fireEvent.click(screen.getByTestId('edit-gallery'));

    expect(await screen.findByTestId('edit-gallery-modal')).toBeInTheDocument();
  });

  it('opens delete modal and confirms deletion', () => {
    render(
      <GalleryCard gallery={{ ...baseGallery, role: UserRole.OWNER }} />
    );

    fireEvent.click(screen.getByTestId('delete-gallery'));
    expect(
      screen.getByTestId('delete-gallery-modal')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('confirm-delete-gallery'));
    expect(deleteGalleryMock).toHaveBeenCalled();
  });
});
