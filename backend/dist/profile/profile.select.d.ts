import { Prisma } from "prisma/__generated__";
export declare const userSafeSelect: {
    id: boolean;
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    createdAt: boolean;
    updatedAt: boolean;
};
export type UserSafeSelectType = Prisma.UserGetPayload<{
    select: typeof userSafeSelect;
}>;
