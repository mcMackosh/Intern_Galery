'use client';

import { useCopyImages } from "@/feature/image/hooks/useCopyImages";
import { useDeleteImages } from "@/feature/image/hooks/useDeleteImage";
import { useMoveImages } from "@/feature/image/hooks/useMoveImages";
import Button from "@/shared/ui/Buton";
import { useState } from "react";
import { GallerySelectModal } from "../image_modal/GallerySelectModal";

interface Props {
    selectedIds: string[];
    reset: () => void;
}

export const ImageToolbar: React.FC<Props> = ({ selectedIds, reset }) => {
    const { deleteImages, isLoading: isDeleting } = useDeleteImages();
    const { copyImages, isLoading: isCopying } = useCopyImages();
    const { moveImages, isLoading: isMoving } = useMoveImages();

    const [actionType, setActionType] = useState<'copy' | 'move' | null>(null);
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    if (selectedIds.length === 0) return null;

    const handleGallerySelect = async (galleryId: string) => {
        if (actionType === 'copy') {
            await copyImages({ targetGalleryId: galleryId, ids: selectedIds });
        }
        if (actionType === 'move') {
            await moveImages({ targetGalleryId: galleryId, ids: selectedIds });
        }
        reset();
        setShowGalleryModal(false);
    };

    const handleAction = (type: 'copy' | 'move') => {
        setActionType(type);
        setShowGalleryModal(true);
    };

    return (
        <>
            <div className="sticky top-4 z-50 mb-4">
                <div
                    className="
                        flex items-center justify-between
                        gap-4 px-4 py-3
                        border border-gray-200
                        rounded-xl
                        bg-white
                        shadow-md
                        transition-all duration-300
                    "
                >
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Selected</span>
                        <span
                            className="
                                inline-flex items-center justify-center
                                min-w-[26px] h-6 px-2
                                rounded-full
                                bg-blue-100 text-blue-700
                                text-xs font-semibold
                            "
                        >
                            {selectedIds.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={() => handleAction('copy')} disabled={isCopying} variant="secondary" className="h-9 px-4">
                            {isCopying ? 'Copying…' : 'Copy'}
                        </Button>

                        <Button onClick={() => handleAction('move')} disabled={isMoving} variant="success" className="h-9 px-4">
                            {isMoving ? 'Moving…' : 'Move'}
                        </Button>

                        <Button onClick={() => { deleteImages(selectedIds); reset(); }} disabled={isDeleting} variant="danger" className="h-9 px-4">
                            {isDeleting ? 'Deleting…' : 'Delete'}
                        </Button>

                        <Button onClick={reset} variant="default" className="h-9 px-4">
                            Reset
                        </Button>
                    </div>
                </div>
            </div>
            {showGalleryModal && (
                <GallerySelectModal
                    onClose={() => setShowGalleryModal(false)}
                    onSelect={handleGallerySelect}
                />
            )}
        </>
    );
};