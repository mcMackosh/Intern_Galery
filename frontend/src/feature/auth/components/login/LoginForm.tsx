'use client';

import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWraprer";
import { LoginSheme, TypeLoginScheme } from "@/feature/auth/schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../../hooks/useLoginMutation";

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
        login(data)
    };

    return (
        <AuthWrapper
            heading="Enter"
            description="Enter your password and email to login"
            backButtonLabel="Haven't an account? Register"
            backButtonRef="/register"
        >
            <form className="w-full max-w-md mx-auto mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-950">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="opwefD@1234"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Login
                </button>
            </form>
        </AuthWrapper>
    );
};
