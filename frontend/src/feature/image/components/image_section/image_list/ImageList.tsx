'use client';

import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Image } from '@/types/image';
import { ImageCard } from './ImageCard';

interface Props {
  imagesByDate: Record<string, Image[]>;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onOpen: (index: number) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export const ImageList: React.FC<Props> = ({
  imagesByDate,
  selectedIds,
  onSelect,
  onOpen,
  hasMore,
  onLoadMore,
}) => {
  const allImages = Object.values(imagesByDate).flat();

  return (
    <InfiniteScroll
      dataLength={allImages.length}
      next={onLoadMore}
      hasMore={hasMore}
      scrollThreshold={0.9}
      loader={
        <div className="py-6 text-center text-sm text-muted-foreground">
          Loading...
        </div>
      }
      endMessage={
        <div className="py-6 text-center text-sm text-muted-foreground">
          Its all images
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {Object.entries(imagesByDate).map(([date, images]) => (
          <div key={date}>
            <div className="flex justify-center mb-4">
              <span className="bg-blue-600 text-white font-semibold text-sm md:text-base px-5 py-2 rounded-full shadow-md">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 px-10">
              {images.map((img, index) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  selected={selectedIds.includes(img.id)}
                  onSelect={() => onSelect(img.id)}
                  onOpen={() => onOpen(index)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};
