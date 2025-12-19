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
    ChevronDown,
    Check
} from 'lucide-react';
import Button from '@/shared/ui/Buton';
import { useDispatch } from 'react-redux';
import { setPage } from '@/store/slices/paginationSlice';

export default function GalleryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const [search, setSearch] = useState(searchParams.get('search') ?? '');
    const [sortBy, setSortBy] = useState<'title' | 'createdAt'>(
        (searchParams.get('sortBy') as 'title' | 'createdAt') ?? 'createdAt'
    );
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [startDate, setStartDate] = useState(
        searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null
    );
    const [endDate, setEndDate] = useState(
        searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null
    );
    const [minImages, setMinImages] = useState(
        searchParams.get('minImages') ? Number(searchParams.get('minImages')) : ''
    );
    const [maxImages, setMaxImages] = useState(
        searchParams.get('maxImages') ? Number(searchParams.get('maxImages')) : ''
    );

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (search) params.set('search', search);
        if (sortBy) params.set('sortBy', sortBy);
        if (startDate) params.set('startDate', startDate.toLocaleDateString('en-CA'));
        if (endDate) params.set('endDate', endDate.toLocaleDateString('en-CA'));
        if (minImages !== '') params.set('minImages', String(minImages));
        if (maxImages !== '') params.set('maxImages', String(maxImages));

        router.push(`?${params.toString()}`);

        dispatch(setPage(1));
    };

    const resetFilters = () => {
        setSearch('');
        setSortBy('createdAt');
        setStartDate(null);
        setEndDate(null);
        setMinImages('');
        setMaxImages('');
        router.push('?');
        dispatch(setPage(1));
    };

    return (
        <div className="relative z-30 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur
                        shadow-sm p-6 space-y-6">

            <h3 className="text-lg font-semibold text-gray-800">
                Filters/Sort Menu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        placeholder="Search galleries..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                                   transition"
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setSortDropdownOpen((prev) => !prev)}
                        className="pl-4 pr-10 py-3 w-full text-left rounded-xl border border-gray-300
                                   bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition
                                   flex justify-between items-center"
                    >
                        {sortBy === 'createdAt' ? 'Sort by created' : 'Sort by title'}
                        <ChevronDown size={18} className="text-gray-400" />
                    </button>

                    {sortDropdownOpen && (
                        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50">
                            <div
                                className={`px-4 py-2 cursor-pointer ${sortBy === 'createdAt' ? 'bg-blue-100' : ''}`}
                                onClick={() => setSortBy('createdAt')}
                            >
                                Sort by created
                            </div>
                            <div
                                className={`px-4 py-2 cursor-pointer ${sortBy === 'title' ? 'bg-blue-100' : ''}`}
                                onClick={() => setSortBy('title')}
                            >
                                Sort by title
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start date"
                        isClearable
                        maxDate={endDate ?? undefined}
                        popperClassName="z-[9999]"
                        className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                </div>

                <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="End date"
                        isClearable
                        minDate={startDate ?? undefined}
                        popperClassName="z-[9999]"
                        className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                </div>

                <div className="relative">
                    <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="number"
                        placeholder="Min images"
                        value={minImages}
                        min={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || Number(value) >= 0) setMinImages(value === '' ? '' : Number(value));
                        }}
                        className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                </div>

                <div className="relative">
                    <ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="number"
                        placeholder="Max images"
                        value={maxImages}
                        min={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || Number(value) >= 0) setMaxImages(value === '' ? '' : Number(value));
                        }}
                        className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-300
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button
                    onClick={resetFilters}
                    variant={'secondary'}
                    className="flex items-center gap-2 px-5 py-3 border border-gray-300 rounded-xl
                               text-gray-700 hover:bg-gray-100 transition"
                >
                    <RotateCcw size={16} />
                    Reset
                </Button>
                <Button
                    onClick={applyFilters}
                    variant={'default'}
                    className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl
                               hover:bg-blue-600 transition"
                >
                    <Check size={16} />
                    Apply
                </Button>
            </div>
        </div>
    );
}
