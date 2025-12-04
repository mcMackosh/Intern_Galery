import { UserRole } from 'prisma/__generated__';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
