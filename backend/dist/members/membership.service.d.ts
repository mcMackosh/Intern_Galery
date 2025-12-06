import { UserRole } from 'prisma/__generated__';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class MembershipService {
    private prisma;
    constructor(prisma: PrismaService);
    createOrUpdateMembership(userId: string, galleryId: string, role: UserRole, currentUserRole: UserRole): Promise<{
        userId: string;
        role: import("prisma/__generated__").$Enums.UserRole;
        galleryId: string;
    }>;
    getAllMemberships(galleryId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("prisma/__generated__").$Enums.UserRole;
    }[]>;
    deleteMembership(galleryId: string, userId: string, currentUserRole: UserRole): Promise<boolean>;
}
