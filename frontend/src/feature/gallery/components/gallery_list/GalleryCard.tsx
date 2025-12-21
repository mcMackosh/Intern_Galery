import { ModalWithTrigger } from '@/shared/ui/Modal/ModalWithTrigger';
import { IGallery } from '@/types/gallery';
import { Image, Trash2, Edit } from 'lucide-react';
import { UpdateGalleryForm } from '../gallery_page/EditGalleryForm';
import { useRouter } from "next/navigation";
import { BaseModal } from '@/shared/ui/Modal/BaseModal';
import { useState } from 'react';
import { useDeleteGallery } from '../../hooks/useDeleteGallery';
import { UserRole } from '@/types/membership';
import Button from '@/shared/ui/Buton';

type Props = { gallery: IGallery };

export default function GalleryCard({ gallery }: Props) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deleteGallery } = useDeleteGallery(gallery.id);

  const handleDelete = () => {
    deleteGallery();
    setIsDeleteOpen(false);
  }


  return (
    <>
      <div
        className="relative bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        onClick={() => router.push(`/gallery/${gallery.id}`)}
      >
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {(gallery.role === UserRole.ADMIN || gallery.role === UserRole.OWNER) && (
            <>
              <button
                className="p-2 z-1 bg-white rounded-full shadow hover:bg-gray-100 transition"
                onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </button>
              {gallery.role === UserRole.OWNER ? 
              <button
                className="p-2 z-1 bg-white rounded-full shadow hover:bg-gray-100 transition"
                onClick={(e) => { e.stopPropagation(); setIsDeleteOpen(true); }}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button> : null}
              
            </>
          )}
          <span className="inline-block z-1 px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
            {gallery?.role || 'USER'}
          </span>
        </div>

        <div>
          <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <Image className="w-12 h-12 mb-2" />
              <span className="text-sm">No Image</span>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{gallery.title}</h3>
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        className="w-full max-w-lg p-6 md:p-8 bg-white rounded-2xl shadow-xl"
      >
        <UpdateGalleryForm galleryId={gallery.id} onSuccess={() => setIsEditOpen(false)} />
      </BaseModal>

      <BaseModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="w-full max-w-md p-6 md:p-8 bg-white rounded-2xl shadow-xl"
      >
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-6">Are you sure you want to delete the gallery <strong>{gallery.title}</strong>?</p>
        <div className="flex justify-end gap-3">
          <Button
            variant='secondary'
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={() => setIsDeleteOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </BaseModal>
    </>
  );
}