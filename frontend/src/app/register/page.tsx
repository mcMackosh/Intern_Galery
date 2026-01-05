
import { RegisterForm } from '@/feature/auth/components/register/RegisterForm';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Register',
};

const RegisterPage: React.FC = () => {
    return (
        <RegisterForm></RegisterForm>
    );  
};

export default RegisterPage;