'use client'

import React, { memo } from 'react';
import { Image } from '@/types/image';
import ImageNext from 'next/image';

interface ImageModalProps {
    images: Image[];
    selectedIndex: number;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ images, selectedIndex, onClose, onPrev, onNext }) => {
    const image = images[selectedIndex];

    if (!image) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button
                onClick={e => { e.stopPropagation(); onPrev(); }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2"
            >
                ◀
            </button>

            <ImageNext
                src={'http://127.0.0.1:4000/uploads/' + image.path}
                alt={image.originalFilename || 'Gallery image'}
                width={1200}
                height={800}
                className="max-h-full max-w-full rounded-lg shadow-lg"
                loader={({ src }) => src}
            />

            <button
                onClick={e => { e.stopPropagation(); onNext(); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2"
            >
                ▶
            </button>
        </div>
    );
};

export default memo(ImageModal);
