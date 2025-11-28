
import { LoginForm } from '@/feature/auth/components/login/LoginForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Login Page',
};

const LoginPage: React.FC = () => {
    return (
        <div>
            <LoginForm></LoginForm>
        </div>
    );
};

export default LoginPage;