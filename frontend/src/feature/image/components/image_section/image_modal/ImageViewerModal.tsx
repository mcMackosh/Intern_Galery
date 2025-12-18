'use client';

import React from 'react';
import Image from 'next/image';
import { Image as ImageType } from '@/types/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    images: ImageType[];
    index: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const ImageViewerModal: React.FC<Props> = ({
    images,
    index,
    onClose,
    onNext,
    onPrev,
}) => {
    const image = images[index];
    if (!image) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <div
                className="absolute inset-0 bg-black/70"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center">
                <div className="absolute -top-16 right-0 z-20 flex items-center justify-between sm:top-4 sm:right-4">
                    <button
                        onClick={onClose}
                        className="rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-105 active:scale-95"
                        aria-label="Close image viewer"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="relative flex w-[1000px] h-[700px] items-center justify-center overflow-hidden rounded-xl bg-black/30">
                    <Image
                        src={image.path.replace(/\\/g, '/')}
                        alt={image.originalFilename}
                        width={1000}
                        height={700}
                        className="w-[1000px] h-[700px] object-cover"
                        unoptimized
                        priority
                    />
                </div>

                {index > 0 && (
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-105 active:scale-95 sm:left-6"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10" />
                    </button>
                )}

                {index < images.length - 1 && (
                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70 hover:scale-105 active:scale-95 sm:right-6"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />
                    </button>
                )}

                <div className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    <span>
                        {index + 1}
                    </span>
                </div>
            </div>
        </div>
    );
};