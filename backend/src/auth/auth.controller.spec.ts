import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as cookieHelper from './cookie.helper';
import { Response } from 'express';

jest.mock('./guard/auth.guard', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: () => true,
  })),
}));

jest.mock('./cookie.helper', () => ({
  setRefreshTokenCookie: jest.fn(),
  clearRefreshTokenCookie: jest.fn(),
  getRefreshTokenFromRequest: jest.fn(),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let res: Partial<Response>;
  let req: { cookies: Record<string, string> };

  const userData = {
    id: '1',
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed', // обов'язково для типу AuthService
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const authResponse = {
    user: userData,
    accessToken: 'access',
    refreshToken: 'refresh',
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refreshTokens: jest.fn(),
            logoutByToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    res = { cookie: jest.fn(), clearCookie: jest.fn() };
    req = { cookies: {} };
  });

  describe('register', () => {
    it('should register user and set refresh token cookie', async () => {
      const dto = { firstName: 'firstname', lastName: 'lastname', email: 'test@test.com', password: '123456' };
      authService.register.mockResolvedValue(authResponse);

      const result = await controller.register(dto, res as Response);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(cookieHelper.setRefreshTokenCookie).toHaveBeenCalledWith(res, 'refresh');
      expect(result).toEqual({ accessToken: 'access' });
    });
  });

  describe('login', () => {
    it('should login user and set refresh token cookie', async () => {
      const dto = { email: 'test@test.com', password: '123456' };
      authService.login.mockResolvedValue(authResponse);

      const result = await controller.login(dto, res as Response);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(cookieHelper.setRefreshTokenCookie).toHaveBeenCalledWith(res, 'refresh');
      expect(result).toEqual({ accessToken: 'access' });
    });
  });

  describe('logout', () => {
    it('should logout user and clear refresh token if success', async () => {
      authService.logout.mockResolvedValue({ success: true });

      await controller.logout('user-id', res as Response);

      expect(authService.logout).toHaveBeenCalledWith('user-id');
      expect(cookieHelper.clearRefreshTokenCookie).toHaveBeenCalledWith(res);
    });

    it('should logout user and not clear cookie if success is false', async () => {
      authService.logout.mockResolvedValue({ success: false });

      await controller.logout('user-id', res as Response);

      expect(authService.logout).toHaveBeenCalledWith('user-id');
      expect(cookieHelper.clearRefreshTokenCookie).not.toHaveBeenCalled();
    });

    it('should throw if logout throws', async () => {
      authService.logout.mockRejectedValue(new Error('fail'));

      await expect(controller.logout('user-id', res as Response)).rejects.toThrow();
    });
  });

  describe('refresh', () => {
    it('should refresh tokens and set new refresh token if provided', async () => {
      req.cookies['refresh_token'] = 'old-token';
      (cookieHelper.getRefreshTokenFromRequest as jest.Mock).mockReturnValue('old-token');
      authService.refreshTokens.mockResolvedValue({
        user: userData,
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });

      const result = await controller.refresh(req, res as Response);

      expect(cookieHelper.getRefreshTokenFromRequest).toHaveBeenCalledWith(req);
      expect(authService.refreshTokens).toHaveBeenCalledWith('old-token');
      expect(cookieHelper.setRefreshTokenCookie).toHaveBeenCalledWith(res, 'new-refresh');
      expect(result).toEqual({ accessToken: 'new-access' });
    });

    it('should logout and clear cookie if refresh fails', async () => {
      req.cookies['refresh_token'] = 'old-token';
      (cookieHelper.getRefreshTokenFromRequest as jest.Mock).mockReturnValue('old-token');
      authService.refreshTokens.mockRejectedValue(new Error('invalid'));
      authService.logoutByToken.mockResolvedValue({ success: true });

      await expect(controller.refresh(req, res as Response)).rejects.toThrow(UnauthorizedException);

      expect(authService.refreshTokens).toHaveBeenCalledWith('old-token');
      expect(authService.logoutByToken).toHaveBeenCalledWith('old-token');
      expect(cookieHelper.clearRefreshTokenCookie).toHaveBeenCalledWith(res);
      expect(cookieHelper.setRefreshTokenCookie).not.toHaveBeenCalled();
    });
  });
});
