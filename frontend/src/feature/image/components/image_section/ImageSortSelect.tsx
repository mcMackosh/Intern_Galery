'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

type SortOrder = 'dateAsc' | 'dateDesc';

interface ImageSortSelectProps {
    value: SortOrder;
    onChange?: (order: SortOrder) => void;
}

export const ImageSortSelect: React.FC<ImageSortSelectProps> = ({ value, onChange }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleChange = (order: SortOrder) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', order);
        router.replace(`${pathname}?${params.toString()}`);
        if (onChange) onChange(order);
    };

    return (
        <div className="relative inline-block">
            <select
                value={value}
                onChange={(e) => handleChange(e.target.value as SortOrder)}
                className="appearance-none w-48 rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="dateDesc">Newest first</option>
                <option value="dateAsc">Oldest first</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
};
