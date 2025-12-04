'use client'

import { UnsetMarker, useMutation, useQueryClient } from '@tanstack/react-query'
import { membershipService } from '../../../servises/membership.service'
import { IMembershipRequestUpdate, IUserMembership } from '@/types/membership'
import { useParams } from 'next/navigation'
import { toastMessage } from '@/shared/utils/tost'
import { toast } from 'sonner'

export function useChangeRole() {
    const queryClient = useQueryClient()
    const params = useParams()
    const spaceId = params?.galleryId as string | undefined


    return useMutation({
        mutationFn: (req: IMembershipRequestUpdate) =>
            membershipService.createOrUpdate(spaceId as string, req),

        onMutate: async (updatedMember) => {
            await queryClient.cancelQueries({ queryKey: ['memberships', spaceId] })
            const prev = queryClient.getQueryData<IUserMembership[]>(['memberships', spaceId])

            if (prev) {
                queryClient.setQueryData<IUserMembership[]>(
                    ['memberships', spaceId],
                    prev.map((m) =>
                        m.id === updatedMember.userId
                            ? { ...m, role: updatedMember.role }
                            : m
                    )
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
        onSuccess: () =>
        {
            toast.success('User role change successful')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships', spaceId] })
        },
    })
}
