import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProfileService } from 'src/profile/profile.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
export declare class AuthService {
    private readonly profileService;
    private readonly jwtService;
    private readonly configService;
    private readonly redisService;
    constructor(profileService: ProfileService, jwtService: JwtService, configService: ConfigService, redisService: RedisService);
    login(dto: LoginDto): Promise<{
        user: {
            email: string;
            password: string;
            id: string;
            firstname: string;
            lastname: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    register(dto: RegisterDto): Promise<{
        user: {
            email: string;
            id: string;
            firstname: string;
            lastname: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    generateToken(type: 'ACCESS' | 'REFRESH', userId: String): Promise<string>;
    refreshTokens(token: string): Promise<{
        user: {
            email: string;
            id: string;
            firstname: string;
            lastname: string;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<number>;
    logoutByToken(token: string): Promise<void>;
}
