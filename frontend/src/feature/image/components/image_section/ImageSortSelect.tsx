'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/shared/ui/Select';

type SortOrder = 'dateAsc' | 'dateDesc';

interface ImageSortSelectProps {
  value: SortOrder;
  onChange?: (order: SortOrder) => void;
}

interface Option<T = string> {
  value: T;
  label: string;
}

export const ImageSortSelect: React.FC<ImageSortSelectProps> = ({ value, onChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const options: Option<SortOrder>[] = [
    { value: 'dateDesc', label: 'Newest first' },
    { value: 'dateAsc', label: 'Oldest first' },
  ];

  const handleChange = (order: SortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', order);
    router.replace(`${pathname}?${params.toString()}`);
    if (onChange) onChange(order);
  };

  return (
    <div className="w-48">
      <Select value={value} onChange={handleChange} options={options} />
    </div>
  );
};
