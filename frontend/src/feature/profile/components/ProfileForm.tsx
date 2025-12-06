'use client';

import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ProfileFormData, profileSchema } from "../schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Buton";
import UserIdCopy from "./UserId";

const ProfileForm = () => {
  const { data: profile, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const { register, reset, handleSubmit, formState: { errors, dirtyFields } } =
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    });

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  const createPartialUpdate = (
    profile: ProfileFormData,
    dirtyFields: Record<string, boolean>
  ) => {

    const { confirmPassword, ...data } = profile;
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <UserIdCopy userId={profile?.id}/>
      <Input
        label="First Name"
        disabled={updateMutation.isPending}
        {...register("firstName")}
        error={errors.firstName?.message}
      />

      <Input
        label="Last Name"
        disabled={updateMutation.isPending}
        {...register("lastName")}
        error={errors.lastName?.message}
      />

      <Input
        label="Email"
        type="email"
        disabled={updateMutation.isPending}
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        disabled={updateMutation.isPending}
        {...register("password")}
        error={errors.password?.message}
      />

      <Input
        label="Confirm Password"
        type="password"
        disabled={updateMutation.isPending}
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button className="w-full px-5 py-3 flex justify-center items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
        variant="default"
        disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Updating..." : "Update Profile"}
      </Button>

      {updateMutation.isError && (
        <p className="text-red-500 text-center">Error updating profile</p>
      )}
    </form>
  );
};

export default ProfileForm;
