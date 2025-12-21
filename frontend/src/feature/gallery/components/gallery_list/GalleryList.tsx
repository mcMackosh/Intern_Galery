'use client';

import { useSelector } from 'react-redux';
import { useGalleries } from '../../hooks/useGallery';
import GalleryCard from './GalleryCard';
import { PaginationComponent } from './Pagination';
import GalleryFilters from './GalleryFilters';
import Button from '@/shared/ui/Buton';

export default function GalleryList() {
    const page = useSelector((state: any) => state.pagination.page);

    const { data, meta, isLoading, isError, refetch } = useGalleries(page);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4
                                border-gray-300 border-t-blue-500" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="max-w-3xl w-full p-6 text-center">
                    <div className="bg-red-50 border border-red-300
                        text-red-700 p-4 rounded-lg">
                        Error loading galleries
                    </div>
                    <Button
                        onClick={() => refetch()}
                        className="mt-4 bg-blue-600 hover:bg-blue-700
                     text-white font-semibold px-4 py-2 rounded-lg
                     transition transform hover:scale-105"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    } 

    return (
        <div className="max-w-7xl mx-auto px-10 py-10 space-y-8">
            <GalleryFilters />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.map((gallery) => (
                    <GalleryCard key={gallery.id} gallery={gallery} />
                ))}

            </div>

            {meta?.totalPages ? (
                <div className="mt-8">
                    <PaginationComponent totalPages={meta.totalPages} />
                </div>) :
                (<div className="mt-8 flex justify-center items-center text-gray-500 text-lg">
                    No pages
                </div>)
            }
        </div>
    );
}
