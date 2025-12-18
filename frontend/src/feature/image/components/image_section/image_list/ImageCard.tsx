'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import { Image as ImageType } from '@/types/image';

interface Props {
    image: ImageType;
    selected: boolean;
    onSelect: () => void;
    onOpen: () => void;
}
const IC: React.FC<Props> = ({ image, selected, onSelect, onOpen }) => {
    return (
        <div className="relative w-64 rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg overflow-hidden group">
            <div className="relative w-full h-48 cursor-pointer overflow-hidden">
                <div className="relative w-64 h-48">
                   
                    <Image
                        src={image.path.replace(/\\/g, '/')}
                        alt={image.originalFilename || 'Gallery image'}
                        fill
                        unoptimized
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                        className="transition-transform duration-300 group-hover:scale-105"
                        onClick={onOpen}
                    />
                </div>
                <div
                    className={`absolute top-2 left-2 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-100
        ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'} 
        hover:bg-blue-100 hover:border-blue-400 cursor-pointer`}
                    onClick={onSelect}
                >
                    {selected && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>

            <div className="p-3 flex flex-col gap-1 h-28">
                <p
                    className="text-sm font-semibold text-gray-800 truncate"
                    title={image.originalFilename}
                >
                    {image.originalFilename}
                </p>
                <p className="text-xs text-gray-500">
                    {new Date(image.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export const ImageCard = memo(IC, (prev, next) => 
  prev.selected === next.selected &&
  prev.image.id === next.image.id
);
