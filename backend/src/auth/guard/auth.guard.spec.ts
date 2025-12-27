import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    configService = {
      getOrThrow: jest.fn().mockReturnValue('secret'),
    };

    guard = new AuthGuard(jwtService as JwtService, configService as ConfigService);
  });

  function mockExecutionContext(authorization?: string): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization },
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it('should allow access if token is valid', async () => {
    const context = mockExecutionContext('Bearer valid-token');
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ userId: '1' });

    const result = await guard.canActivate(context);

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token', { secret: 'secret' });
    expect(result).toBe(true);
  });

  it('should throw UnauthorizedException if no token provided', async () => {
    const context = mockExecutionContext();

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const context = mockExecutionContext('Bearer invalid-token');
    (jwtService.verifyAsync as jest.Mock).mockRejectedValue(new Error('invalid'));

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should ignore header if not Bearer type', async () => {
    const context = mockExecutionContext('Token sometoken');

    await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });

  it('should attach payload to request if token is valid', async () => {
    const payload = { userId: '1' };
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue(payload);
    let attachedRequest: any;
    const context = {
      switchToHttp: () => ({
        getRequest: () => attachedRequest,
      }),
    } as unknown as ExecutionContext;

    attachedRequest = { headers: { authorization: 'Bearer token' } };

    await guard.canActivate(context);

    expect(attachedRequest.user).toEqual(payload);
  });
});
