import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadImagesSection from '../upload/UploadImagesPage';
import { useRouter, useParams } from 'next/navigation';
import { useUploadImages } from '../../hooks/useUploadImages';
import { useMyProfile } from '@/feature/profile/hooks/useMyProfile';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('../../hooks/useUploadImages');
jest.mock('@/feature/profile/hooks/useMyProfile');

jest.mock('../upload/UploadDropzone', () => ({
    UploadDropzone: ({ 'data-testid': testId }: any) => (
        <div data-testid={testId}>Dropzone</div>
    ),
}));

jest.mock('../upload/UploadPreviewGrid', () => ({
    UploadPreviewGrid: ({ 'data-testid': testId }: any) => (
        <div data-testid={testId}>PreviewGrid</div>
    ),
}));

jest.mock('../upload/UploadActions', () => ({
    UploadActions: ({
        onCancel,
        onUpload,
        disabled,
        isLoading,
        cancelTestId,
        uploadTestId,
    }: any) => (
        <div>
            <button
                data-testid={cancelTestId}
                onClick={onCancel}
            >
                Cancel
            </button>

            <button
                data-testid={uploadTestId}
                onClick={onUpload}
                aria-disabled={disabled}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    ),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseUploadImages = useUploadImages as jest.Mock;
const mockUseMyProfile = useMyProfile as jest.Mock;

describe('UploadImagesSection (unit)', () => {
    const back = jest.fn();
    const push = jest.fn();
    const uploadMutate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseRouter.mockReturnValue({
            back,
            push,
        });

        mockUseParams.mockReturnValue({
            galleryId: '123',
        });

        mockUseUploadImages.mockReturnValue({
            mutate: uploadMutate,
            isPending: false,
        });

        mockUseMyProfile.mockReturnValue({
            data: { id: '1', name: 'User' },
            isPending: false,
        });
    });

    it('renders section and child components', () => {
        render(<UploadImagesSection />);

        expect(screen.getByTestId('upload-images-section')).toBeInTheDocument();
        expect(screen.getByTestId('upload-title'))
            .toHaveTextContent('Upload images');

        expect(screen.getByTestId('upload-dropzone')).toBeInTheDocument();
        expect(screen.getByTestId('upload-preview-grid')).toBeInTheDocument();
        expect(screen.getByTestId('upload-button')).toBeInTheDocument();
    });

    it('disables upload button when no files', () => {
        render(<UploadImagesSection />);

        expect(screen.getByTestId('upload-button'))
            .toHaveAttribute('aria-disabled', 'true');
    });

    it('calls router.back when cancel button is clicked', () => {
        render(<UploadImagesSection />);

        fireEvent.click(screen.getByTestId('cancel-button'));

        expect(back).toHaveBeenCalledTimes(1);
    });

    it('does not upload when no files', () => {
        render(<UploadImagesSection />);

        fireEvent.click(screen.getByTestId('upload-button'));

        expect(uploadMutate).not.toHaveBeenCalled();
        expect(push).not.toHaveBeenCalled();
    });

    it('uploads files and redirects when upload is triggered', async () => {
        uploadMutate.mockResolvedValueOnce(undefined); // ✅ КРИТИЧНО

        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [
                [new File(['img'], 'test.png', { type: 'image/png' })],
                jest.fn(),
            ]);

        render(<UploadImagesSection />);

        fireEvent.click(screen.getByTestId('upload-button'));

        await waitFor(() => {
            expect(uploadMutate).toHaveBeenCalledTimes(1);
            expect(push).toHaveBeenCalledWith('/gallery/123');
        });
    });

    it('shows loading state on upload button', () => {
        mockUseUploadImages.mockReturnValue({
            mutate: uploadMutate,
            isPending: true,
        });

        render(<UploadImagesSection />);

        const uploadButton = screen.getByTestId('upload-button');

        expect(uploadButton).toHaveTextContent('Uploading...');
        expect(uploadButton).toHaveAttribute('aria-disabled', 'true');
    });
});