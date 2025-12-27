import AuthServices from './auth.servise';
import api from '../shared/lib/api/api-interceptor';
import { saveAccessToken, removeAccessToken } from '@/shared/lib/token/token-helper';
import type { TypeRegisterSchema, TypeLoginScheme } from '@/feature/auth/schemes';
import type { AuthResponse } from '../types/auth';

jest.mock('../shared/lib/api/api-interceptor');
jest.mock('@/shared/lib/token/token-helper');

describe('AuthServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call api.post and saveAccessToken on register', async () => {
    const mockData: AuthResponse = { accessToken: 'token123' };
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const registerData: TypeRegisterSchema = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    };

    const result = await AuthServices.register(registerData);

    expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
    expect(saveAccessToken).toHaveBeenCalledWith('token123');
    expect(result.accessToken).toBe('token123');
  });

  it('should throw error if register fails', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    const registerData: TypeRegisterSchema = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
    };

    await expect(AuthServices.register(registerData)).rejects.toThrow('Network error');
    expect(saveAccessToken).not.toHaveBeenCalled();
  });

  it('should call api.post and saveAccessToken on login', async () => {
    const mockData: AuthResponse = { accessToken: 'token123' };
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const loginData: TypeLoginScheme = {
      email: 'john@example.com',
      password: 'Password1',
    };

    const result = await AuthServices.login(loginData);

    expect(api.post).toHaveBeenCalledWith('/auth/login', loginData);
    expect(saveAccessToken).toHaveBeenCalledWith('token123');
    expect(result.accessToken).toBe('token123');
  });

  it('should throw error if login fails', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    const loginData: TypeLoginScheme = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    await expect(AuthServices.login(loginData)).rejects.toThrow('Invalid credentials');
    expect(saveAccessToken).not.toHaveBeenCalled();
  });

  it('should call api.post and removeAccessToken on logout', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: null });

    await AuthServices.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
    expect(removeAccessToken).toHaveBeenCalled();
  });

  it('should call api.post and return accessToken on refreshTokens', async () => {
    const mockData = { accessToken: 'token123' };
    (api.post as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await AuthServices.refreshTokens();

    expect(api.post).toHaveBeenCalledWith('/auth/refresh');
    expect(result.accessToken).toBe('token123');
  });
});
