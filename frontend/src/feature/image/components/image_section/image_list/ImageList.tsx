'use client';

import React, { useCallback, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Image } from '@/types/image';
import { ImageCard } from './ImageCard';


interface Props {
  images: Image[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onOpen: (index: number) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export const ImageList: React.FC<Props> = ({
  images,
  selectedIds,
  onSelect,
  onOpen,
  hasMore,
  onLoadMore,
}) => {
  
  return (
    
    <InfiniteScroll
      dataLength={images.length}
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
      <div className="flex flex-wrap justify-center gap-4 px-10 md:px-10">
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
    </InfiniteScroll>
  );
};