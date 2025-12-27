import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProfileService } from 'src/profile/profile.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const profileServiceMock = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const redisServiceMock = {
    setRefreshToken: jest.fn(),
    getRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
    logoutByToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: RedisService, useValue: redisServiceMock },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('login', () => {
    const loginDto = { email: 'test@mail.com', password: '123456' };

    it('should login successfully', async () => {
      const user = { id: '1', email: loginDto.email, password: 'hashed' };

      profileServiceMock.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(profileServiceMock.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(redisServiceMock.setRefreshToken).toHaveBeenCalledWith(
        user.id,
        'refresh-token',
      );

      expect(result).toEqual({
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      profileServiceMock.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if password is missing', async () => {
      profileServiceMock.findByEmail.mockResolvedValue({ id: '1' });

      await expect(service.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      profileServiceMock.findByEmail.mockResolvedValue({
        id: '1',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    const registerDto = {
      firstName: 'test',
      lastName: 'test',
      email: 'new@mail.com',
      password: '123456',
    };

    it('should register and return tokens', async () => {
      const user = { id: '1', email: registerDto.email };

      profileServiceMock.create.mockResolvedValue(user);
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.register(registerDto);

      expect(profileServiceMock.create).toHaveBeenCalledWith(registerDto);
      expect(redisServiceMock.setRefreshToken).toHaveBeenCalledWith(
        user.id,
        'refresh-token',
      );

      expect(result).toEqual({
        user,
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });
  });

  describe('refreshTokens', () => {
    const token = 'refresh-token';

    it('should throw if jwt invalid', async () => {
      jwtServiceMock.verifyAsync.mockRejectedValue(new Error());

      await expect(service.refreshTokens(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if token not found in redis', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({ userId: '1' });
      redisServiceMock.getRefreshToken.mockResolvedValue(null);

      await expect(service.refreshTokens(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if user not found after refresh', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({ userId: '1' });
      redisServiceMock.getRefreshToken.mockResolvedValue(token);
      profileServiceMock.findById.mockResolvedValue(null);

      await expect(service.refreshTokens(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should refresh tokens successfully', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({ userId: '1' });
      redisServiceMock.getRefreshToken.mockResolvedValue(token);
      profileServiceMock.findById.mockResolvedValue({ id: '1' });
      jwtServiceMock.signAsync
        .mockResolvedValueOnce('new-access')
        .mockResolvedValueOnce('new-refresh');

      const result = await service.refreshTokens(token);

      expect(redisServiceMock.setRefreshToken).toHaveBeenCalledWith(
        '1',
        'new-refresh',
      );

      expect(result).toEqual({
        user: { id: '1' },
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      redisServiceMock.removeRefreshToken.mockResolvedValue(true);

      const result = await service.logout('1');

      expect(redisServiceMock.removeRefreshToken).toHaveBeenCalledWith('1');
      expect(result).toEqual({ success: true });
    });

    it('should throw if session invalid', async () => {
      redisServiceMock.removeRefreshToken.mockResolvedValue(false);

      await expect(service.logout('1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logoutByToken', () => {
    it('should logout by token', async () => {
      await service.logoutByToken('token');

      expect(redisServiceMock.logoutByToken).toHaveBeenCalledWith('token');
    });
  });
});
