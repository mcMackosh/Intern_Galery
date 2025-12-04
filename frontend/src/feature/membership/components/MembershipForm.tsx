'use client'

import { useMemberships } from '@/feature/membership/hooks/useMemberships'
import { MembersTable } from './MembersTable'
import { AddMemberForm } from './AddMemberForm'

export function MembershipForm() {
  const { data: members = [], isLoading } = useMemberships()

  return (
    <div className="flex flex-col gap-6 p-6">
      <MembersTable members={members} isLoading={isLoading} />
      <AddMemberForm />
    </div>
  )
}

export default MembershipForm
