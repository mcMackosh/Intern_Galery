'use client'

import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from "@/store/slices/paginationSlice";
import { useGalleries } from "../../hooks/useGallery";
import GalleryCard from "./GalleryCard";
import { Pagination } from "./Pagination";

export default function GalleryList() {
    const page = useSelector((state: any) => state.pagination.page);
    const dispatch = useDispatch();

    const { data, meta, isLoading, isError, refetch } = useGalleries(page);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-transparent"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg">
                    Error loading Galleries
                </div>
                <button
                    onClick={() => refetch()}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(data ?? []).map((gallery) => (
                    <div key={gallery.id} className="cursor-pointer">
                        <GalleryCard gallery={gallery} />
                    </div>
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={meta?.totalPages ?? 1}
                onPageChange={(newPage) => dispatch(setPage(newPage))}
                
            />
        </div>
    );
}
