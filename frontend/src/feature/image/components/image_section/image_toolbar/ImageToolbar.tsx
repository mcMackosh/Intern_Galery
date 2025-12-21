'use client';

import { useCopyImages } from "@/feature/image/hooks/useCopyImages";
import { useDeleteImages } from "@/feature/image/hooks/useDeleteImage";
import { useMoveImages } from "@/feature/image/hooks/useMoveImages";
import Button from "@/shared/ui/Buton";
import { useState } from "react";
import { GallerySelectModal } from "../image_modal/GallerySelectModal";
import { BaseModal } from "@/shared/ui/Modal/BaseModal";

interface Props {
    selectedIds: string[];
    reset: () => void;
}

export const ImageToolbar: React.FC<Props> = ({ selectedIds, reset }) => {
    const { deleteImages, isLoading: isDeleting } = useDeleteImages();
    const { copyImages, isLoading: isCopying } = useCopyImages();
    const { moveImages, isLoading: isMoving } = useMoveImages();

    const [actionType, setActionType] = useState<'copy' | 'move' | 'delete' | null>(null);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

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

    const handleActionClick = (type: 'copy' | 'move' | 'delete') => {
        setActionType(type);
        if (type === 'delete') {
            setShowConfirmModal(true);
        } else {
            setShowGalleryModal(true);
        }
    };

    const confirmDelete = async () => {
        if (actionType === 'delete') {
            await deleteImages(selectedIds);
            reset();
        }
        setShowConfirmModal(false);
    };

    return (
        <>
            <div className="sticky top-4 z-50 mb-4">
                <div className="flex items-center justify-between gap-4 px-4 py-3 border border-gray-200 rounded-xl bg-white shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Selected</span>
                        <span className="inline-flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                            {selectedIds.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={() => handleActionClick('copy')} disabled={isCopying} variant="secondary" className="h-9 px-4">
                            {isCopying ? 'Copying…' : 'Copy'}
                        </Button>

                        <Button onClick={() => handleActionClick('move')} disabled={isMoving} variant="success" className="h-9 px-4">
                            {isMoving ? 'Moving…' : 'Move'}
                        </Button>

                        <Button onClick={() => handleActionClick('delete')} disabled={isDeleting} variant="danger" className="h-9 px-4">
                            {isDeleting ? 'Deleting…' : 'Delete'}
                        </Button>

                        <Button onClick={reset} variant="default" className="h-9 px-4">
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            {showGalleryModal && actionType && actionType !== 'delete' && (
                <GallerySelectModal
                    onClose={() => setShowGalleryModal(false)}
                    onSelect={handleGallerySelect}
                />
            )}

            {showConfirmModal && actionType === 'delete' && (
                <BaseModal
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    className="max-w-md"
                >
                    <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                    <p>Are you sure you want to delete {selectedIds.length} image(s)? This action cannot be undone.</p>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting…' : 'Delete'}
                        </Button>
                    </div>
                </BaseModal>
            )}
        </>
    );
};
