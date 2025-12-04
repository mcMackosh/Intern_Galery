import { ModalWithTrigger } from '@/shared/ui/Modal/ModalWithTrigger';
import { IGallery } from '@/types/gallery';
import { Image, Trash2, Edit } from 'lucide-react';
import { UpdateGalleryForm } from '../gallery_page/EditGalleryForm';
import { useRouter } from "next/navigation";
import { BaseModal } from '@/shared/ui/Modal/BaseModal';
import { useState } from 'react';
import { useDeleteGallery } from '../../hooks/useDeleteGallery';

type Props = { gallery: IGallery };

export default function GalleryCard({ gallery }: Props) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { deleteGallery } = useDeleteGallery(gallery.id)


    return (
        <>
            <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" onClick={() => router.push(`/gallery/${gallery.id}`)}>
                <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    {gallery.role === 'ADMIN' ?
                        <>
                            <button
                                className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                            >

                                <Edit className="w-4 h-4 text-blue-600" />
                            </button>

                            <button
                                className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                                onClick={() => deleteGallery()}
                            >
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                        </>
                        : null}
                    <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
                        {gallery?.role || 'USER'}
                    </span>

                </div>
                
                <div >
                    <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center" >
                        <div className="flex flex-col items-center justify-center text-gray-400" >
                            <Image className="w-12 h-12 mb-2" />
                            <span className="text-sm">No Image</span>
                        </div>
                    </div>

                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{gallery.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">ID: {gallery.id}</p>
                    </div>
                </div>
            </div>

            <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-full max-w-lg p-6 md:p-8 bg-white rounded-2xl shadow-xl">
                <UpdateGalleryForm galleryId={gallery.id} />
            </BaseModal>
        </>

    );
}