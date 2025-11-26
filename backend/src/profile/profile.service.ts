import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { userSafeSelect } from './profile.select';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class ProfileService {
	public constructor(private readonly prismaService: PrismaService) { }

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			select: userSafeSelect
		})

		if (!user) {
			throw new NotFoundException('User not found. Please, check entered data.')
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: { email }
		})
		return user
	}

	public async create(
		firstname: string,
		lastname: string,
		email: string,
		password: string
	) {
		const user = await this.prismaService.user.create({
			data: {
				firstname,
				lastname,
				password: password ? await bcrypt.hash(password, 10) : '',
				email,
			},
			select: userSafeSelect
		})

		return user
	}

	public async update(id: string, dto: UpdateProfileDto) {
		const user = await this.findById(id);

		if (dto.email && dto.email !== user.email) {
			const existing = await this.findByEmail(dto.email);
			if (existing) throw new ConflictException('Email already in use');
		}

		const updateData: any = {};
		if (dto.firstName !== undefined) updateData.firstname = dto.firstName;
		if (dto.lastName !== undefined) updateData.lastname = dto.lastName;
		if (dto.email !== undefined) updateData.email = dto.email;
		if (dto.password !== undefined) {
			updateData.password = await bcrypt.hash(dto.password, 10);
		}

		const updatedUser = await this.prismaService.user.update({
			where: { id },
			data: updateData,
			select: userSafeSelect,
		});

		return updatedUser;
	}
}