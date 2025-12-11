'use client';

import React from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '@/store/slices/paginationSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RootState } from '@/store/store';

interface PaginationProps {
    totalPages: number;
}

export const PaginationComponent: React.FC<PaginationProps> = ({ totalPages }) => {
    const dispatch = useDispatch();
    const page = useSelector((state: RootState) => state.pagination.page);

    const handlePageClick = (event: { selected: number }) => {
        dispatch(setPage(event.selected + 1));
    };


    return (
        <ReactPaginate
            previousLabel={
                <div className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-center text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105">
                    <ChevronLeft size={20} />
                </div>
            }
            nextLabel={
                <div className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-center text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105">
                    <ChevronRight size={20} />
                </div>
            }
            breakLabel={
                <div className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-center text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105">
                    ...
                </div>
            }
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            forcePage={page - 1}
            containerClassName="flex gap-2 justify-center mt-6"
            pageClassName=""
            pageLinkClassName="px-4 py-2 border border-gray-300 cursor-pointer flex items-center justify-center text-gray-700 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
            activeClassName="bg-blue-500 text-white border-blue-500 scale-110"
        />
    );
};
