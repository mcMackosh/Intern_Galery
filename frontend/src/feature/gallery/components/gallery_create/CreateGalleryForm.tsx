"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createGallerySchema,
  TypeCreateGalleryScheme,
} from "../../schemes/gallery.shemes";
import { useCreateGallery } from "../../hooks/useCreateGallery";
import { Input } from "@/shared/ui/Input";
import Button from "@/shared/ui/Buton";

interface CreateGalleryFormProps {
  onSuccess?: () => void;
}

export const CreateGalleryForm = ({ onSuccess }: CreateGalleryFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TypeCreateGalleryScheme>({
    resolver: zodResolver(createGallerySchema),
  });

  const { createGallery, isLoading } = useCreateGallery();

  const onSubmit = (data: TypeCreateGalleryScheme) => {
    createGallery(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-semibold text-gray-800">
          Gallery Name
        </label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          placeholder="For example: Alpha"
          className={`px-4 py-2 rounded-lg border text-sm outline-none transition
            ${errors.title ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}
          `}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-semibold text-gray-800">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Short description"
          rows={3}
          className={`px-4 py-2 rounded-lg border text-sm outline-none resize-none transition
            ${errors.description ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}
          `}
        />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold
                  hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
};
