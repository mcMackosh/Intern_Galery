import { MembershipService } from './membership.service';
import { UserRole } from 'prisma/__generated__';
export declare class MembershipController {
    private membershipService;
    constructor(membershipService: MembershipService);
    findAll(galleryId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import("prisma/__generated__").$Enums.UserRole;
    }[]>;
    createOrUpdate(body: {
        userId: string;
        role?: UserRole;
    }, galleryId: string): Promise<{
        userId: string;
        role: import("prisma/__generated__").$Enums.UserRole;
        galleryId: string;
    }>;
    remove(galleryId: string, userId: string, myuserId: string): Promise<boolean>;
    removeMe(galleryId: string, userId: string): Promise<boolean>;
}
