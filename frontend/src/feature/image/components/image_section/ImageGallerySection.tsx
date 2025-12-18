'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ImageList } from './image_list/ImageList';
import { ImageToolbar } from './image_toolbar/ImageToolbar';
import { ImageViewerModal } from './image_modal/ImageViewerModal';
import { useGetImagesInfinite } from '../../hooks/useGetImages';

export const ImageGallerySection = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetImagesInfinite();

    const images = useMemo(() => {
        const all = data?.pages.flatMap(page => page.items) ?? [];
        const unique = Array.from(new Map(all.map(img => [img.id, img])).values());
        return unique;
    }, [data]);

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center">
                <h2 className="
                        text-2xl font-semibold
                      text-gray-900
                        tracking-tight">
                    Images
                </h2>
            </div>
            <ImageToolbar
                selectedIds={selectedIds}
                reset={() => setSelectedIds([])}
            />

            <ImageList
                images={images}
                selectedIds={selectedIds}
                onSelect={toggleSelect}
                onOpen={setViewerIndex}
                isLoading={isLoading || isFetchingNextPage}
                hasMore={!!hasNextPage}
                onLoadMore={fetchNextPage}
            />

            {viewerIndex !== null && (
                <ImageViewerModal
                    images={images}
                    index={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                    onNext={() => {
                        setViewerIndex(i => {
                            if (i === null) return 0;

                            const nextIndex = i + 1;
                            if (nextIndex >= images.length - 4 && hasNextPage) {
                                fetchNextPage();
                            }

                            return Math.min(nextIndex, images.length - 1);
                        });
                    }}
                    onPrev={() =>
                        setViewerIndex(i =>
                            Math.max((i ?? 0) - 1, 0)
                        )
                    }
                />
            )}
        </div>
    );
};
