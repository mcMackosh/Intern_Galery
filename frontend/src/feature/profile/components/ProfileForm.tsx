"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateProfile } from "@/types/profile";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useMyProfile } from "../hooks/useMyProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { ProfileFormData, profileSchema } from "../schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const ProfileForm = () => {
  const { data: profile, isLoading } = useMyProfile();
  const updateMutation = useUpdateProfile();

  const { register, reset, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
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
      reset({
        firstName: profile.firstname,
        lastName: profile.lastname,
        email: profile.email,
        password: "",
        confirmPassword: ""
      });
    }
  }, [profile, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    if (!profile) return;

    updateMutation.mutate({
      firstName: data.firstName || profile.firstname,
      lastName: data.lastName || profile.lastname,
      email: data.email || profile.email,
      password: data.password || undefined
    } as UpdateProfile);
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
      <div>
        <label className="text-gray-700 font-medium">First Name</label>
        <input
          {...register("firstName")}
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        {errors.firstName && <p className="text-red-500 mt-1">{errors.firstName.message}</p>}
      </div>

      <div>
        <label className="text-gray-700 font-medium">Last Name</label>
        <input
          {...register("lastName")}
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        {errors.lastName && <p className="text-red-500 mt-1">{errors.lastName.message}</p>}
      </div>

      <div>
        <label className="text-gray-700 font-medium">Email</label>
        <input
          type="email"
          {...register("email")}
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="text-gray-700 font-medium">Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="text-gray-700 font-medium">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        {errors.confirmPassword && <p className="text-red-500 mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? "Updating..." : "Update Profile"}
      </button>

      {updateMutation.isError && (
        <p className="text-red-500 text-center">Error updating profile</p>
      )}
    </form>
  );
};

export default ProfileForm;