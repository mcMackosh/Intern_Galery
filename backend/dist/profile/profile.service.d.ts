import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileDto } from './dto/profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
export declare class ProfileService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findById(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(dto: RegisterDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: ProfileDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
