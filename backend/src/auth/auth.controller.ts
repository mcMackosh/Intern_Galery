import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { Authorized } from './decorators/authorized.decorator';
import { AuthGuard } from './guard/auth.guard';

import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';
import { setRefreshTokenCookie, clearRefreshTokenCookie, getRefreshTokenFromRequest } from './cookie.helper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 200, description: 'User successfully registered', type: Object })
	@ApiResponse({ status: 400, description: 'Bad request' })
	public async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.register(dto);
		setRefreshTokenCookie(res, refreshToken, 10 * 60 * 1000);
		return { accessToken };
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Login a user' })
	@ApiResponse({ status: 200, description: 'User successfully logged in', type: Object })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	public async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken } = await this.authService.login(dto);
		setRefreshTokenCookie(res, refreshToken, 10 * 60 * 1000);
		return { accessToken };
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: 'Logout user and clear refresh token' })
	@ApiResponse({ status: 200, description: 'User successfully logged out' })
	@ApiBearerAuth()
	public async logout(@Authorized('userId') userId: string, @Res({ passthrough: true }) res: Response) {
		const info = await this.authService.logout(userId);
		if (info) clearRefreshTokenCookie(res);
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Refresh access token using refresh token' })
	@ApiResponse({ status: 200, description: 'New access token generated', type: Object })
	@ApiResponse({ status: 401, description: 'Refresh token expired or invalid' })
	@ApiCookieAuth('refresh_token')
	async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
		const refreshToken = getRefreshTokenFromRequest(req);
		try {
			const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(refreshToken);

			if (newRefreshToken) setRefreshTokenCookie(res, newRefreshToken);

			return { accessToken };
		} catch (err) {
			await this.authService.logoutByToken(refreshToken);
			clearRefreshTokenCookie(res);
			throw new UnauthorizedException(err.message);
		}
	}
}
