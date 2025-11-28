import * as z from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters")
    .regex(/^[A-Za-z]+$/, "First name cannot contain numbers or special characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters")
    .regex(/^[A-Za-z]+$/, "Last name cannot contain numbers or special characters"),
  email: z.string()
        .refine(val => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
          message: "Invalid email address",
      }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .optional()
    .or(z.literal('')),
  confirmPassword: z.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export type ProfileFormData = z.infer<typeof profileSchema>;
