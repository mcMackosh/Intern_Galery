'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { membershipService } from '../../../servises/membership.service'
import { IMembershipRequestUpdate, IUserMembership } from '@/types/membership'
import { useParams } from 'next/navigation'
import { toastMessage } from '@/shared/utils/tost'
import { toast } from 'sonner'

export function useAddUser() {
    const queryClient = useQueryClient()
    const params = useParams()
    const spaceId = params?.galleryId as string | undefined

    return useMutation({
        mutationFn: (req: IMembershipRequestUpdate) =>
            membershipService.createOrUpdate(spaceId as string, req),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['memberships', spaceId] })
        },

        onSuccess: (newMember) => {
            const prev = queryClient.getQueryData<IUserMembership[]>(['memberships', spaceId]) || []
            queryClient.setQueryData<IUserMembership[]>(['memberships', spaceId], [...prev, newMember])
            toast.success('User add successful')
        },

        onError: (err) => {
            toastMessage(err)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['memberships', spaceId] })
        },
    })
}
