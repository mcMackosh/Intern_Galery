

import { GalleryInfo } from "@/feature/gallery/components/gallery_page/GalleryInfo";
import ImageList from "@/feature/image/components/gallery_list/ImageList";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Concrete Gallery',
};

export default function GalleryPage() {
  return (
    <div>
      <GalleryInfo/>
      <ImageList/>
    </div>
  )
}
