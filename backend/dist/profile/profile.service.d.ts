import { PrismaService } from 'src/prisma/prisma.service';
import { UserSafeSelectType } from './profile.select';
import { ProfileDto } from './dto/profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from '../../prisma/__generated__/client';
export declare class ProfileService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findById(id: string): Promise<UserSafeSelectType>;
    findByEmail(email: string): Promise<User | null>;
    create(dto: RegisterDto): Promise<UserSafeSelectType>;
    updateProfile(id: string, dto: ProfileDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private resetPassword;
    resetPasswordByUserId(id: string, oldPassword: string, newPassword: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
