import { Plus } from "lucide-react";
import { ModalWithTrigger } from "@/shared/ui/Modal/ModalWithTrigger";
import { CreateGalleryForm } from "./CreateGalleryForm";

export const CreateGalleryButton = () => {
  return (
    <ModalWithTrigger
        buttonText="Create Gallery"
        buttonIcon={<Plus className="w-5 h-5" />}
        modalClassName="w-full max-w-md ml-4"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Gallery</h2>

        <CreateGalleryForm />
      </ModalWithTrigger>
  );
};
