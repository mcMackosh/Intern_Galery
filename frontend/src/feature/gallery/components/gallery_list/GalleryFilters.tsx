'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
    Search,
    Calendar,
    Image as ImageIcon,
    RotateCcw,
    Check,
} from 'lucide-react';

import Button from '@/shared/ui/Buton';
import { useDispatch } from 'react-redux';
import { setPage } from '@/store/slices/paginationSlice';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { IconDatePicker } from '@/shared/ui/IconDatePicker';

type SortBy = 'title' | 'createdAt' | '';
type OrderBy = 'asc' | 'desc' | '';

export default function GalleryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const [search, setSearch] = useState(searchParams.get('search') ?? '');

    const paramSortBy = searchParams.get('sortBy');
    const paramOrderBy = searchParams.get('orderBy');

    const [sortBy, setSortBy] = useState<SortBy>(
        paramSortBy === 'title' || paramSortBy === 'createdAt' ? paramSortBy : ''
    );

    const [orderBy, setOrderBy] = useState<OrderBy>(
        paramOrderBy === 'asc' || paramOrderBy === 'desc' ? paramOrderBy : ''
    );

    const [startDate, setStartDate] = useState<Date | null>(
        searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : null
    );

    const [endDate, setEndDate] = useState<Date | null>(
        searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : null
    );

    const [minImages, setMinImages] = useState<number | null>(
        searchParams.get('minImages')
            ? Number(searchParams.get('minImages'))
            : null
    );

    const [maxImages, setMaxImages] = useState<number | null>(
        searchParams.get('maxImages')
            ? Number(searchParams.get('maxImages'))
            : null
    );

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (search) params.set('search', search);
        if (sortBy) params.set('sortBy', sortBy);
        if (orderBy) params.set('orderBy', orderBy);

        if (startDate)
            params.set('startDate', startDate.toLocaleDateString('en-CA'));
        if (endDate)
            params.set('endDate', endDate.toLocaleDateString('en-CA'));
        if (minImages !== null)
            params.set('minImages', String(minImages));
        if (maxImages !== null)
            params.set('maxImages', String(maxImages));

        router.push(`?${params.toString()}`);
        dispatch(setPage(1));
    };

    const resetFilters = () => {
        setSearch('');
        setSortBy('createdAt');
        setOrderBy('desc');
        setStartDate(null);
        setEndDate(null);
        setMinImages(null);
        setMaxImages(null);

        router.push('?');
        dispatch(setPage(1));
    };

    return (
        <section className="relative z-30 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg p-6 space-y-6">
            <header>
                <h3 className="text-xl font-semibold text-gray-800">
                    Gallery controls
                </h3>
            </header>

            <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">
                    Search galleries by title
                </label>
                <Input
                    id="search"
                    icon={Search}
                    placeholder="Search galleries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <aside className="md:col-span-1 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Sorting
                    </h4>

                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        options={[
                            { value: '', label: 'Not selected' },
                            { value: 'createdAt', label: 'Created date' },
                            { value: 'title', label: 'Title' },
                        ]}
                    />

                    <Select
                        value={orderBy}
                        onChange={setOrderBy}
                        options={[
                            { value: '', label: 'Not selected' },
                            { value: 'asc', label: 'Ascending' },
                            { value: 'desc', label: 'Descending' },
                        ]}
                    />
                </aside>

                <section className="md:col-span-3 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Filters
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <label className="block mb-1 text-sm text-gray-600">
                                Start date
                            </label>
                            <IconDatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                placeholder='Start date'
                                maxDate={endDate ?? undefined}
                            />
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-sm text-gray-600">
                                End date
                            </label>
                            <IconDatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                placeholder='End date'
                                minDate={startDate ?? undefined}
                            />
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-sm text-gray-600">
                                Min images
                            </label>
                            <Input
                                id="minImages"
                                icon={ImageIcon}
                                type="number"
                                placeholder="Min images"
                                value={minImages ?? ''}
                                min={0}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (!v) return setMinImages(null);
                                    const n = Number(v);
                                    if (!isNaN(n) && (maxImages === null || n <= maxImages)) {
                                        setMinImages(n);
                                    }
                                }}
                            />
                        </div>

                        <div className="relative">
                            <label className="block mb-1 text-sm text-gray-600">
                                Max images
                            </label>
                            <Input
                                id="maxImages"
                                icon={ImageIcon}
                                type="number"
                                placeholder="Max images"
                                value={maxImages ?? ''}
                                min={0}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    if (!v) return setMaxImages(null);
                                    const n = Number(v);
                                    if (!isNaN(n) && (minImages === null || n >= minImages)) {
                                        setMaxImages(n);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <Button
                    variant="secondary"
                    onClick={resetFilters}
                    className="flex items-center gap-2"
                >
                    <RotateCcw size={16} />
                    Reset
                </Button>

                <Button onClick={applyFilters} className="flex items-center gap-2">
                    <Check size={16} />
                    Apply
                </Button>
            </div>
        </section>
    );
}