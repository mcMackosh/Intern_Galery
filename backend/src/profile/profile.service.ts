import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserSafeSelectType, userSafeSelect } from './profile.select';
import { ProfileDto } from './dto/profile.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from '../../prisma/__generated__/client';

@Injectable()
export class ProfileService {
	public constructor(private readonly prismaService: PrismaService) { }

	public async findById(id: string) {
		let user: UserSafeSelectType | null;
		try {
			user = await this.prismaService.user.findUnique({
				where: { id },
				select: userSafeSelect,
			});
		} catch {
			throw new InternalServerErrorException(
				'Error while finding user by ID',
			);
		}

		if (!user) {
			throw new NotFoundException('User not found. Please, check entered data.')
		}

		return user
	}

	public async findByEmail(email: string) {
		try {
			return await this.prismaService.user.findUnique({
				where: { email },
			});
		} catch {
			throw new InternalServerErrorException(
				'Error while finding user by email',
			);
		}
	}

	public async create(dto: RegisterDto) {
		try {
			return await this.prismaService.user.create({
				data: {
					...dto,
					password: await bcrypt.hash(dto.password, 10)
				} as User,
				select: userSafeSelect,
			});
		} catch (err) {

			if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
				throw new ConflictException(
					'User with wthis email already exists. Please, try to login or use another email.')
			}

			throw new InternalServerErrorException(
				'Error while creating user',
			);
		}
	}

	public async update(id: string, dto: ProfileDto) {
		const user = await this.findById(id);

		if (dto.email && dto.email !== user.email) {
			let existing;
			try {
				existing = await this.findByEmail(dto.email);
			} catch {
				throw new InternalServerErrorException('Error while validating email');
			}

			if (existing) throw new ConflictException('Email already in use');
		}

		let dataToUpdate = { ...dto };
		if (dto.password) {
			const saltRounds = 10;
			const hashedPassword = await bcrypt.hash(dto.password, saltRounds);
			dataToUpdate.password = hashedPassword;
		}

		let updatedUser: UserSafeSelectType | null;

		try {
			updatedUser = await this.prismaService.user.update({
				where: { id },
				data: dataToUpdate,
				select: userSafeSelect,
			});
		} catch {
			throw new InternalServerErrorException('Error while updating user');
		}

		return updatedUser;
	}
}