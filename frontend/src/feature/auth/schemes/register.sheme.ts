import { z } from "zod";

export const RegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Firstname must be at least 2 characters")
      .max(50, "Firstname must be no more than 50 characters")
      .regex(/^[A-Za-zА-Яа-яЇїІіЄєҐґ]+$/, "Firstname cannot contain numbers"),

    lastName: z
      .string()
      .min(2, "Lastname must be at least 2 characters")
      .max(50, "Lastname must be no more than 50 characters")
      .regex(/^[A-Za-zА-Яа-яЇїІіЄєҐґ]+$/, "Lastname cannot contain numbers"),

    email: z.string()
      .refine(val => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Invalid email address",
    }),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

  export type TypeRegisterSchema = z.infer<typeof RegisterSchema>;