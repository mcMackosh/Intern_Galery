'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IUserMembership, IMembershipRequestDelete } from '@/types/membership'
import { membershipService } from '@/servises/membership.service'
import { useParams } from 'next/navigation'
import { toastMessage } from '@/shared/utils/tost'
import { toast } from 'sonner'

export function useDeleteUser() {
  const queryClient = useQueryClient()
  const params = useParams()
  const spaceId = params?.galleryId as string | undefined

  return useMutation({
    mutationFn: (userId: string) => membershipService.delete({ userId, spaceId: spaceId as string } as IMembershipRequestDelete),

    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: ['memberships', spaceId] })
      const prev = queryClient.getQueryData<IUserMembership[]>(['memberships', spaceId])

      if (prev) {
        queryClient.setQueryData<IUserMembership[]>(
          ['memberships', spaceId],
          prev.filter((m) => m.id !== userId)
        )
      }

      return { prev }
    },

    onError: (_err, _new, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['memberships', spaceId], context.prev)
      }
      toastMessage(_err)
    },
    onSuccess: () => {
      toast.success('User has been deleted successful')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships', spaceId] })
    },
  })
}
