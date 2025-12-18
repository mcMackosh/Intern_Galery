'use client';

import React, { useState } from 'react';
import { BaseModal } from '@/shared/ui/Modal/BaseModal';
import { useGalleries } from '@/feature/gallery/hooks/useGallery';
import ReactPaginate from 'react-paginate';
import { ArrowRight, ChevronLeft, ChevronRight, Image, User } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSelect: (galleryId: string) => void;
}

export const GallerySelectModal: React.FC<Props> = ({ onClose, onSelect}) => {
    const [page, setPage] = useState(1);
    const { data, meta, isLoading, isError } = useGalleries(page);

    const handlePageClick = (selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
    };

    if (isLoading) return <BaseModal isOpen onClose={onClose}>Loading...</BaseModal>;
    if (isError) return <BaseModal isOpen onClose={onClose}>Error loading galleries</BaseModal>;

    return (
        <BaseModal
            isOpen
            onClose={onClose}
            className='w-150'
            >
            <div className="flex flex-col text-center shrink-0 px-5 py-4 border-b ">
                <h2 className="text-xl font-semibold text-gray-900">
                    Pick a Gallery
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Select a gallery to execute the action
                </p>
            </div>
            <div className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {data?.map(gallery => (
                        <div
                            key={gallery.id}
                            className="flex items-center justify-between p-3 border rounded-xl cursor-pointer hover:shadow-lg hover:scale-100 transition-transform duration-200 bg-white"
                            onClick={() => onSelect(gallery.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Image size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-gray-800 font-medium">{gallery.title}</h3>
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        <User size={14} /> {gallery.role || 'No role'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-gray-400 hover:text-blue-500 transition-colors">
                                <ArrowRight/>
                            </div>
                        </div>
                    ))}
                </div>

                {meta?.totalPages && meta.totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-20">
                        <ReactPaginate
                            previousLabel={
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-transform duration-200 transform hover:scale-105">
                                    <ChevronLeft size={20} />
                                </div>
                            }
                            nextLabel={
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-transform duration-200 transform hover:scale-105">
                                    <ChevronRight size={20} />
                                </div>
                            }
                            breakLabel={
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 cursor-default bg-gray-50">
                                    ...
                                </div>
                            }
                            pageCount={meta.totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            forcePage={page - 1}
                            containerClassName="flex gap-2 justify-center"
                            pageLinkClassName="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-blue-100 hover:border-blue-300 transition-transform duration-200 transform hover:scale-105"
                            activeClassName="bg-blue-500 text-white border-blue-500 scale-110"
                            
                        />
                    </div>
                )}
            </div>
        </BaseModal>
    );
};