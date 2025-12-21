import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProfileService } from 'src/profile/profile.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.profileService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.generateToken('ACCESS', user.id);
    const refreshToken = await this.generateToken('REFRESH', user.id);

    await this.redisService.setRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const user = await this.profileService.create(dto);

    const accessToken = await this.generateToken('ACCESS', user.id);
    const refreshToken = await this.generateToken('REFRESH', user.id);

    await this.redisService.setRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    let payload: { userId: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const savedToken = await this.redisService.getRefreshToken(payload.userId);

    if (!savedToken || savedToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.generateToken('ACCESS', payload.userId);
    const newRefreshToken = await this.generateToken('REFRESH', payload.userId);

    await this.redisService.setRefreshToken(payload.userId, newRefreshToken);

    const user = await this.profileService.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { user, accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    const deleted = await this.redisService.removeRefreshToken(userId);

    if (!deleted) {
      throw new UnauthorizedException('Invalid session');
    }

    return { success: true };
  }

  async logoutByToken(refreshToken: string) {
    await this.redisService.logoutByToken(refreshToken);
    return { success: true };
  }

  private generateToken(
    type: 'ACCESS' | 'REFRESH',
    userId: string,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { userId },
      {
        secret:
          type === 'ACCESS'
            ? this.configService.get<string>('JWT_ACCESS_SECRET')
            : this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: type === 'ACCESS' ? '25m' : '2d',
      },
    );
  }
}
