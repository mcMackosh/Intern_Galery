'use client';

import { IGallery } from '@/types/gallery';
import { Image, Trash2, Edit } from 'lucide-react';
import { UpdateGalleryForm } from '../gallery_page/EditGalleryForm';
import { useRouter } from 'next/navigation';
import { BaseModal } from '@/shared/ui/Modal/BaseModal';
import { useState } from 'react';
import { useDeleteGallery } from '../../hooks/useDeleteGallery';
import { UserRole } from '@/types/membership';
import Button from '@/shared/ui/Buton';
import { SERVER_URL } from '@/env';
import NextImage from 'next/image';

type GalleryCardProps = { gallery: IGallery };

export default function GalleryCard({ gallery }: GalleryCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { deleteGallery } = useDeleteGallery(gallery.id);

  const handleDelete = () => {
    deleteGallery();
    setIsDeleteOpen(false);
  };

  return (
    <div>
      <div
        data-testid="gallery-card"
        className="relative bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
        onClick={() => router.push(`/gallery/${gallery.id}`)}
      >
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          {(gallery.role === UserRole.ADMIN || gallery.role === UserRole.OWNER) && (
            <div>
              <button
                data-testid="edit-gallery"
                className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </button>

              {gallery.role === UserRole.OWNER && (
                <button
                  data-testid="delete-gallery"
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          )}

          <span
            data-testid="gallery-role"
            className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
          >
            {gallery.role || UserRole.REGULAR}
          </span>
        </div>

        <div className="relative h-40 bg-gray-100">
          {gallery.images?.length ? (
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
              {gallery.images.slice(0, 4).map((img, index) => (
                <div key={index} className="relative overflow-hidden">
                  <NextImage
                    src={`${SERVER_URL}/uploads/${img}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    alt={`Gallery image ${index + 1}`}
                    width={100}
                    height={100}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <Image className="w-10 h-10 mb-1" />
              <span className="text-sm">No images</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition" />
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {gallery.title}
          </h3>
        </div>
      </div>

      <BaseModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl"
      >
        <div data-testid='edit-gallery-modal' />
        <UpdateGalleryForm
          data-testid='edit-gallery-modal' 
          galleryId={gallery.id}
          onSuccess={() => setIsEditOpen(false)}
        />
      </BaseModal>

      <BaseModal

        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
      >
        <div data-testid='delete-gallery-modal'>
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete <strong>{gallery.title}</strong>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              data-testid="confirm-delete-gallery"
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}
