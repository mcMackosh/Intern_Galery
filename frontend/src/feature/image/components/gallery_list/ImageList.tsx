'use client'

import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ImageItem from './ImageItem';
import ImageModal from './ImageModal';
import { useGetImages } from '../../hooks/useGetImages';
import { Image } from '@/types/image';

const ImageList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [images, setImages] = useState<Image[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const limit = 20;

    const { data, isLoading, isError } = useGetImages(page, limit);

    useEffect(() => {
        if (data?.items) {
            setImages(prev => {
                const existingIds = new Set(prev.map(i => i.id));
                const newItems = data.items.filter(i => !existingIds.has(i.id));
                return [...prev, ...newItems];
            });
        }
    }, [data]);

    const loadMore = useCallback(() => {
        if (data && page < data.totalPages) {
            setPage(prev => prev + 1);
        }
    }, [data, page]);

    const openModal = useCallback((index: number) => setSelectedIndex(index), []);
    const closeModal = useCallback(() => setSelectedIndex(null), []);

    const showPrev = useCallback(() => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    }, [selectedIndex]);

    const showNext = useCallback(() => {
        if (selectedIndex !== null) {
            if (selectedIndex < images.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            } else if (page < (data?.totalPages ?? 0)) {
                setPage(prev => prev + 1);
            }
        }
    }, [selectedIndex, images.length, page, data]);

    if (isLoading && page === 1) return <p>Loading images...</p>;
    if (isError) return <p>Error loading images.</p>;

    return (
        <div className="image-list-container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <InfiniteScroll
                dataLength={images.length}
                next={loadMore}
                hasMore={page < (data?.totalPages ?? 0)}
                loader={<p className="text-center mt-6">Loading more images...</p>}
                endMessage={
                    <p className="text-center mt-6 text-gray-500">
                        All images are downloaded
                    </p>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img, index) => (
                        <div key={img.id} onClick={() => openModal(index)}>
                            <ImageItem image={img} />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>

            {selectedIndex !== null && (
                <ImageModal
                    images={images}
                    selectedIndex={selectedIndex}
                    onClose={closeModal}
                    onPrev={showPrev}
                    onNext={showNext}
                />
            )}
        </div>
    );
};

export default ImageList;