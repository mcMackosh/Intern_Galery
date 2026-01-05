'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ImageList } from './image_list/ImageList';
import { ImageToolbar } from './image_toolbar/ImageToolbar';
import { ImageViewerModal } from './image_modal/ImageViewerModal';
import { useGetImagesInfinite } from '../../hooks/useGetImages';
import { Image, SelectedImagesDto } from '@/types/image';
import { ImageSortSelect } from '../image_sort/ImageSortSelect';

export const ImageGallerySection = () => {
    const searchParams = useSearchParams();
    const [selectedIds, setSelectedIds] = useState<SelectedImagesDto>({ ids: [] });
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const sortOrder = searchParams.get('sort') as 'dateAsc' | 'dateDesc' || 'dateDesc';

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetImagesInfinite(20, sortOrder);

    const imagesByDate = useMemo(() => {
        const allPages = data?.pages ?? [];
        const grouped: Record<string, Image[]> = {};

        allPages.forEach(page => {
            Object.entries(page.items).forEach(([date, imgs]) => {
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(...imgs);
            });
        });

        Object.keys(grouped).forEach(date => {
            grouped[date] = Array.from(new Map(grouped[date].map(img => [img.id, img])).values());
        });

        return grouped;
    }, [data]);

    const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
        const ids = prev.ids;
        const newIds = ids.includes(id)
            ? ids.filter(x => x !== id)
            : [...ids, id];
        return { ids: newIds };
    });
}, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 px-4">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Images
                </h2>
                <ImageSortSelect value={sortOrder} onChange={() => setSelectedIds({ ids: [] })} />
            </div>

            <ImageToolbar
                selectedIds={selectedIds}
                reset={() => setSelectedIds({ ids: [] })}
            />

            <ImageList
                imagesByDate={imagesByDate}
                selectedIds={selectedIds}
                onSelect={toggleSelect}
                onOpen={setViewerIndex}
                isLoading={isLoading || isFetchingNextPage}
                hasMore={!!hasNextPage}
                onLoadMore={fetchNextPage}
            />

            {viewerIndex !== null && (
                <ImageViewerModal
                    images={Object.values(imagesByDate).flat()}
                    index={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                    onNext={() => {
                        setViewerIndex(i => {
                            if (i === null) return 0;
                            const nextIndex = i + 1;
                            if (nextIndex >= Object.values(imagesByDate).flat().length - 4 && hasNextPage) {
                                fetchNextPage();
                            }
                            return Math.min(nextIndex, Object.values(imagesByDate).flat().length - 1);
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
