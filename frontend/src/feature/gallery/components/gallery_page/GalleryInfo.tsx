'use client'

import { useState } from 'react'
import { Pencil, Delete } from 'lucide-react'
import { useOneGallery } from '../../hooks/useOneGallery'
import { BaseModal } from '@/shared/ui/Modal/BaseModal'
import { UpdateGalleryForm } from './EditGalleryForm'
import { useDeleteGallery } from '../../hooks/useDeleteGallery'
import MembershipForm from '@/feature/membership/components/MembershipForm'
import { UserRole } from '@/types/membership'
import Button from '@/shared/ui/Buton'

export function GalleryInfo() {
  const { gallery, isLoading: galleryLoading } = useOneGallery()
  const { deleteGallery } = useDeleteGallery()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isMembershipOpen, setIsMembershipOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  if (galleryLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="text-gray-400 text-lg animate-pulse">
          Loading gallery...
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Title + Role */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {gallery?.title || 'Untitled Gallery'}
        </h1>
        <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
          {gallery?.role || 'USER'}
        </span>
      </div>

      {/* Description */}
      {gallery?.description && (
        <p className="text-gray-700 text-base md:text-lg leading-relaxed border-l-4 border-indigo-300 pl-4 md:pl-6">
          {gallery.description}
        </p>
      )}

      {/* Buttons */}
      <div className="flex flex-row flex-wrap justify-end items-center gap-3 mt-4">
        {(gallery?.role === UserRole.ADMIN || gallery?.role === UserRole.OWNER) && (
          <>
            {/* Edit */}
            <Button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2"
            >
              <Pencil className="w-5 h-5" /> Edit Gallery
            </Button>

            <BaseModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="w-full max-w-lg p-6 md:p-8 bg-white rounded-2xl shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Edit Gallery</h2>
              <UpdateGalleryForm onSuccess={() => setIsEditOpen(false)} />
            </BaseModal>

            {/* Membership */}
            <Button
              onClick={() => setIsMembershipOpen(true)}
              className="inline-flex items-center gap-2 px-5"
            >
              <Pencil className="w-5 h-5" /> Membership Settings
            </Button>

            <BaseModal isOpen={isMembershipOpen} onClose={() => setIsMembershipOpen(false)} className="w-[95vw] max-w-5xl p-6 md:p-8 bg-white rounded-2xl shadow-xl">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Membership Settings</h2>
              <MembershipForm />
            </BaseModal>

            <Button
              onClick={() => setIsConfirmOpen(true)}
              variant="danger"
              className="inline-flex items-center gap-2 px-5 py-2"
            >
              <Delete className="w-4 h-4" /> Delete
            </Button>

            <BaseModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} className="w-[90vw] max-w-md p-6 bg-white rounded-2xl shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this gallery? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsConfirmOpen(false)} className="w-auto px-4 py-2">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    deleteGallery()
                    setIsConfirmOpen(false)
                  }}
                  variant="danger"
                  className="w-auto px-4 py-2"
                >
                  Yes, delete
                </Button>
              </div>
            </BaseModal>
          </>
        )}
      </div>
    </div>
  )
}
