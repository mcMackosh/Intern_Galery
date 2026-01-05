import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ProfileDto, ResetPasswordDto } from './dto/profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Authorization } from 'src/auth/decorators/auth.decorator';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
	constructor(private readonly userService: ProfileService) { }

	@HttpCode(HttpStatus.OK)
	@Authorization()
	@Get()
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: Object })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiBearerAuth()
	public async findProfile(@Authorized('userId') userId: string) {
		return this.userService.findById(userId)
	}

	@HttpCode(HttpStatus.OK)
	@Patch()
	@Authorization()
	@ApiOperation({ summary: 'Update current user profile' })
	@ApiResponse({ status: 200, description: 'Profile updated successfully', type: Object })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiBearerAuth()
	public async updateProfile(
		@Authorized('userId') userId: string,
		@Body() dto: ProfileDto
	) {
		return this.userService.updateProfile(userId, dto)
	}

	@HttpCode(HttpStatus.OK)
	@Patch('change-password-by_token')
	@Authorization()
	@ApiOperation({ summary: 'Change current user password' })
	@ApiResponse({ status: 200, description: 'Password updated successfully', type: Object })
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiBearerAuth()
	public async resetPasswordByToken(
		@Authorized('userId') userId: string,
		@Body() dto: ResetPasswordDto,
	) {
		const { oldPassword, newPassword } = dto;
		return this.userService.resetPasswordByUserId(userId, oldPassword, newPassword);
	}
}
