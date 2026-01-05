import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserSafeSelectType, userSafeSelect } from './profile.select';
import { ProfileDto } from './dto/profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { Prisma, User } from '../../prisma/__generated__/client';

@Injectable()
export class ProfileService {
	constructor(private readonly prismaService: PrismaService) { }

	// ==========================
	// Пошук користувача
	// ==========================
	public async findById(id: string): Promise<UserSafeSelectType> {
		let user: UserSafeSelectType | null;
		try {
			user = await this.prismaService.user.findUnique({
				where: { id },
				select: userSafeSelect,
			});
		} catch {
			throw new InternalServerErrorException('Error while finding user by ID');
		}

		if (!user) {
			throw new NotFoundException(
				'User not found. Please, check entered data.',
			);
		}

		return user;
	}

	public async findByEmail(email: string): Promise<User | null> {
		try {
			return await this.prismaService.user.findUnique({ where: { email } });
		} catch {
			throw new InternalServerErrorException(
				'Error while finding user by email',
			);
		}
	}

	public async create(dto: RegisterDto): Promise<UserSafeSelectType> {
		return await this.prismaService.user.create({
			data: {
				...dto,
				password: await bcrypt.hash(dto.password, 10),
			} as User,
			select: userSafeSelect,
		});
	}

	public async updateProfile(id: string, dto: ProfileDto) {
		const user = await this.findById(id);

		if (dto.email && dto.email !== user.email) {
			const existing = await this.findByEmail(dto.email);
			if (existing) throw new ConflictException('Email already in use');
		}

		const updatedUser = await this.prismaService.user.update({
			where: { id },
			data: dto,
			select: userSafeSelect,
		});

		return updatedUser;
	}

	private async resetPassword(
		user: User,
		oldPassword: string,
		newPassword: string,
	) {

		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) {
			throw new BadRequestException('Old password is incorrect');
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		const updatedUser = await this.prismaService.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
			select: userSafeSelect,
		});

		return updatedUser;
	}

	public async resetPasswordByUserId(
		id: string,
		oldPassword: string,
		newPassword: string,
	) {
		const user = await this.prismaService.user.findUnique({
			where: { id }
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.resetPassword(user, oldPassword, newPassword);
	}
}