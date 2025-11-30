import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProfileService } from 'src/profile/profile.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'prisma/__generated__';
import { UserSafeSelectType } from 'src/profile/profile.select';

@Injectable()
export class AuthService {

	constructor(
		private readonly profileService: ProfileService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
	) { }


	public async login(dto: LoginDto) {
		const existingUser = await this.profileService.findByEmail(dto.email)

		if (!existingUser || !existingUser.password) {
			throw new NotFoundException(
				'User with this email does not exist. Please, register first or try another email.'
			)
		}

		const isValidPassword = await bcrypt.compare(dto.password, existingUser.password)

		if (!isValidPassword) {
			throw new UnauthorizedException(
				'Password is incorrect. Please, try again or reset your password.'
			)
		}

		const accessToken = await this.generateToken('ACCESS', existingUser.id);
		const refreshToken = await this.generateToken('REFRESH', existingUser.id);

		try {
			await this.redisService.setRefreshToken(existingUser.id, refreshToken);
		} catch {
			throw new InternalServerErrorException('Error while saving refresh token');
		}

		return { user: existingUser, accessToken, refreshToken }
	}

	public async register(dto: RegisterDto) {
		let newUser = await this.profileService.create(dto)

		const accessToken = await this.generateToken('ACCESS', newUser.id)
		const refreshToken = await this.generateToken('REFRESH', newUser.id);

		try {
			await this.redisService.setRefreshToken(newUser.id, refreshToken);
		} catch {
			throw new InternalServerErrorException('Error while saving token');
		}

		return { user: newUser, accessToken, refreshToken }
	}

	async generateToken(type: 'ACCESS' | 'REFRESH', userId: String): Promise<string> {
		const payload = { userId }
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: type === 'ACCESS' ? '10m' : '2d',
		});
	}

	async refreshTokens(token: string) {

		let payload: any;
		try {
			payload = await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_REFRESH_SECRET,
			});
		} catch {
			throw new UnauthorizedException('Invalid refresh token');
		}

		const saved = await this.redisService.getRefreshToken(payload.userId);

		if (!saved || saved !== token) {
			throw new InternalServerErrorException('Token mismatch');
		}

		const accessToken = await this.generateToken('ACCESS', payload.userId)
		const refreshToken = await this.generateToken('REFRESH', payload.userId);

		try {
			await this.redisService.setRefreshToken(payload.userId, refreshToken);
		} catch {
			throw new UnauthorizedException('Error while saving refresh token');
		}

		const newUser = await this.profileService.findById(payload.userId);

		return { user: newUser, accessToken, refreshToken }
	}

	public async logout(userId: string): Promise<number> {
		let deleted = await this.redisService.removeRefreshToken(userId)
		if (deleted == 0) {
			throw new UnauthorizedException('Logout error');
		}
		return deleted
	}

	async logoutByToken(token: string) {
		try {
			await this.redisService.logoutByToken(token);
		} catch {
			throw new InternalServerErrorException('Error while logout');
		}
	}

}
