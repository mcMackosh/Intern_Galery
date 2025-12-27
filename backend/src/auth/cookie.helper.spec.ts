import type { Response } from 'express';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
} from './cookie.helper';

describe('cookie.helper', () => {
  let resMock: jest.Mocked<Response>;

  beforeEach(() => {
    resMock = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    } as any;
  });

  describe('setRefreshTokenCookie', () => {
    it('should set refresh token cookie with correct options', () => {
      const token = 'refresh-token';

      setRefreshTokenCookie(resMock, token);

      expect(resMock.cookie).toHaveBeenCalledTimes(1);
      expect(resMock.cookie).toHaveBeenCalledWith(
        'refresh_token',
        token,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
          expires: expect.any(Date),
        }),
      );
    });
  });

  describe('clearRefreshTokenCookie', () => {
    it('should clear refresh token cookie with correct options', () => {
      clearRefreshTokenCookie(resMock);

      expect(resMock.clearCookie).toHaveBeenCalledTimes(1);
      expect(resMock.clearCookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'strict',
        }),
      );
    });
  });

  describe('getRefreshTokenFromRequest', () => {
    it('should return refresh token from request cookies', () => {
      const reqMock = {
        cookies: {
          refresh_token: 'token-from-cookie',
        },
      };

      const result = getRefreshTokenFromRequest(reqMock);

      expect(result).toBe('token-from-cookie');
    });
  });
});
