'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthWrapper } from "../AuthWraprer";
import { RegisterSchema, TypeRegisterSchema } from "@/feature/auth/schemes";
import { useRegisterMutation } from "../../hooks/useRegisterMutation";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Buton";

export const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<TypeRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
  });

  const { registration, isLoading } = useRegisterMutation();

  const onSubmit: SubmitHandler<TypeRegisterSchema> = (data) => {
    const { confirmPassword, ...payload } = data;
    registration(payload as TypeRegisterSchema);
  };

  return (
    <AuthWrapper
      heading="Create an Account"
      description="Join us today!"
      backButtonLabel="You already have an account. Log in"
      backButtonRef="/login"
    >
      <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="First Name"
          placeholder="Your Name"
          disabled={isLoading}
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          placeholder="Your Last Name"
          disabled={isLoading}
          {...register("lastName")}
          error={errors.lastName?.message}
        />
        <Input
          label="Email"
          type="text"
          placeholder="you@example.com"
          disabled={isLoading}
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="opwefD@1234"
          disabled={isLoading}
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          label="Confirm Password"
          type="password"
          disabled={isLoading}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
        <Button disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</Button>
      </form>
    </AuthWrapper>
  );
};
