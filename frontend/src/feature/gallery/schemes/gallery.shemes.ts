import { z } from "zod";

export const createGallerySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description must be at most 255 characters"),
});

export const updateGallerySchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(50, "Title must be at most 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description must be at most 255 characters")
});

export type TypeCreateGalleryScheme = z.infer<typeof createGallerySchema>;
export type TypeUpdateGalleryScheme = z.infer<typeof updateGallerySchema>;