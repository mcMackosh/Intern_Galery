import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/profile.dto';
export declare class ProfileService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findById(id: string): Promise<{
        email: string;
        id: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        password: string;
        id: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(firstname: string, lastname: string, email: string, password: string): Promise<{
        email: string;
        id: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProfileDto): Promise<{
        email: string;
        id: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
