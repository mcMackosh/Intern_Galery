
import { CreateGalleryButton } from "@/feature/gallery/components/gallery_create/CreateGalleryButton";
import GalleryList from "@/feature/gallery/components/gallery_list/GalleryList";


export default function Home() {
  
  return (
     <div className="mt-5 ml-3">
        <CreateGalleryButton />
         <GalleryList />
    </div>
  );
}
