import { PropsWithChildren } from "react";

interface AuthWrapperProps {
    heading: string;
    description?: string;
    backButtonLabel?: string;
    backButtonRef?: string;
}

export const AuthWrapper = ({
    children,
    heading,
    description,
    backButtonLabel,
    backButtonRef
}: PropsWithChildren<AuthWrapperProps>) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                
                <h2 className="text-2xl font-bold text-gray-800 text-center">{heading}</h2>
                {description && <p className="text-sm text-gray-500 text-center">{description}</p>}

                <div className="auth-content">
                    {children}
                </div>

                {backButtonLabel && backButtonRef && (
                    <a
                        href={backButtonRef}
                        className="block text-center text-sm text-blue-600 hover:underline mt-4"
                    >
                        {backButtonLabel}
                    </a>
                )}
            </div>
        </div>
    );
};
