import { Prisma } from "prisma/__generated__";

export const userSafeSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

export type UserSafeSelectType = Prisma.UserGetPayload<{
  select: typeof userSafeSelect;
}>;