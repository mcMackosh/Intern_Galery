import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/profile.dto';
export declare class ProfileController {
    private readonly userService;
    constructor(userService: ProfileService);
    findProfile(userId: string): Promise<{
        email: string;
        id: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        email: string;
        id: string;
        firstname: string;
        lastname: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
