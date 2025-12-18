'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOneGallery } from '@/feature/gallery/hooks/useOneGallery';
import { UserRole } from '@/types/membership';

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children }) => {
  const router = useRouter();
  const { gallery, isLoading } = useOneGallery();

  useEffect(() => {

    if (!isLoading && gallery && !roles.includes(gallery.role)) {
      router.back();
    }
  }, [isLoading, gallery, roles, router]);

  if (isLoading || !gallery) {
    return <div>Loading...</div>;
  }

  if (!roles.includes(gallery.role)) {
    return null;
  }

  return <>{children}</>;
};
