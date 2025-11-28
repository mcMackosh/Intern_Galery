'use client';

import { useForm } from "react-hook-form";
import { AuthWrapper } from "../AuthWraprer";
import { RegisterSchema, TypeRegisterSchema } from "@/feature/auth/schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../../hooks/useRegisterMutation";

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

    const onSubmit = (data: TypeRegisterSchema) => {
        const { confirmPassword, ...payload } = data;
        registration(data)
    };

    return (
        <AuthWrapper 
            heading="Create an Account" 
            description="Join us today!" 
            backButtonLabel="You already have an account. Log in" 
            backButtonRef="/login"
        >
            <form className="w-full space-y-5" onSubmit={handleSubmit(onSubmit)}>
                
                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">First Name</label>
                    <input
                        disabled={isLoading}
                        type="text"
                        {...register("firstName")}
                        placeholder="Your Name"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        disabled={isLoading}
                        type="text"
                        {...register("lastName")}
                        placeholder="Your Last Name"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Email</label>
                    <input
                        disabled={isLoading}
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-gray-700">Password</label>
                    <input
                        disabled={isLoading}
                        type="password"
                        {...register("password")}
                        placeholder="opwefD@1234"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
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
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </AuthWrapper>
    );
};
