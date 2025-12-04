

import { GalleryInfo } from "@/feature/gallery/components/gallery_page/GalleryInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Concrete Gallery',
};

export default function GalleryPage() {
  return (
    <GalleryInfo />
  )
}
