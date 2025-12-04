'use client'

import { Pencil, Delete } from 'lucide-react'
import { useOneGallery } from '../../hooks/useOneGallery'
import { ModalWithTrigger } from '@/shared/ui/Modal/ModalWithTrigger'
import { UpdateGalleryForm } from './EditGalleryForm'
import { useDeleteGallery } from '../../hooks/useDeleteGallery'
import MembershipForm from '@/feature/membership/components/MembershipForm'

export function GalleryInfo() {
  const { gallery, isLoading: galleryLoading } = useOneGallery()
  const { deleteGallery } = useDeleteGallery()

  if (galleryLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="text-gray-400 text-lg animate-pulse">Loading gallery...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {gallery?.title || 'Untitled Gallery'}
        </h1>
        <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
          {gallery?.role || 'USER'}
        </span>
      </div>

      {gallery?.description && (
        <p className="text-gray-700 text-base md:text-lg leading-relaxed border-l-4 border-indigo-300 pl-4 md:pl-6">
          {gallery.description}
        </p>
      )}

      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-3 mt-4">
        {gallery?.role === 'ADMIN' ?
          <>
            <ModalWithTrigger
              buttonText="Edit Gallery"
              buttonIcon={<Pencil className="w-5 h-5" />}
              modalClassName="w-full max-w-lg p-6 md:p-8 bg-white rounded-2xl shadow-xl"
              buttonClassName="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Edit Gallery</h2>
              <UpdateGalleryForm />
            </ModalWithTrigger>

            <ModalWithTrigger
              buttonText="Membership Settings"
              buttonIcon={<Pencil className="w-5 h-5" />}
              buttonClassName="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Membership Settings</h2>
              <MembershipForm/>
            </ModalWithTrigger>

            <button
              onClick={() => deleteGallery()}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-900 text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Delete />
              Delete
            </button>
          </> : 
          (null)}
      </div>
    </div>
  )
}
