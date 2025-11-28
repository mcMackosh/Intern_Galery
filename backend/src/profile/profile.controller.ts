import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UpdateProfileDto } from './dto/profile.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('profile')
export class ProfileController {
	constructor(private readonly userService: ProfileService) { }

	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@Get()
	@ApiOperation({ summary: 'Get current user profile' })
  	@ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: Object })
  	@ApiResponse({ status: 401, description: 'Unauthorized' })
  	@ApiBearerAuth()
	public async findProfile(@Authorized('userId') userId: string) {
		return this.userService.findById(userId)
	}

	@HttpCode(HttpStatus.OK)
	@Put()
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: 'Update current user profile' })
  	@ApiResponse({ status: 200, description: 'Profile updated successfully', type: Object })
  	@ApiResponse({ status: 400, description: 'Bad Request' })
  	@ApiResponse({ status: 401, description: 'Unauthorized' })
  	@ApiBearerAuth()
	public async updateProfile(
		@Authorized('userId') userId: string,
		@Body() dto: UpdateProfileDto
	) {
		console.log(dto)
		return this.userService.update(userId, dto)
	}
}
