'use client';

import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWraprer";
import { LoginSheme, TypeLoginScheme } from "@/feature/auth/schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Buton";

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<TypeLoginScheme>({
    resolver: zodResolver(LoginSheme),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login, isLoading } = useLoginMutation();

  const onSubmit = (data: TypeLoginScheme) => {
    login(data);
  };

  return (
    <AuthWrapper
      heading="Enter"
      description="Enter your password and email to login"
      backButtonLabel="Haven't an account? Register"
      backButtonRef="/register"
    >
      <form className="w-full max-w-md mx-auto mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
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

        <Button disabled={isLoading}>
          Login
        </Button>
      </form>
    </AuthWrapper>
  );
};
