'use client'

import { IUserMembership, UserRole } from '@/types/membership'
import { useMyProfile } from '@/feature/profile/hooks/useMyProfile'
import { useChangeRole } from '@/feature/membership/hooks/useChangeRole'
import { useDeleteUser } from '@/feature/membership/hooks/useDeleteUser'
import Button from '@/shared/ui/Buton'


interface MembersTableProps {
  members: IUserMembership[]
  isLoading: boolean
}

export function MembersTable({ members, isLoading }: MembersTableProps) {
  const changeRole = useChangeRole()
  const deleteUser = useDeleteUser()

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading members...</p>
  }

  return (
    <table className="w-full min-w-[600px] text-left border-collapse">
      <thead className="bg-gray-50">
        <tr>
          {['User ID', 'Name', 'Role', 'Actions'].map((title) => (
            <th key={title} className="px-4 py-3 text-gray-700 font-semibold text-sm">
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {members.map((m) => {
          return (
            <tr
              key={m.id}
              className={`border-t hover:bg-gray-50 transition`}
            >
              <td className="px-4 py-2 text-sm font-medium text-gray-800">{m.id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{`${m.firstName} ${m.lastName}`}</td>
              <td className="px-4 py-2">
                <select
                  value={m.role}
                  onChange={(e) =>
                    changeRole.mutate({ userId: m.id, role: e.target.value as UserRole })
                  }
                  className="px-2 py-1 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {Object.values(UserRole).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                <Button
                  variant="danger"
                  onClick={() => deleteUser.mutate(m.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
