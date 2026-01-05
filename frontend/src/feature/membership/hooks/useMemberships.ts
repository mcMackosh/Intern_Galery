'use client'

import { useQuery } from '@tanstack/react-query'
import { membershipService } from '../../../servises/membership.service'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { toastMessage } from '@/shared/utils/tost'

export function useMemberships() {
  const params = useParams();
  const spaceId = params?.galleryId as string | undefined;

  const query = useQuery({
    queryKey: ["memberships", spaceId],
    queryFn: () => membershipService.getAll(spaceId as string),
  });


  useEffect(() => {
    if (query.isError) {
      toastMessage((query.error as Error));
    }
  }, [query.isError, query.error]);

  return query;
}

