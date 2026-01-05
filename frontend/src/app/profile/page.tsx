
import { LoginForm } from '@/feature/auth/components/login/LoginForm';
import ProfileMenu from '@/feature/profile/components/ProfileMenu';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Profile',
};

const ProfilePage: React.FC = () => {
    return (
        <div>
            <ProfileMenu/>
        </div>
    );
};

export default ProfilePage;