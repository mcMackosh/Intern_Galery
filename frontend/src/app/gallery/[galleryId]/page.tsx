import { GalleryInfo } from "@/feature/gallery/components/gallery_page/GalleryInfo";
import { ImageGallerySection } from "@/feature/image/components/image_section/ImageGallerySection";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Concrete Gallery',
};

export default function GalleryPage() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <GalleryInfo />
      <ImageGallerySection />
    </div>
  )
}
