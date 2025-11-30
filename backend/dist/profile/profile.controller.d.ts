import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
export declare class ProfileController {
    private readonly userService;
    constructor(userService: ProfileService);
    findProfile(userId: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: ProfileDto): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
