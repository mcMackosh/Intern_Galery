import { Image } from '@/types/image';
import ImageNext from 'next/image';
import React, { memo } from 'react';

interface ImageItemProps {
    image: Image;
}

const ImageItem: React.FC<ImageItemProps> = ({ image }) => {
    return (
        <div className="image-item group relative overflow-hidden rounded-xl shadow-lg border border-gray-200 transition-shadow duration-300">
            <ImageNext
                src={'http://127.0.0.1:4000/uploads/' + image.path}
                alt={image.originalFilename || 'Gallery image'}
                width={400}
                height={300}
                className="w-full h-64 object-cover rounded-t-xl transition-transform duration-300"
                loader={({ src }) => src}
            />

            <div className="p-3 bg-white rounded-b-xl">
                <p className="text-sm font-medium text-gray-800 truncate" title={image.originalFilename}>
                    {image.originalFilename}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {new Date(image.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default memo(ImageItem);