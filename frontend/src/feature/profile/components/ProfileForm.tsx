'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ProfileFormData, profileSchema } from "../schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/ui/Input";
import Button from "@/shared/ui/Buton";
import UserIdCopy from "./UserId";

export const ProfileForm = () => {
  const { data: profile, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const { register, reset, handleSubmit, formState: { errors, dirtyFields } } =
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
      }
    });

  useEffect(() => {
    if (profile) reset(profile);
  }, [profile, reset]);

  const createPartialUpdate = (
    profile: ProfileFormData,
    dirtyFields: Record<string, boolean>
  ) => {
    return Object.fromEntries(
      Object.entries(profile).map(([key, value]) => {
        if (!dirtyFields[key]) return [key, undefined];
        return [key, value === "" ? undefined : value];
      })
    );
  };

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    if (!profile) return;
    const partial = createPartialUpdate(data, dirtyFields);
    updateMutation.mutate(partial);
  };

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <UserIdCopy userId={profile?.id} />

      <Input id="firstName" label="First Name" {...register("firstName")} error={errors.firstName?.message} />
      <Input id="lastName" label="Last Name" {...register("lastName")} error={errors.lastName?.message} />
      <Input id="email" label="Email" type="email" {...register("email")} error={errors.email?.message} />

      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Updating..." : "Update Profile"}
      </Button>

      {updateMutation.isError && (
        <p className="text-red-500 text-center">Error updating profile</p>
      )}
    </form>
  );
};
