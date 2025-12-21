'use client'

import { useForm } from 'react-hook-form'
import { UserRole } from '@/types/membership'
import { useAddUser } from '@/feature/membership/hooks/useAddUser'
import Button from '@/shared/ui/Buton'
import { Input } from '@/shared/ui/Input'

interface AddUserFormData {
  userId: string
  role: UserRole
}

export function AddMemberForm() {
  const addUser = useAddUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormData>({
    defaultValues: { userId: '', role: UserRole.REGULAR },
  })

  const onSubmit = (data: AddUserFormData) => {
    if (!data.userId) return
    addUser.mutate(data, { onSuccess: () => reset() })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">Add new user</label>
      <Input
        id='userId'
        type="text"
        {...register('userId', { required: true })}
        placeholder="Enter user ID..."
        className={`px-4 py-2 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-blue-400 ${
          errors.userId ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.userId && (
        <p className="text-xs text-red-500 font-medium">User ID is required</p>
      )}

      <select
        {...register('role')}
        className="px-4 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        {Object.values(UserRole).map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add user'}
      </Button>
    </form>
  )
}
