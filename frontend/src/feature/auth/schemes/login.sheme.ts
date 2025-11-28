import { z } from "zod";

export const LoginSheme = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type TypeLoginScheme = z.infer<typeof LoginSheme>;