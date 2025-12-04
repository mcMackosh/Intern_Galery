

import api from '@/shared/lib/api/api-interceptor'
import { IMembershipRequestUpdate,IMembershipRequestDelete, IUserMembership } from '@/types/membership'

export class MembershipService {
  async getAll(spaceId: string): Promise<IUserMembership[]> {
    const { data } = await api.get<IUserMembership[]>(`/gallery/${spaceId}/members`)
    return data
  }

   async createOrUpdate(
    spaceId: string,
    req: IMembershipRequestUpdate
  ): Promise<IUserMembership> {
    const { data } = await api.post<IUserMembership>(
      `/gallery/${spaceId}/members/create-or-update`,
      req
    )
    return data
  }

  async delete(req: IMembershipRequestDelete): Promise<void> {
    await api.delete(`/gallery/${req.spaceId}/members/${req.userId}`)
  }
}

export const membershipService = new MembershipService()
