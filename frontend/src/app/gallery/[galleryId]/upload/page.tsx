

import UploadImagesPage from "@/feature/image/components/upload/UploadImagesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Upload Gallery',
};

export default function GalleryPage() {
  return (
    <div>
     <UploadImagesPage/>
    </div>
  )
}
