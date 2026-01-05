'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import {useResetPasswordByToken} from "../hooks/useResetPasswordByToken";
import { Input } from "@/shared/ui/Input";
import Button from "@/shared/ui/Buton";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export const ResetPasswordForm = () => {
  const resetMutation = useResetPasswordByToken();

  const { register, handleSubmit, formState: { errors } } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<PasswordFormData> = (data) => {
    resetMutation.mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input id="oldPassword" label="Old Password" type="password" {...register("oldPassword")} error={errors.oldPassword?.message} />
      <Input id="newPassword" label="New Password" type="password" {...register("newPassword")} error={errors.newPassword?.message} />
      <Input id="confirmPassword" label="Confirm New Password" type="password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />

      <Button type="submit" disabled={resetMutation.isPending}>
        {resetMutation.isPending ? "Updating..." : "Change Password"}
      </Button>

      {resetMutation.isError && (
        <p className="text-red-500 text-center">Error updating password</p>
      )}
    </form>
  );
};
