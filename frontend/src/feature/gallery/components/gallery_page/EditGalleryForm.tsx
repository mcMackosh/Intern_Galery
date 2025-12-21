"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateGallerySchema,
  TypeUpdateGalleryScheme,
} from "../../schemes/gallery.shemes";

import { useUpdateGallery } from "../../hooks/useUpdateGallery";
import { useOneGallery } from "../../hooks/useOneGallery";
import Button from "@/shared/ui/Buton";
import { Input } from "@/shared/ui/Input";

interface UpdateGalleryFormProps {
  galleryId?: string;
  onSuccess?: () => void
}

export const UpdateGalleryForm = ({
  galleryId,
  onSuccess
}: UpdateGalleryFormProps) => {
  const { gallery, isLoading: galleryLoading } = useOneGallery(galleryId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TypeUpdateGalleryScheme>({
    resolver: zodResolver(updateGallerySchema),
  });

  const { updateGallery, isLoading: updateLoading } = useUpdateGallery(galleryId);

  useEffect(() => {
    if (gallery) {
      reset({
        title: gallery.title,
        description: gallery.description ?? "",
      });
    }
  }, [gallery, reset]);

  const onSubmit = (data: TypeUpdateGalleryScheme) => {
    updateGallery(data);
    onSuccess?.()
  };

  if (galleryLoading) {
    return <p className="text-center py-4">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Gallery name</label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="For example: Alpha"
          className={`px-3 py-2 rounded-lg border text-sm outline-none transition
            ${errors.title ? "border-red-500" : "border-gray-300 focus:border-blue-500"}
          `}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>


      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description")}
          placeholder="Short description"
          className={`px-3 py-2 rounded-lg border text-sm outline-none transition
            ${errors.description ? "border-red-500" : "border-gray-300 focus:border-blue-500"}
          `}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={updateLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                  hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {updateLoading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
};
