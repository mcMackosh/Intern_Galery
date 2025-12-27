'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UploadPreviewGrid } from './UploadPreviewGrid';
import { UploadActions } from './UploadActions';
import { UploadDropzone } from './UploadDropzone';
import { useUploadImages } from '../../hooks/useUploadImages';
import { useMyProfile } from '@/feature/profile/hooks/useMyProfile';

const UploadImagesSection: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const galleryId = params.galleryId as string;

    const [files, setFiles] = useState<File[]>([]);
    const { data, isPending } = useMyProfile();

    const { mutate: uploadImages, isPending: isLoading } = useUploadImages();

    const handleUpload = async () => {
        if (!files.length) return;
        await uploadImages(files);
        router.push(`/gallery/${galleryId}`);
    };

    return (
        <div
            className="max-w-6xl mx-auto p-6 space-y-6"
            data-testid="upload-images-section"
        >
            <h1
                className="text-2xl font-semibold"
                data-testid="upload-title"
            >
                Upload images
            </h1>

            <UploadDropzone
                files={files}
                setFiles={setFiles}
                data-testid="upload-dropzone"
            />

            <UploadPreviewGrid
                files={files}
                setFiles={setFiles}
                data-testid="upload-preview-grid"
            />

            <UploadActions
                disabled={!files.length || isLoading}
                onCancel={() => router.back()}
                onUpload={handleUpload}
                isLoading={isLoading}
                cancelTestId="cancel-button"
                uploadTestId="upload-button"
            />
        </div>
    );
};

export default UploadImagesSection;
