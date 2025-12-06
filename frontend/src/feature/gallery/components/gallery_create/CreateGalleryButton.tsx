'use client'

import { useState } from "react";

import { CreateGalleryForm } from "./CreateGalleryForm";
import { Plus } from "lucide-react";
import { ModalWithTrigger } from "@/shared/ui/Modal/ModalWithTrigger";

export const CreateGalleryButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalWithTrigger
      buttonText="Create Gallery"
      buttonIcon={<Plus className="w-5 h-5" />}
      modalClassName="w-full max-w-md ml-4"
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <>
        <h2 className="text-xl font-semibold mb-4">Create New Gallery</h2>

        <CreateGalleryForm onSuccess={() => setIsOpen(false)} />
      </>
    </ModalWithTrigger>
  );
};
