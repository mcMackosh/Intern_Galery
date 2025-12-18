'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useGalleries } from '../../hooks/useGallery';
import GalleryCard from './GalleryCard';
import { PaginationComponent } from './Pagination';

export default function GalleryList() {
    const page = useSelector((state: any) => state.pagination.page);

    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') ?? '';
    const sortBy = (searchParams.get('sortBy') as 'title' | 'createdAt') ?? 'createdAt';

    const startDate = searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : null;

    const endDate = searchParams.get('endDate')
        ? new Date(searchParams.get('endDate')!)
        : null;

    const minImages = searchParams.get('minImages')
        ? Number(searchParams.get('minImages'))
        : undefined;

    const maxImages = searchParams.get('maxImages')
        ? Number(searchParams.get('maxImages'))
        : undefined;

    const setParam = (key: string, value?: string | number | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === undefined || value === null || value === '') {
            params.delete(key);
        } else {
            params.set(key, String(value));
        }

        params.delete('page');
        router.push(`?${params.toString()}`);
    };

    const { data, meta, isLoading, isError, refetch } = useGalleries(page);

    if (isLoading)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
            </div>
        );

    if (isError)
        return (
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg text-center">
                    Error loading galleries
                </div>
                <button
                    onClick={() => refetch()}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition transform hover:scale-105"
                >
                    Retry
                </button>
            </div>
        );

    return (

        <div className="max-w-7xl mx-auto px-10 py-10 space-y-8">
            <div className="z-30 relativ grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setParam('search', e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <select
                    value={sortBy}
                    onChange={(e) => setParam('sortBy', e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    <option value="createdAt">Created</option>
                    <option value="title">Title</option>
                </select>

                <DatePicker
                    selected={startDate}
                    onChange={(date) => setParam('startDate', date ? date.toISOString() : null)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholderText="Start date"
                    popperClassName="z-[9999]"
                    isClearable
                    maxDate={endDate ? new Date(endDate) : undefined} // не дозволяє вибрати старт після енд
                />

                <DatePicker
                    selected={endDate}
                    onChange={(date) => setParam('endDate', date ? date.toISOString() : null)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholderText="End date"
                    popperClassName="z-[9999]"
                    isClearable
                    minDate={startDate ? new Date(startDate) : undefined} // не дозволяє вибрати енд менший за старт
                />

                <input
                    type="number"
                    placeholder="Min images"
                    value={minImages ?? ''}
                    onChange={(e) => setParam('minImages', e.target.value ? Number(e.target.value) : null)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <input
                    type="number"
                    placeholder="Max images"
                    value={maxImages ?? ''}
                    onChange={(e) => setParam('maxImages', e.target.value ? Number(e.target.value) : null)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 z-0 relative">
                {data?.map((gallery) => (
                    <GalleryCard key={gallery.id} gallery={gallery} />
                ))}
            </div>

            {/* Pagination */}
            {meta?.totalPages && (
                <div className="mt-8">
                    <PaginationComponent totalPages={meta.totalPages} />
                </div>
            )}
        </div>
    );
}
