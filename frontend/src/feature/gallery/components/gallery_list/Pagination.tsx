"use client";

import React from "react";
import Button from "@/shared/ui/Buton";

interface PaginationProps {
    page: number;
    totalPages?: number;
    onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages = 1, onPageChange }) => {
    return (
        <div className="flex justify-center items-center mt-6 p-4 bg-gray-50 rounded-lg shadow-sm gap-4">
            <div className="px-3 py-2 w-32">
                <Button
                    onClick={() => onPageChange(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="px-5 py-3 flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                    Previous
                </Button>
            </div>
            <span className="px-4 py-1 text-gray-800 font-medium bg-white rounded-md shadow-inner">
                Page {page} {totalPages ? `of ${totalPages}` : ""}
            </span>
            <div className="px-3 py-2 w-32">
                <Button
                    onClick={() => onPageChange(totalPages ? Math.min(page + 1, totalPages) : page + 1)}
                    disabled={totalPages ? page === totalPages : false}
                    className="px-5 py-3 flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
