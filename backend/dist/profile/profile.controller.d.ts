import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/profile.dto';
export declare class ProfileController {
    private readonly userService;
    constructor(userService: ProfileService);
    findProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
