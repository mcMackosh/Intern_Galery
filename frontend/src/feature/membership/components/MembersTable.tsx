'use client'

import { IUserMembership, UserRole } from '@/types/membership'
import { useChangeRole } from '@/feature/membership/hooks/useChangeRole'
import { useDeleteUser } from '@/feature/membership/hooks/useDeleteUser'
import { Trash } from "lucide-react";

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
    <table className="w-full min-w-[750px] border-collapse rounded-xl overflow-hidden">
      <thead>
        <tr className="bg-gray-100 text-gray-700">
          {["User ID", "Name", "Email", "Role", "Actions"].map((title) => (
            <th
              key={title}
              className="px-5 py-3 font-semibold text-sm border-b border-gray-200 text-left"
            >
              {title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {members.map((m) => (
          <tr
            key={m.id}
            className="hover:bg-gray-50 transition border-b last:border-0"
          >
            <td className="px-5 py-3 text-sm font-medium text-gray-900 align-middle">
              {m.id}
            </td>

            <td className="px-5 py-3 text-sm text-gray-700 align-middle">
              {m.firstName} {m.lastName}
            </td>

            <td className="px-5 py-3 text-sm text-gray-700 align-middle">
              {m.email}
            </td>

            <td className="px-5 py-3 align-middle">
              <select
                value={m.role}
                onChange={(e) =>
                  changeRole.mutate({ userId: m.id, role: e.target.value as UserRole })
                }
                className="
                  px-3 py-1.5 
                  rounded-lg
                  border border-gray-300
                  text-sm
                  bg-white
                  focus:ring-2 focus:ring-blue-400
                  outline-none
                  transition
                "
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </td>

            <td className="px-5 py-3 text-sm text-gray-700 align-middle">
              <Trash
                onClick={() => deleteUser.mutate(m.id)}
                className="
                  h-5 w-5
                  cursor-pointer 
                  text-gray-400 
                  hover:text-red-600 
                  transition
                  inline-block
                "
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}